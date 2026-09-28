"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { navLinks } from "../data/site.config";
import { resolveNavHref } from "../lib/nav";
import { DESKTOP_QUERY, useMediaQuery } from "../lib/use-media-query";
import { useDoubleClick } from "../lib/use-double-click";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function OverlayMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Same SSR-safe hook the rest of the app uses, replacing a private copy.
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const origin = isDesktop ? "50% 8%" : "95% 8%";

  // The overlay is only reachable below the `lg` breakpoint, but the hrefs
  // still need resolving in case it is ever opened on a sub-page.
  const isHome = usePathname() === "/";

  // Same Projects double-click shortcut the desktop navbar has, so the gesture
  // behaves the same on touch.
  const router = useRouter();
  const onProjectsDoubleClick = useDoubleClick(() => {
    router.push("/projects");
  });

  // Remember what had focus before the menu opened so it can be handed back.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
  }, [isOpen]);

  // Restore focus and unlock scrolling on unmount as well as on close, so a
  // route change mid-open can't strand the page.
  useEffect(() => {
    if (isOpen) return;
    previouslyFocused.current?.focus?.();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    // The page previously scrolled freely behind the open menu.
    body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const container = panelRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      // Previously this only handled the case where focus was already on the
      // first/last element. If focus was somewhere outside the panel entirely,
      // Tab walked straight out of the dialog and into the page behind it.
      const isInside = container.contains(active);
      if (!isInside) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  const handleNavClick = useCallback(() => onClose(), [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          id="overlay-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={reduceMotion ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})` }}
          animate={reduceMotion ? { opacity: 1 } : { clipPath: `circle(160% at ${origin})` }}
          exit={reduceMotion ? { opacity: 0 } : { clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: reduceMotion ? 0.15 : 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute top-6 right-6 text-white text-3xl cursor-pointer"
            aria-label="Close menu"
          >
            <FiX aria-hidden="true" />
          </button>

          <motion.ul
            className="space-y-6 text-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
          >
            {navLinks.map((item) => (
              <motion.li
                key={item.href}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <a
                  href={resolveNavHref(item.href, isHome)}
                  // handleNavClick closes the overlay; the double-click handler
                  // only fires on a second tap, so composing them is safe.
                  onClick={(event) => {
                    if (item.href === "#projects" && isHome) {
                      onProjectsDoubleClick(event);
                    }
                    handleNavClick();
                  }}
                  className="text-4xl text-white font-semibold hover:text-pink-400 transition-colors duration-300"
                >
                  {item.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
