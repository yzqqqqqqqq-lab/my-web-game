'use client';

import { useSidebarStore } from '@/stores/useSidebarStore';
import { useEffect } from 'react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isOpen } = useSidebarStore();

  // 设置 CSS 变量来存储侧边栏宽度，用于容器宽度计算
  useEffect(() => {
    const root = document.documentElement;
    const updateSidebarWidth = () => {
      const width = window.innerWidth;
      
      if (width >= 1200) {
        // PC端 (>1200px): 展开时 260px，折叠时 60px (占据实际空间)
        root.style.setProperty('--sidebar-width', isOpen ? '260px' : '60px');
      } else if (width >= 768) {
        // 平板端 (768px-1200px): 始终 60px (展开时悬浮覆盖，不占据额外空间)
        root.style.setProperty('--sidebar-width', '60px');
      } else {
        // 移动端 (<768px): 0px (Drawer模式，不占据空间)
        root.style.setProperty('--sidebar-width', '0px');
      }
    };

    updateSidebarWidth();
    window.addEventListener('resize', updateSidebarWidth);
    return () => window.removeEventListener('resize', updateSidebarWidth);
  }, [isOpen]);

  return (
    <div
      className={`flex flex-col flex-1 min-h-screen md:min-h-screen transition-all duration-300`}
    >
      {children}
    </div>
  );
}

