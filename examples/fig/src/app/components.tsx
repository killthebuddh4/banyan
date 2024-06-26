"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton as BaseConnectButton } from "@rainbow-me/rainbowkit";
import * as Lib from "../lib/lib";
import { Signer, useClient } from "@killthebuddha/fig";
import { AsyncButton } from "@/ui/AsyncButton";
import { SyncButton } from "@/ui/SyncButton";
import { useSigner } from "@/hooks/useSigner";

/* ****************************************************************************
 *
 * Walkthrough
 *
 * ****************************************************************************/

export const Walkthrough = () => {
  return (
    <div className="flex flex-col w-[60ch]">
      <Lib.Section>
        <Lib.SectionHeader>Introduction 👋</Lib.SectionHeader>
        <Lib.SectionDescription>
          Fig is a React library for adding{" "}
          <Lib.SectionLink href="https://xmtp.org">XMTP </Lib.SectionLink>
          superpowers to your app, built with ❤️ by{" "}
          <Lib.SectionLink href="https://banyan.sh">Banyan</Lib.SectionLink>.
        </Lib.SectionDescription>
        <Lib.SectionHeader>Features</Lib.SectionHeader>
        <Lib.SubSectionHeader>Basic Hooks for XMTP</Lib.SubSectionHeader>
        <Lib.SectionDescription>
          These hooks are the most broadly useful hooks and provide
          functionality that will be needed by almost any React app that wants
          to integrate XMTP messaging.
        </Lib.SectionDescription>
        <ol className="text-lg mb-2">
          <li>
            <Lib.SectionRef id="useAuth">useAuth</Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useConversation">
              useConversation
            </Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useContacts">useContacts</Lib.SectionRef>
          </li>
        </ol>
        <Lib.SubSectionHeader>Banyan Hooks</Lib.SubSectionHeader>
        <Lib.SectionDescription>
          These hooks provide functionality that may or may not be useful to
          most applications. For example, the useVault hook is a great way to
          implement self-custodial, portable user-config, but many applications
          will already incorporate their own solution for this. The useBot hook
          could be useful if you want to build #ChatGPXMTP, but probably won't
          be useful for most applications.
        </Lib.SectionDescription>
        <ol className="text-lg mb-2">
          <li>
            <Lib.SectionRef id="useVault">useVault</Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useGroupChat">useGroupChat</Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useBot">useBot</Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useRpc">useRpc</Lib.SectionRef>
          </li>
        </ol>
        <Lib.SubSectionHeader>Advanced Hooks</Lib.SubSectionHeader>
        <Lib.SectionDescription>
          Fig provides a set of wrapper hooks that allow you to work with the
          XMTP SDK more-or-less directly. The Fig library uses these hooks to
          build higher-level feature hooks (e.g.{" "}
          <Lib.SectionRef id="">useConversation</Lib.SectionRef>). The low-level
          wrapper hooks are published as escape hatches, and knowing how they
          work will help keep the witch doctor away, but we recommend using the
          feature hooks whenever possible.
        </Lib.SectionDescription>
        <ol className="text-lg mb-2">
          <li>
            <Lib.SectionRef id="useClient">useClient</Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useMessageStream">
              useMessageStream
            </Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useConversationsStream">
              useConversationsStream
            </Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useConversationStream">
              useConversationStream
            </Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useFetchConversations">
              useFetchConversations
            </Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useFetchMessages">
              useFetchMessages
            </Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useSendMessage">useSendMessage</Lib.SectionRef>
          </li>
          <li>
            <Lib.SectionRef id="useFetchPeerOnNetwork">
              useFetchPeerOnNetwork
            </Lib.SectionRef>
          </li>
        </ol>
      </Lib.Section>
      {/* <UseAuth />
      <UseConversation />
      <UseContacts /> */}
      {/* <UseBrpc />
      <UseVault /> */}
      <UseClient />
      {/* <UseMessageStream />
      <UseConversationsStream />
      <UseConversationStream />
      <UseFetchConversations />
      <UseFetchMessages />
      <UseSendMessage />
      <UseFetchPeerOnNetwork /> */}
    </div>
  );
};

// /* ****************************************************************************
//  *
//  * USE AUTH
//  *
//  * ****************************************************************************/

// export const UseAuth = () => {
//   return (
//     <Lib.Section id="useAuth">
//       <Lib.SectionHeader className="mb-0">useAuth</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-auth.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         The <em>useAuth</em> hooks adds a number of nice-to-haves to the
//         out-of-the-box XMTP auth-by-signing flow. The most broadly-useful of
//         these nice-to-haves is auth caching, but the hook also provides the
//         ability to login as a burner identity and to quickly switch between
//         identities.
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Example coming soon!</em>
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// /* ****************************************************************************
//  *
//  * USE CONVERSATION
//  *
//  * ****************************************************************************/

// const ucWallet = Wallet.createRandom();

// export const UseConversation = () => {
//   const wallet = ucWallet;

//   const conversation = useConversation({
//     wallet,
//     conversation: { peerAddress: "0x937C0d4a6294cdfa575de17382c7076b579DC176" },
//   });

//   const [message, setMessage] = useState<string | null>(null);

//   if (conversation === null) {
//     return null;
//   }

//   return (
//     <Lib.Section id="useConversation">
//       <Lib.SectionHeader className="mb-0">useConversation</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-conversation.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         The <em>useConversation</em> hook bundles everything you need to build a
//         1:1 conversation component. This includes the ability to fetch messages,
//         listen for new messages, check whether the peer has joined XMTP yet, and
//         send messages. By default the hook will, on mount, fetch the most recent
//         messages and start the message stream.
//       </Lib.SectionDescription>
//       <Lib.PrimaryButton
//         className="mb-4"
//         inactiveText="DISABLED (connect wallet first)"
//         idleText="LOGIN"
//         pendingText="LOGGING IN"
//         errorText="LOGIN ERROR"
//         successText="LOGGED IN"
//         onClickIdle={conversation.login}
//         status={Lib.status({
//           isIdle: conversation.isLoginIdle,
//           isPending: conversation.isLoginPending,
//           isSuccess: conversation.isLoginSuccess,
//           isError: conversation.isLoginError,
//         })}
//       />
//       <div className="flex flex-col rounded-md p-2 mb-4 h-[20rem] min-w-full bg-gray-200">
//         {conversation.messages.map((message) => {
//           return (
//             <p key={message.id} className="p-0">
//               {String(message.content)}
//             </p>
//           );
//         })}
//       </div>
//       <div className="flex gap-4">
//         <Lib.PrimaryTextInput
//           className="flex-1 mb-4"
//           placeholder={(() => {
//             if (conversation.messages.length < 10) {
//               return "Enter a message...";
//             } else {
//               return "Demo limit reached";
//             }
//           })()}
//           value={message}
//           onChange={setMessage}
//         />
//         <Lib.PrimaryButton
//           inactiveText="SEND"
//           idleText="SEND"
//           pendingText="SEND"
//           errorText="SEND"
//           successText="SEND"
//           onClickIdle={async () => {
//             if (conversation.messages.length >= 10) {
//               return;
//             }

//             if (message === null) {
//               return;
//             }

//             await conversation.send({ content: message });
//             setMessage(null);
//           }}
//           status={Lib.status({
//             isIdle:
//               conversation.isSendIdle ||
//               (conversation.isSendSuccess && conversation.messages.length < 10),
//             isPending: conversation.isSendPending,
//             isSuccess: conversation.messages.length >= 10,
//             isError: conversation.isSendError,
//           })}
//         />
//       </div>
//     </Lib.Section>
//   );
// };

// export const UseContacts = () => {
//   return (
//     <Lib.Section id="useContacts">
//       <Lib.SectionHeader className="mb-0">useContacts</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-contacts.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         The <em>useContacts</em> hook bundles everything you need to build a
//         contact list component. This includes the ability to fetch existing
//         conversations, stream new conversations as they're created, and preview
//         the most recent message from each conversation.
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Example coming soon!</em>
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// export const UseVault = () => {
//   return (
//     <Lib.Section id="useVault">
//       <Lib.SectionHeader className="mb-0">useVault</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-vault.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         The <em>useVault</em> hook implements a self-custodial, end-to-end
//         encrypted key-value store using nothing but XMTP (i.e. data isn't
//         written to browser-based storage and there's no server).
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Example coming soon!</em>
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// export const UseBrpc = () => {
//   return (
//     <Lib.Section id="useBrpc">
//       <Lib.SectionHeader className="mb-0">useBrpc</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-brpc.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         The <em>useBrpc</em> hook gives you access to{" "}
//         <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/brpc">
//           brpc
//         </Lib.SectionLink>{" "}
//         , an RPC library powered by XMTP. One thing that's super cool about this
//         hook (and brpc) is that <em>it's not just a client</em>, you can
//         actually <em>run a brpc server inside your React application!</em>
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Example coming soon!</em>
//       </Lib.SectionDescription>
//     </Lib.Section>
//   );
// };

// /* ****************************************************************************
//  *
//  * USE CLIENT
//  *
//  * ****************************************************************************/

export const UseClient = () => {
  const wallet = useSigner();

  return (
    <Lib.Section id="useClient">
      <Lib.SectionHeader className="mb-0">useClient</Lib.SectionHeader>
      <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-client.ts">
        source
      </Lib.SectionLink>
      <Lib.SectionDescription>
        The <em>useClient</em> hook is part of the low-level binding layer. It
        provides the ability to start and stop XMTP clients and also keeps track
        of each client's status.
      </Lib.SectionDescription>
      <ConnectWalletButton />
      <StartXmtpButton wallet={wallet} />
      <StopXmtpButton wallet={wallet} />
    </Lib.Section>
  );
};

export const ConnectWalletButton = ({
  className,
  override,
}: {
  className?: string;
  override?: Signer;
}) => {
  if (typeof override !== "undefined") {
    return (
      <AsyncButton
        inactiveText="N/A"
        idleText="N/A"
        errorText="N/A"
        pendingText="N/A"
        successText="CONNECTED WALLET"
        onClickIdle={() => null}
        status={Lib.status({ isSuccess: true })}
        className={className}
      />
    );
  }

  return (
    <BaseConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <AsyncButton
            inactiveText="N/A"
            idleText="CONNECT WALLET"
            errorText="CONNECT WALLET ERROR"
            pendingText="CONNECTING WALLET"
            successText="CONNECTED WALLET"
            onClickIdle={() => openConnectModal()}
            status={Lib.status({
              isSuccess: !!connected,
              isIdle: !connected,
            })}
            className={className}
          />
        );
      }}
    </BaseConnectButton.Custom>
  );
};

export const StartXmtpButton = ({ wallet }: { wallet?: Signer }) => {
  const client = useClient({ wallet });

  return (
    <AsyncButton
      onClickIdle={() => {
        if (client === null) {
          console.error("client is null");
          throw new Error("client is null");
        }

        if (client.start === null) {
          console.error("client.start is null");
          throw new Error("client.start is null");
        }

        client.start();
      }}
      inactiveText="DISABLED (connect wallet first)"
      idleText="START XMTP"
      errorText="START XMTP ERROR"
      pendingText="STARTING XMTP"
      successText="STARTED XMTP"
      status={(() => {
        if (client === null) return "inactive";
        console.log("StartXmtpButton client.code", client.code);
        return client.code;
      })()}
    />
  );
};

export const StopXmtpButton = ({ wallet }: { wallet?: Signer }) => {
  const client = useClient({ wallet });

  return (
    <SyncButton
      onClick={async () => {
        if (client === null) {
          console.error("client is null");
          throw new Error("client is null");
        }

        if (client.stop === null) {
          console.error("client.stop is null");
          throw new Error("client.stop is null");
        }

        client.stop();
      }}
      inactiveText="DISABLED (start client first)"
      activeText="STOP XMTP"
      errorText="FAILED TO STOP XMTP"
      status={(() => {
        if (client === null || client.stop === null) return "inactive";
        if (client.isError) return "error";
        return "active";
      })()}
    />
  );
};

// /* ****************************************************************************
//  *
//  * USE MESSAGE STREAM
//  *
//  * ****************************************************************************/

// const umsWallet = Wallet.createRandom();

// export const UseMessageStream = () => {
//   const wallet = umsWallet;

//   return (
//     <Lib.Section id="useMessageStream">
//       <Lib.SectionHeader className="mb-0">useMessageStream</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-message-stream.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         Every XMTP client provides a global message stream that emits every
//         message sent to the client from every conversation. The{" "}
//         <em>useMessageStream</em> hook bundles everything you need to work with
//         this stream. This includes the ability to start and stop the stream,
//         listen for new messages, and keep track of the stream's status.
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Note, we're using a burner wallet here.</em>
//       </Lib.SectionDescription>
//       <ConnectWalletButton override={wallet} />
//       <StartXmtpButton wallet={wallet} />
//       <StopXmtpButton wallet={wallet} />
//       <StartMessageStreamButton wallet={wallet} />
//       <StopMessageStreamButton wallet={wallet} />
//       <Lib.SectionDescription>
//         <em>Send a message from a random wallet to the burner wallet.</em>
//       </Lib.SectionDescription>
//       <SendMessageButton from={WALLETS[0]} to={umsWallet} content="Hello!" />
//       <Lib.SectionDescription>
//         <em>The most recent message will be displayed below.</em>
//       </Lib.SectionDescription>
//       <LastMessageDisplay wallet={wallet} />
//     </Lib.Section>
//   );
// };

// export const StartMessageStreamButton = ({ wallet }: { wallet?: Signer }) => {
//   const stream = useMessageStream({ wallet });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start client first)"
//       idleText="START STREAM"
//       pendingText="STARTING STREAM"
//       errorText="START STREAM ERROR"
//       successText="STARTED STREAM"
//       onClickIdle={async () => {
//         if (stream === null) {
//           throw new Error("Stream is null even though it's idle");
//         }
//         await stream.start();
//       }}
//       status={(() => {
//         if (stream === null) return "inactive";
//         if (stream.isError) return "error";
//         if (stream.isSuccess) return "success";
//         if (stream.isPending) return "pending";
//         if (stream.isIdle) return "idle";
//         throw new Error("Unhandled stream state");
//       })()}
//     />
//   );
// };

// const StopMessageStreamButton = ({ wallet }: { wallet?: Signer }) => {
//   const stream = useMessageStream({ wallet });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start stream first)"
//       idleText="STOP STREAM"
//       pendingText="STOPPING STREAM"
//       errorText="STOP STREAM ERROR"
//       successText="STOPPED STREAM"
//       onClickIdle={() => {
//         if (stream === null) {
//           throw new Error("Client start is null even though it's idle");
//         } else {
//           stream.stop();
//         }
//       }}
//       status={(() => {
//         if (stream === null) return "inactive";
//         if (!stream.isSuccess) return "inactive";
//         return "idle";
//       })()}
//     />
//   );
// };

// const SendMessageButton = ({
//   from,
//   to,
//   content,
// }: {
//   from: Signer;
//   to: Signer;
//   content: string;
// }) => {
//   const send = useSendMessage({
//     wallet: from,
//     conversation: { peerAddress: to.address },
//   });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start client first)"
//       idleText="SEND MESSAGE"
//       pendingText="SENDING MESSAGE"
//       errorText="SEND MESSAGE ERROR"
//       successText="SENT MESSAGE"
//       onClickIdle={() => {
//         if (send === null) {
//           return;
//         } else {
//           send.send({ content });
//         }
//       }}
//       status={(() => {
//         if (send === null) return "inactive";
//         if (send.isIdle) return "idle";
//         if (send.isPending) return "pending";
//         if (send.isSuccess) return "success";
//         if (send.isError) return "error";
//         throw new Error("Unhandled state");
//       })()}
//     />
//   );
// };

// const LastMessageDisplay = ({ wallet }: { wallet?: Signer }) => {
//   const stream = useMessageStream({ wallet });
//   const [lastMessage, setLastMessage] = useState<string | null>(null);

//   useEffect(() => {
//     if (stream === null) {
//       return;
//     }

//     if (!stream.isSuccess) {
//       return;
//     }

//     stream.listen((message) => {
//       setLastMessage(String(message.sent) + ": " + String(message.content));
//     });
//   }, [stream === null, stream?.isSuccess]);

//   return (
//     <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
//       {lastMessage === null ? "No messages received yet" : lastMessage}
//     </p>
//   );
// };

// const ucsWallet = Wallet.createRandom();

// const UseConversationsStream = () => {
//   const wallet = ucsWallet;

//   return (
//     <Lib.Section id="useConversationsStream">
//       <Lib.SectionHeader className="mb-0">
//         useConversationsStream
//       </Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-conversations-stream.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         Every XMTP client provides a global conversations stream that emits new
//         conversations as they are created. The <em>useConversationsStream</em>{" "}
//         hook bundles everything you need to work with this stream. This includes
//         the ability to start and stop the stream, listen for new conversations,
//         and keep track of the stream's status.
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Note, we're using a burner wallet here.</em>
//       </Lib.SectionDescription>
//       <ConnectWalletButton override={wallet} />
//       <StartXmtpButton wallet={wallet} />
//       <StopXmtpButton wallet={wallet} />
//       <StartConversationsStreamButton wallet={wallet} />
//       <StopConversationsStreamButton wallet={wallet} />
//       <Lib.SectionDescription>
//         <em>
//           Each button below will send a message to the burner wallet from a
//           different wallet. The first message from each wallet will create a new
//           conversation, the rest of the messages will not.
//         </em>
//       </Lib.SectionDescription>
//       <SendMessageButton from={WALLETS[0]} to={ucsWallet} content="Hello!" />
//       <SendMessageButton from={WALLETS[1]} to={ucsWallet} content="Hello!" />
//       <SendMessageButton from={WALLETS[2]} to={ucsWallet} content="Hello!" />
//       <Lib.SectionDescription>
//         <em>
//           The peer address of the most recent new conversation will be displayed
//           below.
//         </em>
//       </Lib.SectionDescription>
//       <LastConversationDisplay wallet={wallet} />
//     </Lib.Section>
//   );
// };

// const StartConversationsStreamButton = ({ wallet }: { wallet?: Signer }) => {
//   const stream = useConversationsStream({ wallet });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start client first)"
//       idleText="START STREAM"
//       pendingText="STARTING STREAM"
//       errorText="START STREAM ERROR"
//       successText="STARTED STREAM"
//       onClickIdle={() => {
//         if (stream === null) {
//           throw new Error("Stream is null even though it's idle");
//         }

//         stream.start();
//       }}
//       status={(() => {
//         if (stream === null) return "inactive";
//         if (stream.isError) return "error";
//         if (stream.isSuccess) return "success";
//         if (stream.isPending) return "pending";
//         if (stream.isIdle) return "idle";
//         throw new Error("Unhandled stream state");
//       })()}
//     />
//   );
// };

// const StopConversationsStreamButton = ({ wallet }: { wallet?: Signer }) => {
//   const stream = useConversationsStream({ wallet });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start stream first)"
//       idleText="STOP STREAM"
//       pendingText="STOPPING STREAM"
//       errorText="STOP STREAM ERROR"
//       successText="STOPPED STREAM"
//       onClickIdle={() => {
//         if (stream === null) {
//           throw new Error("Client start is null even though it's idle");
//         } else {
//           stream.stop();
//         }
//       }}
//       status={(() => {
//         if (stream === null) return "inactive";
//         if (!stream.isSuccess) return "inactive";
//         return "idle";
//       })()}
//     />
//   );
// };

// const LastConversationDisplay = ({ wallet }: { wallet?: Signer }) => {
//   const stream = useConversationsStream({ wallet });
//   const [lastPeerAddress, setLastPeerAddress] = useState<string | null>(null);

//   useEffect(() => {
//     if (stream === null) {
//       return;
//     }

//     if (!stream.isSuccess) {
//       return;
//     }

//     stream.listen((convo) => {
//       setLastPeerAddress(convo.peerAddress);
//     });
//   }, [stream === null, stream?.isSuccess]);

//   return (
//     <p className="flex items-center p-2 mb-4 min-h-[2rem] min-w-full bg-gray-200">
//       {lastPeerAddress === null
//         ? "No conversations received yet"
//         : lastPeerAddress}
//     </p>
//   );
// };

// const uccsWallet = Wallet.createRandom();

// const UseConversationStream = () => {
//   const wallet = uccsWallet;

//   return (
//     <Lib.Section id="useConversationStream">
//       <Lib.SectionHeader className="mb-0">
//         useConversationStream
//       </Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-conversation-stream.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         An XMTP conversation is a 1:1 encrypted channel between two XMTP
//         identities. Every message in XMTP is part of one conversation and the
//         XMTP SDK provides a way to create a conversation-specific stream for any
//         XMTP conversation attached to the XMTP identity. The{" "}
//         <em>useConversationStream</em>
//         hook bundles everything you need to work with conversation-specific
//         streams. This includes the ability to start and stop a stream, listen
//         for new messages, and keep track of each stream's status.
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Note, we're using a burner wallet here.</em>
//       </Lib.SectionDescription>
//       <ConnectWalletButton override={wallet} />
//       <StartXmtpButton wallet={wallet} />
//       <StopXmtpButton wallet={wallet} />
//       <Lib.SectionDescription className="mb-6">
//         <em>
//           Start two different conversation-specific message streams, send
//           messages to them, and watch the messages appear.
//         </em>
//       </Lib.SectionDescription>
//       <StartConversationStreamButton
//         conversation={{ peerAddress: WALLETS[0].address }}
//         wallet={wallet}
//       />
//       <StopConversationStreamButton
//         conversation={{ peerAddress: WALLETS[0].address }}
//         wallet={wallet}
//       />
//       <SendMessageButton from={WALLETS[0]} to={uccsWallet} content="Hello!" />
//       <LastMessageInConversationDisplay
//         conversation={{ peerAddress: WALLETS[0].address }}
//         wallet={wallet}
//       />
//       <StartConversationStreamButton
//         conversation={{ peerAddress: WALLETS[1].address }}
//         wallet={wallet}
//       />
//       <StopConversationStreamButton
//         conversation={{ peerAddress: WALLETS[1].address }}
//         wallet={wallet}
//       />
//       <SendMessageButton from={WALLETS[1]} to={uccsWallet} content="Hello!" />
//       <LastMessageInConversationDisplay
//         conversation={{ peerAddress: WALLETS[1].address }}
//         wallet={wallet}
//       />
//     </Lib.Section>
//   );
// };

// const StartConversationStreamButton = ({
//   conversation,
//   wallet,
// }: {
//   conversation?: { peerAddress: string };
//   wallet?: Signer;
// }) => {
//   const stream = useConversationStream({ conversation, wallet });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start client first)"
//       idleText="START STREAM"
//       pendingText="STARTING STREAM"
//       errorText="START STREAM ERROR"
//       successText="STARTED STREAM"
//       onClickIdle={async () => {
//         if (stream === null) {
//           throw new Error("Stream is null even though it's idle");
//         }
//         const result = await stream.start();
//         console.log("Fig Tutorial, Stream Started", result);
//       }}
//       status={(() => {
//         if (stream === null) return "inactive";
//         if (stream.isError) return "error";
//         if (stream.isSuccess) return "success";
//         if (stream.isPending) return "pending";
//         if (stream.isIdle) return "idle";
//         throw new Error("Unhandled stream state");
//       })()}
//     />
//   );
// };

// const StopConversationStreamButton = ({
//   conversation,
//   wallet,
// }: {
//   conversation?: { peerAddress: string };
//   wallet?: Signer;
// }) => {
//   const stream = useConversationStream({ conversation, wallet });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start stream first)"
//       idleText="STOP STREAM"
//       pendingText="STOPPING STREAM"
//       errorText="STOP STREAM ERROR"
//       successText="STOPPED STREAM"
//       onClickIdle={() => {
//         if (stream === null) {
//           throw new Error("Client start is null even though it's idle");
//         } else {
//           stream.stop();
//         }
//       }}
//       status={(() => {
//         if (stream === null) return "inactive";
//         if (!stream.isSuccess) return "inactive";
//         return "idle";
//       })()}
//     />
//   );
// };

// const LastMessageInConversationDisplay = ({
//   conversation,
//   wallet,
// }: {
//   conversation?: { peerAddress: string };
//   wallet?: Signer;
// }) => {
//   const stream = useConversationStream({ conversation, wallet });
//   const [lastMessage, setLastMessage] = useState<string | null>(null);

//   useEffect(() => {
//     if (stream === null) {
//       return;
//     }

//     if (!stream.isSuccess) {
//       return;
//     }

//     stream.listen((message) => {
//       setLastMessage(String(message.sent) + ": " + String(message.content));
//     });
//   }, [stream === null, stream?.isSuccess]);

//   return (
//     <p className="flex items-center p-2 mb-6 min-h-[2rem] min-w-full bg-gray-200">
//       {lastMessage === null ? "No messages received yet" : lastMessage}
//     </p>
//   );
// };

// const ufcWallet = Wallet.createRandom();

// const UseFetchConversations = () => {
//   const wallet = ufcWallet;
//   const fetchConversations = useFetchConversations({ wallet });
//   const [numConversations, setNumConversations] = useState<number | null>(null);
//   const [state, setState] = useState<AsyncState<undefined> | null>(null);

//   useEffect(() => {
//     if (fetchConversations === null) {
//       setState(null);
//     } else {
//       setState({ id: "idle" });
//     }
//   }, [fetchConversations === null]);

//   return (
//     <Lib.Section id="useFetchConversations">
//       <Lib.SectionHeader className="mb-0">
//         useFetchConversations
//       </Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-fetch-conversations.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         <em>Note, we're using a burner wallet here.</em>
//       </Lib.SectionDescription>
//       <ConnectWalletButton override={wallet} />
//       <StartXmtpButton wallet={wallet} />
//       <StopXmtpButton wallet={wallet} />
//       <CreateConversationButton from={WALLETS[0]} to={wallet} />
//       <CreateConversationButton from={WALLETS[1]} to={wallet} />
//       <Lib.PrimaryButton
//         inactiveText="DISABLED (start client first)"
//         idleText="FETCH CONVERSATIONS"
//         pendingText="FETCHING CONVERSATIONS"
//         errorText="FETCH CONVERSATIONS ERROR"
//         successText="FETCHED CONVERSATIONS"
//         onClickIdle={async () => {
//           if (fetchConversations === null) {
//             return;
//           }

//           setState({ id: "pending" });
//           const result = await fetchConversations();
//           if (result.status === 200) {
//             setNumConversations(result.data.length);
//           } else {
//             setNumConversations(null);
//           }

//           switch (result.status) {
//             case 200:
//               setState({ id: "success", data: undefined });
//               setTimeout(() => {
//                 setState({ id: "idle" });
//               }, 3000);
//               break;
//             default:
//               setState({ id: "error", error: "send failed" });
//               setTimeout(() => {
//                 setState({ id: "idle" });
//               }, 3000);
//               break;
//           }
//         }}
//         status={(() => {
//           if (state === null) return "inactive";
//           if (state.id === "idle") return "idle";
//           if (state.id === "pending") return "pending";
//           if (state.id === "success") return "success";
//           if (state.id === "error") return "error";
//           throw new Error("Unhandled state");
//         })()}
//       />
//       <p className="flex items-center p-2 mb-6 min-h-[2rem] min-w-full bg-gray-200">
//         {numConversations === null
//           ? "Haven't fetched conversations yet."
//           : `${numConversations} conversations fetched.`}
//       </p>
//     </Lib.Section>
//   );
// };

// const CreateConversationButton = ({
//   from,
//   to,
// }: {
//   from: Signer;
//   to: Signer;
// }) => {
//   const send = useSendMessage({
//     wallet: from,
//     conversation: { peerAddress: to.address },
//   });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start client first)"
//       idleText="CREATE CONVERSATION"
//       pendingText="CREATING CONVERSATION"
//       errorText="CREATE CONVERSATION ERROR"
//       successText="CREATED CONVERSATION"
//       onClickIdle={() => {
//         if (send === null) {
//           return;
//         } else {
//           send.send({ content: "Starting a conversation!" });
//         }
//       }}
//       status={(() => {
//         if (send === null) return "inactive";
//         if (send.isIdle) return "idle";
//         if (send.isPending) return "pending";
//         if (send.isSuccess) return "success";
//         if (send.isError) return "error";
//         throw new Error("Unhandled state");
//       })()}
//     />
//   );
// };

// const ufmWallet = Wallet.createRandom();

// const UseFetchMessages = () => {
//   const wallet = ufmWallet;
//   const fetchMessages = useFetchMessages({ wallet });

//   const numMessages = (() => {
//     if (fetchMessages === null) {
//       return null;
//     }

//     if (!fetchMessages.isSuccess) {
//       return null;
//     }

//     if (fetchMessages.messages === undefined) {
//       return null;
//     }

//     return fetchMessages.messages.length;
//   })();

//   return (
//     <Lib.Section id="useFetchMessages">
//       <Lib.SectionHeader className="mb-0">useFetchMessages</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-fetch-messages.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         <em>Note, we're using a burner wallet here.</em>
//       </Lib.SectionDescription>
//       <ConnectWalletButton override={wallet} />
//       <StartXmtpButton wallet={wallet} />
//       <StopXmtpButton wallet={wallet} />
//       <SendMessageButton from={WALLETS[0]} to={wallet} content="Hello!" />
//       <Lib.PrimaryButton
//         inactiveText="DISABLED (start client first)"
//         idleText="FETCH MESSAGES"
//         pendingText="FETCHING MESSAGES"
//         errorText="FETCH MESSAGES ERROR"
//         successText="FETCHED MESSAGES"
//         onClickIdle={() => {
//           if (fetchMessages === null) {
//             return;
//           } else {
//             fetchMessages.fetch({
//               conversation: {
//                 peerAddress: WALLETS[0].address,
//               },
//             });
//           }
//         }}
//         status={(() => {
//           if (fetchMessages === null) return "inactive";
//           if (fetchMessages.isIdle) return "idle";
//           if (fetchMessages.isPending) return "pending";
//           if (fetchMessages.isSuccess) return "success";
//           if (fetchMessages.isError) return "error";
//           throw new Error("Unhandled state");
//         })()}
//       />
//       <p className="flex items-center p-2 mb-6 min-h-[2rem] min-w-full bg-gray-200">
//         {numMessages === null
//           ? "Haven't fetched messages yet."
//           : `${numMessages} messages fetched.`}
//       </p>
//     </Lib.Section>
//   );
// };

// const usmWallet = Wallet.createRandom();

// export const UseSendMessage = () => {
//   const wallet = usmWallet;
//   const client = useClient({ wallet });
//   const stream0 = useMessageStream({ wallet: WALLETS[0] });
//   const stream1 = useMessageStream({ wallet: WALLETS[1] });

//   useEffect(() => {
//     if (client === null) {
//       return;
//     }

//     if (!client.isSuccess) {
//       client.start();
//     }
//   }, [client]);

//   useEffect(() => {
//     if (stream0 === null) {
//       return;
//     }

//     if (!stream0.isSuccess) {
//       stream0.start();
//     }
//   }, [stream0]);

//   useEffect(() => {
//     if (stream1 === null) {
//       return;
//     }

//     if (!stream1.isSuccess) {
//       stream1.start();
//     }
//   }, [stream1]);

//   return (
//     <Lib.Section id="useSendMessage">
//       <Lib.SectionHeader className="mb-0">useSendMessage</Lib.SectionHeader>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-send-message.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription className="mb-6">
//         <em>
//           Note, we're using 3 different burner wallets here: 1 to send messages
//           and another 2 to receive those messages. For the 2 recipients, we're
//           automatically starting their message streams when this component
//           mounts.
//         </em>
//       </Lib.SectionDescription>
//       <Lib.SectionDescription>
//         <em>Sender status indicator.</em>
//       </Lib.SectionDescription>
//       <Lib.StatusIndicator status={Lib.status(client || {})} />
//       <Lib.SectionDescription>
//         <em>Recipient 1 messages stream status indicator.</em>
//       </Lib.SectionDescription>
//       <Lib.StatusIndicator status={Lib.status(stream0 || {})} />
//       <SendMessageButton from={wallet} to={WALLETS[0]} content="Hello!" />
//       <LastMessageDisplay wallet={WALLETS[0]} />
//       <Lib.SectionDescription>
//         <em>Recipient 2 messages stream status indicator.</em>
//       </Lib.SectionDescription>
//       <Lib.StatusIndicator status={Lib.status(stream1 || {})} />
//       <SendMessageButton from={wallet} to={WALLETS[1]} content="Hello!" />
//       <LastMessageDisplay wallet={WALLETS[1]} />
//     </Lib.Section>
//   );
// };

// const ufponWallet = Wallet.createRandom();

// export const UseFetchPeerOnNetwork = () => {
//   const wallet = ufponWallet;

//   return (
//     <Lib.Section id="useFetchPeerOnNetwork">
//       <Lib.SectionHeader className="mb-0">
//         useFetchPeerOnNetwork
//       </Lib.SectionHeader>
//       <Lib.SectionDescription>
//         An XMTP identity can be generated by any EVM-compatible wallet. Before
//         sending or receiving messages via XMTP, a user must generate the XMTP
//         identity and publish it to the network. The XMTP SDK provides a way to
//         check if an identity has been published to the network. The{" "}
//         <em>useFetchPeerOnNetwork</em>
//         exposes this functionality as a React hook.
//       </Lib.SectionDescription>
//       <Lib.SectionLink href="https://github.com/killthebuddh4/banyan/tree/master/packages/fig/src/use-fetch-peer-on-network.ts">
//         source
//       </Lib.SectionLink>
//       <Lib.SectionDescription>
//         <em>Note, we're using a burner wallet here.</em>
//       </Lib.SectionDescription>
//       <ConnectWalletButton override={wallet} />
//       <Lib.SectionDescription>
//         <em>Confirm that our burner wallet is not on the network.</em>
//       </Lib.SectionDescription>
//       <FetchPeerOnNetworkButton peerAddress={wallet.address} />
//       <Lib.SectionDescription>
//         <em>If we try to send a message, it will fail.</em>
//       </Lib.SectionDescription>
//       <SendMessageButton
//         from={WALLETS[1]}
//         to={wallet}
//         content="You are on XMTP now!"
//       />
//       <Lib.SectionDescription>
//         <em>Now let's join XMTP by starting up a client.</em>
//       </Lib.SectionDescription>
//       <StartXmtpButton wallet={wallet} />
//       <Lib.SectionDescription>
//         <em>Confirm the burner wallet is now on the network.</em>
//       </Lib.SectionDescription>
//       <FetchPeerOnNetworkButton peerAddress={wallet.address} />
//       <Lib.SectionDescription>
//         <em>And the send message succeeds.</em>
//       </Lib.SectionDescription>
//       <SendMessageButton
//         from={WALLETS[1]}
//         to={wallet}
//         content="You are on XMTP now!"
//       />
//     </Lib.Section>
//   );
// };

// export const FetchPeerOnNetworkButton = ({
//   peerAddress,
// }: {
//   peerAddress?: string;
// }) => {
//   const fetchPeerOnNetwork = useFetchPeerOnNetwork({
//     wallet: WALLETS[0],
//     peerAddress,
//   });

//   return (
//     <Lib.PrimaryButton
//       inactiveText="DISABLED (start client first)"
//       idleText="FETCH PEER"
//       pendingText="FETCHING PEER"
//       errorText="FETCH PEER ERROR"
//       successText={
//         fetchPeerOnNetwork?.isPeerOnNetwork ? "PEER FOUND" : "PEER NOT FOUND"
//       }
//       onClickIdle={() => {
//         if (fetchPeerOnNetwork === null) {
//           return;
//         } else {
//           fetchPeerOnNetwork.fetch();
//         }
//       }}
//       status={(() => {
//         if (fetchPeerOnNetwork === null) return "inactive";
//         if (fetchPeerOnNetwork.isIdle) return "idle";
//         if (fetchPeerOnNetwork.isPending) return "pending";
//         if (fetchPeerOnNetwork.isSuccess) return "success";
//         if (fetchPeerOnNetwork.isError) return "error";
//         throw new Error("Unhandled state");
//       })()}
//     />
//   );
// };
