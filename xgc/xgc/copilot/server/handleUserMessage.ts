import { CONFIG } from "../../xmtp/CONFIG.js";
import { MessageHandler } from "../../xmtp/MessageHandler.js";
import { sendMessage } from "../../xmtp/sendMessage.js";
import { convertXmtpMessageToOpenAiMessage } from "../openai/converXmtpMessageToOpenAiMessage.js";
import { openaiClient } from "../openai/openAiClient.js";
import { withSystemMessage } from "../openai/withSystemMessage.js";
import { isFunctionCallResponse } from "../openai/isFunctionCallResponse.js";
import { spec as acceptChannelInviteSpec } from "../functions/accept-channel-invite/spec.js";
import { spec as createChannelSpec } from "../functions/create-channel/spec.js";
import { spec as declineChannelInviteSpec } from "../functions/decline-channel-invite/spec.js";
import { spec as deleteChannelSpec } from "../functions/delete-channel/spec.js";
import { spec as inviteMemberToChannelSpec } from "../functions/invite-member-to-channel/spec.js";
import { spec as removeMemberFromChannelSpec } from "../functions/remove-member-from-channel/spec.js";
import { handleFunctionCall } from "./handleFunctionCall.js";
import { getFunctionCallFromResponse } from "../openai/getFunctionCallFromResponse.js";

export const handleUserMessage: MessageHandler = async ({
  client,
  messages,
}) => {
  if (messages.length === 0) {
    throw new Error("No messages to handle inside the user message handler.");
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.senderAddress === client.address) {
    return;
  }

  const recentMessages = messages.slice(0, CONFIG.maxRecentMessages);
  const asOpenAiMessages = convertXmtpMessageToOpenAiMessage({
    copilotAddress: client.address,
    xmtpMessages: recentMessages,
  });
  const withSystemMessageMessages = withSystemMessage({
    messages: asOpenAiMessages,
  });

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

  if (isFunctionCallResponse({ response })) {
    handleFunctionCall({
      client,
      messages,
      functionCall: getFunctionCallFromResponse({ response }),
    });
  } else {
    if (response.choices[0].message.content === null) {
      throw new Error(
        "OpenAI returned a null content response even though we determined that it was not a function call response.",
      );
    }

    sendMessage({
      client,
      content: response.choices[0].message.content,
      toAddress: lastMessage.conversation.peerAddress,
    });
  }
};
