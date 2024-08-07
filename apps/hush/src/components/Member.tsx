"use client";

import { Wallet } from "@ethersproject/wallet";
import { useLogin, useStream } from "@killthebuddha/fig";
import { useJoin } from "@/hooks/useJoin";
import { usePost } from "@/hooks/usePost";
import { useMemberStore } from "@/hooks/useMemberStore";
import { useEffect, useMemo } from "react";

export const Member = () => {
  const wallet = useMemberStore((s) => s.wallet);
  const messages = useMemberStore((state) => state.messages);
  const alias = useMemberStore((s) => s.alias);
  const isJoining = useMemberStore((s) => s.isJoining);
  const isJoined = useMemberStore((s) => s.isJoined);

  useEffect(() => {
    if (typeof alias !== "string") {
      return;
    }

    useMemberStore.setState((state) => {
      return {
        ...state,
        wallet: Wallet.createRandom(),
      };
    });
  }, [alias]);

  const {
    isReady: isReadyToLogin,
    isPending: isLoggingIn,
    isSuccess: isLoggedIn,
    login,
  } = useLogin({
    wallet,
    opts: { env: "production" },
  });

  const {
    isReady: isReadyToStream,
    isPending: isStartingStream,
    isSuccess: isStreaming,
    start,
  } = useStream({ wallet });

  const Info = useMemo(() => {
    return (
      <div className="info">
        <p>
          You've been invited to a <b>private</b>, <b>secure</b>, and{" "}
          <b>ephemeral</b> groupchat.{" "}
          <a href="https://github.com/banyan">Click here to learn more</a>.
        </p>

        <p>
          To <b>join the conversation</b>, enter an alias (your ephemeral
          username) and click the "Launch" button.
        </p>

        {alias === null ? null : (
          <p>
            Launching app, your alias is <span className="alias">{alias}</span>
          </p>
        )}

        {wallet === undefined ? null : (
          <p>{`Created a temporary identity with address: ${wallet.address}`}</p>
        )}

        {isLoggingIn ? <p>Joining XMTP network...</p> : null}
        {isLoggedIn ? <p>Joined XMTP network!</p> : null}
        {isReadyToStream ? <p>Connecting to XMTP message stream ...</p> : null}
        {isStreaming ? <p>Connected to XMTP message stream!...</p> : null}
        {isJoining ? <p>Joining conversation...</p> : null}
        {isJoined ? <p>Joined conversation!</p> : null}
      </div>
    );
  }, [alias, wallet, isStreaming, isReadyToStream, isLoggingIn, isLoggedIn]);

  const aliasInput = useMemberStore((s) => s.aliasInput);

  const isLaunching = wallet !== undefined; // && !isStreaming;

  const LaunchingInput = useMemo(() => {
    if (alias === null) {
      return null;
    }

    if (isStreaming) {
      return null;
    }

    return (
      <form
        className="input launchingInputForm"
        onSubmit={async (e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Enter an alias..."
          value={alias}
          onChange={undefined}
        />
        <button type="submit">Launching</button>
      </form>
    );
  }, [aliasInput, isStreaming, alias]);

  const AliasInput = useMemo(() => {
    if (alias !== null) {
      return null;
    }

    return (
      <form
        className="input aliasInputForm"
        onSubmit={async (e) => {
          e.preventDefault();

          // Better UX here.
          if (aliasInput.length === 0) {
            return;
          }

          useMemberStore.setState((state) => {
            return {
              ...state,
              alias: aliasInput,
            };
          });
        }}
      >
        <input
          type="text"
          placeholder="Enter an alias..."
          value={aliasInput}
          onChange={(e) => {
            return useMemberStore.setState((state) => {
              return {
                ...state,
                aliasInput: e.target.value,
              };
            });
          }}
        />
        <button type="submit">{isLaunching ? "Launching..." : "Launch"}</button>
      </form>
    );
  }, [aliasInput, alias]);

  const messageInput = useMemberStore((s) => s.messageInput);

  useEffect(() => {
    // if (alias === null) {
    //   return;
    // }
    // (async () => {
    //   useMemberStore.setState((state) => {
    //     return {
    //       ...state,
    //       isJoining: true,
    //     };
    //   });
    //   console.log("hush :: MEMBER :: joining conversation as", alias);
    //   // TODO ERROR HANDLING
    //   try {
    //     const joinResult = await brpcClient.join({ alias });
    //     if (!joinResult.ok) {
    //       useMemberStore.setState((state) => {
    //         return {
    //           ...state,
    //           isJoining: false,
    //           isJoined: false,
    //         };
    //       });
    //     } else if (joinResult.data.joined === false) {
    //       useMemberStore.setState((state) => {
    //         return {
    //           ...state,
    //           isJoining: false,
    //           isJoined: false,
    //         };
    //       });
    //     } else {
    //       const ownerAlias = joinResult.data.ownerAlias;
    //       if (typeof ownerAlias !== "string") {
    //         throw new Error(
    //           "This was a hack and should be solved with typescript, if you're seeing this error then go fix the problem correctly.",
    //         );
    //       }
    //       useMemberStore.setState((state) => {
    //         return {
    //           ...state,
    //           isJoining: false,
    //           isJoined: true,
    //           owner: {
    //             address: serverAddress,
    //             alias: ownerAlias,
    //             lastSeen: Date.now(),
    //           },
    //         };
    //       });
    //     }
    //   } catch (error) {
    //     console.error("hush :: MEMBER :: error while joining", error);
    //   }
    // })();
  }, []);

  const isSending = useMemberStore((s) => s.isSending);

  const MessageInput = useMemo(() => {
    if (!isStreaming) {
      return null;
    }

    if (!isJoined) {
      return null;
    }

    return (
      <form
        className="input"
        onSubmit={async (e) => {
          // e.preventDefault();

          // if (isSending) {
          //   return;
          // }

          // if (messageInput === "") {
          //   return;
          // }

          // if (brpcClient === null) {
          //   return;
          // }

          // useMemberStore.setState((state) => {
          //   return {
          //     ...state,
          //     isSending: true,
          //   };
          // });

          // try {
          //   await brpcClient.post({
          //     text: messageInput,
          //   });

          //   useMemberStore.setState((state) => {
          //     return {
          //       ...state,
          //       isSending: false,
          //     };
          //   });
          // } catch (error) {
          //   console.error("hush :: Input.tsx :: error while sending", error);
          // } finally {
          //   useMemberStore.setState((state) => {
          //     return {
          //       ...state,
          //       isSending: false,
          //     };
          //   });
          // }

          useMemberStore.setState((state) => {
            return {
              ...state,
              messageInput: "",
            };
          });
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => {
            return useMemberStore.setState((state) => {
              return {
                ...state,
                messageInput: e.target.value,
              };
            });
          }}
        />
        <button type="submit">{isSending ? "Sending..." : "Send"}</button>
      </form>
    );
  }, [isStreaming, messageInput, isSending, isJoined]);

  return (
    <div className="app">
      {Info}
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
      {AliasInput}
      {LaunchingInput}
      {MessageInput}
    </div>
  );
};
