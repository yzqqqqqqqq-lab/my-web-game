import { defineRouting } from "next-intl/routing";

export const locales = ["zh", "en"] as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always", // 改为 always 以确保 Cloudflare Pages 正确处理所有路由
});
