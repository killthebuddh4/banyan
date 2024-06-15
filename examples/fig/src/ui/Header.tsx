import { ReactNode } from "react";
export const Header = (props: { children?: ReactNode }) => {
  return (
    <div className="fixed left-0 top-0 w-full flex justify-between p-2">
      <h1>
        made with <span className="text-xs">❤️</span> by{" "}
        <a href="https://banyan.sh">Banyan</a>
      </h1>
      <a
        href="https://github.com/killthebuddh4/banyan"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </div>
  );
};
