"use client";

import { Message } from "./Message";
import { useMessages, Message as MessageType } from "@killthebuddha/fig";
import { useWallet } from "@/hooks/useWallet";
import { OwnerInstructions } from "./OwnerInstructions";
import { InvitedInstructions } from "./InvitedInstructions";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { useCallback } from "react";

export const Messages = () => {
  const groupAddress = useGroupAddressParam();
  const { wallet } = useWallet();

  const filterBrpcMessages = useCallback((message: MessageType) => {
    const prefix = "banyan.sh/brpc";

    if (message.conversation.context === undefined) {
      return true;
    }

    return !message.conversation.context.conversationId.startsWith(prefix);
  }, []);

  const { messages } = useMessages({
    wallet,
    opts: { filter: filterBrpcMessages },
  });

  return (
    <div className="messages">
      {(() => {
        if (wallet === undefined) {
          return null;
        }

        if (groupAddress === null) {
          return null;
        }

        if (wallet.address === groupAddress) {
          return <OwnerInstructions />;
        } else {
          return <InvitedInstructions />;
        }
      })()}

      {(() => {
        if (wallet === undefined) {
          return null;
        }

        return messages.map((message, i) => (
          <Message
            key={i}
            text={String(message.content)}
            outbound={message.senderAddress === wallet.address}
          />
        ));
      })()}
    </div>
  );
};
