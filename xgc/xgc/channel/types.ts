import { Client, DecodedMessage } from "@xmtp/xmtp-js";

export type User = {
  address: string;
};

export type Channel = {
  owner: User;
  address: string;
  name: string;
  description: string;
  members: User[];
  client: Client;
  stream: AsyncGenerator<DecodedMessage<string | undefined>, any, unknown>;
};
