/**
 * Shared scroll timeline for the door journey. Deliberately free of React and
 * motion imports so the phase windows can be reasoned about — and asserted —
 * on their own, independent of any component.
 *
 * Four phases, as fractions of one section's scroll progress:
 *
 *   Phase 1  0.00 – 0.25  closed doors, intro title + copy
 *   Phase 2  0.25 – 0.55  leaves travel open, intro copy fades out and unmounts
 *   Phase 3  0.55 – 0.85  clean room view, second editorial set
 *   Phase 4  0.85 – 1.00  editorial fades out, leaves return to closed
 *
 * Every sub-window below sits strictly inside its own phase, so no two state
 * changes can land on the same frame and no copy can appear before its phase.
 */
export const DOOR_TIMELINE = {
  /** Phase boundaries. */
  phase1End: 0.25,
  phase2End: 0.55,
  phase3End: 0.85,

  /** Phase 1 — the intro copy begins to fade, still over closed leaves. */
  introHold: 0.22,
  /** Phase 2 — the intro copy reaches zero opacity and unmounts. */
  introGone: 0.34,
  /** Phase 2 — leaves fully open, the centre seam has stopped moving. */
  leavesOpen: 0.52,
  /** Phase 2 — the light sweep finishes while the leaves are still travelling. */
  sweepStart: 0.28,
  sweepEnd: 0.54,
  /** Phase 3 — the room copy is fully in. */
  copyIn: 0.66,
  /** Phase 4 — the room copy reaches zero opacity and unmounts. */
  copyGone: 0.93,
  /** Phase 4 — the leaves begin travelling back to closed. */
  leavesClose: 0.88,
};

export type DoorPhase = "intro" | "opening" | "room" | "exit";

/** Rail label per phase, so the on-screen numbering always matches the spec. */
export const DOOR_PHASE_NO: Record<DoorPhase, string> = {
  intro: "01",
  opening: "02",
  room: "03",
  exit: "04",
};

/** The single active phase for a 0–1 section progress. */
export function resolveDoorPhase(progress: number): DoorPhase {
  if (progress < DOOR_TIMELINE.phase1End) return "intro";
  if (progress < DOOR_TIMELINE.phase2End) return "opening";
  if (progress < DOOR_TIMELINE.phase3End) return "room";
  return "exit";
}

/**
 * Keyframes for the shared 0 → 1 → 0 leaf curve. Exported so the component and
 * any test consume the exact same numbers.
 */
export const LEAF_OPENNESS_KEYFRAMES = [
  DOOR_TIMELINE.phase1End,
  DOOR_TIMELINE.leavesOpen,
  DOOR_TIMELINE.leavesClose,
  1,
];

/** Keyframes for the Phase 1 copy: hold, then clear. */
export const INTRO_COPY_KEYFRAMES = [0, DOOR_TIMELINE.introHold, DOOR_TIMELINE.introGone];

/** Keyframes for the Phase 3 copy: in after the leaves settle, out in Phase 4. */
export const ROOM_COPY_KEYFRAMES = [
  DOOR_TIMELINE.phase2End,
  DOOR_TIMELINE.copyIn,
  DOOR_TIMELINE.phase3End,
  DOOR_TIMELINE.copyGone,
];
