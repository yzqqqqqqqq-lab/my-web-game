"use client";

import dynamic from "next/dynamic";
import { useMobileSidebarStore } from "@/stores/useMobileSidebarStore";

const MobileSidebar = dynamic(() => import("@/components/sidebar/MobileSidebar"), {
  ssr: false,
});

const Sidebar = dynamic(() => import("@/components/sidebar/Sidebar"), {
  ssr: false,
});

export default function MobileSidebarWrapper() {
  const { isOpen } = useMobileSidebarStore();

  return (
    <MobileSidebar>
      <Sidebar 
        className="!w-full !relative !translate-x-0 !h-full !top-auto !left-auto border-none shadow-none" 
        forceExpanded={isOpen}
      />
    </MobileSidebar>
  );
}

