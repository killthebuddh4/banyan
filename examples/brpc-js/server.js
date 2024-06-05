import * as api from "./api.js";
import { createServer } from "@killthebuddha/brpc/createServer.js";
import { writeFile } from "fs/promises";

const server = await createServer({ api });
await writeFile("/tmp/.brpc", server.address);
await server.start();
await new Promise(() => {});
