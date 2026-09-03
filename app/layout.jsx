import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  // Only weights actually painted on the page (default body text = 400).
  // 800 is unused: the only font-extrabold sits on an h2, which uses Roboto.
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  // Fonts are self-hosted & inlined into the critical CSS by next/font;
  // preloading caused "preloaded but not used" console warnings.
  preload: false,
});

const roboto = Roboto({
  subsets: ["latin"],
  // h1/h2 always carry a weight class (semibold/bold/extrabold);
  // 400 is never painted, so it's excluded to avoid wasted preloads.
  weight: ["600", "700", "800"],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
});

const SITE_URL = "https://suraj-gurung.com.np";
const SITE_TITLE = "Suraj Gurung – Full Stack Developer | Portfolio";
const SITE_DESCRIPTION =
  "Portfolio of Suraj Gurung, a Full Stack Developer building modern, scalable web applications with React, Next.js, Node.js, Java and TypeScript. Explore projects, skills, experience and get in touch.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Suraj Gurung",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Suraj Gurung",
    "Suraj Gurung Portfolio",
    "Suraj Gurung Developer",
    "Suraj Gurung Full Stack Developer",
    "Full Stack Developer",
    "Web Developer",
    "Software Developer",
    "React Developer",
    "Next.js Developer",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: "Suraj Gurung", url: SITE_URL }],
  creator: "Suraj Gurung",
  publisher: "Suraj Gurung",
  alternates: {
    canonical: "/",
  },
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
};

// JSON-LD structured data: tells search engines exactly who this page is about.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Suraj Gurung",
  url: SITE_URL,
  image: `${SITE_URL}/assets/p.jpg`,
  jobTitle: "Full Stack Developer",
  description:
    "Full Stack Developer specializing in React, Next.js, Node.js, Java and TypeScript.",
  sameAs: [
    "https://www.linkedin.com/in/suraj-gurung-574688207/",
    "https://github.com/Surajj042",
    "https://www.facebook.com/suraj.gurung.sg98",
    "https://www.instagram.com/surajjgurung/",
  ],
  knowsAbout: [
    "Web Development",
    "Full Stack Development",
    "React",
    "Next.js",
    "Node.js",
    "Java",
    "TypeScript",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Suraj Gurung – Portfolio",
  url: SITE_URL,
  author: { "@type": "Person", name: "Suraj Gurung" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable}`}>
        {children}
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
