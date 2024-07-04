# whisper.banyan.sh

1. Navigate to `/`
2. A list of instructions.
3. A button to create whisper
4. Click button to generate a URL `/:address`
5. Wallet is created, signed into XMTP, URL is displayed.


1. Navigate to `/:address`
2. Creates a wallet, signs into XMTP
3. Sends a "join the group" conversation to :address.
4. :address responds with a list of members

JUST

Got the member/owner wallet creation/saving working minimally.

NEXT

Add `send` to the `useMessages` hook, get `useMessages` working, push a
super minimal PoC of the chat working.

JUST

got useMessages working

NEXT

- implement useBrpcClient and useBrpcServer (GONNA BE SO SICK)

When you create a group, you should start an ownerClient and ownerServer,
When someone joins the group, they should start a memberClient and memberServer.
when someone joins the group, they should tell the group owner.

- join
- ping
- post
- publish
- sync
