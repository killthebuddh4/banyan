# Overview

The Banyan monorepo is a collection of apps and libraries powered by [xmtp](https://xmtp.org). XMTP is an end-to-end encrypted messaging protocol that uses Ethereum addresses as identities. Decentralized identity with end-to-end encryption allow us to apply the Unix philosophy at the web application layer. We can build small, single-purpose, highly composable application protocols. Ultimately, we're building towards a world where applications are composed bottom-up by the self-sovereign user rather than pushed top-down by the rent seeker.

# brpc

[brpc](./packages/brpc/) is a library for building end-to-end typesafe and
encrypted XMTP APIs (and clients).

# Banyan

[Banyan](./apps/banyan/) is an open key-value server built with `brpc`.

# fig

[fig](./packages/fig) is a React SDK for working with `brpc`, `Banyan`, and `xmtp`.

# Canopy

[Canopy](./apps/canopy/) is the minimal viable decentralized social network, a proof of concept, built with Banyan.
