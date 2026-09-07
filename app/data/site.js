import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export const SITE_URL = "https://suraj-gurung.com.np";

export const socials = [
  {
    Icon: FaFacebook,
    label: "Facebook",
    href: "https://www.facebook.com/suraj.gurung.sg98",
  },
  {
    Icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/surajjgurung/",
  },
  {
    Icon: FaLinkedin,
    label: "Linkedin",
    href: "https://www.linkedin.com/in/suraj-gurung-574688207/",
  },
  { Icon: FaGithub, label: "Github", href: "https://github.com/Surajj042" },
];

export const glowVariants = {
  initial: {
    scale: 1,
    y: 0,
    filter: "drop-shadow(0 0 0 rgba(0,0,0,0))",
  },
  hover: {
    scale: 1.2,
    y: -3,
    filter:
      "drop-shadow(0 0 8px rgba(13,18,204,0.9)) drop-shadow(0 0 18px rgba(16,185,129,0.8))",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: { scale: 0.95, y: 0, transition: { duration: 0.08 } },
};
