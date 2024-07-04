import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { ownerStore } from "@/lib/ownerStore";

export const OwnerInput = () => {
  const { wallet } = useWallet();
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  return (
    <form
      className="input"
      onSubmit={async (e) => {
        e.preventDefault();

        if (messageInput === "") {
          return;
        }

        if (wallet === undefined) {
          return;
        }

        setIsSending(true);

        try {
          ownerStore.setState((state) => {
            return {
              messages: [
                ...state.messages,
                {
                  id: crypto.randomUUID(),
                  text: messageInput,
                  timestamp: Date.now(),
                  sender: wallet.address,
                },
              ],
            };
          });
        } catch (error) {
          console.error("WHISPER :: Input.tsx :: error while sending", error);
        } finally {
          setIsSending(false);
        }

        setMessageInput("");
      }}
    >
      <input
        type="text"
        placeholder="Type a message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button type="submit">{isSending ? "Sending..." : "Send"}</button>
    </form>
  );
};
