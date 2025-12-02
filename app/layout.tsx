import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "游戏站 - 在线游戏平台",
  description: "专业的在线游戏平台，提供丰富的游戏体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
