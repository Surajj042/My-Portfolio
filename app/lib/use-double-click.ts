"use client";

import { useCallback, useRef } from "react";

/** How long a second click has to land to count as a double-click. */
const DOUBLE_CLICK_WINDOW_MS = 600;

/**
 * Calls `onDouble` when the element is clicked twice within
 * `DOUBLE_CLICK_WINDOW_MS`, and returns a click handler to spread onto an
 * anchor. A single click is left entirely alone, so the link's normal
 * navigation still happens.
 *
 * State is just the timestamp of the last click, so there is no timer to leak:
 * an abandoned first click simply ages out on its own.
 */
export function useDoubleClick(
  onDouble: () => void,
): (event: React.MouseEvent) => void {
  const lastClick = useRef(0);

  return useCallback(
    (event: React.MouseEvent) => {
      const now = Date.now();
      const isDouble = now - lastClick.current < DOUBLE_CLICK_WINDOW_MS;
      lastClick.current = isDouble ? 0 : now;

      if (isDouble) {
        // Suppress the second click's own navigation to the section, which
        // would otherwise race the route change.
        event.preventDefault();
        onDouble();
      }
    },
    [onDouble],
  );
}
