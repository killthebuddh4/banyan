import { z } from "zod";

export type Signer = {
  address: string;
  getAddress: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * SERIALIZABLE TYPES
 *
 *
 *
 *
 *
 * *************************************************************************/

export const zClient = z.object({
  address: z.string(),
  env: z.enum(["production", "dev"]),
  export: z.string().optional(),
});

export type Client = z.infer<typeof zClient>;

export const zClientOptions = z.object({
  env: z.enum(["production", "dev"]).optional().default("production"),
  privateKeyOverride: z.string().optional(),
});

export type ClientOptions = z.infer<typeof zClientOptions>;

export const zMessage = z.object({
  id: z.string(),
  conversation: z.object({
    peerAddress: z.string(),
    context: z
      .object({
        conversationId: z.string(),
        metadata: z.object({}),
      })
      .optional(),
  }),
  senderAddress: z.string(),
  sent: z.date(),
  content: z.unknown(),
});

export type Message = z.infer<typeof zMessage>;

export const zConversation = z.object({
  peerAddress: z.string(),
  context: z
    .object({
      conversationId: z.string(),
      metadata: z.object({}),
    })
    .optional(),
});

export type Conversation = z.infer<typeof zConversation>;

export const zListMessagesOptions = z.object({
  checkAddresses: z.boolean().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  limit: z.number().optional(),
  direction: z.enum(["ascending", "descending"]).optional(),
});

export type ListMessagesOptions = z.infer<typeof zListMessagesOptions>;

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * ACTIONS
 *
 *
 *
 *
 *
 * *************************************************************************/

export type ActionResult<T> =
  | {
      status: 200;
      data: T;
    }
  | {
      status: 400;
      data?: undefined;
      error?: string;
    }
  | {
      status: 500;
      data?: undefined;
      error?: string;
    };

export type Actions = {
  subscribeToClientStore: ({
    onChange,
  }: {
    onChange: (c: AsyncState<undefined>) => void;
  }) => void;
  getClient: () => Promise<AsyncState<undefined>>;
  startClient: (
    wallet: Signer,
    opts?: ClientOptions
  ) => Promise<ActionResult<unknown>>;
  stopClient: () => Promise<ActionResult<unknown>>;
  getMessagesStream: () => Promise<AsyncState<undefined>>;
  subscribeToMessagesStreamStore: ({
    onChange,
  }: {
    onChange: (c: AsyncState<undefined>) => void;
  }) => void;
  startMessagesStream: () => Promise<ActionResult<unknown>>;
  stopMessagesStream: () => Promise<ActionResult<unknown>>;
  listenToMessagesStream: (
    handler: (m: Message) => void
  ) => Promise<{ status: 200 | 400 | 500 }>;
  subscribeToConversationsStreamStore: ({
    onChange,
  }: {
    onChange: (c: AsyncState<undefined>) => void;
  }) => void;
  getConversationsStream: () => Promise<AsyncState<undefined>>;
  startConversationsStream: () => Promise<ActionResult<unknown>>;
  stopConversationsStream: () => Promise<ActionResult<unknown>>;
  listenToConversationsStream: (
    handler: (c: Conversation) => void
  ) => Promise<ActionResult<unknown>>;
  subscribeToConversationStreamsStore: (
    conversation: Conversation,
    onChange: (c: AsyncState<undefined>) => void
  ) => void;
  getConversationStream: (
    conversation: Conversation
  ) => Promise<AsyncState<undefined>>;
  startConversationStream: ({
    conversation,
  }: {
    conversation: Conversation;
  }) => Promise<ActionResult<unknown>>;
  stopConversationStream: ({
    conversation,
  }: {
    conversation: Conversation;
  }) => Promise<ActionResult<unknown>>;
  listenToConversationStream: (
    conversation: Conversation,
    handler: (m: Message) => void
  ) => Promise<ActionResult<unknown>>;
  fetchConversations: () => Promise<ActionResult<Conversation[]>>;
  fetchMessages: (
    conversation: Conversation,
    opts: ListMessagesOptions
  ) => Promise<ActionResult<Message[]>>;
  fetchPeerOnNetwork: ({
    peerAddress,
  }: {
    peerAddress: string;
  }) => Promise<ActionResult<boolean>>;
  sendMessage: ({
    conversation,
    content,
  }: {
    conversation: Conversation;
    content: string;
  }) => Promise<ActionResult<Message>>;
};

export type Xmtp = {
  startClient: (
    wallet: Signer | null,
    opts?: Partial<ClientOptions>
  ) => Promise<Client>;
  stopClient: () => Promise<boolean>;
  fetchClient: ({ opts }: { opts?: FetchClientOpts }) => Promise<Client>;
  fetchMessages: ({
    conversation,
    opts,
  }: {
    conversation: Conversation;
    opts?: ListMessagesOptions;
  }) => Promise<Message[]>;
  fetchConversations: () => Promise<Conversation[]>;
  fetchPeerOnNetwork: ({
    peerAddress,
  }: {
    peerAddress: string;
  }) => Promise<boolean>;
  sendMessage: ({
    conversation,
    content,
  }: {
    conversation: Conversation;
    content: unknown;
  }) => Promise<Message>;
  startStreamingMessages: ({
    conversation,
  }: {
    conversation: Conversation;
  }) => Promise<boolean>;
  stopStreamingMessages: ({
    conversation,
  }: {
    conversation: Conversation;
  }) => Promise<void>;
  listenToStreamingMessages: (
    conversation: Conversation,
    handler: (m: Message) => unknown
  ) => Promise<string>;
  startStreamingConversations: () => Promise<boolean>;
  stopStreamingConversations: () => Promise<void>;
  listenToStreamingConversations: (
    handler: (c: Conversation) => unknown
  ) => Promise<string>;
  startStreamingAllMessages: () => Promise<boolean>;
  stopStreamingAllMessages: () => Promise<void>;
  listenToStreamingAllMessages: (
    handler: (m: Message) => unknown
  ) => Promise<string>;
  test: (fn: () => null) => Promise<null>;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Client
 *
 *
 *
 *
 *
 * *************************************************************************/

export type ClientExport = Uint8Array;

export type FetchClientOpts = {
  includeExport?: boolean;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Conversations
 *
 *
 *
 *
 *
 * *************************************************************************/

export const uniqueConversationKey = (conversation: Conversation) => {
  return `${conversation.peerAddress}-${conversation.context?.conversationId}`;
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Messages
 *
 *
 *
 *
 *
 * *************************************************************************/

export const getNextPageOptions = ({
  messages,
}: {
  messages?: Message[];
}): {
  limit: number;
  direction: "descending";
  endTime?: Date;
} => {
  if (messages === undefined) {
    return { limit: 25, direction: "descending" };
  } else if (messages.length === 0) {
    return { limit: 25, direction: "descending" };
  } else {
    return {
      limit: 25,
      direction: "descending",
      endTime: messages[messages.length - 1].sent,
    };
  }
};

export const insertMessagesIfNew = ({
  messages,
  newMessages,
}: {
  messages: Message[];
  newMessages: Message | Message[];
}) => {
  return ((messages: Message[], newMessages: Message[]) => {
    if (messages.length === 0 || newMessages.length === 0) {
      return [...messages, ...newMessages];
    } else {
      for (let i = 0; i < newMessages.length; i++) {
        for (let j = 0; j < messages.length; j++) {
          if (messages[j].id === newMessages[i].id) {
            break;
          }
          if (messages[j].sent < newMessages[i].sent) {
            messages.splice(j, 0, newMessages[i]);
            break;
          }
          if (j === messages.length - 1) {
            messages.push(newMessages[i]);
            break;
          }
        }
      }
    }
    return messages;
  })(
    [...(messages || [])],
    Array.isArray(newMessages) ? [...newMessages] : [newMessages]
  );
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Preview
 *
 *
 *
 *
 *
 * *************************************************************************/

export type Preview = z.infer<typeof zConversation> & {
  preview: Message;
};

export const uniquePreviewKey = (preview: Preview) => {
  return uniqueConversationKey(preview);
};

export const insertOrUpdatePreviews = (
  previews: Preview[],
  newPreviews: Preview | Preview[]
) => {
  return ((previews: Preview[], newPreviews: Preview[]) => {
    if (previews.length === 0) {
      return newPreviews;
    } else {
      for (let i = 0; i < newPreviews.length; i++) {
        for (let j = 0; j < previews.length; j++) {
          if (
            uniquePreviewKey(previews[j]) === uniquePreviewKey(newPreviews[i])
          ) {
            if (
              previews[j].preview.sent.getTime() <
              newPreviews[i].preview.sent.getTime()
            ) {
              previews[j] = newPreviews[i];
            }
            break;
          }
          if (j === previews.length - 1) {
            previews.push(newPreviews[i]);
            break;
          }
        }
      }
      return previews;
    }
  })(
    [...previews],
    Array.isArray(newPreviews) ? [...newPreviews] : [newPreviews]
  );
};

export const sortByMostRecentPreview = (previews: Preview[]) => {
  return [...previews].sort((a, b) => {
    return b.preview.sent.getTime() - a.preview.sent.getTime();
  });
};

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * Errors
 *
 *
 *
 *
 *
 * *************************************************************************/

export const ErrorCodes = {
  STREAM_ALREADY_EXISTS: "STREAM_EXISTS",
  STREAM_NOT_FOUND: "STREAM_NOT_FOUND",
  CLIENT_ALREADY_EXISTS: "CLIENT_EXISTS",
  CLIENT_NOT_FOUND: "CLIENT_NOT_FOUND",
  SIGNING_FAILED: "SIGNING_FAILED",
  BAD_ARGUMENTS: "BAD_ARGUMENTS",
} as const;

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * AsyncState
 *
 *
 *
 *
 *
 * *************************************************************************/

type AsyncInactive = {
  id: "inactive";
  data?: undefined;
  error?: undefined;
};

type AsyncIdle = {
  id: "idle";
  data?: undefined;
  error?: undefined;
};

type AsyncPending = {
  id: "pending";
  data?: undefined;
  error?: undefined;
};

type AsyncSuccess<T> = {
  id: "success";
  data: T;
  error?: undefined;
};

type AsyncFetching<T> = {
  id: "fetching";
  data: T;
  error?: undefined;
};

type AsyncError = {
  id: "error";
  error: unknown;
  data?: undefined;
};

export type AsyncState<T> =
  | AsyncInactive
  | AsyncIdle
  | AsyncPending
  | AsyncFetching<T>
  | AsyncSuccess<T>
  | AsyncError;

/* **************************************************************************
 *
 *
 *
 *
 *
 *
 * HELPERS
 *
 *
 *
 *
 *
 * *************************************************************************/

export const uid = () => {
  return `${Math.random()}${Math.random()}${Math.random()}${Math.random()}`;
};

export const cn = (names: Record<string, boolean>) => {
  return Object.entries(names)
    .filter(([, condition]) => condition)
    .map(([name]) => name)
    .join(" ");
};
