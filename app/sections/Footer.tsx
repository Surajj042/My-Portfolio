"use client";

import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground";
import { socials } from "../data/site.config";
import { getSocialIcon } from "../lib/icons";
import { glowVariants } from "../lib/motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-black">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_70%_35%,rgba(13,38,202,0.35),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_30%_70%,rgba(16,185,129,0.30),transparent_70%)]"
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 px-4 sm:px-8 lg:px-10 py-16 md:py-20 flex flex-col items-center text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* This was an <h1>, giving the page a second top-level heading. It is
            decorative wordmark text, not a section heading. */}
        <p
          className="font-semibold leading-none text-white text-center select-none"
          style={{
            fontSize: "clamp(3rem,5vw,14rem)",
            letterSpacing: "0.02em",
            lineHeight: 0.9,
            padding: "0 3vw",
            whiteSpace: "nowrap",
            textShadow: "0 2px 18px rgba(0,0,0,0.45)",
          }}
        >
          Surajj Gurung
        </p>

        <div
          className="h-[3px] w-24 md:w-32 rounded-full bg-gradient-to-r from-[#0d58cc] via-cyan-300 to-emerald-400"
          aria-hidden="true"
        />

        <div className="flex gap-5 text-2xl md:text-3xl">
          {socials.map(({ label, href }) => {
            const Icon = getSocialIcon(label);
            if (!Icon) return null;
            return (
              <motion.a
                href={href}
                key={label}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                variants={glowVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="text-gray-300 transition-colors duration-200 inline-flex items-center justify-center"
              >
                <Icon aria-hidden="true" />
              </motion.a>
            );
          })}
        </div>

        <p className="text-gray-300 italic max-w-xl">
          &ldquo;Success is when preparation meets opportunity.&rdquo;
        </p>

        <p className="text-xs text-gray-400">
          <span suppressHydrationWarning>
            &copy; {year} Suraj Gurung. All rights reserved.
          </span>
        </p>
      </motion.div>
      <ParticlesBackground />
    </footer>
  );
}
