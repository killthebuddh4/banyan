import { DecodedMessage } from "@xmtp/xmtp-js";
import { Definition } from "./Definition.js";
import { Xmtp } from "./Xmtp.js";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Result } from "./Result.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";
import { jsonStringableSchema } from "@repo/lib/jsonStringableSchema.js";
import { responseSchema } from "./responseSchema.js";
import { successSchema } from "./successSchema.js";
import { errorSchema } from "./errorSchema.js";

export const createClient = <I extends z.ZodTypeAny, O extends z.ZodTypeAny>({
  xmtp,
  definition,
  options,
}: {
  xmtp: Xmtp;
  definition: Definition<I, O>;
  options?: {
    timeoutMs?: number;
    onSkippedMessage?: ({ message }: { message: DecodedMessage }) => void;
    onInvalidJson?: ({ message }: { message: DecodedMessage }) => void;
    onBadIdField?: ({ message }: { message: DecodedMessage }) => void;
    onBadResponseField?: ({ message }: { message: DecodedMessage }) => void;
    onResultTypeMismatch?: ({ message }: { message: DecodedMessage }) => void;
  };
}) => {
  return async (
    input: z.infer<typeof definition.input>,
  ): Promise<Result<z.infer<typeof definition.output>>> => {
    const requestId = uuidv4();

    const promise = new Promise<Result<z.infer<typeof definition.output>>>(
      (resolve, reject) => {
        const timeout = setTimeout(
          () => {
            reject({
              ok: false,
              status: "REQUEST_TIMEOUT",
            });
          },
          options?.timeoutMs ?? 5000,
        );

        xmtp.subscribe({
          subscription: (args) => {
            const json = jsonStringSchema.safeParse(args.message.content);

            if (!json.success) {
              return;
            }

            const response = responseSchema.safeParse(json.data);

            if (!response.success) {
              return;
            }

            if (response.data.id !== requestId) {
              return;
            }

            const error = errorSchema.safeParse(response.data.payload);

            if (error.success) {
              return error.data;
            }

            const success = successSchema.safeParse(response.data.payload);

            if (!success.success) {
              return {
                ok: false,
                status: "INVALID_RESPONSE",
              };
            }

            const data = definition.output.safeParse(success.data.data);

            if (!data.success) {
              return {
                ok: false,
                status: "INVALID_OUTPUT_TYPE",
              };
            }

            args.unsubscribe();

            clearTimeout(timeout);

            resolve({
              ok: true,
              status: "OK",
              data: data.data,
            });
          },
        });

        const message = jsonStringableSchema.safeParse({
          id: requestId,
          name: definition.name,
          payload: input,
        });

        if (!message.success) {
          reject({
            ok: false,
            status: "INVALID_INPUT",
          });

          return;
        }

        xmtp.publish({
          to: definition.address,
          message: message.data,
        });
      },
    );

    return promise;
  };
};
