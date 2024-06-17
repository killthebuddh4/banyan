import { ReactNode } from "react";

export const Main = (props: { children: ReactNode }) => {
  return (
    <main className="flex flex-col w-screen ml-auto mr-auto">
      {props.children}
    </main>
  );
};
