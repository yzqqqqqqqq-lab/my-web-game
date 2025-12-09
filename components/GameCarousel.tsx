"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Game } from "@/types/game";
import { Promotion } from "@/types/promotion";
import { Link } from "@/i18n/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// 导入 Swiper 样式
import "swiper/css";
import "swiper/css/navigation";
import { SpecialIcon } from "@/lib/icons";

type CarouselType = "game" | "event" | "promotion";

interface GameCarouselProps {
  games?: Game[];
  promotions?: Promotion[];
  title: string;
  icon?: React.ReactNode;
  type?: CarouselType; // 'game' 显示在玩和分享按钮，'event' 不显示，'promotion' 显示促销卡片
}

export default function GameCarousel({
  games,
  promotions,
  title,
  icon,
  type = "game",
}: GameCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  // 使用惰性初始化来避免在 useEffect 中同步调用 setState
  // 在客户端直接返回 true，服务端返回 false
  const [isMounted] = useState(() => typeof window !== "undefined");

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
          console.warn("Swiper resize update error:", error);
        }
      }
    };

    // 使用防抖来避免频繁更新
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [isMounted]);

  return (
    <div className="mb-6 w-full">
      {/* 标题和导航按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl md:text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="flex items-center">
          <div className="flex rounded-[32px] border border-grey-400 overflow-hidden bg-grey-600">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
              className={`flex items-center justify-center w-14 h-10 transition-all ${
                isBeginning
                  ? "opacity-50 "
                  : "hover:bg-gray-500/20 cursor-pointer active:bg-gray-500/30"
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5 text-grey-200" />
            </button>
            <div className="w-px bg-grey-400" />
            <button
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
              className={`flex items-center justify-center w-14 h-10 transition-all ${
                isEnd
                  ? "opacity-50 "
                  : "hover:bg-gray-500/20 cursor-pointer active:bg-gray-500/30"
              }`}
            >
              <ChevronRightIcon className="w-5 h-5 text-grey-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper 轮播容器 */}
      <div
        className="overflow-hidden -mx-4 px-4 md:mx-0 md:px-0"
        suppressHydrationWarning
      >
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
                  console.warn("Swiper update error:", error);
                }
              });
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            modules={[Navigation]}
            spaceBetween={type === "promotion" ? 2 : 8}
            slidesPerView={type === "promotion" ? 1 : 3}
            slidesPerGroup={type === "promotion" ? 1 : 3}
            breakpoints={
              type === "promotion"
                ? {
                    // 促销活动卡片：<728px放1张，728px-1050px放2张，>=1050px放3张，翻页时翻整页
                    728: {
                      spaceBetween: 8,
                      slidesPerView: 2,
                      slidesPerGroup: 2,
                    },
                    1200: {
                      spaceBetween: 8,
                      slidesPerView: 3,
                      slidesPerGroup: 3,
                    },
                  }
                : {
                    // 游戏和赛事卡片
                    390: {
                      spaceBetween: 4,
                      slidesPerView: 3,
                      slidesPerGroup: 2,
                    },
                    515: {
                      spaceBetween: 2,
                      slidesPerView: 4,
                      slidesPerGroup: 2,
                    },
                    640: {
                      spaceBetween: 8,
                      slidesPerView: 4,
                      slidesPerGroup: 2,
                    },
                    768: {
                      spaceBetween: 8,
                      slidesPerView: 5,
                      slidesPerGroup: 2,
                    },
                    910: {
                      spaceBetween: 8,
                      slidesPerView: 6,
                      slidesPerGroup: 2,
                    },
                    1060: {
                      spaceBetween: 8,
                      slidesPerView: 7,
                      slidesPerGroup: 2,
                    },
                    1200: {
                      spaceBetween: 8,
                      slidesPerView: 8,
                      slidesPerGroup: 2,
                    },
                  }
            }
            speed={500}
            allowTouchMove={true}
            touchEventsTarget="container"
            resistance={true}
            resistanceRatio={0.85}
            watchOverflow={true}
            observer={false}
            observeParents={false}
          >
            {type === "promotion"
              ? promotions?.map((promotion) => (
                  <SwiperSlide key={promotion.id} className="h-auto pt-4">
                    <div className="group relative w-full px-1 h-[170px]">
                      <Link href={promotion.href} className="block h-full">
                        <div className="flex bg-grey-500 rounded-xl overflow-hidden h-full group-hover:opacity-90 transition-opacity duration-300">
                          {/* 左侧内容区域 */}
                          <div className="flex-1 p-4 flex flex-col gap-0.5">
                            <div>
                              {/* 徽章 */}
                              {promotion.badge && (
                                <div className="mb-3">
                                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                                    {promotion.badge}
                                  </span>
                                </div>
                              )}
                              {/* 标题 */}
                              <h3 className="text-xl font-bold text-white  line-clamp-2">
                                {promotion.title}
                              </h3>
                              {/* 描述 */}
                              <p className="text-sm  text-white/80 line-clamp-2 ">
                                {promotion.description}
                              </p>
                            </div>
                            {/* 阅读更多 */}
                            <span className="text-sm font-semibold text-white">
                              阅读更多
                            </span>
                          </div>
                          {/* 右侧图片区域 */}
                          <div className="relative w-48 md:h-auto shrink-0">
                            <Image
                              src={promotion.cover}
                              alt={promotion.title}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 192px"
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))
              : games?.map((game) => (
                  <SwiperSlide key={game.id} className="h-auto pt-4">
                    <div className="group relative w-full px-1">
                      <Link href={game.demoUrl} className="block w-full">
                        {/* 图片容器 */}
                        <div className="relative w-full game-carousel-image rounded-xl overflow-hidden mb-2 group-hover:-translate-y-2.5 transition-transform duration-300">
                          <Image
                            src={game.cover}
                            alt={game.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) calc((100vw - 32px) / 3), (max-width: 768px) calc((100vw - 48px) / 5), (max-width: 910px) calc((100vw - 64px) / 6), (max-width: 1060px) calc((100vw - 80px) / 7), calc((100vw - 96px) / 8)"
                          />
                          {/* S标记（特殊游戏） */}
                          {type === "game" && game.isSpecial && (
                            <div className="absolute top-1 left-1 z-10">
                              <Tooltip
                                content="stake"
                                classNames={{
                                  base: [
                                    // arrow color
                                    "bg-white rounded-md",
                                  ],
                                  content: ["px-4 py-2 text-grey-800 "],
                                }}
                                showArrow
                                delay={200}
                              >
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-grey-800 text-white ">
                                  <SpecialIcon />
                                </div>
                              </Tooltip>
                            </div>
                          )}
                          {/* 悬停时显示的分享按钮（仅游戏类型） */}
                          {type === "game" && (
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // 分享功能
                                  if (navigator.share) {
                                    navigator.share({
                                      title: game.title,
                                      text: game.description,
                                      url:
                                        window.location.origin +
                                        game.demoUrl,
                                    });
                                  } else {
                                    // 降级方案：复制链接
                                    navigator.clipboard.writeText(
                                      window.location.origin +
                                        game.demoUrl
                                    );
                                  }
                                }}
                                className="pointer-events-auto flex items-center justify-center gap-2 rounded-md bg-grey-400 text-white shadow-md px-3 py-2 text-xs font-semibold hover:bg-grey-300 transition-colors active:scale-95"
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 游戏信息容器 */}
                        <div className="info-wrap">
                          {/* 在玩计数（仅游戏类型） */}
                          {type === "game" && (
                            <div className="flex items-center gap-2">
                              <span
                                className="block rounded-full bg-emerald-400 scale-up"
                                style={{ width: "6px", height: "6px" }}
                              />
                              <span className="text-xs text-white/70">
                                {game.playCount.toLocaleString()} 在玩
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
        ) : (
          <div className="flex gap-4">
            {games && games.slice(0, 8).map((game) => (
              <div key={game.id} className="shrink-0 w-[calc((100%-112px)/8)]">
                <div className="relative w-full game-carousel-image bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
