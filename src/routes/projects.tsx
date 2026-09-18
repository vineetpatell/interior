import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CATEGORIES, PROJECTS, type Project } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Curated Projects — Panchi Interior, Indore" },
      {
        name: "description",
        content:
          "A curated portfolio of residential, commercial, hospitality and retail interiors delivered turnkey by Panchi Interior in Indore.",
      },
      { property: "og:title", content: "Curated Projects — Panchi Interior" },
      {
        property: "og:description",
        content:
          "Villas, workplaces, restaurants and flagship retail delivered turnkey from Indore.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [open, setOpen] = useState<Project | null>(null);

  const list = category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 sm:pt-44">
      <p className="text-eyebrow">Portfolio Index</p>
      <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] text-foreground">
        Curated Projects
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Six representative works from the studio's Indore practice. Select any project for the full
        brief, material palette and delivered scope.
      </p>

      <div className="mt-12 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
              category === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {list.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setOpen(p)}
            className="glass-panel group rounded-sm p-8 text-left transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="text-primary">{p.category}</span>
              <span>{p.year}</span>
            </div>
            <h2 className="mt-6 font-display text-2xl leading-tight text-foreground sm:text-3xl">
              {p.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
            <div className="mt-7 flex items-center gap-1.5">
              {p.palette.map((hex) => (
                <span
                  key={hex}
                  className="size-5 rounded-full border border-border"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <div className="brass-rule my-6" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {p.area} · {p.location} · {p.duration}
            </p>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-obsidian/85 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={() => setOpen(null)}
        >
          <div
            className="glass-panel animate-scale-in max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-sm bg-card/95 p-8 sm:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                  {open.category} · {open.year}
                </p>
                <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                  {open.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close project"
                className="shrink-0 rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="brass-rule my-7" />

            <dl className="grid grid-cols-2 gap-5 font-mono text-[10px] uppercase tracking-[0.18em] sm:grid-cols-4">
              {[
                ["Area", open.area],
                ["Location", open.location],
                ["Duration", open.duration],
                ["Delivery", "Turnkey"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mt-2 text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{open.narrative}</p>

            <p className="text-eyebrow mt-9">Material Palette</p>
            <div className="mt-4 flex gap-2">
              {open.palette.map((hex) => (
                <div key={hex} className="flex-1">
                  <div
                    className="h-14 rounded-sm border border-border"
                    style={{ backgroundColor: hex }}
                  />
                  <p className="mt-2 font-mono text-[9px] tracking-[0.12em] text-muted-foreground">
                    {hex}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-eyebrow mt-9">Delivered Scope</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {open.scope.map((s) => (
                <li key={s} className="font-mono text-[11px] tracking-[0.08em] text-foreground/80">
                  — {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
