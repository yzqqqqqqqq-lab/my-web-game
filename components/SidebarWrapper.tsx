"use client";

import dynamic from "next/dynamic";
import { SidebarSkeleton } from "@/components/LayoutSkeletons";

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  ssr: false,
  loading: () => <SidebarSkeleton />,
});

export default function SidebarWrapper() {
  return <Sidebar />;
}

