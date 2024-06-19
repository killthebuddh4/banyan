import { create } from "zustand";
import { Client } from "@xmtp/xmtp-js";
import { AsyncState } from "../AsyncState.js";

export const clientStore = create<{
  client: AsyncState<Client>;
  setClient: (client: AsyncState<Client>) => void;
}>((set) => ({
  client: { code: "idle" },
  setClient: (client) => set({ client }),
}));
