type ListRoute = {
  route: "list";
};

type ConversationRoute = {
  route: "conversation";
  conversation: {
    peerAddress: string;
  };
};

export type Route = ListRoute | ConversationRoute;
