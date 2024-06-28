import { usePubSub } from "./usePubSub.js";
import { bindHookServer } from "@killthebuddha/brpc/bindHookServer.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";

export const useBrpcHookServer = <A extends Brpc.BrpcApi>(props: {
  api: A;
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
        throw new Error("useBrpcHookServer :: wrappedPublish :: !result.ok");
      }

      return result.data;
    };
  }, [publish]);

  return useMemo(() => {
    if (subscribe === null) {
      console.log("FIG :: useBrpcHookServer :: subscribe === null");
      return null;
    }

    if (wrappedPublish === null) {
      console.log("FIG :: useBrpcHookServer :: wrappedPublish === null");
      return null;
    }

    if (props.wallet === undefined) {
      console.log("FIG :: useBrpcHookServer :: props.wallet === undefined");
      return null;
    }

    console.log("FIG :: useBrpcHookServer :: calling bindHooks");

    return bindHookServer({
      api: props.api,
      xmtp: {
        address: props.wallet.address,
        publish: wrappedPublish,
        subscribe,
      },
    });
  }, [subscribe, wrappedPublish, props.wallet, props.api]);
};
