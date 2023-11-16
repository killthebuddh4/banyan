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

const localWallet = Wallet.createRandom();
const localClient = await Client.create(localWallet, { env: "production" });
const localServer = serverCreate({ fromClient: localClient });

await start({ server: localServer });

console.log(`REMOTE ADDRESS ${CONFIG.remoteServerAddress}`);
console.log(`LOCAL ADDRESS ${localClient.address}`);

describe("client", () => {
  it("createChannel", async function () {
    this.timeout(10000000000000);

    const response = await createChannelClient()({
      input: makeInputString({
        name: "/createChannel",
        args: {
          name: "test channel",
          description: "test channel description",
        },
      }),
    });

    logGood(response);
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

const acceptChannelInviteClient = clientCreate({
  usingLocalServer: localServer,
  forRemoteServerAddress: CONFIG.remoteServerAddress,
  usingResponseSchema: z.object({
    senderAddress: z.literal(CONFIG.remoteServerAddress),
    content: jsonStringSchema.pipe(acceptChannelInviteSchema),
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
