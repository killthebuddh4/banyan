import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "brpc-hooks exampls",
  description: "Showcase how to use bprc hooks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
