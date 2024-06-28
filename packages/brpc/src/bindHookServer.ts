import { z } from "zod";
import { bindServer } from "./bindServer.js";
import { bindClient } from "./bindClient.js";
import * as Brpc from "./brpc.js";
import { createProcedure } from "./createProcedure.js";
import { Message } from "./Message.js";

export const bindHookServer = <A extends Brpc.BrpcApi>(args: {
  api: A;
  xmtp: {
    address: string;
    subscribe: (handler: (message: Message) => void) => void;
    publish: (args: {
      conversation: {
        peerAddress: string;
        context?: { conversationId: string; metadata: {} };
      };
      content: string;
    }) => Promise<Message>;
  };
  options?: {
    client?: {
      timeoutMs?: number;
      onSelfSentMessage?: ({ message }: { message: Message }) => void;
      onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
      onReceivedInvalidResponse?: ({ message }: { message: Message }) => void;
      onNoSubscription?: ({ message }: { message: Message }) => void;
      onHandlerError?: () => void;
      onSendingRequest?: ({
        conversation,
        content,
      }: {
        conversation: {
          peerAddress: string;
          context?: { conversationId: string };
        };
        content: string;
      }) => void;
      onSentRequest?: ({ message }: { message: Message }) => void;
      onSendFailed?: () => void;
    };
    server?: {
      conversationIdPrefix?: string;
      onMessage?: ({ message }: { message: Message }) => void;
      onSelfSentMessage?: ({ message }: { message: Message }) => void;
      onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
      onReceivedInvalidRequest?: ({ message }: { message: Message }) => void;
      onHandlerError?: () => void;
      onUnknownProcedure?: () => void;
      onAuthError?: () => void;
      onUnauthorized?: () => void;
      onInputTypeMismatch?: () => void;
      onSerializationError?: () => void;
      onHandlingMessage?: () => void;
      onResponseSent?: ({ sent }: { sent: Message }) => void;
      onSendFailed?: () => void;
    };
  };
}) => {
  // LHS is peerAddress, RHS is names of procedures
  const attached = new Map<string, Brpc.BrpcClient<typeof args.api>>();

  const attach = createProcedure({
    auth: async () => true,
    handler: async (_, ctx) => {
      try {
        const existing = attached.get(ctx.message.senderAddress);

        if (existing !== undefined) {
          return { attached: true };
        }

        const client = bindClient({
          api: args.api,
          conversation: {
            peerAddress: ctx.message.senderAddress,
            context: {
              conversationId: "banyan.sh/brpc",
              metadata: {},
            },
          },
          xmtp: args.xmtp,
          options: args.options?.client,
        });

        attached.set(ctx.message.senderAddress, client);

        return { attached: true };
      } catch (error) {
        attached.delete(ctx.message.senderAddress);

        return { attached: false };
      }
    },
  });

  const detach = createProcedure({
    auth: async () => true,
    handler: async (_, ctx) => {
      attached.delete(ctx.message.senderAddress);

      return { detached: true };
    },
  });

  const api = { attach, detach };

  bindServer({
    api,
    xmtp: args.xmtp,
    options: args.options?.server,
  });

  const brpcClient: FunctionsToArrayReturns<Brpc.BrpcClient<typeof args.api>> =
    {} as FunctionsToArrayReturns<Brpc.BrpcClient<typeof args.api>>;

  for (const [key, value] of Object.entries(args.api)) {
    (brpcClient as any)[key as keyof typeof args.api] = async (
      input: z.infer<typeof value.input>,
    ) => {
      const clients = Array.from(attached.values());

      return Promise.all(
        clients.map(async (client) => {
          return client[key as keyof typeof args.api](input);
        }),
      );
    };
  }

  return brpcClient;
};

type FunctionsToArrayReturns<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>[]>
    : never;
};
