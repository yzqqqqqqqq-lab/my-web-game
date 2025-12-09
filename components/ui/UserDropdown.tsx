"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: "wallet",
      label: "钱包",
      icon: WalletIcon,
      analytics: "global-userMenu-wallet-item",
    },
    {
      id: "vault",
      label: "保险库",
      icon: VaultIcon,
      testId: "user-dropdown-vault",
      analytics: "global-userMenu-vault-item",
    },
    {
      id: "vip",
      label: "VIP",
      icon: TrophyIcon,
      analytics: "global-userMenu-vip-item",
    },
    {
      id: "affiliate",
      label: "联盟计划",
      icon: UserGroupIcon,
      href: "/affiliate",
      analytics: "global-userMenu-affiliate-item",
    },
    {
      id: "statistics",
      label: "统计数据",
      icon: StatsIcon,
      analytics: "global-userMenu-statistics-item",
    },
    {
      id: "transactions",
      label: "交易记录",
      icon: ListIcon,
      href: "/transactions",
      analytics: "global-userMenu-transactions-item",
    },
    {
      id: "my-bets",
      label: "我的投注",
      icon: MyBetsIcon,
      href: "/my-bets",
      analytics: "global-userMenu-mybets-item",
    },
    {
      id: "settings",
      label: "设置",
      icon: SettingsIcon,
      href: "/settings",
      analytics: "global-userMenu-settings-item",
    },
    {
      id: "responsible-gambling",
      label: "Stake Smart",
      icon: ShieldCheckIcon,
      href: "/responsible-gambling",
      analytics: "global-userMenu-responsibleGambling-item",
    },
    {
      id: "support",
      label: "在线支持",
      icon: QuestionMarkCircleIcon,
      analytics: "global-userMenu-support-item",
      onClick: () => {
        // 这里可以集成在线支持功能
        console.log("打开在线支持");
      },
    },
    {
      id: "logout",
      label: "登出",
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
    <>
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
                  <h3 className="text-grey-200 font-semibold text-base">登出</h3>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex relative items-center gap-2 justify-center rounded-sm bg-transparent text-grey-200 hover:text-white transition-colors p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label="关闭"
                  data-testid="modal-close"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </ModalHeader>

              {/* Content */}
              <ModalBody className="bg-grey-600 p-6 pt-0 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  <p className="text-grey-200 text-base">
                    您确定要结束会话，然后登出吗？
                  </p>
                  <button
                    onClick={handleConfirmLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-[0.75rem] px-5 rounded-md transition-colors active:scale-[0.98] shadow-md"
                    data-testid="logout-link"
                  >
                    <span className="font-semibold">登出</span>
                  </button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

