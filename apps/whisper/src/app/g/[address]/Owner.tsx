import { App } from "@/components/App";
import { Messages } from "@/components/Messages";
import { useGroupOwner } from "@/hooks/useGroupOwner";

export const Owner = () => {
  useGroupOwner();

  return (
    <App>
      <Messages />
    </App>
  );
};
