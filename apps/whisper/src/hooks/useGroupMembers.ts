import { store } from "@/brpc/store";

export const useGroupMembers = () => {
  const members = store((state) => state.members);

  return { members };
};
