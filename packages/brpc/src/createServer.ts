import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import * as Brpc from "./brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";

export const createServer = async <A extends Brpc.BrpcApi>({
  xmtp,
  api,
  options,
}: {
  xmtp: Client;
  api: A;
  options?: {
    onSelfSentMessage?: ({ message }: { message: DecodedMessage }) => void;
    onSkipMessage?: ({ message }: { message: DecodedMessage }) => void;
    onCreateStreamError?: () => void;
    onCreateStreamSuccess?: () => void;
    onHandlerError?: () => void;
    onSendFailed?: () => void;
  };
}) => {
  const stream = await (async () => {
    try {
      return await xmtp.conversations.streamAllMessages();
    } catch (error) {
      if (options?.onCreateStreamError) {
        options.onCreateStreamError();
      }
      throw error;
    }
  })();

  try {
    if (options?.onCreateStreamSuccess) {
      options.onCreateStreamSuccess();
    }
  } catch (error) {
    console.warn("onCreateStreamSuccess threw an error", error);
  }

  (async () => {
    for await (const message of stream) {
      if (message.senderAddress === xmtp.address) {
        continue;
      }

      const json = jsonStringSchema.safeParse(message.content);

      if (!json.success) {
        if (options?.onSkipMessage) {
          try {
            options.onSkipMessage({ message });
          } catch (error) {
            console.warn("onSkipMessage threw an error", error);
          }
        }
        continue;
      }

      const request = Brpc.brpcRequestSchema.safeParse(json.data);

      if (!request.success) {
        if (options?.onSkipMessage) {
          try {
            options.onSkipMessage({ message });
          } catch (error) {
            console.warn("onSkipMessage threw an error", error);
          }
        }
        continue;
      }

      const procedure = api[request.data.name];

      if (procedure === undefined) {
        (async () => {
          try {
            await message.conversation.send(
              JSON.stringify({
                id: request.data.id,
                payload: {
                  ok: false,
                  code: "UNKNOWN_PROCEDURE",
                },
              }),
            );
          } catch (error) {
            if (options?.onSendFailed) {
              try {
                options.onSendFailed();
              } catch (error) {
                console.warn("onSendFailed threw an error", error);
              }
            }
          }
        })();

        continue;
      }

      try {
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

        const context = {
          id: request.data.id,
          message: {
            id: message.id,
            senderAddress: message.senderAddress,
          },
        };

        const isAllowed = await (async () => {
          if (procedure.acl.type === "public") {
            return true;
          } else {
            return await procedure.acl.allow({ context });
          }
        })();

        if (!isAllowed) {
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
          output = await procedure.handler({
            context,
            input: input.data,
          });
        } catch (error) {
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

  return {
    close: async () => {
      await stream.return(null);
    },
  };
};
