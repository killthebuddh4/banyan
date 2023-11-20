import { serverForAdmin } from "../lib/serverForAdmin.js";
import { logGood } from "../lib/logGood.js";
import { logBad } from "../lib/logBad.js";
import { createClient as createChannelCreateClient } from "../../src/actions/create-channel/createClient.js";
import { createClient as describeChannelCreateClient } from "../../src/actions/describe-channel/createClient.js";
import { createClient as deleteChannelCreateClient } from "../../src/actions/delete-channel/createClient.js";

import { CONFIG } from "../lib/CONFIG.js";

describe("4", () => {
  it("delete a channel", async function () {
    this.timeout(10000000000000);

    const cccc = createChannelCreateClient({
      usingLocalServer: serverForAdmin,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const dccc = describeChannelCreateClient({
      usingLocalServer: serverForAdmin,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const deleteClient = deleteChannelCreateClient({
      usingLocalServer: serverForAdmin,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const created = await cccc({
      name: "test channel",
      description: "test channel description",
    });

    if (!created.ok) {
      logBad(created);
      throw new Error("failed to create channel");
    }

    await deleteClient({
      channelAddress: created.result.createdChannelAddress,
    });

    const described = await dccc({
      channelAddress: created.result.createdChannelAddress,
    });

    logGood(described);
  });
});
