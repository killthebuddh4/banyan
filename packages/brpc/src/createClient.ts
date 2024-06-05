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
    onSelfSentMessage?: ({ message }: { message: DecodedMessage }) => void;
    onSkipMessage?: ({ message }: { message: DecodedMessage }) => void;
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

  let xmtp;
  try {
    xmtp = await Client.create(wallet, { env: xmtpEnv });
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

  const stream = await (async () => {
    try {
      return await xmtp.conversations.streamAllMessages();
    } catch (error) {
      if (options?.onCreateStreamError) {
        options.onCreateStreamError();
      }
      throw error;
    }
  })();

  const conversation = await (async () => {
    try {
      return await xmtp.conversations.newConversation(address);
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
      message,
    }: {
      ctx: { unsubscribe: () => void };
      message: DecodedMessage;
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
        if (options?.onSkipMessage) {
          try {
            options.onSkipMessage({ message });
          } catch (error) {
            console.warn("onSkipMessage threw an error", error);
          }
        }
        continue;
      }

      const response = Brpc.brpcResponseSchema.safeParse(json.data);

      if (!response.success) {
        if (options?.onSkipMessage) {
          try {
            options.onSkipMessage({ message });
          } catch (error) {
            console.warn("onSkipMessage threw an error", error);
          }
        }
        continue;
      }

      const subscription = subscriptions.get(response.data.id);

      if (subscription === undefined) {
        if (options?.onSkipMessage) {
          try {
            options.onSkipMessage({ message });
          } catch (error) {
            console.warn("onSkipMessage threw an error", error);
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
        message,
      });
    }
  })();

  const brpcClient: Brpc.BrpcClient<typeof api> = {} as Brpc.BrpcClient<
    typeof api
  >;

  for (const [key, value] of Object.entries(api)) {
    brpcClient[key as keyof typeof api] = async ({
      input,
    }: {
      input: z.infer<typeof value.input>;
    }) => {
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
          message,
        }: {
          ctx: { unsubscribe: () => void };
          message: DecodedMessage;
        }) => {
          const json = jsonStringSchema.safeParse(message.content);

          if (!json.success) {
            // TODO
            return;
          }

          const response = Brpc.brpcResponseSchema.safeParse(json.data);

          if (!response.success) {
            // TODO
            return;
          }

          if (response.data.id !== request.id) {
            // TODO
            return;
          }

          clearTimeout(timeout);
          ctx.unsubscribe();

          const error = Brpc.brpcErrorSchema.safeParse(response.data.payload);

          if (error.success) {
            resolve({
              ok: false,
              code: error.data.code,
              request,
              response: response.data,
            });
          }

          const success = Brpc.brpcSuccessSchema.safeParse(
            response.data.payload,
          );

          if (success.success) {
            const output = value.output.safeParse(success.data.data);

            if (!output.success) {
              resolve({
                ok: false,
                code: "OUTPUT_TYPE_MISMATCH",
                request,
                response: response.data,
              });
            }

            resolve({
              ok: true,
              code: "SUCCESS",
              data: output.data,
              request,
              response: response.data,
            });
          }

          resolve({
            ok: false,
            code: "INVALID_RESPONSE",
            request,
            response: response.data,
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
    client: brpcClient,
    close: async () => {
      return await stream.return(null);
    },
  };
};
