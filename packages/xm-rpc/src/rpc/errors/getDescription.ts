import { errors } from "./errors.js";
import { ErrorCode } from "./ErrorCode.js";

export const getDescription = ({ code }: { code: ErrorCode }) => {
  const error = Object.values(errors).find((error) => error.code === code);
  if (!error) {
    throw new Error(`Could not find error with code ${code}`);
  }
  return error.description;
};
