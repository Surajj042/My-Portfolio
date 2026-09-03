"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";

const COLOR_VARIATIONS = [
  "#020617",
  "#0f172a",
  "#1e293b",
  "#0a2540",
  "#0b3c5d",
  "#312e81",
  "#4c1d95",
  "#030712",
  "#111827",
  "linear-gradient(135deg, #020617, #0a2540)",
  "linear-gradient(135deg, #1e293b, #020617)",
  "linear-gradient(135deg, #312e81, #020617)",
];

// Deterministic shuffle (seeded LCG PRNG) so the server-rendered colors always
// match the first client render — avoids hydration mismatches from Math.random().
const seededShuffle = (arr, seed) => {
  const copy = [...arr];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const INITIAL_COLOR_SEED = 1337;

const useIsMobile = (query = "(max-width : 639px)") => {
  // Initialize to the server value (false); the real value is set in the
  // effect below after hydration to avoid a server/client mismatch.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return isMobile;
};

export default function Projects() {
  const isMobile = useIsMobile();
  const sceneRef = useRef(null);

  // Start with a fixed seed so SSR and the first client render match, then
  // reshuffle randomly after hydration (the CSS transition makes it smooth).
  const [colorSeed, setColorSeed] = useState(INITIAL_COLOR_SEED);
  useEffect(() => {
    setColorSeed(Math.floor(Math.random() * 4294967296));
  }, []);

  const shuffledColors = useMemo(
    () => seededShuffle(COLOR_VARIATIONS, colorSeed),
    [colorSeed],
  );

  const projects = useMemo(() => {
    return [
      {
        title: "N-GVLH",
        link: "https://n-gvlh.vercel.app/",
        github: "https://github.com/Surajj042/n-gvlh_project-ii",
        bgColor: shuffledColors[0],
        image: isMobile ? "/assets/photo1.png" : "/assets/img1.png",
        width: isMobile ? 346 : 1902,
        height: isMobile ? 626 : 866,
      },
      {
        title: "Game-Hub",
        link: "https://game-hub-woad-theta-42.vercel.app",
        github: "https://github.com/Surajj042/Game-Hub",
        bgColor: shuffledColors[1],
        image: isMobile ? "/assets/photo2.png" : "/assets/img2.png",
        width: isMobile ? 566 : 1895,
        height: isMobile ? 764 : 852,
      },
      {
        title: "Realtime Collab",
        link: "https://realtime-collab-puce.vercel.app",
        github: "https://github.com/Surajj042/realtime-collab",
        bgColor: shuffledColors[2],
        image: isMobile ? "/assets/photo3.png" : "/assets/img3.png",
        width: isMobile ? 339 : 1919,
        height: isMobile ? 540 : 833,
      },
    ];
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const thresholds = projects.map((_, i) => (i + 1) / projects.length);
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = thresholds.findIndex((t) => v <= t);
    setActiveIndex(idx === -1 ? thresholds.length - 1 : idx);
  });

  const activeProject = projects[activeIndex];

  return (
    <section
      ref={sceneRef}
      id="projects"
      className="relative text-white"
      style={{
        height: `${100 * projects.length}vh`,
        background: activeProject.bgColor,
        transition: "background 400ms ease",
      }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center ">
        <h2
          className={`text-3xl font-semibold z-10 text-center ${isMobile ? "mt-4" : "mt-8"}`}
        >
          My Work
        </h2>

        <div
          className={`relative w-full flex-1 flex items-center justify-center ${isMobile ? "-mt-4" : ""}`}
        >
          {projects.map((project, idx) => (
            <div
              key={project.title}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${activeIndex === idx ? "opacity-100 z-20" : "opacity-0 z-0 sm:z-10"}`}
              style={{ width: "85%", maxWidth: "1200px" }}
            >
              <AnimatePresence mode="wait">
                {activeIndex === idx && (
                  <motion.h3
                    key={project.title}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`block text-center text-[clamp(2rem,6vw,5rem)] text-white/95 sm:absolute sm:-top-20 sm:left-[35%] lg:left-[-5%] sm:mb-0 italic font-semibold ${isMobile ? "-mt-24" : ""} `}
                    style={{
                      zIndex: 5,
                      textAlign: isMobile ? "center" : "left",
                    }}
                  >
                    {project.title}
                  </motion.h3>
                )}
              </AnimatePresence>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} Live Project`}
                className="relative w-full block cursor-pointer group"
              >
                <div
                  className={`relative w-full overflow-hidden bg-black/20 shadow-2xl md:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.7)] ${isMobile ? "mb-6 rounded-lg" : "mb-10 sm:mb-12 rounded-xl"}
        h-[62vh] sm:h-[66vh]`}
                  style={{ zIndex: 10, transition: "box-shadow 250ms ease" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={project.width}
                    height={project.height}
                    className="w-full h-full object-cover drop-shadow-xl md:drop-shadow-2xl"
                    style={{
                      position: "relative",
                      zIndex: 10,
                      filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.65))",
                      transition: "filter 200ms ease",
                    }}
                    loading="lazy"
                  />

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      zIndex: 11,
                      background:
                        "linear-gradient(100deg,rgba(0,0,0,0.12) 0% , rgba(0,0,0,0) 40%)",
                    }}
                  ></div>
                </div>
              </a>
            </div>
          ))}
        </div>

        <div
          className={`absolute z-50 ${isMobile ? "bottom-20" : "bottom-10 "}`}
        >
          <a
            href={activeProject?.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 font-semibold rounded-lg bg-white text-black hover:bg-gray-200 transition-all "
            aria-label={`View ${activeProject?.title}`}
          >
            View Project
          </a>
        </div>
      </div>
    </section>
  );
}
