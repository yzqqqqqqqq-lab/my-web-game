"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  BrowseIcon,
  CasinoIcon,
  ListIcon,
  BasketballIcon,
  ChatIcon,
} from "@/lib/icons";
import { useMobileSidebarStore } from "@/stores/useMobileSidebarStore";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  analytics?: string;
}

export default function MobileFooter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toggle } = useMobileSidebarStore();

  // 检查是否打开了认证模态框
  const isAuthModalOpen = searchParams.get("modal") === "auth";

  const navItems: NavItem[] = [
    {
      id: "browse",
      label: "浏览",
      icon: BrowseIcon,
      onClick: toggle,
      analytics: "mobile-navbar-browser",
    },
    {
      id: "casino",
      label: "娱乐城",
      icon: CasinoIcon,
      href: "/casino/home",
      analytics: "mobile-navbar-casino-link",
    },
    {
      id: "bets",
      label: "投注",
      icon: ListIcon,
      href: "/my-bets",
      analytics: "mobile-navbar-betlist-board",
    },
    {
      id: "sports",
      label: "体育",
      icon: BasketballIcon,
      href: "/sports/home",
      analytics: "mobile-navbar-sports-link",
    },
    {
      id: "chat",
      label: "聊天室",
      icon: ChatIcon,
      onClick: () => {
        console.log("Open chat");
      },
      analytics: "mobile-navbar-chat",
    },
  ];

  const isActive = (item: NavItem) => {
    if (!item.href) return false;
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  // 如果认证模态框打开，则隐藏底部导航
  if (isAuthModalOpen) {
    return null;
  }

  return (
    <div
      id="mobile-footer"
      data-layout=""
      className="bg-grey-700 border-t border-grey-600 md:hidden"
      style={{ zIndex: 1300 }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          const buttonClasses = `
            inline-flex relative items-center justify-center gap-1
            flex-col min-w-0 flex-1
            bg-transparent text-grey-200 hover:text-white
            transition-colors
            py-2 px-1
            focus-visible:outline-2 focus-visible:outline-offset-2
            active:scale-[0.98]
            ${active ? "text-white" : ""}
          `;

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={buttonClasses}
                data-analytics={item.analytics}
              >
                <div className="flex items-center justify-center">
                  <Icon className="inline-block shrink-0" />
                </div>
                <span className="text-xs font-semibold truncate max-w-full">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className={buttonClasses}
              onClick={item.onClick}
              data-analytics={item.analytics}
              aria-label={item.label}
            >
              <div className="flex items-center justify-center">
                <Icon className="inline-block shrink-0" />
              </div>
              <span className="text-xs font-semibold truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

