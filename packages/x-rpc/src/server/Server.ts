import { Options } from "./Options.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import { Subscriber } from "./Subscriber.js";

export type Server = {
  client: Client;
  stream: AsyncGenerator<DecodedMessage, void, unknown> | null;
  subscribers: Map<string, Subscriber>;
  options: Options;
};
