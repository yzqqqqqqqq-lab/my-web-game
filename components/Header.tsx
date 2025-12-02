"use client";

import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/useAuthStore";
import ThemeToggle from "@/components/ThemeToggle";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Squares2X2Icon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { userInfo, isAuthenticated, logout } = useAuthStore();
  const t = useTranslations();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="w-full px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Squares2X2Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {t("common.siteName")}
              </span>
            </Link>

            {/* Right Section: Theme + Auth */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated && userInfo ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <UserIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {userInfo.username}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t("common.logout")}</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="?modal=auth&tab=login"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{t("common.login")}</span>
                  </Link>
                  <Link
                    href="?modal=auth&tab=register"
                    className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 rounded-lg transition-colors text-sm"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{t("common.register")}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  </header>
  );
}
