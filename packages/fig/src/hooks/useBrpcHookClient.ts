import { usePubSub } from "./usePubSub.js";
import { bindHookClient } from "@killthebuddha/brpc/bindHookClient.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";

export const useBrpcHookClient = <A extends Brpc.BrpcApi>(props: {
  api: A;
  serverAddress?: string;
  wallet?: Signer;
}) => {
  const { publish, subscribe } = usePubSub({ wallet: props.wallet });

  const wrappedPublish = useMemo(() => {
    if (publish === null) {
      return null;
    }

    return async (args: Parameters<typeof publish>[0]) => {
      const result = await publish(args);

      if (!result.ok) {
        throw new Error("useBrpcHookClient :: wrappedPublish :: !result.ok");
      }

      return result.data;
    };
  }, [publish]);

  return useMemo(() => {
    if (subscribe === null) {
      console.log("FIG :: useBrpcHookClient :: subscribe === null");
      return null;
    }

    if (wrappedPublish === null) {
      console.log("FIG :: useBrpcHookClient :: wrappedPublish === null");
      return null;
    }

    if (props.wallet === undefined) {
      console.log("FIG :: useBrpcHookClient :: props.wallet === undefined");
      return null;
    }

    if (props.serverAddress === undefined) {
      console.log(
        "FIG :: useBrpcHookClient :: props.serverAddress === undefined"
      );
      return null;
    }

    console.log("FIG :: useBrpcHookClient :: calling bindHooks");

    return bindHookClient({
      api: props.api,
      conversation: {
        peerAddress: props.serverAddress,
        context: {
          conversationId: "banyan.sh/brpc",
          metadata: {},
        },
      },
      xmtp: {
        address: props.wallet.address,
        publish: wrappedPublish,
        subscribe,
      },
    });
  }, [subscribe, wrappedPublish, props.wallet, props.api]);
};
