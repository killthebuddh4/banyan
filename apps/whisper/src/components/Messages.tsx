"use client";

import { Message } from "./Message";
import { ReactNode } from "react";

export const Messages = (props: {
  clientStatus: string;
  instructions: ReactNode;
  messages: Array<{ id: string; text: string; isOutbound: boolean }>;
}) => {
  return (
    <div className="messages">
      <div className={`client`}>{props.clientStatus}</div>
      {props.instructions}

      {props.messages.map((message) => (
        <Message
          key={message.id}
          text={String(message.text)}
          outbound={message.isOutbound}
        />
      ))}
    </div>
  );
};
