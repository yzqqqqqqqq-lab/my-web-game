"use client";

import dynamic from "next/dynamic";
import { HeaderSkeleton } from "@/components/LayoutSkeletons";

const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
  loading: () => <HeaderSkeleton />,
});

export default function HeaderWrapper() {
  return <Header />;
}

