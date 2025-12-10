"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/useAuthStore";
import { Link } from "@/i18n/navigation";
import { StakeLogo, StakeLogoMobile } from "@/lib/icons";
import {
  SearchIcon,
  PersonIcon,
  NotificationIcon,
  SidebarToggleIcon,
  BTCIcon,
  ChevronDownIcon,
  WalletIcon,
} from "@/lib/icons";
import { useSidebarStore } from "@/stores/useSidebarStore";
import Button from "@/components/ui/Button";
import dynamic from "next/dynamic";

const UserDropdown = dynamic(() => import("@/components/ui/UserDropdown"), {
  ssr: false,
});

export default function Header() {
  const { userInfo, isAuthenticated } = useAuthStore();
  const { toggle } = useSidebarStore();
  const t = useTranslations();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownTriggerRef = useRef<HTMLButtonElement | null>(null);

  // 模拟余额数据（实际应该从 store 或其他地方获取）
  const balance = "0.00000000";

  return (
    <header className="sticky top-0 z-50 bg-grey-600 border-b border-grey-400">
      <div className="w-full">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-15 px-4">
            {/* 左侧：Logo */}
            <div className="flex items-center pr-2 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                aria-label="Home"
                data-testid="home-button"
              >
                {/* Mobile Logo */}
                <div className="md:hidden">
                  <StakeLogoMobile className="h-8 text-white" />
                </div>
                {/* Desktop Logo */}
                <div className="hidden md:block">
                  <StakeLogo className="h-8 text-white" />
                </div>
              </Link>
            </div>

            {/* 中间：余额和钱包按钮（仅登录后显示） */}
            {isAuthenticated && (
              <div className="w-full flex justify-center">
                <div className="flex items-center rounded-md overflow-hidden" data-testid="balance-toggle">
                  {/* 余额显示 */}
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 bg-grey-700 text-white hover:bg-grey-900 hover:text-white transition-colors py-3 px-5 rounded-md rounded-r-none font-semibold text-base max-w-full"
                    aria-label="Open Dropdown"
                    data-testid="coin-toggle"
                  >
                    <div className="flex items-center gap-1 max-w-full truncate">
                      <span className="text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[16ch]">
                        {balance}
                      </span>
                      <BTCIcon />
                    </div>
                    <ChevronDownIcon className="w-5 h-5 text-grey-200" />
                  </button>

                  {/* 钱包按钮 */}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors py-3 px-[14px] rounded-md rounded-l-none font-semibold text-base shadow-md"
                    data-testid="wallet"
                    style={{ borderRadius: "0 var(--ds-radius-md) var(--ds-radius-md) 0" }}
                  >
                    <WalletIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* 右侧：操作按钮 */}
            <section className="flex items-center gap-0 ml-auto">
              {isAuthenticated && userInfo ? (
                <>
                  {/* 搜索按钮 - 桌面端显示 */}
                  <button
                    type="button"
                    className="hidden md:inline-flex items-center gap-2 bg-transparent text-white hover:text-white/80 transition-colors py-[0.75rem] px-[0.75rem] rounded-sm text-xs"
                    aria-label="Search"
                  >
                    <SearchIcon className="w-5 h-5" />
                  </button>

                  {/* 用户下拉 */}
                  <div className="relative">
                    <button
                      ref={userDropdownTriggerRef}
                      type="button"
                      className="inline-flex items-center justify-center bg-transparent text-white hover:text-white/80 transition-colors p-3 rounded-sm font-semibold text-xs"
                      aria-label="Open Dropdown"
                      aria-expanded={isUserDropdownOpen}
                      data-testid="user-dropdown-toggle"
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      <PersonIcon className="w-5 h-5" />
                    </button>
                    <UserDropdown
                      isOpen={isUserDropdownOpen}
                      onClose={() => setIsUserDropdownOpen(false)}
                      triggerRef={userDropdownTriggerRef}
                    />
                  </div>

                  {/* 通知按钮 */}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center bg-transparent text-white hover:text-white/80 transition-colors p-3 rounded-sm text-sm"
                    id="notifications-nav-button"
                    aria-label="Toggle Notifications Widget"
                  >
                    <NotificationIcon className="w-5 h-5" />
                  </button>

                  {/* 侧边栏切换按钮 - 桌面端显示 */}
                  <button
                    type="button"
                    className="hidden md:inline-flex items-center gap-2 bg-transparent text-white hover:text-white/80 transition-colors p-3 rounded-sm font-semibold text-sm"
                    aria-label="Toggle Sidebar"
                    onClick={toggle}
                  >
                    <SidebarToggleIcon className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    href="?modal=auth&tab=login"
                    variant="default"
                    size="md"
                    className="flex items-center gap-2"
                  >
                    <span>{t("common.login")}</span>
                  </Button>
                  <Button
                    href="?modal=auth&tab=register"
                    variant="primary"
                    size="md"
                    className="flex items-center gap-2"
                  >
                    <span>{t("common.register")}</span>
                  </Button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </header>
  );
}
