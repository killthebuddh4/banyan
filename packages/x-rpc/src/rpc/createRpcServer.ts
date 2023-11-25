import { Options } from "../server/Options.js";
import { Server } from "../server/Server.js";
import { Client } from "@xmtp/xmtp-js";
import { create as serverCreate } from "../server/api/create.js";

export const create = ({
  usingClient,
  options,
}: {
  usingClient: Client;
  options?: Options;
}): Server => {
  return serverCreate({
    usingClient,
    options,
  });
};
