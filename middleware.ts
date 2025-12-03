import createMiddleware from "next-intl/middleware";
// import { locales, defaultLocale } from './i18n/routings';
import { routing } from "@/i18n/routing";

// 注意：middleware 默认就是 edge runtime，不需要显式声明
// 如果必须声明，应该使用 'experimental-edge'，但通常不需要
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
