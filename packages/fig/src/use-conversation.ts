import { useState, useEffect } from "react";
import * as Lib from "./lib";
import { useConversationStream } from "./use-conversation-stream";
import { useSendMessage } from "./use-send-message";
import { useFetchPeerOnNetwork } from "./use-fetch-peer-on-network";
import { useFetchMessages } from "./use-fetch-messages";
import { useClient } from "./use-client";

export const useConversation = ({
  wallet,
  conversation,
  opts,
}: {
  wallet?: Lib.Signer;
  conversation?: Lib.Conversation;
  opts?: {
    stream?: boolean;
    fetch?: boolean;
    onMessage?: (message: Lib.Message) => void;
  };
}) => {
  /* ***************************************************************************
   * Messsages
   * **************************************************************************/

  const [messages, setMessages] = useState<Lib.Message[]>([]);

  const pushMessage = (message: Lib.Message) => {
    setMessages((prev) => {
      const pms = [...prev];
      const pm = pms.find((pm) => pm.id === message.id);
      if (pm !== undefined) {
        return pms;
      }
      return [...pms, message];
    });
  };

  /* ***************************************************************************
   * Client
   * **************************************************************************/

  const client = useClient({ wallet });

  /* ***************************************************************************
   * Stream
   * **************************************************************************/

  const stream = useConversationStream({ conversation, wallet });

  useEffect(() => {
    if (opts?.stream === false) {
      return;
    }

    if (stream === null) {
      return;
    }

    if (client?.isSuccess !== true) {
      return;
    }

    stream.start();
  }, [stream === null, client?.isSuccess, opts?.stream]);

  useEffect(() => {
    if (opts?.stream === false) {
      return;
    }

    if (stream === null) {
      return;
    }

    if (!stream.isSuccess) {
      return;
    }

    stream.listen((m) => {
      if (typeof opts?.onMessage === "function") {
        opts.onMessage(m);
      }

      pushMessage(m);
    });
  }, [
    stream === null,
    stream?.isSuccess,
    opts?.stream,
    typeof opts?.onMessage,
  ]);

  /* ***************************************************************************
   * PeerOnNetwork
   * **************************************************************************/

  const fetchPeerOnNetwork = useFetchPeerOnNetwork({
    wallet,
    peerAddress: conversation?.peerAddress,
  });

  /* ***************************************************************************
   * Fetch
   * **************************************************************************/

  const _fetchMessages = useFetchMessages({ wallet });

  const fetchMessages = (() => {
    if (_fetchMessages === null) {
      return null;
    }

    if (typeof conversation !== "object") {
      return null;
    }

    return () => {
      return _fetchMessages.fetch({ conversation });
    };
  })();

  useEffect(() => {
    if (opts?.fetch === false) {
      return;
    }

    if (fetchMessages === null) {
      return;
    }

    if (typeof conversation !== "object") {
      return;
    }

    if (client?.isSuccess !== true) {
      return;
    }

    fetchMessages();
  }, [
    fetchMessages === null,
    typeof conversation !== "object",
    opts?.fetch,
    client?.isSuccess,
  ]);

  /* ***************************************************************************
   * Send
   * **************************************************************************/

  const sendMessage = useSendMessage({ wallet, conversation });

  const send = (() => {
    if (sendMessage === null) {
      return null;
    }

    if (typeof conversation !== "object") {
      return null;
    }

    return ({ content }: { content: string }) => {
      return sendMessage.send({ content });
    };
  })();

  /* ***************************************************************************
   * Return
   * **************************************************************************/

  if (client === null) {
    console.log("USE CONVERSATION client is null");
    return null;
  }

  if (typeof wallet !== "object") {
    console.log("USE CONVERSATION wallet is not an object");
    return null;
  }

  if (typeof conversation !== "object") {
    console.log("USE CONVERSATION conversation is not an object");
    return null;
  }

  if (stream === null) {
    console.log("USE CONVERSATION stream is null");
    return null;
  }

  if (stream.start === null) {
    console.log("USE CONVERSATION stream.start is null");
    throw new Error("stream.start is null even though stream is not null");
  }

  if (fetchPeerOnNetwork === null) {
    return null;
  }

  if (fetchMessages === null) {
    return null;
  }

  if (_fetchMessages === null) {
    return null;
  }

  if (sendMessage === null) {
    return null;
  }

  if (send === null) {
    throw new Error("send is null even though sendMessage is not null");
  }

  return {
    login: client.start,
    isLoginIdle: client.isIdle,
    isLoginPending: client.isPending,
    isLoginSuccess: client.isSuccess,
    isLoginError: client.isError,
    loginError: client.error,
    fetchPeerOnNetwork: fetchPeerOnNetwork.fetch,
    isPeerOnNetwork: fetchPeerOnNetwork.isPeerOnNetwork,
    isPeerOnNetworkIdle: fetchPeerOnNetwork.isIdle,
    isPeerOnNetworkPending: fetchPeerOnNetwork.isPending,
    isPeerOnNetworkSuccess: fetchPeerOnNetwork.isSuccess,
    isPeerOnNetworkError: fetchPeerOnNetwork.isError,
    peerOnNetworkError: fetchPeerOnNetwork.error,
    fetchMessages,
    isFetchIdle: _fetchMessages.isIdle,
    isFetchPending: _fetchMessages.isPending,
    isFetchSuccess: _fetchMessages.isSuccess,
    isFetchError: _fetchMessages.isError,
    fetchError: _fetchMessages.error,
    stream: stream.start,
    isStreamIdle: stream.isIdle,
    isStreamPending: stream.isPending,
    isStreamSuccess: stream.isSuccess,
    isStreamError: stream.isError,
    streamError: stream.error,
    send,
    isSendIdle: sendMessage.isIdle,
    isSendPending: sendMessage.isPending,
    isSendSuccess: sendMessage.isSuccess,
    isSendError: sendMessage.isError,
    sendError: sendMessage.error,
    messages,
  };
};
