import { serverForAdmin } from "../lib/serverForAdmin.js";
import { serverForAlice } from "../lib/serverForAlice.js";
import { logGood } from "../lib/logGood.js";
import { logBad } from "../lib/logBad.js";
import { createClient as createChannelCreateClient } from "../../src/actions/create-channel/createClient.js";
import { createClient as describeChannelCreateClient } from "../../src/actions/describe-channel/createClient.js";
import { createClient as acceptChannelInviteCreateClient } from "../../src/actions/accept-channel-invite/createClient.js";
import { createClient as inviteMemberToChannelCreateClient } from "../../src/actions/invite-member-to-channel/createClient.js";
import { CONFIG } from "../lib/CONFIG.js";

describe("2", () => {
  it("accept invite to a channel", async function () {
    this.timeout(10000000000000);

    /* CLIENTS FOR ADMIN */

    const cccc = createChannelCreateClient({
      usingLocalServer: serverForAdmin,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const dccc = describeChannelCreateClient({
      usingLocalServer: serverForAdmin,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    const iccc = inviteMemberToChannelCreateClient({
      usingLocalServer: serverForAdmin,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    /* CLIENTS FOR ALICE */

    const accc = acceptChannelInviteCreateClient({
      usingLocalServer: serverForAlice,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
    });

    /* FLOW */

    const created = await cccc({
      name: "test channel",
      description: "test channel description",
    });

    if (!created.ok) {
      logBad(created);
      throw new Error("failed to create channel");
    }

    await iccc({
      channelAddress: created.result.createdChannelAddress,
      memberAddress: serverForAlice.client.address,
    });

    await accc({
      channelAddress: created.result.createdChannelAddress,
    });

    const withAcceptedInvites = await dccc({
      channelAddress: created.result.createdChannelAddress,
    });

    logGood(withAcceptedInvites);
  });
});