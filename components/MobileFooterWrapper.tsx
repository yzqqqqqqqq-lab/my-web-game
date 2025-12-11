"use client";

import dynamic from "next/dynamic";

const MobileFooter = dynamic(() => import("@/components/footer/MobileFooter"), {
  ssr: false,
});

export default function MobileFooterWrapper() {
  return <MobileFooter />;
}

