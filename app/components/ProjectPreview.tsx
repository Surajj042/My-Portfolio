"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX } from "react-icons/fi";
import ProjectVisual from "./ProjectVisual";
import { getSkillIcon } from "../lib/icons";
import type { Project } from "../types";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** How many highlights to show before deferring to the full case study. */
const HIGHLIGHT_LIMIT = 4;

export default function ProjectPreview({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Remember what had focus before the dialog opened so it can be handed back.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const isOpen = project !== null;

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
  }, [isOpen]);

  // Restore focus on close as well as on unmount, so a route change mid-open
  // cannot strand the keyboard somewhere behind the page.
  useEffect(() => {
    if (isOpen) return;
    previouslyFocused.current?.focus?.();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
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

      // If focus is outside the dialog entirely, pull it back to an edge
      // rather than letting Tab walk out into the page behind the overlay.
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

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-preview-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0a0a12] shadow-2xl"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              aria-label="Close quick look"
            >
              <FiX aria-hidden="true" />
            </button>

            <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-black/40">
              <motion.div
                layoutId={`project-visual-${project.slug}`}
                className="h-full w-full"
              >
                <ProjectVisual project={project} priority className="h-full w-full" />
              </motion.div>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent"
              />
            </div>

            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <div>
                <h3 id="project-preview-title" className="text-3xl font-bold">
                  {project.title}
                </h3>
                <p className="mt-3 leading-relaxed text-gray-300">{project.blurb}</p>
              </div>

              {/*
                `summary` is the Overview prose. It used to appear only on the
                case-study page, which left the modal showing a blurb and a
                four-item highlight list with no explanation of the project
                behind them.
              */}
              <section>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Overview
                </h4>
                <p className="mt-3 leading-relaxed text-gray-300">
                  {project.summary}
                </p>
              </section>

              {project.highlights.length > 0 && (
                <section>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    Highlights
                  </h4>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {project.highlights.slice(0, HIGHLIGHT_LIMIT).map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-3 leading-relaxed text-gray-300"
                      >
                        <span aria-hidden="true" className="text-white/40">
                          &rarr;
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                    {/*
                      Makes the cap visible instead of implied. Plain text
                      rather than a link: a link here would add a tab stop
                      inside the focus trap, and "Read case study" below
                      already goes to the same place.
                    */}
                    {project.highlights.length > HIGHLIGHT_LIMIT && (
                      <li className="text-sm text-gray-400">
                        +{project.highlights.length - HIGHLIGHT_LIMIT} more in
                        the case study
                      </li>
                    )}
                  </ul>
                </section>
              )}

              {/*
                The card only has room for five chips, which undersells projects
                like N-GVLH that have 21 entries, so the full stack is listed
                here with icons.
              */}
              <section>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Stack
                </h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => {
                    const Icon = getSkillIcon(tech);
                    return (
                      <li
                        key={tech}
                        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
                      >
                        {Icon ? <Icon aria-hidden="true" /> : null}
                        {tech}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {!project.small && (
                  <Link
                    href={`/projects/${project.slug}`}
                    onClick={onClose}
                    className="rounded-lg bg-white px-5 py-2.5 font-semibold text-black transition-colors hover:bg-gray-200"
                  >
                    Read case study
                  </Link>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/20 px-5 py-2.5 transition-colors hover:bg-white/10"
                  >
                    Live demo
                    <span className="sr-only"> of {project.title} (opens in a new tab)</span>
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/20 px-5 py-2.5 transition-colors hover:bg-white/10"
                  >
                    Source
                    <span className="sr-only"> for {project.title} (opens in a new tab)</span>
                  </a>
                )}
              </div>

              {project.small && (
                <p className="text-xs text-gray-500">
                  This is a small build, so it has no full case study.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
