import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import { createProcedure } from "./createProcedure.js";
import { bindClient } from "./bindClient.js";
import { createPubSub } from "./createPubSub.js";
import { bindServer } from "./bindServer.js";

const authorizedWallet = Wallet.createRandom();

const CLEANUP: Array<() => void> = [];

export const priv = createProcedure({
  auth: async () => false,
  handler: async () => {
    return "You should not see this!";
  },
});

const add = createProcedure({
  input: z.object({
    a: z.number(),
    b: z.number(),
  }),
  auth: async () => true,
  handler: async ({ a, b }) => {
    return a + b;
  },
});

const concat = createProcedure({
  input: z.object({
    a: z.string(),
    b: z.string(),
  }),
  output: z.string(),
  auth: async () => true,
  handler: async ({ a, b }) => {
    return `${a}${b}`;
  },
});

const stealTreasure = createProcedure({
  input: z.object({
    amount: z.number(),
  }),
  output: z.string(),
  auth: async () => false,
  handler: async ({ amount }, ctx) => {
    return `${amount} stolen by ${ctx.message.senderAddress}`;
  },
});

describe("Brpc", () => {
  afterEach(() => {
    for (const cleanup of CLEANUP) {
      cleanup();
    }
  });

  it("should work", async function () {
    this.timeout(15000);

    const xmtpForServer = await createPubSub({});

    bindServer({
      api: { add, concat },
      xmtp: xmtpForServer,
    });

    await xmtpForServer.start();

    CLEANUP.push(xmtpForServer.stop);

    const xmtpForClient = await createPubSub({});

    const client = bindClient({
      api: { add, concat },
      xmtp: xmtpForClient,
      conversation: {
        peerAddress: xmtpForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    await xmtpForClient.start();

    CLEANUP.push(xmtpForClient.stop);

    const addResult = await client.add({ a: 1, b: 2 });

    if (!addResult.ok) {
      console.error(addResult);
      throw new Error("add failed");
    }

    if (addResult.data !== 3) {
      console.error(addResult);
      throw new Error("add returned wrong result");
    }

    const concatResult = await client.concat({ a: "hello", b: "world" });

    if (!concatResult.ok) {
      throw new Error("concat failed");
    }

    if (concatResult.data !== "helloworld") {
      throw new Error("concat returned wrong result");
    }

    console.log("ADD RESULT IS", addResult.data);
    console.log("CONCAT RESULT IS", concatResult.data);
  });

  it("should not allow public access to private procedures", async function () {
    this.timeout(15000);

    const xmtpForServer = await createPubSub({});

    bindServer({
      api: { stealTreasure },
      xmtp: xmtpForServer,
    });

    await xmtpForServer.start();

    CLEANUP.push(xmtpForServer.stop);

    const xmtpForClient = await createPubSub({});

    const client = bindClient({
      api: { stealTreasure },
      xmtp: xmtpForClient,
      conversation: {
        peerAddress: xmtpForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    await xmtpForClient.start();

    CLEANUP.push(xmtpForClient.stop);

    const result = await client.stealTreasure({ amount: 100 });

    if (result.ok) {
      throw new Error("stealTreasure should have failed");
    }

    if (result.code !== "UNAUTHORIZED") {
      throw new Error(
        "stealTreasure should have failed with UNAUTHORIZED code",
      );
    }

    console.log("RESULT IS", result);
  });

  it("should allow authorized access to private procedures", async function () {
    this.timeout(15000);

    const auth = createProcedure({
      output: z.literal("you are authorized"),
      auth: async ({ context }) => {
        return context.message.senderAddress === authorizedWallet.address;
      },
      handler: async () => {
        return "you are authorized" as const;
      },
    });

    const xmtpForServer = await createPubSub({});

    bindServer({
      api: { auth },
      xmtp: xmtpForServer,
    });

    await xmtpForServer.start();

    CLEANUP.push(xmtpForServer.stop);

    const xmtpForUnauthorizedClient = await createPubSub({});

    const unauthorizedClient = bindClient({
      api: { auth },
      xmtp: xmtpForUnauthorizedClient,
      conversation: {
        peerAddress: xmtpForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    await xmtpForUnauthorizedClient.start();

    CLEANUP.push(xmtpForUnauthorizedClient.stop);

    const xmtpForAuthorizedClient = await createPubSub({
      options: {
        wallet: authorizedWallet,
      },
    });

    const authorizedClient = bindClient({
      api: { auth },
      xmtp: xmtpForAuthorizedClient,
      conversation: {
        peerAddress: xmtpForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    await xmtpForAuthorizedClient.start();

    CLEANUP.push(xmtpForAuthorizedClient.stop);

    const unauthorizedResult = await unauthorizedClient.auth();

    if (unauthorizedResult.ok) {
      throw new Error("auth should have failed for unauthorized client");
    }

    const authorizedResult = await authorizedClient.auth();

    if (!authorizedResult.ok) {
      throw new Error("auth should have succeeded for authorized client");
    }

    if (authorizedResult.data !== "you are authorized") {
      throw new Error("auth returned wrong result");
    }

    console.log("AUTHORIZED RESULT IS", authorizedResult);
    console.log("AUTHORIZED RESULT IS", unauthorizedResult);
  });
});
