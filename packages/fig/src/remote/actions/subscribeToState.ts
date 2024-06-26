import { ActionResult } from "../ActionResult.js";
import { store } from "../state/store.js";
import { v4 as uuidv4 } from "uuid";
import { AsyncState } from "../AsyncState.js";

export const subscribeToState = async (args: {
  onChange: (s: {
    client: AsyncState<undefined>;
    globalMessageStream: AsyncState<undefined>;
  }) => void;
}): Promise<ActionResult<{ subscriptionId: string }>> => {
  console.log("ACTION :: subscribeToClientStore :: CALLED");

  const unsubscribe = store.subscribe((state) => {
    args.onChange({
      client: { ...state.client, data: undefined },
      globalMessageStream: { ...state.globalMessageStream, data: undefined },
    });
  });

  const subscriptionId = uuidv4();

  store.setState((prev) => {
    return {
      ...prev,
      subscribers: {
        ...prev.subscribers,
        [subscriptionId]: unsubscribe,
      },
    };
  });

  return {
    ok: true,
    code: "SUCCESS",
    data: { subscriptionId },
  };
};
