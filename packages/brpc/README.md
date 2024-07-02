# Overview

🎉 `brpc` is a dead-simple, end-to-end typesafe RPC library powered by [XMTP](https://xmtp.org) (and inspired by [trpc](https://trpc.io)).

⚡️ Use `brpc` to safely deploy any JavaScript function to the internet in __approximately 0 seconds__.

# Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Quickstart](#quickstart)
- [Adding in Auth](#adding-in-auth)
- [Examples](#examples)
- [How does it work?](#how-does-it-work)
- [Roadmap](#roadmap)
- [NOTES 2024-07-01](#notes-2024-07-01)

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
import { writeFile } from "fs/promises";

const server = await createServer({ api: { myPublicFunction } });

// Save your server's address somewhere. In production, the address
// would be known ahead of time.
await writeFile("/tmp/.brpc", server.address);

await server.start();
```


Creating a client for your function is just as easy:

```TypeScript
// client.ts

import { createClient } from "@killthebuddha/brpc/createClient.js";
import { myPublicFunction } from "./api.js";

const client = await createClient({
  api,
  // You wrote this file when you created the server. In production, you'd
  // know your server's address ahead of time.
  address: await readFile("/tmp/.brpc", "utf8"),
});

const message = await client.api.myPublicFunction();

console.log(message.ok && message.data) // "Hello, world!"
```

And that's all there is to it! You just published a service to the internet in a few lines of code! 🎉

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


# NOTES 2024-07-01

createClient should setup everything for you and return something like a `stop`
function. it's super cheap to create clients on the fly

createRouter should similarly be super cheap and the kind of thing you can call over and over on a single instance of a Hub.

both createClient and createRouter should take an ApiDefinition for symmetry.

createClient and createRouter should both be functions on a Hub object. or maybe a `Brpc` object?

`Brpc.start()` should be the only thing you need to do that takes a while.


- createPubSub
- createBrpc
- createProcedure
- createRouter
- createClient

I think this covers everything?