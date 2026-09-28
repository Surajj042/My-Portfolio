"use client";

import type { IconType } from "react-icons";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaJava,
  FaLinkedin,
  FaReact,
} from "react-icons/fa";
import { DiNodejs } from "react-icons/di";
import { TbBrandFramerMotion } from "react-icons/tb";
import { SiGit } from "react-icons/si";
import {
  SiC,
  SiCplusplus,
  SiChakraui,
  SiClerk,
  SiCss,
  SiDart,
  SiDocker,
  SiFirebase,
  SiFlutter,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiNextdotjs,
  SiOdoo,
  SiPostgresql,
  SiPython,
  SiRadixui,
  SiReacthookform,
  SiStripe,
  SiTanstack,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiReactrouter,
} from "react-icons/si";

/**
 * Key -> component registry for the skills marquee.
 *
 * Lives apart from `data/skills.ts` so the data module stays serialisable and
 * can be imported by Server Components; only this module touches react-icons.
 */
const iconRegistry: Record<string, IconType> = {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiC,
  SiCplusplus,
  SiDart,
  SiHtml5,
  SiCss,
  FaReact,
  FaJava,
  SiNextdotjs,
  SiTailwindcss,
  SiChakraui,
  SiRadixui,
  SiReactrouter,
  SiVite,
  DiNodejs,
  SiMongodb,
  SiPostgresql,
  SiOdoo,
  SiFirebase,
  SiTanstack,
  SiClerk,
  SiStripe,
  SiGooglegemini,
  SiFlutter,
  SiReacthookform,
  SiDocker,
  SiLinux,
  SiGit,
  TbBrandFramerMotion,
};

export function getSkillIcon(name: string): IconType | null {
  return iconRegistry[name] ?? null;
}

/**
 * Social network -> icon. `data/site.config.ts` deliberately holds only the
 * `label` and `href` so it stays serialisable for Server Components; the
 * component reference is resolved here on the client.
 */
const socialRegistry: Record<string, IconType> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
  Facebook: FaFacebook,
};

export function getSocialIcon(label: string): IconType | null {
  return socialRegistry[label] ?? null;
}
