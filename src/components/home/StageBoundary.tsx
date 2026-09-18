import { Component, type ReactNode } from "react";

/**
 * Catches any WebGL / network failure inside the 3D stage and swaps in the
 * atmospheric fallback instead of crashing the page.
 */
export class StageBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: unknown) {
    console.warn("[hero-stage] 3D scene unavailable, using fallback render", error);
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
