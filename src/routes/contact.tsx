import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import receptionImg from "@/assets/panchi-reception.jpg";
import { STUDIO } from "@/lib/studio";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Studio Location — Panchi Interior, Indore" },
      {
        name: "description",
        content:
          "Visit, call or message Panchi Interior in Indore — studio address, WhatsApp, email, working hours and map location.",
      },
      { property: "og:title", content: "Contact — Panchi Interior, Indore" },
      {
        property: "og:description",
        content: "Studio address, WhatsApp, email and map — talk to Panchi Interior in Indore.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const waLink = `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(
    `Hello Panchi Interior,\n\nName: ${name || "—"}\nPhone: ${phone || "—"}\n\n${message || "I would like to discuss a project."}`,
  )}`;

  return (
    <div className="pb-28">
      <section className="mx-auto max-w-6xl px-6 pt-36 sm:pt-44">
        <p className="text-eyebrow">Contact</p>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.95] text-foreground">
          Start with a conversation.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Visit the studio, call, or send a note — whichever feels easiest. First consultations are
          free and carry no obligation.
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href={STUDIO.mapsCid}
          target="_blank"
          rel="noreferrer noopener"
          className="glass-panel group rounded-sm p-6 transition-transform duration-300 hover:-translate-y-1"
        >
          <MapPin className="size-4 text-primary" />
          <p className="text-eyebrow mt-4">Studio</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{STUDIO.address}</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            Open in Maps →
          </p>
        </a>
        <a
          href={`https://wa.me/${STUDIO.whatsapp}`}
          target="_blank"
          rel="noreferrer noopener"
          className="glass-panel group rounded-sm p-6 transition-transform duration-300 hover:-translate-y-1"
        >
          <MessageCircle className="size-4 text-primary" />
          <p className="text-eyebrow mt-4">WhatsApp</p>
          <p className="mt-2 text-sm text-foreground">{STUDIO.whatsappDisplay}</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            Message us →
          </p>
        </a>
        <a
          href={`mailto:${STUDIO.email}`}
          className="glass-panel group rounded-sm p-6 transition-transform duration-300 hover:-translate-y-1"
        >
          <Mail className="size-4 text-primary" />
          <p className="text-eyebrow mt-4">Email</p>
          <p className="mt-2 break-all text-sm text-foreground">{STUDIO.email}</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            Write to us →
          </p>
        </a>
        <div className="glass-panel rounded-sm p-6">
          <Clock className="size-4 text-primary" />
          <p className="text-eyebrow mt-4">Hours</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            Monday – Saturday
            <br />
            10:30 – 19:30 IST
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Sundays by appointment
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
        <div>
          <p className="text-eyebrow">Send a Note</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            A few lines is enough to begin.
          </h2>
          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="c-name" className="text-eyebrow mb-2 block">
                Your Name
              </label>
              <input
                id="c-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-sm border border-input bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="c-phone" className="text-eyebrow mb-2 block">
                Phone
              </label>
              <input
                id="c-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 ..."
                inputMode="tel"
                className="w-full rounded-sm border border-input bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="c-msg" className="text-eyebrow mb-2 block">
                About the Project
              </label>
              <textarea
                id="c-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Site location, size, and what you have in mind…"
                rows={5}
                className="w-full resize-none rounded-sm border border-input bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block w-full rounded-full bg-primary px-8 py-3.5 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
            >
              Send via WhatsApp
            </a>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your note opens in WhatsApp with the details pre-filled — nothing is stored on this
              website.
            </p>
          </div>
        </div>
        <div>
          <p className="text-eyebrow">Find the Studio</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            {STUDIO.city}, {STUDIO.state}.
          </h2>
          <div className="mt-8 overflow-hidden rounded-sm border border-border">
            <iframe
              title="Map showing the Panchi Interior studio location in Indore"
              src={`https://www.google.com/maps?q=${STUDIO.latNum},${STUDIO.lngNum}&z=15&output=embed`}
              width="600"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[380px] w-full border-0 sm:h-[440px]"
            />
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {STUDIO.lat} · {STUDIO.lng}
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-sm border border-border">
          <img
            src={receptionImg}
            alt="Reception of the Panchi Interior studio"
            width={1024}
            height={1024}
            className="h-64 w-full object-cover sm:h-80"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent p-8 sm:p-12">
            <div>
              <p className="text-eyebrow">Prefer a Form?</p>
              <h2 className="mt-3 font-display text-2xl leading-tight text-foreground sm:text-3xl">
                The consultation portal takes a fuller brief.
              </h2>
              <Link
                to="/consultation"
                className="mt-5 inline-block rounded-full border border-primary/40 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Open consultation portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
