import { z } from "zod";

export type Definition<I extends z.ZodTypeAny, O extends z.ZodTypeAny> = {
  address: string;
  name: string;
  input: I;
  output: O;
};
