import { clientStore } from "../stores/clientStore.js";

export const fetchConversations = async () => {
  const client = clientStore.getState().client;

  if (client.code !== "success") {
    return {
      ok: false,
      code: "NOT_READY",
      error: "Client is not ready.",
    };
  }

  try {
    const conversations = await client.data.conversations.list();
    return {
      ok: true,
      code: "SUCCESS",
      data: conversations,
    };
  } catch (error) {
    return {
      ok: false,
      code: "WORKER_ERROR",
      error: "client.data.conversations.list() failed",
    };
  }
};
