import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { Input } from "@/components/Input";

export const Create = () => {
  const { create } = useWallet();
  const router = useRouter();

  return (
    <div className="app">
      <div className="create">
        <div className="createInner">
          <p className="createInstructions">
            Click below to create an <b>ephemeral</b>, <b>private</b>,{" "}
            <b>end-to-end encrypted</b> groupchat.
          </p>
          <div className="createActions">
            <a className="learnMore" href="/">
              Learn More
            </a>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                router.push(`/g/${create().address}`);
              }}
            >
              <button type="submit">Create</button>
            </form>
          </div>
        </div>
      </div>
      <Input />
    </div>
  );
};
