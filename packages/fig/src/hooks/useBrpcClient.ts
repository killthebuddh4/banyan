import { createClient } from "@killthebuddha/brpc/createClient.js";
import { createRouter } from "@killthebuddha/brpc/createRouter.js";
import { Publish } from "@killthebuddha/brpc/types/Publish.js";
import { Subscribe } from "@killthebuddha/brpc/types/Subscribe.js";
import { ClientOptions } from "@killthebuddha/brpc/types/ClientOptions.js";
import { Topic } from "@killthebuddha/brpc/types/Topic.js";
import * as Brpc from "@killthebuddha/brpc/types/brpc.js";
import { Signer } from "../remote/Signer.js";
import { useMemo } from "react";
import { usePubSub } from "./usePubSub.js";

export const useBrpcClient = <A extends Brpc.BrpcApi>(props: {
  wallet?: Signer;
  api: A;
  topic: Topic;
  opts: ClientOptions;
}) => {
  const { subscribe, publish } = usePubSub({
    wallet: props.wallet,
  });

  const wrappedPublish = useMemo(() => {
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

  const wrappedSubscribe = useMemo<Subscribe>(() => {
    return (handler) => {
      // TODO Unsubscribe does nothing
      const unsubscribe = subscribe(handler);

      return { unsubscribe: () => {} };
    };
  }, [subscribe]);

  return () =>
    createClient({
      api: props.api,
      topic: props.topic,
      publish: wrappedPublish,
      subscribe: wrappedSubscribe,
      options: props.opts,
    });
};
