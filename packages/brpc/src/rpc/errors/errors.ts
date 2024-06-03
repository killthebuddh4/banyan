export const errors = {
  PARSE_ERROR: {
    code: -32700,
    description:
      "This error occurs when the server cannot JSON.parse the XMTP message content.",
  },
  INVALID_REQUEST: {
    code: -32600,
    description:
      "This error occurs when the JSON sent is not a valid Request object.",
  },
  METHOD_NOT_FOUND: {
    code: -32601,
    description: "This error occurs when the requested method does not exist.",
  },
  INVALID_PARAMS: {
    code: -32602,
    description: "This error occurs when the method params are invalid.",
  },
  INTERNAL_SERVER_ERROR: {
    code: -32603,
    description:
      "This error occurs when the server encouters an unexpected error.",
  },
  UNAUTHORIZED: {
    code: -32001,
    description: "This error occurs when the client is not authorized.",
  },
  FORBIDDEN: {
    code: -32003,
    description:
      "This error occurs when the XMTP message sender is not allowed to perform the requested action.",
  },
  NOT_FOUND: {
    code: -32004,
    description: "This error occurs when the requested resource is not found.",
  },
} as const;
