import { Whisper } from "./Whisper.js";
import { memberStore } from "./memberStore";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

export const sync = createProcedure({
  auth: async () => true,
  handler: async ({ messages }: { messages: Whisper[] }) => {
    console.log("WHISPER :: SYNC :: called!!!!!!!!!!!!!");

    memberStore.setState(() => {
      return { messages };
    });

    return { synced: true };
  },
});
