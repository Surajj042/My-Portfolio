"use client";

import Image from "next/image";
import type { Project } from "../types";

/** Deterministic hue from the slug, so a project always gets the same tile. */
function hueFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) % 360;
  }
  return h;
}

/**
 * Project artwork, with a generated tile as the fallback.
 *
 * Not every project has a screenshot yet, and a missing image must not break
 * the build or leave a broken-image icon, so anything without a `project.image`
 * renders a gradient derived from its slug instead.
 */
export default function ProjectVisual({
  project,
  className = "",
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  if (project.image && project.width && project.height) {
    return (
      <Image
        src={project.image}
        alt={project.alt ?? `${project.title} screenshot`}
        width={project.width}
        height={project.height}
        priority={priority}
        // Without this the optimiser assumes a full-bleed 100vw image and
        // serves a candidate several times larger than the rendered card.
        sizes="(min-width: 1024px) 40vw, (min-width: 640px) 90vw, 92vw"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  const hue = hueFromSlug(project.slug);
  const initial = project.title.charAt(0).toUpperCase();

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 22%), hsl(${(hue + 48) % 360} 60% 12%))`,
      }}
    >
      <span
        aria-hidden="true"
        className="text-6xl sm:text-7xl font-extrabold text-white/25 select-none"
      >
        {initial}
      </span>
    </div>
  );
}
