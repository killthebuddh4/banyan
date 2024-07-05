import { Wallet } from "@ethersproject/wallet";
import { useEffect, useMemo, useState } from "react";
import { usePubSub, Signer, useLogin, useBrpc } from "@killthebuddha/fig";
import { useParams } from "next/navigation.js";
import { join, post } from "./ownerApi";
import { useMemberStore, sync, ping } from "./memberApi";

export const Member = () => {
  const { address: serverAddress } = useParams();

  if (typeof serverAddress !== "string") {
    throw new Error("No group address provided");
  }

  useEffect(() => {
    useMemberStore.setState((state) => {
      if (state.owner !== null) {
        return state;
      }

      return {
        ...state,
        owner: { address: serverAddress, alias: "owner", lastSeen: Date.now() },
      };
    });
  }, []);

  const [wallet, setWallet] = useState<Signer | undefined>(undefined);

  useEffect(() => {
    setWallet((prev) => {
      if (prev !== undefined) {
        return prev;
      }

      return Wallet.createRandom();
    });
  }, []);

  const { isLoggedIn, isLoggingIn, isLoginError } = useLogin({
    wallet,
    opts: { autoLogin: true, env: "production" },
  });

  const { isStarting, isStreaming } = usePubSub({
    wallet,
    opts: { autoStart: true },
  });

  const clientStatus = useMemo(() => {
    if (isLoggingIn) {
      return "Connecting to XMTP...";
    }

    if (isLoginError) {
      return "XMTP connection error";
    }

    if (isLoggedIn) {
      return "Connected to XMTP";
    }

    return "";
  }, [isLoggingIn, isLoginError, isLoggedIn]);

  const brpc = useBrpc({ wallet });

  const client = useMemo(() => {
    if (brpc.client === null) {
      return null;
    }

    return brpc.client({
      api: { join, post },
      topic: {
        peerAddress: serverAddress,
        context: {
          conversationId: "banyan.sh/whisper",
          metadata: {},
        },
      },
      options: {
        onReceivedInvalidResponse: ({ message }) => {
          console.error("WHISPER :: Member.tsx :: invalid response", message);
        },
        onInvalidPayload: ({ message }) => {
          console.error("WHISPER :: Member.tsx :: invalid payload", message);
        },
      },
    });
  }, [brpc.client, serverAddress]);

  const [alias, setAlias] = useState<string | null>(null);
  const [aliasInput, setAliasInput] = useState("");

  useEffect(() => {
    (async () => {
      if (brpc.router === null) {
        return;
      }

      brpc.router({
        api: { sync, ping },
        topic: {
          peerAddress: serverAddress,
          context: {
            conversationId: "banyan.sh/whisper",
            metadata: {},
          },
        },
      });
    })();
  }, [brpc.router, serverAddress]);

  const messages = useMemberStore((state) => state.messages);

  const [isSending, setIsSending] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const numMembers = 0;

  if (wallet === undefined) {
    return null;
  }

  if (alias === null) {
    return (
      <div className="app">
        <form
          className="create"
          onSubmit={async (e) => {
            e.preventDefault();

            if (client === null) {
              return;
            }

            if (aliasInput === "") {
              return;
            }

            const response = await client.join({ alias: aliasInput });

            console.log(
              "WHISPER :: MEMBER.tsx :: client.join response",
              response,
            );

            if (!response.ok) {
              return;
            }

            if (!response.data.joined) {
              return;
            }

            setAliasInput("");

            setAlias(aliasInput);
          }}
        >
          <div className="createInner">
            <p className="createInstructions">
              You've been invited to join an <b>ephemeral</b>, <b>private</b>,{" "}
              <b>end-to-end encrypted</b> groupchat.
            </p>
            <p className="createInstructions">
              <em>Before you can join, please create an alias.</em>
            </p>

            <div className="join">
              <input
                type="text"
                placeholder="Enter an alias..."
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
              />
              <button
                type="submit"
                className={`${client === null ? "cannotJoin" : "canJoin"}`}
              >
                Join
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="messages">
        <div className={`client`}>{clientStatus}</div>
        <div className="created">
          <p>You've joined a private, secure, and ephemeral groupchat!</p>

          <p>
            If you close the browser tab, you can rejoin, but you won't see any
            of the previous messages.
          </p>
          <p>
            IMPORTANT: We cannot prevent the other members of the chat from
            recording the conversation.
          </p>
          <div>
            <em>
              If you'd like to learn more about how this works, click{" "}
              <a href="/about">here</a>.
            </em>
          </div>
          {(() => {
            if (numMembers === 0) {
              console.warn(
                "There are no members in this group even though you are a member.",
              );
              return null;
            }

            return (
              <div>
                <b>
                  {(() => {
                    if (numMembers === 1) {
                      return "There is 1 other person in this group.";
                    } else {
                      return `There are ${numMembers} other people are in this group.`;
                    }
                  })()}
                </b>
              </div>
            );
          })()}
        </div>

        {messages.map((message) => {
          return (
            <div
              className={`message fadeIn ${message.sender === wallet.address ? "outbound" : "inbound"}`}
            >
              {message.text}
            </div>
          );
        })}
      </div>
      <form
        className="input"
        onSubmit={async (e) => {
          e.preventDefault();

          if (messageInput === "") {
            return;
          }

          if (client === null) {
            return;
          }

          setIsSending(true);

          try {
            await client.post({ text: messageInput });
          } catch (error) {
            console.error("WHISPER :: Input.tsx :: error while sending", error);
          } finally {
            setIsSending(false);
          }

          setMessageInput("");
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">{isSending ? "Sending..." : "Send"}</button>
      </form>
    </div>
  );
};
