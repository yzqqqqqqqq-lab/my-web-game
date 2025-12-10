import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import SidebarLayout from "@/components/SidebarLayout";
import { locales } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
// import { Providers } from "./providers";
import AuthModalWrapper from "@/components/AuthModalWrapper";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "游戏站 - 在线游戏平台",
  description: "专业的在线游戏平台，提供丰富的游戏体验",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 在 Next.js 15+ 中，params 是 Promise，在 async 函数中直接 await
  const resolvedParams = await params;
  const locale = resolvedParams.locale as (typeof locales)[number];

  // 验证 locale 是否有效
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // 获取消息
  const messages = await getMessages();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body className="antialiased flex flex-col min-h-screen">
        {/* <Providers> */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex min-h-screen">
              <Sidebar />
              <SidebarLayout>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </SidebarLayout>
            </div>
            <AuthModalWrapper />
          </NextIntlClientProvider>
        {/* </Providers> */}
      </body>
    </html>
  );
}
