import { create } from "zustand";

export const useGroupStore = create<{
  members: string[];
  setMembers: (members: string[]) => void;
}>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));
