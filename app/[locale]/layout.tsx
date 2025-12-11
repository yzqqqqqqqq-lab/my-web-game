import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "./globals.css";
import SidebarLayout from "@/components/sidebar/SidebarLayout";
import { locales } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
// import { Providers } from "./providers";
import AuthModalWrapper from "@/components/AuthModalWrapper";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import HeaderWrapper from "@/components/header/HeaderWrapper";
import FooterWrapper from "@/components/footer/FooterWrapper";
import SiteLoader from "@/components/SiteLoader";
import MobileFooterWrapper from "@/components/MobileFooterWrapper";
import MobileSidebarWrapper from "@/components/sidebar/MobileSidebarWrapper";

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
      <body className="antialiased">
        <SiteLoader />
        {/* <Providers> */}
          <NextIntlClientProvider locale={locale} messages={messages}>
            {/* 移动端固定视口容器 */}
            <div id="mobile-viewport" className="md:contents">
              {/* HeaderWrapper 移入 SidebarLayout 内部，以实现 PC 端侧边栏全高布局 */}
              <div id="mobile-scroll-content" className="md:contents">
                <div className="flex min-h-screen md:min-h-0">
                  <SidebarWrapper />
                  <SidebarLayout>
                    <HeaderWrapper />
                    <main className="flex-1">{children}</main>
                    <FooterWrapper />
                  </SidebarLayout>
                </div>
              </div>
              <MobileFooterWrapper />
            </div>
            {/* 移动端 Drawer 侧边栏 */}
            <MobileSidebarWrapper />
            <AuthModalWrapper />
          </NextIntlClientProvider>
        {/* </Providers> */}
      </body>
    </html>
  );
}
