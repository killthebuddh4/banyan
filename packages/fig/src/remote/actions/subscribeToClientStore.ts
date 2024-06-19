import { AsyncHandler } from "../AsyncHandler.js";
import { ActionResult } from "../ActionResult.js";
import { clientStore } from "../stores/clientStore.js";

export const subscribeToClientStore = async (args: {
  onChange: AsyncHandler<undefined>;
}): Promise<ActionResult<undefined>> => {
  console.log("ACTION :: subscribeToClientStore :: CALLED");

  clientStore.subscribe((state) => {
    const client = { ...state.client, data: undefined };
    args.onChange(client);
  });

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
