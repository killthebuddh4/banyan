import { Conversation } from "@xmtp/xmtp-js";
import { clientStore } from "./clientStore";

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
}) => {
  const timer = setTimeout(() => {
    throw new Error("sendMessage() timed out");
  }, args.opts?.timeoutMs || 10000);

  try {
    const client = clientStore.client();

    if (client.code !== "success") {
      return {
        ok: false,
        code: "NOT_READY",
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
        code: "WORKER_ERROR",
        error: "client.data.conversations.newConversation() failed",
      };
    }

    try {
      const sent = await xmtpConversation.send(args.content);
      return {
        ok: true,
        code: "SUCCESS",
        data: sent,
      };
    } catch {
      return {
        ok: false,
        code: "WORKER_ERROR",
        error: "xmtpConversation.send(content) failed",
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "sendMessage() timed out") {
        return {
          ok: false,
          code: "WORKER_ERROR",
          error: "sendMessage() timed out",
        };
      }
    }

    return {
      ok: false,
      code: "WORKER_ERROR",
      error: "sendMessage() failed",
    };
  } finally {
    clearTimeout(timer);
  }
};
