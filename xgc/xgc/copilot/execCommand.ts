import { z } from "zod";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { DescriptiveError } from "../lib/DescriptiveError.js";
import { callSchema } from "../actions/callSchema.js";
import { responseSchema } from "../actions/responseSchema.js";
import { acceptChannelInvite } from "../actions/accept-channel-invite/acceptChannelInvite.js";
import { createChannel } from "../actions/create-channel/createChannel.js";
import { declineChannelInvite } from "../actions/decline-channel-invite/declineChannelInvite.js";
import { deleteChannel } from "../actions/delete-channel/deleteChannel.js";
import { inviteMemberToChannel } from "../actions/invite-member-to-channel/inviteMemberToChannel.js";
import { removeMemberFromChannel } from "../actions/remove-member-from-channel/removeMemberFromChannel.js";
import { listCreatedChannels } from "../actions/list-created-channels/listCreatedChannels.js";
import { listAvailableCommands } from "../actions/list-available-commands/listAvailableCommands.js";
import { describeChannel } from "../actions/describe-channel/describeChannel.js";

export const execCommand = async ({
  client,
  messages,
  functionCall,
}: {
  client: Client;
  messages: DecodedMessage[];
  functionCall: z.infer<typeof callSchema>;
}): Promise<z.infer<typeof responseSchema>> => {
  if (messages.length === 0) {
    throw new Error("No messages to handle inside the user message handler.");
  }

  const lastMessage = messages[messages.length - 1];

  const result = await (async () => {
    try {
      switch (functionCall.name) {
        case "createChannel": {
          return await createChannel({
            ownerAddress: lastMessage.senderAddress,
            name: functionCall.arguments.name,
            description: functionCall.arguments.description,
          });
        }
        case "deleteChannel": {
          return await deleteChannel({
            userDoingTheDeleting: { address: lastMessage.senderAddress },
            channelAddress: functionCall.arguments.channelAddress,
            copilotClient: client,
          });
        }
        case "inviteMemberToChannel": {
          return await inviteMemberToChannel({
            userDoingTheInviting: { address: lastMessage.senderAddress },
            userToInvite: {
              address: functionCall.arguments.memberAddress,
            },
            copilotClient: client,
            channelAddress: functionCall.arguments.channelAddress,
          });
        }
        case "acceptChannelInvite": {
          return await acceptChannelInvite({
            userDoingTheAccepting: { address: lastMessage.senderAddress },
            channelAddress: functionCall.arguments.channelAddress,
            copilotClient: client,
          });
        }
        case "declineChannelInvite": {
          return await declineChannelInvite({
            userDoingTheDeclining: { address: lastMessage.senderAddress },
            channelAddress: functionCall.arguments.channelAddress,
          });
        }
        case "removeMemberFromChannel": {
          return await removeMemberFromChannel({
            userDoingTheRemoving: { address: lastMessage.senderAddress },
            userToRemove: {
              address: functionCall.arguments.memberAddress,
            },
            channelAddress: functionCall.arguments.channelAddress,
            copilotClient: client,
          });
        }
        case "listCreatedChannels": {
          return await listCreatedChannels({
            userDoingTheListing: { address: lastMessage.senderAddress },
            creatorAddress: lastMessage.senderAddress,
          });
        }
        case "listAvailableCommands": {
          return await listAvailableCommands({
            userDoingTheListing: { address: lastMessage.senderAddress },
            options: functionCall.arguments.options,
          });
        }
        case "describeChannel": {
          return await describeChannel({
            userDoingTheReading: { address: lastMessage.senderAddress },
            channelAddress: functionCall.arguments.channelAddress,
          });
        }
        default:
          throw new Error("Unknown function call");
      }
    } catch (err) {
      if (!(err instanceof DescriptiveError)) {
        console.error("UNKNOWN ERROR ENCOUNTERED", err);
        throw err;
      } else {
        return { ok: false, error: err.description };
      }
    }
  })();

  return responseSchema.parse(result);
};
