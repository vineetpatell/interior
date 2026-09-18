import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { PHASES } from "@/lib/studio";

type Phase = (typeof PHASES)[number];

function PhaseBody({ phase }: { phase: Phase }) {
  return (
    <>
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
        <span className="text-primary">Phase {phase.no}</span>
        <span>{phase.depth}</span>
      </div>
      <h3 className="mt-6 font-display text-[clamp(2rem,6.5vw,4.5rem)] leading-[0.95] text-foreground">
        {phase.title}
        <span className="block text-primary/80">{phase.sub}</span>
      </h3>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {phase.body}
      </p>
      <div className="brass-rule my-8" />
      <ul className="grid gap-3 sm:grid-cols-3">
        {phase.items.map((item) => (
          <li
            key={item}
            className="font-mono text-[11px] leading-relaxed tracking-[0.1em] text-foreground/80"
          >
            — {item}
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
        {phase.coord}
      </p>
    </>
  );
}

/** Motion-heavy 3D slide, only mounted on pointer desktops without reduced-motion. */
function DepthPhase({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const phase = PHASES[index]!;
  const span = 1 / PHASES.length;
  const start = index * span;
  const end = start + span;
  const [live, setLive] = useState(index === 0);

  const c = (n: number) => Math.min(1, Math.max(0, n));
  const opacity = useTransform(
    progress,
    [c(start - 0.08), c(start + 0.07), c(end - 0.09), c(end + 0.02)],
    [0, 1, 1, 0],
  );
  const z = useTransform(progress, [c(start - 0.1), c(end + 0.05)], [-620, 320]);
  const rotateX = useTransform(progress, [c(start - 0.1), c(end + 0.05)], [14, -10]);
  const rotateY = useTransform(progress, [c(start - 0.1), c(end + 0.05)], [-9, 7]);
  const scale = useTransform(
    progress,
    [c(start - 0.1), (start + end) / 2, c(end + 0.05)],
    [0.86, 1, 1.08],
  );
  const filter = useTransform(
    useTransform(
      progress,
      [c(start - 0.08), c(start + 0.08), c(end - 0.08), c(end + 0.02)],
      [10, 0, 0, 12],
    ),
    (b) => `blur(${b}px)`,
  );

  // Only promote to a compositor layer while this phase is on screen.
  useEffect(() => opacity.on("change", (v) => setLive(v > 0.01)), [opacity]);

  return (
    <motion.article
      style={{
        opacity,
        z,
        rotateX,
        rotateY,
        scale,
        filter,
        transformStyle: "preserve-3d",
        willChange: live ? "transform, opacity" : "auto",
        pointerEvents: live ? "auto" : "none",
      }}
      className="absolute inset-0 flex items-center"
    >
      <div className="glass-panel mx-auto w-full max-w-4xl rounded-sm px-7 py-10 sm:px-12 sm:py-14">
        <PhaseBody phase={phase} />
      </div>
    </motion.article>
  );
}

function DepthJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const meter = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const depthLabel = useTransform(scrollYProgress, (v) => `Z ${Math.round(-1400 + v * 1400)}`);
  const pctLabel = useTransform(
    scrollYProgress,
    (v) => `${String(Math.round(v * 100)).padStart(3, "0")}%`,
  );

  return (
    <section ref={ref} className="relative h-[350vh] bg-background">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(180,145,79,0.10),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:96px_96px]" />

        <div
          className="relative w-full px-6"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
        >
          <div
            className="transform-gpu relative h-[70vh]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {PHASES.map((p, i) => (
              <DepthPhase key={p.no} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">SEQ</span>
          <div className="relative h-56 w-px bg-border">
            <motion.div
              className="absolute left-0 top-0 w-px bg-primary"
              style={{ height: meter }}
            />
          </div>
          <motion.span className="font-mono text-[10px] tracking-[0.22em] text-primary">
            {pctLabel}
          </motion.span>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:px-10">
          <span>Site Sequence · 03 Phases</span>
          <motion.span className="text-primary">{depthLabel}</motion.span>
        </div>
      </div>
    </section>
  );
}

/** Native stacked layout — mobile, touch devices, and reduced-motion users. */
function StackedJourney() {
  return (
    <section className="relative bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Site Sequence</span>
          <span className="text-primary">03 Phases</span>
        </div>
        <div className="mt-8 space-y-6">
          {PHASES.map((p) => (
            <article
              key={p.no}
              className="glass-panel rounded-sm px-7 py-10 opacity-0 [animation:fade-in_0.5s_ease-out_forwards] sm:px-10"
            >
              <PhaseBody phase={p} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ScrollJourney() {
  const reduced = useReducedMotion();
  // Server + first paint render the safe stacked layout; upgrade only when the
  // device can actually afford the 350vh depth sequence.
  const [depth, setDepth] = useState(false);

  useEffect(() => {
    const capable =
      window.innerWidth >= 768 &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setDepth(capable);
  }, []);

  return depth && !reduced ? <DepthJourney /> : <StackedJourney />;
}
