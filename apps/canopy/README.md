# Overview

Canopy is a key-value server built on top of `brpc` which is in turn built on top of [xmtp](https://xmtp.org).

# Features

In Canopy a _key_ is a list of strings and a _value_ is a JSON object. Every Canopy store is a tree where each key defines a path through the tree. A _query_ is a list where each element is a string or regular expression. Every query is either a range query or spot query and is processed by matching the query's elements to the store in the way you would expect.

Every key-value pair has an _owner address_. An owner address is "just" a prefix (the writer's ETH address) added the first time a key is written. Every key-value pair has an attached _whitelist_ and _blacklist_. The whitelist grants _permissions_ to ETH addresses and the blacklist revokes them.

The following permissions exist:

- READ
- WRITE
- DELETE
- SUBSCRIBE

Every Canopy store is subdivided into namespaces. A _namespace_ is just a key prefix with certain enforced invariants. For example, the namespace \[`0xMY_ADDRESS`\] can only be written by the user `0xMY_ADDRESS`. We will almost certainly need to introduce additional invariants at some point.

We combine whitelists, blacklists, permissions, and namespaces to provide a highly expressive access control system.

Canopy provides the following functions:

- value
  - READ
  - WRITE
  - DELETE
  - SUBSCRIBE
- permission
  - ADD
  - REMOVE

# Goals and Non-Goals

_Right now, we're building Canopy according to the needs of [min](../min), the minimal decentralized social network._

The primary goal is to explore the limits of what we can build with nothing but ETH addresses and encrypted messages as primitives. When we encounter tradeoffs between UX and this technophilosophical goal, we will sacrifice UX _unless there exists a cogent, written, and viable-with-current-technology plan to repay the "technical debt"_.

Another primary goal is user self-sovereignty. It will always be possible for users to

1. Select whichver Canopy instance they choose.
2. Clone and self-host Canopy instances _without loss of data_. 

At the moment I don't know enough about decentralization and federation to make a stronger statement than this, but I can make a strong statement about my commitment to transparency. What I mean is that I can commit to publishing my current thinking on the topic at all times.

# Check it out

[min](https://min.banyan.sh) is built on top of Canopy! Additionally, you can poke and prod the Canopy server running at `0xb945AFfccd31717490e339DD0FDF2fA8679391A3`.