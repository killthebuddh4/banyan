export type RpcOptions = {
  onJsonParseError?: () => void;
  onRequestParseError?: ({ json }: { json: string }) => void;
  onMethodNotFound?: ({ attempted }: { attempted: string }) => void;
  onInvalidParams?: ({ method }: { method: string }) => void;
  onMethodCalled?: ({ method }: { method: string }) => void;
  onHandlerError?: ({ method }: { method: string }) => void;
  onServerError?: ({ error }: { error: unknown }) => void;
};
