"use client";

import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("@/components/AuthModal"), {
  ssr: false,
});

export default function AuthModalWrapper() {
  return <AuthModal />;
}

