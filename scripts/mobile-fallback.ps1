param([string]$File = "F:\Clients\interior\src\components\home\DoorJourney.tsx")

$src = [System.IO.File]::ReadAllText($File, [System.Text.UTF8Encoding]::new($true))
$marker = "export function DoorJourney()"
$idx = $src.IndexOf($marker)
if ($idx -lt 0) { exit 1 }

# Single-quoted here-string — NO variable expansion. This keeps ${SURFACE}
# literal in the output (so the TSX compiler resolves it) and prevents the
# marker token from being substituted a second time into the function sig.
$newTail = @'

/**
 * Clean vertical cards for mobile, touch devices, and reduced-motion users.
 * Each door is a self-contained card in normal document flow — no absolute
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
        {/* Door face — two leaves, left then right, rendered in normal flow so
            they never overlap the heading. On the narrowest screens the two
            side leaves shrink so the brass hardware stays legible. */}
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:max-w-4xl sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
          <div className="flex items-start justify-end sm:justify-center sm:row-span-2">
            <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
          </div>
          <div className="${SURFACE} h-44 sm:h-56" aria-hidden="true" />
          <div className="${SURFACE} h-44 w-28 sm:h-56 sm:w-24" aria-hidden="true" />
        </div>

        {/* Door eyebrow — separate block, never collides with the title. */}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
          Door {scene.no} / {SCENES.length} · {scene.transition}
        </p>

        {/* Title — single block, clamped size, never wraps into the copy. */}
        <h3 className="mt-4 font-display text-[clamp(1.6rem,6vw,2.4rem)] leading-[0.98] text-ivory">
          {scene.title}
        </h3>

        {/* Divider rule — visual separation between title and body. */}
        <div className="mx-auto mt-5 h-6 w-8 sm:h-8 sm:w-12 bg-brass/70" />

        {/* Intro copy — capped width so it never runs edge to edge. */}
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
 * Stacked card layout — the mobile, touch, and reduced-motion path. Five doors,
 * each a clean self-contained card in normal document flow with real vertical
 * spacing. No overlapping layers, no viewport-relative heights, no motion.
 */
function MobileJourney() {
  return (
    <section className="bg-espresso px-4 pb-20 sm:px-6 sm:pb-28">
      {/* Section eyebrow — separate from the door cards so it never overlaps. */}
      <div className="mx-auto max-w-4xl px-2 sm:px-0">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <span>Architectural walkthrough</span>
          <span className="text-brass">05 doors</span>
        </div>
      </div>

      {/* Door cards — stacked in normal flow */}
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
'@

# Normalise to CRLF on write to match the rest of the file
$newTail = $newTail -replace "`r`n", "`r`n"
[System.IO.File]::WriteAllText($File, $src.Substring(0, $idx) + $newTail, [System.Text.UTF8Encoding]::new($true))
Write-Output "Done. Replaced everything from the DoorJourney export marker onward."

