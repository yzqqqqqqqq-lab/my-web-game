"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Bars3Icon,
  GiftIcon,
  UserGroupIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  TrophyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
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

export default function Sidebar() {
  const { isOpen, toggle, toggleExpanded, isExpanded, open } =
    useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"casino" | "sports">("casino");
  const [contentVisible, setContentVisible] = useState(isOpen);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [pendingExpandItem, setPendingExpandItem] = useState<string | null>(
    null
  );
  const sidebarRef = useRef<HTMLElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

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
    }, 0);

    const handleTransitionEnd = (e: TransitionEvent) => {
      // 只处理宽度和transform的过渡完成
      if (e.propertyName === "width" || e.propertyName === "transform") {
        // 动画完成后，根据 isOpen 状态显示/隐藏内容
        if (isOpen) {
          setContentVisible(true);
          // 如果有待展开的菜单项，在内容可见后打开它
          if (pendingExpandItem) {
            setTimeout(() => {
              toggleExpanded(pendingExpandItem);
              setPendingExpandItem(null);
            }, 100); // 等待内容淡入
          }
        } else {
          setContentVisible(false);
        }
      }
    };

    sidebar.addEventListener("transitionend", handleTransitionEnd);

    // Fallback: 如果 transitionend 没有触发，350ms 后根据 isOpen 状态显示内容
    transitionTimeoutRef.current = setTimeout(() => {
      setContentVisible(isOpen);
      // 如果有待展开的菜单项，在内容可见后打开它
      if (isOpen && pendingExpandItem) {
        setTimeout(() => {
          toggleExpanded(pendingExpandItem);
          setPendingExpandItem(null);
        }, 100); // 等待内容淡入
      }
    }, 350); // 稍微长于动画时间（300ms）

    return () => {
      clearTimeout(hideTimer);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      sidebar.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [isOpen, mounted, pendingExpandItem, toggleExpanded]);

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
      href: "#",
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

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const expanded = hasChildren ? isExpanded(item.id) : false;

    if (hasChildren) {
      return (
        <li key={item.id}>
          <button
            onClick={() => {
              if (!isOpen) {
                // 如果侧边栏折叠，先展开它，并标记待展开的菜单项
                open();
                setPendingExpandItem(item.id);
              } else {
                // 如果侧边栏已展开，直接切换二级菜单
                toggleExpanded(item.id);
              }
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors duration-200
              text-gray-700 hover:bg-gray-100
              ${level > 0 ? "pl-8" : ""}
            `}
          >
            <Icon
              className={`w-5 h-5 shrink-0 transition-opacity duration-300 ${
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
                  className={`flex-1 text-sm font-medium text-left transition-opacity duration-300 ${
                    contentVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
                <div
                  className={`transition-opacity duration-300 ${
                    contentVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {expanded ? (
                    <ChevronUpIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 shrink-0" />
                  )}
                </div>
              </>
            ) : (
              <span className="sr-only">{item.label}</span>
            )}
          </button>
          {isOpen && expanded && hasChildren && (
            <ul
              className={`mt-1 space-y-1 transition-opacity duration-300 ${
                contentVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {item.children!.map((child) => renderNavItem(child, level + 1))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.id}>
        {item.href && item.href !== "#" ? (
          <Link
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors duration-200
              ${level > 0 ? "pl-8" : ""}
              ${
                active
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
            onClick={() => {
              if (window.innerWidth < 1024) {
                toggle();
              }
            }}
          >
            <Icon
              className={`w-5 h-5 shrink-0 transition-opacity duration-300 ${
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
                  className={`flex-1 text-sm font-medium transition-opacity duration-300 ${
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
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors duration-200
              ${level > 0 ? "pl-8" : ""}
              text-gray-700 hover:bg-gray-100
            `}
            onClick={() => {
              console.log(`Navigate to ${item.id}`);
            }}
          >
            <Icon
              className={`w-5 h-5 shrink-0 transition-opacity duration-300 ${
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
                  className={`flex-1 text-sm font-medium text-left transition-opacity duration-300 ${
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
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200
          z-50 transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full lg:translate-x-0 lg:w-20"
          }
          overflow-hidden
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with Tabs */}
          <div className="shrink-0">
            {/* Logo and Toggle */}
            <div
              className={`flex items-center ${
                isOpen ? "justify-between" : "justify-center"
              } p-4 border-b border-gray-200 h-16`}
            >
              {isOpen ? (
                <>
                  <h2
                    className={`text-xl font-bold text-gray-900 truncate flex-1 min-w-0 mr-2 transition-opacity duration-300 ${
                      contentVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {t("common.siteName")}
                  </h2>
                </>
              ) : null}
              <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors shrink-0"
                aria-label={isOpen ? t("sidebar.close") : t("sidebar.open")}
              >
                {isOpen ? (
                  // <XMarkIcon className="w-5 h-5" />
                  <Bars3Icon className="w-5 h-5" />
                ) : (
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Tabs */}
            {isOpen && (
              <div
                className={`flex border-b border-gray-200 transition-opacity duration-300 ${
                  contentVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <button
                  onClick={() => setActiveTab("casino")}
                  className={`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors
                    ${
                      activeTab === "casino"
                        ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {t("sidebar.casino")}
                </button>
                <button
                  onClick={() => setActiveTab("sports")}
                  className={`
                    flex-1 px-4 py-3 text-sm font-medium transition-colors
                    ${
                      activeTab === "sports"
                        ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {t("sidebar.sports")}
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => renderNavItem(item))}
            </ul>

            {/* Separator */}
            {isOpen && (
              <div
                className={`my-4 border-t border-gray-200 transition-opacity duration-300 ${
                  contentVisible ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            {/* Bottom Items */}
            <ul className="space-y-1 px-2">
              {bottomItems.map((item) => renderNavItem(item))}
            </ul>
          </nav>

          {/* Footer with Language Selector */}
          <div className="shrink-0 border-t border-gray-200 p-4 relative">
            <div ref={languageMenuRef} className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <GlobeAltIcon
                  className={`w-5 h-5 shrink-0 transition-opacity duration-300 ${
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
                      className={`flex-1 text-sm font-medium text-left transition-opacity duration-300 ${
                        contentVisible ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {t("sidebar.language")}:{" "}
                      {locale === "zh" ? "中文" : "English"}
                    </span>
                    {contentVisible && (
                      <ChevronDownIcon
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          languageMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </>
                ) : (
                  <span className="sr-only">{t("sidebar.language")}</span>
                )}
              </button>

              {/* Language Dropdown Menu */}
              {languageMenuOpen && (
                <div
                  className={`
                  absolute ${
                    isOpen
                      ? "bottom-full left-0 right-0 mb-2"
                      : "bottom-full left-0 mb-2 w-48"
                  }
                  bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50
                `}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLocale(lang.code)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                        transition-colors duration-200
                        ${
                          locale === lang.code
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <span>{lang.label}</span>
                      {locale === lang.code && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
