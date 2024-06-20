import { Wallet } from "@ethersproject/wallet";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { useListenToGlobalMessageStream } from "./useListenToGlobalMessageStream.js";
import { useSendMessage } from "./useSendMessage.js";
import { Message } from "../remote/Message.js";
import { useEffect } from "react";

export const useBrpcServer = <A extends Brpc.BrpcApi>({
  api,
  wallet,
  options,
}: {
  api: A;
  wallet?: Wallet;
  options?: {
    conversationIdPrefix?: string;
    onMessage?: ({ message }: { message: Message }) => void;
    onSelfSentMessage?: ({ message }: { message: Message }) => void;
    onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
    onReceivedInvalidRequest?: ({ message }: { message: Message }) => void;
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
  const listen = useListenToGlobalMessageStream({ wallet });
  const send = useSendMessage({ wallet });

  useEffect(() => {
    if (listen === null) {
      console.log("useBrpcServer :: stream.listen is null");
      return;
    }

    if (send === null) {
      console.log("useBrpcServer :: send is null");
      return;
    }

    if (wallet === undefined) {
      console.log("useBrpcServer :: wallet is undefined");
      return;
    }

    listen(async (message) => {
      console.log("useBrpcServer :: calling stream.listen");

      if (message.conversation.context === undefined) {
        return;
      }

      const prefix = (() => {
        if (options?.conversationIdPrefix) {
          return options.conversationIdPrefix;
        }

        return "banyan.sh/brpc";
      })();

      if (!message.conversation.context.conversationId.startsWith(prefix)) {
        return;
      }

      if (options?.onMessage) {
        try {
          options.onMessage({ message });
        } catch (error) {
          console.warn("onMessage threw an error", error);
        }
      }

      if (message.senderAddress === wallet.address) {
        if (options?.onSelfSentMessage) {
          try {
            options.onSelfSentMessage({ message });
          } catch (error) {
            console.warn("onSelfSentMessage threw an error", error);
          }
        }

        return;
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
        return;
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
        return;
      }

      const reply = async (str: string) => {
        try {
          return await send({
            conversation: {
              peerAddress: message.senderAddress,
              context: {
                conversationId: prefix,
              },
            },
            content: str,
          });
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
          })
        );

        return;
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
            })
          );

          return;
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
            })
          );

          return;
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
            })
          );

          return;
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
            })
          );

          return;
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
    });
  }, [listen, send, wallet]);
};
