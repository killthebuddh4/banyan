import { create } from "zustand";
import { AsyncState } from "../AsyncState";
import { clientStore } from "./clientStore";
import { MessageStream } from "../MessageStream";

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
