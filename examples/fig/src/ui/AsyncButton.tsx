import { cn } from "@/lib/lib";

export const AsyncButton = ({
  inactiveText,
  idleText,
  pendingText,
  successText,
  errorText,
  onClickIdle,
  status,
  className,
}: {
  inactiveText: string;
  idleText: string;
  pendingText: string;
  successText: string;
  errorText: string;
  onClickIdle: () => void;
  status: "inactive" | "idle" | "pending" | "success" | "fetching" | "error";
  className?: string;
}) => {
  return (
    <button
      className={cn({
        "font-bold py-2 px-4 mb-4 text-white rounded": true,
        "bg-gray-400": status === "inactive",
        "bg-blue-500 hover:bg-blue-600 cursor-pointer": status === "idle",
        "bg-blue-400 cursor-progress": status === "pending",
        "bg-green-400": status === "success",
        "bg-red-400": status === "error",
        [className || ""]: true,
      })}
      onClick={() => {
        if (status !== "idle") {
          return undefined;
        } else {
          onClickIdle();
        }
      }}
      disabled={status !== "idle"}
    >
      {(() => {
        if (status === "error") return errorText;
        if (status === "success") return successText;
        if (status === "pending") return pendingText;
        if (status === "inactive") return inactiveText;
        return idleText;
      })()}
    </button>
  );
};
