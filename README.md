# xm, xmtp manager

`xm` is a suite of tools for building and deploying [XMTP](https://xmtp.org)
applications.

# contents

- [what can you do with `xm`?](#what-can-you-do-with-xm)
- [xm-ctl](#xm-ctl)
- [xm-rpc](#xm-rpc)
- [xm-val](#xm-val)
- [xm-xrc](#xm-xrc)
- [xm-tui](#xm-tui)
- [xm-react](#xm-react)
- [xm-api](#xm-api)

# what can you do with `xm`?

- `xm` is to application developers as `ssh` is to sysadmins
- `xm` is a nano-application framework
- `xm` is the next evolution of unix coreutils
- `xm` is a global service mesh for AI copilots
- `xm` is a blazingly simple way to do private messaging
- `xm` is the early web made new

# xm-ctl

`xm-ctl` is a command-line interface for `xm`.

## roadmap

- [] A generic client for `xm-rpc` servers
- [] "Native" support for all `xm-val` commands
- [] "Native" support for all `xm-xrc` commands
- [] "Native" support for each `xm-tui` screen

# xm-rpc

`xm-rpc` is a library for building end-to-end typesafe and
encrypted APIs on top of XMTP.

## roadmap

- [] Create a typesafe message stream
- [] Create an RPC route
- [] Create an RPC router
- [] Create an RPC route client
- [] Create an RPC stream client

## down the road

# xm-val

`xm-val` is a key-value server built on top of `xm-rpc`. It provides not only
self-hostable server implementation but also a (typesafe) JavaScript client.

## roadmap

- [] Write a value to the store
- [] Read a value from the store
- [] Delete a value from the store
- [] Publish a value (allow others to read it)
- [] Recall a value (stop others from reading it)
- [] Subscribe to a value
- [] Sync (store to store replication)
- [] Stash a value (write an encrypted value)
- [] Recover a value (read an encrypted value)
- [] Expiration dates
- [] Read receipts

# xm-xrc

`xm-xrc` is a relay chat server built on top of `xm-rpc`.

## roadmap

- [] Create a group
- [] Delete a group
- [] Invite a user to a group
- [] Revoke an invitation to a group
- [] Join a group
- [] Leave a group
- [] Send a group message
- [] Kick a user from a group
- [] List your groups
- [] Read a group's stats
- [] Sync a group (to another server)
- [] Export a group

# xm-tui

`xm-tui` is a hyper-minimal command-line interface for XMTP.

## roadmap

- [] Conversation list view
- [] Conversation view
- [] Open in browser (or app)
- [] `xm-xrc` support

# xm-react

`xm-react` is react hooks for XMTP applications.

## roadmap

Coming soon!

# xm-api

`xm-api` is an HTTP API wrapper for XMTP clients.

## roadmap

Coming soon!