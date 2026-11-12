"use client";

import { useCallback, useRef } from "react";
import { TIMELINE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionHeading from "../ui/SectionHeading";

const css = `
.xp-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px}
.xp-intro{max-width:40ch;font-size:16px;line-height:1.6;color:var(--ink-2)}
.xp-wrap{position:relative;margin-top:64px}
.xp-line{position:relative;list-style:none;padding:0;display:grid;gap:28px}
.xp-track,.xp-fill{position:absolute;top:8px;bottom:8px;left:calc(170px + 20px);width:2px;margin-left:-1px;border-radius:2px}
.xp-track{background:var(--line)}
.xp-fill{background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p,0))}
.xp-stop{display:grid;grid-template-columns:170px 40px minmax(0,1fr);align-items:start}
.xp-date{padding-top:22px;text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--mute);line-height:1.5}
.xp-date b{display:block;font-family:var(--font-sans);font-size:30px;font-weight:700;letter-spacing:-.04em;color:var(--mute);line-height:1;margin-bottom:6px;
  transition:color .6s var(--ease)}
.xp-stop.lit .xp-date b{color:var(--ink)}
.xp-dot{justify-self:center;margin-top:26px;width:14px;height:14px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);
  position:relative;z-index:1;transition:box-shadow .5s var(--ease),background-color .5s var(--ease),transform .6s var(--ease)}
.xp-stop.lit .xp-dot{background:var(--ink);box-shadow:inset 0 0 0 2px var(--ink),0 0 0 6px rgba(13,13,13,.08);transform:scale(1.15)}
.xp-card{padding:26px 28px;transition:transform .7s var(--ease),box-shadow .5s var(--ease)}
.xp-stop.lit .xp-card{box-shadow:var(--hair),var(--lift)}
.xp-kind{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.xp-card h3{margin-top:10px;font-size:clamp(22px,2vw,28px);font-weight:700;letter-spacing:-.035em;line-height:1.1}
.xp-place{margin-top:6px;font-size:15px;color:var(--ink-2)}
.xp-place span{color:var(--mute)}
.xp-detail{margin-top:12px}
.xp-card ul{margin-top:16px;display:grid;gap:9px;list-style:none;padding:0}
.xp-card li{display:flex;gap:10px;font-size:14.5px;line-height:1.5;color:var(--ink-2)}
.xp-card li::before{content:"";flex:none;width:5px;height:5px;margin-top:9px;border-radius:50%;background:var(--ink)}
.xp-next .xp-card{background:transparent;box-shadow:none;border:1.5px dashed var(--faint);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px}
.xp-next h3{margin-top:4px}
@media (max-width: 760px){
  .xp-track,.xp-fill{left:7px}
  .xp-stop{grid-template-columns:14px minmax(0,1fr);column-gap:18px}
  .xp-date{grid-column:2;grid-row:1;text-align:left;padding-top:0;display:flex;align-items:baseline;gap:10px}
  .xp-date b{font-size:22px;margin:0}
  .xp-dot{grid-column:1;grid-row:1;margin-top:6px}
  .xp-card{grid-column:2;margin-top:10px;padding:20px}
}
`;

export default function Experience() {
  const listRef = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((p: number) => {
    const list = listRef.current;
    if (!list) return;
    list.style.setProperty("--p", p.toFixed(4));
    const line = window.innerHeight * 0.6;
    list.querySelectorAll<HTMLElement>(".xp-stop").forEach((stop) => {
      const dot = stop.querySelector(".xp-dot");
      if (dot) stop.classList.toggle("lit", dot.getBoundingClientRect().top < line);
    });
  }, []);
  useScrollProgress(listRef, onProgress, 0.6);

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="xp-head">
          <SectionHeading index="04" label="Experience" id="experience-title" accent="so far.">
            The path
          </SectionHeading>
          <p className="xp-intro rv">Education and work in one timeline, oldest first.</p>
        </div>

        <div className="xp-wrap" ref={listRef}>
          <span className="xp-track" aria-hidden="true" />
          <span className="xp-fill" aria-hidden="true" />
          <ol className="xp-line">
            {TIMELINE.map((s) => (
              <li key={`${s.place}-${s.start}`} className="xp-stop">
                <p className="xp-date">
                  <b>{s.year}</b>
                  <span>
                    {s.start} – {s.end}
                  </span>
                </p>
                <span className="xp-dot" aria-hidden="true" />
                <article className="card xp-card rv">
                  <span className="xp-kind">{s.kind === "work" ? "Work" : "Education"}</span>
                  <h3>{s.title}</h3>
                  <p className="xp-place">
                    {s.place} <span>· {s.location}</span>
                  </p>
                  {s.detail && <p className="chip xp-detail">{s.detail}</p>}
                  {s.bullets && (
                    <ul>
                      {s.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
            <li className="xp-stop xp-next">
              <p className="xp-date">
                <b>Next</b>
                <span>From Dec 2026</span>
              </p>
              <span className="xp-dot" aria-hidden="true" />
              <div className="card xp-card rv">
                <div>
                  <span className="xp-kind">Next</span>
                  <h3>Your team?</h3>
                </div>
                <a
                  href="#contact"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget("contact");
                  }}
                >
                  Let&apos;s talk
                </a>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
