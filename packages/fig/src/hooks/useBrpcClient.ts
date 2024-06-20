import { z } from "zod";
import * as Brpc from "@killthebuddha/brpc/brpc.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { v4 as uuidv4 } from "uuid";
import { useSendMessage } from "./useSendMessage.js";
import { Message } from "../remote/Message.js";
import { Signer } from "../remote/Signer.js";
import { useListenToGlobalMessageStream } from "./useListenToGlobalMessageStream.js";
import { useState, useEffect, useMemo } from "react";

type Sub = ({
  ctx,
  response,
}: {
  ctx: { unsubscribe: () => void };
  response: Brpc.BrpcResponse;
}) => void;

export const useBrpcClient = <A extends Brpc.BrpcApi>(props: {
  api: A;
  address: string;
  wallet?: Signer;
  options?: {
    timeoutMs?: number;
    conversationIdPrefix?: string;
    onSelfSentMessage?: ({ message }: { message: Message }) => void;
    onReceivedInvalidJson?: ({ message }: { message: Message }) => void;
    onReceivedInvalidResponse?: ({ message }: { message: Message }) => void;
    onNoSubscription?: ({ message }: { message: Message }) => void;
    onCreateXmtpError?: () => void;
    onCreateStreamError?: () => void;
    onCreateStreamSuccess?: () => void;
    onCreateConversationError?: () => void;
    onHandlerError?: () => void;
    onSendFailed?: () => void;
  };
}) => {
  const wallet = useMemo(() => props.wallet, [props.wallet?.address]);
  const listen = useListenToGlobalMessageStream({ wallet });
  const send = useSendMessage({ wallet });

  const prefix = (() => {
    if (props.options?.conversationIdPrefix) {
      return props.options.conversationIdPrefix;
    }

    return "banyan.sh/brpc";
  })();

  const [subscriptions, setSubscriptions] = useState<
    Record<string, Sub | undefined>
  >({});

  const unsubscribe = ({ id }: { id: string }) => {
    const subscription = subscriptions[id];

    if (subscription === undefined) {
      return;
    }

    setSubscriptions((state) => {
      return {
        ...state,
        [id]: undefined,
      };
    });
  };

  useEffect(() => {
    if (listen === null) {
      return;
    }

    listen((message: Message) => {
      if (message.senderAddress !== props.address) {
        return;
      }

      if (message.conversation.context === undefined) {
        return;
      }

      if (!message.conversation.context.conversationId.startsWith(prefix)) {
        return;
      }

      const json = jsonStringSchema.safeParse(message.content);

      if (!json.success) {
        if (props.options?.onReceivedInvalidJson) {
          try {
            props.options.onReceivedInvalidJson({ message });
          } catch (error) {
            console.warn("onReceivedInvalidJson threw an error", error);
          }
        }
        return;
      }

      const response = Brpc.brpcResponseSchema.safeParse(json.data);

      if (!response.success) {
        if (props.options?.onReceivedInvalidResponse) {
          try {
            props.options.onReceivedInvalidResponse({ message });
          } catch (error) {
            console.warn("onReceivedInvalidResponse threw an error", error);
          }
        }
        return;
      }

      const subscription = subscriptions[response.data.id];

      if (subscription === undefined) {
        if (props.options?.onNoSubscription) {
          try {
            props.options.onNoSubscription({ message });
          } catch (error) {
            console.warn("onNoSubscription threw an error", error);
          }
        }
        return;
      }

      subscription({
        ctx: {
          unsubscribe: () => {
            unsubscribe({ id: response.data.id });
          },
        },
        response: response.data,
      });
    });
    // TODO, make sure this dependency list is exhausive
  }, [listen, subscriptions]);

  return useMemo<null | Brpc.BrpcClient<typeof props.api>>(() => {
    if (send === null) {
      console.log("FIG :: useBrpcClient :: send is null");
      return null;
    }

    const tmp: Brpc.BrpcClient<typeof props.api> = {} as Brpc.BrpcClient<
      typeof props.api
    >;

    for (const [key, value] of Object.entries(props.api)) {
      (tmp as any)[key as keyof typeof props.api] = async (
        input: z.infer<typeof value.input>
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
          }, props.options?.timeoutMs ?? 10000);

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

          subscriptions[request.id] = subscription;
        });

        try {
          // await send({
          //   conversation: {
          //     peerAddress: address,
          //     context: {
          //       conversationId: prefix,
          //     },
          //   },
          //   content: str,
          // });
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

    return tmp;
  }, [send, subscriptions]);
};
