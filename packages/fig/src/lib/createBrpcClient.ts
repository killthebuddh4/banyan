import { z } from "zod";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../remote/Message.js";
import { Actions } from "../remote/Actions.js";

export const createBrpcClient = <A extends Brpc.BrpcApi>({
  api,
  listen,
  sendMessage,
  conversation,
  clientAddress,
  options,
}: {
  api: A;
  conversation: {
    peerAddress: string;
    context?: { conversationId: string; metadata: {} };
  };
  clientAddress: string;
  listen: (handler: (message: Message) => void) => void;
  sendMessage: Actions["sendMessage"];
  options?: {
    timeoutMs?: number;
    onSelfSentMessage?: ({ message }: { message: Message }) => void;
    onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
    onReceivedInvalidResponse?: ({ message }: { message: Message }) => void;
    onNoSubscription?: ({ message }: { message: Message }) => void;
    onHandlerError?: () => void;
    onSendFailed?: () => void;
  };
}) => {
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

  listen(async (message) => {
    console.log(
      "FIG :: createBrpcCLient :: listen got a message",
      message.content
    );

    if (message.senderAddress === clientAddress) {
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

    const subscription = subscriptions.get(response.data.id);

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

    console.log("FIG :: createBrpcClient :: calling subscription");

    subscription({
      ctx: {
        unsubscribe: () => {
          unsubscribe({ id: response.data.id });
        },
      },
      response: response.data,
    });
  });

  const brpcClient: Brpc.BrpcClient<typeof api> = {} as Brpc.BrpcClient<
    typeof api
  >;

  for (const [key, value] of Object.entries(api)) {
    (brpcClient as any)[key as keyof typeof api] = async (
      input: z.infer<typeof value.input>
    ) => {
      console.log(
        "FIG :: createBrpcClient :: the client-side method was called"
      );

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
        console.log("FIG :: createBrpcClient :: sending message", {
          conversation,
          str,
        });
        const sent = await sendMessage({ conversation, content: str });

        console.log("FIG :: createBrpcClient :: sent message", sent);
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

  return brpcClient;
};
