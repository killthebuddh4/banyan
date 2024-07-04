import { create } from "zustand";
import { Whisper } from "./Whisper.js";

export const ownerStore = create<{
  members: Record<string, { lastSeen: number; missedPings: number }>;
  messages: Whisper[];
}>(() => ({
  members: {},
  messages: [],
}));
