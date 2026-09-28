import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectVisual from "../../components/ProjectVisual";
import { featuredProjects, getProject } from "../../data/projects";
import { SITE_URL } from "../../data/site.config";

type Params = { params: Promise<{ slug: string }> };

/** Prerenders every project page at build time. */
export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

/**
 * Without this, any unrecognised slug is generated on demand and served with a
 * 200 — so /projects/<anything> returned a 200 "not found" page and crawlers
 * could index an unbounded set of junk URLs. Restricting the route to the
 * known slugs makes unknown ones a real 404.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.blurb,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/projects/${project.slug}`,
      title: `${project.title} — Suraj Gurung`,
      description: project.blurb,
      images: project.image
        ? [
            {
              url: project.image,
              width: project.width,
              height: project.height,
              alt: project.alt ?? project.title,
            },
          ]
        : [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Suraj Gurung`,
      description: project.blurb,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const others = featuredProjects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* pt-24 rather than py-16: the nav is fixed and ~64px tall, so the
          previous 64px top padding put the "All projects" back-link directly
          underneath it. */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <span aria-hidden="true">&larr;</span> All projects
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-gray-300">{project.blurb}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
              >
                Live demo
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 transition"
              >
                View source
              </a>
            )}
          </div>
        </header>

        <div className="mt-10 rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-black/30">
          <ProjectVisual project={project} priority />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="mt-4 text-gray-300 leading-relaxed">{project.summary}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">What it does</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-gray-300 leading-relaxed">
                <span aria-hidden="true" className="text-white/40">
                  &rarr;
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Stack</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="text-sm text-gray-300 bg-white/5 border border-white/10 rounded-full px-3 py-1"
              >
                {tech}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-400">
            Listed from the project&apos;s own dependency manifest.
          </p>
        </section>

        {others.length > 0 && (
          <section className="mt-16 pt-10 border-t border-white/10">
            <h2 className="text-2xl font-bold">Other projects</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/projects/${other.slug}`}
                    className="block rounded-xl border border-white/10 hover:border-white/30 p-4 transition-colors"
                  >
                    <span className="block font-semibold">{other.title}</span>
                    <span className="mt-1 block text-sm text-gray-400 line-clamp-2">
                      {other.blurb}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-16 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            &larr; Back to Suraj Gurung&apos;s portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}
