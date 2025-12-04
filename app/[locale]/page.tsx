"use client";

export const runtime = "edge";

import { mockGames } from "@/data/mockGames";
import { mockCompetitions } from "@/data/mockCompetitions";
import { mockPromotions } from "@/data/mockPromotions";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import {
  Squares2X2Icon,
  UserCircleIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  PuzzlePieceIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/stores/useAuthStore";
import GameCarousel from "@/components/GameCarousel";

export default function Home() {
  const t = useTranslations();
  const { isAuthenticated, userInfo } = useAuthStore();
  // VIP 进度（可以从 store 或其他地方获取）
  const vipProgress = 75.0;

  // 获取热门游戏（按评分和播放量排序，至少8个）
  const hotGames = [...mockGames]
    .sort((a, b) => {
      const scoreA = a.rating * 0.6 + (a.playCount / 10000) * 0.4;
      const scoreB = b.rating * 0.6 + (b.playCount / 10000) * 0.4;
      return scoreB - scoreA;
    })
    .slice(0, Math.max(8, mockGames.length));

  // 获取热门赛事（按评分和播放量排序，至少8个）
  const hotCompetitions = [...mockCompetitions]
    .sort((a, b) => {
      const scoreA = a.rating * 0.6 + (a.playCount / 10000) * 0.4;
      const scoreB = b.rating * 0.6 + (b.playCount / 10000) * 0.4;
      return scoreB - scoreA;
    })
    .slice(0, Math.max(8, mockCompetitions.length));


  return (
    <div className="min-h-screen bg-grey-600">
      <main className=" ">
        {/* Hero Section - 左右结构 */}
        <div
          className=" min-h-70 relative overflow-hidden"
          style={{
            backgroundImage:
              "url(https://stake.com/_app/immutable/assets/header-bg.DLFzM8kq.png)",
            backgroundSize: "cover",
          }}
        >
          <div className="px-[3vw] max-w-[calc(1200px+6vw)] mx-auto py-12 grid gap-8 items-center md:grid-cols-[40%_55%] md:justify-between">
            {/* 左侧：未登录文案 / 登录后用户信息卡片*/}
            <div className="flex items-stretch relative z-10">
              {!isAuthenticated ? (
                <div className="grid grid-flow-row grid-rows-[1fr_auto] gap-y-3 md:gap-y-8 md:max-w-[478px] w-full items-center">
                  {/* 标题和注册按钮 */}
                  <div>
                    <div className="sm:px-24 md:px-0 lg:pr-20">
                      <h1 className="text-lg md:text-[32px] text-white font-bold text-left">
                        世界上最大的在线赌场和体育博彩
                      </h1>
                    </div>
                    <Button
                      href="?modal=auth&tab=register"
                      variant="primary"
                      size="md"
                      className="mt-4 md:mt-4 w-auto block mx-0 shadow-md"
                    >
                      注册
                    </Button>
                  </div>

                  {/* 通过其他方式注册 */}
                  <div className="h-full w-full flex flex-col justify-end items-start">
                    <div className="mb-2">
                      <p className="text-sm text-white font-bold text-left">
                        通过其他方式注册
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Google */}
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 justify-center rounded-md bg-grey-400 text-white hover:bg-grey-300 text-sm shadow-md py-2 px-4 transition-colors active:scale-[0.98]"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="#4285f4"
                            d="M15.68,8.18c0-.57-.05-1.11-.15-1.64h-7.53v3.09h4.31c-.19,1-.75,1.85-1.6,2.41v2.01h2.59c1.51-1.39,2.39-3.44,2.39-5.88Z"
                          ></path>
                          <path
                            fill="#34a853"
                            d="M8,16c2.16,0,3.97-.72,5.29-1.94l-2.59-2.01c-.72.48-1.63.76-2.71.76-2.08,0-3.85-1.41-4.48-3.3H.85v2.07c1.32,2.61,4.02,4.41,7.15,4.41Z"
                          ></path>
                          <path
                            fill="#fbbc04"
                            d="M3.52,9.52c-.16-.48-.25-.99-.25-1.52s.09-1.04.25-1.52v-2.07H.85c-.54,1.08-.85,2.3-.85,3.59s.31,2.51.85,3.59l2.67-2.07Z"
                          ></path>
                          <path
                            fill="#e94235"
                            d="M8,3.18c1.17,0,2.23.4,3.06,1.2l2.29-2.29c-1.39-1.29-3.2-2.08-5.35-2.08C4.87,0,2.17,1.79.85,4.41l2.67,2.07c.63-1.89,2.39-3.3,4.48-3.3Z"
                          ></path>
                        </svg>
                      </button>

                      {/* Facebook */}
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 justify-center rounded-md bg-grey-400 text-white hover:bg-grey-300 text-sm shadow-md py-2 px-4 transition-colors active:scale-[0.98]"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                        >
                          <path
                            fill="#0866FF"
                            d="M22.986 11.993C22.986 5.92 18.066 1 11.993 1S1 5.92 1 11.993c0 5.153 3.545 9.482 8.341 10.677v-7.31H7.074v-3.367H9.34V10.55c0-3.737 1.69-5.483 5.373-5.483.7 0 1.896.138 2.39.275v3.05a14 14 0 0 0-1.263-.04c-1.8 0-2.501.687-2.501 2.46v1.181h3.586l-.618 3.367H13.34v7.558c5.441-.66 9.66-5.29 9.66-10.911z"
                          ></path>
                          <path
                            fill="#fff"
                            d="m16.294 15.36.619-3.367h-3.587v-1.182c0-1.772.7-2.46 2.501-2.46.563 0 1.017 0 1.264.042v-3.05c-.495-.138-1.69-.276-2.39-.276-3.67 0-5.374 1.732-5.374 5.483v1.443H7.06v3.367h2.267v7.31c.852.206 1.745.33 2.652.33.454 0 .894-.027 1.333-.082V15.36z"
                          ></path>
                        </svg>
                      </button>

                      {/* Line */}
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 justify-center rounded-md bg-grey-400 text-white hover:bg-grey-300 text-sm shadow-md py-2 px-4 transition-colors active:scale-[0.98]"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                        >
                          <path
                            fill="#06C755"
                            d="M12.03 23c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11 4.925 11 11 11"
                          ></path>
                          <path
                            fill="#fff"
                            d="M19.373 11.365c0-3.285-3.299-5.962-7.343-5.962S4.688 8.08 4.688 11.365c0 2.954 2.608 5.41 6.142 5.88.234.055.565.151.648.358.07.18.055.484.028.663 0 0-.083.525-.11.635-.028.18-.152.731.634.4.787-.331 4.237-2.498 5.77-4.265 1.062-1.173 1.573-2.346 1.573-3.67"
                          ></path>
                          <path
                            fill="#06C755"
                            d="M16.93 13.256a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138h-1.408v-.539h1.408a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138h-1.408v-.539h1.408a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138h-2.07a.14.14 0 0 0-.138.138v3.202c0 .083.069.138.138.138zm-7.646 0a.14.14 0 0 0 .138-.138v-.524a.14.14 0 0 0-.138-.138H7.876v-2.54a.14.14 0 0 0-.138-.138h-.525a.14.14 0 0 0-.138.138v3.202c0 .083.07.138.138.138zm1.256-3.478h-.525a.14.14 0 0 0-.138.138v3.216c0 .076.062.138.138.138h.525a.14.14 0 0 0 .138-.138V9.916a.14.14 0 0 0-.138-.138m3.547 0h-.525a.14.14 0 0 0-.138.138v1.905l-1.463-1.988V9.82h-.524a.14.14 0 0 0-.138.138v3.202c0 .083.069.138.138.138h.524a.14.14 0 0 0 .138-.138v-1.904l1.463 1.987.042.042h.565a.14.14 0 0 0 .139-.139V9.945a.14.14 0 0 0-.139-.138z"
                          ></path>
                        </svg>
                      </button>

                      {/* Twitch */}
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 justify-center rounded-md bg-grey-400 text-white hover:bg-grey-300 text-sm shadow-md py-2 px-4 transition-colors active:scale-[0.98]"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                        >
                          <path
                            fill="#fff"
                            d="m19.246 11.22-2.995 3.136h-2.996l-2.63 2.754v-2.754H7.25V2.576h11.996z"
                          ></path>
                          <path
                            fill="#9146FF"
                            d="M6.505 1 2.75 4.932v14.136h4.5V23l3.755-3.932H14L20.75 12V1zm12.741 10.22-2.995 3.136h-2.996l-2.63 2.754v-2.754H7.25V2.576h11.996z"
                          ></path>
                          <path
                            fill="#9146FF"
                            d="M17.009 5.329h-1.505v4.712h1.505zm-4.134 0H11.37v4.712h1.505z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex-1 rounded-3xl bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white p-6 md:p-7 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_55%)]" />
                  <div className="relative flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <UserCircleIcon className="w-10 h-10 text-white" />
                        <div>
                          <div className="text-sm text-emerald-100">
                            {t("common.welcomeBack") ?? "欢迎回来"}
                          </div>
                          <div className="text-lg font-semibold">
                            {userInfo?.username || "VIP 玩家"}
                          </div>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-semibold border border-emerald-300/40">
                        VIP 0 · 新手
                      </span>
                    </div>

                    <div className="mt-2 mb-6">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-emerald-50">您的 VIP 进度</span>
                        <span className="text-emerald-100">
                          {vipProgress.toFixed(2)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-emerald-900/40 overflow-hidden">
                        <div
                          className="h-full  rounded-full bg-linear-to-r from-yellow-300 to-amber-500 transition-all duration-500"
                          style={{ width: `${vipProgress}%` }}
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-emerald-50/90">
                        下注即可开始累积 VIP 经验，解锁更高等级和专属奖励。
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between text-xs">
                      <div className="space-y-1">
                        {/* <div className="text-emerald-50/90">当前等级</div> */}
                        <div className="font-semibold">暂无等级</div>
                      </div>
                      <div className="space-y-1 text-right">
                        {/* <div className="text-emerald-50/90">下一等级</div> */}
                        <div className="font-semibold">青铜</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* 右侧：娱乐城和体育卡片 */}
            <div className="flex gap-2 md:gap-4 relative z-10 min-w-0 w-full">
              {/* 娱乐城卡片 */}
              <Link
                href="/games"
                className="group p-0.5 relative flex-1 rounded-[6px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 transform hover:-translate-y-[10px]"
                style={{
                  background:
                    "linear-gradient(0deg, transparent 15%, #017aff 100%)",
                }}
              >
                <div className="relative flex flex-col h-full">
                  {/* 主要内容区域 - 图片 */}
                  <div className="relative w-full overflow-hidden rounded-t-[6px] aspect-[350/230]">
                    <Image
                      src="https://mediumrare.imgix.net/stake-casino-home-18-jul-25-en.png?w=350&h=230&fit=min&auto=format"
                      alt="娱乐城"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 45vw, 350px"
                    />
                  </div>
                  {/* 底部信息条 */}
                  <div className="bg-grey-600 rounded-b-[6px] px-4 py-3 flex items-center justify-between ">
                    <div className="flex items-center gap-1.5 text-white/80">
                      <svg
                        data-ds-icon="Casino"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="inline-block shrink-0"
                      >
                        <path
                          fill="currentColor"
                          d="m2.14 4.63 7.25-3.38c.63-.3 1.34-.23 1.89.11-.09.14-.18.28-.26.43L4.81 15.1 1.17 7.29c-.47-1-.03-2.19.97-2.66"
                        ></path>
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="m21.86 4.63-7.25-3.38c-1-.47-2.19-.03-2.66.97l-6.76 14.5c-.47 1-.03 2.19.97 2.66l7.25 3.38c1 .47 2.19.03 2.66-.97l6.76-14.5c.47-1 .03-2.19-.97-2.66m-9.54 11-.85-4.81 4.23-2.44.85 4.81z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-white font-medium text-sm">
                        娱乐城
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-bold text-sm">
                        {/* {mockGames.length.toLocaleString()} */}
                        45,800
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 体育卡片 */}
              <Link
                href="/games"
                className="group p-0.5 relative flex-1 rounded-[6px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-300 transform hover:-translate-y-[10px]"
                style={{
                  background:
                    "linear-gradient(0deg, transparent 30%, #16a34a 100%)",
                }}
              >
                <div className="relative flex flex-col h-full rounded-[6px]">
                  {/* 主要内容区域 - 图片 */}
                  <div className="relative w-full overflow-hidden rounded-t-[6px] aspect-[350/230]">
                    <Image
                      src="https://mediumrare.imgix.net/stake-sports-home-18-jul-25-en.png?w=350&h=230&fit=min&auto=format"
                      alt="体育"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 45vw, 350px"
                    />
                  </div>
                  {/* 底部信息条 */}
                  <div className="bg-grey-600 rounded-b-[6px] px-4 py-3 flex items-center justify-between ">
                    <div className="flex items-center gap-1.5">
                      <svg
                        data-ds-icon="Basketball"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="inline-block shrink-0 text-white/80"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M20.864 18.483a11 11 0 0 0 1.824-3.931 8.5 8.5 0 0 0-3.529 1.402 36 36 0 0 1 1.705 2.529m-5.399 3.94a11.1 11.1 0 0 0 4.134-2.493 33 33 0 0 0-1.833-2.776 8.48 8.48 0 0 0-2.292 5.269zm1.998-17.63a11.43 11.43 0 0 1-2.218 6.772c.98.934 1.907 1.915 2.768 2.96a10.35 10.35 0 0 1 4.95-1.842c.019-.23.037-.45.037-.688 0-4.196-2.356-7.843-5.812-9.694.175.806.275 1.64.275 2.492m-13.365-.43a35.2 35.2 0 0 1 9.79 5.965 9.6 9.6 0 0 0 1.742-5.535c0-1.182-.22-2.318-.614-3.362A11 11 0 0 0 12 1a10.94 10.94 0 0 0-7.902 3.363M5.932 16.33c-1.55 0-3.016-.312-4.364-.862C3.026 19.838 7.142 23 12 23c.55 0 1.082-.055 1.613-.128a10.35 10.35 0 0 1 3.007-7.166 33 33 0 0 0-2.548-2.73 11.48 11.48 0 0 1-8.131 3.363z"
                          clipRule="evenodd"
                        ></path>
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M12.706 11.73a33.4 33.4 0 0 0-9.818-5.883 10.9 10.9 0 0 0-1.824 7.321 9.66 9.66 0 0 0 11.642-1.448z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="text-white font-medium text-sm ">
                        体育
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-bold text-sm">
                        {/* {Math.floor(mockGames.length * 0.35).toLocaleString()} */}
                        15,162
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-12">
          {/* 热门游戏轮播 */}
          <GameCarousel
            games={hotGames}
            title={t("home.hotGames")}
            icon={
              <svg
                data-ds-icon="Trending"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="inline-block shrink-0"
                style={{ color: "var(--color-grey-200)" }}
              >
                <path
                  fill="currentColor"
                  d="M12 1C5.92 1 1 5.92 1 12s4.92 11 11 11 11-4.92 11-11S18.08 1 12 1m7 12.23c-.55 0-1-.45-1-1V9.98l-5.88 5.88a.996.996 0 0 1-1.41 0l-2.29-2.29-2.71 2.71c-.2.2-.45.29-.71.29s-.51-.1-.71-.29a.996.996 0 0 1 0-1.41l3.42-3.42a.996.996 0 0 1 1.41 0l2.29 2.29 5.17-5.17h-2.25c-.55 0-1-.45-1-1s.45-1 1-1H19c.55 0 1 .45 1 1v4.67c0 .55-.45 1-1 1z"
                ></path>
              </svg>
            }
            type="game"
          />

          {/* 热门赛事轮播 */}
          <GameCarousel
            games={hotCompetitions}
            title={t("home.hotCompetitions")}
            icon={
              <svg
                data-ds-icon="Basketball"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="inline-block shrink-0"
                style={{ color: "var(--color-grey-200)" }}
              >
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M20.864 18.483a11 11 0 0 0 1.824-3.931 8.5 8.5 0 0 0-3.529 1.402 36 36 0 0 1 1.705 2.529m-5.399 3.94a11.1 11.1 0 0 0 4.134-2.493 33 33 0 0 0-1.833-2.776 8.48 8.48 0 0 0-2.292 5.269zm1.998-17.63a11.43 11.43 0 0 1-2.218 6.772c.98.934 1.907 1.915 2.768 2.96a10.35 10.35 0 0 1 4.95-1.842c.019-.23.037-.45.037-.688 0-4.196-2.356-7.843-5.812-9.694.175.806.275 1.64.275 2.492m-13.365-.43a35.2 35.2 0 0 1 9.79 5.965 9.6 9.6 0 0 0 1.742-5.535c0-1.182-.22-2.318-.614-3.362A11 11 0 0 0 12 1a10.94 10.94 0 0 0-7.902 3.363M5.932 16.33c-1.55 0-3.016-.312-4.364-.862C3.026 19.838 7.142 23 12 23c.55 0 1.082-.055 1.613-.128a10.35 10.35 0 0 1 3.007-7.166 33 33 0 0 0-2.548-2.73 11.48 11.48 0 0 1-8.131 3.363z"
                  clip-rule="evenodd"
                ></path>
                <path
                  fill="currentColor"
                  fill-rule="evenodd"
                  d="M12.706 11.73a33.4 33.4 0 0 0-9.818-5.883 10.9 10.9 0 0 0-1.824 7.321 9.66 9.66 0 0 0 11.642-1.448z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            }
            type="event"
          />

          {/* 促销活动轮播 */}
          <GameCarousel
            promotions={mockPromotions}
            title={t("home.promotions")}
            icon={
              <svg
                data-ds-icon="Gift"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="inline-block shrink-0"
                style={{ color: "var(--color-grey-200)" }}
              >
                <path
                  fill="currentColor"
                  d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2m-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1M9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1m11 15H4v-2h16zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20z"
                ></path>
              </svg>
            }
            type="promotion"
          />
        </div>
      </main>
    </div>
  );
}
