/**
 * Small, fail-safe wrapper around localStorage.
 * Storage may be unavailable (private mode, blocked cookies,
 * playable-ad sandboxes), so every access is guarded.
 */
const PREFIX = "save-the-king:";

export function loadNumber(
  key: string,
  fallback = 0,
): number {
  try {
    const raw = localStorage.getItem(PREFIX + key);

    if (raw === null) {
      return fallback;
    }

    const value = Number(raw);

    return Number.isFinite(value) && value >= 0
      ? Math.floor(value)
      : fallback;
  } catch {
    return fallback;
  }
}

export function saveNumber(
  key: string,
  value: number,
): void {
  try {
    localStorage.setItem(PREFIX + key, String(value));
  } catch {
    // Storage unavailable — progress simply won't persist.
  }
}

export function assetPath(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
