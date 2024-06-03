import { z } from "zod";
import { rpcRequestSchema } from "../rpc/rpcRequestSchema.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { withIdSchema } from "../rpc/withIdSchema.js";
import { RpcRoute } from "../rpc/RpcRoute.js";
import { sendResponse } from "../rpc/response/sendResponse.js";
import { RpcOptions } from "../rpc/RpcOptions.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { sendError } from "../rpc/errors/sendError.js";
import { errors } from "../rpc/errors/errors.js";
import { RpcError } from "../rpc/errors/RpcError.js";

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

      return sendError({
        toMessage: message,
        requestId: null,
        code: errors.PARSE_ERROR.code,
        message: "Failed to JSON.parse the message.content",
      });
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
        return sendError({
          toMessage: message,
          requestId: null,
          code: errors.INVALID_REQUEST.code,
          message:
            "We could JSON.parse the message, but didn't find an id field.",
        });
      } else {
        return sendError({
          toMessage: message,
          requestId: withId.data.id,
          code: errors.INVALID_REQUEST.code,
          message:
            "We could JSON.parse the request, but the rest of the request was not JSON-RPC-2.0 compliant.",
        });
      }
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

      return sendError({
        toMessage: message,
        requestId: request.data.id,
        code: errors.METHOD_NOT_FOUND.code,
        message: `Method not found: ${request.data.method}`,
      });
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

      return sendError({
        toMessage: message,
        requestId: request.data.id,
        code: errors.INVALID_PARAMS.code,
        message: `Invalid params for method: ${request.data.method}`,
      });
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
            sendResponse({
              toMessage: message,
              result: item,
              options: withOptions,
            });
          }
        } else {
          sendResponse({
            toMessage: message,
            result,
            options: withOptions,
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
        if (error instanceof RpcError) {
          return sendError({
            toMessage: message,
            requestId: request.data.id,
            code: error.code,
            message: error.message,
          });
        } else {
          sendError({
            toMessage: message,
            requestId: request.data.id,
            code: errors.INTERNAL_SERVER_ERROR.code,
            message: `Unexpected error encountered.`,
          });
        }
      }
    }
  };
};
