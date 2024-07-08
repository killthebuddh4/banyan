"use client";

import { Wallet } from "@ethersproject/wallet";
import { useLogin, useBrpc, usePubSub } from "@killthebuddha/fig";
import { useOwnerStore, join, post } from "./owner";
import { sync, ping } from "./g/[address]/member";
import { useEffect, useMemo, useState } from "react";

const renderDate = (date: number) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

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

      console.log(
        `WHISPER :: OWNER :: Syncing with ${brpcClients.length} members`,
      );

      try {
        const result = await Promise.all(
          brpcClients.map(async (client) => {
            return client.sync({ messages });
          }),
        );

        console.log(
          `WHISPER :: OWNER :: Synced with ${brpcClients.length} members`,
        );

        useOwnerStore.setState((state) => {
          return {
            ...state,
            isSending: false,
            messageInput: "",
          };
        });
      } catch (error) {
        console.error("WHISPER :: OWNER :: error while syncing", error);
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

  return (
    <div className="app">
      <div className={`message fadeIn`}>
        <div className="messageHeader">
          <h1>hush bot</h1>
          <time>{renderDate(Date.now())}</time>
        </div>
        <p>
          Hush is an app for <b>private</b>, <b>secure</b>, and <b>ephemeral</b>{" "}
          groupchats.{" "}
          <a href="https://github.com/banyan">Click here to learn more</a>.
        </p>
        <p>
          To <b>initialize the group</b>, enter an alias (your ephemeral
          username) username) and click the "Launch" button.
        </p>
      </div>

      {alias === null ? null : (
        <div className={`message fadeIn`}>
          <div className="messageHeader">
            <h1>hush bot</h1>
            <time>{String(new Date())}</time>
          </div>
          <p>
            Ok, your alias is set to <span className="alias">{alias}</span>.
            I'll initialize the groupchat now, 1 sec...
          </p>
        </div>
      )}

      {isStreaming && wallet !== undefined && (
        <div className={`message fadeIn`}>
          <div className="messageHeader">
            <h1>hush bot</h1>
            <time>{String(new Date())}</time>
          </div>
          <p>
            Ok, the groupchat is live! <b>Share the following URL</b> with
            anyone you want to invite.
          </p>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `http://localhost:3000/g/${wallet.address}`,
              )
            }
            className="groupchatLink"
          >
            {`https://hush.banyan.sh/g/${wallet.address}`}
          </button>
        </div>
      )}
      <div className="messages">
        {messages.map((message) => {
          return (
            <div
              className={`message fadeIn ${message.sender === wallet?.address ? "outbound" : "inbound"}`}
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
        className="input aliasInputForm"
        onSubmit={async (e) => {
          e.preventDefault();

          // WHEN THE INPUT IS FOR THE ALIAS
          if (alias === null) {
            // Better UX here.
            if (aliasInput.length === 0) {
              return;
            }

            useOwnerStore.setState((state) => {
              return {
                ...state,
                alias: aliasInput,
              };
            });
          }

          // WHEN THE INPUT IS FOR SENDING A MESSAGE
          if (isStreaming) {
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

            try {
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
            } catch (error) {
              console.error(
                "WHISPER :: Input.tsx :: error while sending",
                error,
              );
            }
          }
        }}
      >
        <input
          type="text"
          placeholder={
            // TODO I think there's more states here.
            alias === null ? "Enter an alias..." : "Type a message..."
          }
          value={(() => {
            if (alias === null) {
              return aliasInput;
            }

            if (isStreaming) {
              return messageInput;
            }
          })()}
          onChange={(e) => {
            // WHEN ITS AN INPUT FOR THE ALIAS
            if (alias === null) {
              return useOwnerStore.setState((state) => {
                return {
                  ...state,
                  aliasInput: e.target.value,
                };
              });
            }

            // WHEN ITS AN INPUT FOR SENDING A MESSAGE
            if (isStreaming) {
              return useOwnerStore.setState((state) => {
                return {
                  ...state,
                  messageInput: e.target.value,
                };
              });
            }
          }}
        />
        <button type="submit">
          {(() => {
            if (isLaunching) {
              return "Launching...";
            }

            if (isSending) {
              return "Sending...";
            }

            if (alias === null) {
              return "Launch";
            }

            if (brpcClients !== null) {
              return "Send";
            }
          })()}
        </button>
      </form>
    </div>
  );
}
