import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { usePubSub } from "@killthebuddha/fig";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { useGroupMembers } from "@/hooks/useGroupMembers";

export const Input = () => {
  const { wallet } = useWallet();
  const [messageInput, setMessageInput] = useState("");
  const { publish } = usePubSub({ wallet });
  const groupAddress = useGroupAddressParam();
  const groupMembers = useGroupMembers();

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

        const recipients = [...groupMembers.members, groupAddress].filter(
          (address) => address !== wallet.address,
        );

        console.log("WHISPER :: Input.tsx :: sending to", recipients);

        try {
          await Promise.all(
            recipients.map((recipient) => {
              return publish({
                conversation: { peerAddress: recipient },
                content: messageInput,
              });
            }),
          );

          console.log(
            `WHISPER :: Input.tsx :: done sending to ${recipients.length} recipients`,
          );
        } catch (error) {
          console.error("WHISPER :: Input.tsx :: error while sending", error);
        }

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
