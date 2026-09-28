"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import { testimonials } from "../data/testimonials";

/** Cards visible at once. The data set is a multiple of this on purpose so the
 *  last page is never a ragged single card next to a full row. */
const PER_PAGE = 3;
const AUTO_ADVANCE_MS = 3000;

export default function Testimonials() {
  const reduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  /**
   * The user's own stop control, which is what WCAG 2.2.2 asks for. Deliberately
   * separate from `engaged`: hovering the carousel is a transient hold that
   * resumes on leave, whereas this is a decision that persists until reversed.
   */
  const [paused, setPaused] = useState(false);
  // Set while the pointer is inside the carousel or something inside it has
  // focus, as a second way to stop the rotation short of reaching for the
  // pause control.
  const [engaged, setEngaged] = useState(false);

  const regionRef = useRef<HTMLDivElement | null>(null);

  const pages = useMemo(() => {
    const out: (typeof testimonials)[] = [];
    for (let i = 0; i < testimonials.length; i += PER_PAGE) {
      out.push(testimonials.slice(i, i + PER_PAGE));
    }
    return out;
  }, []);

  const pageCount = pages.length;
  const total = testimonials.length;

  const goTo = useCallback(
    (next: number, dir?: number) => {
      const wrapped = ((next % pageCount) + pageCount) % pageCount;
      setDirection(dir ?? (wrapped > page ? 1 : -1));
      setPage(wrapped);
    },
    [page, pageCount],
  );

  /**
   * Whether the tab is in the foreground. Held in state rather than read inside
   * the autoplay effect: a bare `document.hidden` read there would bail out of
   * the effect without re-running it, so a tab opened in the background would
   * never start rotating, nor restart after being backgrounded mid-session.
   */
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /**
   * Autoplay. Suspended whenever the user has pressed pause, whenever the
   * carousel is being read — hovered or focused — and whenever the tab is in
   * the background, where a timer would advance pages nobody is looking at.
   *
   * The pause control is the WCAG 2.2.2 (Level A) mechanism. That criterion
   * covers auto-updating content presented in parallel with other content, and
   * the 5 second exception applies only to moving, blinking and scrolling
   * content — a 3 second interval did not exempt this carousel, which is why a
   * control is required here rather than merely nice. It is a real tab stop
   * with a label that states its own action, so it is reachable by keyboard
   * and not something a touch user has to hover for.
   */
  useEffect(() => {
    if (reduceMotion || paused || engaged || !pageVisible || pageCount < 2) {
      return;
    }

    const id = window.setInterval(() => {
      setDirection(1);
      setPage((p) => (p + 1) % pageCount);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(id);
  }, [engaged, pageCount, pageVisible, paused, reduceMotion]);

  if (total === 0) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(page + 1, 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(page - 1, -1);
    }
  };

  return (
    <section
      id="testimonials"
      className="w-full relative bg-black text-white py-24 px-4 sm:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#302b63] via-[#2a5298] to-[#6dd5fa] opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#302b63] via-[#2a5298] to-[#6dd5fa] opacity-20 blur-[120px] animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#38b3f4] via-[#397df2] to-[#6dd5fa]"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Testimonials
        </motion.h2>

        <p className="mt-3 text-center text-gray-400 max-w-2xl mx-auto">
          What people say about working with me.
        </p>

        <motion.div
          ref={regionRef}
          className="mt-14"
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setEngaged(true)}
          onMouseLeave={() => setEngaged(false)}
          onFocus={() => setEngaged(true)}
          onBlur={(e) => {
            if (!regionRef.current?.contains(e.relatedTarget as Node | null)) {
              setEngaged(false);
            }
          }}
        >
          {/*
            Every page is rendered into the same grid cell, so the row height is
            the tallest page and a card can never clip a long quote. An
            absolutely-positioned card in a fixed-height stage did exactly that:
            anything past ~320px pushed the attribution off the bottom. This
            also means all quotes ship in the server HTML, so the section is
            readable with JS disabled and indexable. Only the active page is
            exposed to assistive tech and to the pointer.
          */}
          <div className="grid">
            {pages.map((group, pi) => {
              const isActive = pi === page;
              const start = pi * PER_PAGE + 1;
              const end = pi * PER_PAGE + group.length;
              return (
                <motion.div
                  key={pi}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Testimonials ${start} to ${end} of ${total}`}
                  aria-hidden={isActive ? undefined : true}
                  className={`col-start-1 row-start-1 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 ${
                    isActive ? "" : "pointer-events-none"
                  }`}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    /*
                     * `x` stays in the target even under reduced motion, and is
                     * zeroed rather than removed. framer-motion does not reset a
                     * value when its key disappears from `animate` — it keeps the
                     * last one — so a reduced-motion branch that only set opacity
                     * left the parked page sitting 40px off to the right.
                     */
                    x: isActive ? 0 : reduceMotion ? 0 : direction * 40,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {group.map((t, ci) => (
                    <figure
                      key={`${t.name}-${ci}`}
                      className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-7"
                    >
                      <FaQuoteLeft
                        aria-hidden="true"
                        className="text-3xl text-[#6dd5fa]/30"
                      />

                      <blockquote className="mt-3 flex-1">
                        <p className="text-base sm:text-[17px] leading-relaxed text-gray-200">
                          {t.quote}
                        </p>
                      </blockquote>

                      <figcaption className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {/*
                            Generated by `scripts/generate-avatars.mjs`, not
                            photographed — see the note in `data/testimonials.ts`
                            for why, and for how to swap in real consented
                            pictures. The name sits right beside this, so the
                            image is decorative and `alt` is empty: announcing
                            the name twice is noise for a screen reader.
                          */}
                          {t.avatar ? (
                            <Image
                              src={t.avatar}
                              alt=""
                              width={88}
                              height={88}
                              sizes="44px"
                              className="h-11 w-11 shrink-0 rounded-full border border-white/15"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-[#38b3f4] to-[#302b63]"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-white">{t.name}</p>
                            <p className="text-sm text-gray-400">
                              {t.role}
                              {t.company ? `, ${t.company}` : ""}
                            </p>
                          </div>
                        </div>

                        {typeof t.rating === "number" && (
                          <div
                            className="flex gap-1"
                            role="img"
                            aria-label={`Rated ${t.rating} out of 5`}
                          >
                            {Array.from({ length: 5 }, (_, s) => (
                              <FaStar
                                key={s}
                                aria-hidden="true"
                                className={
                                  s < t.rating!
                                    ? "text-[#6dd5fa]"
                                    : "text-white/15"
                                }
                              />
                            ))}
                          </div>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => goTo(page - 1, -1)}
              aria-label="Previous page of testimonials"
              className="rounded-full border border-white/15 p-2 text-gray-300 transition-colors hover:border-[#6dd5fa] hover:text-[#6dd5fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6dd5fa]"
            >
              <FiChevronLeft aria-hidden="true" />
            </button>

            <div className="flex items-center gap-1">
              {pages.map((_, pi) => (
                <button
                  key={pi}
                  type="button"
                  onClick={() => goTo(pi)}
                  aria-label={`Go to page ${pi + 1} of ${pageCount}`}
                  aria-current={pi === page ? "true" : undefined}
                  // The bar itself is 8px, well under the 24x24 minimum target
                  // size, so the button carries the padding and the bar is a
                  // child. Hit area is 24px tall regardless of the visual.
                  className="rounded-full p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6dd5fa]"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      pi === page
                        ? "w-6 bg-[#6dd5fa]"
                        : "w-2 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(page + 1, 1)}
              aria-label="Next page of testimonials"
              className="rounded-full border border-white/15 p-2 text-gray-300 transition-colors hover:border-[#6dd5fa] hover:text-[#6dd5fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6dd5fa]"
            >
              <FiChevronRight aria-hidden="true" />
            </button>

            {/*
              Kept inline with the other controls rather than tucked into a
              corner, so it is discoverable alongside the arrows it sits
              between. The label states the action it performs and swaps with
              the state, so it is usable from the accessibility tree alone.
            */}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={
                paused
                  ? "Resume rotating testimonials"
                  : "Pause rotating testimonials"
              }
              className="rounded-full border border-white/15 p-2 text-gray-300 transition-colors hover:border-[#6dd5fa] hover:text-[#6dd5fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6dd5fa]"
            >
              {paused ? (
                <FiPlay aria-hidden="true" />
              ) : (
                <FiPause aria-hidden="true" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
