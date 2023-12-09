# xm, xmtp manager

`xm` is a suite of tools for building and deploying [XMTP](https://xmtp.org)
applications.

- [xmtp application?](#xmtp-application?)
- [what can you do with `xm`?](#what-can-you-do-with-xm)
- [goals](#goals)
- [xm-ctl](#xm-ctl)
- [xm-rpc](#xm-rpc)
- [xm-val](#xm-val)
- [xm-xrc](#xm-xrc)
- [xm-tui](#xm-tui)
- [xm-react](#xm-react)
- [xm-api](#xm-api)

# xmtp application?

An XMTP application is a function deployed to the
[XMTP](https://xmtp.org) network. That is, it's discoverable via its Ethereum
address, receives its input as XMTP messages, and publishes its output as
XMTP messages.

An XMTP application _is the simplest, safest, and fastest way to deploy useful
software to the internet_.

# what can you do with `xm`?

- `xm` is to application developers as `vim` is to text editors
- `xm` is a nano-application framework
- `xm` is the next evolution of unix coreutils
- `xm` is a global service mesh for AI copilots
- `xm` is a blazingly simple way to do private messaging
- `xm` is the early web made new

# goals

- `xm` must be _extensible_
- `xm` must be _interoperable_
- `xm` must be _composable_
- `xm` must be _minimal_
- `xm` must be _simple_
- `xm` must be _useable_
- `xm` must be _hackable_

# xm-ctl

`xm-ctl` is a command-line interface for `xm`.

## roadmap

- [ ] A generic client for `xm-rpc` servers
- [ ] "Native" support for all `xm-val` commands
- [ ] "Native" support for all `xm-xrc` commands
- [ ] "Native" support for each `xm-tui` screen

## down the road

## todo

# xm-rpc

`xm-rpc` is a library for building end-to-end typesafe and
encrypted APIs on top of XMTP.

## roadmap

- [ ] Create a typesafe message stream
- [ ] Create an RPC route
- [ ] Create an RPC router
- [ ] Create an RPC route client
- [ ] Create an RPC stream client

## down the road

- [ ] `npm publish` routes for client generation
- [ ] "push-button" FaaS deployment
- [ ] A superergonomic API heavily inspired by [trpc](https://trpc.io).

## todo

- [ ] More granular logging options

# xm-val

`xm-val` is a key-value server built on top of `xm-rpc`. It provides not only a
self-hostable server implementation but also a (typesafe) JavaScript client.

## roadmap

- [x] Read a value from the store
- [x] Write a value to the store
- [x] List keys in the store
- [x] Delete a value from the store
- [x] Publish a value (allow others to read it)
- [x] Recall a value (stop others from reading it)
- [ ] A typesafe JavaScript client
- [ ] Sync (store to store replication)
- [ ] Stash a value (write an encrypted value)
- [ ] Recover a value (read an encrypted value)
- [ ] Leasing (i.e. TTL)
- [ ] Read receipts

# down the road

- [ ] Add support for `postgres`, `redis`, and `fs` storage backends
- [ ] `xm-val-p2p`, a peer-to-peer key-value store

## todo

# xm-xrc

`xm-xrc` is a relay chat server built on top of `xm-rpc`.

## roadmap

- [ ] Create a group
- [ ] Delete a group
- [ ] Invite a user to a group
- [ ] Revoke an invitation to a group
- [ ] Join a group
- [ ] Leave a group
- [ ] Send a group message
- [ ] Kick a user from a group
- [ ] List your groups
- [ ] Read a group's stats
- [ ] Sync a group (to another server)
- [ ] Export a group

## down the road

## todo

# xm-tui

`xm-tui` is a hyper-minimal command-line interface for XMTP.

## roadmap

- [ ] Conversation list view
- [ ] Conversation view
- [ ] Open in browser (or app)
- [ ] `xm-xrc` support

## down the road

## todo

# xm-react

`xm-react` is react hooks for XMTP applications.

## roadmap

Coming soon!

# xm-api

`xm-api` is an HTTP API wrapper for XMTP clients.

## roadmap

Coming soon!