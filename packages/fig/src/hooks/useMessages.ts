import { useEffect } from "react";
import { useGlobalMessageStream } from "./useGlobalMessageStream";

export const useMessages = ({ wallet }: { wallet?: { address: string } }) => {
  const globalMessageStream = useGlobalMessageStream({ wallet });

  useEffect(() => {
    if (globalMessageStream === null) {
      return;
    }

    if (globalMessageStream.start === null) {
      return;
    }

    globalMessageStream.start();
  }, [globalMessageStream?.start]);

  useEffect(() => {
    if (globalMessageStream === null) {
      return;
    }

    if (globalMessageStream.listen === null) {
      return;
    }

    globalMessageStream.listen(() => {
      console.log("GOT A MESSAGE");
    });
  }, [globalMessageStream?.listen]);
};
