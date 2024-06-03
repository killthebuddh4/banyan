type ClientError = {
  ok: false;
  error: "ClientError";
};

type ServerError = {
  ok: false;
  data?: undefined;
  error: "ServerError";
  response: {
    jsonrpc: "2.0";
    result?: undefined;
    id: string | null;
    error: {
      code: number;
      message: string;
      data: {
        description: string;
      };
    };
  };
};

type Success<D> = {
  ok: true;
  data: D;
  error?: undefined;
  response: {
    jsonrpc: "2.0";
    result?: unknown;
    id: string;
  };
};

type ClientServerMismatch = {
  ok: false;
  data?: undefined;
  error: "ClientServerMismatch";
};

type Result<D> = ClientError | ServerError | Success<D> | ClientServerMismatch;
