"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BetbySportShell from "@/components/betby/BetbySportShell";
import type { BetbyConfig, BetbyWidgetProps } from "betby-sdk";
import { clearBetbyPersistedBootstrapState } from "@/lib/betbyAuthSync";
import {
  clearBetbySessionTicketState,
  fetchBetbySessionTicketOnClient,
  readBetbySessionTicketState,
} from "@/lib/betbySessionTicketClient";

type CurrencyMode = NonNullable<BetbyWidgetProps["currencyMode"]>;
type ThemeName = BetbyWidgetProps["theme"];

interface BetbySportsClientProps {
  locale: string;
  basename: string;
  config: BetbyConfig;
  currencyMode: CurrencyMode;
  hideTopBar: boolean;
  theme?: ThemeName;
}

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function isReloadNavigation() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigationEntries = window.performance.getEntriesByType("navigation");
  const navigationEntry = navigationEntries[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (navigationEntry?.type) {
    return navigationEntry.type === "reload";
  }

  const legacyPerformance = window.performance as Performance & {
    navigation?: { type?: number };
  };

  return legacyPerformance.navigation?.type === 1;
}

export default function BetbySportsClient({
  locale,
  basename,
  config,
  currencyMode,
  hideTopBar,
  theme,
}: BetbySportsClientProps) {
  const pathname = usePathname();
  const normalizedPathname = normalizePathname(pathname);
  const [ticketState, setTicketState] = useState({
    isReady: false,
    sessionTicket: "",
    sessionTicketError: "",
  });

  useEffect(() => {
    let cancelled = false;

    const frameId = window.requestAnimationFrame(() => {
      void (async () => {
        try {
          clearBetbyPersistedBootstrapState(config.storageKeyPrefix);

          const cachedState = readBetbySessionTicketState();
          const storedState = cachedState?.sessionTicket
            ? cachedState
            : isReloadNavigation()
              ? {
                  error: "",
                  sessionTicket: await fetchBetbySessionTicketOnClient(),
                  updatedAt: Date.now(),
                }
              : cachedState;

          if (cancelled) {
            return;
          }

          setTicketState({
            isReady: true,
            sessionTicket: storedState?.sessionTicket ?? "",
            sessionTicketError: storedState?.error ?? "",
          });

          if (storedState?.sessionTicket) {
            clearBetbySessionTicketState({ preserveInMemory: true });
          }
        } catch (error) {
          if (cancelled) {
            return;
          }

          const message =
            error instanceof Error
              ? error.message
              : "Unknown sessionTicket error";

          setTicketState({
            isReady: true,
            sessionTicket: "",
            sessionTicketError: message,
          });

          clearBetbySessionTicketState();
        }
      })();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [config.storageKeyPrefix]);

  if (!ticketState.isReady) {
    return (
      <section className="mx-auto w-full max-w-[1280px] rounded-[20px] border border-grey-500/45 bg-grey-700 p-6 text-sm text-grey-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        正在准备体育入口凭证...
      </section>
    );
  }

  if (!ticketState.sessionTicket) {
    return (
      <section className="mx-auto w-full max-w-[1280px] rounded-[20px] border border-red-300/30 bg-grey-700 p-6 text-sm text-grey-200">
        <div className="mb-2 text-base font-semibold text-white">
          sessionTicket 不可用
        </div>
        <div className="break-words text-grey-200">
          {ticketState.sessionTicketError ||
            `当前路径 ${normalizedPathname} 未检测到客户端预取的 sessionTicket，请点击体育入口按钮进入。`}
        </div>
        <div className="mt-4 text-grey-300">
          当前页面不会再在挂载时自动申请：
          <code className="ml-1 rounded bg-grey-800 px-2 py-1 text-xs">
            /bus-api/business/oauth/create/sessionTicket
          </code>
        </div>
      </section>
    );
  }

  console.log("sessionTicket", ticketState.sessionTicket);

  return (
    <BetbySportShell
      locale={locale}
      sessionTicket={ticketState.sessionTicket}
      basename={basename}
      config={config}
      currencyMode={currencyMode}
      hideTopBar={hideTopBar}
      theme={theme}
    />
  );
}
