"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "@/types/game";
import { Link } from "@/i18n/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// 导入 Swiper 样式
import "swiper/css";
import "swiper/css/navigation";

interface GameCarouselProps {
  games: Game[];
  title: string;
  icon?: React.ReactNode;
}

export default function GameCarousel({
  games,
  title,
  icon,
}: GameCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 在客户端挂载后设置 isMounted
  // 这是处理 SSR hydration 的标准模式
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 在窗口大小变化时更新Swiper尺寸
  useEffect(() => {
    if (!isMounted) return;
    
    const handleResize = () => {
      if (swiperRef.current) {
        try {
          const swiper = swiperRef.current;
          if (swiper.el && swiper.wrapperEl) {
            swiper.updateSize();
            swiper.updateSlides();
            swiper.update();
          }
        } catch (error) {
          console.warn('Swiper resize update error:', error);
        }
      }
    };

    // 使用防抖来避免频繁更新
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [isMounted]);

  return (
    <div className="mb-12 w-full">
      {/* 标题和导航按钮 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isBeginning
                ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 shadow-md hover:shadow-lg cursor-pointer"
            }`}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isEnd
                ? "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 shadow-md hover:shadow-lg cursor-pointer"
            }`}
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Swiper 轮播容器 */}
      <div className="overflow-hidden -mx-4 px-4 md:mx-0 md:px-0" suppressHydrationWarning>
        {isMounted ? (
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onInit={(swiper) => {
              // 初始化完成后安全地更新尺寸
              requestAnimationFrame(() => {
                try {
                  if (swiper && swiper.el && swiper.wrapperEl) {
                    swiper.updateSize();
                    swiper.updateSlides();
                    swiper.update();
                  }
                } catch (error) {
                  console.warn('Swiper update error:', error);
                }
              });
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            modules={[Navigation]}
            spaceBetween={12}
            slidesPerView={3}
            slidesPerGroup={3}
            breakpoints={{
              640: {
                spaceBetween: 14,
              },
              768: {
                spaceBetween: 16,
                slidesPerView: 8,
                slidesPerGroup: 2,
              },
            }}
            speed={500}
            allowTouchMove={true}
            touchEventsTarget="container"
            resistance={true}
            resistanceRatio={0.85}
            watchOverflow={true}
            observer={false}
            observeParents={false}
          >
        {games.map((game) => (
          <SwiperSlide key={game.id} className="h-auto!">
            <Link
              href={`/games/${game.id}`}
              className="group relative block rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 w-full"
            >
              <div className="relative w-full max-w-full game-carousel-image">
                <Image
                  src={game.cover}
                  alt={game.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300 rounded-xl"
                  sizes="(max-width: 640px) calc(33.33vw - 16px), (max-width: 768px) calc(33.33vw - 18px), 12.5vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                    {game.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1">
                    {game.category[0]}
                  </p>
                  <div className="mt-1 text-xs text-white/70">
                    {game.playCount.toLocaleString()} 在玩
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
          </Swiper>
        ) : (
          <div className="flex gap-4">
            {games.slice(0, 8).map((game) => (
              <div key={game.id} className="shrink-0 w-[calc((100%-112px)/8)]">
                <div className="relative w-full game-carousel-image bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
