import type { Metadata } from "next";
import { JetBrains_Mono, Poppins, Roboto } from "next/font/google";
import NavBar from "./components/NavBar";
import {
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  socials,
} from "./data/site.config";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
});

/*
 * Scoped to the terminal hero only, so the mono is paid for on the one section
 * that needs it. Body copy stays on Poppins/Roboto, which is what the rest of
 * the site is set in.
 *
 * `weight` is deliberately a single 500. This face only ever renders the hero's
 * command lines, and a variable range here would pull several extra weight
 * files for no gain.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Suraj Gurung",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Suraj Gurung",
    "Suraj Gurung Portfolio",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Flutter Developer",
    "Computer Engineering Nepal",
    "Pokhara Developer",
    "MongoDB",
    "Real-time collaboration",
  ],
  authors: [{ name: "Suraj Gurung", url: SITE_URL }],
  creator: "Suraj Gurung",
  publisher: "Suraj Gurung",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Suraj Gurung – Portfolio",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Suraj Gurung – Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/assets/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any", type: "image/png" },
      { url: "/assets/Logo.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: [{ url: "/assets/Logo.png", sizes: "180x180", type: "image/png" }],
  },
  category: "technology",
};

export const viewport = {
  themeColor: "#0d1b2a",
  colorScheme: "dark" as const,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Suraj Gurung",
  url: SITE_URL,
  image: `${SITE_URL}/assets/p.jpg`,
  jobTitle: "Odoo / ERP Developer and Full Stack Developer",
  description: SITE_DESCRIPTION,
  email: "mailto:suraj.gurung.sg98@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pokhara",
    addressCountry: "NP",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Pokhara Engineering College, Pokhara University",
  },
  knowsAbout: [
    "Odoo",
    "Odoo ERP development",
    "Python",
    "PostgreSQL",
    "XML",
    "OWL",
    "TypeScript",
    "React",
    "Next.js",
    "Flutter",
    "Dart",
    "MongoDB",
    "Real-time collaboration",
    "Yjs",
    "Liveblocks",
    "Convex",
  ],
  sameAs: [GITHUB_URL, ...socials.filter((s) => s.label !== "GitHub").map((s) => s.href)],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Suraj Gurung – Portfolio",
  url: SITE_URL,
  author: { "@type": "Person", name: "Suraj Gurung" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.variable} ${roboto.variable} ${jetbrainsMono.variable} bg-black text-white`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
        >
          Skip to content
        </a>
        {/* Outside <main> so the skip link above jumps *past* the navigation
            instead of past it. Rendered here rather than in the home page so
            the case-study routes share the same bar. */}
        <NavBar />
        <main id="main-content">{children}</main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
