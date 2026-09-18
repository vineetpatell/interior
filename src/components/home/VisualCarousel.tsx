import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import salonPoster from "@/assets/panchi-salon-hero.jpg";
import salonMotion from "@/assets/panchi-salon-motion.mp4.asset.json";
import dining from "@/assets/panchi-dining-wide.jpg";
import dressing from "@/assets/panchi-dressing-wide.jpg";
import staircase from "@/assets/panchi-staircase-wide.jpg";
import { Button } from "@/components/ui/button";
import { STUDIO } from "@/lib/studio";

const SLIDES = [
  {
    type: "video",
    src: salonMotion.url,
    poster: salonPoster,
    room: "The Salon",
    note: "Travertine · Walnut · Soft daylight",
  },
  {
    type: "image",
    src: dining,
    room: "The Dining Room",
    note: "Sculptural lighting · Natural stone",
  },
  {
    type: "image",
    src: dressing,
    room: "The Dressing Suite",
    note: "Bespoke millwork · Brushed brass",
  },
  {
    type: "image",
    src: staircase,
    room: "The Atrium",
    note: "Architectural volume · Quiet grandeur",
  },
] as const;

// The film only starts automatically on load, so its playback has to be driven
// explicitly once the user takes control of the carousel.
const VIDEO_INDEX = SLIDES.findIndex((slide) => slide.type === "video");

export function VisualCarousel() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const touchStart = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const move = useCallback((direction: number) => {
    setActive((current) => (current + direction + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!playing || reduceMotion) return;
    const timer = window.setInterval(() => move(1), 6500);
    return () => window.clearInterval(timer);
  }, [move, playing]);

  // `autoPlay` is only honoured at load time, so toggling the control on its own
  // would leave the film looping underneath a "paused" carousel. Mirror the
  // playing/active state onto the element instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && active === VIDEO_INDEX) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [playing, active]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Panchi Interior signature spaces"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const end = event.changedTouches[0]?.clientX;
        if (touchStart.current === null || end === undefined) return;
        const distance = end - touchStart.current;
        if (Math.abs(distance) > 50) move(distance > 0 ? -1 : 1);
        touchStart.current = null;
      }}
      className="grain relative min-h-[88svh] overflow-hidden bg-obsidian outline-none"
    >
      {SLIDES.map((slide, index) => (
        <div
          key={slide.room}
          aria-hidden={active !== index}
          className={`absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none ${
            active === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {slide.type === "video" ? (
            <video
              ref={videoRef}
              className="size-full object-cover"
              src={slide.src}
              poster={slide.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={slide.src}
              alt={`${slide.room} luxury interior by Panchi Interior`}
              className={`size-full object-cover ${active === index ? "motion-safe:animate-[carousel-drift_7s_ease-out_both]" : ""}`}
              width={1920}
              height={1080}
              loading={index === 1 ? "eager" : "lazy"}
            />
          )}
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--obsidian)_68%,transparent),transparent_45%,color-mix(in_oklab,var(--obsidian)_88%,transparent))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--obsidian)_72%,transparent),transparent_64%)]" />

      <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-end px-6 pb-24 pt-32 sm:px-10 sm:pb-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brass">
          {STUDIO.city} · Interior Architecture
        </p>
        <h1 className="mt-5 max-w-5xl font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.84] text-ivory">
          Spaces with a<span className="block text-brass">point of view.</span>
        </h1>
        <div className="mt-7 flex max-w-2xl flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ivory/75">
          <span>{SLIDES[active]?.room ?? SLIDES[0].room}</span>
          <span className="hidden h-px w-12 bg-brass/60 sm:block" />
          <span>{SLIDES[active]?.note ?? SLIDES[0].note}</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:right-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => move(-1)}
          aria-label="Previous space"
          className="rounded-full border-transparent bg-obsidian/45 text-ivory backdrop-blur-md hover:bg-ivory hover:text-obsidian"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPlaying((value) => !value)}
          aria-label={playing ? "Pause carousel" : "Play carousel"}
          className="rounded-full border border-transparent bg-obsidian/45 text-ivory backdrop-blur-md hover:bg-ivory hover:text-obsidian"
        >
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => move(1)}
          aria-label="Next space"
          className="rounded-full border border-transparent bg-obsidian/45 text-ivory backdrop-blur-md hover:bg-ivory hover:text-obsidian"
        >
          <ChevronRight />
        </Button>
      </div>

      <div
        className="absolute bottom-8 left-6 z-20 flex gap-2 sm:left-10"
        aria-label={`Slide ${active + 1} of ${SLIDES.length}`}
      >
        {SLIDES.map((slide, index) => (
          <Button
            key={slide.room}
            type="button"
            variant="ghost"
            aria-label={`Show ${slide.room}`}
            onClick={() => setActive(index)}
            className={`h-6 min-w-0 rounded-none p-0 transition-all duration-500 after:h-px after:w-full after:content-[''] ${active === index ? "w-12 after:bg-brass" : "w-5 after:bg-ivory/35"}`}
          />
        ))}
      </div>
    </section>
  );
}
