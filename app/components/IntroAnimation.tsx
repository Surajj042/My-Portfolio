"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const GREETINGS = [
  "नमस्ते",       // Nepali
  "Hello",      // English
  "Hola",       // Spanish  
  "Bonjour",     // French
  "こんにちは",   // Japanese
  "안녕하세요",    // Korean
  "फ्याफुल्ला",     // Gurung
  "你好",        // Chinese
];

const STORAGE_KEY = "portfolio:intro-seen";

export default function IntroAnimation({ onFinish }: { onFinish: () => void }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  }, [onFinish]);

  // The splash is decorative. It used to replay on every single page load,
  // blocking the page for ~2.5s each time with no way to skip past it, and it
  // wasn't hidden from assistive tech — a keyboard user could tab straight
  // through to the content behind it.
  useEffect(() => {
    if (reduceMotion) {
      finish();
      return;
    }
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Private browsing modes can throw on sessionStorage access.
      seen = false;
    }
    if (seen) {
      finish();
    } else {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Non-fatal: the splash just replays next time.
      }
    }
  }, [reduceMotion, finish]);

  useEffect(() => {
    if (index < GREETINGS.length - 1) {
      const timer = window.setTimeout(() => setIndex((i) => i + 1), 180);
      return () => window.clearTimeout(timer);
    }
    const t = window.setTimeout(() => setVisible(false), 300);
    return () => window.clearTimeout(t);
  }, [index]);

  // Any of click / key / scroll / touch dismisses immediately.
  useEffect(() => {
    const dismiss = () => setVisible(false);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchstart", dismiss, { passive: true });
    window.addEventListener("pointerdown", dismiss);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchstart", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={finish}>
      {visible && (
        <motion.div
          // Hidden from the a11y tree: purely decorative, and the real content
          // is already in the DOM behind it.
          aria-hidden="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white overflow-hidden"
          exit={{
            y: "-100%",
            transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <motion.h2
            key={index}
            className="text-5xl md:text-7xl lg:text-8xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.12 }}
          >
            {GREETINGS[index] ?? GREETINGS[0]}
          </motion.h2>

          {/* Escape hatch for anyone who doesn't want to wait it out. */}
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute bottom-8 right-8 text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
            tabIndex={-1}
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
