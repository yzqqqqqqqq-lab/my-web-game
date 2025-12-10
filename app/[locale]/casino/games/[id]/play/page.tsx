"use client";

export const runtime = "edge";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { mockGames } from "@/data/mockGames";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  ArrowTopRightOnSquareIcon,
  ArrowsPointingOutIcon,
  ComputerDesktopIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { StatsIcon } from "@/lib/icons";
import dynamic from "next/dynamic";
import GameCarouselSkeleton from "@/components/GameCarouselSkeleton";

const GameCarousel = dynamic(() => import("@/components/GameCarousel"), {
  ssr: false,
  loading: () => <GameCarouselSkeleton />,
});

interface CasinoGamePlayPageProps {
  params: Promise<{ id: string; locale: string }>;
}

const ExclusiveIcon = ({ className }: { className?: string }) => (
  <svg
    data-ds-icon="Exclusive"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
  >
    <path
      fill="currentColor"
      d="M23.15 10.03 19.42 7.7l-.17-4.39-4.35.61L11.95.67 9.01 3.93l-4.35-.59-.15 4.39L.8 10.08l2.71 3.46-1.34 4.18 4.3.91 1.67 4.06 3.88-2.06 3.89 2.04 1.64-4.07 4.29-.93-1.36-4.18 2.69-3.47zm-9.11 3.32 1.31 4.03-3.43-2.49-3.43 2.49 1.31-4.03-3.43-2.49h4.23l1.31-4.03 1.31 4.03h4.23l-3.43 2.49z"
    />
  </svg>
);

export default function CasinoGamePlayPage({
  params,
}: CasinoGamePlayPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const t = useTranslations();

  const [gameLoading, setGameLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("描述");
  const [isDemoMode, setIsDemoMode] = useState(true);
  const mode = searchParams.get("mode") || "play";
  const shouldAutoFullscreen = searchParams.get("fullscreen") === "true";

  // 支持通过id或gameSlug查找游戏
  const game = mockGames.find(
    (g) => g.id === resolvedParams.id || g.gameSlug === resolvedParams.id
  );
  const containerId = `softswiss_game_container_${game?.gameSlug || game?.id || "game"}`;

  // 权限检查
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(
        `/casino/games/${resolvedParams.id}/play?modal=auth&tab=login&mode=${mode}`
      );
    }
  }, [isAuthenticated, router, resolvedParams.id, mode]);

  // 游戏加载完成处理
  useEffect(() => {
    const iframe = document.getElementById("game-iframe") as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = () => {
        setGameLoading(false);
      };
    }
  }, []);

  // 全屏处理
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // 移动端自动全屏处理
  useEffect(() => {
    if (shouldAutoFullscreen && game && typeof window !== "undefined") {
      // 等待游戏容器加载完成后再触发全屏
      const timer = setTimeout(() => {
        const container = document.getElementById(containerId);
        if (container && !document.fullscreenElement) {
          container.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err);
          });
        }
      }, 500); // 延迟500ms确保容器已渲染

      return () => clearTimeout(timer);
    }
  }, [shouldAutoFullscreen, game, containerId]);

  const handleFullscreen = () => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handlePopout = () => {
    console.log(game);
  };

  if (!isAuthenticated) {
    return null; // 等待重定向
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t("play.gameNotFound")}
          </h1>
          <button
            onClick={() => router.push("/games")}
            className="text-blue-600 hover:underline"
          >
            {t("play.backToGames")}
          </button>
        </div>
      </div>
    );
  }

  // 构建游戏URL
  const gameUrl = game.gameUrl;

  // 获取推荐游戏（排除当前游戏）
  const recommendedGames = mockGames
    .filter((g) => g.id !== game.id)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-grey-600 pb-8 overflow-x-hidden">
      <main className="space-y-6">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6">
            {/* Game Wrapper */}
            <div
              className="game-wrapper w-full mt-[3vw] md:mt-10"
              data-testid="game-active"
            >
              <div
                className="game-wrapper w-full max-w-[1200px] mx-auto rounded-md overflow-hidden mobile-view"
                style={
                  {
                    "--max-height": "671px",
                    "--fullscreen-z": "9999",
                  } as React.CSSProperties
                }
              >
                <div
                  id={containerId}
                  className="game-content relative w-full mobile-view"
                  style={
                    {
                      "--game-desktop-aspect": "56.25%",
                      "--game-mobile-aspect": "177.77777777777777%",
                      "--game-landscape-aspect": "56.25%",
                      paddingBottom: "56.25%",
                      height: 0,
                      position: "relative",
                      overflow: "hidden",
                      maxWidth: "100%",
                    } as React.CSSProperties
                  }
                >
                  {/* Loading Overlay */}
                  {gameLoading && (
                    <div className="absolute h-full w-full flex items-center">
                      <div className="content flex justify-center items-center w-full">
                        <div className="loader">
                          <div className="loader-animation w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Game Iframe */}
                  <iframe
                    id="game-iframe"
                    title="game launcher"
                    className="absolute inset-0 w-full h-full border-0"
                    src={gameUrl}
                    allow="screen-wake-lock *;"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      maxWidth: "100%",
                    }}
                  />
                </div>

                {/* Game Footer Toolbar */}
                <div
                  className="game-footer relative"
                  style={
                    {
                      "--game-footer-height": "63px",
                    } as React.CSSProperties
                  }
                >
                  <div className=" hidden md:flex items-center justify-between px-4 py-3 bg-grey-700 rounded-b-md border-t border-grey-700">
                    <div className="flex items-center gap-2">
                      {/* Fullscreen Button */}
                      <button
                        onClick={handleFullscreen}
                        className="h-9 w-9 flex items-center justify-center text-grey-200 hover:text-white hover:bg-grey-500/60 rounded-sm transition-colors"
                        aria-label="全屏"
                      >
                        {isFullscreen ? (
                          <Square3Stack3DIcon className="w-5 h-5" />
                        ) : (
                          <ArrowsPointingOutIcon className="w-5 h-5" />
                        )}
                      </button>

                      {/* Theater / Default View */}
                      <button
                        className="h-9 w-9 flex items-center justify-center text-grey-200 hover:text-white hover:bg-grey-500/60 rounded-sm transition-colors"
                        aria-label="默认视图"
                      >
                        <ComputerDesktopIcon className="w-5 h-5" />
                      </button>

                      {/* Stats Button */}
                      <button
                        className="h-9 w-9 flex items-center justify-center text-grey-200 hover:text-white hover:bg-grey-500/60 rounded-sm transition-colors"
                        aria-label="统计"
                      >
                        <StatsIcon className="w-5 h-5" />
                      </button>

                      {/* Popout Button */}
                      <button
                        onClick={handlePopout}
                        className="h-9 w-9 flex items-center justify-center text-grey-200 hover:text-white hover:bg-grey-500/60 rounded-sm transition-colors"
                        aria-label="弹出窗口"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Center branding */}
                    <div className="text-white font-semibold text-lg tracking-wide">
                      Stake
                    </div>

                    {/* Demo/Real Money Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-grey-800 rounded-md">
                      <button
                        onClick={() => setIsDemoMode(true)}
                        disabled={isDemoMode}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                          isDemoMode
                            ? "bg-grey-500 text-white shadow-md"
                            : "bg-grey-800 text-grey-200 hover:bg-grey-500 hover:text-white"
                        }`}
                      >
                        试玩模式
                      </button>
                      <button
                        onClick={() => setIsDemoMode(false)}
                        disabled={!isDemoMode}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                          !isDemoMode
                            ? "bg-grey-500 text-white shadow-md"
                            : "bg-grey-800 text-grey-200 hover:bg-grey-500 hover:text-white"
                        }`}
                      >
                        真钱模式
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Meta Information - Desktop only */}
            <div className="game-meta bg-grey-700 rounded-lg p-6 w-full max-w-[1200px] mx-auto hidden md:block">
              {/* Title and Provider */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {game.title}
                  </h1>
                  <Link
                    href={`/casino/group/${
                      game.provider?.toLowerCase().replace(/\s+/g, "-") || ""
                    }`}
                    className="text-grey-200 hover:text-white transition-colors text-sm"
                  >
                    {game.provider}
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div
                className="flex gap-2 mb-6 overflow-x-auto w-full"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {["描述", "大赢家", "幸运赢家", "挑战"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors shrink-0 ${
                      activeTab === tab
                        ? "bg-grey-400 text-white"
                        : "bg-transparent text-grey-200 hover:bg-grey-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="desc-wrapper w-full">
                <div className="flex gap-6 w-full">
                  {/* Thumbnail */}
                  <div className="thumbnail-wrapper shrink-0">
                    <Image
                      src={game.cover}
                      alt={game.title}
                      width={150}
                      height={200}
                      className="rounded-lg object-cover"
                      style={{
                        maxWidth: "150px",
                        maxHeight: "200px",
                        aspectRatio: "0.75",
                      }}
                    />
                  </div>

                  {/* Tags and Info */}
                  <div className="game-meta-tags flex-1 min-w-0">
                    <div className="mb-4">
                      <span className="text-sm text-grey-200">庄家优势: </span>
                      <span className="text-sm text-white">3.47%</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {game.category.map((cat, index) => (
                        <Link
                          key={index}
                          href={`/casino/group/${cat.toLowerCase()}`}
                          className="px-3 py-1.5 bg-grey-600 text-grey-200 hover:text-white hover:bg-grey-500 rounded-full text-sm transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                      {game.provider && (
                        <Link
                          href={`/casino/group/${game.provider
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          className="px-3 py-1.5 bg-grey-600 text-grey-200 hover:text-white hover:bg-grey-500 rounded-full text-sm transition-colors"
                        >
                          {game.provider}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Games - Desktop only */}
            {recommendedGames.length > 0 && (
              <div className="w-full overflow-hidden hidden md:block">
                {/* <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">热门推荐</h2>
                </div> */}
                <div className="w-full overflow-hidden">
                  <GameCarousel
                    games={recommendedGames}
                    title={"热门推荐"}
                    icon={<ExclusiveIcon className="w-5 h-5 text-grey-200" />}
                    type="game"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
