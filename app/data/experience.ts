import type { TimelineEntry } from "../types";

/**
 * Career and education history, in reverse-chronological order — which is the
 * order the Experience section renders in.
 *
 * The project entries that used to live here were removed: every project is
 * already presented in full on the Projects grid and in its own case study, so
 * repeating them here added length without adding evidence.
 *
 * All of this is transcribed from the current resume (public/Resume.pdf,
 * regenerated 2026-09-27), which is the source of truth. The Odoo role is
 * listed first because it is the current position; the independent work comes
 * second. The organisation is "Eminence Ways" — an earlier draft here carried
 * "Eminence Ways / Trilokya Technology" on the assumption that these were two
 * employers, and the resume settles it.
 */
export const timeline: TimelineEntry[] = [
  {
    kind: "work",
    period: "2026 – Present",
    title: "Odoo / ERP Developer",
    org: "Eminence Ways, Kathmandu",
    points: [
      "Developing custom Odoo 19 ERP modules in Python, PostgreSQL, XML, JavaScript and OWL.",
      "Built features across HR, attendance, leave, payroll, performance, dashboards and reporting.",
    ],
  },
  {
    kind: "work",
    period: "2023 – 2026",
    title: "FreeLance Web Developer",
    org: "Independent",
    points: [
      "Self-directed development across JavaScript and TypeScript, React, Next.js, Flutter, databases and APIs.",
      "Built and deployed multiple independent applications, developing practical skill in full-stack development, authentication, databases and responsive UI.",
    ],
  },
  {
    kind: "education",
    period: "2021 – 2025",
    title: "Bachelor in Computer Engineering",
    org: "Pokhara Engineering College, Pokhara University",
    points: [
      "Operating Systems, Computer Architecture, Advanced Web Development, Data Structures and Algorithms, Programming Technology, Data Mining, E-commerce and NLP.",
    ],
  },
];
