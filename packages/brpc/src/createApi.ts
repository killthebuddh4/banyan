import * as Brpc from "./brpc.js";

type WithouInputSchema<A extends Brpc.BrpcApi<any>> = {
  [K in keyof A]: Omit<A[K], "inputSchema">;
};

export const createApi = <A extends Brpc.BrpcSpec>({
  spec,
  api,
}: {
  spec: A;
  api: WithouInputSchema<Brpc.BrpcApi<A>>;
}): Brpc.BrpcApi<A> => {
  const result = {} as Brpc.BrpcApi<A>;

  for (const [key, value] of Object.entries(api)) {
    const inputSchema = spec[key as keyof typeof spec]?.input;

    if (inputSchema === undefined) {
      throw new Error(`Missing input schema for ${key}`);
    }

    result[key as keyof typeof result] = {
      ...value,
      inputSchema,
    };
  }

  return result;
};
