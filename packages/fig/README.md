# Overview

Fig is React hooks for [xmtp](https://xmtp.org), [brpc](../brpc/), [banyan](../../apps/banyan/), and [Canopy](../../apps/canopy/) Use it to compose applications from open data protocols.

## Hooks for...

#### XMTP

__High-level hooks__

- useConversation
- useConversationList

__Low-level hooks__

- useMessages
- useMessageStream
- useConversationStream
- useSendMessage

#### `brpc`

- useBrpc

`useBrpc` can access any live `brpc` backend but works best when paired with a published typesafe API. Learn more about how to build and publish `brpc` APIs [here](../brpc/).

#### Banyan

[Banyan](../../apps/banyan/) is a key-value server for XTMP. You can use `Banyan` to build open data application protocols.

- useRead
- useWrite
- useSubscribe

#### Canopy

Canopy is a completely open social network powered by Banyan and XMTP. Add it to your react app with just a few lines of code:

__bio__

- useCreate
- useEdit
- useDelete

__feed__

- useCreate
- useEdit
- useDelete
- usePublish
- useFollow
- useSuggest

## Documentation

Check out the [live walkthrough](https://fig.banyan.sh)!

Additional documentation, complete with a full API reference, coming soon!

## Installation

```bash
npm install @killthebuddh4/fig
```

## Developer Quick Start

```bash
./scripts.dev.sh
```

## Examples

We've "inlined" working use cases along with their corresponding hooks (e.g., see
[the useClient example](./src/use-client.example.tsx)). To see them in action,
check out the [demo](https://receiver.relay.network).

## Support

The best place to get real-time support is the `#developers` channel in
[Discord](https://discord.com/invite/DTMKf63ZSf). You'll get extra special attention and
tons of kudos 🎉 if you also [open an issue](https://github.com/relay-network/receiver/issues/new).

## Community

- Join us on [Discord](https://discord.com/invite/DTMKf63ZSf) 💬
- Follow [Relay](https://twitter.com/relay_eth) on Twitter for project updates 🤝

## Contributing

If you're interested in contributing, please read the [contributing
docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Sponsors

- [Relay](https://relay.network)

## Authors

- killthebuddha.eth ([@killthebuddha\_](https://twitter.com/killthebuddha_)) – [Relay](https://relay.network)

## License

[MIT](/LICENSE) License
