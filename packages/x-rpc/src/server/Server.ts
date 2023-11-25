import { MessageHandler } from "./MessageHandler.js";
import { Options } from "./Options.js";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";

export type Server = {
  client: Client;
  stream: AsyncGenerator<DecodedMessage, void, unknown> | null;
  cache: DecodedMessage[];
  handlers: Map<
    string,
    {
      metadata: {
        handler: {
          id: string;
        };
      };
      handler: MessageHandler;
      tracers: Map<
        string,
        {
          onInput: ({ message }: { message: DecodedMessage }) => void;
          onOutput: ({ message }: { message: DecodedMessage }) => void;
        }
      >;
    }
  >;
  options: Options;
};
