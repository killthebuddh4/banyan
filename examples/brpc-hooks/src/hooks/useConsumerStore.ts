import { create } from "zustand";

export const useConsumerStore = create<{
  consumers: string[];
}>(() => ({
  consumers: [],
}));
