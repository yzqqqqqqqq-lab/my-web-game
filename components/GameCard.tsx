'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/types/game';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/outline';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="w-4 h-4 text-yellow-400 opacity-50" />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-zinc-800">
      <Link href={`/games/${game.id}`}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={game.cover}
            alt={game.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 px-2 py-1 rounded-full">
              <PlayIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-900 dark:text-white">试玩</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/games/${game.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {game.title}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {game.category.map((cat, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {renderStars(game.rating)}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              {game.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-500">
            {game.playCount.toLocaleString()} 次游玩
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {game.description}
        </p>
      </div>
    </div>
  );
}

