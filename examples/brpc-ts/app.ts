import { z } from "zod";
import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";
import { createClient } from "@killthebuddha/brpc/bindClient.js";

/* TYPE SAFETY USING SCHEMAS */

export const divide = createProcedure({
  input: z.object({
    numerator: z.number(),
    denominator: z.number().gt(0),
  }),
  output: z.number(),
  auth: async () => true,
  handler: async (props) => {
    return props.numerator / props.denominator;
  },
});

/* TYPE SAFETY USING GENERICS */

export const isEven = createProcedure<
  {
    num: number;
  },
  boolean
>({
  auth: async () => true,
  handler: async (props) => {
    return props.num % 2 === 0;
  },
});

/* OR YOU CAN USE BOTH */

const operands = z.object({
  lhs: z.number(),
  rhs: z.number(),
});

export const multiply = createProcedure<
  {
    lhs: number;
    rhs: number;
  },
  number
>({
  input: operands,
  output: z.number(),
  auth: async () => true,
  handler: async (props) => {
    return props.lhs * props.rhs;
  },
});

/* THE CLIENT METHODS ARE TYPE SAFE */

const client = await createClient({
  address: "YOUR_SERVER_ADDRESS",
  api: { divide, isEven, multiply },
});

const divided = await client.api.divide({ numerator: 10, denominator: 2 });

console.log(divided.ok && divided.data); // 5

const isTenEven = await client.api.isEven({ num: 10 });

console.log(isTenEven.ok && isTenEven.data); // true

const multiplied = await client.api.multiply({ lhs: 10, rhs: 2 });

console.log(multiplied.ok && multiplied.data); // 20
