import { createClient } from "@killthebuddha/brpc/createClient.js";
import { createRouter } from "@killthebuddha/brpc/createRouter.js";
import { Publish } from "@killthebuddha/brpc/types/Publish.js";
import { Subscribe } from "@killthebuddha/brpc/types/Subscribe.js";
import { ClientOptions } from "@killthebuddha/brpc/types/ClientOptions.js";
import { Topic } from "@killthebuddha/brpc/types/Topic.js";
import * as Brpc from "@killthebuddha/brpc/types/brpc.js";
import { RouterOptions } from "@killthebuddha/brpc/types/RouterOptions.js";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";
import { usePubSub } from "./usePubSub.js";

export const useBrpc = (props: { wallet?: Signer }) => {
  const { subscribe, publish, start, stop } = usePubSub({
    wallet: props.wallet,
  });

  const wrappedPublish = useMemo(() => {
    if (publish === null) {
      return null;
    }

    const cb: Publish = async ({ topic, content }) => {
      const result = await publish({
        conversation: topic,
        content: content,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      return { published: result.data };
    };

    return cb;
  }, [publish]);

  const wrappedSubscribe = useMemo<Subscribe | null>(() => {
    if (subscribe === null) {
      return null;
    }

    return (handler) => {
      const unsubscribe = subscribe(handler);

      return { unsubscribe };
    };
  }, [subscribe]);

  const walletAddress = props.wallet?.address;

  const router = useMemo(() => {
    if (walletAddress === undefined) {
      return null;
    }

    if (wrappedPublish === null) {
      return null;
    }

    if (wrappedSubscribe === null) {
      return null;
    }

    return (routerArgs: {
      api: { [key: string]: Brpc.BrpcProcedure };
      topic: Topic;
      options?: RouterOptions;
    }) => {
      return createRouter({
        api: routerArgs.api,
        topic: routerArgs.topic,
        address: walletAddress,
        publish: wrappedPublish,
        subscribe: wrappedSubscribe,
        options: routerArgs.options,
      });
    };
  }, [walletAddress, wrappedPublish, wrappedSubscribe]);

  const client = useMemo(() => {
    if (walletAddress === undefined) {
      return null;
    }

    if (wrappedPublish === null) {
      return null;
    }

    if (wrappedSubscribe === null) {
      return null;
    }

    return <A extends Brpc.BrpcApi>(clientArgs: {
      api: A;
      topic: Topic;
      options?: ClientOptions;
    }) => {
      return createClient({
        api: clientArgs.api,
        topic: clientArgs.topic,
        publish: wrappedPublish,
        subscribe: wrappedSubscribe,
        options: clientArgs.options,
      });
    };
  }, [walletAddress, wrappedPublish, wrappedSubscribe]);

  return {
    address: props.wallet?.address,
    start,
    stop,
    client,
    router,
  };
};
