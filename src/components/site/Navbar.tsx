import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV, STUDIO } from "@/lib/studio";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <nav
        className={cn(
          "pointer-events-auto w-full max-w-5xl rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6",
          scrolled
            ? "glass-panel shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]"
            : "border border-transparent",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="group flex items-baseline gap-2.5">
            <span className="font-display text-lg tracking-[0.18em] text-foreground sm:text-xl">
              PANCHI
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-primary">INTERIOR</span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV.slice(0, 6).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/consultation"
              className="hidden rounded-full border border-primary/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:inline-block"
            >
              Book Consultation
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-border p-2 text-foreground lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-full px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <span className="px-3 pt-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              {STUDIO.lat} / {STUDIO.lng}
            </span>
          </div>
        )}
      </nav>
    </header>
  );
}
