import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { createRouter } from "./createRouter.js";
import { createClient } from "./createClient.js";

/* ***********************************************************
 *
 * TRANSPORT
 *
 * ***********************************************************/

export const brpcRequestSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  payload: z.unknown(),
});

export type BrpcRequest = z.infer<typeof brpcRequestSchema>;

export const brpcResponseSchema = z.object({
  id: z.string().uuid(),
  payload: z.unknown(),
});

export type BrpcResponse = z.infer<typeof brpcResponseSchema>;

/* ***********************************************************
 *
 * API, CLIENT, ROUTER
 *
 * ***********************************************************/

export type BrpcApi = {
  [key: string]: {
    input: z.ZodTypeAny;
    output: z.ZodTypeAny;
  };
};

export type BrpcClient<A extends BrpcApi> = {
  [K in keyof A]: ({
    input,
  }: {
    input: z.infer<A[K]["input"]>;
  }) => Promise<BrpcResult<z.infer<A[K]["output"]>>>;
};

export type BrpcContext = {
  id: string;
  message: {
    id: string;
    senderAddress: string;
  };
};

export type BrpcRouter<A extends BrpcApi> = {
  [K in keyof A]: {
    name: K;
    inputSchema: A[K]["input"];
    handler: ({
      context,
      input,
    }: {
      context: {
        id: string;
        message: {
          id: string;
          senderAddress: string;
        };
      };
      input: z.infer<A[K]["input"]>;
    }) => Promise<z.infer<A[K]["output"]>>;
  };
};

export type BrpcSubscription<E> = ({
  context,
  message,
}: {
  context: BrpcContext;
  message: DecodedMessage;
}) => Promise<AsyncGenerator<E, void, unknown>>;

/* ***********************************************************
 *
 * PROTOCOL
 *
 * ***********************************************************/

export const brpcErrorSchema = z.object({
  ok: z.literal(false),
  code: z.union([
    z.literal("INPUT_SERIALIZATION_FAILED"),
    z.literal("XMTP_SEND_FAILED"),
    z.literal("UNKNOWN_PROCEDURE"),
    z.literal("INPUT_TYPE_MISMATCH"),
    z.literal("OUTPUT_TYPE_MISMATCH"),
    z.literal("OUTPUT_SERIALIZATION_FAILED"),
    z.literal("INVALID_RESPONSE"),
    z.literal("REQUEST_TIMEOUT"),
    z.literal("SERVER_ERROR"),
  ]),
  request: brpcRequestSchema,
  response: brpcResponseSchema.or(z.null()),
});

export type BrpcError = z.infer<typeof brpcErrorSchema>;

export const brpcSuccessSchema = z.object({
  ok: z.literal(true),
  code: z.literal("SUCCESS"),
  data: z.unknown(),
});

export type BrpcResult<D> =
  | BrpcError
  | {
      ok: true;
      code: "SUCCESS";
      data: D;
    };
