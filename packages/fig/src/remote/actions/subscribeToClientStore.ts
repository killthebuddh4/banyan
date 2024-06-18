import { AsyncHandler } from "../AsyncHandler";
import { ActionResult } from "../ActionResult";
import { clientStore } from "../stores/clientStore";

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
