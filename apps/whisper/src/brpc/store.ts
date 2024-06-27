import { create } from "zustand";

export const store = create<{
  owner: string | null;
  members: string[];
  presence: Record<string, number>;
}>(() => ({
  owner: null,
  members: [],
  presence: {},
}));
