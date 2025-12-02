'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { mockGames } from '@/data/mockGames';
import GameCard from '@/components/GameCard';
import { useRouter } from '@/i18n/navigation';
import { Squares2X2Icon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function GamesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // 获取所有唯一的分类
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    mockGames.forEach((game) => {
      game.category.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, []);

  // 筛选游戏
  const filteredGames = useMemo(() => {
    let games = [...mockGames];

    // 按分类筛选
    if (selectedCategory) {
      games = games.filter((game) => game.category.includes(selectedCategory));
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      games = games.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.category.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    return games;
  }, [selectedCategory, searchQuery]);

  // 更新URL参数
  const updateFilters = (category: string, search: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search.trim()) params.set('search', search.trim());
    const queryString = params.toString();
    router.push(`/games${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    updateFilters(newCategory, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters(selectedCategory, value);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    router.push('/games', { scroll: false });
  };

  const hasActiveFilters = selectedCategory || searchQuery.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Squares2X2Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t('games.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('games.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t('games.searchPlaceholder')}
              className="w-full pl-12 pr-12 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('games.categories')}
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                {t('common.clearFilters')}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {allCategories.map((category) => {
              const isActive = selectedCategory === category;
              const count = mockGames.filter((g) => g.category.includes(category)).length;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {category}
                  <span className={`ml-2 ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('common.currentFilter')}</span>
            {selectedCategory && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                {t('common.category')}: {selectedCategory}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                {t('common.search')}: {searchQuery}
              </span>
            )}
          </div>
        )}

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {t('games.foundGames', { count: filteredGames.length })}
                {hasActiveFilters && (
                  <span className="ml-2 text-sm">
                    （{t('home.totalGames', { count: mockGames.length })}）
                  </span>
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('games.noGamesFound')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('games.noGamesDescription')}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {t('common.clearAllFilters')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

