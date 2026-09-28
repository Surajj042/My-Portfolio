"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import ProjectPreview from "../components/ProjectPreview";
import { gridProjects, projects } from "../data/projects";
import type { Project } from "../types";

/**
 * The pinned, scroll-scrubbed showcase that used to live here was removed in
 * favour of a grid. It duplicated the case-study links, ran a scroll listener
 * plus sticky positioning to reveal content that was already below the fold,
 * and meant two competing presentations of the same projects.
 *
 * This is a client component, which is a deliberate reversal of the previous
 * "server component keeps this section out of the bundle" decision: the
 * quick-look dialog needs state. The cost is small — `ProjectCard` was already
 * a client component, and the section's markup is still server-rendered, so
 * `id="projects"` and every link stay in the initial HTML for the nav
 * scroll-spy and for crawlers.
 */
export default function Projects() {
  const [preview, setPreview] = useState<Project | null>(null);

  const openPreview = useCallback((project: Project) => setPreview(project), []);
  const closePreview = useCallback(() => setPreview(null), []);

  return (
    <section
      id="projects"
      aria-label="My work"
      className="relative w-full overflow-hidden bg-black px-4 py-20 text-white sm:px-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[#2a5298] opacity-20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.h2
          className="text-center text-3xl font-bold sm:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          My Work
        </motion.h2>
        <motion.p
          className="mx-auto mt-3 max-w-2xl px-4 text-center text-gray-400"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Six builds, from a dependency-free bingo caller to a real-time
          collaborative workspace. Open a quick look for the detail without
          leaving the page.
        </motion.p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gridProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              onPreview={openPreview}
            />
          ))}
        </div>

        {/*
          The full project list is also reachable by double-clicking the
          navbar's Projects item, but a gesture nobody can see is not a real
          navigation path — it is unreachable by keyboard and undiscoverable by
          screen-reader and touch users. This is the visible route.
        */}
        <p className="mt-10 text-center text-sm text-gray-400">
          <Link
            href="/projects"
            className="underline underline-offset-4 transition-colors hover:text-white"
          >
            All projects
            <span className="sr-only"> — all {projects.length} projects</span>
          </Link>
        </p>
      </div>

      <ProjectPreview project={preview} onClose={closePreview} />
    </section>
  );
}
