import { z } from "zod";
import { v4 as uuid } from "uuid";
import { RpcRoute } from "../rpc/RpcRoute.js";
import { rpcResponseSchema } from "../rpc/rpcResponseSchema.js";
import { jsonStringSchema } from "xm-lib/util/jsonStringSchema.js";
import { sendRequest } from "../rpc/sendRequest.js";
import { createStream } from "./createStream.js";
import { Client } from "@xmtp/xmtp-js";
import { createRpcSelector } from "../rpc/createRpcSelector.js";

export const createRpcStream = <
  I extends z.ZodTypeAny,
  O extends z.ZodTypeAny,
>({
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
    timeout?: number;
  };
}) => {
  return async (
    input: z.infer<typeof forRoute.inputSchema>,
  ): Promise<AsyncGenerator<z.infer<typeof forRoute.outputSchema>>> => {
    const requestId = uuid();

    sendRequest({
      client,
      toAddress: server.address,
      request: {
        id: requestId,
        method: forRoute.method,
        params: input,
      },
    });

    const stream = await createStream({ client });

    const selector = createRpcSelector({
      request: { id: requestId },
      server,
    });

    return (async function* () {
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

        yield validatedOutput.data;
      }
    })();
  };
};
