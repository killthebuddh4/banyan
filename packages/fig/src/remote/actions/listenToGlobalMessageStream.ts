import { ActionResult } from "../ActionResult.js";
import { globalMessageStreamStore } from "../stores/globalMessageStreamStore.js";
import { Message } from "../Message.js";

export const listenToGlobalMessageStream = async (
  handler: (m: Message) => void
): Promise<ActionResult<undefined>> => {
  console.log("ACTION :: listenToGlobalMessageStream :: CALLED");

  const messageStream = globalMessageStreamStore.getState().stream;

  if (messageStream.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Message stream is not started",
    };
  }

  console.log(
    "ACTION :: listenToGlobalMessageStream :: LISTENING TO GLOBAL MESSAGE STREAM"
  );

  messageStream.data.listen((message) => {
    return handler({
      id: message.id,
      content: message.content,
      senderAddress: message.senderAddress,
      sent: message.sent,
      conversation: {
        peerAddress: message.conversation.peerAddress,
        context: message.conversation.context,
      },
    });
  });

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
