import type { Metadata } from "next";
import Link from "next/link";
import ProjectVisual from "../components/ProjectVisual";
import { projects } from "../data/projects";
import { SITE_TITLE, SITE_URL } from "../data/site.config";

export const metadata: Metadata = {
  title: "All projects",
  description:
    "Every project by Suraj Gurung — a learning platform, a real-time collaborative workspace, a dental clinic website, a game discovery platform and more.",
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/projects`,
    title: `All projects — ${SITE_TITLE.split(" – ")[0]}`,
    description:
      "Every project by Suraj Gurung, from the N-GVLH learning platform to the bingo caller.",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All projects — Suraj Gurung",
    description:
      "Every project by Suraj Gurung, from the N-GVLH learning platform to the bingo caller.",
  },
};

/**
 * The full project list. The homepage grid is curated to six, so this page is
 * where the rest stay published without competing for the slots above the fold.
 *
 * A Server Component: the project artwork is a plain <img> behind
 * `ProjectVisual`, and nothing here needs state, so this route adds nothing to
 * the client bundle.
 */
export default function AllProjectsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* The nav is fixed and ~64px tall; pt-24 keeps this heading clear of it. */}
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <span aria-hidden="true">&larr;</span> Back to projects
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-extrabold sm:text-5xl">All projects</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            {projects.length} builds in total &mdash; the six on the homepage,
            plus everything else I&apos;ve shipped.
          </p>
        </header>

        <section className="mt-14" aria-labelledby="all-projects-heading">
          <h2
            id="all-projects-heading"
            className="sr-only"
          >
            All projects
          </h2>
          <ul className="flex flex-col gap-6">
            {projects.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 text-sm text-gray-400">
          <Link href="/" className="transition-colors hover:text-white">
            &larr; Back to Suraj Gurung&apos;s portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="rounded-2xl border border-white/10 transition-colors hover:border-white/25">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
        {/* `small` builds have no case study route (`dynamicParams = false` in
            `[slug]`), so the artwork is a plain div for them. Linking it would
            404. */}
        {project.small ? (
          <div className="block w-full shrink-0 overflow-hidden rounded-xl bg-black/30 sm:w-64">
            <div className="aspect-[16/10] w-full">
              <ProjectVisual
                project={project}
                priority={false}
                className="h-full w-full"
              />
            </div>
          </div>
        ) : (
          <Link
            href={`/projects/${project.slug}`}
            className="block w-full shrink-0 overflow-hidden rounded-xl bg-black/30 sm:w-64"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="aspect-[16/10] w-full">
              <ProjectVisual
                project={project}
                priority={false}
                className="h-full w-full"
              />
            </div>
          </Link>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-xl font-bold">
              {project.small ? (
                project.title
              ) : (
                <Link
                  href={`/projects/${project.slug}`}
                  className="transition-colors hover:text-[#6dd5fa]"
                >
                  {project.title}
                </Link>
              )}
            </h3>
          </div>

          <p className="mt-2 leading-relaxed text-gray-300">{project.blurb}</p>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 6).map((tech) => (
              <li
                key={tech}
                className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-gray-300"
              >
                {tech}
              </li>
            ))}
            {project.stack.length > 6 && (
              <li className="px-1 py-0.5 text-[11px] text-gray-400">
                +{project.stack.length - 6}
              </li>
            )}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {project.small ? (
              <span className="text-sm text-gray-400">
                Small build — no case study, but the live demo and source are
                both below.
              </span>
            ) : (
              <Link
                href={`/projects/${project.slug}`}
                className="text-sm font-semibold text-white underline underline-offset-4 transition-colors hover:text-[#6dd5fa]"
              >
                Case study
                <span className="sr-only"> for {project.title}</span>
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
                <span className="sr-only"> of {project.title} (opens in a new tab)</span>
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
                <span className="sr-only"> for {project.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
