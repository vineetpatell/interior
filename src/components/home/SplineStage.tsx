import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";
import { useEffect, useRef } from "react";

const SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/**
 * Spline scene. Lazy-loaded, never imported into the SSR graph.
 * The render loop is stopped whenever the hero leaves the viewport.
 */
export default function SplineStage({ active }: { active: boolean }) {
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    try {
      if (active) app.play();
      else app.stop();
    } catch {
      /* runtime not ready — ignore */
    }
  }, [active]);

  return (
    <Spline
      scene={SCENE_URL}
      onLoad={(app) => {
        appRef.current = app;
        if (!active) {
          try {
            app.stop();
          } catch {
            /* ignore */
          }
        }
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
