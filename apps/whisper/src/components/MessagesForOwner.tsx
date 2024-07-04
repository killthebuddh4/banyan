"use client";

import { useLogin } from "@killthebuddha/fig";
import { useWallet } from "@/hooks/useWallet";
import { OwnerInstructions } from "./OwnerInstructions";
import { useMemo } from "react";
import { ownerStore } from "@/lib/ownerStore";
import { Messages } from "./Messages";
import { Owner } from "./Owner.jsx";

export const MessagesForOwner = () => {
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

  const messages = ownerStore((s) => s.messages);

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
      instructions={<OwnerInstructions />}
    />
  );
};
