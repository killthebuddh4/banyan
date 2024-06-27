import { usePubSub } from "./usePubSub.js";
import { bindServer } from "@killthebuddha/brpc/bindServer.js";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { Signer } from "../remote/Signer.js";
import { useEffect, useMemo } from "react";

export const useBrpcServer = <A extends Brpc.BrpcApi>(props: {
  wallet?: Signer;
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
        throw new Error("useBrpcServer :: wrappedPublish :: !result.ok");
      }

      return result.data;
    };
  }, [publish]);

  useEffect(() => {
    if (subscribe === null) {
      return;
    }

    if (wrappedPublish === null) {
      return;
    }

    if (props.wallet === undefined) {
      return;
    }

    console.log("FIG :: useBrpcServer :: calling bindServer");

    bindServer({
      api: props.api,
      xmtp: {
        address: props.wallet.address,
        publish: wrappedPublish,
        subscribe,
      },
    });
  }, [subscribe, wrappedPublish, props.wallet, props.api]);
};
