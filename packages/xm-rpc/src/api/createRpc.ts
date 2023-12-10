import { z } from "zod";
import { v4 as uuid } from "uuid";
import { RpcRoute } from "../rpc/RpcRoute.js";
import { rpcResponseSchema } from "../rpc/response/rpcResponseSchema.js";
import { jsonStringSchema } from "xm-lib/util/jsonStringSchema.js";
import { createStream } from "./createStream.js";
import { sendRequest } from "../rpc/sendRequest.js";
import { Client } from "@xmtp/xmtp-js";
import { createRpcSelector } from "../rpc/createRpcSelector.js";
import { rpcErrorSchema } from "../rpc/errors/rpcErrorSchema.js";

export const createRpc = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>({
  client,
  forRoute,
  server,
  options,
}: {
  client: Client;
  forRoute: RpcRoute<I, O>;
  server: {
    address: string;
  };
  options?: {
    onSendRequest?: ({
      id,
      method,
      params,
    }: {
      id: string;
      method: string;
      params: z.infer<I>;
    }) => void;
    timeout?: number;
  };
}) => {
  return async (input: z.infer<typeof forRoute.inputSchema>) => {
    const requestId = uuid();

    if (options?.onSendRequest) {
      options.onSendRequest({
        id: requestId,
        method: forRoute.method,
        params: input,
      });
    }

    console.log("SENDING REQUEST");

    sendRequest({
      client,
      toAddress: server.address,
      request: {
        id: requestId,
        method: forRoute.method,
        params: input,
      },
    });

    const timeout = setTimeout(
      () => {
        throw new Error("Request timed out");
      },
      options?.timeout || 10000,
    );

    const stream = await createStream({ client });

    const selector = createRpcSelector({
      request: { id: requestId },
      server,
    });

    for await (const message of stream.select({ selector })) {
      const json = jsonStringSchema.parse(message.content);
      const err = rpcErrorSchema.safeParse(json);

      if (err.success) {
        return {
          result: null,
          error: err.data,
        };
      }

      const response = rpcResponseSchema.safeParse(json);

      if (!response.success) {
        throw new Error(
          "We received a message with the correct id, but it was not a valid response",
        );
      }

      const validatedOutput = forRoute.outputSchema.safeParse(
        response.data.result,
      );

      if (!validatedOutput.success) {
        throw new Error(
          "We received a response with the right requestId and a valid generic response format, but the result data type was wrong.",
        );
      }

      clearTimeout(timeout);
      stream.stop();

      return {
        result: validatedOutput.data,
        error: null,
      };
    }
  };
};
