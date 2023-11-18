import { z } from "zod";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { openaiClient } from "../openai/openAiClient.js";
import { callSchema } from "../actions/callSchema.js";
import { sendMessage } from "../xmtp/sendMessage.js";
import { withFunctionCall } from "../openai/withFunctionCall.js";
import { withFunctionResult } from "../openai/withFunctionResult.js";
import { convertXmtpMessageToOpenAiMessage } from "../openai/convertXmtpMessageToOpenAiMessage.js";
import { execCommand } from "./execCommand.js";
import { spec as acceptChannelInviteSpec } from "../actions/accept-channel-invite/spec.js";
import { spec as createChannelSpec } from "../actions/create-channel/spec.js";
import { spec as declineChannelInviteSpec } from "../actions/decline-channel-invite/spec.js";
import { spec as deleteChannelSpec } from "../actions/delete-channel/spec.js";
import { spec as inviteMemberToChannelSpec } from "../actions/invite-member-to-channel/spec.js";
import { spec as removeMemberFromChannelSpec } from "../actions/remove-member-from-channel/spec.js";
import { spec as listCreatedChannelsSpec } from "../actions/list-created-channels/spec.js";
import { spec as listAvailableCommandsSpec } from "../actions/list-available-commands/spec.js";

export const handleFunctionCall = async ({
  client,
  message,
  messages,
  functionCall,
}: {
  client: Client;
  message: DecodedMessage;
  messages: DecodedMessage[];
  functionCall: z.infer<typeof callSchema>;
}) => {
  if (messages.length === 0) {
    throw new Error("No messages to handle inside the user message handler.");
  }

  const lastMessage = messages[messages.length - 1];

  if (lastMessage.senderAddress === client.address) {
    return;
  }

  const openAiMessages = convertXmtpMessageToOpenAiMessage({
    copilotAddress: client.address,
    xmtpMessages: messages,
  });

  const withFunctionCallMessages = withFunctionCall({
    messages: openAiMessages,
    functionCall,
  });

  const functionCallResult = await execCommand({
    client,
    message,
    functionCall,
  });

  console.log(
    `COPILOT FUNCTION CALL RESULT\n${JSON.stringify(
      functionCallResult,
      null,
      2,
    )}`,
  );

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

    console.log("OPENAI REQUEST :: function call result description");

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
        listCreatedChannelsSpec,
        listAvailableCommandsSpec,
      ],
      function_call: "none",
    });

    if (response.choices[0].message.content === null) {
      throw new Error(
        "OpenAI returned a null content response even though we used function_call: none",
      );
    }

    console.log("COPILOT SENT TEXT RESPONSE");

    sendMessage({
      client,
      content: response.choices[0].message.content,
      toAddress: lastMessage.conversation.peerAddress,
    });
  }
};
