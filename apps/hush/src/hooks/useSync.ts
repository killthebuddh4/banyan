import { createProcedure } from "@killthebuddha/brpc";
import { useMemberStore } from "./useMemberStore";
import { Whisper } from "@/lib/Whisper";

export const useSync = () => {
  const owner = useMemberStore((s) => s.owner);

  return createProcedure({
    auth: async ({ context }) => {
      if (owner === null) {
        return false;
      }

      return owner.address === context.message.senderAddress;
    },
    handler: async ({ messages }: { messages: Whisper[] }) => {
      useMemberStore.setState((state) => {
        return { ...state, messages };
      });

      return { synced: true };
    },
  });
};
