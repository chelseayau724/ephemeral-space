import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "在场 - 一次性的社交空间",
  description: "用暗号和真诚，开启连接。一次性的社交空间，始于弱信号，终于真实相遇。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
