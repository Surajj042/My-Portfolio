import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion presets.
 *
 * These used to live in `data/site.js`, which is a data module — a misfit, and
 * one that also imported react-icons into the same file the Server Components
 * (layout, robots, sitemap) pull `SITE_URL` from.
 */
export const glowVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    filter: "drop-shadow(0 0 0 rgba(0,0,0,0))",
  },
  hover: {
    scale: 1.2,
    y: -3,
    filter:
      "drop-shadow(0 0 8px rgba(13,18,204,0.9)) drop-shadow(0 0 18px rgba(16,185,129,0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.95, y: 0, transition: { duration: 0.08 } },
};
