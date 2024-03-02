# Fig is React hooks for XMTP

It's the fastest way to add [xmtp-js](https://github.com/xmtp/xmtp-js)
to your [React](https://reactjs.org/) app.

## Features

- 🦾 Ergonomic hooks for working with the XMTP API.
- 🔥 Utilizes web workers, so crypto operations don't nuke your UI.
- 💼 Built-in multi-client support, switch between accounts seamlessly.
- 🌀 Auto-refresh data and message streaming
- 🦄 TypeScript native!

## Coming Soon

- 🙈 component library -- headless, fully customizable UI components for painless integration
- 🚀 useRpc -- makes requests to an XMTP-powered RPC server
- 🤝 useGroupChat -- group chat for XMTP!
- 🤖 useBot -- think #ChatGXMTP (streaming, cancellable, etc.)
- 🔒 useVault -- an e2ee encrypted self-custodial kv store
- and more!

## Documentation

Check out the [live walkthrough](https://receiver.relay.network)!

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
