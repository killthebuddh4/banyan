import { z } from "zod";
import { rpcRequestSchema } from "../rpc/rpcRequestSchema.js";
import { jsonStringSchema } from "xm-lib/jsonStringSchema.js";
import { withIdSchema } from "../rpc/withIdSchema.js";
import { RpcRoute } from "../rpc/RpcRoute.js";
import { sendResponse } from "../rpc/sendResponse.js";
import { RpcOptions } from "../rpc/RpcOptions.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";

export const createRouter = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>({
  client,
  routeStore,
  withOptions,
}: {
  client: Client;
  routeStore: Map<string, RpcRoute<I, O>>;
  withOptions?: RpcOptions;
}) => {
  return async ({ message }: { message: DecodedMessage }) => {
    if (withOptions?.useConversationId) {
      const conversationId = message.conversation.context?.conversationId;

      if (conversationId === undefined) {
        return;
      }

      if (!conversationId.startsWith("xmtrpc")) {
        return;
      }
    }

    /* *************************************************************************
     * JSON PARSE
     * ************************************************************************/

    const json = jsonStringSchema.safeParse(message.content);

    if (!json.success) {
      if (withOptions?.onJsonParseError === undefined) {
        // do nothing
      } else {
        withOptions.onJsonParseError();
      }

      // TODO. We can't respond because we don't know the id of the request.
      // Based on my current understanding of json-rpc-2.0, this doesn't make
      // sense, so I think I must be missing something.
      return;
    }

    /* *************************************************************************
     * GENERIC REQUEST PARSE
     * ************************************************************************/

    const request = rpcRequestSchema.safeParse(json.data);

    if (!request.success) {
      if (withOptions?.onRequestParseError === undefined) {
        // do nothing
      } else {
        // TODO. This should always work because json <- JSON.parse, but it
        // still makes me nervous.
        withOptions.onRequestParseError({ json: JSON.stringify(json) });
      }

      const withId = withIdSchema.safeParse(json.data);
      if (!withId.success) {
        // TODO. We can't do anything here either, see above.
      } else {
        sendResponse({
          toMessage: message,
          response: {
            id: withId.data.id,
            error: {
              code: -32600,
              message:
                "The message was not parseable into valid request object.",
              data: {
                label: "bad-request",
                description: "The JSON sent is not a valid Request object.",
              },
            },
          },
        });
      }

      return;
    }

    /* *************************************************************************
     * SELECT THE REQUESTED METHOD
     * ************************************************************************/

    const route = routeStore.get(request.data.method);

    if (route === undefined) {
      if (withOptions?.onMethodNotFound === undefined) {
        // do nothing
      } else {
        withOptions.onMethodNotFound({ attempted: request.data.method });
      }

      sendResponse({
        toMessage: message,
        response: {
          id: request.data.id,
          error: {
            code: -32601,
            message: `Method not found: ${request.data.method}`,
            data: {
              label: "method-not-found",
              description: "The method does not exist / is not available.",
            },
          },
        },
      });

      return;
    }

    /* *************************************************************************
     * PARSE PARAMS ACCORDING TO METHOD
     * ************************************************************************/

    const input = route.inputSchema.safeParse(request.data.params);

    if (!input.success) {
      if (withOptions?.onInvalidParams === undefined) {
        // do nothing
      } else {
        withOptions.onInvalidParams({ method: request.data.method });
      }

      sendResponse({
        toMessage: message,
        response: {
          id: request.data.id,
          error: {
            code: -32602,
            message: "Invalid method parameter(s).",
            data: {
              label: "invalid-params",
              description: "Invalid method parameter(s).",
            },
          },
        },
      });
      // TODO
      return;
    }

    /* *************************************************************************
     * CALL THE METHOD'S HANDLER
     * ************************************************************************/

    try {
      if (withOptions?.onMethodCalled === undefined) {
        // do nothing
      } else {
        withOptions.onMethodCalled({ method: request.data.method });
      }

      const result = await route.handler({
        context: route.createContext({
          client,
          message,
          request: request.data,
        }),
        input: input.data,
      });

      if (request.data.id === undefined) {
        // do nothing, request is a notification
      } else {
        if (route.options?.mode === "stream") {
          // TODO How do we make this actually type safe? How can we check to
          // see if the handler returned an AsyncGenerator?
          const gen = result as AsyncGenerator<O, unknown, unknown>;
          for await (const item of gen) {
            if (withOptions?.onResponse === undefined) {
              // do nothing
            } else {
              withOptions.onResponse({ message });
            }
            sendResponse({
              toMessage: message,
              response: {
                id: request.data.id,
                result: item,
              },
            });
          }
        } else {
          if (withOptions?.onResponse === undefined) {
            // do nothing
          } else {
            withOptions.onResponse({ message });
          }

          // TODO, retries et al.
          sendResponse({
            toMessage: message,
            response: {
              id: request.data.id,
              result,
            },
          });
        }
      }
    } catch (error) {
      /* *************************************************************************
       * SERVER ERROR
       * ************************************************************************/

      if (withOptions?.onServerError === undefined) {
        // do nothing
      } else {
        withOptions.onServerError({ error });
      }

      if (request.data.id === undefined) {
        // do nothing, request is a notification
      } else {
        const errorMessage = (() => {
          if (!(error instanceof Error)) {
            return "unknown error";
          } else {
            return error.message;
          }
        })();

        sendResponse({
          toMessage: message,
          response: {
            id: request.data.id,
            error: {
              code: -32603,
              message: errorMessage,
              data: {
                label: "internal-error",
                description: "The server encountered an unexpected problem.",
              },
            },
          },
        });
      }
    }
  };
};
