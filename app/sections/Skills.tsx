"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { skills } from "../data/skills";
import { getSkillIcon } from "../lib/icons";

const SPEED = 80;

export default function Skills() {
  const reduceMotion = useReducedMotion();

  const [dir, setDir] = useState(-1);
  const [active, setActive] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const touchY = useRef<number | null>(null);

  const x = useMotionValue(0);

  // Duplicated once so the strip can wrap seamlessly. The second copy is a
  // visual continuation only — it used to be announced by screen readers,
  // meaning every skill was read out twice.
  const track = useMemo(
    () => [
      ...skills.map((s) => ({ skill: s, isClone: false })),
      ...skills.map((s) => ({ skill: s, isClone: true })),
    ],
    [],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry?.isIntersecting === true && entry.intersectionRatio > 0.1);
      },
      { threshold: [0.1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || reduceMotion) return;

    const onWheel = (e: WheelEvent) => setDir(e.deltaY > 0 ? -1 : 1);
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY.current == null) return;
      const current = e.touches[0]?.clientY;
      if (current == null) return;
      const delta = current - touchY.current;
      setDir(delta > 0 ? 1 : -1);
      touchY.current = current;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [active, reduceMotion]);

  useEffect(() => {
    if (!active || reduceMotion) return;

    let id: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let next = x.get() + SPEED * dir * dt;
      const loop = (trackRef.current?.scrollWidth ?? 0) / 2;

      if (loop > 0) {
        if (next <= -loop) next += loop;
        if (next >= 0) next -= loop;
      }
      x.set(next);
      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, dir, x, reduceMotion]);

  return (
    <section
      id="skills"
      className="min-h-[50vh] w-full pb-20 pt-16 flex flex-col items-center justify-center relative bg-black text-white overflow-hidden"
      ref={sectionRef}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#302b63] via-[#2a5298] to-[#6dd5fa] opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#302b63] via-[#2a5298] to-[#6dd5fa] opacity-20 blur-[120px] animate-pulse delay-500" />
      </div>

      <motion.h2
        className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38b3f4] via-[#397df2] to-[#302b63] z-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        My Skills
      </motion.h2>

      <motion.p
        className="mt-2 mb-8 text-white/90 text-base sm:text-lg z-10 text-center px-4"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Modern Applications | Modern Technologies
      </motion.p>

      <div className="relative w-full overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex gap-10 text-6xl text-[#52a4df]"
          style={{
            x: reduceMotion ? 0 : x,
            whiteSpace: "nowrap",
            willChange: "transform",
          }}
        >
          {track.map(({ skill, isClone }, i) => {
            const Icon = getSkillIcon(skill.icon);
            return (
              <div
                key={`${skill.name}-${i}`}
                className="flex flex-col items-center gap-2 min-w-[120px]"
                // Only the leading copy is exposed; the clone is decoration.
                aria-hidden={isClone || undefined}
                title={isClone ? undefined : skill.name}
              >
                <span className="hover:scale-125 transition-transform duration-300">
                  {Icon ? <Icon aria-hidden="true" /> : null}
                </span>
                <p className="text-sm">{skill.name}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
