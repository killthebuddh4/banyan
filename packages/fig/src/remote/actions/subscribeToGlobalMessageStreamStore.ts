import { AsyncHandler } from "../AsyncHandler";
import { ActionResult } from "../ActionResult";
import { globalMessageStreamStore } from "../stores/globalMessageStreamStore";

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
