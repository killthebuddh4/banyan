type ActionSuccess<T> = {
  ok: true;
  code: "SUCCESS";
  data: T;
  error?: undefined;
};

type ActionNoOp = {
  ok: false;
  code: "NO_OP";
  data?: undefined;
  error: string;
};

type ActionNotReady = {
  ok: false;
  code: "NOT_READY";
  data?: undefined;
  error: string;
};

type ActionBadInput = {
  ok: false;
  code: "BAD_INPUT";
  data?: undefined;
  error: string;
};

type ActionRemoteError = {
  ok: false;
  code: "REMOTE_ERROR";
  data?: undefined;
  error: string;
};

export type ActionResult<T> =
  | ActionSuccess<T>
  | ActionNotReady
  | ActionNoOp
  | ActionBadInput
  | ActionRemoteError;
