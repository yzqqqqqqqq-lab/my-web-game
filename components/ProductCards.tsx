"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  type: "casino" | "sports";
  href: string;
  title: string;
  count: string;
  imageUrl: string;
  gradient: string;
  hoverBorder: string;
}

// 将图标组件移到外部，避免在渲染时创建
const CasinoIcon = () => (
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
);

const SportsIcon = () => (
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
);

const ProductCard = ({
  type,
  href,
  title,
  count,
  imageUrl,
  gradient,
  hoverBorder,
}: ProductCardProps) => {
  const baseClassName = `group p-0.5 relative flex-1 rounded-[6px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${hoverBorder} transform hover:-translate-y-[10px]`;
  
  const content = (
    <div className="relative flex flex-col h-full">
      {/* 主要内容区域 - 图片 */}
      <div className="relative w-full overflow-hidden rounded-t-[6px] aspect-[350/230]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 350px"
        />
      </div>
      {/* 底部信息条 */}
      <div className="bg-grey-600 rounded-b-[6px] px-4 py-3 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 ${type === "casino" ? "text-white/80" : ""}`}>
          {type === "casino" ? <CasinoIcon /> : <SportsIcon />}
          <span className="text-white font-medium text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white font-bold text-sm">{count}</span>
        </div>
      </div>
    </div>
  );

  // 如果是 # 或空，使用 div 而不是 Link
  if (href === "#" || !href) {
    return (
      <div
        className={`${baseClassName} cursor-pointer`}
        style={{ background: gradient }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={baseClassName}
      style={{ background: gradient }}
    >
      {content}
    </Link>
  );
};

export default function ProductCards({ classNames }: { classNames: string }) {
  const t = useTranslations();
  
  return (
    <div className={classNames}>
      {/* PC端版本 - 并排显示 */}
      <div className="hidden md:flex gap-2 md:gap-4 relative z-10 min-w-0 w-full">
        <ProductCard
          type="casino"
          href="#"
          title={t("productCards.casino")}
          count="45,800"
          imageUrl="https://mediumrare.imgix.net/stake-casino-home-18-jul-25-en.png?w=350&h=230&fit=min&auto=format"
          gradient="linear-gradient(0deg, transparent 15%, #017aff 100%)"
          hoverBorder="hover:border-blue-300"
        />
        <ProductCard
          type="sports"
          href="#"
          title={t("productCards.sports")}
          count="15,162"
          imageUrl="https://mediumrare.imgix.net/stake-sports-home-18-jul-25-en.png?w=350&h=230&fit=min&auto=format"
          gradient="linear-gradient(0deg, transparent 30%, #16a34a 100%)"
          hoverBorder="hover:border-emerald-300"
        />
      </div>

      {/* 移动端版本 - 独立模块，垂直排列 */}
      <div className="md:hidden  mx-auto py-8">
        <div className="flex items-center gap-2 mb-4">
          <svg
            data-ds-icon="Play"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="inline-block shrink-0"
          >
            <path
              fill="currentColor"
              d="M8 5v14l11-7z"
            ></path>
          </svg>
          <h2 className="text-white font-bold text-lg">{t("productCards.startPlaying")}</h2>
        </div>
        <div className="flex gap-2">
          <ProductCard
            type="casino"
            href="#"
            title={t("productCards.casino")}
            count="45,800"
            imageUrl="https://mediumrare.imgix.net/stake-casino-home-18-jul-25-en.png?w=350&h=230&fit=min&auto=format"
            gradient="linear-gradient(0deg, transparent 15%, #017aff 100%)"
            hoverBorder="hover:border-blue-300"
          />
          <ProductCard
            type="sports"
            href="#"
            title={t("productCards.sports")}
            count="15,162"
            imageUrl="https://mediumrare.imgix.net/stake-sports-home-18-jul-25-en.png?w=350&h=230&fit=min&auto=format"
            gradient="linear-gradient(0deg, transparent 30%, #16a34a 100%)"
            hoverBorder="hover:border-emerald-300"
          />
        </div>
      </div>
    </div>
  );
}

