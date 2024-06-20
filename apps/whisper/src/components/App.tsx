import { ReactNode } from "react";

export const App = (props: { children: ReactNode }) => {
  return <div className="app">{props.children}</div>;
};
