import { Wallet } from "@ethersproject/wallet";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import * as Brpc from "./brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";

export const createServer = async <A extends Brpc.BrpcApi>({
  api,
  options,
}: {
  api: A;
  options?: {
    wallet?: Wallet;
    xmtpEnv?: "dev" | "production";
    onMessage?: ({ message }: { message: DecodedMessage }) => void;
    onSelfSentMessage?: ({ message }: { message: DecodedMessage }) => void;
    onReceivedInvalidJson?: ({ message }: { message: DecodedMessage }) => void;
    onReceivedInvalidRequest?: ({
      message,
    }: {
      message: DecodedMessage;
    }) => void;
    onCreateXmtpError?: () => void;
    onCreateStreamError?: () => void;
    onCreateStreamSuccess?: () => void;
    onHandlerError?: () => void;
    onUnknownProcedure?: () => void;
    onAuthError?: () => void;
    onUnauthorized?: () => void;
    onInputTypeMismatch?: () => void;
    onSerializationError?: () => void;
    onHandlingMessage?: () => void;
    onResponseSent?: () => void;
    onSendFailed?: () => void;
  };
}) => {
  const wallet = (() => {
    if (options?.wallet) {
      return options.wallet;
    }

    return Wallet.createRandom();
  })();

  const xmtpEnv = (() => {
    if (options?.xmtpEnv) {
      return options.xmtpEnv;
    }

    return "dev";
  })();

  const xmtp = await (async () => {
    try {
      return await Client.create(wallet, { env: xmtpEnv });
    } catch (error) {
      if (options?.onCreateXmtpError) {
        try {
          options.onCreateXmtpError();
        } catch (error) {
          console.warn("onCreateXmtpError threw an error", error);
        }
      }

      throw error;
    }
  })();

  let stream: AsyncGenerator<DecodedMessage, void, unknown> | null = null;

  const start = async () => {
    if (stream !== null) {
      return;
    }

    try {
      stream = await xmtp.conversations.streamAllMessages();

      try {
        if (options?.onCreateStreamSuccess) {
          options.onCreateStreamSuccess();
        }
      } catch (error) {
        console.warn("onCreateStreamSuccess threw an error", error);
      }

      console.log(
        `Server started, listening for messages on address ${wallet.address}`,
      );

      (async () => {
        for await (const message of stream) {
          if (options?.onMessage) {
            try {
              options.onMessage({ message });
            } catch (error) {
              console.warn("onMessage threw an error", error);
            }
          }

          if (message.senderAddress === xmtp.address) {
            if (options?.onSelfSentMessage) {
              try {
                options.onSelfSentMessage({ message });
              } catch (error) {
                console.warn("onSelfSentMessage threw an error", error);
              }
            }

            continue;
          }

          const json = jsonStringSchema.safeParse(message.content);

          if (!json.success) {
            if (options?.onReceivedInvalidJson) {
              try {
                options.onReceivedInvalidJson({ message });
              } catch (error) {
                console.warn("onReceivedInvalidJson threw an error", error);
              }
            }
            continue;
          }

          const request = Brpc.brpcRequestSchema.safeParse(json.data);

          if (!request.success) {
            if (options?.onReceivedInvalidRequest) {
              try {
                options.onReceivedInvalidRequest({ message });
              } catch (error) {
                console.warn("onReceivedInvalidRequest threw an error", error);
              }
            }
            continue;
          }

          const reply = async (str: string) => {
            try {
              return await message.conversation.send(str);
            } catch (error) {
              if (options?.onSendFailed) {
                try {
                  options.onSendFailed();
                } catch (error) {
                  console.warn("onSendFailed threw an error", error);
                }
              }
            }
          };

          const procedure = api[request.data.name];

          if (procedure === undefined) {
            if (options?.onUnknownProcedure) {
              try {
                options.onUnknownProcedure();
              } catch (error) {
                console.warn("onUnknownProcedure threw an error", error);
              }
            }

            reply(
              JSON.stringify({
                id: request.data.id,
                payload: {
                  ok: false,
                  code: "UNKNOWN_PROCEDURE",
                },
              }),
            );

            continue;
          }

          try {
            const context = {
              id: request.data.id,
              message: {
                id: message.id,
                senderAddress: message.senderAddress,
              },
            };

            let isAuthorized = false;
            try {
              isAuthorized = await procedure.auth({
                context,
              });
            } catch (error) {
              if (options?.onAuthError) {
                try {
                  options.onAuthError();
                } catch (error) {
                  console.warn("onAuthError threw an error", error);
                }
              }
              isAuthorized = false;
            }

            if (!isAuthorized) {
              if (options?.onUnauthorized) {
                try {
                  options.onUnauthorized();
                } catch (error) {
                  console.warn("onUnauthorized threw an error", error);
                }
              }

              reply(
                JSON.stringify({
                  id: request.data.id,
                  payload: {
                    ok: false,
                    code: "UNAUTHORIZED",
                  },
                }),
              );

              continue;
            }

            const input = procedure.input.safeParse(request.data.payload);

            if (!input.success) {
              if (options?.onInputTypeMismatch) {
                try {
                  options.onInputTypeMismatch();
                } catch (error) {
                  console.warn("onInputTypeMismatch threw an error", error);
                }
              }

              reply(
                JSON.stringify({
                  id: request.data.id,
                  payload: {
                    ok: false,
                    code: "INPUT_TYPE_MISMATCH",
                  },
                }),
              );

              continue;
            }

            let output;
            try {
              if (options?.onHandlingMessage) {
                try {
                  options.onHandlingMessage();
                } catch (error) {
                  console.warn("onHandlingMessage threw an error", error);
                }
              }

              output = await procedure.handler(input.data, context);
            } catch (error) {
              if (options?.onHandlerError) {
                try {
                  options.onHandlerError();
                } catch (error) {
                  console.warn("onHandlerError threw an error", error);
                }
              }

              reply(
                JSON.stringify({
                  id: request.data.id,
                  payload: {
                    ok: false,
                    code: "SERVER_ERROR",
                  },
                }),
              );

              continue;
            }

            let response: string;
            try {
              response = JSON.stringify({
                id: request.data.id,
                payload: {
                  ok: true,
                  code: "SUCCESS",
                  data: output,
                },
              });
            } catch (error) {
              if (options?.onSerializationError) {
                try {
                  options.onSerializationError();
                } catch (error) {
                  console.warn("onSerializationError threw an error", error);
                }
              }

              reply(
                JSON.stringify({
                  id: request.data.id,
                  payload: {
                    ok: false,
                    code: "OUTPUT_SERIALIZATION_FAILED",
                  },
                }),
              );

              continue;
            }

            reply(response);
          } catch (err) {
            if (options?.onHandlerError) {
              try {
                options.onHandlerError();
              } catch (error) {
                console.warn("onHandlerError threw an error", error);
              }
            }
          }
        }
      })();
    } catch (error) {
      if (options?.onCreateStreamError) {
        try {
          options.onCreateStreamError();
        } catch (error) {
          console.warn("onCreateStreamError threw an error", error);
        }
      }
      throw error;
    }
  };

  return {
    address: wallet.address,
    start,
    close: async () => {
      if (stream === null) {
        return;
      }

      await stream.return();
    },
  };
};
