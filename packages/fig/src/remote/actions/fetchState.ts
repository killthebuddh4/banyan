import { ActionResult } from "../ActionResult.js";
import { AsyncState } from "../AsyncState.js";
import { store } from "../state/store.js";

type S = {
  client: AsyncState<undefined>;
  globalMessageStream: AsyncState<undefined>;
};

export const fetchState = async (): Promise<ActionResult<S>> => {
  console.log("ACTION :: fetchState :: CALLED");

  const state = store.getState();

  return {
    ok: true,
    code: "SUCCESS",
    data: {
      client: {
        ...state.client,
        data: undefined,
      },
      globalMessageStream: {
        ...state.globalMessageStream,
        data: undefined,
      },
    },
  };
};
