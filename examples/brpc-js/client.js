import { createClient } from "@killthebuddha/brpc/createClient.js";
import { readFile } from "fs/promises";
import * as api from "./api.js";

const client = await createClient({
  api,
  address: await readFile("/tmp/.brpc", "utf8"),
});

const pub = await client.api.pub();

if (!pub.ok) {
  throw new Error("Pub failed!");
}

console.log(pub.data);

const unauthed = await client.api.access();

if (unauthed.ok) {
  throw new Error("Unauthorized access should have failed!");
}

console.log(unauthed.code);

let signup = await client.api.signup();

if (!signup.ok) {
  throw new Error("Signup failed!");
}

console.log(signup.data);

const authed = await client.api.access();

if (!authed.ok) {
  throw new Error("Authorized access failed");
}

console.log(authed.data);

client.close();
