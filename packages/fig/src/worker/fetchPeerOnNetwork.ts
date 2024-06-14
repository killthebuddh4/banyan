import { clientStore } from "./clientStore";

export const fetchPeerOnNetwork = async (args: { peerAddress: string }) => {
  const client = clientStore.client();

  if (client.id !== "success") {
    return {
      ok: false,
      code: "NOT_READY",
      error: "Client is not ready.",
    };
  }

  try {
    const canMessage = await client.data.canMessage(args.peerAddress);
    return {
      ok: true,
      code: "SUCCESS",
      data: canMessage,
    };
  } catch {
    return {
      ok: false,
      code: "WORKER_ERROR",
      error: "client.data.canMessage(peerAddress) failed",
    };
  }
};
