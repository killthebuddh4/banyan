import { ActionResult } from "../ActionResult";
import { AsyncState } from "../AsyncState";
import { globalMessageStreamStore } from "../stores/globalMessageStreamStore";

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
