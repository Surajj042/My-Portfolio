"use client";

import { useEffect, useRef } from "react";

const COLORS = [
  "rgba(255,255,255,0.5)",
  "rgba(255,255,255,0.7)",
  "rgba(255,255,255,0.9)",
];

/** Scales with viewport area so phones don't pay for desktop-sized particle counts. */
function particleCountFor(width: number, height: number): number {
  const area = width * height;
  return Math.round(Math.min(50, Math.max(18, area / 24000)));
}

class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0]!;
    this.speedX = (Math.random() - 0.5) * 0.7;
    this.speedY = (Math.random() - 0.5) * 0.7;
    void ctx;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    this.draw(ctx);
  }
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect the OS-level motion preference: a permanently animating canvas
    // is exactly the kind of thing `prefers-reduced-motion` exists to stop.
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particles: Particle[] = [];

    function createParticles(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      const count = particleCountFor(w, h);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas!, ctx!));
      }
    }

    // Rendering runs only while the section is on screen AND the tab is visible.
    // Previously this loop never stopped, so every section that mounted the
    // canvas kept burning frames indefinitely even when scrolled past.
    let onScreen = false;
    let tabVisible = document.visibilityState === "visible";
    let animationId: number | null = null;

    function frame(): void {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) p.update(canvas, ctx);
      animationId = requestAnimationFrame(frame);
    }

    function sync(): void {
      const shouldRun = onScreen && tabVisible && !motionQuery.matches;
      if (shouldRun && animationId === null) {
        animationId = requestAnimationFrame(frame);
      } else if (!shouldRun && animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry ? entry.isIntersecting : false;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionChange = () => sync();
    motionQuery.addEventListener("change", onMotionChange);

    // Resize is debounced so dragging a window edge doesn't rebuild the
    // particle array on every frame of the drag.
    let resizeTimer: number | undefined;
    const onResize = () => {
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        createParticles();
        if (animationId === null && canvas.width > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }, 200);
    };
    window.addEventListener("resize", onResize);

    createParticles();
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", onResize);
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
      if (animationId !== null) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
}
