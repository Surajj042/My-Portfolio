"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { FiX } from "react-icons/fi";

export default function OverlayMenu({ isOpen, onClose }) {
  const closeRef = useRef(null);

  // Origin matches SSR ("50% 8%") and updates on resize without re-renders.
  const origin = useSyncExternalStore(
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => (window.innerWidth < 1024 ? "95% 8%" : "50% 8%"),
    () => "50% 8%",
  );

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const container = e.currentTarget;
      const focusable = container.querySelectorAll(focusableSelector);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    const menuEl = document.getElementById("overlay-menu");
    if (menuEl) menuEl.addEventListener("keydown", handleKeyDown);
    return () => {
      if (menuEl) menuEl.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="overlay-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(160% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
        >
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute top-6 right-6 text-white text-3xl cursor-pointer"
            aria-label="Close Menu"
          >
            <FiX />
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
            {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={onClose}
                  className="text-4xl text-white font-semibold hover:text-pink-400 transition-colors duration-300"
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
