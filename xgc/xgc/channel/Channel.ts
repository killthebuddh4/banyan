import { User } from "./User.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";

export type Channel = {
  owner: User;
  address: string;
  createdAt: Date;
  creator: User;
  name: string;
  description: string;
  invitations: Array<{
    toAddress: string;
    status: "pending" | "accepted" | "declined";
  }>;
  members: User[];
  client: Client;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  stream: AsyncGenerator<DecodedMessage<string | undefined>, any, unknown>;
};
