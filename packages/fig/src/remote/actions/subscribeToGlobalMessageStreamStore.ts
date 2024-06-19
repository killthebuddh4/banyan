import { AsyncHandler } from "../AsyncHandler.js";
import { ActionResult } from "../ActionResult.js";
import { globalMessageStreamStore } from "../stores/globalMessageStreamStore.js";

export const subscribeToGlobalMessageStreamStore = async (args: {
  onChange: AsyncHandler<undefined>;
}): Promise<ActionResult<undefined>> => {
  console.log("ACTION :: subscribeToGlobalMessageStreamStore :: CALLED");

  globalMessageStreamStore.subscribe((state) => {
    const stream = { ...state.stream, data: undefined };
    args.onChange(stream);
  });

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
