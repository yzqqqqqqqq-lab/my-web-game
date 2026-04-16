import BetbySportsClient from "@/components/betby/BetbySportsClient";
import { getBetbyBasePath } from "@/lib/betby";
import type { BetbyConfig, BetbyWidgetProps } from "betby-sdk";

type CurrencyMode = NonNullable<BetbyWidgetProps["currencyMode"]>;
type ThemeName = BetbyWidgetProps["theme"];

function resolveCurrencyMode(value?: string): CurrencyMode {
  return value?.toLowerCase() === "gc" ? "gc" : "sc";
}

function resolveTheme(value?: string): ThemeName {
  return value ? (value as ThemeName) : undefined;
}

function buildBetbyConfig(): BetbyConfig {
  return {
    apiBaseUrl: process.env.BETBY_API_BASE_URL,
    storageKeyPrefix: process.env.BETBY_STORAGE_KEY_PREFIX,
    analyticsEndpoint: process.env.BETBY_ANALYTICS_ENDPOINT,
    analyticsProductId: process.env.BETBY_ANALYTICS_PRODUCT_ID,
    btRendererScriptUrl: process.env.BETBY_BT_RENDERER_SCRIPT_URL,
    btRendererScriptUrlUS: process.env.BETBY_BT_RENDERER_SCRIPT_URL_US,
  };
}

export default async function SportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="w-full px-3 py-4 md:px-4 md:py-5 lg:px-6">
      <BetbySportsClient
        locale={locale}
        basename={getBetbyBasePath(locale)}
        config={buildBetbyConfig()}
        currencyMode={resolveCurrencyMode(process.env.BETBY_CURRENCY_MODE)}
        hideTopBar
        theme={resolveTheme(process.env.BETBY_THEME)}
      />
    </div>
  );
}
