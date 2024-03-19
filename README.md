# Banyan

Banyan is a collection of apps and libraries for [xmtp](https://xmtp.org). Ultimately, we're building towards a world where applications are composed bottom-up by the self-sovereign user rather than pushed top-down by the rent seeker.

This TypeScript monorepo includes:


- [Banyan](#banyan)
- [brpc](#brpc)
- [Canopy](#canopy)
- [fig](#fig)
- [Minnow](#minnow)
- [Mission (goals and non-goals)](#mission-goals-and-non-goals)

# brpc

[brpc](./packages/brpc/) is a library for building end-to-end typesafe and
encrypted XMTP APIs (and clients).

# Canopy

[Canopy](./apps/canopy/) is a key-value server ETH addresses, powered by XMTP and Postgres.

# fig

[fig](./packages/fig) is a React SDK for working with `brpc`, `Canopy`, and `xmtp`.

# Minnow

[Minnow](./apps/minnow/) is the minimal viable decentralized social network, built on top of Canopy.

# Mission (goals and non-goals)

__TODO__
