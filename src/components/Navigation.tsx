"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

const css = `
.nav-progress{position:fixed;inset:0 0 auto 0;height:2px;z-index:60;pointer-events:none}
.nav-progress span{display:block;height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(var(--p,0))}
.nav{position:fixed;top:14px;left:0;right:0;z-index:50;pointer-events:none}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px}
.nav-brand{pointer-events:auto;display:flex;align-items:center;gap:12px;min-width:0}
.nav-mark{width:42px;height:42px;flex:none;border-radius:50%;display:grid;place-items:center;
  box-shadow:inset 0 0 0 1.5px var(--ink);font-weight:700;font-size:14px;letter-spacing:-.02em;
  transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
.nav-brand:hover .nav-mark{transform:rotate(360deg)}
.nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
.nav-name{font-weight:600;font-size:15px;letter-spacing:-.02em;white-space:nowrap;transition:opacity .5s var(--ease),transform .5s var(--ease)}
.nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
.nav-pill{pointer-events:auto;position:relative;display:flex;align-items:center;gap:2px;padding:5px;border-radius:999px;
  transition:background-color .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
.nav.is-scrolled .nav-pill{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  box-shadow:var(--hair),0 10px 30px -18px rgba(13,13,13,.35)}
.nav-ind{position:absolute;top:5px;left:0;height:calc(100% - 10px);border-radius:999px;background:var(--ink);
  transform:translateX(var(--x,0));width:var(--w,0);opacity:var(--o,0);
  transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s var(--ease)}
.nav-link{position:relative;z-index:1;height:36px;padding:0 15px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);
  transition:color .4s var(--ease)}
.nav-link:hover{color:var(--ink)}
.nav-link[aria-current="true"]{color:#fff}
.nav-menu-btn{display:none;pointer-events:auto;height:42px;padding:0 18px;border-radius:999px;font-weight:600;font-size:14px;
  background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:var(--hair)}
.nav-overlay{position:fixed;inset:0;z-index:70;background:var(--paper);display:flex;flex-direction:column;
  padding:20px var(--gutter) 40px;clip-path:circle(0% at calc(100% - 50px) 36px);visibility:hidden;
  transition:clip-path .9s var(--ease),visibility 0s .9s}
.nav-overlay.open{clip-path:circle(150% at calc(100% - 50px) 36px);visibility:visible;transition:clip-path .9s var(--ease),visibility 0s}
.nav-overlay header{display:flex;justify-content:space-between;align-items:center}
.nav-overlay ol{list-style:none;margin:auto 0;padding:0;display:grid;gap:6px}
.nav-overlay li{overflow:hidden}
.nav-overlay ol a{display:flex;align-items:baseline;gap:16px;font-size:clamp(40px,12vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1.05;
  transform:translateY(110%);transition:transform .9s var(--ease);transition-delay:calc(var(--i)*70ms + 200ms)}
.nav-overlay.open ol a{transform:none}
.nav-overlay ol a small{font-family:var(--font-mono);font-size:13px;font-weight:400;letter-spacing:0;color:var(--mute)}
.nav-overlay footer{font-family:var(--font-mono);font-size:13px;color:var(--mute)}
@media (max-width: 860px){
  .nav-pill{display:none}
  .nav-menu-btn{display:inline-flex;align-items:center}
}
`;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // scrolled state + top progress bar
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, y / max) : 0));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // active section
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const hero = document.getElementById("top");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { rootMargin: "-45% 0px -50% 0px" });
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  // sliding indicator
  const placeIndicator = useCallback(() => {
    const pill = pillRef.current;
    const ind = indRef.current;
    if (!pill || !ind) return;
    const link = pill.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!link) {
      ind.style.setProperty("--o", "0");
      return;
    }
    ind.style.setProperty("--x", `${link.offsetLeft}px`);
    ind.style.setProperty("--w", `${link.offsetWidth}px`);
    ind.style.setProperty("--o", "1");
  }, [active]);
  useLayoutEffect(placeIndicator, [placeIndicator]);
  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  // mobile overlay: Esc to close, scroll lock, focus management
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const first = overlayRef.current?.querySelector<HTMLElement>("button, a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // wait one frame so the scroll lock is released before scrolling
    requestAnimationFrame(() => scrollToTarget(id));
  };

  return (
    <>
      <style>{css}</style>
      <div className="nav-progress" ref={progressRef} aria-hidden="true">
        <span />
      </div>
      <nav className={`nav${scrolled ? " is-scrolled" : ""}`} aria-label="Primary">
        <div className="wrap">
          <a href="#top" className="nav-brand" onClick={go("top")}>
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nav-name">{PROFILE.name}</span>
          </a>
          <div className="nav-pill" ref={pillRef}>
            <span className="nav-ind" ref={indRef} aria-hidden="true" />
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                data-id={n.id}
                className="nav-link inline-flex items-center"
                aria-current={active === n.id ? "true" : undefined}
                onClick={go(n.id)}
              >
                {n.label}
              </a>
            ))}
          </div>
          <button
            ref={menuBtnRef}
            type="button"
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={overlayRef}
        className={`nav-overlay${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        <header>
          <span className="nav-mark" aria-hidden="true">
            {PROFILE.initials}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setOpen(false);
              menuBtnRef.current?.focus();
            }}
          >
            Close
          </button>
        </header>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={go(n.id)} style={{ ["--i" as string]: i }}>
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </a>
            </li>
          ))}
        </ol>
        <footer>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </footer>
      </div>
    </>
  );
}
