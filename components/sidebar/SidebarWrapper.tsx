"use client";

import dynamic from "next/dynamic";
import { SidebarSkeleton } from "@/components/LayoutSkeletons";

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), {
  ssr: false,
  loading: () => <SidebarSkeleton />,
});

export default function SidebarWrapper() {
  return (
    <div 
      className="hidden md:block shrink-0 transition-all duration-300 ease-in-out"
      style={{ width: 'var(--sidebar-width, 60px)' }}
    >
      <Sidebar />
    </div>
  );
}
