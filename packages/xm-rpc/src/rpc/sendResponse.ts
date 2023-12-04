import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { rpcResponseSchema } from "./rpcResponseSchema.js";

export const sendResponse = async ({
  toMessage,
  response,
}: {
  toMessage: DecodedMessage;
  response: z.infer<typeof rpcResponseSchema>;
}) => {
  console.log("SENDING A RESPONSE");
  return toMessage.conversation.send(JSON.stringify(response));
};
