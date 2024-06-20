import { useBrpcServer } from "@killthebuddha/fig";
import { join } from "@/brpc/join";

export const useGroupOwner = () => {
  useBrpcServer({ api: { join } });
};
