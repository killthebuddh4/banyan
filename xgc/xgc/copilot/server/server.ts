import { z } from "zod";
import OpenAi from "openai";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { addMessage } from "../store/addMessage.js";
import { getMessages } from "../store/getMessages.js";
import { signatureSchema } from "../functions/signatureSchema.js";
import { spec as acceptChannelInviteSpec } from "../functions/accept-channel-invite/spec.js";
import { impl as acceptChannelInviteImpl } from "../functions/accept-channel-invite/impl.js";
import { spec as createChannelSpec } from "../functions/create-channel/spec.js";
import { impl as createChannelImpl } from "../functions/create-channel/impl.js";
import { spec as declineChannelInviteSpec } from "../functions/decline-channel-invite/spec.js";
import { impl as declineChannelInviteImpl } from "../functions/decline-channel-invite/impl.js";
import { spec as deleteChannelSpec } from "../functions/delete-channel/spec.js";
import { impl as deleteChannelImpl } from "../functions/delete-channel/impl.js";
import { spec as inviteMemberToChannelSpec } from "../functions/invite-member-to-channel/spec.js";
import { impl as inviteMemberToChannelImpl } from "../functions/invite-member-to-channel/impl.js";
import { spec as removeMemberFromChannelSpec } from "../functions/remove-member-from-channel/spec.js";
import { impl as removeMemberFromChannelImpl } from "../functions/remove-member-from-channel/impl.js";
import { isCommandMessage } from "../superuser/isCommandMessage.js";
import { DescriptiveError } from "../../lib/DescriptiveError.js";
import { withSystemMessage } from "../prompt/withSystemMessage.js";
import { withFunctionCall } from "../prompt/withFunctionCall.js";
import { withFunctionResponse } from "../prompt/withFunctionResponse.js";
import { convertXmtpMessageToOpenAiMessage } from "../prompt/converXmtpMessageToOpenAiMessage.js";

const CONFIG = {
  maxRecentMessages: 10,
};

const XGC_OPENAI_API_KEY = z.string().parse(process.env.XGC_OPENAI_API_KEY);

const openaiClient = new OpenAi({
  apiKey: XGC_OPENAI_API_KEY,
});
const XGC_PRIVATE_KEY = z.string().parse(process.env.XGC_PRIVATE_KEY);

const wallet = new Wallet(XGC_PRIVATE_KEY);
const client = await Client.create(wallet, { env: "production" });
const stream = await client.conversations.streamAllMessages();

for await (const message of stream) {
  if (isCommandMessage({ message })) {
    console.log("GOT A COMMAND MESSAGE", message.content);
    continue;
  } else {
    console.log("GOT A MESSAGE FROM ", message.senderAddress);
  }
  try {
    addMessage({ peerAddress: message.conversation.peerAddress, message });

    if (message.senderAddress === client.address) {
      continue;
    }

    const messages = getMessages({ peerAddress: message.senderAddress });
    const recentMessages = messages.slice(0, CONFIG.maxRecentMessages);
    const asOpenAiMessages = convertXmtpMessageToOpenAiMessage({
      copilotAddress: client.address,
      xmtpMessages: recentMessages,
    });
    const withSystemMessageMessages = withSystemMessage({
      messages: asOpenAiMessages,
    });

    console.log("GENERATING AN INITIAL RESPONSE");

    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: withSystemMessageMessages,
      functions: [
        createChannelSpec,
        deleteChannelSpec,
        removeMemberFromChannelSpec,
        inviteMemberToChannelSpec,
        acceptChannelInviteSpec,
        declineChannelInviteSpec,
      ],
    });

    console.log("GOT AN INITIAL RESPONSE");
    console.log("CHOICE", JSON.stringify(response.choices[0], null, 2));

    const responseText = response.choices[0].message.content;

    const functionCall = signatureSchema.safeParse(
      response.choices[0].message.function_call,
    );

    if (!functionCall.success) {
      if (responseText === null) {
        throw new Error("No function call and no response text");
      } else {
        console.log("RESPONDING WITH BASIC TEXT RESPONSE.");
        message.conversation.send(responseText);
      }
    } else {
      console.log(
        "RESPONSE WAS A FUNCTION CALL REQUEST, ATTEMPTING TO SATISFY IT.",
      );
      const withFunctionCallMessages = withFunctionCall({
        messages: withSystemMessageMessages,
        functionCall: {
          name: functionCall.data.name,
          args: functionCall.data.arguments,
        },
      });

      const functionCallResponse = await (async () => {
        try {
          switch (functionCall.data.name) {
            case "createChannel": {
              const data = await createChannelImpl({
                ownerAddress: message.senderAddress,
                name: functionCall.data.arguments.name,
                description: functionCall.data.arguments.description,
              });
              return {
                ok: true,
                result: { createdChannelAddress: data.address },
              };
            }
            case "deleteChannel": {
              const channel = await deleteChannelImpl({
                userDoingTheDeleting: { address: message.senderAddress },
                channelAddress: functionCall.data.arguments.channelAddress,
                copilotClient: client,
              });
              return {
                ok: true,
                result: {
                  deletedChannelAddress: channel.address,
                },
              };
            }
            case "inviteMemberToChannel": {
              const data = await inviteMemberToChannelImpl({
                userDoingTheInviting: { address: message.senderAddress },
                userToInvite: {
                  address: functionCall.data.arguments.memberAddress,
                },
                copilotClient: client,
                channelAddress: functionCall.data.arguments.channelAddress,
              });

              addMessage({
                peerAddress: functionCall.data.arguments.memberAddress,
                message: data,
              });

              return {
                ok: true,
                result: {
                  inviteSentToAddress: data.conversation.peerAddress,
                },
              };
            }
            case "acceptChannelInvite": {
              const channel = await acceptChannelInviteImpl({
                userDoingTheAccepting: { address: message.senderAddress },
                channelAddress: functionCall.data.arguments.channelAddress,
                copilotClient: client,
              });

              return {
                ok: true,
                result: {
                  acceptedChannelInvite: channel.address,
                },
              };
            }
            case "declineChannelInvite": {
              const channel = await declineChannelInviteImpl({
                userDoingTheDeclining: { address: message.senderAddress },
                channelAddress: functionCall.data.arguments.channelAddress,
              });

              return {
                ok: true,
                result: {
                  declinedChannelInvite: channel.address,
                },
              };
            }
            case "removeMemberFromChannel": {
              const channel = await removeMemberFromChannelImpl({
                userDoingTheRemoving: { address: message.senderAddress },
                userToRemove: {
                  address: functionCall.data.arguments.memberAddress,
                },
                channelAddress: functionCall.data.arguments.channelAddress,
                copilotClient: client,
              });

              return {
                ok: true,
                result: {
                  removedMemberFromChannel: channel.address,
                },
              };
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

      console.log("SENDING THE FUNCTION CALL RESULT BACK TO OPENAI");

      const withFunctionResponseMessages = withFunctionResponse({
        messages: withFunctionCallMessages,
        functionResponse: {
          name: functionCall.data.name,
          content: {
            ok: true,
            result: functionCallResponse,
          },
        },
      });

      const response = await openaiClient.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: withFunctionResponseMessages,
        functions: [
          createChannelSpec,
          deleteChannelSpec,
          removeMemberFromChannelSpec,
          inviteMemberToChannelSpec,
          acceptChannelInviteSpec,
          declineChannelInviteSpec,
        ],
      });

      console.log("GOT THE FUNCTION CALL RESULT BACK FROM OPENAI");

      const responseText = response.choices[0].message.content;

      if (responseText === null) {
        throw new Error(
          "Cannot handle two function calls in a row! TODO: Make this good.",
        );
      } else {
        console.log("RESPONDING WITH BASIC TEXT RESPONSE.");
        console.log(
          "message.conversation.peerAddress",
          message.conversation.peerAddress,
        );
        message.conversation.send(responseText);
      }
    }
  } catch (err) {
    console.error("CAUGHT AN UNCAUGHT ERROR WHILE HANDLING MESSAGE", err);
  }
}
