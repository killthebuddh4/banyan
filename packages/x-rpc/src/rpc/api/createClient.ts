import { z } from "zod";
import { Server } from "../../server/Server.js";
import { MessageHandler } from "../../server/MessageHandler.js";
import { subscribe } from "../../server/api/subscribe.js";
import { v4 as uuid } from "uuid";
import { RpcRoute } from "../RpcRoute.js";
import { rpcResponseSchema } from "../rpcResponseSchema.js";
import { jsonStringSchema } from "x-core/lib/jsonStringSchema.js";
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

    let resolver: (output: O) => void;

    let rejecter: (error: Error) => void;

    let unsubscribe: () => void;

    const timeout = setTimeout(
      () => {
        rejecter(new Error("Request timed out"));
      },
      options?.timeout || 10000,
    );

    const promiseToReturn = new Promise<O>((resolve, reject) => {
      resolver = resolve;
      rejecter = reject;
    });

    const handler: MessageHandler = async ({ message }) => {
      if (message.conversation.peerAddress !== remoteServerAddress) {
        // TODO
        return;
      }

      const idFromResponse = jsonStringSchema
        .pipe(withIdSchema)
        .safeParse(message.content);

      if (!idFromResponse.success) {
        // TODO
        return;
      }

      if (idFromResponse.data.id !== requestId) {
        return;
      }

      const response = jsonStringSchema
        .pipe(rpcResponseSchema)
        .safeParse(message.content);

      if (!response.success) {
        // TODO
        return;
      }

      if (!("result" in response.data)) {
        // TODO
        return;
      }

      const validatedOutput = forRoute.outputSchema.safeParse(
        response.data.result,
      );

      if (!validatedOutput.success) {
        // TODO
        return;
      }

      clearTimeout(timeout);
      unsubscribe();
      resolver(validatedOutput.data);
    };

    unsubscribe = subscribe({
      toServer: usingLocalServer,
      subscriber: {
        metadata: {
          id: requestId,
        },
        filter: async () => true,
        handler,
      },
    });

    await sendRequest({
      usingLocalServer,
      toAddress: remoteServerAddress,
      request: {
        id: requestId,
        method: forRoute.method,
        params: input,
      },
    });

    return promiseToReturn;
  };
};
