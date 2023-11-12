import { z } from "zod";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { DescriptiveError } from "../../lib/DescriptiveError.js";
import { signatureSchema } from "../functions/signatureSchema.js";
import { resultSchema } from "../functions/resultSchema.js";
import { impl as acceptChannelInviteImpl } from "../functions/accept-channel-invite/impl.js";
import { impl as createChannelImpl } from "../functions/create-channel/impl.js";
import { impl as declineChannelInviteImpl } from "../functions/decline-channel-invite/impl.js";
import { impl as deleteChannelImpl } from "../functions/delete-channel/impl.js";
import { impl as inviteMemberToChannelImpl } from "../functions/invite-member-to-channel/impl.js";
import { impl as removeMemberFromChannelImpl } from "../functions/remove-member-from-channel/impl.js";

export const execFunctionCall = async ({
  client,
  messages,
  functionCall,
}: {
  client: Client;
  messages: DecodedMessage[];
  functionCall: z.infer<typeof signatureSchema>;
}): Promise<z.infer<typeof resultSchema>> => {
  if (messages.length === 0) {
    throw new Error("No messages to handle inside the user message handler.");
  }

  const lastMessage = messages[messages.length - 1];

  const result = await (async () => {
    try {
      switch (functionCall.name) {
        case "createChannel": {
          return await createChannelImpl({
            ownerAddress: lastMessage.senderAddress,
            name: functionCall.arguments.name,
            description: functionCall.arguments.description,
          });
        }
        case "deleteChannel": {
          return await deleteChannelImpl({
            userDoingTheDeleting: { address: lastMessage.senderAddress },
            channelAddress: functionCall.arguments.channelAddress,
            copilotClient: client,
          });
        }
        case "inviteMemberToChannel": {
          return await inviteMemberToChannelImpl({
            userDoingTheInviting: { address: lastMessage.senderAddress },
            userToInvite: {
              address: functionCall.arguments.memberAddress,
            },
            copilotClient: client,
            channelAddress: functionCall.arguments.channelAddress,
          });
        }
        case "acceptChannelInvite": {
          return await acceptChannelInviteImpl({
            userDoingTheAccepting: { address: lastMessage.senderAddress },
            channelAddress: functionCall.arguments.channelAddress,
            copilotClient: client,
          });
        }
        case "declineChannelInvite": {
          return await declineChannelInviteImpl({
            userDoingTheDeclining: { address: lastMessage.senderAddress },
            channelAddress: functionCall.arguments.channelAddress,
          });
        }
        case "removeMemberFromChannel": {
          return await removeMemberFromChannelImpl({
            userDoingTheRemoving: { address: lastMessage.senderAddress },
            userToRemove: {
              address: functionCall.arguments.memberAddress,
            },
            channelAddress: functionCall.arguments.channelAddress,
            copilotClient: client,
          });
        }
        default:
          throw new Error("Unknown function call");
      }
    } catch (err) {
      console.log("THE FUNCTION CALL ATTEMPT FAILED");
      if (!(err instanceof DescriptiveError)) {
        console.error("UNKNOWN ERROR ENCOUNTERED", err);
        throw err;
      } else {
        return { ok: false, error: err.description };
      }
    }
  })();

  return resultSchema.parse(result);
};
