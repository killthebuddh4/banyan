import { CreateContext } from "./CreateContext.js";

export const create: CreateContext = ({ message, request, server }) => {
  return {
    server,
    request,
    message,
  };
};
