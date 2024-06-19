import { create } from "zustand";
import { AsyncState } from "../AsyncState.js";
import { clientStore } from "./clientStore.js";
import { MessageStream } from "../MessageStream.js";

export const globalMessageStreamStore = create<{
  stream: AsyncState<MessageStream>;
  setStream: (stream: AsyncState<MessageStream>) => void;
}>((set) => ({
  stream: { code: "idle" },
  setStream: (stream) => set({ stream }),
}));

clientStore.subscribe(() => {
  const stream = globalMessageStreamStore.getState().stream;
  if (stream.code === "success") {
    stream.data.stop();
  }
  globalMessageStreamStore.setState({ stream: { code: "idle" } });
});
