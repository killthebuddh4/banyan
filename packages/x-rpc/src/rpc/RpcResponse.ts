import { RpcError } from "./RpcError.js";

export type RpcResponse = SuccessResponse | ErrorResponse;

type SuccessResponse = {
  id: string;
  result: unknown;
};

type ErrorResponse = {
  id: string;
  error: RpcError;
};
