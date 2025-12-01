'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { mockGames } from '@/data/mockGames';
import { useAuthStore } from '@/stores/useAuthStore';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { PlayIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  const game = mockGames.find((g) => g.id === resolvedParams.id);

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            游戏未找到
          </h1>
          <Link
            href="/games"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            返回游戏列表
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="w-6 h-6 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="w-6 h-6 text-gray-300" />
        );
      }
    }
    return stars;
  };

  const handlePlay = () => {
    if (!isAuthenticated) {
      router.push(`/auth?type=login&redirect=${encodeURIComponent(game.demoUrl)}`);
    } else {
      router.push(game.demoUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>返回</span>
        </button>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-96">
            <Image
              src={game.cover}
              alt={game.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {game.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(game.rating)}
                  <span className="text-white text-lg font-semibold">
                    {game.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-white/80">
                  {game.playCount.toLocaleString()} 次游玩
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {game.category.map((cat, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                游戏简介
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {game.detailedDescription || game.description}
              </p>
            </div>

            {/* Play Button */}
            <div className="flex gap-4">
              <button
                onClick={handlePlay}
                className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <PlayIcon className="w-6 h-6" />
                <span className="text-lg">开始游戏</span>
              </button>
              {!isAuthenticated && (
                <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  （需要登录后试玩）
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

