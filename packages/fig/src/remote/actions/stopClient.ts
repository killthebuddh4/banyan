import { ActionResult } from "../ActionResult.js";
import { clientStore } from "../stores/clientStore.js";

export const stopClient = async (): Promise<ActionResult<undefined>> => {
  console.log("ACTION :: stopClient :: CALLED");

  const state = clientStore.getState();

  if (state.client.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Client is not started.",
    };
  }

  clientStore.setState({ client: { code: "idle" } });

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
