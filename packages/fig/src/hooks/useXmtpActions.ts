import * as Comlink from "comlink";
import { Signer } from "../remote/Signer.js";
import { useRemote } from "./useRemote.js";
import { AsyncState } from "../remote/AsyncState.js";
import { Message } from "../remote/Message.js";
import { useMemo } from "react";

export const useXmtpActions = () => {
  return useMemo(() => {
    const startClient = async (args: {
      wallet: Signer;
      opts?: { env?: "production" | "dev" };
    }) => {
      const proxy = Comlink.proxy(args.wallet);
      const remote = useRemote({ wallet: args.wallet });
      return remote.startClient(proxy, args.opts);
    };

    const stopClient = async (wallet: Signer) => {
      const remote = useRemote({ wallet });
      return remote.stopClient();
    };

    const fetchState = async (wallet: Signer) => {
      const remote = useRemote({ wallet });
      return remote.fetchState();
    };

    const subscribeToState = async (args: {
      wallet: Signer;
      onChange: (state: {
        client: AsyncState<undefined>;
        globalMessageStream: AsyncState<undefined>;
      }) => void;
    }) => {
      const remote = useRemote({ wallet: args.wallet });
      return remote.subscribeToState(
        Comlink.proxy({ onChange: args.onChange })
      );
    };

    const unsubscribeToState = async (args: {
      wallet: Signer;
      subscriptionId: string;
    }) => {
      const remote = useRemote({ wallet: args.wallet });

      return remote.unsubscribeToState({ subscriptionId: args.subscriptionId });
    };

    const startGlobalMessageStream = async (wallet: Signer) => {
      const remote = useRemote({ wallet });
      return remote.startGlobalMessageStream();
    };

    const stopGlobalMessageStream = async (wallet: Signer) => {
      const remote = useRemote({ wallet });
      return remote.stopGlobalMessageStream();
    };

    const listenToGlobalMessageStream = async (args: {
      wallet: Signer;
      id: string;
      handler: (message: Message) => void;
    }) => {
      const remote = useRemote({ wallet: args.wallet });
      return remote.listenToGlobalMessageStream(
        args.id,
        Comlink.proxy(args.handler)
      );
    };

    const ignoreGlobalMessageStream = async (args: {
      wallet: Signer;
      id: string;
    }) => {
      const remote = useRemote({ wallet: args.wallet });
      return remote.ignoreGlobalMessageStream(args.id);
    };

    const sendMessage = async (args: {
      wallet: Signer;
      conversation: {
        peerAddress: string;
        context?: { conversationId: string };
      };
      content: string;
      opts?: { timeoutMs?: number };
    }) => {
      const remote = useRemote({ wallet: args.wallet });
      return remote.sendMessage({
        conversation: args.conversation,
        content: args.content,
        opts: args.opts,
      });
    };

    return {
      startClient,
      stopClient,
      fetchState,
      subscribeToState,
      unsubscribeToState,
      startGlobalMessageStream,
      stopGlobalMessageStream,
      listenToGlobalMessageStream,
      ignoreGlobalMessageStream,
      sendMessage,
    };
  }, []);
};
