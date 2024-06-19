"use client";

import { Message } from "./Message";
import { useMessages } from "@killthebuddha/fig";
import { useWallet } from "@/hooks/useWallet";
import { OwnerInstructions } from "./OwnerInstructions";
import { InvitedInstructions } from "./InvitedInstructions";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";

export const Messages = () => {
  const groupAddress = useGroupAddressParam();
  const { wallet } = useWallet();
  const { messages } = useMessages({ wallet });

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
          return <InvitedInstructions />;
        } else {
          return <OwnerInstructions />;
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
