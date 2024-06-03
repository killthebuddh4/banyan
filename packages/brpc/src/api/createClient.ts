import { DecodedMessage } from "@xmtp/xmtp-js";
import { Definition } from "./Definition.js";
import { Xmtp } from "./Xmtp.js";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Result } from "./Result.js";
import { jsonStringSchema } from "@repo/lib/jsonStringSchema.js";

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
    
    const parseResult = ({ message }: { message: DecodedMessage }): Result<z.infer<typeof definition.output>>> => {
      const json = jsonStringSchema.safeParse(message.content);
    }

    const promise = new Promise<Result<z.infer<typeof definition.output>>>(
      (resolve, reject) => {
        xmtp.subscribe({
          subscription: (args) => {
            const result = parseResult(args.message);

            if (!result.success) {
              return;
            }

            args.unsubscribe();
            resolve(result.data);
          },
        });
      },
    );

    return promise;
  };
};
