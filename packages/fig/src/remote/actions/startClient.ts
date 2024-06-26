import { store } from "../state/store.js";
import { Signer } from "../Signer.js";
import { ActionResult } from "../ActionResult.js";
import { Client } from "@xmtp/xmtp-js";

export const startClient = async (
  wallet: Signer,
  opts?: { env?: "production" | "dev"; privateKeyOverride?: string }
): Promise<ActionResult<undefined>> => {
  console.log("ACTION :: startClient :: CALLED");

  const state = store.getState();

  if (state.client.code !== "idle") {
    return {
      ok: false,
      code: "NO_OP",
      error: "Client is already started.",
    };
  }

  store.setState({ client: { code: "pending" } });

  const env = opts?.env ?? "production";

  let privateKeyOverride;
  if (wallet === null) {
    const xmtpKey = opts?.privateKeyOverride;
    if (xmtpKey === undefined) {
      // Not sure whether to set the state to error, because the clientStore isn't really
      // in an error state, the startClient function just failed.
      store.setState({ client: { code: "idle" } });

      return {
        ok: false,
        code: "BAD_INPUT",
        error: "Wallet is required.",
      };
    } else {
      try {
        privateKeyOverride = await Client.getKeys(wallet, {
          env,
          privateKeyOverride: Buffer.from(xmtpKey, "base64"),
        });
      } catch {
        store.setState({
          client: {
            code: "error",
            error:
              "Client.getKeys failed with given wallet and privateKeyOverride",
          },
        });

        return {
          ok: false,
          code: "REMOTE_ERROR",
          error:
            "Client.getKeys failed with given wallet and privateKeyOverride",
        };
      }
    }
  } else {
    try {
      privateKeyOverride = await Client.getKeys(wallet, { env });
    } catch {
      store.setState({
        client: {
          code: "error",
          error: "Client.getKeys failed with given wallet",
        },
      });

      return {
        ok: false,
        code: "REMOTE_ERROR",
        error: "Client.getKeys failed with given wallet",
      };
    }
  }

  try {
    const client = await Client.create(null, {
      env,
      privateKeyOverride,
    });

    store.setState({
      client: {
        code: "success",
        data: client,
      },
    });

    return {
      ok: true,
      code: "SUCCESS",
      data: undefined,
    };
  } catch {
    store.setState({
      client: { code: "error", error: "Client.create failed" },
    });
    return {
      ok: false,
      code: "REMOTE_ERROR",
      error: "Client.create failed",
    };
  }
};
