import { create } from "zustand";

export const useEventCountStore = create<{
  eventCount: number;
}>(() => ({
  eventCount: 0,
}));
