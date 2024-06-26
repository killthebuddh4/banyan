import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { Message } from "../remote/Message.js";
import { Actions } from "../remote/Actions.js";

export const createBrpcServer = <A extends Brpc.BrpcApi>(args: {
  api: A;
  listen: (handler: (message: Message) => void) => void;
  address: string;
  sendMessage: Actions["sendMessage"];
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
  args.listen(async (message) => {
    console.log("FIG :: createBrpcServer :: listen got a message");

    if (message.conversation.context === undefined) {
      return;
    }

    const prefix = (() => {
      if (args.options?.conversationIdPrefix) {
        return args.options.conversationIdPrefix;
      }

      return "banyan.sh/brpc";
    })();

    if (!message.conversation.context.conversationId.startsWith(prefix)) {
      return;
    }

    if (args.options?.onMessage) {
      try {
        args.options.onMessage({ message });
      } catch (error) {
        console.warn("onMessage threw an error", error);
      }
    }

    if (message.senderAddress === args.address) {
      if (args.options?.onSelfSentMessage) {
        try {
          args.options.onSelfSentMessage({ message });
        } catch (error) {
          console.warn("onSelfSentMessage threw an error", error);
        }
      }

      return;
    }

    const json = jsonStringSchema.safeParse(message.content);

    if (!json.success) {
      if (args.options?.onReceivedInvalidJson) {
        try {
          args.options.onReceivedInvalidJson({ message });
        } catch (error) {
          console.warn("onReceivedInvalidJson threw an error", error);
        }
      }
      return;
    }

    const request = Brpc.brpcRequestSchema.safeParse(json.data);

    if (!request.success) {
      if (args.options?.onReceivedInvalidRequest) {
        try {
          args.options.onReceivedInvalidRequest({ message });
        } catch (error) {
          console.warn("onReceivedInvalidRequest threw an error", error);
        }
      }
      return;
    }

    const reply = async (str: string) => {
      try {
        return await args.sendMessage({
          conversation: {
            peerAddress: message.senderAddress,
            context: {
              conversationId: prefix,
            },
          },
          content: str,
        });
      } catch (error) {
        if (args.options?.onSendFailed) {
          try {
            args.options.onSendFailed();
          } catch (error) {
            console.warn("onSendFailed threw an error", error);
          }
        }
      }
    };

    const procedure = args.api[request.data.name];

    if (procedure === undefined) {
      if (args.options?.onUnknownProcedure) {
        try {
          args.options.onUnknownProcedure();
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
        if (args.options?.onAuthError) {
          try {
            args.options.onAuthError();
          } catch (error) {
            console.warn("onAuthError threw an error", error);
          }
        }
        isAuthorized = false;
      }

      if (!isAuthorized) {
        if (args.options?.onUnauthorized) {
          try {
            args.options.onUnauthorized();
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
        if (args.options?.onInputTypeMismatch) {
          try {
            args.options.onInputTypeMismatch();
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
        if (args.options?.onHandlingMessage) {
          try {
            args.options.onHandlingMessage();
          } catch (error) {
            console.warn("onHandlingMessage threw an error", error);
          }
        }

        output = await procedure.handler(input.data, context);
      } catch (error) {
        if (args.options?.onHandlerError) {
          try {
            args.options.onHandlerError();
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
        if (args.options?.onSerializationError) {
          try {
            args.options.onSerializationError();
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
      if (args.options?.onHandlerError) {
        try {
          args.options.onHandlerError();
        } catch (error) {
          console.warn("onHandlerError threw an error", error);
        }
      }
    }
  });
};
