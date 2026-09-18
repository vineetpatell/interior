import { createFileRoute, Link } from "@tanstack/react-router";
import { STAGES, SWATCHES } from "@/lib/studio";

export const Route = createFileRoute("/turnkey")({
  head: () => ({
    meta: [
      { title: "Turnkey Workflow — Panchi Interior, Indore" },
      {
        name: "description",
        content:
          "Four stages from measured survey to zero-snag handover: how Panchi Interior delivers turnkey interiors in Indore under a single contract.",
      },
      { property: "og:title", content: "Turnkey Workflow — Panchi Interior" },
      {
        property: "og:description",
        content:
          "Survey, design, execution and handover — one contract, one project manager, one standard.",
      },
    ],
  }),
  component: TurnkeyPage,
});

function TurnkeyPage() {
  return (
    <div className="pb-28 pt-36 sm:pt-44">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-eyebrow">Method</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] text-foreground">
          The Turnkey Workflow
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          A single contract from measured survey to keys. Four stages, fixed deliverables, weekly
          reporting, and a twelve-month defect cover on everything we build.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-6">
        <div className="space-y-px">
          {STAGES.map((s) => (
            <article
              key={s.no}
              className="group grid gap-8 border-t border-border py-12 transition-colors hover:bg-accent/30 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <p className="font-display text-5xl leading-none text-primary sm:text-6xl">
                  {s.no}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.days}
                </p>
              </div>
              <div className="md:col-span-5">
                <h2 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
              <div className="md:col-span-4">
                <p className="text-eyebrow">Deliverables</p>
                <ul className="mt-4 space-y-2">
                  {s.deliverables.map((d) => (
                    <li
                      key={d}
                      className="font-mono text-[11px] tracking-[0.08em] text-foreground/80"
                    >
                      — {d}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <p className="text-eyebrow">Material Library</p>
        <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.9rem,5vw,3.25rem)] leading-[1.05] text-foreground">
          Specified as samples you can hold, never as catalogue codes.
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {SWATCHES.map((sw) => (
            <div key={sw.code} className="group">
              <div
                className="aspect-square rounded-sm border border-border transition-transform duration-300 group-hover:-translate-y-1"
                style={{ backgroundColor: sw.hex }}
              />
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-primary">{sw.code}</p>
              <p className="mt-1.5 text-sm text-foreground">{sw.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{sw.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-24 max-w-6xl px-6">
        <div className="glass-panel rounded-sm p-10 text-center sm:p-14">
          <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,5vw,3rem)] leading-[1.05] text-foreground">
            Stage 01 begins with a site visit.
          </h2>
          <Link
            to="/consultation"
            className="mt-8 inline-block rounded-full bg-primary px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Request a survey
          </Link>
        </div>
      </div>
    </div>
  );
}
