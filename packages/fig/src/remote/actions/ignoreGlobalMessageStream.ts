import { ActionResult } from "../ActionResult.js";
import { remove } from "../state/globalListeners.js";

export const ignoreGlobalMessageStream = async (
  listenerId: string
): Promise<ActionResult<{ ignored: boolean }>> => {
  console.log("ACTION :: ignoreGlobalMessageStream :: CALLED");

  const ignore = remove(listenerId);

  if (ignore === false) {
    return {
      ok: false,
      code: "NO_OP",
      error: "Listener not found",
    };
  }

  return {
    ok: true,
    code: "SUCCESS",
    data: { ignored: true },
  };
};
