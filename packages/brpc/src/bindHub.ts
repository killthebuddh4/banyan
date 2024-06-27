import { z } from "zod";
import * as Brpc from "./brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { v4 as uuidv4 } from "uuid";
import { Message } from "./Message.js";

export const bindHub = <P extends Brpc.BrpcProcedure>({
  xmtp,
  options,
}: {
  xmtp: {
    address: string;
    subscribe: (handler: (message: Message) => void) => void;
    publish: (args: {
      conversation: {
        peerAddress: string;
        context: { conversationId: string; metadata: {} };
      };
      content: string;
    }) => Promise<Message>;
  };
  options?: {
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
    onStartBroadcast?: () => void;
    onBroadcastFailed?: () => void;
    onBroadcastSuccess?: () => void;
  };
}) => {
  const createSub = (): Map<
    string,
    ({
      ctx,
      response,
    }: {
      ctx: { unsubscribe: () => void };
      response: Brpc.BrpcResponse;
    }) => void
  > => new Map();

  const subscriptions = conversation.peerAddresses.reduce(
    (acc, peerAddress) => {
      acc[peerAddress] = createSub();
      return acc;
    },
    {} as Record<string, ReturnType<typeof createSub>>,
  );

  const unsubscribe = ({
    peerAddress,
    id,
  }: {
    peerAddress: string;
    id: string;
  }) => {
    const subscription = subscriptions[peerAddress].get(id);

    if (subscription === undefined) {
      return;
    }

    subscriptions[peerAddress].delete(id);
  };

  console.log(
    "BRPC :: bindClient :: binding to xmtp (args.xmtp.subscribe called)",
  );
  xmtp.subscribe(async (message) => {
    if (message.senderAddress === xmtp.address) {
      return;
    }

    if (message.conversation.context === undefined) {
      return;
    }

    if (
      message.conversation.context.conversationId !==
      conversation.context?.conversationId
    ) {
      return;
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
      return;
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
      return;
    }

    const subscription = subscriptions[message.conversation.peerAddress].get(
      response.data.id,
    );

    if (subscription === undefined) {
      if (options?.onNoSubscription) {
        try {
          options.onNoSubscription({ message });
        } catch (error) {
          console.warn("onNoSubscription threw an error", error);
        }
      }
      return;
    }

    subscription({
      ctx: {
        unsubscribe: () => {
          unsubscribe({
            peerAddress: message.conversation.peerAddress,
            id: response.data.id,
          });
        },
      },
      response: response.data,
    });
  });

  return async (input: z.infer<typeof procedure.input>) => {
    const request = {
      id: uuidv4(),
      name,
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

    const promises = conversation.peerAddresses.map(async (peerAddress) => {
      return new Promise<Brpc.BrpcResult<z.infer<typeof procedure.output>>>(
        (resolve) => {
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
              const output = procedure.output.safeParse(success.data.data);

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

          subscriptions[peerAddress].set(request.id, subscription);
        },
      );
    });

    try {
      if (options?.onStartBroadcast) {
        try {
          options.onStartBroadcast();
        } catch (error) {
          console.warn("onStartBroadcast threw an error", error);
        }
      }

      await Promise.all(
        conversation.peerAddresses.map((peerAddress) => {
          return (async () => {
            const sendRequestArgs = {
              conversation: {
                peerAddress,
                context: conversation.context,
              },
              content: str,
            };

            if (options?.onSendingRequest) {
              try {
                options.onSendingRequest(sendRequestArgs);
              } catch (error) {
                console.warn("onSendingRequest threw an error", error);
              }
            }

            const sent = await xmtp.publish(sendRequestArgs);

            if (options?.onSentRequest) {
              try {
                options.onSentRequest({ message: sent });
              } catch (error) {
                console.warn("onSentRequest threw an error", error);
              }
            }
          })();
        }),
      );
    } catch {
      if (options?.onBroadcastFailed) {
        try {
          options.onBroadcastFailed();
        } catch (error) {
          console.warn("onBroadcastFailed threw an error", error);
        }
      }

      return {
        ok: false,
        code: "XMTP_BROADCAST_FAILED",
        request,
        response: null,
      };
    }

    return promises;
  };
};
