"use client";

import { useState } from "react";
import CustomCursor from "./components/CustomCursor";
import NavBar from "./components/NavBar";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import Home from "./sections/Home";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import IntroAnimation from "./components/IntroAnimation";

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  return (
    <>
      {/* Intro is a fixed overlay (z-[9999]) rendered ON TOP of the page.
          The full page content is always rendered in the DOM so that
          search engines can index it from the initial server HTML. */}
      {!introDone && <IntroAnimation onFinish={() => setIntroDone(true)} />}

      <div className="relative gradient text-white">
        <CustomCursor />
        <NavBar />
        <Home />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
