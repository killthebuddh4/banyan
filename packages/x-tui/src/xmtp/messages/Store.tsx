import { DecodedMessage } from "@xmtp/xmtp-js";

export type Store = {
  handlers: Map<
    string,
    {
      handler: () => void;
      predicate: ({ message }: { message: DecodedMessage }) => boolean;
    }
  >;
  index: Map<string, Map<string, DecodedMessage>>;
  messages: Map<string, DecodedMessage[]>;
};
