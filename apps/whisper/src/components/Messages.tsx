"use client";

import { Message } from "./Message";
import { useLogin } from "@killthebuddha/fig";
import { useWallet } from "@/hooks/useWallet";
import { OwnerInstructions } from "./OwnerInstructions";
import { InvitedInstructions } from "./InvitedInstructions";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { useMemo } from "react";
import { memberStore } from "@/lib/memberStore";

export const Messages = () => {
  const { wallet } = useWallet();
  const groupAddress = useGroupAddressParam();
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

  const messages = memberStore((s) => s.messages);

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
            text={String(message.text)}
            outbound={message.sender === wallet.address}
          />
        ));
      })()}
    </div>
  );
};
