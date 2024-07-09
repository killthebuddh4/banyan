import { useActions, Signer, Message } from "@killthebuddha/fig";
import { useMemo } from "react";

export const useSubscribe = ({ wallet }: { wallet?: Signer }) => {
  const { listenToGlobalMessageStream, ignoreGlobalMessageStream } =
    useActions();

  return useMemo(() => {
    return (handler: (message: Message) => void) => {
      if (wallet === undefined) {
        throw new Error("Owner :: subscribe :: wallet is undefined");
      }

      listenToGlobalMessageStream({
        wallet,
        id: crypto.randomUUID(),
        handler,
      });

      return {
        unsubscribe: () => {
          // TODO ignoreGlobalMessageStream
        },
      };
    };
  }, [wallet, listenToGlobalMessageStream, ignoreGlobalMessageStream]);
};
