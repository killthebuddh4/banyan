import { create } from "zustand";

export const store = create<{
  eventCount: number;
}>(() => ({
  eventCount: 0,
}));
