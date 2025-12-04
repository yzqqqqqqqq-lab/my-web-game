'use client';

import Image from 'next/image';
import { Game } from '@/types/game';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/outline';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const t = useTranslations();
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
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
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
            <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
              <PlayIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-900">{t('gameDetail.startGame')}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/games/${game.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {game.title}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {game.category.map((cat, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {renderStars(game.rating)}
            <span className="ml-1 text-sm text-gray-600">
              {game.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {game.playCount.toLocaleString()} {t('common.playCount')}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {game.description}
        </p>
      </div>
    </div>
  );
}

