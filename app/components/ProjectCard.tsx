"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import ProjectVisual from "./ProjectVisual";
import { getSkillIcon } from "../lib/icons";
import { FINE_POINTER_QUERY, useMediaQuery } from "../lib/use-media-query";
import type { Project } from "../types";

/** Degrees of rotation at the far edge of a card. Kept small on purpose. */
const MAX_TILT = 6;
const TILT_SPRING = { stiffness: 260, damping: 24, mass: 0.6 };
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export default function ProjectCard({
  project,
  index,
  onPreview,
}: {
  project: Project;
  /** Position in the current filtered set, used only to stagger the reveal. */
  index: number;
  onPreview: (project: Project) => void;
}) {
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const reduceMotion = useReducedMotion();
  const canTilt = finePointer && !reduceMotion;
  const [hot, setHot] = useState(false);

  // Normalised pointer position across the card, 0..1.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]), TILT_SPRING);

  // Counter-movement for the artwork, so the image drifts against the tilt
  // rather than sitting flat on a skewed card. Driven by the same motion value
  // as the rotation, so it updates without a re-render.
  const imageX = useTransform(px, [0, 1], [7, -7]);

  /**
   * Pointer tracking, deliberately bypassing React state.
   *
   * Two channels are fed from one handler: CSS custom properties for the
   * spotlight, and motion values for the tilt. Routing a pointermove through
   * setState would re-render the card on every event, which is exactly what
   * tanks INP. Custom properties inherit, so the inner gradient picks these up.
   */
  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (!canTilt) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    px.set(x);
    py.set(y);
  };

  const resetSpotlight = (event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  const interactive = {
    // Seeded on enter so the card tilts toward the pointer even before the
    // first pointermove lands.
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      setHot(true);
      trackPointer(event);
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      setHot(false);
      px.set(0.5);
      py.set(0.5);
      // Without this the gradient would reappear at the last pointer position
      // the moment the pointer re-enters, before any pointermove fires.
      resetSpotlight(event);
    },
    onPointerMove: trackPointer,
    onFocus: () => setHot(true),
    onBlur: () => setHot(false),
  };

  return (
    <div className="h-full" style={{ perspective: 1000 }}>
      <motion.article
        layout
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
        transition={{
          duration: 0.5,
          delay: Math.min(index, 5) * 0.06,
          ease: REVEAL_EASE,
        }}
        style={{ rotateX: canTilt ? rotateX : 0, rotateY: canTilt ? rotateY : 0 }}
        className="group relative h-full rounded-2xl"
        {...interactive}
      >
        {/* Resting border, brightened on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 transition-colors duration-300 group-hover:border-white/25"
        />

        {/* Inset by 1px so the two layers above read as a 1px frame. */}
        <div className="relative m-px flex h-full flex-col overflow-hidden rounded-[15px] bg-[#0a0a12]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(109,213,250,0.14), transparent 70%)",
            }}
          />

          {/*
            The button wraps only the artwork, and carries no visible text of
            its own. The "Quick look" pill is a sibling rather than a child: as
            a child its label became part of the button's accessible name, and
            for the projects with no screenshot `ProjectVisual` renders a
            fallback initial, so the visible text ("H Quick look") no longer
            matched the aria-label. Keeping the pill outside and
            pointer-events-none also lets clicks fall through to the button.
          */}
          <div className="relative aspect-[16/10] overflow-hidden bg-black/30">
            <button
              type="button"
              onClick={() => onPreview(project)}
              className="absolute inset-0 block h-full w-full cursor-pointer"
              aria-label={`Quick look: ${project.title}`}
            >
              <motion.div
                className="h-full w-full"
                style={{ x: canTilt ? imageX : 0 }}
                animate={{ scale: canTilt && hot ? 1.07 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
              >
                <motion.div
                  layoutId={`project-visual-${project.slug}`}
                  className="h-full w-full"
                >
                  <ProjectVisual project={project} priority={false} className="h-full w-full" />
                </motion.div>
              </motion.div>

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent opacity-80"
              />
            </button>

            {/* A persistent affordance rather than a hover-only one, so the
                action is discoverable by keyboard and on touch. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm"
            >
              Quick look
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <h3 className="text-xl font-bold text-white">
              <button
                type="button"
                onClick={() => onPreview(project)}
                className="cursor-pointer text-left transition-colors hover:text-[#6dd5fa]"
              >
                {project.title}
                <span className="sr-only"> — open quick look</span>
              </button>
            </h3>

            <p className="flex-1 text-sm leading-relaxed text-gray-300">
              {project.blurb}
            </p>

            <ul className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 5).map((tech, i) => {
                const Icon = getSkillIcon(tech);
                return (
                  <li
                    key={tech}
                    className="translate-y-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-300 opacity-70 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ transitionDelay: `${i * 45}ms` }}
                  >
                    <span className="flex items-center gap-1">
                      {Icon ? <Icon aria-hidden="true" /> : null}
                      {tech}
                    </span>
                  </li>
                );
              })}
              {project.stack.length > 5 && (
                <li className="px-1 py-0.5 text-[11px] text-gray-400">
                  +{project.stack.length - 5}
                </li>
              )}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
              {/* Small builds are deliberately excluded from
                  generateStaticParams, so linking to a case study for them
                  produced a 404. They link out to the demo and source. */}
              {!project.small && (
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-[#6dd5fa]"
                >
                  Read more
                  <span className="sr-only"> about {project.title}</span>
                </Link>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Live demo
                  <span className="sr-only">
                    {" "}
                    of {project.title} (opens in a new tab)
                  </span>
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Source
                  <span className="sr-only">
                    {" "}
                    for {project.title} (opens in a new tab)
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
