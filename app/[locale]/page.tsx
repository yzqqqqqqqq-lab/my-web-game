"use client";

import { mockGames } from "@/data/mockGames";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Squares2X2Icon,
  UserCircleIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  PuzzlePieceIcon,
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

  // 获取休闲游戏（category包含"休闲"）
  const casualGames = [...mockGames]
    .filter((game) => game.category.includes("休闲"))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, Math.max(8, mockGames.length));

  // 获取益智游戏（category包含"益智"）
  const puzzleGames = [...mockGames]
    .filter((game) => game.category.includes("益智"))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, Math.max(8, mockGames.length));

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section - 左右结构 */}
        <div className="my-8 min-h-70 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-8 items-stretch">
          {/* 左侧：未登录文案 / 登录后用户信息卡片*/}
          <div className="flex items-stretch">
            {!isAuthenticated ? (
              <div className="flex flex-col justify-center">
                {/* <div className="flex items-center gap-3 mb-6">
                  <Squares2X2Icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                    {t("home.title")}
                  </h1>
                </div> */}
                <p className="text-lg md:text-4xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                  {t("home.subtitle")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/games"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                  >
                    {t("home.browseAllGames")}
                  </Link>
                  <Link
                    href="?modal=auth&tab=login"
                    className="px-8 py-4 bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors shadow-lg border border-gray-200 dark:border-zinc-700"
                  >
                    {t("common.loginOrRegister")}
                  </Link>
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
          <div className="flex  gap-4">
            {/* 娱乐城卡片 */}
            <Link
              href="/games"
              className="group relative flex-1 rounded-xl border border-blue-400/60 bg-linear-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative flex flex-col h-full min-h-[180px]">
                {/* 主要内容区域 */}
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <SparklesIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                {/* 底部信息条 */}
                <div className="bg-slate-900/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Squares2X2Icon className="w-4 h-4 text-blue-200" />
                    <span className="text-white font-medium text-sm">娱乐城</span>
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
              className="group relative flex-1 rounded-xl border border-emerald-400/60 bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-emerald-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
              <div className="relative flex flex-col h-full min-h-[180px]">
                {/* 主要内容区域 */}
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <TrophyIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                {/* 底部信息条 */}
                <div className="bg-slate-900/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-4 h-4 text-emerald-200" />
                    <span className="text-white font-medium text-sm">体育</span>
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

        {/* 热门游戏轮播 */}
        <GameCarousel
          games={hotGames}
          title={t("home.hotGames")}
          icon={<FireIcon className="w-8 h-8 text-orange-500" />}
        />

        {/* 休闲游戏轮播 */}
        {casualGames.length > 0 && (
          <GameCarousel
            games={casualGames}
            title="休闲游戏"
            icon={<SparklesIcon className="w-8 h-8 text-blue-500" />}
          />
        )}

        {/* 益智游戏轮播 */}
        {puzzleGames.length > 0 && (
          <GameCarousel
            games={puzzleGames}
            title="益智游戏"
            icon={<PuzzlePieceIcon className="w-8 h-8 text-purple-500" />}
          />
        )}

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t("home.gameCategories")}
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
                  {
                    mockGames.filter((g) => g.category.includes(category))
                      .length
                  }{" "}
                  {t("common.gamesCount")}
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
                {t("common.gamesCount")}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                {mockGames
                  .reduce((sum, g) => sum + g.playCount, 0)
                  .toLocaleString()}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {t("common.totalPlayCount")}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {(
                  mockGames.reduce((sum, g) => sum + g.rating, 0) /
                  mockGames.length
                ).toFixed(1)}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-400">
                {t("common.averageRating")}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
