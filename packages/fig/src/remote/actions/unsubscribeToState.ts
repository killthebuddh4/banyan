import { ActionResult } from "../ActionResult.js";
import { store } from "../state/store.js";

export const unsubscribeToState = async (args: {
  subscriptionId: string;
}): Promise<ActionResult<undefined>> => {
  const unsub = store.getState().subscribers[args.subscriptionId];

  if (unsub === undefined) {
    return {
      ok: false,
      code: "NO_OP",
      data: undefined,
      error: "No subscription found",
    };
  }

  unsub();

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
