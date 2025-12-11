"use client";

import { useEffect } from "react";
import { useMobileSidebarStore } from "@/stores/useMobileSidebarStore";
import { usePathname } from "@/i18n/navigation";

interface MobileSidebarProps {
  children: React.ReactNode;
}

/**
 * 移动端侧边栏 Drawer 组件
 * 全屏展开，从左侧滑入，带遮罩层
 */
export default function MobileSidebar({ children }: MobileSidebarProps) {
  const { isOpen, close } = useMobileSidebarStore();
  const pathname = usePathname();

  // 路由变化时关闭侧边栏
  useEffect(() => {
    close();
  }, [pathname, close]);

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* 遮罩层 - 移除，因为 Drawer 占据了除了 Header/Footer 外的所有空间 */}
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[899] md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )} */}

      {/* Drawer 侧边栏 */}
      <div
        data-nosnippet=""
        data-layout=""
        data-testid="left-sidebar"
        className={`
          fixed top-[60px] bottom-16 left-0 w-full bg-grey-700 z-49 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          overflow-y-auto overflow-x-hidden
          border-t-0
        `}
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>
    </>
  );
}
