import { useRef, useState } from "react";
import { SECTORS } from "@/lib/studio";

function Card({ sector }: { sector: (typeof SECTORS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ x: -py * 12, y: px * 14, active: true });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0, active: false })}
      style={{ perspective: "900px" }}
      className="group"
    >
      <div
        className="glass-panel relative h-full rounded-sm p-8 transition-[transform,box-shadow] duration-300 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${tilt.active ? 26 : 0}px)`,
          boxShadow: tilt.active
            ? "0 40px 90px -50px rgba(0,0,0,0.95), 0 0 0 1px rgba(180,145,79,0.28) inset"
            : "0 20px 60px -50px rgba(0,0,0,0.9)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at 50% 0%, rgba(180,145,79,0.16), transparent 60%)",
          }}
        />
        <p className="font-mono text-[10px] tracking-[0.28em] text-primary">{sector.code}</p>
        <h3 className="mt-5 font-display text-2xl leading-tight text-foreground sm:text-3xl">
          {sector.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{sector.body}</p>
        <div className="brass-rule my-6" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {sector.metric}
        </p>
      </div>
    </div>
  );
}

export function SectorCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <p className="text-eyebrow">Core Sectors</p>
      <h2 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[1] text-foreground">
        Four disciplines, one contract, one site standard.
      </h2>
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {SECTORS.map((s) => (
          <Card key={s.code} sector={s} />
        ))}
      </div>
    </section>
  );
}
