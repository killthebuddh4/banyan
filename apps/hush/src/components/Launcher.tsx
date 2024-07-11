"use client";

import { Wallet } from "@ethersproject/wallet";
import { useLogin, useStream, useActions } from "@killthebuddha/fig";
import { useOwnerStore } from "@/hooks/useOwnerStore";
import { useRouter } from "next/navigation.js";
import { useMemberClients } from "@/hooks/useMemberClients";
import { useMemo, useEffect, useState } from "react";
import { ActionButton } from "./ActionButton";

export const Launcher = () => {
  const wallet = useOwnerStore((s) => s.wallet);
  const stream = useStream({ wallet });
  const actions = useActions();
  const login = useLogin({ wallet, opts: { env: "production" } });
  const alias = useOwnerStore((s) => s.alias);
  const aliasInput = useOwnerStore((s) => s.aliasInput);
  const router = useRouter();
  const isError = useOwnerStore((s) => s.isError);

  const submitHandler = useMemo(() => {
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
        };
      });

      const wallet = Wallet.createRandom();

      useOwnerStore.setState((state) => {
        return {
          ...state,
          wallet,
        };
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const loginResult = await actions.startClient({
          wallet,
          opts: { env: "production" },
        });

        if (!loginResult.ok) {
          useOwnerStore.setState((state) => {
            return {
              ...state,
              isError: true,
            };
          });

          return;
        }
      } catch {
        useOwnerStore.setState((state) => {
          return {
            ...state,
            isError: true,
          };
        });

        return;
      }

      try {
        const streamResult = await actions.startGlobalMessageStream(wallet);

        if (!streamResult.ok) {
          useOwnerStore.setState((state) => {
            return {
              ...state,
              isError: true,
            };
          });

          return;
        }
      } catch {
        useOwnerStore.setState((state) => {
          return {
            ...state,
            isError: true,
          };
        });

        return;
      }

      router.push(`/g/${wallet.address}`);
    };
  }, [alias, aliasInput]);

  return (
    <div className="app">
      <div className="launcherWrapper">
        <form
          className="launcherForm"
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler();
          }}
        >
          <p className="launcherOss">
            <em>Hush</em> <span className="beta">(beta)</span> is <b>private</b>
            , <b>secure</b>, and <b>ephemeral</b> groupchats.{" "}
          </p>
          <div className="launcherInputWrapper">
            <input
              className="launcherInput"
              autoFocus
              type="text"
              placeholder="Enter a temporary username..."
              value={aliasInput}
              onChange={(e) => {
                useOwnerStore.setState((state) => {
                  if (state.isError) {
                    return state;
                  }

                  if (state.alias !== null) {
                    return state;
                  }

                  return {
                    ...state,
                    aliasInput: e.target.value,
                  };
                });
              }}
            />
            <button
              className={(() => {
                let base = "launchButton action";

                if (isError) {
                  return `${base} error`;
                }

                if (aliasInput.length === 0) {
                  return `${base} disabled`;
                }

                if (alias !== null) {
                  return `${base} running`;
                }

                return `${base} enabled`;
              })()}
              onClick={(e) => {
                e.preventDefault();

                if (isError) {
                  return;
                }

                if (aliasInput.length === 0) {
                  return;
                }

                if (alias !== null) {
                  return;
                }

                submitHandler();
              }}
            >
              {(() => {
                if (isError) {
                  return "Error";
                }

                if (alias !== null) {
                  return "Launching...";
                }

                return "Launch";
              })()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
