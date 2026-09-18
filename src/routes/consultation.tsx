import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { STUDIO } from "@/lib/studio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Studio Consultation — Panchi Interior, Indore" },
      {
        name: "description",
        content:
          "Share your brief with Panchi Interior's Indore studio. The intake form routes straight to our WhatsApp for a same-day response.",
      },
      { property: "og:title", content: "Studio Consultation — Panchi Interior" },
      {
        property: "og:description",
        content: "Send your project brief directly to the Indore studio on WhatsApp.",
      },
    ],
  }),
  component: ConsultationPage,
});

const SPACE_TYPES = ["Residential", "Commercial", "Hospitality", "Retail", "Bespoke Millwork"];
const BUDGETS = ["₹15 – 35 L", "₹35 – 75 L", "₹75 L – 1.5 Cr", "₹1.5 Cr +", "To be advised"];
const TIMELINES = ["Immediate", "1 – 3 months", "3 – 6 months", "Exploring"];

const field =
  "w-full rounded-sm border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none";
const labelCls = "text-eyebrow block";

function ConsultationPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    locality: "",
    spaceType: SPACE_TYPES[0]!,
    area: "",
    budget: BUDGETS[1]!,
    timeline: TIMELINES[1]!,
    brief: "",
  });
  const [touched, setTouched] = useState(false);

  const valid = form.name.trim().length > 1 && form.phone.trim().length >= 8;

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const message = [
      "PANCHI INTERIOR — Studio Consultation Request",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Locality: ${form.locality || "—"}`,
      `Space type: ${form.spaceType}`,
      `Approx. area: ${form.area || "—"}`,
      `Budget band: ${form.budget}`,
      `Timeline: ${form.timeline}`,
      "",
      `Brief: ${form.brief || "—"}`,
    ].join("\n");
    window.open(
      `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener",
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 sm:pt-44">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-eyebrow">Intake</p>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[0.95] text-foreground">
            Studio Consultation Portal
          </h1>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Fill the brief below. On submit it opens WhatsApp with your details formatted for our
            project desk — no account, no waiting on email. We respond the same working day.
          </p>
          <div className="brass-rule my-10" />
          <div className="space-y-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <p>WhatsApp {STUDIO.whatsappDisplay}</p>
            <p>{STUDIO.hours}</p>
            <p>
              {STUDIO.lat} / {STUDIO.lng}
            </p>
            <a
              href={STUDIO.mapsCid}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block text-primary underline-offset-4 hover:underline"
            >
              Studio location →
            </a>
          </div>
        </div>

        <form onSubmit={submit} className="glass-panel rounded-sm p-8 sm:p-10 md:col-span-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="name">
                Full name *
              </label>
              <input
                id="name"
                className={cn(
                  field,
                  "mt-3",
                  touched && form.name.trim().length < 2 && "border-destructive",
                )}
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="phone">
                Phone / WhatsApp *
              </label>
              <input
                id="phone"
                inputMode="tel"
                className={cn(
                  field,
                  "mt-3",
                  touched && form.phone.trim().length < 8 && "border-destructive",
                )}
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                placeholder="+91"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="locality">
                Site locality
              </label>
              <input
                id="locality"
                className={cn(field, "mt-3")}
                value={form.locality}
                onChange={(e) => set("locality")(e.target.value)}
                placeholder="Vijay Nagar, Indore"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="area">
                Approx. carpet area
              </label>
              <input
                id="area"
                className={cn(field, "mt-3")}
                value={form.area}
                onChange={(e) => set("area")(e.target.value)}
                placeholder="2,400 sq ft"
              />
            </div>
          </div>

          <div className="mt-8">
            <span className={labelCls}>Space type</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPACE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("spaceType")(t)}
                  className={cn(
                    "rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
                    form.spaceType === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="budget">
                Budget band
              </label>
              <select
                id="budget"
                className={cn(field, "mt-3")}
                value={form.budget}
                onChange={(e) => set("budget")(e.target.value)}
              >
                {BUDGETS.map((b) => (
                  <option key={b} value={b} className="bg-card">
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="timeline">
                Start timeline
              </label>
              <select
                id="timeline"
                className={cn(field, "mt-3")}
                value={form.timeline}
                onChange={(e) => set("timeline")(e.target.value)}
              >
                {TIMELINES.map((t) => (
                  <option key={t} value={t} className="bg-card">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className={labelCls} htmlFor="brief">
              Project brief
            </label>
            <textarea
              id="brief"
              rows={5}
              className={cn(field, "mt-3 resize-none")}
              value={form.brief}
              onChange={(e) => set("brief")(e.target.value)}
              placeholder="Tell us about the space, the stage it is at, and what you want it to feel like."
            />
          </div>

          {touched && !valid && (
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-destructive">
              Name and phone number are required.
            </p>
          )}

          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-primary px-8 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Send brief on WhatsApp
          </button>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Opens WhatsApp with your details pre-filled
          </p>
        </form>
      </div>
    </div>
  );
}
