import { useState } from "react";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useWallet } from "@/hooks/useWallet";

export const Input = () => {
  const wallet = useWallet();
  // const { send } = useMessages({ wallet });
  const members = useGroupMembers();
  const [messageInput, setMessageInput] = useState("");

  return (
    <form
      className="input"
      onSubmit={async (e) => {
        e.preventDefault();

        if (messageInput === "") {
          return;
        }

        // if (send === null) {
        //   return;
        // }

        // setMessageInput("");

        // console.log(`Input :: Sending message to ${members.length} members`);

        // await Promise.all(
        //   members
        //     .filter((member) => member !== wallet.address)
        //     .map((member) => {
        //       return send({
        //         conversation: { peerAddress: member },
        //         content: messageInput,
        //       });
        //     }),
        // );

        // console.log(`Input :: Message sent to ${members.length} members`);
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
