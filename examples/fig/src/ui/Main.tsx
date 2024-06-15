import { ReactNode } from "react";

export const Main = (props: { children: ReactNode }) => {
  return <main className="flex flex-col w-[100vw]">{props.children}</main>;
};
