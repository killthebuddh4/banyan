import { clientStore } from "../stores/clientStore";
import { globalMessageStreamStore } from "../stores/globalMessageStreamStore";
import { createMessageStream } from "../createMesssageStream";
import { ActionResult } from "../ActionResult";

export const startGlobalMessageStream = async (): Promise<
  ActionResult<undefined>
> => {
  console.log("ACTION :: startGlobalMessageStream :: CALLED");

  const messageStream = globalMessageStreamStore.getState().stream;

  if (messageStream.code !== "idle") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Message stream is already started",
    };
  }

  const client = clientStore.getState().client;

  if (client.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Client is not started",
    };
  }

  globalMessageStreamStore.setState({ stream: { code: "pending" } });

  try {
    const gen = await client.data.conversations.streamAllMessages();
    const stream = createMessageStream(gen);

    console.log(
      "ACTION :: startGlobalMessageStream :: STARTED GLOBAL MESSAGE STREAM"
    );

    globalMessageStreamStore.setState({
      stream: { code: "success", data: stream },
    });

    return {
      ok: true,
      code: "SUCCESS",
      data: undefined,
    };
  } catch {
    globalMessageStreamStore.setState({
      stream: {
        code: "error",
        error: "client.data.conversations.streamAllMessages failed",
      },
    });

    return {
      ok: false,
      code: "REMOTE_ERROR",
      error: "client.data.conversations.streamAllMessages failed",
    };
  }
};
