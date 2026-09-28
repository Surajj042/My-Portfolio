import type { Skill } from "../types";

/**
 * Reconstructed from the languages and dependency manifests across the public
 * repositories, so every entry here is backed by code that exists, then widened
 * with the professional stack from the resume — Python, PostgreSQL and Odoo
 * for the ERP work, and the CS and tooling basics a Computer Engineering
 * graduate is expected to have.
 *
 * Removed 2026-09-27: Anthropic, which no longer appears in any manifest here
 * after the N-GVLH rewrite. Deliberately still absent: Laravel and PHP, which
 * appear in no repository or manifest.
 *
 * `icon` is a key into `lib/icons.ts` rather than a component reference, which
 * keeps this module serialisable and importable from Server Components without
 * pulling react-icons into the RSC graph.
 */
export const skills: Skill[] = [
  { name: "TypeScript", category: "language", icon: "SiTypescript" },
  { name: "JavaScript", category: "language", icon: "SiJavascript" },
  { name: "Python", category: "language", icon: "SiPython" },
  { name: "Dart", category: "language", icon: "SiDart" },
  { name: "Java", category: "language", icon: "FaJava" },
  { name: "C", category: "language", icon: "SiC" },
  { name: "C++", category: "language", icon: "SiCplusplus" },
  { name: "HTML5", category: "language", icon: "SiHtml5" },
  { name: "CSS", category: "language", icon: "SiCss" },

  { name: "React", category: "frontend", icon: "FaReact" },
  { name: "Next.js", category: "frontend", icon: "SiNextdotjs" },
  { name: "Tailwind CSS", category: "frontend", icon: "SiTailwindcss" },
  { name: "Chakra UI", category: "frontend", icon: "SiChakraui" },
  { name: "Radix UI", category: "frontend", icon: "SiRadixui" },
  { name: "React Router", category: "frontend", icon: "SiReactrouter" },
  { name: "Vite", category: "frontend", icon: "SiVite" },
  { name: "Framer Motion", category: "frontend", icon: "TbBrandFramerMotion" },

  { name: "Node.js", category: "backend", icon: "DiNodejs" },
  { name: "MongoDB", category: "backend", icon: "SiMongodb" },
  { name: "PostgreSQL", category: "backend", icon: "SiPostgresql" },
  { name: "Firebase", category: "backend", icon: "SiFirebase" },
  { name: "Odoo", category: "backend", icon: "SiOdoo" },
  { name: "TanStack Query", category: "backend", icon: "SiTanstack" },

  { name: "Clerk", category: "realtime", icon: "SiClerk" },
  { name: "Stripe", category: "realtime", icon: "SiStripe" },
  { name: "Google Gemini", category: "realtime", icon: "SiGooglegemini" },

  { name: "Flutter", category: "mobile", icon: "SiFlutter" },

  { name: "React Hook Form", category: "tooling", icon: "SiReacthookform" },
  { name: "Git", category: "tooling", icon: "SiGit" },
  { name: "Docker", category: "tooling", icon: "SiDocker" },
  { name: "Linux", category: "tooling", icon: "SiLinux" },
];
