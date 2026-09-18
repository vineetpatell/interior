import { createFileRoute, Link } from "@tanstack/react-router";
import materialsImg from "@/assets/panchi-materials.jpg";
import atelierImg from "@/assets/panchi-atelier.jpg";
import penthouseImg from "@/assets/panchi-penthouse.jpg";
import { SECTORS, STAGES, SWATCHES } from "@/lib/studio";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Interior Architecture & Turnkey Execution, Indore" },
      {
        name: "description",
        content:
          "Residential and commercial interior architecture, turnkey execution, bespoke millwork, lighting design and styling — Panchi Interior's full service catalogue.",
      },
      { property: "og:title", content: "Services — Panchi Interior, Indore" },
      {
        property: "og:description",
        content:
          "Interior architecture, turnkey execution, bespoke millwork and lighting design — one contract, one standard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    code: "SV-01",
    title: "Interior Architecture",
    body: "The discipline beneath the decoration. We rework plans, move walls where structure allows, route MEP before finishes exist, and resolve every elevation to millimetre drawings before site work begins.",
    points: [
      "Space planning & structural coordination",
      "Civil, electrical & plumbing drawings",
      "3D visualisation & material resolution",
    ],
  },
  {
    code: "SV-02",
    title: "Turnkey Execution",
    body: "One contract carries the project from bare shell to handover. Civil, MEP, millwork, stone, paint, glass and soft furnishings run under a single project manager with weekly photographic reporting.",
    points: [
      "Single-point responsibility",
      "Weekly site reporting with photography",
      "Zero-snag handover with 12-month defect cover",
    ],
  },
  {
    code: "SV-03",
    title: "Bespoke Millwork",
    body: "Our own Indore workshop produces veneered, solid oak and stone-clad joinery to shop drawings — wardrobes, kitchens, panelling, doors and furniture that catalogue suppliers cannot match.",
    points: [
      "0.5 mm joinery tolerance",
      "Single-flitch veneer matching",
      "Soft-close hardware as standard",
    ],
  },
  {
    code: "SV-04",
    title: "Lighting Design",
    body: "Light is treated as a material. Layers of architectural, task and accent lighting are calculated — colour temperature, beam angle and lux level — then concealed so only the effect is visible.",
    points: [
      "Layered 2700K architectural lighting",
      "Concealed cove & grazing details",
      "Scene-based dimming calibration",
    ],
  },
  {
    code: "SV-05",
    title: "Commercial Fit-Out",
    body: "Workplaces, clinics and showrooms built for the hours people actually spend inside them — acoustics, ergonomics and brand presence resolved together, on a committed fit-out calendar.",
    points: [
      "Acoustic partition engineering",
      "Compliance & services integration",
      "90–150 day fit-out programmes",
    ],
  },
  {
    code: "SV-06",
    title: "Styling & Handover",
    body: "The last ten percent that makes a space feel inevitable: furniture curation, art, textiles and dressing, followed by deep clean, systems commissioning and a complete handover dossier.",
    points: [
      "Furniture, art & textile curation",
      "Systems testing & commissioning",
      "Warranties, circuit maps & care notes",
    ],
  },
];

function ServicesPage() {
  return (
    <div className="pb-28">
      <section className="mx-auto max-w-6xl px-6 pt-36 sm:pt-44">
        <p className="text-eyebrow">Services</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] text-foreground">
          Everything a space needs, from one desk.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Interior architecture, execution, millwork, light and styling — offered separately where
          it makes sense, delivered together where it matters most.
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <div
            key={s.code}
            className="glass-panel group rounded-sm p-7 transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              {s.code}
            </p>
            <h2 className="mt-4 font-display text-2xl leading-tight text-foreground">{s.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            <ul className="mt-5 space-y-1.5 border-t border-border pt-4">
              {s.points.map((pt) => (
                <li
                  key={pt}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/80"
                >
                  — {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-24 border-y border-border bg-smoke/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-eyebrow">Sectors We Serve</p>
            <div className="mt-8 space-y-6">
              {SECTORS.map((s) => (
                <div key={s.code} className="border-l border-primary/40 pl-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-foreground">{s.title}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                      {s.metric}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <img
              src={penthouseImg}
              alt="A completed penthouse lounge delivered by the studio"
              width={1024}
              height={1024}
              className="aspect-[4/3] w-full rounded-sm border border-border object-cover"
              loading="lazy"
            />
            <img
              src={atelierImg}
              alt="Craftsmanship inside the studio's own millwork workshop"
              width={1024}
              height={1024}
              className="aspect-[16/9] w-full rounded-sm border border-border object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <p className="text-eyebrow">How a Project Runs</p>
        <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((st) => (
            <div key={st.no} className="px-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                {st.no} · {st.days}
              </p>
              <h3 className="mt-4 font-display text-xl leading-tight text-foreground">
                {st.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{st.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="text-eyebrow">The Material Library</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
              Nothing enters a tender until you have held it.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Every specification is backed by a physical sample from our library — stone, veneer,
              metal, glass and upholstery — presented on a board you approve before execution.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SWATCHES.map((sw) => (
                <div key={sw.code} className="text-left">
                  <div
                    className="h-16 rounded-sm border border-border"
                    style={{ backgroundColor: sw.hex }}
                  />
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground">
                    {sw.name}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
                    {sw.code}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 overflow-hidden rounded-sm border border-border">
            <img
              src={materialsImg}
              alt="Marble, oak, brass and velvet samples from the studio material library"
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
          Tell us what the space has to do. We will design the rest.
        </h2>
        <Link
          to="/consultation"
          className="mt-9 inline-block rounded-full bg-primary px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
        >
          Book a consultation
        </Link>
      </section>
    </div>
  );
}
