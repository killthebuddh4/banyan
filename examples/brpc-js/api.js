import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

export const pub = createProcedure({
  auth: async () => true,
  handler: async () => {
    return "Hi, please sign up!";
  },
});

const users = [];

export const signup = createProcedure({
  auth: async () => true,
  handler: async (_, context) => {
    users.push(context.message.senderAddress);
    return "You have signed up!";
  },
});

export const access = createProcedure({
  auth: async ({ context }) => {
    return users.find((u) => u === context.message.senderAddress) !== undefined;
  },
  handler: async () => {
    return "You have access to the secret!";
  },
});
