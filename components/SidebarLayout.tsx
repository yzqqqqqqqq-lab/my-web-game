'use client';

import { useSidebarStore } from '@/stores/useSidebarStore';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isOpen } = useSidebarStore();

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

