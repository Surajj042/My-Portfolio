import type { Project } from "../types";

  /**
   * Every stack entry here was read from the project's actual manifest
   * (package.json / pubspec.yaml) rather than from a description, so nothing on
   * the site claims a technology the repository does not contain.
   *
   * Re-verified 2026-09-27. N-GVLH was rebuilt and moved to its own repository;
   * 20 of the 21 previously listed technologies are still in its manifest, and
   * "Anthropic SDK" was dropped because `@anthropic-ai/sdk` is no longer a
   * dependency. The dental clinic site was added from its own manifest.
   */
export const projects: Project[] = [
  {
    title: "Aarogya Dental Clinic",
    slug: "aarogyadental",
    blurb:
      "A production marketing site for a dental clinic, with branch-specific content, service pages and WhatsApp/call booking.",
    summary:
      "Aarogya Maxillofacial & Dental Care needed a website their patients would actually use on a phone. This is a production Next.js site with branch-specific pages for each location, individual service pages, and contact routes that put WhatsApp, a phone call and an embedded map one tap away. Form submissions are delivered by email through Nodemailer.",
    highlights: [
      "Branch-specific content, so each clinic location gets its own pages rather than one generic address page.",
      "Dedicated service pages written for how patients search, with the enquiry path kept close to the content.",
      "Contact routes that reach the clinic the way patients prefer: WhatsApp, a direct phone call, or an embedded Google Map.",
      "Contact form submissions delivered by email through Nodemailer, so enquiries land with the clinic without a backend to maintain.",
      "Responsive throughout, built on Tailwind CSS, with Next.js and TypeScript across the whole site.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Nodemailer",
    ],
    year: "2026",
    repo: "https://github.com/aarogyadental000/Portfolio",
    demo: "http://aarogyadental.com.np/",
    image: "/assets/img4.png",
    width: 1919,
    height: 833,
  },
  {
    title: "N-GVLH",
    slug: "n-gvlh",
    blurb:
      "An online learning platform with interactive video courses, live teacher calls and AI-assisted Q&A.",
    summary:
      "N-GVLH is a learning platform that connects students with teachers through interactive video courses, live video calls and community discussion. Teachers author and manage their own course material, students follow the educators they want to hear from, and payments run through Stripe.",
    highlights: [
      "Interactive video courses with attachments, plus live video calling for one-to-one support and real-time Q&A sessions.",
      "Teacher-authored course management with dedicated announcement pages, and a follow system that personalises announcements to the educators a student subscribes to.",
      "Secure enrolment payments through Stripe, with webhook-driven enrolment state handled by Svix.",
      "Community Q&A that combines answers from teachers and peers with AI-generated responses, backed by a search index for course and teacher discovery.",
      "Rich content authoring with TinyMCE, react-quill and easymde, and file uploads through UploadThing.",
      "Dark and light themes, dashboard analytics with Recharts, and a scheduled notification system for upcoming sessions.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "MongoDB",
      "Mongoose",
      "Clerk",
      "Stripe",
      "Stream.IO",
      "Mux",
      "Google Gemini",
      "TinyMCE",
      "UploadThing",
      "Zod",
      "Zustand",
      "React Hook Form",
      "Tailwind CSS",
      "Framer Motion",
      "Radix UI",
      "TanStack Table",
      "Recharts",
    ],
    year: "2025",
    repo: "https://github.com/Surajj042/N-GVLH",
    demo: "https://n-gvlh042.vercel.app/",
    image: "/assets/img1.png",
    width: 1902,
    height: 866,
    alt: "N-GVLH learning platform course page",
  },
  {
    title: "Realtime Collab",
    slug: "realtime-collab",
    blurb:
      "A collaborative workspace with real-time document and code editing, multiplayer whiteboards and AI chat summaries.",
    summary:
      "Realtime Collab is a workspace for teams that need to think in the same document at the same time. It combines a collaborative rich-text editor, a real-time code editor, a multiplayer whiteboard and organisation-wide messaging, all synchronised through CRDTs and wrapped in organisation-scoped access control.",
    highlights: [
      "Real-time document editing with live multi-cursor presence, version history and conflict resolution, built on TipTap with the Liveblocks and Yjs collaboration layers.",
      "A real-time code editor with Monaco, syntax highlighting and multi-language support, synchronised over the Yjs protocol.",
      "Multiplayer whiteboards on an HTML canvas with freehand drawing, shapes and text annotations via perfect-freehand.",
      "Organisation-wide messaging with image and file support, plus AI-generated conversation summaries and decision highlights through Google Gemini.",
      "Clerk-backed authentication with organisation-based access control so documents stay scoped to the right team.",
      "Resizable split panes, drag-and-drop file handling and a light/dark theme switcher.",
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Convex",
      "Clerk",
      "Liveblocks",
      "TipTap",
      "Monaco Editor",
      "Yjs",
      "Google Gemini",
      "perfect-freehand",
      "Zod",
      "Zustand",
      "Tailwind CSS",
      "Framer Motion",
      "Recharts",
    ],
    year: "2025",
    repo: "https://github.com/Surajj042/realtime-collab",
    demo: "https://realtime-collab-puce.vercel.app",
    image: "/assets/img3.png",
    width: 1919,
    height: 833,
    alt: "Realtime Collab workspace with a collaborative editor",
  },
  {
    title: "Habit Tracker",
    slug: "habit-tracker",
    blurb:
      "A Flutter habit-tracking app with a streak heatmap, liquid-swipe onboarding and OTP sign-in.",
    summary:
      "Habit Tracker is an Android app for recording daily habits and seeing consistency at a glance. It ships as an installable APK, uses OTP-based sign-in rather than a password, and leans on GetX for state so the UI stays declarative.",
    highlights: [
      "Daily habit checklist with a heatmap view that makes consistency and streaks visible at a glance.",
      "OTP-based sign-in through a custom OTP text field, with no password to store or leak.",
      "GetX for state management, keeping screen state declarative and the widget tree shallow.",
      "Liquid-swipe onboarding and a smooth page indicator for a more polished first-run experience.",
      "Local persistence and look-up history for reviewing how a habit tracked over time.",
      "Six-language support and Google Fonts typography, shipped as an installable APK.",
    ],
    stack: [
      "Flutter",
      "Dart",
      "GetX",
      "Google Fonts",
    ],
    arcade: true,
    year: "2025",
    repo: "https://github.com/Surajj042/Flutter-Habit_Tracker_Android",
    demo:
      "https://www.mediafire.com/file/17cqf153yxdfze9/habit-tracker.apk/file",
    image: "/assets/img7.png",
    width: 1919,
    height: 833,
      
  },
  {
    title: "Game Hub",
    slug: "game-hub",
    blurb:
      "A game discovery platform with search, filtering and infinite-scroll browsing, built on the RAWG API.",
    summary:
      "Game Hub is a game discovery front-end that pulls its catalogue from the RAWG API and makes it browsable without page reloads. It is a Vite single-page app rather than a Next.js site, which keeps the client bundle small and the initial load fast.",
    highlights: [
      "Search and multi-facet filtering against the RAWG catalogue, wired through TanStack Query for caching and request deduplication.",
      "Infinite-scroll browsing so results stream in as the user reaches the end of the list.",
      "Server state kept in TanStack Query and client state in Zustand, so the two never fight over the same field.",
      "Chakra UI component system for layout and theming, with Framer Motion handling list transitions.",
      "Vite for the build and dev server, which is why the app boots noticeably faster than the Next.js builds in this list.",
    ],
    stack: [
      "Vite",
      "React 18",
      "TypeScript",
      "React Router",
      "Chakra UI",
      "TanStack Query",
      "Zustand",
      "Axios",
      "Framer Motion",
    ],
    year: "2024",
    repo: "https://github.com/Surajj042/Game-Hub",
    demo: "https://game-hub-woad-theta-42.vercel.app",
    image: "/assets/img2.png",
    width: 1895,
    height: 852,
    alt: "Game Hub game discovery interface",
  },
  {
    title: "Zoom Clone",
    slug: "zoom-clone",
    blurb:
      "A video-conferencing front-end with meeting scheduling, built on the Stream video SDK.",
    summary:
      "Zoom Clone is a working video-conferencing interface: create a meeting, schedule it, join from a link and dial in through Stream's real-time video infrastructure. The scheduling UI uses Radix primitives and Tailwind, with Clerk handling identity.",
    highlights: [
      "Real-time video rooms powered by the Stream video SDK, rather than a simulated call screen.",
      "Meeting scheduling with a date and time picker, and join-by-link for instant rooms.",
      "Clerk for authentication and user identity across sessions.",
      "Dropdown and dialog flows built on Radix UI primitives, styled with Tailwind.",
      "Next.js App Router with TypeScript throughout.",
    ],
    stack: [
      "Next.js 14",
      "React 18",
      "TypeScript",
      "Clerk",
      "Stream.IO",
      "Radix UI",
      "Tailwind CSS",
    ],
    year: "2024",
    repo: "https://github.com/Surajj042/Zoom_clone",
    demo: "https://zoom-clone-beta-ashy.vercel.app",
    image: "/assets/img6.png",
    width: 1919,
    height: 833,
  },
  {
    title: "Bingo Caller",
    slug: "bingo-caller",
    blurb:
      "A dependency-free random number caller for running bingo games at a desk.",
    summary:
      "Bingo Caller is a small single-page tool that draws and announces random bingo numbers. It has no build step and no dependencies, so it loads instantly and works offline — the point of the project was the constraint.",
    highlights: [
      "No build step and no dependencies: plain HTML, CSS and JavaScript that runs straight from the browser.",
      "Random number generation with duplicate-free draws per card.",
      "Responsive layout built entirely with CSS, with no CSS framework.",
    ],
    stack: ["HTML", "CSS", "JavaScript"],
    year: "2026",
    repo: "https://github.com/Surajj042/Bingo-Caller",
    demo: "https://bingo-caller-iota.vercel.app",
    small: true,
    image: "/assets/img5.png",
    width: 1919,
    height: 833,
  },
];

/** Projects that get their own detail page, in display order. */
export const featuredProjects = projects.filter((p) => !p.small);

/**
 * The homepage grid. Projects marked `arcade` are deliberately excluded — they
 * stay published on /projects but do not compete for the six slots above the
 * fold.
 */
export const gridProjects = projects.filter((p) => !p.arcade);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
