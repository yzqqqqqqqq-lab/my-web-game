import { defineRouting } from "next-intl/routing";

export const locales = ["zh", "en"] as const;

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "as-needed",
});
