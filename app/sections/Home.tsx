"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground";
import { socials } from "../data/site.config";
import { glowVariants } from "../lib/motion";
import { getSocialIcon } from "../lib/icons";

const ROLES = ["Odoo / ERP Developer", "Full Stack Developer"] as const;
const TYPE_MS = 60;
const DELETE_MS = 40;
const HOLD_MS = 1200;

export default function Home() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[index] ?? ROLES[0];

    // Single timer, fully owned by this effect. The previous version nested a
    // second setTimeout inside the first, and only the outer one was ever
    // cleared — so the inner one fired after unmount and called setState on a
    // dead component.
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && subIndex < current.length) {
      timer = setTimeout(() => setSubIndex((v) => v + 1), TYPE_MS);
    } else if (!deleting && subIndex === current.length) {
      timer = setTimeout(() => setDeleting(true), HOLD_MS);
    } else if (deleting && subIndex > 0) {
      timer = setTimeout(() => setSubIndex((v) => v - 1), DELETE_MS);
    } else {
      timer = setTimeout(() => {
        setDeleting(false);
        setIndex((p) => (p + 1) % ROLES.length);
      }, DELETE_MS);
    }

    return () => clearTimeout(timer);
  }, [subIndex, index, deleting]);

  const typed = useMemo(
    () => (ROLES[index] ?? ROLES[0]).substring(0, subIndex),
    [index, subIndex],
  );

  return (
    <section
      id="home"
      className="w-full min-h-[100svh] relative bg-black overflow-hidden"
    >
      <ParticlesBackground />
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-linear-to-r from-[#302b63] via-[#2a5298] to-[#6dd5fa] opacity-30 sm:opacity-20 md:opacity-10 blur-[100px] sm:blur-[130px] md:blur-[150px] animate-pulse"
        />
        <div
          className="absolute bottom-0 right-0 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-linear-to-r from-[#302b63] via-[#2a5298] to-[#6dd5fa] opacity-30 sm:opacity-20 md:opacity-10 blur-[100px] sm:blur-[130px] md:blur-[150px] animate-pulse delay-500"
        />
      </div>

      <div className="relative z-10 min-h-[100svh] w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center h-full text-center lg:text-left relative">
          <div className="w-full lg:pr-24 mx-auto max-w-[48rem]">
            <motion.div
              className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide min-h-[1.6em]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>{typed}</span>
              <span
                className="inline-block w-[2px] ml-1 bg-white animate-pulse align-middle"
                style={{ height: "1em" }}
              />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(41,198,255)] via-[#0d46a9] to-[#40396c] drop-shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Hello, I&apos;m
              <br />
              <span className="text-white font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl lg:whitespace-nowrap">
                Suraj Gurung
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              I turn complex ideas into seamless, high-impact web experiences - building modern, scalable, and lightning-fast applications that make a difference.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <a
                href="#projects"
                className="px-6 py-3 rounded-full font-medium text-lg text-white bg-gradient-to-r from-[#6dd5fa] via-[#2a5298] to-[#302b53] shadow-lg hover:scale-105 transition-all"
              >
                View My Work
              </a>
              <a
                href="/Resume.pdf"
                download
                className="px-6 py-3 rounded-full text-lg font-medium text-black bg-white hover:bg-gray-200 shadow-lg hover:scale-105 transition-all"
              >
                My Resume
              </a>
            </motion.div>

            <div className="mt-10 flex gap-5 text-2xl md:text-3xl justify-center lg:justify-start">
              {socials.map(({ label, href }) => {
                const Icon = getSocialIcon(label);
                if (!Icon) return null;
                return (
                  <motion.a
                    href={href}
                    key={label}
                    target="_blank"
                    aria-label={label}
                    rel="noopener noreferrer"
                    variants={glowVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="text-gray-300"
                  >
                    <Icon aria-hidden="true" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              right: "10px",
              width: "min(22vw, 410px)",
              height: "min(40vw, 760px)",
              borderRadius: "50%",
              filter: "blur(38px)",
              opacity: 0.32,
              background: "conic-gradient(from 0deg,#302b63, #2a5298, #6dd5fa)",
            }}
            aria-hidden="true"
          />

          <Image
            src="/assets/avator.png"
            alt="Illustrated portrait of Suraj Gurung, Odoo ERP and full stack developer"
            width={780}
            height={760}
            priority
            // Without an explicit `sizes`, next/image assumes 100vw and serves
            // an oversized candidate for what is a ~410px-wide column.
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="absolute top-1/2 -translate-y-1/2 object-contain select-none pointer-events-none"
            style={{
              right: "-30px",
              width: "min(45vw,780px)",
              maxHeight: "90vh",
            }}
          />
        </div>
      </div>
    </section>
  );
}
