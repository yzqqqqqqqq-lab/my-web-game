"use client";

import dynamic from "next/dynamic";
import { FooterSkeleton } from "@/components/LayoutSkeletons";

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <FooterSkeleton />,
});

export default function FooterWrapper() {
  return <Footer />;
}

