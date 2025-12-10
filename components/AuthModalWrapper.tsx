"use client";

import dynamic from "next/dynamic";
import HeroUIWrapper from "./HeroUIWrapper";

const AuthModal = dynamic(() => import("@/components/AuthModal"), {
  ssr: false,
});

export default function AuthModalWrapper() {
  return (
    <HeroUIWrapper>
      <AuthModal />
    </HeroUIWrapper>
  );
}

