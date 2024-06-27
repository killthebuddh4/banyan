import { Message } from "@killthebuddha/fig";
import { create } from "zustand";

export const store = create<{
  members: string[];
  presence: Record<string, number>;
  muxedMessages: Array<{
    id: string;
    original: Message;
  }>;
}>(() => ({
  members: [],
  presence: {},
  muxedMessages: [],
}));
