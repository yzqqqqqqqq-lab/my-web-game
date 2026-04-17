const BETBY_DEFAULT_STORAGE_KEY_PREFIX = "winburst";
const BETBY_AUTH_STORAGE_SUFFIX = "auth-storage";
const BETBY_NAV_STORAGE_SUFFIX = "nav-storage";
const BETBY_ADMIN_TOKEN_STORAGE_KEY = "Admin-Token";

function getBetbyAuthStorageKey(storageKeyPrefix?: string) {
  return `${storageKeyPrefix || BETBY_DEFAULT_STORAGE_KEY_PREFIX}-${BETBY_AUTH_STORAGE_SUFFIX}`;
}

function getBetbyNavStorageKey(storageKeyPrefix?: string) {
  return `${storageKeyPrefix || BETBY_DEFAULT_STORAGE_KEY_PREFIX}-${BETBY_NAV_STORAGE_SUFFIX}`;
}

export function clearBetbyPersistedBootstrapState(
  storageKeyPrefix?: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(getBetbyAuthStorageKey(storageKeyPrefix));
    window.localStorage.removeItem(getBetbyNavStorageKey(storageKeyPrefix));
    window.localStorage.removeItem(BETBY_ADMIN_TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error("[betby-sdk] failed to clear persisted bootstrap state", {
      error,
      storageKeyPrefix,
    });
  }
}
