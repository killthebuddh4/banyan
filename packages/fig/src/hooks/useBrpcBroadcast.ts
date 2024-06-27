import { usePubSub } from "./usePubSub.js";
import { bindBroadcast } from "@killthebuddha/brpc/bindBroadcast.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";

export const useBrpcBroadcast = <P extends Brpc.BrpcProcedure>(props: {
  wallet?: Signer;
  serverAddresses?: string[];
  name: string;
  procedure: P;
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

    if (props.serverAddresses === undefined) {
      console.log("FIG :: useBrpcClient :: props.serverAddress === undefined");
      return null;
    }

    if (props.serverAddresses.length === 0) {
      console.log("FIG :: useBrpcClient :: props.serverAddress.length === 0");
      return null;
    }

    console.log("FIG :: useBrpcClient :: calling bindBroadcast");

    return bindBroadcast({
      name: props.name,
      procedure: props.procedure,
      conversation: {
        peerAddresses: props.serverAddresses,
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
  }, [
    subscribe,
    wrappedPublish,
    props.wallet,
    props.procedure,
    props.serverAddresses,
  ]);
};
