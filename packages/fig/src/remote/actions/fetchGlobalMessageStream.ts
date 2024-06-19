import { ActionResult } from "../ActionResult.js";
import { AsyncState } from "../AsyncState.js";
import { globalMessageStreamStore } from "../stores/globalMessageStreamStore.js";

export const fetchGlobalMessageStream = async (): Promise<
  ActionResult<AsyncState<undefined>>
> => {
  console.log("ACTION :: fetchGlobalMessageStream :: CALLED");

  return {
    ok: true,
    code: "SUCCESS",
    data: {
      ...globalMessageStreamStore.getState().stream,
      data: undefined,
    },
  };
};
