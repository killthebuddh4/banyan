import { cn } from "@/lib/lib";

export const SyncButton = ({
  inactiveText,
  activeText,
  errorText,
  onClick,
  className,
  status,
}: {
  inactiveText: string;
  activeText: string;
  errorText: string;
  onClick: () => void;
  className?: string;
  status: "inactive" | "active" | "error";
}) => {
  return (
    <button
      className={cn({
        "font-bold py-2 px-4 mb-4 text-white rounded": true,
        "bg-gray-400": status === "inactive",
        "bg-blue-500 hover:bg-blue-600 cursor-pointer": status === "active",
        "bg-red-400": status === "error",
        [className || ""]: true,
      })}
      onClick={() => {
        if (status === "inactive") {
          return;
        }

        onClick();
      }}
      disabled={status === "inactive"}
    >
      {(() => {
        if (status === "error") return errorText;
        if (status === "active") return activeText;
        return inactiveText;
      })()}
    </button>
  );
};
