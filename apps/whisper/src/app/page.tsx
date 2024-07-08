"use client";

import { Wallet } from "@ethersproject/wallet";
import { useLogin, useBrpc, usePubSub } from "@killthebuddha/fig";
import { useOwnerStore, join, post } from "./owner";
import { sync, ping } from "./g/[address]/member";
import { useEffect, useMemo, useState } from "react";

export default function Owner() {
  const wallet = useOwnerStore((s) => s.wallet);

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
    });
  }, [brpc.router]);

  const members = useOwnerStore((s) => s.members);

  const brpcClients = useMemo(() => {
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
      if (brpcClients === null) {
        return;
      }

      try {
        await Promise.all(
          brpcClients.map(async (client) => {
            return client.sync({ messages });
          }),
        );

        useOwnerStore.setState((state) => {
          return {
            ...state,
            isSending: false,
            messageInput: "",
          };
        });
      } catch (error) {
        // TODO
      }
    })();
  }, [brpcClients, messages]);

  const alias = useOwnerStore((s) => s.alias);

  useEffect(() => {
    if (typeof alias !== "string") {
      return;
    }

    useOwnerStore.setState((state) => {
      return {
        ...state,
        wallet: Wallet.createRandom(),
      };
    });
  }, [alias]);

  const { login } = useLogin({
    wallet,
    opts: { autoLogin: false, env: "production" },
  });

  useEffect(() => {
    if (wallet === undefined) {
      return;
    }

    if (login === null) {
      return;
    }

    login({});
  }, [wallet, login]);

  const { isStreaming, start } = usePubSub({
    wallet,
    opts: { autoStart: false },
  });

  useEffect(() => {
    if (start === null) {
      return;
    }

    start();
  }, [start]);

  const aliasInput = useOwnerStore((s) => s.aliasInput);

  const isLaunching = wallet !== undefined && !isStreaming;

  const messageInput = useOwnerStore((s) => s.messageInput);

  const isSending = useOwnerStore((s) => s.isSending);

  const [showLauncher, setShowLauncher] = useState(true);

  useEffect(() => {
    if (!isStreaming) {
      setShowLauncher(true);
    }

    if (isStreaming) {
      setTimeout(() => {
        setShowLauncher(false);
      }, 1000);
    }
  }, [isStreaming]);

  return (
    <div className="app">
      {isStreaming && (
        <div className="launcherWrapper">
          <form
            className="launcherForm"
            onSubmit={(e) => {
              e.preventDefault();

              if (alias !== null) {
                return;
              }

              if (aliasInput.length === 0) {
                return;
              }

              useOwnerStore.setState((state) => {
                return {
                  ...state,
                  alias: aliasInput,
                  aliasInput: "",
                };
              });
            }}
          >
            <div className="launcherHeader">
              <div className="launcherOss">
                <p>
                  Hush is <b>private</b>, <b>secure</b>, and <b>ephemeral</b>{" "}
                  groupchats.{" "}
                </p>
              </div>
              <a className="launcherLearnMore" href="https://github.com/banyan">
                Click here to learn more
              </a>
            </div>
            <div className="launcherInputWrapper">
              <input
                className="launcherInput"
                type="text"
                placeholder="Enter an alias (an ephemeral username)..."
                value={alias || aliasInput}
                onChange={(e) => {
                  if (alias !== null) {
                    return;
                  }

                  useOwnerStore.setState((state) => {
                    return {
                      ...state,
                      aliasInput: e.target.value,
                    };
                  });
                }}
              />
              <button className="launcherInputButton" onClick={() => null}>
                {alias === null ? "Launch" : "Launching..."}
              </button>
            </div>
          </form>
        </div>
      )}
      {showLauncher && (
        <header className="appHeader">
          <a
            className="groupchatUrl"
            target="_blank"
            href={`https://hush.banyan.sh/g/${wallet?.address}`}
          >{`https://hush.banyan.sh/g/${wallet?.address}`}</a>
          <a href="https://github.com">Learn More</a>
        </header>
      )}
      {showLauncher && (
        <>
          {/* <div className="inviteUrl">
            <p>
              Anyone with the following URL can join your groupchat. (click to
              copy)
            </p>
            <p className="groupchatUrl">{`http://hush.banyan.sh/g/${wallet?.address}`}</p>
            <a target="_blank" href={`https://github.com`}>
              GitHub
            </a>
          </div> */}
          <div className="instructions">
            <p>You've created a private, secure, and ephemeral groupchat.</p>
            <p>
              <b>Anyone with your group's invite URL can join the groupchat.</b>
            </p>
            <p>
              The group will exist only until this browser tab is closed or
              refreshed.
            </p>
            <p className="terminate">
              To terminate the groupchat, close or refresh this browser tab.
            </p>
            <p>
              When the groupchat is destroyed, the other members who have
              already joined will be notified.
            </p>
            <p>
              <span className="warning">WARNING</span>: We cannot prevent any
              members of the group from recording the conversation.
            </p>
          </div>
          <form
            className="messageInputForm"
            onSubmit={async (e) => {
              e.preventDefault();

              if (!isStreaming) {
                return;
              }

              if (isSending) {
                return;
              }

              if (messageInput === "") {
                return;
              }

              useOwnerStore.setState((state) => {
                return {
                  ...state,
                  isSending: true,
                };
              });

              useOwnerStore.setState((state) => {
                const found = state.messages.find(
                  (m) => m.text === messageInput,
                );

                if (found !== undefined) {
                  return state;
                }

                if (state.wallet === undefined) {
                  return state;
                }

                if (state.alias === null) {
                  return state;
                }

                return {
                  ...state,
                  messages: [
                    ...state.messages,
                    {
                      id: crypto.randomUUID(),
                      text: messageInput,
                      sender: state.wallet.address,
                      timestamp: Date.now(),
                      alias: state.alias,
                    },
                  ],
                };
              });
            }}
          >
            <input
              className="messageInputInput"
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => {
                return useOwnerStore.setState((state) => {
                  return {
                    ...state,
                    messageInput: e.target.value,
                  };
                });
              }}
            />
          </form>
        </>
      )}
      {/* <div classname="messages">
        {messages.map((message) => {
          return (
            <div
              classname={`message fadein ${message.sender === wallet?.address ? "outbound" : "inbound"}`}
            >
              <div classname="messageheader">
                <h1>{message.alias}</h1>
                <time>{string(new date(message.timestamp))}</time>
              </div>
              <p>{message.text}</p>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}

const renderDate = (date: number) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
