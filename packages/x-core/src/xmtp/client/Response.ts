import { DecodedMessage } from "@xmtp/xmtp-js";

export type Response = {
  message: DecodedMessage;
  requestId: string;
  content: unknown;
};
