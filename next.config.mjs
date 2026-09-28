// React's dev runtime probes for eval() so it can reconstruct callstacks that
// cross realms. That probe lives only in Next's `*.runtime.dev.js` bundles — the
// production runtimes contain no eval call sites at all — so `unsafe-eval` is
// granted in development and never shipped.
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
  "https://api.emailjs.com",
].join(" ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            // This site is fully static, so a nonce-based CSP would force
            // dynamic rendering and lose the prerender. A static policy with
            // 'unsafe-inline' for scripts keeps the static build; the headers
            // below are what actually carry the security weight here.
            //
            // Note the dev-only 'unsafe-eval' in `scriptSrc` — see above. The
            // production policy is unchanged and grants no eval access.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // EmailJS is the only third-party script origin.
              `script-src ${scriptSrc}`,
              // framer-motion sets inline styles at runtime.
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://api.emailjs.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            // No camera/mic/geo is used anywhere on this site.
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "interest-cohort=()",
            ].join(", "),
          },
        ],
      },
      {
        // The resume is a downloadable file; don't let browsers MIME-sniff it.
        source: "/Resume.pdf",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'none'; sandbox",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
