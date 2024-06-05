import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";

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
 * PROCEDURE, CLIENT, API
 *
 * ***********************************************************/

export type BrpcProcedure<
  I extends z.ZodTypeAny = any,
  O extends z.ZodTypeAny = any,
> = {
  input: I;
  output: O;
  acl: BrpcAcl;
  handler: ({
    context,
    input,
  }: {
    context: BrpcContext;
    input: z.infer<I>;
  }) => Promise<z.infer<O>>;
};

export type BrpcApi = {
  [key: string]: BrpcProcedure;
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

export type BrpcAcl =
  | {
      type: "public";
    }
  | {
      type: "private";
      allow: ({ context }: { context: BrpcContext }) => Promise<boolean>;
    };

/* ***********************************************************
 *
 * RETURN VALUES
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
    z.literal("UNAUTHORIZED"),
    z.literal("REQUEST_TIMEOUT"),
    z.literal("SERVER_ERROR"),
  ]),
});

export type BrpcError = z.infer<typeof brpcErrorSchema>;

export const brpcSuccessSchema = z.object({
  ok: z.literal(true),
  code: z.literal("SUCCESS"),
  data: z.unknown(),
});

export type BrpcResult<D> = (
  | BrpcError
  | {
      ok: true;
      code: "SUCCESS";
      data: D;
    }
) & {
  request: BrpcRequest;
  response: BrpcResponse | null;
};
