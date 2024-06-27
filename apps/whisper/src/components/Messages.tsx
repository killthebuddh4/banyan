"use client";

import { Message } from "./Message";
import { useLogin, useInbox, Message as TMessage } from "@killthebuddha/fig";
import { useWallet } from "@/hooks/useWallet";
import { OwnerInstructions } from "./OwnerInstructions";
import { InvitedInstructions } from "./InvitedInstructions";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { useMemo } from "react";

export const Messages = () => {
  const { wallet } = useWallet();
  const groupAddress = useGroupAddressParam();
  const { inbox } = useInbox({
    wallet,
    opts: {
      filter: (message) => {
        return message.conversation.context === undefined;
      },
    },
  });
  const login = useLogin({ wallet });

  const clientStatus = useMemo(() => {
    if (login.isLoggingIn) {
      return "Connecting to XMTP...";
    }

    if (login.isLoginError) {
      return "XMTP connection error";
    }

    if (login.isLoggedIn) {
      return "Connected to XMTP";
    }

    return "";
  }, [login.isLoggedIn, login.isLoggingIn, login.isLoginError]);

  const messages = (() => {
    // console.warn("WHISPER :: WARMING :: MESSAGES ARE ONT SORTED");
    return Object.values(inbox).flat() as TMessage[];
  })();

  return (
    <div className="messages">
      <div className={`client`}>{clientStatus}</div>
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
