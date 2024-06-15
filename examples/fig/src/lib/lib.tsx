import { ReactNode } from "react";

export const cn = (names: Record<string, boolean>) => {
  return Object.entries(names)
    .filter(([, condition]) => condition)
    .map(([name]) => name)
    .join(" ");
};

export const Section = ({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) => {
  return (
    <div id={id} className="flex flex-col mb-8">
      {children}
    </div>
  );
};

export const SectionHeader = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <h1 className={`text-2xl font-bold ${className}`}>{children}</h1>;
};

export const SectionLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`text-blue-500 mb-4 hover:underline ${className}`}
    >
      {children}
    </a>
  );
};

export const SectionRef = ({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className={`text-blue-500 mb-4 hover:underline ${className}`}
    >
      {children}
    </a>
  );
};

export const SectionDescription = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <p className={`text-lg mb-2 ${className}`}>{children}</p>;
};

export const SubSectionHeader = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-xl font-bold mb-4">{children}</h2>;
};

export const StepHeader = ({ children }: { children: ReactNode }) => {
  return <h3 className="text-lg font-bold mb-2">{children}</h3>;
};

export const Instruction = ({ children }: { children: ReactNode }) => {
  return <p>{children}</p>;
};

export const PrimaryTextInput = ({
  placeholder,
  onChange,
  value,
  isError,
  className,
}: {
  placeholder: string;
  onChange: (v: string | null) => void;
  value: string | null;
  isError?: boolean;
  className?: string;
}) => {
  return (
    <input
      className={cn({
        "w-80 rounded-md p-2": true,
        "bg-gray-100": !isError,
        "bg-red-100": !!isError,
        [className || ""]: true,
      })}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      value={value || ""}
    />
  );
};

export const status = ({
  isInactive,
  isIdle,
  isPending,
  isSuccess,
  isError,
}: {
  isInactive?: boolean;
  isIdle?: boolean;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}) => {
  if (isInactive) return "inactive";
  if (isIdle) return "idle";
  if (isPending) return "pending";
  if (isSuccess) return "success";
  if (isError) return "error";
  return "inactive";
};

export const StatusIndicator = ({
  status,
  className,
}: {
  status: "inactive" | "idle" | "pending" | "success" | "error";
  className?: string;
}) => {
  return (
    <div
      className={cn({
        "w-full rounded-md p-2 mb-6 min-h-8 flex justify-center items-center":
          true,
        "bg-gray-400": status === "inactive",
        "bg-blue-500": status === "idle",
        "bg-orange-400": status === "pending",
        "bg-green-400": status === "success",
        "bg-red-400": status === "error",
        [className || ""]: true,
      })}
    />
  );
};

export const useSigner = () => {};
