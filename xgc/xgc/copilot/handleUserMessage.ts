import { MessageHandler } from "../xmtp/server/MessageHandler.js";
// import { sendMessage } from "../xmtp/sendMessage.js";
// import { convertXmtpMessageToOpenAiMessage } from "../openai/convertXmtpMessageToOpenAiMessage.js";
// import { openaiClient } from "../openai/openAiClient.js";
// import { withSystemMessage } from "../openai/withSystemMessage.js";
// import { isFunctionCallResponse } from "../openai/isFunctionCallResponse.js";
// import { spec as acceptChannelInviteSpec } from "../actions/accept-channel-invite/spec.js";
// import { spec as createChannelSpec } from "../actions/create-channel/spec.js";
// import { spec as declineChannelInviteSpec } from "../actions/decline-channel-invite/spec.js";
// import { spec as deleteChannelSpec } from "../actions/delete-channel/spec.js";
// import { spec as inviteMemberToChannelSpec } from "../actions/invite-member-to-channel/spec.js";
// import { spec as removeMemberFromChannelSpec } from "../actions/remove-member-from-channel/spec.js";
// import { spec as listCreatedChannelsSpec } from "../actions/list-created-channels/spec.js";
// import { handleFunctionCall } from "./handleFunctionCall.js";
// import { getFunctionCallFromResponse } from "../openai/getFunctionCallFromResponse.js";

export const handleUserMessage: MessageHandler = async ({
  client,
  message: lastMessage,
}) => {
  console.log(
    "COPILOT RECEIVED USER MESSAGE",
    client.address,
    lastMessage.senderAddress,
  );
  // if (lastMessage.senderAddress === client.address) {
  //   return;
  // }

  // const asOpenAiMessages = convertXmtpMessageToOpenAiMessage({
  //   copilotAddress: client.address,
  //   xmtpMessages: allMessages,
  // });
  // const withSystemMessageMessages = withSystemMessage({
  //   userAddress: lastMessage.conversation.peerAddress,
  //   messages: asOpenAiMessages,
  // });

  // console.log("OPENAI REQUEST :: generate initial response to user");

  // console.log(withSystemMessageMessages.map((m) => m.content)[0]);

  // const response = await openaiClient.chat.completions.create({
  //   model: "gpt-4-1106-preview",
  //   messages: withSystemMessageMessages,
  //   functions: [
  //     createChannelSpec,
  //     deleteChannelSpec,
  //     removeMemberFromChannelSpec,
  //     inviteMemberToChannelSpec,
  //     acceptChannelInviteSpec,
  //     declineChannelInviteSpec,
  //     listCreatedChannelsSpec,
  //   ],
  // });

  // if (isFunctionCallResponse({ response })) {
  //   const functionCall = getFunctionCallFromResponse({ response });
  //   console.log(
  //     `COPILOT CALL FUNCTION:\nname: ${
  //       functionCall.name
  //     }\nargs: ${JSON.stringify(functionCall.arguments, null, 2)}`,
  //   );
  //   handleFunctionCall({
  //     client,
  //     messages: allMessages,
  //     functionCall,
  //   });
  // } else {
  //   if (response.choices[0].message.content === null) {
  //     throw new Error(
  //       "OpenAI returned a null content response even though we determined that it was not a function call response.",
  //     );
  //   }

  //   console.log("COPILOT SENT TEXT RESPONSE");

  //   sendMessage({
  //     client,
  //     content: response.choices[0].message.content,
  //     toAddress: lastMessage.conversation.peerAddress,
  //   });
  // }
};
