import { create } from "zustand";
import { Client } from "@xmtp/xmtp-js";
import { AsyncState } from "./AsyncState";
import { Signer } from "./Signer";

const store = create<{
  client: AsyncState<Client>;
  setClient: (client: AsyncState<Client>) => void;
}>((set) => ({
  client: { id: "idle" },
  setClient: (client) => set({ client }),
}));

const startClient = async (
  wallet: Signer,
  opts?: { env?: "production" | "dev"; privateKeyOverride?: string }
) => {
  const state = store.getState();

  if (state.client.id !== "idle") {
    return;
  }

  store.setState({ client: { id: "pending" } });

  const env = opts?.env ?? "production";

  let privateKeyOverride;
  if (wallet === null) {
    const xmtpKey = opts?.privateKeyOverride;
    if (xmtpKey === undefined) {
      // Not sure whether to set the state to error, because the store isn't really
      // in an error state, the startClient function just failed.
      store.setState({ client: { id: "idle" } });
      return;
    } else {
      try {
        privateKeyOverride = await Client.getKeys(wallet, {
          env,
          privateKeyOverride: Buffer.from(xmtpKey, "base64"),
        });
      } catch {
        store.setState({
          client: {
            id: "error",
            error:
              "Client.getKeys failed with given wallet and privateKeyOverride",
          },
        });
        return;
      }
    }
  } else {
    try {
      privateKeyOverride = await Client.getKeys(wallet, { env });
    } catch {
      store.setState({
        client: {
          id: "error",
          error: "Client.getKeys failed with given wallet",
        },
      });
      return;
    }
  }

  try {
    const client = await Client.create(null, {
      env,
      privateKeyOverride,
    });

    store.setState({
      client: {
        id: "success",
        data: client,
      },
    });
  } catch {
    store.setState({
      client: { id: "error", error: "Client.create failed" },
    });
    return;
  }
};

const stopClient = async () => {
  store.setState({ client: { id: "idle" } });
};

export const clientStore = {
  client: () => store.getState().client,
  start: startClient,
  stop: stopClient,
  subscribe: store.subscribe,
};
