import { ActionResult } from "../ActionResult";
import { AsyncState } from "../AsyncState";
import { clientStore } from "../stores/clientStore";

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
