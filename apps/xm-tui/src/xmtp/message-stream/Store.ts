import { DecodedMessage, Stream } from "@xmtp/xmtp-js";

export type Store = {
  handlers: Map<
    string,
    {
      predicate: ({ peerAddress }: { peerAddress: string }) => boolean;
      handler: () => void;
    }
  >;
  streams: Map<string, Stream<DecodedMessage>>;
};
