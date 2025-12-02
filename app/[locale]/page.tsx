'use client';

import { mockGames } from '@/data/mockGames';
import GameCard from '@/components/GameCard';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Squares2X2Icon, StarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const t = useTranslations();
  // 获取热门游戏（按评分和播放量排序，取前6个）
  const hotGames = [...mockGames]
    .sort((a, b) => {
      const scoreA = a.rating * 0.6 + (a.playCount / 10000) * 0.4;
      const scoreB = b.rating * 0.6 + (b.playCount / 10000) * 0.4;
      return scoreB - scoreA;
    })
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Squares2X2Icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
              {t('home.title')}
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {t('home.browseAllGames')}
            </Link>
            <Link
              href="?modal=auth&tab=login"
              className="px-8 py-4 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors shadow-lg border border-gray-200 dark:border-zinc-700"
            >
              {t('common.loginOrRegister')}
            </Link>
          </div>
        </div>

        {/* Hot Games Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <StarIcon className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t('home.hotGames')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t('home.gameCategories')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(() => {
              // 获取所有唯一的分类，按游戏数量排序，取前4个
              const categoryCounts = new Map<string, number>();
              mockGames.forEach((game) => {
                game.category.forEach((cat) => {
                  categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
                });
              });
              return Array.from(categoryCounts.entries())
                .sort((a, b) => b[1] - a[1]) // 按游戏数量降序排序
                .slice(0, 4) // 只取前4个
                .map(([category]) => category);
            })().map((category) => (
              <Link
                key={category}
                href={`/games?category=${encodeURIComponent(category)}`}
                className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500"
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {category}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {mockGames.filter((g) => g.category.includes(category)).length} {t('common.gamesCount')}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {mockGames.length}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {t('common.gamesCount')}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                {mockGames.reduce((sum, g) => sum + g.playCount, 0).toLocaleString()}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {t('common.totalPlayCount')}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {(mockGames.reduce((sum, g) => sum + g.rating, 0) / mockGames.length).toFixed(1)}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {t('common.averageRating')}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
