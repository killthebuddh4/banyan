import { Wallet } from "@ethersproject/wallet";
import { z } from "zod";
import { Client, DecodedMessage } from "@xmtp/xmtp-js";
import * as Brpc from "./brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { v4 as uuidv4 } from "uuid";

export const createClient = async <A extends Brpc.BrpcApi>({
  api,
  address,
  options,
}: {
  api: A;
  address: string;
  options?: {
    wallet?: Wallet;
    xmtpEnv?: "dev" | "production";
    timeoutMs?: number;
    conversationIdPrefix?: string;
    onSelfSentMessage?: ({ message }: { message: DecodedMessage }) => void;
    onReceivedInvalidJson?: ({ message }: { message: DecodedMessage }) => void;
    onReceivedInvalidResponse?: ({
      message,
    }: {
      message: DecodedMessage;
    }) => void;
    onNoSubscription?: ({ message }: { message: DecodedMessage }) => void;
    onCreateXmtpError?: () => void;
    onCreateStreamError?: () => void;
    onCreateStreamSuccess?: () => void;
    onCreateConversationError?: () => void;
    onHandlerError?: () => void;
    onSendFailed?: () => void;
  };
}) => {
  const wallet = (() => {
    if (options?.wallet) {
      return options.wallet;
    }

    return Wallet.createRandom();
  })();

  const xmtpEnv = (() => {
    if (options?.xmtpEnv) {
      return options.xmtpEnv;
    }

    return "dev";
  })();

  const xmtp = await (async () => {
    try {
      return await Client.create(wallet, { env: xmtpEnv });
    } catch (error) {
      if (options?.onCreateXmtpError) {
        try {
          options.onCreateXmtpError();
        } catch (error) {
          console.warn("onCreateXmtpError threw an error", error);
        }
      }

      throw error;
    }
  })();

  const prefix = (() => {
    if (options?.conversationIdPrefix) {
      return options.conversationIdPrefix;
    }

    return "banyan.sh/brpc";
  })();

  const conversation = await (async () => {
    try {
      return await xmtp.conversations.newConversation(address, {
        conversationId: prefix,
        metadata: {},
      });
    } catch (error) {
      if (options?.onCreateConversationError) {
        try {
          options.onCreateConversationError();
        } catch (error) {
          console.warn("onCreateConversationError threw an error", error);
        }
      }
      throw error;
    }
  })();

  const stream = await (async () => {
    try {
      return await conversation.streamMessages();
    } catch (error) {
      if (options?.onCreateStreamError) {
        options.onCreateStreamError();
      }
      throw error;
    }
  })();

  try {
    if (options?.onCreateStreamSuccess) {
      options.onCreateStreamSuccess();
    }
  } catch (error) {
    console.warn("onCreateStreamSuccess threw an error", error);
  }

  const subscriptions: Map<
    string,
    ({
      ctx,
      response,
    }: {
      ctx: { unsubscribe: () => void };
      response: Brpc.BrpcResponse;
    }) => void
  > = new Map();

  const unsubscribe = ({ id }: { id: string }) => {
    const subscription = subscriptions.get(id);

    if (subscription === undefined) {
      return;
    }

    subscriptions.delete(id);
  };

  (async () => {
    for await (const message of stream) {
      if (message.senderAddress === xmtp.address) {
        continue;
      }

      const json = jsonStringSchema.safeParse(message.content);

      if (!json.success) {
        if (options?.onReceivedInvalidJson) {
          try {
            options.onReceivedInvalidJson({ message });
          } catch (error) {
            console.warn("onReceivedInvalidJson threw an error", error);
          }
        }
        continue;
      }

      const response = Brpc.brpcResponseSchema.safeParse(json.data);

      if (!response.success) {
        if (options?.onReceivedInvalidResponse) {
          try {
            options.onReceivedInvalidResponse({ message });
          } catch (error) {
            console.warn("onReceivedInvalidResponse threw an error", error);
          }
        }
        continue;
      }

      const subscription = subscriptions.get(response.data.id);

      if (subscription === undefined) {
        if (options?.onNoSubscription) {
          try {
            options.onNoSubscription({ message });
          } catch (error) {
            console.warn("onNoSubscription threw an error", error);
          }
        }
        continue;
      }

      subscription({
        ctx: {
          unsubscribe: () => {
            unsubscribe({ id: response.data.id });
          },
        },
        response: response.data,
      });
    }
  })();

  const brpcClient: Brpc.BrpcClient<typeof api> = {} as Brpc.BrpcClient<
    typeof api
  >;

  for (const [key, value] of Object.entries(api)) {
    (brpcClient as any)[key as keyof typeof api] = async (
      input: z.infer<typeof value.input>,
    ) => {
      const request = {
        id: uuidv4(),
        name: key,
        payload: input,
      };

      let str: string;
      try {
        str = JSON.stringify(request);
      } catch {
        return {
          ok: false,
          code: "INPUT_SERIALIZATION_FAILED",
          request,
          response: null,
        };
      }

      const promise = new Promise<
        Brpc.BrpcResult<z.infer<typeof value.output>>
      >((resolve) => {
        const timeout = setTimeout(() => {
          resolve({
            ok: false,
            code: "REQUEST_TIMEOUT",
            request,
            response: null,
          });
        }, options?.timeoutMs ?? 10000);

        const subscription = ({
          ctx,
          response,
        }: {
          ctx: { unsubscribe: () => void };
          response: Brpc.BrpcResponse;
        }) => {
          clearTimeout(timeout);
          ctx.unsubscribe();

          const error = Brpc.brpcErrorSchema.safeParse(response.payload);

          if (error.success) {
            resolve({
              ok: false,
              code: error.data.code,
              request,
              response,
            });
          }

          const success = Brpc.brpcSuccessSchema.safeParse(response.payload);

          if (success.success) {
            const output = value.output.safeParse(success.data.data);

            if (!output.success) {
              resolve({
                ok: false,
                code: "OUTPUT_TYPE_MISMATCH",
                request,
                response,
              });
            }

            resolve({
              ok: true,
              code: "SUCCESS",
              data: output.data,
              request,
              response,
            });
          }

          resolve({
            ok: false,
            code: "INVALID_RESPONSE",
            request,
            response,
          });
        };

        subscriptions.set(request.id, subscription);
      });

      try {
        await conversation.send(str);
      } catch {
        return {
          ok: false,
          code: "XMTP_SEND_FAILED",
          request,
          response: null,
        };
      }

      return promise;
    };
  }

  return {
    api: brpcClient,
    close: async () => {
      return await stream.return();
    },
  };
};
