"use client";

import { Message } from "./Message";
import {
  // useMessages,
  Message as MessageType,
  // useClient,
} from "@killthebuddha/fig";
import { useWallet } from "@/hooks/useWallet";
import { OwnerInstructions } from "./OwnerInstructions";
import { InvitedInstructions } from "./InvitedInstructions";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { useCallback, useMemo } from "react";

// export const Messages = () => {
//   const { wallet } = useWallet();
//   const client = useClient({ wallet, opts: { autoStart: true } });

//   const groupAddress = useGroupAddressParam();

//   const filterBrpcMessages = useCallback((message: MessageType) => {
//     const prefix = "banyan.sh/brpc";

//     if (message.conversation.context === undefined) {
//       return true;
//     }

//     return !message.conversation.context.conversationId.startsWith(prefix);
//   }, []);

//   const { messages } = useMessages({
//     wallet,
//     opts: { filter: filterBrpcMessages },
//   });

//   const clientStatus = useMemo(() => {
//     if (client === null) {
//       return "XMTP is not available";
//     }

//     if (client.client === null) {
//       return "XMTP is not available";
//     }

//     if (client.client.code === "pending") {
//       return "Connecting to XMTP...";
//     }

//     if (client.client.code === "error") {
//       return "XMTP connection error";
//     }

//     if (client.client.code === "success") {
//       return "Connected to XMTP";
//     }

//     // TODO
//     return "";
//   }, [client]);

//   const clientStatusClass = useMemo(() => {
//     if (client === null) {
//       return "client-status-idle";
//     }

//     if (client.client === null) {
//       return "client-status-idle";
//     }

//     if (client.client.code === "pending") {
//       return "client-status-pending";
//     }

//     if (client.client.code === "error") {
//       return "client-status-error";
//     }

//     if (client.client.code === "success") {
//       return "client-status-success";
//     }

//     // TODO
//     return "";
//   }, [client]);

//   return (
//     <div className="messages">
//       <div className={`client ${clientStatusClass}`}>{clientStatus}</div>
//       {(() => {
//         if (wallet === undefined) {
//           return null;
//         }

//         if (groupAddress === null) {
//           return null;
//         }

//         if (wallet.address === groupAddress) {
//           return <OwnerInstructions />;
//         } else {
//           return <InvitedInstructions />;
//         }
//       })()}

//       {(() => {
//         if (wallet === undefined) {
//           return null;
//         }

//         return messages.map((message, i) => (
//           <Message
//             key={i}
//             text={String(message.content)}
//             outbound={message.senderAddress === wallet.address}
//           />
//         ));
//       })()}
//     </div>
//   );
// };
