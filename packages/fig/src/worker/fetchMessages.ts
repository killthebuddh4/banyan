import { SortDirection, Conversation } from "@xmtp/xmtp-js";
import { clientStore } from "./clientStore";

export const fetchMessages = async (
  conversation: {
    peerAddress: string;
    context?: { conversationId: string };
  },
  opts?: {
    checkAddresses?: boolean;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
    direction?: "ascending" | "descending";
  }
) => {
  const client = clientStore.client();

  if (client.id !== "success") {
    return {
      ok: false,
      code: "NOT_READY",
      error: "Client is not ready.",
    };
  }

  let xmtpConversation: Conversation;
  try {
    xmtpConversation = await client.data.conversations.newConversation(
      conversation.peerAddress,
      (() => {
        if (conversation.context === undefined) {
          return undefined;
        } else {
          return {
            conversationId: conversation.context.conversationId,
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
    const messages = await xmtpConversation.messages({
      ...opts,
      direction: (() => {
        if (opts?.direction === "ascending") {
          return SortDirection.SORT_DIRECTION_ASCENDING;
        } else {
          return SortDirection.SORT_DIRECTION_DESCENDING;
        }
      })(),
    });

    return {
      ok: true,
      code: "SUCCESS",
      data: messages,
    };
  } catch {
    return {
      ok: false,
      code: "WORKER_ERROR",
      error: "xmtpConversation.messages(opts) failed",
    };
  }
};
