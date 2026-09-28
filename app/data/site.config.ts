import type { ContactDetail, Social } from "../types";

/**
 * Canonical origin. Must match the host that actually serves production:
 * `suraj-gurung.com.np` 307-redirects to the `www` host, so pointing metadata,
 * canonical, JSON-LD and the sitemap at the apex would advertise a redirect.
 */
export const SITE_URL = "https://www.suraj-gurung.com.np";

export const SITE_TITLE = "Suraj Gurung – Odoo ERP & Full Stack Developer | Portfolio";

export const SITE_DESCRIPTION =
  "Portfolio of Suraj Gurung, a Computer Engineering graduate and Odoo ERP developer building custom ERP modules in Python and PostgreSQL alongside full stack web applications with TypeScript, React and Next.js. Explore projects and get in touch.";

export const GITHUB_URL = "https://github.com/Surajj042";

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/Surajj042",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/suraj-gurung-574688207/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/surajjgurung/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/suraj.gurung.sg98",
  },
];

/**
 * Direct contact details. These were previously absent from the site entirely —
 * the only route to a human was a form with a required budget field.
 */
export const contact: ContactDetail[] = [
  {
    label: "Email",
    value: "suraj.gurung.sg98@gmail.com",
    href: "mailto:suraj.gurung.sg98@gmail.com",
  },
  {
    label: "Phone",
    value: "+977 981 411 8473",
    href: "tel:+9779814118473",
  },
  {
    label: "Location",
    value: "Pokhara, Nepal",
    href: "https://www.google.com/maps/place/Pokhara",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
] as const;
