"use client";

import { Wallet } from "@ethersproject/wallet";
import { useLogin, useStream, useActions } from "@killthebuddha/fig";
import { useOwnerStore } from "@/hooks/useOwnerStore";
import { useMemberClients } from "@/hooks/useMemberClients";
import { useMemo, useEffect, useState } from "react";

export const Owner = () => {
  const wallet = useOwnerStore((s) => s.wallet);

  if (wallet === undefined) {
    throw new Error("Owner :: wallet is undefined");
  }

  const {
    isReady: isReadyToStream,
    isPending: isStreamStarting,
    isSuccess: isStreaming,
  } = useStream({ wallet });

  const messages = useOwnerStore((state) => state.messages);

  const memberClients = useMemberClients({ wallet });

  useEffect(() => {
    (async () => {
      try {
        await Promise.all(
          memberClients.map(async (client) => {
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
  }, [memberClients, messages]);

  const alias = useOwnerStore((s) => s.alias);

  const {
    isReady: isReadyToLogin,
    isPending: isLoggingIn,
    isSuccess: isLoggedIn,
    login,
  } = useLogin({
    wallet,
    opts: { env: "production" },
  });

  const aliasInput = useOwnerStore((s) => s.aliasInput);

  const messageInput = useOwnerStore((s) => s.messageInput);

  const isSending = useOwnerStore((s) => s.isSending);

  const { startClient, startGlobalMessageStream } = useActions();

  // Extracted from onSubmit handler so that we can call it from onKeyDown as
  // well.
  const submit = () => {
    if (messageInput === "/help") {
      useOwnerStore.setState((state) => {
        return {
          ...state,
          messageInput: "",
          showInstructions: true,
        };
      });
    }

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
      const found = state.messages.find((m) => m.text === messageInput);

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
        messageInput: "",
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
  };

  const launchSubmitHandler = useMemo(() => {
    return async () => {
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

      const wallet = Wallet.createRandom();

      await new Promise((resolve) => setTimeout(resolve, 500));

      useOwnerStore.setState((state) => {
        return {
          ...state,
          wallet,
        };
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const loginResult = await startClient({
        wallet,
        opts: { env: "production" },
      });

      if (!loginResult.ok) {
        // TODO The error should be reflected in login.isError, right?
        console.log("hush :: OWNER :: login failed", loginResult);
        return;
      }

      console.log("hush :: OWNER :: login success", loginResult);

      const streamResult = await startGlobalMessageStream(wallet);

      if (!streamResult.ok) {
        // TODO The error should be reflected in stream.isError, right?
        console.log("hush :: OWNER :: stream failed", streamResult);
        return;
      }

      console.log("hush :: OWNER :: stream success", streamResult);

      useOwnerStore.setState((state) => {
        return {
          ...state,
          showInstructions: true,
        };
      });
    };
  }, [alias, aliasInput]);

  const [showLauncher, setShowLauncher] = useState(true);

  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    setTimeout(() => {
      setShowLauncher(false);
    }, 750);
  }, [isStreaming, setShowLauncher]);

  console.log("ALIAS AND WALLET", alias, wallet);

  return (
    <div className="app">
      <header className="appHeader">
        <p>
          Hush <span className="beta">(beta)</span> is{" "}
          <a href="/">open source</a>.
        </p>
        <a href="https://github.com">Learn More</a>
      </header>
      {/* <div className="instructionsWrapper">
        <div className="instructions">
          <header className="instructionsHeader">
            <button
              autoFocus
              onClick={() => {
                useOwnerStore.setState((state) => {
                  return {
                    ...state,
                    showInstructions: false,
                  };
                });
              }}
            >
              close
            </button>
          </header>
          <p>
            <em>
              You've created a private, secure, and ephemeral groupchat! 🎉
            </em>{" "}
          </p>
          <p>Your group's invite URL is:</p>
          <p className="inviteUrl">
            {`https://hush.banyan.sh/g/${wallet?.address}`}
          </p>
          <p>
            <b>Anyone with the group's invite URL can join the conversation.</b>
          </p>
          <p>
            Messages will exist only until this browser tab is closed or
            refreshed.
          </p>
          <p className="terminate">
            To end the conversation, close or refresh this browser tab.
          </p>
          <p>
            When the groupchat is destroyed, the other members who have already
            joined will be notified.
          </p>
          <p>
            <span className="warning">WARNING</span>: We cannot prevent any
            members of the group from recording the conversation.
          </p>
          <button
            className="copyInviteUrlButton"
            onClick={() => {
              navigator.clipboard.writeText(
                `http://hush.banyan.sh/g/${wallet?.address}`,
              );

              setTimeout(() => {
                useOwnerStore.setState((state) => {
                  return {
                    ...state,
                    inviteUrlCopied: false,
                  };
                });
              }, 2000);

              useOwnerStore.setState((state) => {
                return {
                  ...state,
                  inviteUrlCopied: true,
                  showInstructions: false,
                };
              });
            }}
          >
            Copy Invite URL and Continue
          </button>
        </div>
      </div> */}
      <form
        className="messageInputForm"
        onSubmit={async (e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="groupStatus">
          <p>
            If you aren't sure what to do, try typing{" "}
            <span className="help">/help</span>.
          </p>
        </div>
        <textarea
          autoFocus
          className="messageInputTextArea"
          placeholder="Type a message..."
          value={messageInput}
          onKeyDown={(e) => {
            if (e.key !== "Enter") {
              return;
            }

            if (e.shiftKey) {
              return;
            }

            e.preventDefault();
            submit();
          }}
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
};

const renderDate = (date: number) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
