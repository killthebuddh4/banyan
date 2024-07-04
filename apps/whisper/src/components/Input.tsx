import { useMemo, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useBrpc } from "@killthebuddha/fig";
import { useGroupAddressParam } from "@/hooks/useGroupAddressParam";
import { post } from "@/lib/post";

export const Input = () => {
  const { wallet } = useWallet();
  const brpc = useBrpc({ wallet });
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const groupAddress = useGroupAddressParam();

  const client = useMemo(() => {
    if (brpc.client === null) {
      return null;
    }

    return brpc.client({
      api: { post },
      topic: {
        peerAddress: groupAddress,
        context: {
          conversationId: "banyan.sh/whisper",
          metadata: {},
        },
      },
      // options: {
      //   onReceivedInvalidResponse: ({ message }) => {
      //     console.error(
      //       "WHISPER :: Input.tsx :: received invalid response",
      //       message,
      //     );
      //   },
      // },
    });
  }, [brpc.client, groupAddress]);

  return (
    <form
      className="input"
      onSubmit={async (e) => {
        e.preventDefault();

        if (messageInput === "") {
          return;
        }

        if (client === null) {
          return;
        }

        console.log("WHISPER :: Input.tsx :: posting message");

        setIsSending(true);

        try {
          const result = await client.post({ text: messageInput });

          console.log("WHISPER :: Input.tsx :: posted message", result);

          console.log(`WHISPER :: Input.tsx :: done posting message`);
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
