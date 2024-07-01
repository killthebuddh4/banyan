import { z } from "zod";
import * as Brpc from "./brpc.js";
import { v4 as uuidv4 } from "uuid";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { Message } from "./Message.js";

export const createClient = <A extends Brpc.BrpcApi>({
  api,
  hub,
  conversation,
  options,
}: {
  api: A;
  hub: {
    address: string;
    subscribe: (handler: (message: Message) => void) => {
      unsubscribe: () => void;
    };
    publish: (args: {
      conversation: {
        peerAddress: string;
        context: { conversationId: string; metadata: {} };
      };
      content: string;
    }) => Promise<Message>;
  };
  conversation: {
    peerAddress: string;
    context: { conversationId: string; metadata: {} };
  };
  options?: {
    timeoutMs?: number;
    onSelfSentMessage?: ({ message }: { message: Message }) => void;
    onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
    onReceivedInvalidResponse?: ({ message }: { message: Message }) => void;
    onNoSubscription?: ({ message }: { message: Message }) => void;
    onEndpointError?: () => void;
    onTimeout?: () => void;
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
    onSendRequestFailed?: () => void;
  };
}) => {
  const requests: Map<
    string,
    ({
      ctx,
      response,
    }: {
      ctx: { detach: () => void };
      response: Brpc.BrpcResponse;
    }) => void
  > = new Map();

  const start = () => {
    const stop = hub.subscribe(async (message) => {
      if (message.senderAddress === hub.address) {
        if (options?.onSelfSentMessage) {
          try {
            options.onSelfSentMessage({ message });
          } catch (error) {
            console.warn("onSelfSentMessage threw an error", error);
          }
        }
      }

      // TODO, Handle skipped messages in a more observable way

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

      const endpoint = requests.get(response.data.id);

      if (endpoint === undefined) {
        if (options?.onNoSubscription) {
          try {
            options.onNoSubscription({ message });
          } catch (error) {
            console.warn("onNoSubscription threw an error", error);
          }
        }
        return;
      }

      try {
        endpoint({
          ctx: {
            detach: () => {
              const endpoint = requests.get(response.data.id);

              if (endpoint === undefined) {
                return;
              }

              requests.delete(response.data.id);
            },
          },
          response: response.data,
        });
      } catch {
        if (options?.onEndpointError) {
          try {
            options.onEndpointError();
          } catch (error) {
            console.warn("onEndpointError threw an error", error);
          }
        }
      }
    });

    return { stop };
  };

  const client: Brpc.BrpcClient<typeof api> = {} as Brpc.BrpcClient<typeof api>;

  for (const [key, value] of Object.entries(api)) {
    (client as any)[key as keyof typeof api] = async (
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
          if (options?.onTimeout) {
            try {
              options.onTimeout();
            } catch (error) {
              console.warn("onTimeout threw an error", error);
            }
          }

          resolve({
            ok: false,
            code: "REQUEST_TIMEOUT",
            request,
            response: null,
          });
        }, options?.timeoutMs ?? 10000);

        const endpoint = ({
          ctx,
          response,
        }: {
          ctx: { detach: () => void };
          response: Brpc.BrpcResponse;
        }) => {
          ctx.detach();
          clearTimeout(timeout);

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

        requests.set(request.id, endpoint);
      });

      try {
        const sendRequestArgs = {
          conversation: conversation,
          content: str,
        };

        if (options?.onSendingRequest) {
          try {
            options.onSendingRequest(sendRequestArgs);
          } catch (error) {
            console.warn("onSendingRequest threw an error", error);
          }
        }

        const sent = await hub.publish(sendRequestArgs);

        if (options?.onSentRequest) {
          try {
            options.onSentRequest({ message: sent });
          } catch (error) {
            console.warn("onSentRequest threw an error", error);
          }
        }
      } catch {
        if (options?.onSendRequestFailed) {
          try {
            options.onSendRequestFailed();
          } catch (error) {
            console.warn("onSendRequestFailed threw an error", error);
          }
        }

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

  return { start, api: client };
};
