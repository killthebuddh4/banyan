import { z } from "zod";
import { Server } from "../../xmtp/server/Server.js";
import { create as xmtpClientCreate } from "../../xmtp/client/create.js";
import { responseSchema } from "./responseSchema.js";
import { jsonStringSchema } from "../../lib/jsonStringSchema.js";

export const createClient = ({
  usingLocalServer,
  forRemoteServerAddress,
}: {
  usingLocalServer: Server;
  forRemoteServerAddress: string;
}) => {
  return xmtpClientCreate({
    usingLocalServer,
    forRemoteServerAddress,
    usingResponseSchema: z.object({
      senderAddress: z.literal(forRemoteServerAddress),
      content: jsonStringSchema.pipe(responseSchema),
    }),
  });
};
