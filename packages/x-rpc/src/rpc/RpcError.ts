export type RpcError =
  | ParseError
  | BadRequest
  | InvalidParams
  | Unauthorized
  | Forbidden
  | NotFound
  | MethodNotSupported
  | Timeout
  | Conflict
  | PreconditionFailed
  | PayloadTooLarge
  | RateLimited
  | ClientClosedRequest
  | InternalError;

type ParseError = {
  code: -32700;
  message: string;
  data: {
    label: "parse-error";
    description: string;
  };
};

type BadRequest = {
  code: -32600;
  message: string;
  data: {
    label: "bad-request";
    description: string;
  };
};

type InvalidParams = {
  code: -32602;
  message: string;
  data: {
    label: "invalid-params";
    description: string;
  };
};

type Unauthorized = {
  code: -32001;
  message: string;
  data: {
    label: "unauthorized";
    description: string;
  };
};

type Forbidden = {
  code: -32003;
  message: string;
  data: {
    label: "forbidden";
    description: string;
  };
};

type NotFound = {
  code: -32004;
  message: string;
  data: {
    label: "not-found";
    description: string;
  };
};

type MethodNotSupported = {
  code: -32005;
  message: string;
  data: {
    label: "method-not-supported";
    description: string;
  };
};

type Timeout = {
  code: -32008;
  message: string;
  data: {
    label: "timeout";
    description: string;
  };
};

type Conflict = {
  code: -32009;
  message: string;
  data: {
    label: "conflict";
    description: string;
  };
};

type PreconditionFailed = {
  code: -32012;
  message: string;
  data: {
    label: "precondition-failed";
    description: string;
  };
};

type PayloadTooLarge = {
  code: -32013;
  message: string;
  data: {
    label: "payload-too-large";
    description: string;
  };
};

type RateLimited = {
  code: null;
  message: string;
  data: {
    label: "rate-limited";
    description: string;
  };
};

type ClientClosedRequest = {
  code: -32009;
  message: string;
  data: {
    label: "client-closed-request";
    description: string;
  };
};

type InternalError = {
  code: -32603;
  message: string;
  data: {
    label: "internal-error";
    description: string;
  };
};
