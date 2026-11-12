"use client";

import { useEffect, useState, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True once (or while, if `once` is false) the element intersects the viewport. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  {
    threshold = 0.2,
    rootMargin = "0px",
    once = true,
  }: { threshold?: number | number[]; rootMargin?: string; once?: boolean } = {},
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}

/**
 * 0 → 1 progress of an element through a horizontal line at `line` (fraction of the viewport
 * height): 0 when the element's top reaches the line, 1 when its bottom does. One rAF per scroll.
 */
export function useScrollProgress<T extends HTMLElement>(ref: RefObject<T | null>, onProgress: (p: number) => void, line = 0.6) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * line - r.top) / Math.max(1, r.height);
      onProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, onProgress, line]);
}
