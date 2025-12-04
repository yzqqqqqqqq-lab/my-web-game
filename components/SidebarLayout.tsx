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
    if (window.innerWidth >= 1024) { // lg breakpoint
      root.style.setProperty('--sidebar-width', isOpen ? '256px' : '80px');
    } else {
      root.style.setProperty('--sidebar-width', '0px');
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        root.style.setProperty('--sidebar-width', isOpen ? '256px' : '80px');
      } else {
        root.style.setProperty('--sidebar-width', '0px');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div
      className={`flex flex-col flex-1 transition-all duration-300 ${
        isOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}
    >
      {children}
    </div>
  );
}

