import React, { useEffect, useSyncExternalStore } from "react";
import { z } from "zod";
import { Conversation } from "../conversation/Conversation.js";
import { ConversationList } from "../conversation-list/ConversationList.js";
import { createSubscribe } from "./createSubscribe.js";
import { getRoute } from "./getRoute.js";
import { setRoute } from "./setRoute.js";
import { routerStore } from "./routerStore.js";
import { optionsSchema } from "../cli/optionsSchema.js";

export const Router = ({
  options,
}: {
  options: z.infer<typeof optionsSchema>;
}) => {
  const route = useSyncExternalStore(
    createSubscribe({ store: routerStore }),
    () => getRoute({ store: routerStore }),
  );

  useEffect(() => {
    if (options.peerAddress === undefined) {
      setRoute({
        store: routerStore,
        route: {
          route: "list",
        },
      });
    } else {
      setRoute({
        store: routerStore,
        route: {
          route: "conversation",
          conversation: { peerAddress: options.peerAddress },
        },
      });
    }
  }, [options.peerAddress]);

  if (route === null) {
    return null;
  } else if (route.route === "list") {
    return <ConversationList pk={options.privateKey} />;
  } else if (route.route === "conversation") {
    return (
      <Conversation
        pk={options.privateKey}
        peerAddress={route.conversation.peerAddress}
      />
    );
  } else {
    throw new Error("unreachable");
  }
};
