import { ErrorCode } from "./ErrorCode.js";

export class RpcError extends Error {
  public code: ErrorCode;

  constructor(message: string, code: ErrorCode) {
    super(message);
    this.code = code;
  }
}
