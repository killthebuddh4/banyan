import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Whisper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="root">
          <div className="header">
            <div>
              <em>whisper</em>, made with ❤️ by{" "}
              <a className="banyan" href="https://banyan.sh" target="_blank">
                Banyan
              </a>
            </div>
            <a
              className="banyan"
              href="https://github.com/killthebuddh4/banyan"
              target="_blank"
            >
              GitHub
            </a>
          </div>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
