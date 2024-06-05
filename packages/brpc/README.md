# Overview

🎉 `brpc` is a dead-simple, end-to-end typesafe RPC library powered by [XMTP](https://xmtp.org) (and inspired by [trpc](https://trpc.io)).

⚡️ Use `brpc` to safely deploy any JavaScript function to the internet in __approximately 0 seconds__.

# Quickstart

First, take any function and wrap it in a `BrpcProcedure`.

```TypeScript
// api.ts

import { createProcedure } from "@killthebuddha/brpc/createProcedure.js";

const myFunction = async () => "Hello, world!";

export const myPublicFunction = createProcedure({
  auth: async () => true,
  handler: myFunction,
});
```

Then, serve it.

```TypeScript
// server.ts

import { createServer } from "@killthebuddha/brpc/createServer.js";
import { myPublicFunction } from "./api.js";

const server = await createServer({ api: { myPublicFunction } });

await server.start();
```


Creating a client for you function is just as easy:

```TypeScript
// client.ts

import { createClient } from "@killthebuddha/brpc/createClient.js";
import { myPublicFunction } from "./api.js";

const client = await createClient({
  api,
  address: await readFile("/tmp/.brpc", "utf8"),
});

const message = await client.api.myPublicFunction();

console.log(message.ok && message.data) // "Hello, world!"
```

And that's all there is to it! You just published a service to the internet in 

# Adding in Auth

_TODO_

# Examples

You can find a runnable JavaScript example in [examples/brpc-js](TODO).
Also, an example designed to showcase `brpc`'s typesafety can be found at [examples/brpc-ts](TODO).

_More examples to come shortly_

# How does it work?

_TODO_

# Roadmap

_TODO_