"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { timeline } from "../data/experience";

const KIND_STYLES: Record<string, string> = {
  education: "border-[#6dd5fa]/40 text-[#6dd5fa]",
  work: "border-emerald-400/40 text-emerald-300",
  project: "border-emerald-400/40 text-emerald-300",
  milestone: "border-pink-400/40 text-pink-300",
};

export default function Experience() {
  return (
    <section
      id="experience"
      className="w-full relative bg-black text-white py-24 px-4 sm:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Experience
        </motion.h2>
        <p className="mt-3 text-center text-gray-400 max-w-2xl mx-auto">
          An Odoo ERP role, independent full-stack work, and a Computer
          Engineering degree.
        </p>

        <ol className="mt-14 relative border-l border-white/15 pl-6 sm:pl-8 flex flex-col gap-10">
          {timeline.map((entry, i) => (
            <motion.li
              key={`${entry.period}-${entry.title}`}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <span
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-3 w-3 rounded-full bg-white/80 ring-4 ring-black"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">{entry.period}</span>
                <span
                  className={`text-[11px] uppercase tracking-wider border rounded-full px-2 py-0.5 ${
                    KIND_STYLES[entry.kind] ?? ""
                  }`}
                >
                  {entry.kind}
                </span>
              </div>

              <h3 className="mt-2 text-xl font-semibold text-white">
                {entry.href?.startsWith("/") ? (
                  <Link
                    href={entry.href}
                    className="hover:text-[#6dd5fa] transition-colors"
                  >
                    {entry.title}
                  </Link>
                ) : entry.href ? (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#6dd5fa] transition-colors"
                  >
                    {entry.title}
                  </a>
                ) : (
                  entry.title
                )}
              </h3>

              {entry.org && (
                <p className="mt-0.5 text-[#6dd5fa] text-sm">{entry.org}</p>
              )}

              <ul className="mt-3 flex flex-col gap-2">
                {entry.points.map((point) => (
                  <li
                    key={point}
                    className="text-gray-300 leading-relaxed flex gap-2"
                  >
                    <span aria-hidden="true" className="text-white/40">
                      &rarr;
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
