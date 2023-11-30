import { GroupServer } from "./GroupServer.js";

export type Store = {
  groupServers: Map<string, GroupServer>;
};
