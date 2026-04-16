export const BETBY_CANONICAL_SEGMENT = "sports";

export function getBetbyBasePath(locale: string) {
  return `/${locale}/${BETBY_CANONICAL_SEGMENT}`;
}

export function joinBetbyPath(locale: string, betbyPath?: string[]) {
  const suffix = betbyPath?.length ? `/${betbyPath.join("/")}` : "";
  return `${getBetbyBasePath(locale)}${suffix}`;
}

export function isBetbyPathname(pathname: string) {
  return pathname.includes(`/${BETBY_CANONICAL_SEGMENT}`);
}
