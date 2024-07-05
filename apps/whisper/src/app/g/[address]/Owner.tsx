import { useLogin, useBrpc, usePubSub } from "@killthebuddha/fig";
import { useOwnerStore, join, post } from "./ownerApi";
import { sync, ping } from "./memberApi";
import { useEffect, useMemo, useState } from "react";

export const Owner = () => {
  const members = useOwnerStore((s) => s.members);
  const wallet = useOwnerStore((s) => s.wallet);

  if (wallet === null) {
    throw new Error("WHISPER :: Owner.tsx :: wallet === null");
  }

  const { isLoggingIn, isLoggedIn, isLoginError } = useLogin({
    wallet,
    opts: { autoLogin: true, env: "production" },
  });

  const { isStarting, isStreaming, isError, start } = usePubSub({
    wallet,
    opts: { autoStart: false },
  });

  useEffect(() => {
    if (start === null) {
      return;
    }

    setTimeout(() => {
      start();
    }, 1000);
  }, [start]);

  const brpc = useBrpc({ wallet });

  useEffect(() => {
    if (brpc.router === null) {
      return;
    }

    brpc.router({
      api: { join, post },
      topic: {
        peerAddress: "",
        context: {
          conversationId: "banyan.sh/whisper",
          metadata: {},
        },
      },
      options: {
        onSentResponse: (response) => {
          console.log("WHISPER :: Owner.tsx :: response", response);
        },
      },
    });
  }, [brpc.router]);

  const clients = useMemo(() => {
    const client = brpc.client;

    if (client === null) {
      return null;
    }

    return Object.keys(members).map((address) => {
      return client({
        api: { sync, ping },
        topic: {
          peerAddress: address,
          context: {
            conversationId: "banyan.sh/whisper",
            metadata: {},
          },
        },
      });
    });
  }, [brpc.client, members]);

  const messages = useOwnerStore((state) => state.messages);

  useEffect(() => {
    (async () => {
      if (clients === null) {
        return;
      }

      console.log(
        `WHISPER :: Owner.tsx :: syncing with ${clients.length} clients (there are ${Object.keys(members).length} members)`,
      );

      await Promise.all(
        clients.map(async (client) => {
          return client.sync({ messages });
        }),
      );

      console.log(
        "WHISPER :: Owner.tsx :: synced with ${clients.length} clients",
      );
    })();
  }, [clients, messages]);

  const [isSending, setIsSending] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="app">
      <div className="messages">
        <div className="connecting">
          {(() => {
            const steps = [];

            if (isLoggingIn) {
              steps.push(<div>Connecting to XMTP...</div>);
            }

            if (isLoggedIn) {
              steps.push(<div>Connecting to XMTP...</div>);
              steps.push(<div>Connected to XMTP!</div>);
            }

            if (isStarting) {
              steps.push(<div>Starting XMTP message stream...</div>);
            }

            if (isStreaming) {
              steps.push(<div>Starting XMTP message stream...</div>);
              steps.push(<div>Started XMTP message stream!...</div>);
            }

            return steps;
          })()}
        </div>
        {(() => {
          if (!isStreaming) {
            return null;
          }

          return (
            <div className="created fadeIn">
              <p>You've created a private, secure, and ephemeral groupchat!</p>
              <p>
                <b>Share the URL</b> from the URL bar with whoever you want to
                invite. Anyone with the URL can join.
              </p>
              <p>
                When you're done, <b>close this browser tab</b>. The
                conversation will be <b>gone forever</b>.
              </p>
              <p>
                IMPORTANT: We cannot prevent invited users from recording the
                conversation.
              </p>
              <div>
                <em>
                  If you'd like to learn more about how this works, click{" "}
                  <a href="/about">here</a>.
                </em>
              </div>
            </div>
          );
        })()}

        {messages.map((message) => {
          return (
            <div
              className={`message fadeIn ${message.sender === wallet.address ? "outbound" : "inbound"}`}
            >
              <div className="messageHeader">
                <h1>{message.alias}</h1>
                <time>{String(new Date(message.timestamp))}</time>
              </div>
              <p>{message.text}</p>
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

          setIsSending(true);

          try {
            useOwnerStore.setState((state) => {
              const found = state.messages.find((m) => m.text === messageInput);

              if (found !== undefined) {
                return state;
              }

              return {
                ...state,
                messages: [
                  ...state.messages,
                  {
                    id: crypto.randomUUID(),
                    text: messageInput,
                    sender: wallet.address,
                    timestamp: Date.now(),
                    alias: "owner",
                  },
                ],
              };
            });
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
