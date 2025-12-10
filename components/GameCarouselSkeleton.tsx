import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function GameCarouselSkeleton({
  title = "Loading...",
  icon = null,
}: {
  title?: string;
  icon?: React.ReactNode;
}) {
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
              disabled
              className="flex items-center justify-center w-14 h-10 transition-all opacity-50"
            >
              <ChevronLeftIcon className="w-5 h-5 text-grey-200" />
            </button>
            <div className="w-px bg-grey-400" />
            <button
              disabled
              className="flex items-center justify-center w-14 h-10 transition-all opacity-50"
            >
              <ChevronRightIcon className="w-5 h-5 text-grey-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Skeleton Items */}
      <div className="overflow-hidden -mx-4 px-4 md:mx-0 md:px-0 mt-4">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[120px] md:w-[150px] lg:w-[180px]"
            >
              <div className="relative w-full aspect-3/4 bg-grey-500 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

