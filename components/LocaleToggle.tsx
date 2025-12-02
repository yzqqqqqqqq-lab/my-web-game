'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { locales } from '@/i18n/routing';

export default function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    // 使用 next-intl 的 router 切换语言
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'}
      title={locale === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <GlobeAltIcon className="w-5 h-5" />
      <span className="text-sm font-medium">{locale.toUpperCase()}</span>
    </button>
  );
}

