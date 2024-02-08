import { errors } from "./errors.js";

export type ErrorCode = (typeof errors)[keyof typeof errors]["code"];
