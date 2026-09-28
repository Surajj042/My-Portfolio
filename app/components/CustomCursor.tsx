"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";

/**
 * Decorative cursor glow.
 *
 * Implemented with motion values rather than state: the previous version called
 * `setPosition` inside `mousemove`, so every single mouse move re-rendered the
 * whole `App` subtree — all seven sections — 60+ times a second. Writing to
 * motion values keeps this on the compositor and out of React's render path.
 */
export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-80);
  const y = useMotionValue(-80);

  useEffect(() => {
    // Only run where a real pointing device exists. On touch devices this used
    // to park an 80px blurred blob in the top-left corner permanently.
    const fine = window.matchMedia("(pointer: fine)");
    const touch = window.matchMedia("(hover: none)");

    const sync = () => setEnabled(fine.matches && !touch.matches);
    sync();
    fine.addEventListener("change", sync);
    touch.addEventListener("change", sync);

    const onMove = (e: PointerEvent) => {
      // Offset by half the 80px blob so it tracks the pointer centre.
      x.set(e.clientX - 40);
      y.set(e.clientY - 40);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      fine.removeEventListener("change", sync);
      touch.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onMove);
    };
  }, [x, y]);

  if (reduceMotion || !enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{ x, y }}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 blur-3xl opacity-80" />
    </motion.div>
  );
}
