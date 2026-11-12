"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { PROFILE, asset } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

const css = `
.hero{position:relative;min-height:max(640px,100svh);overflow:hidden;isolation:isolate;background:var(--paper);
  --vh:min(96svh,1040px,calc((100vw - 2*var(--gutter))*.62));--hw:calc(var(--vh)*.8)}
.hero-ghost{position:absolute;left:50%;top:clamp(90px,16svh,170px);transform:translateX(-50%);z-index:-1;
  font-weight:800;font-size:clamp(120px,24vw,420px);line-height:.8;letter-spacing:-.06em;white-space:nowrap;padding:0 .12em;
  color:transparent;-webkit-text-stroke:1.5px rgba(13,13,13,.13);user-select:none;pointer-events:none;
  --m:linear-gradient(to right,#000 calc(50% - var(--hw)*.24 - 70px),transparent calc(50% - var(--hw)*.2),transparent calc(50% + var(--hw)*.2),#000 calc(50% + var(--hw)*.24 + 70px));
  -webkit-mask-image:var(--m);mask-image:var(--m)}
.hero-media{position:absolute;left:50%;bottom:0;transform:translateX(-50%);
  height:var(--vh);aspect-ratio:768/960;mix-blend-mode:multiply}
.hero-media video{width:100%;height:100%;object-fit:cover;
  -webkit-mask-image:linear-gradient(to bottom,#000 86%,transparent);mask-image:linear-gradient(to bottom,#000 86%,transparent)}
.hero-fade{position:absolute;inset:auto 0 0 0;height:90px;background:linear-gradient(to bottom,transparent,var(--paper));pointer-events:none}
.hero-left,.hero-right{position:absolute;bottom:clamp(40px,9svh,96px);z-index:2}
.hero-left{left:var(--gutter);width:calc((100% - var(--hw))/2 - var(--gutter) + 30px)}
.hero-right{right:var(--gutter);width:min(300px,calc((100% - var(--hw))/2 - var(--gutter)));
  display:flex;flex-direction:column;align-items:flex-start;gap:20px}
.hero-hello{font-family:var(--font-mono);font-size:13px;color:var(--mute);display:flex;align-items:center;gap:10px}
.hero-hello i{width:8px;height:8px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 4px rgba(13,13,13,.08)}
.hero h1{margin-top:18px;font-weight:700;font-size:clamp(44px,4.6vw,84px);line-height:.95;letter-spacing:-.045em}
.hero h1 em{display:block;font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.01em;color:var(--mute)}
.hero-loc{margin-top:22px;font-size:15px;color:var(--ink-2);max-width:30ch;line-height:1.5}
.hero-right p{font-size:15px;line-height:1.55;color:var(--ink-2)}
.hero-ctas{display:flex;flex-wrap:wrap;gap:10px}
.hero-sound{position:absolute;z-index:3;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;
  display:grid;place-items:center;right:12%;bottom:14%;transition:transform .5s var(--ease)}
.hero-sound:hover{transform:scale(1.08)}
.hero-sound svg{width:16px;height:16px}
.hero-sound .ping{position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 2px var(--ink);animation:hero-ping 1.8s var(--ease) infinite;pointer-events:none}
@keyframes hero-ping{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.9);opacity:0}}
.hero-scroll{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);z-index:2;font-family:var(--font-mono);font-size:11px;
  letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
@media (max-width: 900px){
  .hero{min-height:auto;padding-top:108px;display:flex;flex-direction:column;--vh:62svh}
  .hero-ghost{top:auto;bottom:calc(62svh - 40px);font-size:34vw}
  .hero-left,.hero-right{position:static;width:auto;padding-inline:var(--gutter)}
  .hero-left{order:1}
  .hero-media{order:2;position:relative;left:auto;transform:none;align-self:center;height:62svh;margin-top:12px}
  .hero-right{order:3;padding-top:20px;padding-bottom:56px;width:100%;max-width:520px}
  .hero-scroll{display:none}
}
`;

const PlayIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
    <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
  </svg>
);

export default function Hero() {
  preload(asset("/hero/poster.webp"), { as: "image", fetchPriority: "high" });
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const [sound, setSound] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const visibleRef = useRef(true);
  const allowPlayRef = useRef(true);

  const safePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || !visibleRef.current || !allowPlayRef.current) return Promise.resolve(false);
    return v.play().then(
      () => true,
      () => false,
    );
  }, []);

  // try sound-on autoplay, fall back to muted, unlock on first interaction
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.defaultMuted = true;

    if (prefersReducedMotion()) {
      // no autoplay; the sound button starts playback
      allowPlayRef.current = false;
      return;
    }

    let unlocked = false;
    const unlock = (e: Event) => {
      if (unlocked) return;
      if (soundBtnRef.current && e.target instanceof Node && soundBtnRef.current.contains(e.target)) return;
      unlocked = true;
      remove();
      v.muted = false;
      safePlay().then((ok) => {
        if (ok || !visibleRef.current) {
          setSound(true);
          setBlocked(false);
        } else {
          v.muted = true;
        }
      });
    };
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const remove = () => events.forEach((ev) => window.removeEventListener(ev, unlock, true));

    v.muted = false;
    safePlay().then((ok) => {
      if (ok) {
        setSound(true);
        unlocked = true;
        return;
      }
      v.muted = true;
      setSound(false);
      setBlocked(true);
      safePlay();
      events.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
    });
    return remove;
  }, [safePlay]);

  // pause when less than 35% of the hero is visible
  useEffect(() => {
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visibleRef.current = e.intersectionRatio >= 0.35;
        if (visibleRef.current) safePlay();
        else v.pause();
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [safePlay]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    allowPlayRef.current = true;
    if (sound) {
      v.muted = true;
      setSound(false);
      return;
    }
    v.muted = false;
    setBlocked(false);
    setSound(true);
    if (v.paused) safePlay();
  };

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTarget(id);
  };

  return (
    <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <style>{css}</style>
      <div className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </div>

      <div className="hero-media">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster={asset("/hero/poster.webp")}
          width={768}
          height={960}
          aria-label={`Short looping intro video of ${PROFILE.name} speaking`}
        >
          <source src={asset("/hero/hero.webm")} type="video/webm" />
          <source src={asset("/hero/hero.mp4")} type="video/mp4" />
        </video>
        <button
          ref={soundBtnRef}
          type="button"
          className="hero-sound"
          onClick={toggleSound}
          aria-label={sound ? "Turn intro sound off" : "Turn intro sound on"}
        >
          {blocked && <span className="ping" aria-hidden="true" />}
          {sound ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div className="hero-left">
        <p className="hero-hello rv">
          <i aria-hidden="true" /> Hi, I&apos;m {PROFILE.greetingName}
        </p>
        <h1 id="hero-title" className="rv-mask" style={{ ["--i" as string]: 1 }}>
          <span>
            Full Stack Software <em>Engineer.</em>
          </span>
        </h1>
        <p className="hero-loc rv" style={{ ["--i" as string]: 2 }}>
          Java · Spring Boot · Python · React. Based in {PROFILE.location}.
        </p>
      </div>

      <div className="hero-right">
        <p className="rv" style={{ ["--i" as string]: 2 }}>
          4 years shipping production software, strongest on the back end. MS Computer Science at the University of Georgia.
        </p>
        <div className="hero-ctas rv" style={{ ["--i" as string]: 3 }}>
          <a href="#work" className="btn btn-primary" onClick={go("work")}>
            Explore work
          </a>
          <a href="#contact" className="btn btn-secondary" onClick={go("contact")}>
            Let&apos;s talk
          </a>
          <a href={asset(PROFILE.resume)} className="btn btn-secondary" download>
            Résumé <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <span className="hero-scroll" aria-hidden="true">
        Scroll
      </span>
      <div className="hero-fade" aria-hidden="true" />
    </section>
  );
}
