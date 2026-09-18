import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
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
 * One scroll-driven door stage. `openness` is a single 0 → 1 → 0 curve feeding
 * every leaf, which is what makes the open and close halves exact mirrors. The
 * only React state is `phase`, used purely to mount and unmount copy so no faded
 * text is ever left sitting in the DOM.
 */
function StagedChapter({ scene, index }: { scene: Scene; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<DoorPhase>("intro");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // One 0 → 1 → 0 curve drives every leaf: fully shut through Phase 1, fully open
  // across Phase 3, shut again exactly at the end of Phase 4.
  const openness = useTransform(scrollYProgress, LEAF_OPENNESS_KEYFRAMES, [0, 1, 1, 0]);

  // Phase 1 copy holds over the closed leaves, then clears the seam during the
  // first part of Phase 2 — gone well before the leaves are half open.
  const introOpacity = useTransform(scrollYProgress, INTRO_COPY_KEYFRAMES, [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, DOOR_TIMELINE.introGone], [0, -28]);

  // Phase 3 copy begins only after `leavesOpen`, so it can never arrive while the
  // seam is still travelling, and it is gone before the leaves meet again.
  const editorialOpacity = useTransform(scrollYProgress, ROOM_COPY_KEYFRAMES, [0, 1, 1, 0]);
  const editorialY = useTransform(
    scrollYProgress,
    [DOOR_TIMELINE.phase2End, DOOR_TIMELINE.copyIn],
    [34, 0],
  );

  // The interior settles as the leaves open, then holds perfectly still through
  // Phase 3 — a clean room, no drift while the copy is being read.
  const imageScale = useTransform(scrollYProgress, [0, DOOR_TIMELINE.leavesOpen], [1.26, 1]);
  const imageY = useTransform(scrollYProgress, [0, DOOR_TIMELINE.leavesOpen], ["2.4%", "0%"]);
  const imageBlur = useTransform(
    scrollYProgress,
    [0, DOOR_TIMELINE.leavesOpen],
    ["blur(9px)", "blur(0px)"],
  );
  const scrim = useTransform(
    scrollYProgress,
    [0, DOOR_TIMELINE.phase1End, DOOR_TIMELINE.leavesOpen, DOOR_TIMELINE.leavesClose, 1],
    [0.5, 0.34, 0.14, 0.14, 0.46],
  );
  const sweep = useTransform(
    scrollYProgress,
    [DOOR_TIMELINE.sweepStart, DOOR_TIMELINE.sweepEnd],
    ["-120%", "130%"],
  );
  const railOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, DOOR_TIMELINE.phase2End, DOOR_TIMELINE.phase3End, 1],
    [1, 1, 0.55, 0.55, 1],
  );

  // The only stateful part of the machine: which copy is allowed to exist in the
  // DOM at all. Guarded so a scroll pass only re-renders on a real phase change.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = resolveDoorPhase(value);
    setPhase((current) => (current === next ? current : next));
  });

  return (
    <section ref={ref} className="relative bg-background" style={{ height: SECTION_HEIGHT }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden bg-espresso">
        <motion.img
          src={scene.image}
          alt={`${scene.room} by Panchi Interior`}
          width={1600}
          height={1008}
          loading={index === 0 ? "eager" : "lazy"}
          className="absolute inset-0 size-full object-cover will-change-transform"
          style={{ scale: imageScale, y: imageY, filter: imageBlur }}
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
        {phase === "room" && (
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
        {phase === "intro" && (
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
      </div>
    </section>
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
    <section className="bg-background">
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

export function DoorJourney() {
  const staged = useStagedJourney();

  return (
    <div className="bg-background">
      <JourneyIntro />
      {SCENES.map((scene, index) =>
        staged ? (
          <StagedChapter key={scene.no} scene={scene} index={index} />
        ) : (
          <StackedChapter key={scene.no} scene={scene} index={index} />
        ),
      )}
    </div>
  );
}
