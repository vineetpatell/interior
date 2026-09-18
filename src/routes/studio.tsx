import { createFileRoute } from "@tanstack/react-router";
import { METRICS, STUDIO } from "@/lib/studio";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "The Indore Studio — Panchi Interior" },
      {
        name: "description",
        content:
          "Inside Panchi Interior's Indore studio and workshop: craftsmanship metrics, site discipline and the team delivering turnkey interiors across Madhya Pradesh.",
      },
      { property: "og:title", content: "The Indore Studio — Panchi Interior" },
      {
        property: "og:description",
        content: "Craftsmanship metrics and site discipline from our Indore workshop.",
      },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  return (
    <div className="pb-28 pt-36 sm:pt-44">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-eyebrow">
          {STUDIO.lat} / {STUDIO.lng}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] text-foreground">
          The Indore Studio
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A drawing office and a millwork workshop under one roof on AB Road. Detailers sit twenty
          metres from the saw, which is why our drawings get built the way they were drawn.
        </p>
      </div>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="grid gap-px border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.label} className="border-b border-border py-10 pr-6">
              <p className="font-display text-[clamp(2.6rem,7vw,4.5rem)] leading-none text-primary">
                {m.value}
              </p>
              <p className="mt-4 text-sm text-foreground">{m.label}</p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {m.unit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-eyebrow">Site Craftsmanship</p>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,5vw,3.25rem)] leading-[1.05] text-foreground">
              Standards we hold on every live site.
            </h2>
          </div>
          <div className="md:col-span-7">
            <ul className="space-y-px">
              {[
                [
                  "Plumb & level",
                  "Walls checked at 3 mm over 3 metres before any finish is applied.",
                ],
                [
                  "Joinery tolerance",
                  "Shadow gaps held at 0.5 mm; every door and drawer calibrated at handover.",
                ],
                [
                  "Lighting",
                  "2700K standard, CRI 90+, every dimming curve tested against the styled room.",
                ],
                ["Stone", "Book-matched and dry-laid for approval before bonding — always."],
                [
                  "Documentation",
                  "Weekly photo report, circuit map and material register kept from day one.",
                ],
                [
                  "Safety & cleanliness",
                  "Daily site clean, PPE enforced, neighbours briefed on noise windows.",
                ],
              ].map(([title, body]) => (
                <li key={title} className="border-t border-border py-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                    {title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="glass-panel rounded-sm p-10 sm:p-14">
          <p className="text-eyebrow">Visit</p>
          <h2 className="mt-5 max-w-xl font-display text-[clamp(1.7rem,4.5vw,2.75rem)] leading-[1.1] text-foreground">
            {STUDIO.address}
          </h2>
          <div className="mt-8 grid gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:grid-cols-3">
            <p>LAT {STUDIO.lat}</p>
            <p>LNG {STUDIO.lng}</p>
            <p>{STUDIO.hours}</p>
          </div>
          <a
            href={STUDIO.mapsCid}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-block border-b border-primary/50 pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-primary hover:border-primary"
          >
            Open in Google Maps →
          </a>
        </div>
      </section>
    </div>
  );
}
