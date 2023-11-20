import { z } from "zod";
import { Server } from "../../xmtp/server/Server.js";
import { createClient as xmtpClientCreate } from "../../xmtp/client/createClient.js";
import { responseSchema } from "./responseSchema.js";
import { callSchema } from "./callSchema.js";
import { errorSchema } from "../errorSchema.js";

export const createClient = ({
  usingLocalServer,
  forRemoteServerAddress,
}: {
  usingLocalServer: Server;
  forRemoteServerAddress: string;
}) => {
  const client = xmtpClientCreate({
    usingLocalServer,
    forRemoteServerAddress,
  });
  return async (args: z.infer<typeof callSchema>["arguments"]) => {
    const response = await client({
      name: "acceptChannelInvite",
      arguments: args,
    });
    return responseSchema.or(errorSchema).parse(response.content);
  };
};
