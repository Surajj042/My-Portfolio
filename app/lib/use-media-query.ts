import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query subscription.
 *
 * `getServerSnapshot` always returns `false`, so the server render and the first
 * client render agree and React has nothing to reconcile. The real value is
 * picked up on the first client snapshot.
 *
 * This replaces two near-identical private copies that lived inside
 * `sections/Projects.jsx` and `components/OverlayMenu.jsx`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Matches Tailwind's `lg` breakpoint, below which the overlay menu is used. */
export const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Devices with a precise pointer. Pointer-tracking effects (card tilt, the
 * spotlight) are gated on this so a finger drag never triggers them and
 * nothing is left half-applied after a touch.
 */
export const FINE_POINTER_QUERY = "(pointer: fine)";
