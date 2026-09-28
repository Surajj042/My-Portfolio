"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import CustomCursor from "./components/CustomCursor";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Experience from "./sections/Experience";
import Footer from "./sections/Footer";
import Home from "./sections/Home";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Testimonials from "./sections/Testimonials";
import IntroAnimation from "./components/IntroAnimation";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    // `reducedMotion="user"` makes every framer-motion animation below honour
    // the OS-level preference. The canvas, marquee and typewriter gate on the
    // same query themselves.
    <MotionConfig reducedMotion="user">
      {/* Fixed overlay rendered on top of the page. All content stays in the
          DOM so it is indexable from the initial server HTML. */}
      {!introDone && <IntroAnimation onFinish={() => setIntroDone(true)} />}

      <div className="relative gradient text-white">
        <CustomCursor />
        <Home />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </MotionConfig>
  );
}
