import { createFileRoute, Link } from "@tanstack/react-router";
import atelierImg from "@/assets/panchi-atelier.jpg";
import livingImg from "@/assets/panchi-living-room.jpg";
import { METRICS, STUDIO } from "@/lib/studio";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio — Panchi Interior, Indore" },
      {
        name: "description",
        content:
          "The story, philosophy and people behind Panchi Interior — a turnkey interior architecture studio in Indore delivering drawing to handover under one contract.",
      },
      { property: "og:title", content: "About the Studio — Panchi Interior" },
      {
        property: "og:description",
        content:
          "One contract, one standard — the philosophy behind Panchi Interior's turnkey practice in Indore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    no: "P-01",
    title: "One Contract, One Standard",
    body: "Design, millwork and execution are never split across vendors. A single contract holds every trade to the same drawing, the same tolerance and the same deadline — so nothing is ever 'someone else's scope'.",
  },
  {
    no: "P-02",
    title: "Drawn Before Built",
    body: "Every panel, socket and stone joint exists as a measured drawing before it exists on site. Site crews work from our workshop's own shop drawings, not interpretations of them.",
  },
  {
    no: "P-03",
    title: "Material Honesty",
    body: "We specify what we can hold, sample and stand behind. Marble is book-matched, veneer is from a single flitch, brass is left unlacquered to patina. Nothing pretends to be something it is not.",
  },
];

const VALUES = [
  ["Precision", "0.5 mm millwork tolerance, checked on site, not on paper."],
  ["Transparency", "Weekly site photography and an open cost ledger for every project."],
  ["Ownership", "A 12-month defect cover on every handover — we return, unasked."],
  ["Craft", "41 in-house craftsmen; the workshop and the studio share one roof."],
];

function AboutPage() {
  return (
    <div className="pb-28">
      <section className="mx-auto max-w-6xl px-6 pt-36 sm:pt-44">
        <p className="text-eyebrow">The Studio</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] text-foreground">
          Interiors built like architecture, finished like jewellery.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Panchi Interior is a turnkey interior architecture practice in Indore. We take a bare
          shell to a styled, commissioned home — survey, drawing, millwork, execution and handover —
          under one roof and one contract.
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-sm border border-border">
          <img
            src={atelierImg}
            alt="A craftsman fitting walnut veneer in the Panchi Interior workshop"
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-eyebrow">Since {STUDIO.est} · Indore</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            A workshop that happens to have a design studio attached.
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              The studio began the way most good buildings do — on site. Our founders spent years
              executing other people's drawings and watching good design fail at the handover
              between architect, contractor and carpenter.
            </p>
            <p>
              So Panchi Interior was formed to close that gap. Design, engineering, millwork and
              execution sit in one organisation, report to one project manager, and answer to one
              standard. When a drawer doesn't glide, there is no one else to call — there is only
              us.
            </p>
            <p>
              Today the practice delivers homes, workplaces, restaurants and flagship retail across
              Madhya Pradesh, with its own workshop producing veneer, solid oak and stone-clad
              millwork to drawing, not to catalogue.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-24 border-y border-border bg-smoke/40">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-eyebrow">How We Work</p>
          <div className="mt-10 grid gap-px sm:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.no} className="px-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                  {p.no}
                </p>
                <h3 className="mt-4 font-display text-2xl leading-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <p className="text-eyebrow">By the Numbers</p>
        <div className="mt-10 grid grid-cols-2 gap-px lg:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.label} className="px-2 py-6">
              <p className="font-display text-[clamp(2.2rem,6vw,3.8rem)] leading-none text-primary">
                {m.value}
              </p>
              <p className="mt-3 text-sm text-foreground">{m.label}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {m.unit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow">What We Hold Ourselves To</p>
            <ul className="mt-8 space-y-6">
              {VALUES.map(([title, body]) => (
                <li key={title} className="border-l border-primary/40 pl-5">
                  <h3 className="font-display text-xl text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-sm border border-border">
            <img
              src={livingImg}
              alt="A luxurious living room delivered turnkey by the studio"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6 text-center">
        <div className="brass-rule mx-auto max-w-xs" />
        <h2 className="mx-auto mt-10 max-w-2xl font-display text-[clamp(1.9rem,5vw,3.2rem)] leading-tight text-foreground">
          Come see the workshop before you commit to anything.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Studio visits are by appointment. Share your brief and we will set one up with the team
          who would actually run your project.
        </p>
        <Link
          to="/contact"
          className="mt-9 inline-block rounded-full bg-primary px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
