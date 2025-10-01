import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUILL Studio",
  description: "AI-driven branding & ad studio",
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
