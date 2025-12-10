'use client';

import { HeroUIProvider } from '@heroui/react';

export default function HeroUIWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
}

