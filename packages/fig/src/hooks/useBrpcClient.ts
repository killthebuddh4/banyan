import { usePubSub } from "./usePubSub.js";
import { bindClient } from "@killthebuddha/brpc/bindClient.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { Signer } from "../remote/Signer.js";
import { useEffect, useMemo } from "react";

export const useBrpcClient = <A extends Brpc.BrpcApi>(props: {
  wallet?: Signer;
  serverAddress?: string;
  api: A;
}) => {
  const { publish, subscribe } = usePubSub({ wallet: props.wallet });

  const wrappedPublish = useMemo(() => {
    if (publish === null) {
      return null;
    }

    return async (args: Parameters<typeof publish>[0]) => {
      const result = await publish(args);

      if (!result.ok) {
        throw new Error("useBrpcClient :: wrappedPublish :: !result.ok");
      }

      return result.data;
    };
  }, [publish]);

  return useMemo(() => {
    if (subscribe === null) {
      console.log("FIG :: useBrpcClient :: subscribe === null");
      return null;
    }

    if (wrappedPublish === null) {
      console.log("FIG :: useBrpcClient :: wrappedPublish === null");
      return null;
    }

    if (props.wallet === undefined) {
      console.log("FIG :: useBrpcClient :: props.wallet === undefined");
      return null;
    }

    if (props.serverAddress === undefined) {
      console.log("FIG :: useBrpcClient :: props.serverAddress === undefined");
      return null;
    }

    console.log("FIG :: useBrpcClient :: calling bindClient");

    return bindClient({
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
  }, [subscribe, wrappedPublish, props.wallet, props.api, props.serverAddress]);
};
