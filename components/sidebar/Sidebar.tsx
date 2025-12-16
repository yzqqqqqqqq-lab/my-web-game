"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import {
  GiftIcon,
  UserGroupIcon,
  TrophyIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  GlobeAltIcon,
} from "@/lib/icons";
import {
  Bars3Icon,
  ChevronDownIcon,
  StarIcon,
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useSidebarStore } from "@/stores/useSidebarStore";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string;
  children?: NavItem[];
}

interface SidebarProps {
  className?: string;
  forceExpanded?: boolean;
}

export default function Sidebar({ className, forceExpanded = false }: SidebarProps) {
  const sidebarStore = useSidebarStore();
  // 如果 forceExpanded 为 true，则强制 isOpen 为 true，且覆盖 toggle 等方法（虽然移动端可能不需要 toggle）
  const isOpen = forceExpanded || sidebarStore.isOpen;
  const toggle = forceExpanded ? () => {} : sidebarStore.toggle;
  const toggleExpanded = sidebarStore.toggleExpanded;
  const isExpanded = sidebarStore.isExpanded;
  const open = sidebarStore.open;

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [contentVisible, setContentVisible] = useState(isOpen);
  const [navVisible, setNavVisible] = useState(isOpen);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [pendingExpandItem, setPendingExpandItem] = useState<string | null>(
    null
  );
  const [pendingLanguageMenuOpen, setPendingLanguageMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<"casino" | "sports" | null>(
    null
  );
  const sidebarRef = useRef<HTMLElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // 根据路径判断 activeTab
  const activeTab = useMemo<"casino" | "sports" | null>(() => {
    if (pathname.includes("/sports")) {
      return "sports";
    } else if (pathname.includes("/casino")) {
      return "casino";
    }
    return null; // 默认值
  }, [pathname]);

  // 解决水合问题
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 监听侧边栏动画完成事件
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || !mounted) return;

    // 清除之前的超时
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // 在动画开始前先隐藏内容（只在状态改变时）
    const hideTimer = setTimeout(() => {
      setContentVisible(false);
      setNavVisible(false);
    }, 0);

    const handleTransitionEnd = (e: TransitionEvent) => {
      // 只处理宽度和transform的过渡完成
      if (e.propertyName === "width" || e.propertyName === "transform") {
        // 动画完成后，根据 isOpen 状态显示/隐藏内容
        if (isOpen) {
          setContentVisible(true);
          setNavVisible(true);
        } else {
          setContentVisible(false);
          // 折叠时，nav 也应该淡入显示
          setNavVisible(true);
        }
      }
    };

    sidebar.addEventListener("transitionend", handleTransitionEnd);

    // Fallback: 如果 transitionend 没有触发，350ms 后根据 isOpen 状态显示内容
    transitionTimeoutRef.current = setTimeout(() => {
      setContentVisible(isOpen);
      // nav 在展开和折叠时都应该可见
      setNavVisible(true);
    }, 350); // 稍微长于动画时间（300ms）

    return () => {
      clearTimeout(hideTimer);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      sidebar.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [isOpen, mounted]);

  // 专门处理待展开的菜单项：当侧边栏打开且内容已显示后，展开对应的二级导航
  useEffect(() => {
    // 只有当侧边栏打开、有待展开项、且内容已显示时才执行
    if (!isOpen || !pendingExpandItem || !contentVisible) {
      return;
    }

    // 确保内容已显示后再展开，使用足够的延迟让动画完成
    const expandTimer = setTimeout(() => {
      // 再次检查，确保状态仍然有效
      if (pendingExpandItem) {
        toggleExpanded(pendingExpandItem);
        setPendingExpandItem(null);
      }
    }, 150); // 给足够的时间让内容完全显示

    return () => clearTimeout(expandTimer);
  }, [isOpen, pendingExpandItem, contentVisible, toggleExpanded]);

  // 处理待打开的语言菜单：当侧边栏打开且内容已显示后，打开语言菜单
  useEffect(() => {
    if (isOpen && pendingLanguageMenuOpen && contentVisible) {
      const languageMenuTimer = setTimeout(() => {
        setLanguageMenuOpen(true);
        setPendingLanguageMenuOpen(false);
      }, 150); // 给足够的时间让内容完全显示

      return () => clearTimeout(languageMenuTimer);
    }
  }, [isOpen, pendingLanguageMenuOpen, contentVisible]);

  const navItems: NavItem[] = [
    {
      id: "promotions",
      label: t("sidebar.promotions"),
      icon: GiftIcon,
      children: [
        {
          id: "weekly-draw",
          label: t("sidebar.weeklyDraw"),
          icon: StarIcon,
          href: "#",
        },
        {
          id: "competition",
          label: t("sidebar.competition"),
          icon: CalendarDaysIcon,
          href: "#",
        },
        {
          id: "airdrop",
          label: t("sidebar.airdrop"),
          icon: GiftIcon,
          href: "#",
        },
        {
          id: "view-all",
          label: t("sidebar.viewAll"),
          icon: EllipsisHorizontalIcon,
          href: "#",
        },
      ],
    },
    {
      id: "affiliate",
      label: t("sidebar.affiliate"),
      icon: UserGroupIcon,
      href: "#",
    },
    {
      id: "vip",
      label: t("sidebar.vip"),
      icon: TrophyIcon,
      href: "#",
    },
    {
      id: "blog",
      label: t("sidebar.blog"),
      icon: BookOpenIcon,
      href: "#",
    },
    {
      id: "forum",
      label: t("sidebar.forum"),
      icon: ChatBubbleLeftRightIcon,
      href: "#",
    },
  ];

  const bottomItems: NavItem[] = [
    {
      id: "sponsorships",
      label: t("sidebar.sponsorships"),
      icon: SparklesIcon,
      children: [
        {
          id: "drake",
          label: "Drake",
          icon: SparklesIcon,
          href: "#",
        },
        {
          id: "trinbago",
          label: "Trinbago Knight Riders",
          icon: SparklesIcon,
          href: "#",
        },
        {
          id: "davido",
          label: "Davido",
          icon: SparklesIcon,
          href: "#",
        },
        {
          id: "stake-f1",
          label: "Stake F1 车队",
          icon: SparklesIcon,
          href: "#",
        },
        {
          id: "ufc",
          label: "UFC",
          icon: SparklesIcon,
          href: "#",
        },
        {
          id: "everton",
          label: "埃弗顿足球俱乐部",
          icon: SparklesIcon,
          href: "#",
        },
      ],
    },
    {
      id: "responsible",
      label: t("sidebar.responsible"),
      icon: ShieldCheckIcon,
      href: "#",
    },
    {
      id: "support",
      label: t("sidebar.support"),
      icon: QuestionMarkCircleIcon,
      href: "#",
    },
  ];

  const isActive = (href?: string) => {
    if (!href || href === "#") return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleSelectLocale = (newLocale: string) => {
    setLanguageMenuOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  // 点击外部关闭语言菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    if (languageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [languageMenuOpen]);

  const languages = [
    { code: "zh", label: "中文" },
    { code: "en", label: "English" },
  ];

  // const isDesktopCollapsed =
  //   !isOpen && typeof window !== "undefined" ? window.innerWidth >= 768 : false;

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const expanded = hasChildren ? isExpanded(item.id) : false;

    const baseButtonClasses = isOpen
      ? `
        w-full flex items-center justify-between gap-2 px-4 py-3
        ${level === 0 ? "rounded-md" : "rounded-none"}
        text-base font-semibold
        bg-transparent text-white hover:text-white
        hover:bg-grey-400
        transition-colors
      `
      : `
        w-11 h-11 flex items-center justify-center rounded-md
        text-white
        hover:bg-grey-500/80
        transition-colors
      `;

    const baseLinkClasses = baseButtonClasses;

    if (hasChildren) {
      return (
        <li key={item.id}>
          <button
            onClick={() => {
              if (!isOpen) {
                // 先设置待展开项，再打开侧边栏
                setPendingExpandItem(item.id);
                open();
              } else {
                toggleExpanded(item.id);
              }
            }}
            className={`group ${baseButtonClasses} ${
              level > 0 && isOpen ? "pl-6 ml-4" : ""
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Icon
                className={`w-5 h-5 shrink-0 text-grey-200 group-hover:text-white transition-all duration-300 ${
                  isOpen
                    ? contentVisible
                      ? "opacity-100"
                      : "opacity-0"
                    : "opacity-100"
                }`}
              />
              {isOpen && (
                <span
                  className={`text-base font-semibold truncate transition-opacity duration-300 ${
                    contentVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </div>
            {isOpen && (
              <div
                className={`shrink-0 flex w-4 h-4 -my-1 rounded-full items-center justify-center transition-transform duration-200 ${
                  expanded ? "rotate-180" : "rotate-0"
                } ${contentVisible ? "opacity-100" : "opacity-0"}`}
              >
                <ChevronDownIcon className="w-5 h-5 shrink-0" />
              </div>
            )}
          </button>
          {isOpen && expanded && hasChildren && (
            <div
              className={`ml-6 transition-opacity duration-300 ${
                contentVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <ul className="space-y-0">
                {item.children!.map((child) => renderNavItem(child, level + 1))}
              </ul>
            </div>
          )}
        </li>
      );
    }

    return (
      <li key={item.id}>
        {item.href && item.href !== "#" ? (
          <Link
            href={item.href}
            className={`group ${baseLinkClasses} ${
              level > 0 && isOpen ? "pl-6 rounded-none border-l-2 border-grey-400" : ""
            } ${
              active
                ? "bg-grey-400 text-white"
                : "bg-transparent text-white hover:text-white hover:bg-grey-400"
            }`}
            onClick={() => {
              if (window.innerWidth < 1024) {
                toggle();
              }
            }}
          >
            <Icon
              className={`w-5 h-5 shrink-0 text-grey-200 group-hover:text-white transition-all duration-300 ${
                isOpen
                  ? contentVisible
                    ? "opacity-100"
                    : "opacity-0"
                  : "opacity-100"
              }`}
            />
            {isOpen ? (
              <>
                <span
                  className={`flex-1 text-base font-semibold truncate transition-opacity duration-300 ${
                    contentVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded transition-opacity duration-300 ${
                      contentVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            ) : (
              <span className="sr-only">{item.label}</span>
            )}
          </Link>
        ) : (
          <button
            className={`group ${baseButtonClasses} ${
              level > 0 && isOpen
                ? "rounded-none border-l-2 border-grey-400 "
                : ""
            }`}
            onClick={() => {
              console.log(`Navigate to ${item.id}`);
            }}
          >
            <Icon
              className={`w-5 h-5 shrink-0 text-grey-200 group-hover:text-white transition-all duration-300 ${
                isOpen
                  ? contentVisible
                    ? "opacity-100"
                    : "opacity-0"
                  : "opacity-100"
              }`}
            />
            {isOpen ? (
              <>
                <span
                  className={`flex-1 text-base font-semibold text-left truncate transition-opacity duration-300 ${
                    contentVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-base font-semibold bg-red-500 text-white rounded transition-opacity duration-300 ${
                      contentVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            ) : (
              <span className="sr-only">{item.label}</span>
            )}
          </button>
        )}
      </li>
    );
  };

  // 避免水合不匹配
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay - 仅移动端 (< 768px) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={toggle}
        />
      )}

      {/* Tablet overlay - 768px-1200px 浮动遮罩层 */}
      {isOpen && (
        <div
          data-layout=""
          className="overlay fixed inset-0 bg-black/60 z-1598 hidden md:block min-[1200px]:hidden!"
          style={{ "--header-height": "60px" } as React.CSSProperties}
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          text-grey-200
          transition-all duration-300 ease-in-out
          bg-grey-700
          overflow-hidden
          
          /* 移动端和平板端 (< 1200px): fixed 定位，浮动效果 */
          fixed top-0 left-0  z-50 
          ${
            isOpen
              ? "translate-x-0 w-[260px] md:z-1599"
              : "-translate-x-full md:translate-x-0 md:w-[60px] md:z-1599"
          }
          
          /* 桌面端 (>= 1200px): sticky 定位，高度充满屏幕 */
          min-[1200px]:sticky! min-[1200px]:translate-x-0! min-[1200px]:z-auto! min-[1200px]:top-0! min-[1200px]:left-auto! min-[1200px]:h-screen!
          min-[1200px]:${
            isOpen ? "w-[260px]" : "w-[60px]"
          }
          
          ${className || ""}
        `}
      >
        <div className="flex flex-col h-full md:h-screen">
          {/* Header with Tabs */}
          <div className="shrink-0">
            {/* Header with Menu Button and Tabs */}
            {isOpen ? (
              <div
                className={`flex items-center gap-2 px-4 h-[60px] border-b border-grey-500/40 bg-grey-700/95 transition-opacity duration-300 `}
              >
                {/* Menu Toggle Button */}
                <button
                  onClick={toggle}
                  className="p-2 rounded-md hover:bg-grey-500/80 text-grey-200 hover:text-white transition-colors shrink-0"
                  aria-label={t("sidebar.close")}
                >
                  <svg
                    data-ds-icon="Menu"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="inline-block shrink-0"
                  >
                    <path
                      fill="currentColor"
                      d="M19 4H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1m.15 6H4.85a.85.85 0 0 0-.85.85v2.3c0 .47.38.85.85.85h14.3c.47 0 .85-.38.85-.85v-2.3a.85.85 0 0 0-.85-.85M19 16H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                    ></path>
                  </svg>
                </button>

                {/* Tabs */}
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    type="button"
                    className={`
                      relative ${
                        isOpen
                          ? "flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 h-9"
                          : "w-11 h-11 flex items-center justify-center rounded-md"
                      }
                      text-base font-semibold
                      transition-all overflow-hidden
                      text-white
                    `}
                    onMouseEnter={() => setHoveredTab("casino")}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    {/* 底图 - 根据状态和 hover 显示 */}
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        activeTab === "casino" ? "opacity-100" : "opacity-0"
                      }`}
                      src="/sidebar-icons/active-sports.svg"
                      sizes="(max-width: 768px) 50vw, 100px"
                    />
                    {/* Active Sports - hover 效果（非激活时 hover 显示） */}
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        hoveredTab === "casino" || activeTab == "casino"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/active-casino.svg"
                      sizes="(max-width: 768px) 50vw, 100px"
                    />
                    {/* Default Casino - 非激活且未 hover */}
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        activeTab !== "casino" && hoveredTab !== "casino"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/default-casino.svg"
                      sizes="(max-width: 768px) 50vw, 100px"
                    />

                    {isOpen ? (
                      <span className="relative z-10 truncate">
                        {t("sidebar.casino")}
                      </span>
                    ) : (
                      <span className="sr-only">{t("sidebar.casino")}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`
                      relative ${
                        isOpen
                          ? "flex-1 inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 h-9"
                          : "w-11 h-11 flex items-center justify-center rounded-md"
                      }
                      text-base font-bold
                      transition-all overflow-hidden
                      text-white
                    `}
                    onMouseEnter={() => setHoveredTab("sports")}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    {/* 底图 - 根据状态和 hover 显示 */}
                    {/* Active Casino - hover 效果（非激活时 hover 显示） */}
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        hoveredTab === "sports" || activeTab == "sports"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/active-sports.svg"
                      sizes="(max-width: 768px) 50vw, 100px"
                    />
                    {/* Active Sports - 激活状态（无论是否 hover） */}
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        activeTab === "sports" ? "opacity-100" : "opacity-0"
                      }`}
                      src="/sidebar-icons/active-casino.svg"
                      sizes="(max-width: 768px) 50vw, 100px"
                    />

                    {/* Default Sports - 非激活且未 hover */}
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        activeTab !== "sports" && hoveredTab !== "sports"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/default-sports.svg"
                      sizes="(max-width: 768px) 50vw, 100px"
                    />
                    {isOpen ? (
                      <span className="relative z-10 truncate">
                        {t("sidebar.sports")}
                      </span>
                    ) : (
                      <span className="sr-only">{t("sidebar.sports")}</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 px-2 py-2 border-b border-grey-500/40 bg-grey-700/95">
                {/* Menu Toggle Button - 折叠状态下居中 */}
                <button
                  onClick={toggle}
                  className="w-11 h-11 flex items-center justify-center rounded-md hover:bg-grey-500/80 text-grey-200 hover:text-white transition-colors shrink-0"
                  aria-label={t("sidebar.open")}
                >
                  <svg
                    data-ds-icon="Menu"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="inline-block shrink-0"
                  >
                    <path
                      fill="currentColor"
                      d="M19 4H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1m.15 6H4.85a.85.85 0 0 0-.85.85v2.3c0 .47.38.85.85.85h14.3c.47 0 .85-.38.85-.85v-2.3a.85.85 0 0 0-.85-.85M19 16H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
                    ></path>
                  </svg>
                </button>

                {/* Tabs - 折叠状态下垂直排列，使用 mini 版本图片 */}
                <div className={`flex flex-col items-center gap-2 w-full mt-2 text-grey-200 hover:text-white ${activeTab === "casino" ? "text-white" : ""}`}>
                  <button
                    type="button"
                    className={`
                      relative w-11 h-11 flex items-center justify-center rounded-md
                      transition-all overflow-hidden
                    `}
                    onMouseEnter={() => setHoveredTab("casino")}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        hoveredTab === "casino" || activeTab === "casino"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/active-casino-mini.svg"
                      sizes="44px"
                    />
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        activeTab !== "casino" && hoveredTab !== "casino"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/default-casino-mini.svg"
                      sizes="44px"
                    />
                    <div className="relative z-10 w-full h-full  flex items-center justify-center">
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
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`
                      relative w-11 h-11 flex items-center justify-center rounded-md text-grey-200 hover:text-white
                      transition-all overflow-hidden
                      ${activeTab === "sports" ? "text-white" : ""}
                    `}
                    onMouseEnter={() => setHoveredTab("sports")}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    {/* 底图 - 根据状态和 hover 显示，使用 mini 版本 */}
                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        hoveredTab === "sports" || activeTab === "sports"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/active-sports-mini.svg"
                      sizes="44px"
                    />

                    <Image
                      alt="Product Img"
                      fill
                      className={`object-cover transition-opacity ${
                        activeTab !== "sports" && hoveredTab !== "sports"
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      src="/sidebar-icons/default-sports-mini.svg"
                      sizes="44px"
                    />
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <svg
                        data-ds-icon="Basketball"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        className="inline-block shrink-0 "
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
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation + content (scrollable) */}
          <nav
            className={`overflow-y-auto transition-all duration-300 ${
              navVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            } 
             ${isOpen ? "p-4" : "px-2"}
              
            `}
          >
            <div className={`${isOpen ? "rounded-md bg-grey-600" : ""} `}>
              {/* 主导航 */}
              <ul className="space-y-1">
                {navItems.map((item) => renderNavItem(item))}
              </ul>

              {/* 分割线 */}
              {isOpen && (
                <div
                  className={`py-2.5 px-2 transition-opacity duration-300 ${
                    contentVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <hr className="border-grey-400" />
                </div>
              )}

              {/* 底部业务入口（赞助活动、负责博彩、在线支持） */}
              <ul className="space-y-1">
                {bottomItems.map((item) => renderNavItem(item))}
              </ul>

              {/* 语言切换 — 按设计稿放在同一卡片内，而不是固定在侧边栏最底部 */}
              <div className="mt-2">
                <div ref={languageMenuRef} className="relative">
                  <button
                    onClick={() => {
                      if (!isOpen) {
                        // 如果侧边栏折叠，先展开侧边栏，并标记需要在展开后打开语言菜单
                        setPendingLanguageMenuOpen(true);
                        open();
                      } else {
                        // 如果侧边栏已展开，直接切换语言菜单
                        setLanguageMenuOpen(!languageMenuOpen);
                      }
                    }}
                    className={`group
                    ${
                      isOpen
                        ? "w-full justify-between px-4 py-3"
                        : "w-11 h-11 justify-center p-1"
                    }
                    flex items-center gap-2 rounded-md
                    text-base font-semibold
                    bg-transparent text-white hover:text-white hover:bg-grey-400
                    transition-colors
                  `}
                  >
                    <GlobeAltIcon
                      className={`w-5 h-5 shrink-0 text-grey-200 group-hover:text-white transition-all duration-300 ${
                        isOpen
                          ? contentVisible
                            ? "opacity-100"
                            : "opacity-0"
                          : "opacity-100"
                      }`}
                    />
                    {isOpen ? (
                      <>
                        <span
                          className={`flex-1 text-base font-semibold text-left transition-opacity duration-300 ${
                            contentVisible ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {t("sidebar.language")}:{" "}
                          {locale === "zh" ? "中文" : "English"}
                        </span>
                        {contentVisible && (
                          <div
                            className={`shrink-0 flex w-4 h-4 -my-1 rounded-full items-center justify-center transition-transform duration-200 ${
                              languageMenuOpen ? "rotate-180" : "rotate-0"
                            }`}
                          >
                            <ChevronDownIcon className="w-5 h-5 shrink-0" />
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="sr-only">{t("sidebar.language")}</span>
                    )}
                  </button>

                  {/* Language Accordion Content */}
                  {isOpen && languageMenuOpen && (
                    <div
                      className={`ml-6 transition-opacity duration-300 ${
                        contentVisible ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="space-y-0">
                        {languages.map((lang) => {
                          const isSelected = locale === lang.code;
                          return (
                            <label
                              key={lang.code}
                              onClick={() => handleSelectLocale(lang.code)}
                              className={`
                                w-full inline-flex relative items-center justify-between px-4 py-3
                                text-base font-semibold
                                bg-transparent text-white hover:text-white hover:bg-grey-400
                                transition-colors rounded-none cursor-pointer
                              `}
                            >
                              <input
                                type="radio"
                                id={lang.code}
                                value={lang.code}
                                checked={isSelected}
                                onChange={() => handleSelectLocale(lang.code)}
                                className="sr-only"
                                tabIndex={-1}
                              />
                              <span className="flex-1 text-left">
                                {lang.label}
                              </span>
                              <span
                                className={`shrink-0 flex items-center justify-center w-6 h-6 relative border-2 border-grey-400 rounded-full ${
                                  isSelected ? "bg-grey-400" : ""
                                }`}
                              >
                                <svg
                                  data-ds-icon="RadioChecked"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  className={`inline-block shrink-0 text-white transition-all duration-150 ease-out ${
                                    isSelected
                                      ? "opacity-100 scale-100"
                                      : "opacity-0 scale-0"
                                  }`}
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="6"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Toggle button for mobile (when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden"
          aria-label={t("sidebar.open")}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
