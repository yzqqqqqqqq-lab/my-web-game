'use client';

import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/useAuthStore';
import ThemeToggle from '@/components/ThemeToggle';
import LocaleToggle from '@/components/LocaleToggle';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import {
  HomeIcon,
  Squares2X2Icon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { userInfo, isAuthenticated, logout } = useAuthStore();
  const t = useTranslations();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Squares2X2Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('common.siteName')}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>{t('common.home')}</span>
            </Link>
            <Link
              href="/games"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/games')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Squares2X2Icon className="w-5 h-5" />
              <span>{t('common.games')}</span>
            </Link>
          </nav>

          {/* Right Section: Theme + Locale + Auth */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LocaleToggle />
            {isAuthenticated && userInfo ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">{userInfo.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('common.logout')}</span>
                </button>
              </>
            ) : (
              <Link
                href="?modal=auth&tab=login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t('common.loginOrRegister')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

