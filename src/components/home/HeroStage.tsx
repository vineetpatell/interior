import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { STUDIO } from "@/lib/studio";
import { CanvasRoom } from "./CanvasRoom";
import { StageBoundary } from "./StageBoundary";

const SplineStage = lazy(() => import("./SplineStage"));

function AmbientSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-obsidian">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(180,145,79,0.16),transparent_62%)]" />
      <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.03)_50%,transparent_65%)]" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
        Rendering spatial volume…
      </p>
    </div>
  );
}

export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [useSpline, setUseSpline] = useState(false);

  // Only attempt WebGL/Spline when the device actually supports it.
  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl2") || probe.getContext("webgl");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setUseSpline(Boolean(gl) && !reduced && window.innerWidth >= 768);
    } catch {
      setUseSpline(false);
    }
  }, []);

  // Pause the render loop whenever the hero leaves the viewport.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setActive(Boolean(entry?.isIntersecting)), {
      threshold: 0.05,
    });
    io.observe(el);
    const onVisibility = () => {
      if (document.hidden) setActive(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className="grain relative h-[100svh] w-full overflow-hidden bg-obsidian"
    >
      <div className="absolute inset-0">
        <ClientOnly fallback={<AmbientSkeleton />}>
          <StageBoundary fallback={<CanvasRoom active={active} />}>
            <Suspense fallback={<AmbientSkeleton />}>
              {useSpline ? <SplineStage active={active} /> : <CanvasRoom active={active} />}
            </Suspense>
          </StageBoundary>
        </ClientOnly>
      </div>

      {/* editorial overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,12,0.72),rgba(10,10,12,0.25)_38%,rgba(10,10,12,0.92))]" />

      <div className="pointer-events-none relative z-10 flex h-full flex-col justify-between px-6 pb-10 pt-28 sm:px-10 sm:pb-14">
        <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span>{STUDIO.lat}</span>
          <span className="hidden sm:inline">Turnkey Interior Architecture</span>
          <span>{STUDIO.lng}</span>
        </div>

        <div className="max-w-4xl">
          <p className="text-eyebrow">Indore • Est. {STUDIO.est} • Commercial &amp; Residential</p>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,11vw,9rem)] leading-[0.88] tracking-[0.02em] text-foreground">
            PANCHI
            <span className="block text-primary">INTERIOR</span>
          </h1>
          <div className="brass-rule mt-7 max-w-md" />
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Spatial Architecture &amp; Turnkey Execution — Indore
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Scroll to enter the site sequence ↓</span>
          <span className="hidden sm:inline">Drag / move cursor to orbit the volume</span>
        </div>
      </div>
    </section>
  );
}
