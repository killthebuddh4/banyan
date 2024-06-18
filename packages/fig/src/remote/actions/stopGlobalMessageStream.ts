import { globalMessageStreamStore } from "../stores/globalMessageStreamStore";
import { ActionResult } from "../ActionResult";

export const stopGlobalMessageStream = async (): Promise<
  ActionResult<undefined>
> => {
  console.log("ACTION :: stopGlobalMessageStream :: CALLED");

  const messageStream = globalMessageStreamStore.getState().stream;

  if (messageStream.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Message stream is not started",
    };
  }

  messageStream.data.stop();

  globalMessageStreamStore.setState({ stream: { code: "idle" } });

  return {
    ok: true,
    code: "SUCCESS",
    data: undefined,
  };
};
