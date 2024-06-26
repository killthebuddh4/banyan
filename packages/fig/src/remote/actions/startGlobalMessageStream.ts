import { store } from "../state/store.js";
import { createMessageStream } from "../createMesssageStream.js";
import { ActionResult } from "../ActionResult.js";

export const startGlobalMessageStream = async (): Promise<
  ActionResult<undefined>
> => {
  console.log("ACTION :: startGlobalMessageStream :: CALLED");

  const messageStream = store.getState().globalMessageStream;

  if (messageStream.code !== "idle") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Message stream is already started",
    };
  }

  const client = store.getState().client;

  if (client.code !== "success") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Client is not started",
    };
  }

  store.setState({ globalMessageStream: { code: "pending" } });

  try {
    const gen = await client.data.conversations.streamAllMessages();
    const stream = createMessageStream(gen);

    console.log(
      "ACTION :: startGlobalMessageStream :: STARTED GLOBAL MESSAGE STREAM"
    );

    store.setState({
      globalMessageStream: { code: "success", data: stream },
    });

    return {
      ok: true,
      code: "SUCCESS",
      data: undefined,
    };
  } catch {
    store.setState({
      globalMessageStream: {
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
