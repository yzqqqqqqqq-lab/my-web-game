"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/useAuthStore";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  WalletIcon,
  VaultIcon,
  TrophyIcon,
  UserGroupIcon,
  StatsIcon,
  ListIcon,
  MyBetsIcon,
  SettingsIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  LogoutIcon,
} from "@/lib/icons";
import HeroUIWrapper from "@/components/HeroUIWrapper";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  analytics?: string;
  testId?: string;
}

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function UserDropdown({
  isOpen,
  onClose,
  triggerRef,
}: UserDropdownProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const t = useTranslations();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "wallet",
      label: t("userDropdown.wallet"),
      icon: WalletIcon,
      analytics: "global-userMenu-wallet-item",
    },
    {
      id: "vault",
      label: t("userDropdown.vault"),
      icon: VaultIcon,
      testId: "user-dropdown-vault",
      analytics: "global-userMenu-vault-item",
    },
    {
      id: "vip",
      label: t("userDropdown.vip"),
      icon: TrophyIcon,
      analytics: "global-userMenu-vip-item",
    },
    {
      id: "affiliate",
      label: t("userDropdown.affiliate"),
      icon: UserGroupIcon,
      href: "#", // 未实现，改为占位符
      analytics: "global-userMenu-affiliate-item",
    },
    {
      id: "statistics",
      label: t("userDropdown.statistics"),
      icon: StatsIcon,
      analytics: "global-userMenu-statistics-item",
    },
    {
      id: "transactions",
      label: t("userDropdown.transactions"),
      icon: ListIcon,
      href: "#", // 未实现，改为占位符
      analytics: "global-userMenu-transactions-item",
    },
    {
      id: "my-bets",
      label: t("userDropdown.myBets"),
      icon: MyBetsIcon,
      href: "#", // 未实现，改为占位符
      analytics: "global-userMenu-mybets-item",
    },
    {
      id: "settings",
      label: t("userDropdown.settings"),
      icon: SettingsIcon,
      href: "#", // 未实现，改为占位符
      analytics: "global-userMenu-settings-item",
    },
    {
      id: "responsible-gambling",
      label: t("userDropdown.stakeSmart"),
      icon: ShieldCheckIcon,
      href: "#", // 未实现，改为占位符
      analytics: "global-userMenu-responsibleGambling-item",
    },
    {
      id: "support",
      label: t("userDropdown.support"),
      icon: QuestionMarkCircleIcon,
      analytics: "global-userMenu-support-item",
      onClick: () => {
        // 这里可以集成在线支持功能
        console.log("打开在线支持");
      },
    },
    {
      id: "logout",
      label: t("userDropdown.logout"),
      icon: LogoutIcon,
      analytics: "global-userMenu-logout-item",
      onClick: () => {
        setIsLogoutModalOpen(true);
        onClose();
      },
    },
  ];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // 计算下拉菜单位置
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownWidth = 140; // 固定宽度
      
      // 计算位置：下拉菜单与触发按钮居中对齐
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      let left = triggerCenterX - dropdownWidth / 2;
      const top = triggerRect.bottom + 8;

      // 确保不超出左边界
      if (left < 8) {
        left = 8;
      }

      // 确保不超出右边界f
      const viewportWidth = window.innerWidth;
      if (left + dropdownWidth > viewportWidth - 8) {
        left = viewportWidth - dropdownWidth - 8;
      }

      setPosition({ top, left });
    }
  }, [isOpen, triggerRef]);

  const handleConfirmLogout = () => {
    logout();
    router.push("/");
    setIsLogoutModalOpen(false);
  };

  return (
    <HeroUIWrapper>
      {/* 下拉菜单 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-50 bg-white rounded-md shadow-lg w-[140px] max-h-[calc(100vh-100px)] overflow-y-auto"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const baseClasses =
                "inline-flex items-center gap-2 w-full px-3 py-3 text-sm font-semibold text-grey-400 hover:bg-grey-200 hover:text-neutral-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-300 transition-colors rounded-none justify-start active:scale-[0.98]";

              if (item.href) {
                // 如果是 #，使用按钮而不是链接
                if (item.href === "#") {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={baseClasses}
                      onClick={onClose}
                      data-analytics={item.analytics}
                    >
                      <Icon className="w-5 h-5 shrink-0 text-grey-400 [&:hover]:text-grey-400" />
                      <span className="font-semibold">{item.label}</span>
                    </button>
                  );
                }
                
                // 正常路径使用Link
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={baseClasses}
                    data-analytics={item.analytics}
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5 shrink-0 text-grey-400 [&:hover]:text-grey-400" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  className={baseClasses}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }
                    if (item.id !== "logout") {
                      onClose();
                    }
                  }}
                  data-analytics={item.analytics}
                  data-testid={item.testId}
                >
                  <Icon className="w-5 h-5 shrink-0 text-grey-400 [&:hover]:text-grey-400" />
                  <span className="font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 登出确认弹窗 */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        size="md"
        classNames={{
          base: "rounded-md bg-grey-600 text-grey-200 min-w-[200px] max-w-[500px] max-h-[calc(100%-4em)]",
          backdrop: "bg-black/50",
          wrapper: "p-4 flex items-center justify-center",
        }}
        hideCloseButton
        isDismissable={true}
        isKeyboardDismissDisabled={false}
        placement="center"
      >
        <ModalContent className="bg-grey-600 text-grey-200 rounded-md overflow-hidden flex flex-col">
          {(onClose) => (
            <>
              {/* Header */}
              <ModalHeader className="p-4 flex items-center justify-between bg-grey-600 border-none">
                <div className="flex items-center gap-2">
                  <LogoutIcon className="w-5 h-5 text-grey-200" />
                  <h3 className="text-grey-200 font-semibold text-base">{t("userDropdown.logout")}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex relative items-center gap-2 justify-center rounded-sm bg-transparent text-grey-200 hover:text-white transition-colors p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label={t("common.close")}
                  data-testid="modal-close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </ModalHeader>

              {/* Content */}
              <ModalBody className="bg-grey-600 p-6 pt-0 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  <p className="text-grey-200 text-base">
                    {t("userDropdown.logoutConfirm")}
                  </p>
                  <button
                    onClick={handleConfirmLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-[0.75rem] px-5 rounded-md transition-colors active:scale-[0.98] shadow-md"
                    data-testid="logout-link"
                  >
                    <span className="font-semibold">{t("userDropdown.logoutButton")}</span>
                  </button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </HeroUIWrapper>
  );
}

