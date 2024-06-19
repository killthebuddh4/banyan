import { ActionResult } from "../ActionResult.js";
import { AsyncState } from "../AsyncState.js";
import { clientStore } from "../stores/clientStore.js";

export const fetchClient = async (): Promise<
  ActionResult<AsyncState<undefined>>
> => {
  console.log("ACTION :: fetchClient :: CALLED");

  const client = clientStore.getState().client;

  return {
    ok: true,
    code: "SUCCESS",
    data: {
      ...client,
      data: undefined,
    },
  };
};
