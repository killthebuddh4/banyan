import { z } from "zod";
import { useGroupStore } from "../hooks/useGroupStore";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

const MAX_GROUP_SIZE = 10;

export const join = createProcedure({
  input: z.string(),
  output: z.object({ added: z.boolean() }),
  auth: async () => true,
  handler: async (input) => {
    console.log("WHISPTER :: brpc.join :: CALLED");
    if (useGroupStore.getState().members.length >= MAX_GROUP_SIZE) {
      return { added: false };
    }

    useGroupStore.setState((state) => {
      const members = new Set(state.members);
      members.add(input);
      return { members: Array.from(members) };
    });

    return { added: true };
  },
});
