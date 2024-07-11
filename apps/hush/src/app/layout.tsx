import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "hush",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="root">
        <header className="appHeader">
          <div />
          <a href="https://github.com">Learn More</a>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
