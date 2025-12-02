import createMiddleware from "next-intl/middleware";
// import { locales, defaultLocale } from './i18n/routings';
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)˝
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 静态资源文件
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|.*\\.svg).*)",
  ],
};
