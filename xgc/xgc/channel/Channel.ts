import { User } from "./User.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";

export type Channel = {
  owner: User;
  address: string;
  name: string;
  description: string;
  invitations: Array<{
    toAddress: string;
    status: "pending" | "accepted" | "declined";
  }>;
  members: User[];
  client: Client;
  stream: AsyncGenerator<DecodedMessage<string | undefined>, any, unknown>;
};
