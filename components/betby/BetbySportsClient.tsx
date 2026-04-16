"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BetbySportShell from "@/components/betby/BetbySportShell";
import {
  defaultMockSessionTicketRequest,
  extractSessionTicketFromResponse,
  mockSessionTicketRequestHeaders,
  type MockSessionTicketResponse,
} from "@/lib/mockBetbySession";
import type { BetbyConfig, BetbyWidgetProps } from "betby-sdk";

type CurrencyMode = NonNullable<BetbyWidgetProps["currencyMode"]>;
type ThemeName = BetbyWidgetProps["theme"];

interface SessionTicketProxyError {
  code?: number;
  message?: string;
  error?: string;
  upstreamUrl?: string;
}

interface BetbySportsClientProps {
  locale: string;
  basename: string;
  config: BetbyConfig;
  currencyMode: CurrencyMode;
  hideTopBar: boolean;
  theme?: ThemeName;
}

let inflightSessionTicketPromise: Promise<string> | null = null;

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

async function requestSessionTicket() {
  if (inflightSessionTicketPromise) {
    return inflightSessionTicketPromise;
  }

  inflightSessionTicketPromise = fetch(
    "/bus-api/business/oauth/create/sessionTicket",
    {
      method: "POST",
      headers: mockSessionTicketRequestHeaders,
      body: JSON.stringify(defaultMockSessionTicketRequest),
      cache: "no-store",
    },
  )
    .then(async (response) => {
      if (!response.ok) {
        let details = `Failed to fetch sessionTicket: ${response.status}`;

        try {
          const errorPayload = (await response.json()) as SessionTicketProxyError;
          const parts = [
            errorPayload.message,
            errorPayload.error,
            errorPayload.upstreamUrl
              ? `upstream=${errorPayload.upstreamUrl}`
              : "",
          ].filter(Boolean);

          if (parts.length > 0) {
            details = parts.join(" | ");
          }
        } catch {
          const fallbackText = await response.text();
          if (fallbackText) {
            details = `${details} | ${fallbackText}`;
          }
        }

        throw new Error(details);
      }

      const data = (await response.json()) as MockSessionTicketResponse;
      return extractSessionTicketFromResponse(data);
    })
    .finally(() => {
      inflightSessionTicketPromise = null;
    });

  return inflightSessionTicketPromise;
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
  const normalizedBasename = normalizePathname(basename);
  const [sessionTicket, setSessionTicket] = useState("");
  const [sessionTicketError, setSessionTicketError] = useState("");
  const entryOnlyError =
    !sessionTicket && normalizedPathname !== normalizedBasename
      ? `当前路径 ${normalizedPathname} 没有可复用的 sessionTicket，请先从 ${normalizedBasename} 入口进入。`
      : "";

  useEffect(() => {
    let cancelled = false;

    if (normalizedPathname !== normalizedBasename) {
      return () => {
        cancelled = true;
      };
    }

    void requestSessionTicket()
      .then((ticket) => {
        if (!cancelled) {
          setSessionTicket(ticket);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSessionTicketError(
            error instanceof Error
              ? error.message
              : "Unknown sessionTicket error",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedBasename, normalizedPathname]);

  if (!sessionTicket && !sessionTicketError) {
    return (
      <section className="mx-auto w-full max-w-[1280px] rounded-[20px] border border-grey-500/45 bg-grey-700 p-6 text-sm text-grey-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        正在获取 sessionTicket...
      </section>
    );
  }

  if (!sessionTicket) {
    return (
      <section className="mx-auto w-full max-w-[1280px] rounded-[20px] border border-red-300/30 bg-grey-700 p-6 text-sm text-grey-200">
        <div className="mb-2 text-base font-semibold text-white">
          sessionTicket 获取失败
        </div>
        <div className="break-words text-grey-200">
          {sessionTicketError || entryOnlyError || "未拿到 sessionTicket"}
        </div>
        <div className="mt-4 text-grey-300">
          当前页面已改为客户端首次挂载后请求：
          <code className="ml-1 rounded bg-grey-800 px-2 py-1 text-xs">
            /bus-api/business/oauth/create/sessionTicket
          </code>
        </div>
      </section>
    );
  }

  return (
    <BetbySportShell
      locale={locale}
      sessionTicket={sessionTicket}
      basename={basename}
      config={config}
      currencyMode={currencyMode}
      hideTopBar={hideTopBar}
      theme={theme}
    />
  );
}
