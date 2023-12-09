import { z } from "zod";
import { v4 as uuid } from "uuid";
import { RpcRoute } from "../rpc/RpcRoute.js";
import { rpcResponseSchema } from "../rpc/rpcResponseSchema.js";
import { jsonStringSchema } from "xm-lib/util/jsonStringSchema.js";
import { createStream } from "./createStream.js";
import { sendRequest } from "../rpc/sendRequest.js";
import { Client } from "@xmtp/xmtp-js";
import { createRpcSelector } from "../rpc/createRpcSelector.js";

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
  return async (
    input: z.infer<typeof forRoute.inputSchema>,
  ): Promise<z.infer<typeof forRoute.outputSchema>> => {
    const requestId = uuid();

    if (options?.onSendRequest) {
      options.onSendRequest({
        id: requestId,
        method: forRoute.method,
        params: input,
      });
    }

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
      const response = jsonStringSchema
        .pipe(rpcResponseSchema)
        .safeParse(message.content);

      if (!response.success) {
        // TODO
        continue;
      }

      if (!("result" in response.data)) {
        // TODO
        continue;
      }

      const validatedOutput = forRoute.outputSchema.safeParse(
        response.data.result,
      );

      if (!validatedOutput.success) {
        // TODO
        continue;
      }

      clearTimeout(timeout);
      stream.stop();
      return validatedOutput.data;
    }
  };
};
