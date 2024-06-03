type Success<D> = {
  ok: true;
  status: "OK";
  data: D;
};

type ClientError = {
  ok: false;
  status:
    | "INVALID_INPUT"
    | "INVALID_RESPONSE"
    | "INVALID_OUTPUT_TYPE"
    | "REQUEST_TIMEOUT";
  data?: undefined;
};

type ServerError = {
  ok: false;
  status: "INTERNAL_ERROR" | "INVALID_INPUT" | "UNDEFINED_PROCEDURE";
  data?: undefined;
};

export type Result<D> = Success<D> | ClientError | ServerError;
