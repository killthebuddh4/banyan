import { z } from "zod";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { openaiClient } from "../openai/openAiClient.js";
import { signatureSchema } from "../functions/signatureSchema.js";
import { sendMessage } from "../../xmtp/sendMessage.js";
import { withFunctionCall } from "../openai/withFunctionCall.js";
import { withFunctionResult } from "../openai/withFunctionResult.js";
import { convertXmtpMessageToOpenAiMessage } from "../openai/converXmtpMessageToOpenAiMessage.js";
import { execFunctionCall } from "./execFunctionCall.js";
import { spec as acceptChannelInviteSpec } from "../functions/accept-channel-invite/spec.js";
import { spec as createChannelSpec } from "../functions/create-channel/spec.js";
import { spec as declineChannelInviteSpec } from "../functions/decline-channel-invite/spec.js";
import { spec as deleteChannelSpec } from "../functions/delete-channel/spec.js";
import { spec as inviteMemberToChannelSpec } from "../functions/invite-member-to-channel/spec.js";
import { spec as removeMemberFromChannelSpec } from "../functions/remove-member-from-channel/spec.js";

export const handleFunctionCall = async ({
  client,
  messages,
  functionCall,
}: {
  client: Client;
  messages: DecodedMessage[];
  functionCall: z.infer<typeof signatureSchema>;
}) => {
  if (messages.length === 0) {
    throw new Error("No messages to handle inside the user message handler.");
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.senderAddress === client.address) {
    return;
  }

  sendMessage({
    client,
    content: `Ok great, let me see if I can do that for you. I'll ping you when I'm done.`,
    toAddress: lastMessage.conversation.peerAddress,
  });

  const openAiMessages = convertXmtpMessageToOpenAiMessage({
    copilotAddress: client.address,
    xmtpMessages: messages,
  });

  const withFunctionCallMessages = withFunctionCall({
    messages: openAiMessages,
    functionCall,
  });

  const functionCallResult = await execFunctionCall({
    client,
    messages,
    functionCall,
  });

  if (!functionCallResult.ok) {
    sendMessage({
      client,
      content: `Hmm, it looks like there was a problem. Please hang tight while I look into it. I'll ping you when I'm done.`,
      toAddress: lastMessage.conversation.peerAddress,
    });
  } else {
    const withFunctionResultMessages = withFunctionResult({
      messages: withFunctionCallMessages,
      result: {
        name: functionCall.name,
        content: functionCallResult,
      },
    });

    const response = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: withFunctionResultMessages,
      functions: [
        createChannelSpec,
        deleteChannelSpec,
        removeMemberFromChannelSpec,
        inviteMemberToChannelSpec,
        acceptChannelInviteSpec,
        declineChannelInviteSpec,
      ],
      function_call: "none",
    });

    if (response.choices[0].message.content === null) {
      throw new Error(
        "OpenAI returned a null content response even though we used function_call: none",
      );
    }

    sendMessage({
      client,
      content: response.choices[0].message.content,
      toAddress: lastMessage.conversation.peerAddress,
    });
  }
};
