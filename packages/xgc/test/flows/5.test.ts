import { serverForAdmin } from "../lib/serverForAdmin.js";
import { serverForAlice } from "../lib/serverForAlice.js";
import { logGood } from "../lib/logGood.js";
import { logBad } from "../lib/logBad.js";
import { createClient as createChannelCreateClient } from "../../xgc/actions/create-channel/createClient.js";
import { createClient as describeChannelCreateClient } from "../../xgc/actions/describe-channel/createClient.js";
import { createClient as acceptChannelInviteCreateClient } from "../../xgc/actions/accept-channel-invite/createClient.js";
import { createClient as inviteMemberToChannelCreateClient } from "../../xgc/actions/invite-member-to-channel/createClient.js";
import { createClient as removeMemberFromChannelCreateClient } from "../../xgc/actions/remove-member-from-channel/createClient.js";

import { CONFIG } from "../lib/CONFIG.js";

describe("5", () => {
  it("remove a member from a channel", async function () {
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

    const rccc = removeMemberFromChannelCreateClient({
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

    await rccc({
      channelAddress: created.result.createdChannelAddress,
      memberAddress: serverForAlice.client.address,
    });

    const withOneMember = await dccc({
      channelAddress: created.result.createdChannelAddress,
    });

    logGood(withOneMember);
  });
});
