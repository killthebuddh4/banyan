"use client";

import { useLogin } from "@killthebuddha/fig";
import { useWallet } from "@/hooks/useWallet";
import { InvitedInstructions } from "./InvitedInstructions";
import { useMemo } from "react";
import { memberStore } from "@/lib/memberStore";
import { Messages } from "./Messages";

export const MessagesForMember = () => {
  const { wallet } = useWallet();
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

  if (wallet === undefined) {
    return <div className="messages">Loading...</div>;
  }

  return (
    <Messages
      clientStatus={clientStatus}
      messages={messages.map((m) => ({
        id: m.id,
        text: m.text,
        isOutbound: wallet.address === m.sender,
      }))}
      instructions={<InvitedInstructions />}
    />
  );
};
