import { useCallback, useEffect, useMemo } from "react";
import { Signer } from "../remote/Signer.js";
import { useMessages } from "./useMessages.js";
import { useRemoteActions } from "./useRemoteActions.js";
import { Message } from "../remote/Message.js";
import { create } from "zustand";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";
import { useBrpcServer } from "./useBrpcServer.js";

// The point of this hook is to work with somewhat arbitrary
// groups of conversations. It multiplexes inbound conversations
// and then demultiplexes outbound conversations. It abstracts
// the XMTP conversation and messages into something like a
// topic or channel.

const useStore = create<{
  members: string[];
}>(() => ({
  members: [],
}));

const join = createProcedure({
  auth: async () => true,
  handler: async (_, ctx) => {
    useStore.setState((state) => {
      const members = new Set([...state.members, ctx.message.senderAddress]);
      return { members: Array.from(members) };
    });
  },
});

export const useTopicOwner = (props: {
  wallet?: Signer;
  topic: string;
  members: string[];
  opts?: {};
}) => {
  const { members } = useStore.getState();

  const { sendMessage } = useRemoteActions({ wallet: props.wallet });

  useEffect(() => {
    if (sendMessage === null) {
      return;
    }

    (async () => {
      try {
        const sent = await Promise.all(
          useStore.getState().members.map((address) => {
            if (sendMessage === null) {
              return;
            }

            return sendMessage({
              conversation: {
                peerAddress: address,
              },
              content: `${address} joined the topic.`,
            });
          })
        );

        console.log("FIG :: useTopicOwner :: notify join :: sent", sent);
      } catch (error) {
        console.error("FIG :: useTopicOwner :: notify join :: error", error);
      }
    })();
  }, [sendMessage, members]);

  const { start } = useBrpcServer({
    api: { join },
    wallet: props.wallet,
    options: {},
  });
};
