import { Whisper } from "./Whisper.js";
import { create } from "zustand";

export const memberStore = create<{
  messages: Whisper[];
}>(() => ({
  messages: [],
}));
