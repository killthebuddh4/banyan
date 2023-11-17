import { serverForAdmin } from "../lib/serverForAdmin.js";
import { logGood } from "../lib/logGood.js";
import { createClient as createChannelCreateClient } from "../../xgc/actions/create-channel/createClient.js";
import { createClient as describeChannelCreateClient } from "../../xgc/actions/describe-channel/createClient.js";
import { CONFIG } from "../lib/CONFIG.js";
import { makeInputString } from "../lib/makeInputString.js";

describe("0", () => {
  it("create a channel", async function () {
    this.timeout(10000000000000);

    const cccc = createChannelCreateClient({
      usingLocalServer: serverForAdmin,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const created = await cccc()({
      input: makeInputString({
        name: "/createChannel",
        args: {
          name: "test channel",
          description: "test channel description",
        },
      }),
    });

    logGood(created);
  });
});
