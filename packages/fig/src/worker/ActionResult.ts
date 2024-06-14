type ActionSuccess<T> = {
  ok: true;
  code: "SUCCESS";
  data: T;
};

type ActionNotReady = {
  ok: false;
  code: "NOT_READY";
  error: string;
};

type ActionBadInput = {
  ok: false;
  code: "BAD_INPUT";
  error: string;
};

type ActionError = {
  ok: false;
  code: "WORKER_ERROR";
  error: string;
};

export type ActionResult<T> =
  | ActionSuccess<T>
  | ActionNotReady
  | ActionBadInput
  | ActionError;
