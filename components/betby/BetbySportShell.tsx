"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BetbyProvider,
  BetbyWidget,
  type BetbyConfig,
  type BetbyWidgetProps,
} from "betby-sdk";

type CurrencyMode = NonNullable<BetbyWidgetProps["currencyMode"]>;
type ThemeName = BetbyWidgetProps["theme"];

interface BetbySportShellProps {
  locale: string;
  sessionTicket: string;
  basename: string;
  config: BetbyConfig;
  currencyMode: CurrencyMode;
  hideTopBar: boolean;
  theme?: ThemeName;
}

export default function BetbySportShell({
  locale,
  sessionTicket,
  basename,
  config,
  currencyMode,
  hideTopBar,
  theme,
}: BetbySportShellProps) {
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (typeof window === "undefined" || window.parent === window) {
        return;
      }

      window.parent.postMessage(
        {
          type: "LoggedOut",
          data: {
            action: "back",
          },
        },
        "*",
      );
    };
  }, []);

  const callbacks = useMemo(
    () => ({
      onBack: () => {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push(`/${locale}`);
      },
      onRecharge: () => {
        console.info("[betby-sdk] recharge requested");
      },
      onLogin: () => {
        console.info("[betby-sdk] login requested");
      },
      onTokenExpired: (message?: string, title?: string) => {
        console.info("[betby-sdk] token expired", { title, message });
      },
      onCurrencyChange: (nextCurrency: "sc" | "gc") => {
        console.info("[betby-sdk] currency changed", nextCurrency);
      },
      onGetWallet: () => {
        console.info("[betby-sdk] wallet refresh requested");
      },
      onUrlChange: (url: string) => {
        console.info("[betby-sdk] url changed", url);
      },
      // onNavigate: (url: string) => {
      //   const nextUrl = resolveNavigationUrl(url, locale);

      //   if (!nextUrl) {
      //     return;
      //   }

      //   if (/^https?:\/\//i.test(nextUrl)) {
      //     window.location.assign(nextUrl);
      //     return;
      //   }

      //   router.push(nextUrl);
      // },
    }),
    [locale, router],
  );

  return (
    <section className="betby-content-shell mx-auto w-full max-w-[1280px]">
      <div className="betby-content-surface relative isolate min-h-[calc(100vh-152px)] overflow-hidden rounded-[20px] border border-grey-500/45 bg-grey-700 shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
        <BetbyProvider config={config} {...callbacks}>
          <BetbyWidget
            sessionTicket={sessionTicket}
            currencyMode={currencyMode}
            hideTopBar={hideTopBar}
            theme={theme}
            basename={basename}
          />
        </BetbyProvider>
      </div>
    </section>
  );
}
