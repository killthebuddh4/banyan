import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";
import { useEventCountStore } from "../hooks/useEventCountStore";

export const hook = createProcedure({
  auth: async () => true,
  handler: async (increment: number) => {
    console.log("HOOK CALLED", increment);
    useEventCountStore.setState((state) => {
      return {
        eventCount: state.eventCount + increment,
      };
    });

    console.log("HOOK STATE", useEventCountStore.getState());

    return { eventCount: useEventCountStore.getState().eventCount };
  },
});
