import { CreateContext } from "@killthebuddha/xm-rpc/rpc/CreateContext.js";

export const createContext: CreateContext = ({ client, message, request }) => ({
  client,
  message,
  request,
});
