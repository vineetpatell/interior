import { createFileRoute, Link } from "@tanstack/react-router";
import livingImg from "@/assets/panchi-living-room.jpg";
import penthouseImg from "@/assets/panchi-penthouse.jpg";
import hallImg from "@/assets/panchi-hall.jpg";
import materialsImg from "@/assets/panchi-materials.jpg";
import kitchenImg from "@/assets/panchi-kitchen.jpg";
import receptionImg from "@/assets/panchi-reception.jpg";
import bedroomImg from "@/assets/panchi-bedroom.jpg";
import { PROJECTS } from "@/lib/studio";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Our Work — Case Studies by Panchi Interior, Indore" },
      {
        name: "description",
        content:
          "Case studies from Panchi Interior's turnkey practice — villas, workplaces, restaurants and flagship retail delivered from bare shell to handover in Indore.",
      },
      { property: "og:title", content: "Our Work — Case Studies by Panchi Interior" },
      {
        property: "og:description",
        content:
          "Villas, workplaces, restaurants and flagship retail — delivered turnkey from Indore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});

const CASE_IMAGES: Record<string, { src: string; alt: string }> = {
  "the-brass-courtyard": {
    src: livingImg,
    alt: "Brass-accented luxury living room from The Brass Courtyard",
  },
  "obsidian-house": {
    src: penthouseImg,
    alt: "Dark emerald and brass penthouse lounge from Obsidian House",
  },
  "the-ledger-office": {
    src: hallImg,
    alt: "Fluted oak circulation hall from The Ledger Office",
  },
  "atelier-56": {
    src: materialsImg,
    alt: "Marble, oak and brass material palette from Atelier 56",
  },
  "saffron-table": {
    src: kitchenImg,
    alt: "Warm culinary kitchen interior from Saffron Table",
  },
  "the-quiet-clinic": {
    src: receptionImg,
    alt: "Calm emerald reception interior from The Quiet Clinic",
  },
};

const OUTCOMES = [
  { value: "148", label: "Projects delivered turnkey", unit: "since 2026" },
  { value: "94%", label: "Handed over on the committed date", unit: "last 36 months" },
  { value: "0.7s", label: "Reverberation achieved at Saffron Table", unit: "acoustic vaults" },
  { value: "42dB", label: "Chamber-to-chamber privacy at The Ledger", unit: "laminated glazing" },
];

function WorkPage() {
  return (
    <div className="pb-28">
      <section className="mx-auto max-w-6xl px-6 pt-36 sm:pt-44">
        <p className="text-eyebrow">Our Work</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] text-foreground">
          Shells in, stories out.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Every project below was taken from bare concrete to a styled, commissioned space under a
          single contract. These are the works that explain how we think — the full index lives in{" "}
          <Link to="/projects" className="text-primary underline-offset-4 hover:underline">
            Curated Projects
          </Link>
          .
        </p>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6">
        <div className="space-y-20 sm:space-y-28">
          {PROJECTS.map((p, i) => {
            const img = CASE_IMAGES[p.slug] ?? { src: livingImg, alt: p.title };
            const flipped = i % 2 === 1;
            return (
              <article
                key={p.slug}
                className={`grid items-center gap-8 lg:grid-cols-12 ${flipped ? "" : ""}`}
              >
                <div
                  className={`overflow-hidden rounded-sm border border-border lg:col-span-7 ${
                    flipped ? "lg:order-2" : ""
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={1024}
                    height={1024}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className={`lg:col-span-5 ${flipped ? "lg:order-1" : ""}`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                    {String(i + 1).padStart(2, "0")} · {p.category} · {p.year}
                  </p>
                  <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                    {p.title}
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {p.summary}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {p.narrative}
                  </p>
                  <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.16em]">
                    {[
                      ["Area", p.area],
                      ["Location", p.location],
                      ["Duration", p.duration],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="mt-1.5 text-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-24 border-y border-border bg-smoke/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 py-16 sm:py-20 lg:grid-cols-4">
          {OUTCOMES.map((o) => (
            <div key={o.label} className="px-2">
              <p className="font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-none text-primary">
                {o.value}
              </p>
              <p className="mt-3 text-sm text-foreground">{o.label}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {o.unit}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-sm border border-border">
          <img
            src={bedroomImg}
            alt="A styled luxury bedroom from a recent handover"
            width={1024}
            height={1024}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-eyebrow">Your Space Next</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            Every project here started as an unsure phone call.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Most clients reach us with a plan file, a half-built shell, or just a plot number. The
            first conversation costs nothing and commits you to nothing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/consultation"
              className="rounded-full bg-primary px-7 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start your project
            </Link>
            <Link
              to="/projects"
              className="rounded-full border border-primary/40 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              View full index
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
