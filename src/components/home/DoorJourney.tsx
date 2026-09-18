import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { Link } from "@tanstack/react-router";
import entryFoyer from "@/assets/panchi-entry-foyer.jpg";
import livingRoom from "@/assets/panchi-living-room.jpg";
import hall from "@/assets/panchi-hall.jpg";
import kitchen from "@/assets/panchi-kitchen.jpg";
import bedroom from "@/assets/panchi-bedroom.jpg";
import { STUDIO } from "@/lib/studio";
import {
  DOOR_PHASE_NO,
  DOOR_TIMELINE,
  INTRO_COPY_KEYFRAMES,
  LEAF_OPENNESS_KEYFRAMES,
  ROOM_COPY_KEYFRAMES,
  resolveDoorPhase,
  type DoorPhase,
} from "@/lib/door-timeline";

/* ── Mobile responsiveness gate ─────────────────────────────────────────────
 * On viewport < 768px we disable the heavy sticky 350vh scroll-jacking
 * container entirely. Each door stage is rendered as a clean vertical card
 * stack (StackedChapter) so headings never overlap or bleed.
 */
const MOBILE_BREAKPOINT = 768;
const FLUID_MOBILE = typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

const SCENES = [
  {
    no: "01",
    room: "The Threshold",
    transition: "The grand split",
    mechanism: "split",
    title: "Every story begins at the door.",
    body: "A considered entrance sets the tone for everything beyond it — stone, timber, light and a sense of arrival.",
    reveal:
      "Light is metered from the moment the pivot swings: a brass shadow line across travertine marks the threshold before a single room is read.",
    detail: "Travertine foyer · Walnut pivot door · Brushed brass",
    image: entryFoyer,
  },
  {
    no: "02",
    room: "Living Area",
    transition: "The pivot",
    mechanism: "pivot",
    title: "A room made for living well.",
    body: "Soft upholstery, quiet joinery and warm light come together in spaces that feel collected rather than decorated.",
    reveal:
      "Nothing here competes. The joinery holds a single tone, the bouclé one texture, and the lighting does the rest of the talking as evening arrives.",
    detail: "Bouclé lounge · Fumed walnut · 2700K lighting",
    image: livingRoom,
  },
  {
    no: "03",
    room: "The Hall",
    transition: "The rising screen",
    mechanism: "rise",
    title: "A passage with a point of view.",
    body: "Circulation becomes architecture through proportion, framed sightlines, artwork and a rhythm of light.",
    reveal:
      "A corridor earns its length when it frames rather than ferries. Sightlines are set on axis, so the hall reads as a gallery and never as a route.",
    detail: "Lime plaster · Hand-finished console · Art curation",
    image: hall,
  },
  {
    no: "04",
    room: "The Kitchen",
    transition: "The pocket doors",
    mechanism: "pocket",
    title: "The heart, precisely made.",
    body: "Bespoke cabinetry, natural stone and intelligent planning turn the everyday into a tactile ritual.",
    reveal:
      "Stone is chosen for how it wears, not how it photographs. Every cabinet run is set so the working triangle disappears the moment guests sit down.",
    detail: "Honed travertine · Walnut cabinetry · Integrated appliances",
    image: kitchen,
  },
  {
    no: "05",
    room: "The Bedroom",
    transition: "The soft reveal",
    mechanism: "soft",
    title: "A quieter kind of luxury.",
    body: "Material, scale and sunrise are composed for rest — a private room that holds the day gently.",
    reveal:
      "Rest is planned the way acoustics are: a soft envelope of wool, linen and shadow that holds the room quiet through the whole of the morning.",
    detail: "Upholstered bed · Fluted walnut · Sheer daylight",
    image: bedroom,
  },
] as const;

type Scene = (typeof SCENES)[number];
type Mechanism = Scene["mechanism"];
type LeafSide = "left" | "right" | "top" | "bottom";

/** Unified Door 04 ("pocket") atelier surface — sleek dark green/charcoal with
 * refined angular brass lines. Shared by all 5 doors; zero white anywhere. */
const SURFACE = "door-atelier-luxe";

/** Slim brass pull sizing — axis-swapped for a vertical split. */
const HANDLE = { w: "w-1", h: "h-40" };

const ROMAN: Record<Scene["no"], string> = {
  "01": "I",
  "02": "II",
  "03": "III",
  "04": "IV",
  "05": "V",
};

/** One tall scroll track hosts a single sticky cam viewport: 5 chapters ×
 * 260vh of travel + 100vh settle. The camera never unmounts, so Door N →
 * Door N+1 is one continuous fly-through, never an abrupt jump. */
const CHAPTER_DEPTH = 2.6;
const JOURNEY_HEIGHT = `calc(${SCENES.length * CHAPTER_DEPTH * 100}vh + 100svh)`;

/** Clamp helper for building cross-fade keyframe windows. */
function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function DoorFrame({ index }: { index: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true">
      <div className="absolute left-5 top-1/2 hidden -translate-y-1/2 font-mono text-[8px] uppercase tracking-[0.32em] text-brass/60 [writing-mode:vertical-rl] sm:block">
        Bespoke portal · 0{index + 1}
      </div>
    </div>
  );
}

/**
 * Decorative face of a door leaf. Hardware always sits on the inner edge — the
 * centre seam the two leaves meet at — and is re-oriented when the split runs
 * vertically, so no variant ever shows a bar lying across its own seam.
 */
function DoorSurface({ side, label }: { side: LeafSide; label: string }) {
  const vertical = side === "top" || side === "bottom";
  const seamInset = vertical
    ? side === "top"
      ? "top-6 sm:top-10"
      : "bottom-6 sm:bottom-10"
    : side === "left"
      ? "left-6 sm:left-10"
      : "right-6 sm:right-10";
  const seamAlign = vertical ? "left-1/2 -translate-x-1/2" : "top-1/2 -translate-y-1/2";
  const seamBar = vertical ? `${HANDLE.h} ${HANDLE.w}` : `${HANDLE.w} ${HANDLE.h}`;
  const barGradient = vertical ? "bg-gradient-to-r" : "bg-gradient-to-b";
  // The Roman numeral sits on the outer edge, opposite the hardware.
  const corner =
    side === "left"
      ? "bottom-10 right-10"
      : side === "right"
        ? "bottom-10 left-10"
        : side === "bottom"
          ? "left-10 top-10"
          : "left-10 bottom-10";

  return (
    <>
      {/* Pocket-door brass inlay — slim pull on the seam edge + one refined
          diagonal accent line on each leaf. */}
      <div
        className={`absolute ${seamAlign} ${seamInset} ${seamBar} ${barGradient} from-brass/30 via-brass to-brass/30 shadow-[0_0_18px_color-mix(in_oklab,var(--brass)_42%,transparent)]`}
      />
      <div className="pointer-events-none absolute -left-[12%] top-[64%] h-px w-[124%] rotate-[-14deg] bg-brass/45" />
      <div className="pointer-events-none absolute -left-[12%] top-[30%] h-px w-[124%] rotate-[-14deg] bg-brass/20" />
      <span className={`absolute ${corner} font-mono text-[9px] tracking-[0.3em] text-brass/50`}>
        {label}
      </span>
    </>
  );
}

/** The three motion families. Material and mechanism differ; the lifecycle never does. */
const MOTION_FAMILY: Record<Mechanism, "slide" | "swing" | "lift"> = {
  split: "slide",
  pivot: "swing",
  rise: "lift",
  pocket: "slide",
  soft: "slide",
};

/**
 * The two leaves of a single door. Every mechanism is a true dual split about
 * the same centre seam — `left-0 w-1/2` plus `right-0 w-1/2` tiles the viewport
 * exactly, so no variant can drift off-centre or double up at the seam. All
 * three motion families are driven by one shared `openness` curve, which is why
 * the four phases stay identical door to door.
 */
function DoorLeaves({ scene, openness }: { scene: Scene; openness: MotionValue<number> }) {
  const { mechanism } = scene;
  const family = MOTION_FAMILY[mechanism];
  const clearance = mechanism === "soft" ? "112%" : "104%";
  const label = ROMAN[scene.no];

  const travelNear = useTransform(openness, [0, 1], ["0%", `-${clearance}`]);
  const travelFar = useTransform(openness, [0, 1], ["0%", clearance]);
  const swingNear = useTransform(openness, [0, 1], ["0deg", "-108deg"]);
  const swingFar = useTransform(openness, [0, 1], ["0deg", "108deg"]);

  const leaf = `absolute z-20 overflow-hidden shadow-2xl will-change-transform ${SURFACE}`;

  // Door 03 — the leaves part about a horizontal seam instead of a vertical one.
  if (family === "lift") {
    return (
      <>
        <motion.div className={`${leaf} inset-x-0 top-0 h-1/2`} style={{ y: travelNear }}>
          <DoorSurface side="bottom" label={label} />
        </motion.div>
        <motion.div className={`${leaf} inset-x-0 bottom-0 h-1/2`} style={{ y: travelFar }}>
          <DoorSurface side="top" label={label} />
        </motion.div>
      </>
    );
  }

  // Door 02 — each leaf hinges on its outer jamb and swings clear of the frame.
  if (family === "swing") {
    return (
      <>
        <motion.div
          className={`${leaf} inset-y-0 left-0 w-1/2`}
          style={{
            rotateY: swingNear,
            transformOrigin: "left center",
            transformPerspective: 1800,
          }}
        >
          <DoorSurface side="right" label={label} />
        </motion.div>
        <motion.div
          className={`${leaf} inset-y-0 right-0 w-1/2`}
          style={{
            rotateY: swingFar,
            transformOrigin: "right center",
            transformPerspective: 1800,
          }}
        >
          <DoorSurface side="left" label={label} />
        </motion.div>
      </>
    );
  }

  // Doors 01, 04, 05 — the leaves retract straight out along the seam axis.
  return (
    <>
      <motion.div className={`${leaf} inset-y-0 left-0 w-1/2`} style={{ x: travelNear }}>
        <DoorSurface side="right" label={label} />
      </motion.div>
      <motion.div className={`${leaf} inset-y-0 right-0 w-1/2`} style={{ x: travelFar }}>
        <DoorSurface side="left" label={label} />
      </motion.div>
    </>
  );
}

/**
 * One chapter living inside the shared cam viewport. The parent
 * `CinematicJourney` owns a single scroll track; each slot derives a local
 * 0→1 `chapter` phase plus a global cross-fade `presence` and a slow
 * push-in `camScale` / lateral `camX`. Intro copy always fades fully,
 * leaves split to a clean room, then close into the next frame.
 */
function ChapterSlot({
  scene,
  index,
  journey,
}: {
  scene: Scene;
  index: number;
  journey: MotionValue<number>;
}) {
  const total = SCENES.length;
  const start = index / total;
  const end = (index + 1) / total;
  // Overlap windows in journey units — neighbours bleed into each other so the
  // handoff is a true cross-fade, never a cut to empty glass.
  const inA = index === 0 ? 0 : clamp01(start - 0.045);
  const inB = clamp01(start + 0.045);
  const outA = clamp01(end - 0.045);
  const outB = index === total - 1 ? 1 : clamp01(end + 0.045);
  const [phase, setPhase] = useState<DoorPhase>("intro");
  const [live, setLive] = useState(index === 0);
  // Mount flags follow opacity — not phase boundaries — so copy always fades
  // to absolute zero before unmounting. No pops, no stranded faded text.
  const [showIntro, setShowIntro] = useState(true);
  const [showRoom, setShowRoom] = useState(false);

  const chapter = useTransform(journey, [start, end], [0, 1]);
  // Cinematic cam-view: slow depth push + gentle lateral drift, alternating
  // direction per door so the walkthrough sways like a handheld rig.
  const presence = useTransform(journey, [inA, inB, outA, outB], [0, 1, 1, 0]);
  const camScale = useTransform(journey, [inA, (start + end) / 2, outB], [1.1, 1, 1.13]);
  const camX = useTransform(
    journey,
    [inA, outB],
    index % 2 === 0 ? ["-1.6%", "1.6%"] : ["1.6%", "-1.6%"],
  );
  // Fly-through veil peaks exactly on the boundary — the outgoing frame dives
  // through darkness into the next door. Always hooked; ignored on the finale.
  const veil = useTransform(
    journey,
    [clamp01(end - 0.032), end, clamp01(end + 0.032)],
    [0, 0.6, 0],
  );
  const showVeil = index < total - 1;

  // One 0 → 1 → 0 curve drives every leaf: fully shut through Phase 1, fully open
  // across Phase 3, shut again exactly at the end of Phase 4.
  const openness = useTransform(chapter, LEAF_OPENNESS_KEYFRAMES, [0, 1, 1, 0]);

  // Phase 1 copy holds over the closed leaves, then clears the seam during the
  // first part of Phase 2 — gone well before the leaves are half open.
  const introOpacity = useTransform(chapter, INTRO_COPY_KEYFRAMES, [1, 1, 0]);
  const introY = useTransform(chapter, [0, DOOR_TIMELINE.introGone], [0, -28]);

  // Phase 3 copy begins only after `leavesOpen`, so it can never arrive while the
  // seam is still travelling, and it is gone before the leaves meet again.
  const editorialOpacity = useTransform(chapter, ROOM_COPY_KEYFRAMES, [0, 1, 1, 0]);
  const editorialY = useTransform(
    chapter,
    [DOOR_TIMELINE.phase2End, DOOR_TIMELINE.copyIn],
    [34, 0],
  );

  // The interior settles as the leaves open, then holds perfectly still through
  // Phase 3 — a clean room, no drift while the copy is being read.
  const imageScale = useTransform(chapter, [0, DOOR_TIMELINE.leavesOpen], [1.26, 1]);
  const imageY = useTransform(chapter, [0, DOOR_TIMELINE.leavesOpen], ["2.4%", "0%"]);
  const scrim = useTransform(
    chapter,
    [0, DOOR_TIMELINE.phase1End, DOOR_TIMELINE.leavesOpen, DOOR_TIMELINE.leavesClose, 1],
    [0.5, 0.34, 0.14, 0.14, 0.46],
  );
  const sweep = useTransform(
    chapter,
    [DOOR_TIMELINE.sweepStart, DOOR_TIMELINE.sweepEnd],
    ["-120%", "130%"],
  );
  const railOpacity = useTransform(
    chapter,
    [0, 0.2, DOOR_TIMELINE.phase2End, DOOR_TIMELINE.phase3End, 1],
    [1, 1, 0.55, 0.55, 1],
  );

  // The only stateful part of the machine: which copy is allowed to exist in the
  // DOM at all. Guarded so a scroll pass only re-renders on a real phase change.
  // Presence promotion keeps off-screen doors out of the compositor for zero lag.
  useMotionValueEvent(chapter, "change", (value) => {
    const next = resolveDoorPhase(value);
    setPhase((current) => (current === next ? current : next));
  });
  useMotionValueEvent(introOpacity, "change", (v) => {
    setShowIntro((cur) => {
      const on = v > 0.01;
      return cur === on ? cur : on;
    });
  });
  useMotionValueEvent(editorialOpacity, "change", (v) => {
    setShowRoom((cur) => {
      const on = v > 0.01;
      return cur === on ? cur : on;
    });
  });
  useMotionValueEvent(presence, "change", (value) => {
    setLive((current) => {
      const on = value > 0.01;
      return current === on ? current : on;
    });
  });

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-espresso will-change-transform"
      style={{
        opacity: presence,
        scale: camScale,
        x: camX,
        zIndex: 10 + index,
        visibility: live ? "visible" : "hidden",
        pointerEvents: live ? "auto" : "none",
      }}
    >
      <div className="absolute inset-0 flex h-full items-center overflow-hidden">
        <motion.img
          src={scene.image}
          alt={`${scene.room} by Panchi Interior`}
          width={1600}
          height={1008}
          loading={index === 0 ? "eager" : "lazy"}
          className="absolute inset-0 size-full object-cover will-change-transform"
          style={{ scale: imageScale, y: imageY }}
        />
        <motion.div className="absolute inset-0 bg-espresso" style={{ opacity: scrim }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--espresso)_82%,transparent),transparent_48%,color-mix(in_oklab,var(--espresso)_58%,transparent))]" />

        <DoorFrame index={index} />
        <DoorLeaves scene={scene} openness={openness} />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-30 w-1/4 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--ivory)_18%,transparent),transparent)] blur-xl"
          style={{ x: sweep }}
        />

        {/* Phase 3 — second editorial set. Sits at z-10, beneath the leaves at z-20,
            so the closing doors pass in front of it, and unmounts once faded. */}
        {showRoom && (
          <motion.div
            className="absolute inset-0 z-10 flex items-end px-6 pb-14 sm:px-10 sm:pb-20"
            style={{ opacity: editorialOpacity, y: editorialY }}
          >
            <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div className="max-w-3xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
                  {scene.no} / {SCENES.length}
                </p>
                <h3 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.9] text-ivory">
                  {scene.room}
                </h3>
                <div className="mt-7 h-px max-w-sm bg-brass/70" />
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/75 sm:text-base">
                  {scene.reveal}
                </p>
              </div>
              <div className="border-l border-brass/40 pl-5 text-ivory/75">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-brass">
                  Material study
                </p>
                <p className="mt-4 text-sm leading-relaxed">{scene.detail}</p>
                <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/50">
                  {STUDIO.city} · {STUDIO.state}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Phase 1 — door title and intro copy over the closed leaves. Sits at
            z-50, above the leaves, and is removed from the DOM the instant it has
            faded so Phase 3 starts on empty glass. */}
        {showIntro && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-50 grid place-items-center px-6"
            style={{ opacity: introOpacity, y: introY }}
          >
            <div className="max-w-3xl text-center text-ivory">
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-brass">
                Door {scene.no} / {SCENES.length} · {scene.transition}
              </p>
              <h3 className="mt-6 font-display text-[clamp(2.2rem,5.5vw,5rem)] leading-[0.95]">
                {scene.title}
              </h3>
              <div className="mx-auto mt-7 h-10 w-px bg-brass/70" />
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ivory/75 sm:text-base">
                {scene.body}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          className="pointer-events-none absolute bottom-7 left-0 right-0 z-50 flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-[0.23em] text-ivory/55 sm:px-10"
          style={{ opacity: railOpacity }}
        >
          <span>{scene.room}</span>
          <span>Phase {DOOR_PHASE_NO[phase]} / 04</span>
        </motion.div>
        {/* Cinematic fly-through veil — peaks on the chapter boundary so the
            outgoing cam dives through darkness into the next door. */}
        {showVeil && (
          <motion.div
            aria-hidden="true"
            className="cam-vignette pointer-events-none absolute inset-0 z-40 bg-espresso/80"
            style={{ opacity: veil }}
          />
        )}
      </div>
    </motion.div>
  );
}

/**
 * Mobile, touch and reduced-motion fallback. Same content in the same order as
 * the staged version — closed leaves with the Phase 1 copy, then the opened room
 * with the Phase 3 copy — but as ordinary stacked sections with no scroll
 * coupling, so nothing can stutter on a low-powered device.
 */
function StackedChapter({ scene, index }: { scene: Scene; index: number }) {
  const label = ROMAN[scene.no];

  return (
    <section className="bg-espresso">
      {/* Phase 1 — closed leaves, door title and intro copy */}
      <div className="relative flex min-h-[62svh] items-center justify-center overflow-hidden bg-espresso px-6 py-20">
        <div className="absolute inset-0 grid grid-cols-2">
          <div className={`relative ${SURFACE}`}>
            <DoorSurface side="right" label={label} />
          </div>
          <div className={`relative ${SURFACE}`}>
            <DoorSurface side="left" label={label} />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-obsidian/60" />
        <div className="relative z-10 max-w-2xl text-center text-ivory">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Door {scene.no} / {SCENES.length} · {scene.transition}
          </p>
          <h3 className="mt-5 font-display text-[clamp(2rem,7vw,3.4rem)] leading-[0.98]">
            {scene.title}
          </h3>
          <div className="mx-auto mt-6 h-8 w-px bg-brass/70" />
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ivory/75">
            {scene.body}
          </p>
        </div>
      </div>

      {/* Phase 3 — the opened room and the second editorial set */}
      <div className="relative overflow-hidden">
        <img
          src={scene.image}
          alt={`${scene.room} by Panchi Interior`}
          width={1600}
          height={1008}
          loading={index === 0 ? "eager" : "lazy"}
          className="h-[52svh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--obsidian)_92%,transparent),color-mix(in_oklab,var(--obsidian)_35%,transparent)_55%,transparent)]" />
        <div className="absolute inset-0 flex items-end px-6 pb-10 sm:px-10">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
              {scene.no} / {SCENES.length}
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.8rem,6vw,3rem)] leading-[1] text-ivory">
              {scene.room}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/75">{scene.reveal}</p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/55">
              {scene.detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The scroll choreography only earns its cost on a wide, pointer-driven
 * viewport. Everything else — phones, touch devices, reduced motion — gets the
 * stacked layout. Uses the same capability check as ScrollJourney so the two
 * journeys stay consistent, and renders the safe layout on the server and on the
 * first paint, upgrading only once the device has proven capable.
 */
function useStagedJourney() {
  const [staged, setStaged] = useState(false);

  useEffect(() => {
    setStaged(
      window.innerWidth >= 768 &&
        window.matchMedia("(pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  return staged;
}

function JourneyIntro() {
  return (
    <section className="relative flex min-h-[82svh] items-end overflow-hidden bg-espresso px-6 pb-16 pt-28 text-ivory sm:px-10 sm:pb-24">
      <div className="absolute inset-0 bg-[linear-gradient(112deg,transparent_42%,color-mix(in_oklab,var(--brass)_14%,transparent)_72%,transparent)]" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-brass">
            Panchi Interior · Indore
          </p>
          <h2 className="mt-6 max-w-5xl font-display text-[clamp(3.8rem,10vw,10rem)] leading-[0.82]">
            A home is entered
            <br />
            <span className="text-brass">one room at a time.</span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-ivory/70 sm:text-lg">
            Turnkey interior architecture for residences with a point of view. Scroll forward —
            every threshold opens into a new volume.
          </p>
        </div>
        <div className="border-l border-brass/30 pl-5 text-sm leading-relaxed text-ivory/65">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass">The studio</p>
          <p className="mt-4">
            One contract. Civil, MEP, millwork, finishes, styling and handover — all resolved by one
            team in {STUDIO.city}.
          </p>
          <Link
            to="/consultation"
            className="mt-7 inline-flex border-b border-brass pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-brass transition-colors hover:text-ivory"
          >
            Begin a conversation →
          </Link>
        </div>
      </div>
      <div className="absolute bottom-7 left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-ivory/50 sm:left-10">
        Scroll to approach the first door ↓
      </div>
    </section>
  );
}

/**
 * The cinematic journey — ONE tall scroll track driving ONE sticky cam
 * viewport. `journey` runs 0→1 across all five doors; each ChapterSlot
 * cross-fades, push-zooms and sways within its window while its leaves run
 * the shared 0→1→0 lifecycle. No abrupt jumps, no isolated sections — a
 * continuous architectural walkthrough with zero white anywhere.
 */
function CinematicJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const journey = useTransform(scrollYProgress, (v) => clamp01(v));
  const [active, setActive] = useState(0);

  // Master dolly — the whole rig pushes forward across the full walkthrough.
  const dolly = useTransform(journey, [0, 1], [1, 1.07]);
  const meter = useTransform(journey, [0, 1], ["0%", "100%"]);
  const activeLabel = useTransform(journey, (v) => {
    const i = Math.min(SCENES.length - 1, Math.max(0, Math.floor(v * SCENES.length)));
    return `Door 0${i + 1} / 0${SCENES.length}`;
  });

  useMotionValueEvent(journey, "change", (v) => {
    const i = Math.min(SCENES.length - 1, Math.max(0, Math.floor(v * SCENES.length)));
    setActive((cur) => (cur === i ? cur : i));
  });

  return (
    <div ref={ref} className="relative bg-espresso" style={{ height: JOURNEY_HEIGHT }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-espresso">
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: dolly }}>
          {SCENES.map((scene, index) => (
            <ChapterSlot key={scene.no} scene={scene} index={index} journey={journey} />
          ))}
        </motion.div>

        {/* Global cam HUD — chapter pips + progress rail, always over the glass. */}
        <div className="pointer-events-none absolute left-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 sm:flex">
          {SCENES.map((scene, i) => (
            <span
              key={scene.no}
              className={`font-mono text-[9px] tracking-[0.2em] transition-colors duration-300 ${
                i === active ? "text-brass" : "text-ivory/30"
              }`}
            >
              {`0${i + 1}`}
            </span>
          ))}
          <div className="relative h-40 w-px overflow-hidden bg-ivory/15">
            <motion.div className="absolute left-0 top-0 w-px bg-brass" style={{ height: meter }} />
          </div>
          <motion.span className="font-mono text-[9px] tracking-[0.2em] text-brass">
            {activeLabel}
          </motion.span>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-50 flex items-center justify-between px-6 font-mono text-[10px] uppercase tracking-[0.24em] text-ivory/50 sm:px-10">
          <span>Architectural walkthrough · continuous cam</span>
          <span className="text-brass/80">Scroll to fly through ↓</span>
        </div>
      </div>
    </div>
  );
}


/**
 * Clean vertical cards for mobile, touch devices, and reduced-motion users.
 * Each door is a self-contained card in normal document flow â€” no absolute
 * overlays, no viewport-relative heights, no motion. Headings and copy sit in
 * stacked blocks with clear spacing so nothing bleeds or overlaps on small
 * screens.
 */
function MobileDoorCard({ scene, index }: { scene: Scene; index: number }) {
  return (
    <article
      className="relative mx-auto mb-10 max-w-2xl overflow-hidden rounded-sm bg-espresso px-6 py-10 sm:mb-14 sm:px-10 sm:py-14"
      style={{ scrollMarginTop: "120px" }}
    >
      {/* â”€â”€ Card 1: the closed door, title + intro copy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="mb-10 text-center sm:mb-12">
        {/* Door face â€” two leaves, left then right, rendered in normal flow so
            they never overlap the heading. Swap to a single centred leaf on the
            narrowest screens so the brass hardware stays legible. */}
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-4xl sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div className="flex items-start justify-end sm:justify-center sm:row-span-2">
            <div className=" h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
          </div>
          <div className=" h-44 sm:h-56" aria-hidden="true" />
          <div className=" h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
        </div>

        {/* Door label + Roman numeral */}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
          Door {scene.no} / {SCENES.length} Â· {scene.transition}
        </p>

        {/* Title â€” one block, never splits across lines into the copy below */}
        <h3 className="mt-4 font-display text-[clamp(1.6rem,6vw,2.4rem)] leading-[0.98] text-ivory">
          {scene.title}
        </h3>
        <div className="mx-auto mt-5 h-6 w-8 sm:h-8 sm:w-12 bg-brass/70" />

        {/* Intro copy */}
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/75">
          {scene.body}
        </p>
      </div>

      {/* â”€â”€ Card 2: the opened room, second editorial set â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="overflow-hidden rounded-sm sm:rounded-md sm:border sm:border-ivory/10">
        <img
          src={scene.image}
          alt={${scene.room} by Panchi Interior}
          width={1600}
          height={1008}
          loading={index === 0 ? "eager" : "lazy"}
          className="h-56 w-full object-cover sm:h-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--obsidian)_94%,transparent)_40%,transparent_78%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            {scene.no} / {SCENES.length}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.4rem,5vw,2rem)] leading-[1] text-ivory">
            {scene.room}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/75">
            {scene.reveal}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/50">
            {scene.detail}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Stacked card layout â€” the mobile, touch, and reduced-motion path. Five doors,
 * each a clean self-contained card in normal document flow with real vertical
 * spacing. No overlapping layers, no viewport-relative heights, no motion.
 */
function MobileJourney() {
  return (
    <section className="bg-espresso px-4 pb-20 sm:px-6 sm:pb-28">
      {/* Section eyebrow â€” separate from the door cards so it never overlaps. */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Architectural walkthrough</span>
          <span className="text-brass">05 doors</span>
        </div>
      </div>

      {/* Door cards â€” stacked in normal flow */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        {SCENES.map((scene, index) => (
          <MobileDoorCard key={scene.no} scene={scene} index={index} />
        ))}
      </div>
    </section>
  );
}


/**
 * Clean vertical cards for mobile, touch devices, and reduced-motion users.
 * Each door is a self-contained card in normal document flow â€” no absolute
 * overlays, no viewport-relative heights, no motion. Headings and copy sit in
 * stacked blocks with clear spacing so nothing bleeds or overlaps on small
 * screens.
 */
function MobileDoorCard({ scene, index }: { scene: Scene; index: number }) {
  return (
    <article
      className="relative mx-auto mb-10 max-w-2xl overflow-hidden rounded-sm bg-espresso px-6 py-10 sm:mb-14 sm:px-10 sm:py-14"
      style={{ scrollMarginTop: "120px" }}
    >
      {/* ---- Card 1: the closed door, title + intro copy ---- */}
      <div className="mb-10 text-center sm:mb-12">
        {/* Door face â€” two leaves, left then right, rendered in normal flow so
            they never overlap the heading. On the narrowest screens the two
            side leaves shrink so the brass hardware stays legible. */}
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-4xl sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div className="flex items-start justify-end sm:justify-center sm:row-span-2">
            <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
          </div>
          <div className="${SURFACE} h-44 sm:h-56" aria-hidden="true" />
          <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
        </div>

        {/* Door eyebrow â€” separate block, never collides with the title. */}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
          Door {scene.no} / {SCENES.length} Â· {scene.transition}
        </p>

        {/* Title â€” single block, clamped size, never wraps into the copy. */}
        <h3 className="mt-4 font-display text-[clamp(1.6rem,6vw,2.4rem)] leading-[0.98] text-ivory">
          {scene.title}
        </h3>

        {/* Divider rule â€” visual separation between title and body. */}
        <div className="mx-auto mt-5 h-6 w-8 sm:h-8 sm:w-12 bg-brass/70" />

        {/* Intro copy â€” capped width so it never runs edge to edge. */}
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/75">
          {scene.body}
        </p>
      </div>

      {/* ---- Card 2: the opened room, second editorial set ---- */}
      <div className="overflow-hidden rounded-sm sm:rounded-md sm:border sm:border-ivory/10">
        <img
          src={scene.image}
          alt={`${scene.room} by Panchi Interior`}
          width={1600}
          height={1008}
          loading={index === 0 ? "eager" : "lazy"}
          className="h-56 w-full object-cover sm:h-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--obsidian)_94%,transparent)_40%,transparent_78%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            {scene.no} / {SCENES.length}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.4rem,5vw,2rem)] leading-[1] text-ivory">
            {scene.room}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/75">
            {scene.reveal}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/50">
            {scene.detail}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Stacked card layout â€” the mobile, touch, and reduced-motion path. Five doors,
 * each a clean self-contained card in normal document flow with real vertical
 * spacing. No overlapping layers, no viewport-relative heights, no motion.
 */
function MobileJourney() {
  return (
    <section className="bg-espresso px-4 pb-20 sm:px-6 sm:pb-28">
      {/* Section eyebrow â€” separate from the door cards so it never overlaps. */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Architectural walkthrough</span>
          <span className="text-brass">05 doors</span>
        </div>
      </div>

      {/* Door cards â€” stacked in normal flow */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        {SCENES.map((scene, index) => (
          <MobileDoorCard key={scene.no} scene={scene} index={index} />
        ))}
      </div>
    </section>
  );
}


/**
 * Clean vertical cards for mobile, touch devices, and reduced-motion users.
 * Each door is a self-contained card in normal document flow â€” no absolute
 * overlays, no viewport-relative heights, no motion. Headings and copy sit in
 * stacked blocks with clear spacing so nothing bleeds or overlaps on small
 * screens.
 */
function MobileDoorCard({ scene, index }: { scene: Scene; index: number }) {
  return (
    <article
      className="relative mx-auto mb-10 max-w-2xl overflow-hidden rounded-sm bg-espresso px-6 py-10 sm:mb-14 sm:px-10 sm:py-14"
      style={{ scrollMarginTop: "120px" }}
    >
      {/* ---- Card 1: the closed door, title + intro copy ---- */}
      <div className="mb-10 text-center sm:mb-12">
        {/* Door face â€” two leaves, left then right, rendered in normal flow so
            they never overlap the heading. On the narrowest screens the two
            side leaves shrink so the brass hardware stays legible. */}
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-4xl sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div className="flex items-start justify-end sm:justify-center sm:row-span-2">
            <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
          </div>
          <div className="${SURFACE} h-44 sm:h-56" aria-hidden="true" />
          <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
        </div>

        {/* Door eyebrow â€” separate block, never collides with the title. */}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
          Door {scene.no} / {SCENES.length} Â· {scene.transition}
        </p>

        {/* Title â€” single block, clamped size, never wraps into the copy. */}
        <h3 className="mt-4 font-display text-[clamp(1.6rem,6vw,2.4rem)] leading-[0.98] text-ivory">
          {scene.title}
        </h3>

        {/* Divider rule â€” visual separation between title and body. */}
        <div className="mx-auto mt-5 h-6 w-8 sm:h-8 sm:w-12 bg-brass/70" />

        {/* Intro copy â€” capped width so it never runs edge to edge. */}
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/75">
          {scene.body}
        </p>
      </div>

      {/* ---- Card 2: the opened room, second editorial set ---- */}
      <div className="overflow-hidden rounded-sm sm:rounded-md sm:border sm:border-ivory/10">
        <img
          src={scene.image}
          alt={`${scene.room} by Panchi Interior`}
          width={1600}
          height={1008}
          loading={index === 0 ? "eager" : "lazy"}
          className="h-56 w-full object-cover sm:h-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--obsidian)_94%,transparent)_40%,transparent_78%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            {scene.no} / {SCENES.length}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.4rem,5vw,2rem)] leading-[1] text-ivory">
            {scene.room}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/75">
            {scene.reveal}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/50">
            {scene.detail}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Stacked card layout â€” the mobile, touch, and reduced-motion path. Five doors,
 * each a clean self-contained card in normal document flow with real vertical
 * spacing. No overlapping layers, no viewport-relative heights, no motion.
 */
function MobileJourney() {
  return (
    <section className="bg-espresso px-4 pb-20 sm:px-6 sm:pb-28">
      {/* Section eyebrow â€” separate from the door cards so it never overlaps. */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Architectural walkthrough</span>
          <span className="text-brass">05 doors</span>
        </div>
      </div>

      {/* Door cards â€” stacked in normal flow */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        {SCENES.map((scene, index) => (
          <MobileDoorCard key={scene.no} scene={scene} index={index} />
        ))}
      </div>
    </section>
  );
}


/**
 * Clean vertical cards for mobile, touch devices, and reduced-motion users.
 * Each door is a self-contained card in normal document flow â€” no absolute
 * overlays, no viewport-relative heights, no motion. Headings and copy sit in
 * stacked blocks with clear spacing so nothing bleeds or overlaps on small
 * screens.
 */
function MobileDoorCard({ scene, index }: { scene: Scene; index: number }) {
  return (
    <article
      className="relative mx-auto mb-10 max-w-2xl overflow-hidden rounded-sm bg-espresso px-6 py-10 sm:mb-14 sm:px-10 sm:py-14"
      style={{ scrollMarginTop: "120px" }}
    >
      {/* ---- Card 1: the closed door, title + intro copy ---- */}
      <div className="mb-10 text-center sm:mb-12">
        {/* Door face â€” two leaves, left then right, rendered in normal flow so
            they never overlap the heading. On the narrowest screens the two
            side leaves shrink so the brass hardware stays legible. */}
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-4xl sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div className="flex items-start justify-end sm:justify-center sm:row-span-2">
            <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
          </div>
          <div className="${SURFACE} h-44 sm:h-56" aria-hidden="true" />
          <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
        </div>

        {/* Door eyebrow â€” separate block, never collides with the title. */}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
          Door {scene.no} / {SCENES.length} Â· {scene.transition}
        </p>

        {/* Title â€” single block, clamped size, never wraps into the copy. */}
        <h3 className="mt-4 font-display text-[clamp(1.6rem,6vw,2.4rem)] leading-[0.98] text-ivory">
          {scene.title}
        </h3>

        {/* Divider rule â€” visual separation between title and body. */}
        <div className="mx-auto mt-5 h-6 w-8 sm:h-8 sm:w-12 bg-brass/70" />

        {/* Intro copy â€” capped width so it never runs edge to edge. */}
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/75">
          {scene.body}
        </p>
      </div>

      {/* ---- Card 2: the opened room, second editorial set ---- */}
      <div className="overflow-hidden rounded-sm sm:rounded-md sm:border sm:border-ivory/10">
        <img
          src={scene.image}
          alt={`${scene.room} by Panchi Interior`}
          width={1600}
          height={1008}
          loading={index === 0 ? "eager" : "lazy"}
          className="h-56 w-full object-cover sm:h-72"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_oklab,var(--obsidian)_94%,transparent)_40%,transparent_78%)]" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
            {scene.no} / {SCENES.length}
          </p>
          <h3 className="mt-2 font-display text-[clamp(1.4rem,5vw,2rem)] leading-[1] text-ivory">
            {scene.room}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/75">
            {scene.reveal}
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ivory/50">
            {scene.detail}
          </p>
        </div>
      </div>
    </article>
  );
}

/**
 * Stacked card layout â€” the mobile, touch, and reduced-motion path. Five doors,
 * each a clean self-contained card in normal document flow with real vertical
 * spacing. No overlapping layers, no viewport-relative heights, no motion.
 */
function MobileJourney() {
  return (
    <section className="bg-espresso px-4 pb-20 sm:px-6 sm:pb-28">
      {/* Section eyebrow â€” separate from the door cards so it never overlaps. */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Architectural walkthrough</span>
          <span className="text-brass">05 doors</span>
        </div>
      </div>

      {/* Door cards â€” stacked in normal flow */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        {SCENES.map((scene, index) => (
          <MobileDoorCard key={scene.no} scene={scene} index={index} />
        ))}
      </div>
    </section>
  );
}

export function DoorJourney() {
  const staged = useStagedJourney();

  return (
    <div className="bg-espresso">
      <JourneyIntro />
      {staged ? (
        <CinematicJourney />
      ) : (
        <MobileJourney />
      )}
    </div>
  );
}