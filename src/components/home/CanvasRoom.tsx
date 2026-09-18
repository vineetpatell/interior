import { useEffect, useRef } from "react";

type Pt = { x: number; y: number; z: number };

/**
 * Interactive perspective "room" scene drawn on a 2D canvas.
 * Used as the guaranteed-safe fallback when Spline / WebGL is unavailable.
 * The rAF loop is fully suspended whenever `active` is false.
 */
export function CanvasRoom({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.tx = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.current.ty = (e.clientY - rect.top) / rect.height - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Architectural volume: a room shell plus an inner millwork block.
    const room: Pt[] = [
      { x: -3, y: -1.8, z: 2 },
      { x: 3, y: -1.8, z: 2 },
      { x: 3, y: 1.8, z: 2 },
      { x: -3, y: 1.8, z: 2 },
      { x: -3, y: -1.8, z: 9 },
      { x: 3, y: -1.8, z: 9 },
      { x: 3, y: 1.8, z: 9 },
      { x: -3, y: 1.8, z: 9 },
    ];
    const roomEdges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];

    const block: Pt[] = [
      { x: -1.1, y: -1.8, z: 5 },
      { x: 1.1, y: -1.8, z: 5 },
      { x: 1.1, y: 0.1, z: 5 },
      { x: -1.1, y: 0.1, z: 5 },
      { x: -1.1, y: -1.8, z: 6.6 },
      { x: 1.1, y: -1.8, z: 6.6 },
      { x: 1.1, y: 0.1, z: 6.6 },
      { x: -1.1, y: 0.1, z: 6.6 },
    ];

    const start = performance.now();

    const project = (p: Pt, ry: number, rx: number) => {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY - (p.z - 5.5) * sinY;
      const z1 = p.x * sinY + (p.z - 5.5) * cosY + 5.5;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = p.y * cosX - (z1 - 5.5) * sinX;
      const z2 = p.y * sinX + (z1 - 5.5) * cosX + 5.5;
      const f = 520 / Math.max(z2, 0.4);
      return { x: w / 2 + x1 * f * 0.55, y: h / 2 + y1 * f * 0.55, s: f };
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.045;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.045;

      const ry = Math.sin(t * 0.12) * 0.16 + pointer.current.x * 0.5;
      const rx = Math.sin(t * 0.09) * 0.05 + pointer.current.y * 0.22;

      ctx.clearRect(0, 0, w, h);

      // ambient light pool
      const g = ctx.createRadialGradient(
        w / 2 + pointer.current.x * 120,
        h * 0.45,
        0,
        w / 2,
        h * 0.5,
        Math.max(w, h) * 0.62,
      );
      g.addColorStop(0, "rgba(190,150,80,0.16)");
      g.addColorStop(0.45, "rgba(60,58,62,0.10)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // floor grid
      ctx.lineWidth = 1;
      for (let i = -6; i <= 6; i++) {
        const a = project({ x: i * 0.5, y: 1.8, z: 2 }, ry, rx);
        const b = project({ x: i * 0.5, y: 1.8, z: 9 }, ry, rx);
        ctx.strokeStyle = `rgba(235,230,220,${0.05 + Math.abs(6 - Math.abs(i)) * 0.006})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      for (let j = 0; j <= 14; j++) {
        const z = 2 + (j / 14) * 7;
        const a = project({ x: -3, y: 1.8, z }, ry, rx);
        const b = project({ x: 3, y: 1.8, z }, ry, rx);
        ctx.strokeStyle = `rgba(235,230,220,${0.06 - j * 0.003})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // room shell
      const rp = room.map((p) => project(p, ry, rx));
      ctx.strokeStyle = "rgba(235,230,220,0.22)";
      ctx.lineWidth = 1;
      roomEdges.forEach(([a, b]) => {
        const p1 = rp[a]!;
        const p2 = rp[b]!;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // fluted back wall
      for (let i = 1; i < 18; i++) {
        const x = -3 + (i / 18) * 6;
        const a = project({ x, y: -1.8, z: 9 }, ry, rx);
        const b = project({ x, y: 1.8, z: 9 }, ry, rx);
        ctx.strokeStyle = `rgba(180,145,79,${0.08 + 0.07 * Math.abs(Math.sin(i * 0.6 + t * 0.4))})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // millwork block, brass edges
      const bp = block.map((p) => project(p, ry, rx));
      ctx.strokeStyle = "rgba(200,164,96,0.65)";
      ctx.lineWidth = 1.2;
      roomEdges.forEach(([a, b]) => {
        const p1 = bp[a]!;
        const p2 = bp[b]!;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // corner nodes
      ctx.fillStyle = "rgba(216,183,114,0.9)";
      bp.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(loop);
    };

    const loop = (now: number) => {
      if (!activeRef.current) {
        // Suspend drawing entirely while off-screen; poll cheaply.
        raf = window.setTimeout(() => {
          raf = requestAnimationFrame(loop);
        }, 250) as unknown as number;
        return;
      }
      draw(now);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="size-full" aria-hidden />;
}
