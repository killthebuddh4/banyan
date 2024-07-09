import { useActions, Signer } from "@killthebuddha/fig";
import { useMemo } from "react";

export const usePublish = ({ wallet }: { wallet?: Signer }) => {
  const { sendMessage } = useActions();

  return useMemo(() => {
    return async (args: {
      topic: {
        peerAddress: string;
        context?: {
          conversationId: string;
          metadata: {};
        };
      };
      content: string;
    }) => {
      if (wallet === undefined) {
        throw new Error("Owner :: publish :: wallet is undefined");
      }

      const result = await sendMessage({
        wallet,
        conversation: args.topic,
        content: args.content,
      });

      if (!result.ok) {
        throw new Error(result.error);
      }

      return { published: result.data };
    };
  }, [wallet, sendMessage]);
};
