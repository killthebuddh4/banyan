_We used `fig` to build [canopy.banyan.sh](https://canopy.banyan.sh), our live frontend for the Canopy social network. Check it out!_

## Overview

Fig is React hooks for [xmtp](https://xmtp.org), [brpc](../brpc/), [banyan](../../apps/banyan/), and [Canopy](../../apps/canopy/) With `fig` you can comopse applications using open data protocols.

## Features

`fig` is hooks for...

__XMTP__

The [xmtp-js](https://github.com/xmtp/xmtp-js) SDK allows you to send, receive, and subscribe to XMTP conversations. `fig` provides a set of ergonomic hooks for working directly with `xmtp-js`.

__brpc__

`fig` provides hooks to access any live `brpc` backend but works best when paired with a published typesafe API. Learn more about how to build and publish `brpc` APIs [here](../brpc/).

__Banyan__

[Banyan](../../apps/banyan/) is a key-value server for XMTP. You can use `Banyan` to build open data protocols. `fig` provides hooks for Banyan's entire API.

__Canopy__

[Canopy](../../apps/canopy/) is a completely open social network powered by Banyan and XMTP. With `fig` you can add social networking features to your app with just a few lines of code.

We used `fig` to build [canopy.banyan.sh](https://canopy.banyan.sh), our live frontend for Canopy!

## Contents

- [Overview](#overview)
- [Features](#features)
- [Contents](#contents)
- [Documentation](#documentation)
    - [Quick Start](#quick-start)
    - [Usage](#usage)
    - [API Reference](#api-reference)
- [Support](#support)
- [Community](#community)
- [Contributing](#contributing)
- [Sponsors](#sponsors)
- [Authors](#authors)
- [License](#license)
- [Roadmap (\& Notes)](#roadmap--notes)


## Documentation

#### Quick Start

__TODO__ More here.

```bash
npm install @killthebuddh4/fig
```

#### Usage

We've "inlined" basic working use cases with each public hook. You can see each use case live at `https://fig.banyan.sh/examples/name-of-hook`.

__TODO__ List the API here.

#### API Reference

__TODO__ For each hook, it's signature and basic usage, notes, and gotchas.

## Support

The best place to get real-time support is the `#banyan` channel in [Discord](https://discord.gg/wG9rEmw8). You'll get extra special attention and tons of kudos 🎉 if you also [open an issue](https://github.com/killthebuddh4/issues/new).

## Community

- Join us on [Discord](https://discord.gg/wG9rEmw8) 💬
- Follow [Achilles](https://twitter.com/killthebuddh4) on Twitter for project updates 🤝

## Contributing

If you're interested in contributing, please read the [contributing
docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Sponsors

_You can be the first ❤️!_

## Authors

- [Achilles Schmelzer](https://twitter.com/killthebuddha_)

## License

[MIT](/LICENSE) License

## Roadmap (& Notes)

- stateful worker hooks
- action worker hooks
- unifying hooks
  - useLogin
  - useConversation
  - useMessages
  - useInbox (TODO)
- helper hooks
  - useCreateConversation
  - useSendMessage
  - ...
- brpc hooks
- banyan hooks
- ...