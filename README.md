# Banyan

Banyan is a programming language and toolkit for building, deploying, and
publishing [distributed application servers](/). This monorepo includes the
[interpreter](/), [CLI](/), [tuplespace](/) server, [rpc](/) library,
[documentation](/), and [example applications](/).

- [Banyan](#banyan)
- [Distributed application server?](#distributed-application-server)
- [Goals (and non-goals)](#goals-and-non-goals)
- [Banyan](#banyan-1)
- [CLI](#cli)
- [`brpc`](#brpc)
- [The distributed memory](#the-distributed-memory)

# Distributed application server?

A Banyan program is an RPC server that (1) is deployed to the
[XMTP](https://xmtp.org) network and (2) implements the Banyan RPC protocol.
The Banyan language includes primitives that implement the Banyan RPC Protocol
so that it becomes trivial to interface with other Banyan applications. The
Banyan CLI includes commands to trivially deploy and publish applications.
References in a Banyan application resolve to values in the Banyan [tuple
space](/) which is a distributed shared memory powered by the XMTP network.

# Goals (and non-goals)

A Banyan application __is the simplest and fastest way to deploy small utilities
to the internet__.

Banyan programs are extremely slow and network-intenstive relative to the same
program implemented in another language. To some extent these drawbacks are
intrinsic to Banyan's design. Banyan will probably never be a suitable choice
for high-traffic, mission-critical applications.

That said, __Banyan is the best way to deploy ad-hoc, personal, or low-traffic
applications to a small audience__. (Think Zapier rather than Twitter or
Facebook).

# Banyan

Banyan is a programming language and interpeter. Some key details:

- functional
- expression-oriented
- strongly, dynamically typed
- network-transparent

# CLI

`banyan` is a command-line interface for Banyan. You can use it to run, deploy,
administer, publish, and revoke Banyan applications.

# `brpc`

`brpc` is a library for building end-to-end typesafe and
encrypted Banyan APIs (and clients).

# The distributed memory

`banyantree` is an [tuplespace](https://en.wikipedia.org/wiki/Tuple_space)
implementation for Banyan programs, powered by [XMTP](https://xmtp.org).