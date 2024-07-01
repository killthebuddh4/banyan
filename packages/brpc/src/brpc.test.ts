import { z } from "zod";
import { Wallet } from "@ethersproject/wallet";
import { createProcedure } from "./createProcedure.js";
import { createClient } from "./createClient.js";
import { createRouter } from "./createRouter.js";
import { createHub } from "./createHub.js";

const authorizedWallet = Wallet.createRandom();

const CLEANUP: Array<() => void> = [];

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

    const hubForServer = createHub({
      options: {
        onStartWithoutHandlers: () => {
          console.log("SERVER started without handlers");
        },
        onHandlingMessage: ({ message }) => {
          console.log("SERVER handling message from: ", message.senderAddress);
          console.log("SERVER handling message content: ", message.content);
        },
      },
    });

    const router = createRouter({
      hub: hubForServer,
      context: { conversationId: "banyan.sh/brpc", metadata: {} },
    });

    router.attach({ add, concat });

    await hubForServer.start();

    CLEANUP.push(hubForServer.stop);

    const hubForClient = createHub({
      options: {
        onStartWithoutHandlers: () => {
          console.log("CLIENT started without handlers");
        },
        onHandlingMessage: ({ message }) => {
          console.log("CLIENT handling message from: ", message.senderAddress);
          console.log("CLIENT handling message content: ", message.content);
        },
      },
    });

    const client = createClient({
      api: { add, concat },
      hub: hubForClient,
      conversation: {
        peerAddress: hubForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    client.start();

    await hubForClient.start();

    CLEANUP.push(hubForClient.stop);

    const addResult = await client.api.add({ a: 1, b: 2 });

    if (!addResult.ok) {
      console.error(addResult);
      throw new Error("add failed");
    }

    if (addResult.data !== 3) {
      console.error(addResult);
      throw new Error("add returned wrong result");
    }

    const concatResult = await client.api.concat({ a: "hello", b: "world" });

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

    const hubForServer = await createHub({});

    const router = createRouter({
      hub: hubForServer,
      context: { conversationId: "banyan.sh/brpc", metadata: {} },
    });

    router.attach({ stealTreasure });

    await hubForServer.start();

    CLEANUP.push(hubForServer.stop);

    const hubForClient = await createHub({});

    const client = createClient({
      api: { stealTreasure },
      hub: hubForClient,
      conversation: {
        peerAddress: hubForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    client.start();

    await hubForClient.start();

    CLEANUP.push(hubForClient.stop);

    const result = await client.api.stealTreasure({ amount: 100 });

    if (result.ok) {
      throw new Error("stealTreasure should have failed");
    }

    if (result.code !== "UNAUTHORIZED") {
      console.log("RESULT IS", result);
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

    const hubForServer = await createHub({});

    const router = createRouter({
      hub: hubForServer,
      context: { conversationId: "banyan.sh/brpc", metadata: {} },
    });

    router.attach({ auth });

    await hubForServer.start();

    CLEANUP.push(hubForServer.stop);

    const hubForUnauthorizedClient = createHub({});

    const unauthorizedClient = createClient({
      api: { auth },
      hub: hubForUnauthorizedClient,
      conversation: {
        peerAddress: hubForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    unauthorizedClient.start();

    await hubForUnauthorizedClient.start();

    CLEANUP.push(hubForUnauthorizedClient.stop);

    const hubForAuthorizedClient = await createHub({
      options: {
        wallet: authorizedWallet,
      },
    });

    const authorizedClient = createClient({
      api: { auth },
      hub: hubForAuthorizedClient,
      conversation: {
        peerAddress: hubForServer.address,
        context: { conversationId: "banyan.sh/brpc", metadata: {} },
      },
    });

    authorizedClient.start();

    await hubForAuthorizedClient.start();

    CLEANUP.push(hubForAuthorizedClient.stop);

    const unauthorizedResult = await unauthorizedClient.api.auth();

    if (unauthorizedResult.ok) {
      throw new Error("auth should have failed for unauthorized client");
    }

    const authorizedResult = await authorizedClient.api.auth();

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
