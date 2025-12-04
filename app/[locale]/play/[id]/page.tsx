'use client';

export const runtime = 'edge';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { mockGames } from '@/data/mockGames';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from '@/i18n/navigation';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface PlayPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations();
  
  const [countdown, setCountdown] = useState<number | null>(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const game = mockGames.find((g) => g.id === resolvedParams.id);

  // 权限检查
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/play/${resolvedParams.id}?modal=auth&tab=login`);
    }
  }, [isAuthenticated, router, resolvedParams.id]);

  // 倒计时
  useEffect(() => {
    if (!isAuthenticated || !game) return;

    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const timer = setTimeout(() => {
        setCountdown(null);
        setGameStarted(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isAuthenticated, game]);

  if (!isAuthenticated) {
    return null; // 等待重定向
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('play.gameNotFound')}
          </h1>
          <button
            onClick={() => router.push('/games')}
            className="text-blue-600 hover:underline"
          >
            {t('play.backToGames')}
          </button>
        </div>
      </div>
    );
  }

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    // 模拟旋转动画
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * 101);
      setScore(newScore);
      setIsSpinning(false);
    }, 1500);
  };

  const handleReset = () => {
    setScore(0);
    setIsSpinning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>{t('common.back')}</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {game.title}
            </h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="text-center">
                {countdown > 0 ? (
                  <div className="text-9xl font-bold text-white animate-pulse">
                    {countdown}
                  </div>
                ) : (
                  <div className="text-6xl font-bold text-white animate-bounce">
                    {t('play.gameStart')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Game Container */}
          {gameStarted && (
            <div className="relative">
              {/* Game Background */}
              <div className="relative h-[600px] bg-gradient-to-br from-blue-500 to-purple-600">
                <Image
                  src={game.cover}
                  alt={game.title}
                  fill
                  className="object-cover opacity-30"
                  sizes="100vw"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-8">
                    {/* Score Display */}
                    <div className="bg-white/90 rounded-2xl p-8 shadow-2xl">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('play.currentScore')}
                      </h2>
                      <div className="text-7xl font-bold text-blue-600 mb-6">
                        {score}
                      </div>
                      
                      {/* Spin Button */}
                      <button
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all transform ${
                          isSpinning
                            ? 'bg-gray-400 '
                            : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                        } text-white shadow-lg`}
                      >
                        {isSpinning ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('play.spinning')}
                          </span>
                        ) : (
                          `🎰 ${t('play.spin')}`
                        )}
                      </button>

                      {/* Reset Button */}
                      {score > 0 && (
                        <button
                          onClick={handleReset}
                          className="mt-4 flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors mx-auto"
                        >
                          <ArrowPathIcon className="w-5 h-5" />
                          <span>{t('play.resetScore')}</span>
                        </button>
                      )}
                    </div>

                    {/* Game Instructions */}
                    <div className="bg-white/80 rounded-xl p-6 max-w-md mx-auto">
                      <p 
                        className="text-gray-700 text-lg"
                        dangerouslySetInnerHTML={{ __html: t('play.instruction') }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

