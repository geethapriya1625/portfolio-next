"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

const LenisContext = createContext<{ current: Lenis | null }>({ current: null });

let lenisSingleton: Lenis | null = null;

/** Smooth-scroll to a section id (or the top). Falls back to native scrolling. */
export function scrollToTarget(id: string) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  if (lenisSingleton) {
    lenisSingleton.scrollTo(target, { offset: 0, duration: 1.2 });
  } else if (target === 0) {
    window.scrollTo({ top: 0 });
  } else {
    target.scrollIntoView();
  }
  if (typeof target !== "number") {
    // move focus for keyboard and screen-reader users without a second jump
    const heading = target.querySelector<HTMLElement>("h2, h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }
}

export function lockScroll(locked: boolean) {
  if (lenisSingleton) {
    if (locked) lenisSingleton.stop();
    else lenisSingleton.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    ref.current = lenis;
    lenisSingleton = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisSingleton = null;
      ref.current = null;
    };
  }, []);

  return <LenisContext.Provider value={ref}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);
