import { Options } from "../Options.js";
import { Server } from "../Server.js";
import { Client } from "@xmtp/xmtp-js";

export const create = ({
  usingClient,
  options,
}: {
  usingClient: Client;
  options?: Options;
}): Server => {
  return {
    client: usingClient,
    handlers: new Map(),
    stream: null,
    cache: [],
    options: options || {},
  };
};
