import { Conversation } from "@xmtp/xmtp-js";
import { store } from "../state/store.js";
import { ActionResult } from "../ActionResult.js";
import { Message } from "../Message.js";

export const sendMessage = async (args: {
  conversation: {
    peerAddress: string;
    context?: {
      conversationId: string;
    };
  };
  content: string;
  opts?: {
    timeoutMs?: number;
  };
}): Promise<ActionResult<Message>> => {
  console.log("ACTION :: sendMessage :: CALLED");

  const timer = setTimeout(() => {
    throw new Error("sendMessage() timed out");
  }, args.opts?.timeoutMs || 10000);

  try {
    const client = store.getState().client;

    if (client.code !== "success") {
      return {
        ok: false,
        code: "NO_OP",
        error: "Client is not ready.",
      };
    }

    let xmtpConversation: Conversation;
    try {
      xmtpConversation = await client.data.conversations.newConversation(
        args.conversation.peerAddress,
        (() => {
          if (args.conversation.context === undefined) {
            return undefined;
          } else {
            return {
              conversationId: args.conversation.context.conversationId,
              metadata: {},
            };
          }
        })()
      );
    } catch {
      return {
        ok: false,
        code: "REMOTE_ERROR",
        error: "client.data.conversations.newConversation() failed",
      };
    }

    try {
      console.log("ACTION :: sendMessage :: SENDING MESSAGE");

      const sent = await xmtpConversation.send(args.content);

      console.log("ACTION :: sendMessage :: SENT MESSAGE");

      return {
        ok: true,
        code: "SUCCESS",
        data: {
          id: sent.id,
          content: sent.content,
          senderAddress: sent.senderAddress,
          sent: sent.sent,
          conversation: {
            peerAddress: sent.conversation.peerAddress,
            context: sent.conversation.context,
          },
        },
      };
    } catch {
      return {
        ok: false,
        code: "REMOTE_ERROR",
        error: "xmtpConversation.send(content) failed",
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "sendMessage() timed out") {
        return {
          ok: false,
          code: "REMOTE_ERROR",
          error: "sendMessage() timed out",
        };
      }
    }

    return {
      ok: false,
      code: "REMOTE_ERROR",
      error: "sendMessage() failed",
    };
  } finally {
    clearTimeout(timer);
  }
};
