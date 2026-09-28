"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import OverlayMenu from "./OverlayMenu";
import { navLinks } from "../data/site.config";
import { resolveNavHref, sectionIdFromHref } from "../lib/nav";
import { DESKTOP_QUERY } from "../lib/use-media-query";
import { useDoubleClick } from "../lib/use-double-click";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forceVisible, setForceVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const lastScrollY = useRef(0);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openAllProjects = useCallback(() => {
    router.push("/projects");
  }, [router]);
  const onProjectsDoubleClick = useDoubleClick(openAllProjects);

  useEffect(() => {
    const homeSection = document.querySelector("#home");
    if (!homeSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false;
        setForceVisible(isIntersecting);
        if (isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(homeSection);
    return () => observer.disconnect();
  }, []);

  /**
   * Which section is in view. Only meaningful on the home page, since the
   * case-study routes have none of these sections — hence the isHome guard.
   *
   * The observer is used purely as a cheap "something moved, re-evaluate"
   * trigger. The actual choice is geometric: the active section is the last one
   * whose top has passed a line 25% down the viewport. An earlier version kept
   * a Set of sections intersecting a band and took the first match in document
   * order, which reported the wrong link whenever a short section's boundary
   * sat inside that band.
   */
  useEffect(() => {
    if (!isHome) return;

    const sections = navLinks
      .map((item) => document.getElementById(sectionIdFromHref(item.href)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const resolveActive = () => {
      const line = window.innerHeight * 0.25;
      let candidate: HTMLElement | undefined;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) candidate = section;
      }
      // At the very bottom of the document a short final section can sit
      // entirely below the line; fall back to the last section in that case.
      setActiveSection(
        (candidate ?? sections[sections.length - 1])?.id ?? "home",
      );
    };

    const observer = new IntersectionObserver(resolveActive, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    for (const section of sections) observer.observe(section);

    // The observer fires on section boundaries crossing its band, but scroll is
    // the authoritative signal — drive both from the same resolver so the
    // highlighted link can never lag behind the scroll position.
    window.addEventListener("scroll", resolveActive, { passive: true });
    window.addEventListener("resize", resolveActive);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", resolveActive);
      window.removeEventListener("resize", resolveActive);
    };
  }, [isHome]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 24);

      if (forceVisible) {
        setVisible(true);
        return;
      }
      if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
        if (timerId.current) {
          clearTimeout(timerId.current);
          timerId.current = null;
        }
        timerId.current = setTimeout(() => setVisible(false), 3000);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [forceVisible]);

  // Growing the viewport past the `lg` breakpoint while the fullscreen mobile
  // overlay is open would otherwise leave it stranded over a desktop layout.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 py-3 border-b transition-all duration-300 ${
          scrolled
            ? "lg:bg-black/80 lg:backdrop-blur-md lg:border-white/10"
            : "lg:border-transparent"
        } ${
          // Hiding on scroll-down is a mobile affordance; on desktop the bar
          // stays pinned so the links are always reachable.
          visible ? "translate-y-0" : "-translate-y-full lg:translate-y-0"
        }`}
      >
        <div className="flex items-center space-x-2">
          <a
            href={isHome ? "#home" : "/"}
            className="flex items-center space-x-2 group"
          >
            <Image
              src="/assets/Logo.png"
              alt=""
              width={40}
              height={40}
              sizes="40px"
              priority
              className="cursor-pointer"
            />
            {/* `hidden sm:block` removed the only text in this link below 640px,
                leaving it with no accessible name at all on small screens.
                sr-only/not-sr-only keeps the name in the accessibility tree at
                every width while still hiding it visually on mobile. */}
            <div className="sr-only sm:not-sr-only text-2xl font-bold text-white cursor-pointer">
              SURAJJ
            </div>
          </a>
        </div>

        {/*
          Desktop navigation.

          Rendered and hidden with CSS rather than conditionally, so these links
          are present in the server-rendered HTML for crawlers on every route.
          `display:none` also keeps them out of the tab order and the
          accessibility tree while the mobile overlay is in use.
        */}
        <ul className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map((item) => {
            const isActive = isHome && activeSection === sectionIdFromHref(item.href);
            return (
              <li key={item.href}>
                <a
                  href={resolveNavHref(item.href, isHome)}
                  // A second click within 600ms opens the full project list
                  // instead of re-scrolling. The gesture is a shortcut, not the
                  // only route: "All projects" is linked under the grid on the
                  // home page, and /projects is in the sitemap.
                  {...(item.href === "#projects" && isHome
                    ? { onClick: onProjectsDoubleClick }
                    : {})}
                  aria-current={isActive ? "location" : undefined}
                  className={`group relative block py-2 text-[15px] font-medium transition-colors duration-300 focus:outline-none focus-visible:text-[#6DD5FA] ${
                    isActive
                      ? "text-[#6DD5FA]"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#6DD5FA] transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile-only trigger. */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white text-3xl focus:outline-none cursor-pointer"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="overlay-menu"
            aria-haspopup="dialog"
          >
            <FiMenu aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Was `hidden lg:block`, which left mobile with no nav CTA at all. */}
          <a
            href={resolveNavHref("#contact", isHome)}
            className="px-3 sm:px-5 py-2 rounded-full font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:opacity-90 transition-opacity duration-300 text-sm sm:text-base"
          >
            Reach Out
          </a>
        </div>
      </nav>
      <OverlayMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  );
}
