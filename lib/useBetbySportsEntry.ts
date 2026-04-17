"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { isBetbyPathname } from "@/lib/betby";
import { fetchBetbySessionTicketOnClient } from "@/lib/betbySessionTicketClient";

const SPORTS_ENTRY_PATH = "/sports";

export function useBetbySportsEntry() {
  const pathname = usePathname();
  const router = useRouter();

  const navigateToSports = useCallback(async () => {
    if (isBetbyPathname(pathname)) {
      if (pathname !== SPORTS_ENTRY_PATH) {
        router.push(SPORTS_ENTRY_PATH);
      }
      return;
    }

    try {
      await fetchBetbySessionTicketOnClient();
    } catch (error) {
      console.error("[betby-sdk] failed to prepare sports entry", error);
    }

    router.push(SPORTS_ENTRY_PATH);
  }, [pathname, router]);

  return {
    navigateToSports,
    sportsPath: SPORTS_ENTRY_PATH,
  };
}
