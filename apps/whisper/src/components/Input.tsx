import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { usePubSub } from "@killthebuddha/fig";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";

export const Input = () => {
  const { wallet } = useWallet();
  const [messageInput, setMessageInput] = useState("");
  const { publish } = usePubSub({ wallet });
  const groupAddress = useGroupAddressParam();

  return (
    <form
      className="input"
      onSubmit={async (e) => {
        e.preventDefault();

        if (messageInput === "") {
          return;
        }

        if (publish === null) {
          return;
        }

        if (wallet === undefined) {
          return;
        }

        if (groupAddress === wallet.address) {
          return;
        }

        await publish({
          conversation: { peerAddress: groupAddress },
          content: messageInput,
        });

        setMessageInput("");
      }}
    >
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};
