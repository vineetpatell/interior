import { Link } from "@tanstack/react-router";
import { NAV, SECTORS, STUDIO } from "@/lib/studio";

export function Footer() {
  return (
    <footer className="grain border-t border-border bg-obsidian">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-eyebrow">Studio</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
              Panchi Interior
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Turnkey interior architecture from Indore — drawing, millwork, execution and handover
              held under one contract and one standard.
            </p>
            <div className="mt-8 space-y-1 font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
              <p>LAT {STUDIO.lat}</p>
              <p>LNG {STUDIO.lng}</p>
              <a
                href={STUDIO.mapsCid}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block pt-2 text-primary underline-offset-4 hover:underline"
              >
                OPEN IN GOOGLE MAPS →
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-eyebrow">Index</p>
            <ul className="mt-5 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    activeProps={{ className: "text-foreground" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-eyebrow mt-8">Sectors</p>
            <ul className="mt-5 space-y-2.5">
              {SECTORS.map((s) => (
                <li key={s.code} className="text-sm text-muted-foreground">
                  {s.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-eyebrow">Contact</p>
            <address className="mt-5 space-y-4 text-sm not-italic leading-relaxed text-muted-foreground">
              <p className="text-foreground">{STUDIO.address}</p>
              <p>
                <a href={`mailto:${STUDIO.email}`} className="transition-colors hover:text-primary">
                  {STUDIO.email}
                </a>
              </p>
              <p>
                <a
                  href={`https://wa.me/${STUDIO.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-primary"
                >
                  WhatsApp {STUDIO.whatsappDisplay}
                </a>
              </p>
              <p className="font-mono text-[11px] tracking-[0.16em]">{STUDIO.hours}</p>
            </address>
            <Link
              to="/consultation"
              className="mt-8 inline-block rounded-full border border-primary/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Begin a Project
            </Link>
          </div>
        </div>

        <div className="brass-rule mt-14" />
        <div className="mt-6 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {STUDIO.est} {STUDIO.name} · {STUDIO.city}, {STUDIO.state}
          </span>
          <span>
            {STUDIO.lat} · {STUDIO.lng}
          </span>
        </div>
      </div>
    </footer>
  );
}
