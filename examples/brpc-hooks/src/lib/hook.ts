import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";
import { store } from "./store";

export const hook = createProcedure({
  auth: async () => true,
  handler: async (increment: number) => {
    console.log("HOOK CALLED", increment);
    store.setState((state) => {
      return {
        eventCount: state.eventCount + increment,
      };
    });

    console.log("HOOK STATE", store.getState());

    return { eventCount: store.getState().eventCount };
  },
});
