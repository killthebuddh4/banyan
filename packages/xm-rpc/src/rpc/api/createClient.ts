import { z } from "zod";
import { Server } from "../../server/Server.js";
import { subscribe } from "../../server/api/subscribe.js";
import { v4 as uuid } from "uuid";
import { RpcRoute } from "../RpcRoute.js";
import { rpcResponseSchema } from "../rpcResponseSchema.js";
import { jsonStringSchema } from "xm-lib/jsonStringSchema.js";
import { withIdSchema } from "../withIdSchema.js";
import { sendRequest } from "../sendRequest.js";

export const createClient = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>({
  usingLocalServer,
  forRoute,
  remoteServerAddress,
  options,
}: {
  usingLocalServer: Server;
  forRoute: RpcRoute<I, O>;
  remoteServerAddress: string;
  options?: {
    timeout?: number;
  };
}) => {
  if (usingLocalServer.stream === null) {
    throw new Error(
      "The local server must be streaming in order to use it as a client",
    );
  }

  return async (
    input: z.infer<typeof forRoute.inputSchema>,
  ): Promise<z.infer<typeof forRoute.outputSchema>> => {
    const requestId = uuid();

    sendRequest({
      usingLocalServer,
      toAddress: remoteServerAddress,
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

    const stream = subscribe({ toServer: usingLocalServer, options });

    for await (const message of stream) {
      if (message.senderAddress !== remoteServerAddress) {
        // TODO
        continue;
      }

      const idFromResponse = jsonStringSchema
        .pipe(withIdSchema)
        .safeParse(message.content);

      if (!idFromResponse.success) {
        // TODO
        continue;
      }

      if (idFromResponse.data.id !== requestId) {
        continue;
      }

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
      return validatedOutput.data;
    }
  };
};
