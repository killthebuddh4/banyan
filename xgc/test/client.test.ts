import { z } from "zod";
import { create as clientCreate } from "../xgc/xmtp/client/create.js";
import { create as serverCreate } from "../xgc/xmtp/server/create.js";
import { start } from "../xgc/xmtp/server/start.js";
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";
import { responseSchema as createChannelResponseSchema } from "../xgc/actions/create-channel/responseSchema.js";
import { responseSchema as inviteMemberToChannelSchema } from "../xgc/actions/invite-member-to-channel/responseSchema.js";
import { responseSchema as declineChannelInviteSchema } from "../xgc/actions/decline-channel-invite/responseSchema.js";
import { responseSchema as acceptChannelInviteSchema } from "../xgc/actions/accept-channel-invite/responseSchema.js";
import { responseSchema as deleteChannelSchema } from "../xgc/actions/delete-channel/responseSchema.js";
import { responseSchema as removeMemberFromChannelSchema } from "../xgc/actions/remove-member-from-channel/responseSchema.js";
import { responseSchema as listCreatedChannelsSchema } from "../xgc/actions/list-created-channels/responseSchema.js";
import { responseSchema as describeChannelSchema } from "../xgc/actions/describe-channel/responseSchema.js";
import { jsonStringSchema } from "../xgc/lib/jsonStringSchema.js";
import { makeInputString } from "./lib/makeInputString.js";
import { logGood } from "./lib/logGood.js";

const CONFIG = {
  chatUserAddress: "0xfAe7A07c946f50C52a200114d3Dc3d12bEc2C2e8",
  remoteServerAddress: "0xD7C0462bFc1f9cB88e31748b0E3Db018821Ec193",
};

console.log(`REMOTE ADDRESS ${CONFIG.remoteServerAddress}`);

const localWallet = Wallet.createRandom();
const localClient = await Client.create(localWallet, { env: "production" });
const localServer = serverCreate({ fromClient: localClient });
await start({ server: localServer });
console.log(`SERVER STARTED FOR LOCAL ADDRESS ${localClient.address}`);
const userWallet = Wallet.createRandom();
const userClient = await Client.create(userWallet, { env: "production" });
const userServer = serverCreate({ fromClient: userClient });
await start({ server: userServer });
console.log(`SERVER STARTED FOR USER ADDRESS ${userClient.address}`);

describe("client", () => {
  it("createChannel", async function () {
    this.timeout(10000000000000);

    const created = await createChannelClient()({
      input: makeInputString({
        name: "/createChannel",
        args: {
          name: "test channel",
          description: "test channel description",
        },
      }),
    });

    const description = await describeChannelClient()({
      input: makeInputString({
        name: "/describeChannel",
        args: {
          channelAddress: created.content.result.createdChannelAddress,
        },
      }),
    });

    logGood(description);
  });

  it("deleteChannel", async function () {
    this.timeout(10000000000000);

    const created = await createChannelClient()({
      input: makeInputString({
        name: "/createChannel",
        args: {
          name: "test channel",
          description: "test channel description",
        },
      }),
    });

    const allChannels = await listCreatedChannelsClient()({
      input: makeInputString({
        name: "/listCreatedChannels",
        args: {},
      }),
    });

    logGood(allChannels);

    await deleteChannelClient()({
      input: makeInputString({
        name: "/deleteChannel",
        args: {
          channelAddress: created.content.result.createdChannelAddress,
        },
      }),
    });

    const noChannels = await listCreatedChannelsClient()({
      input: makeInputString({
        name: "/listCreatedChannels",
        args: {},
      }),
    });

    logGood(noChannels);
  });

  it("inviteMemberToChannel", async function () {
    this.timeout(10000000000000);

    const created = await createChannelClient()({
      input: makeInputString({
        name: "/createChannel",
        args: {
          name: "test channel",
          description: "test channel description",
        },
      }),
    });

    logGood(created);

    const invited = await inviteMemberClient()({
      input: makeInputString({
        name: "/inviteMemberToChannel",
        args: {
          channelAddress: created.content.result.createdChannelAddress,
          memberAddress: CONFIG.chatUserAddress,
        },
      }),
    });

    logGood(invited);
  });

  it("acceptChannelInvite", async function () {
    this.timeout(10000000000000);

    const created = await createChannelClient()({
      input: makeInputString({
        name: "/createChannel",
        args: {
          name: "test channel",
          description: "test channel description",
        },
      }),
    });

    await inviteMemberClient()({
      input: makeInputString({
        name: "/inviteMemberToChannel",
        args: {
          channelAddress: created.content.result.createdChannelAddress,
          memberAddress: userWallet.address,
        },
      }),
    });

    const noMembers = await describeChannelClient()({
      input: makeInputString({
        name: "/describeChannel",
        args: {
          channelAddress: created.content.result.createdChannelAddress,
        },
      }),
    });

    logGood(noMembers);

    const acceptChannelInviteClient = clientCreate({
      usingLocalServer: userServer,
      forRemoteServerAddress: CONFIG.remoteServerAddress,
      usingResponseSchema: z.object({
        senderAddress: z.literal(CONFIG.remoteServerAddress),
        content: jsonStringSchema.pipe(acceptChannelInviteSchema),
      }),
    });

    await acceptChannelInviteClient()({
      input: makeInputString({
        name: "/acceptChannelInvite",
        args: {
          channelAddress: created.content.result.createdChannelAddress,
        },
      }),
    });

    const withMembers = await describeChannelClient()({
      input: makeInputString({
        name: "/describeChannel",
        args: {
          channelAddress: created.content.result.createdChannelAddress,
        },
      }),
    });

    logGood(withMembers);
  });
});

const createChannelClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(createChannelResponseSchema),
  }),
});

const deleteChannelClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(deleteChannelSchema),
  }),
});

const inviteMemberClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(inviteMemberToChannelSchema),
  }),
});

const declineChannelInviteClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(declineChannelInviteSchema),
  }),
});

const removeMemberFromChannelClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(removeMemberFromChannelSchema),
  }),
});

const listCreatedChannelsClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(listCreatedChannelsSchema),
  }),
});

const describeChannelClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(describeChannelSchema),
  }),
});
