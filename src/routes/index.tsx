import { createFileRoute, Link } from "@tanstack/react-router";
import { DoorJourney } from "@/components/home/DoorJourney";
import { SectorCards } from "@/components/home/SectorCards";
import { VisualCarousel } from "@/components/home/VisualCarousel";
import { METRICS } from "@/lib/studio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Panchi Interior — Turnkey Interior Architecture, Indore" },
      {
        name: "description",
        content:
          "Panchi Interior is a turnkey interior architecture studio in Indore delivering residential, commercial, hospitality and bespoke millwork projects end to end.",
      },
      { property: "og:title", content: "Panchi Interior — Turnkey Interior Architecture, Indore" },
      {
        property: "og:description",
        content: "Spatial architecture and turnkey execution from Indore, Madhya Pradesh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <VisualCarousel />
      <DoorJourney />

      <SectorCards />

      <section className="border-y border-border bg-smoke/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 py-16 sm:py-20 lg:grid-cols-3">
          {METRICS.slice(0, 3).map((m) => (
            <div key={m.label} className="px-2">
              <p className="font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-none text-primary">
                {m.value}
              </p>
              <p className="mt-4 text-sm text-foreground">{m.label}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {m.unit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
        <p className="text-eyebrow">Next Step</p>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.1rem,6vw,4.25rem)] leading-[1] text-foreground">
          Bring us a plan, a shell, or just a plot number.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Consultations are held at the Indore studio or on site. Share your brief and we will
          respond with an indicative scope, timeline and budget band.
        </p>
        <Link
          to="/consultation"
          className="mt-10 inline-block rounded-full bg-primary px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open the consultation portal
        </Link>
      </section>
    </>
  );
}
