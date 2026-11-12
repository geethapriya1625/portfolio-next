"use client";

import { useRef, useState } from "react";
import { FAMILIES, SKILLS, SKILL_GROUPS, usedIn, type Skill, type SkillFamily } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";
import { TechLogo, brandTint, isBrand } from "../ui/TechLogo";

const css = `
.sk-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px}
.sk-intro{max-width:42ch;font-size:16px;line-height:1.6;color:var(--ink-2)}
.sk-filters{display:flex;flex-wrap:wrap;gap:8px;margin-top:40px}
.sk-filter{height:34px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:500;color:var(--ink-2);box-shadow:var(--hair);background:transparent;
  transition:background-color .35s var(--ease),color .35s var(--ease)}
.sk-filter:hover{color:var(--ink);background:var(--card)}
.sk-filter[aria-pressed="true"]{background:var(--ink);color:#fff;box-shadow:none}
.sk-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(20px,3vw,40px);margin-top:28px;align-items:start}
.sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px;list-style:none;margin:0;padding:0}
.sk-tile{position:relative;width:100%;aspect-ratio:1/1.08;padding:9px 10px;border-radius:14px;background:var(--card);box-shadow:var(--hair);
  text-align:left;display:flex;flex-direction:column;overflow:hidden;
  opacity:0;transform:translateY(14px) scale(.96);
  transition:opacity .7s var(--ease),transform .7s var(--ease),background-color .35s var(--ease),color .35s var(--ease),filter .35s;
  transition-delay:var(--d8),var(--d8),0s,0s,0s}
.sk-grid.is-in .sk-tile{opacity:1;transform:none}
.sk-grid.is-in .sk-tile.dim{opacity:.22;filter:grayscale(1)}
.sk-tile:hover,.sk-tile:focus-visible,.sk-tile.on{background:var(--ink);color:#fff}
.sk-tile:hover .sk-n,.sk-tile.on .sk-n,.sk-tile:hover .sk-f,.sk-tile.on .sk-f,.sk-tile:focus-visible .sk-n,.sk-tile:focus-visible .sk-f{color:rgba(255,255,255,.6)}
.sk-n{font-family:var(--font-mono);font-size:10px;color:var(--mute)}
.sk-s{margin-top:auto;font-size:clamp(20px,2.1vw,30px);font-weight:700;letter-spacing:-.04em;line-height:1}
.sk-name{margin-top:4px;font-size:11px;font-weight:500;line-height:1.15;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.3em}
.sk-f{margin-top:3px;font-family:var(--font-mono);font-size:8.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sk-dot{position:absolute;top:10px;right:10px;width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.25}
.sk-insp{position:sticky;top:96px;padding:26px;text-align:center}
.sk-insp-logo{position:relative;width:150px;height:150px;margin:6px auto 0;display:grid;place-items:center;border-radius:36px;background:var(--paper);
  animation:sk-pop .7s var(--ease)}
.sk-insp-logo::before{content:"";position:absolute;inset:18px;border-radius:50%;background:var(--glow,transparent);filter:blur(28px);opacity:.28}
.sk-insp-logo > *{position:relative}
@keyframes sk-pop{0%{transform:scale(.7) rotate(-6deg);opacity:0}60%{transform:scale(1.05)}100%{transform:none;opacity:1}}
.sk-insp-sym{font-family:var(--font-mono);font-size:11px;color:var(--mute);margin-top:18px}
.sk-insp h3{margin-top:6px;font-size:28px;font-weight:700;letter-spacing:-.035em;line-height:1.05}
.sk-insp .fam{display:inline-block;margin-top:10px}
.sk-insp .note{margin-top:10px;font-size:13px;color:var(--ink-2)}
.sk-used{margin-top:22px;text-align:left;border-top:1px solid var(--line);padding-top:16px}
.sk-used h4{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.sk-used ul{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:8px}
.sk-used li{font-size:13.5px;line-height:1.35;display:flex;gap:8px}
.sk-used li::before{content:"→";color:var(--faint)}
.sk-used p{margin-top:10px;font-size:13.5px;color:var(--mute)}
@media (max-width: 1100px){ .sk-layout{grid-template-columns:minmax(0,1fr) 280px} .sk-grid{grid-template-columns:repeat(6,minmax(0,1fr))} .sk-tile{transition-delay:var(--d6),var(--d6),0s,0s,0s} }
@media (max-width: 820px){
  .sk-layout{grid-template-columns:minmax(0,1fr)}
  .sk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
  .sk-tile{transition-delay:var(--d4),var(--d4),0s,0s,0s;padding:7px 8px;border-radius:12px}
  .sk-insp{position:sticky;top:auto;bottom:12px;z-index:5;display:grid;grid-template-columns:64px 1fr;gap:4px 14px;text-align:left;padding:14px;align-items:center;
    box-shadow:var(--hair),var(--lift)}
  .sk-insp-logo{width:64px;height:64px;margin:0;border-radius:18px;grid-row:span 3}
  .sk-insp-sym{margin-top:0}
  .sk-insp h3{margin-top:0;font-size:20px}
  .sk-insp .fam,.sk-insp .note{display:none}
  .sk-used{grid-column:1/-1;margin-top:8px;padding-top:10px}
  .sk-used ul{gap:4px}
  .sk-used li:nth-child(n+3){display:none}
}
@media (max-width: 420px){ .sk-f{display:none} .sk-name{font-size:10px} }
`;

const USED: Record<string, string[]> = Object.fromEntries(SKILLS.map((s) => [s.name, usedIn(s)]));

export default function Skills() {
  const gridRef = useRef<HTMLUListElement>(null);
  const inView = useInView(gridRef, { threshold: 0.1 });
  const [family, setFamily] = useState<SkillFamily | "All">("All");
  const [active, setActive] = useState<Skill>(SKILLS[0]);
  const used = USED[active.name] ?? [];
  const tint = isBrand(active.name) ? brandTint(active.name) : undefined;

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <style>{css}</style>
      <div className="wrap">
        <div className="sk-head">
          <SectionHeading index="02" label="Skills" id="skills-title" accent="elements.">
            The working
          </SectionHeading>
          <p className="sk-intro rv">
            Every skill from my résumé, grouped the way I use them. Pick one to see where it shows up in my work.
          </p>
        </div>

        <div className="sk-filters rv" role="group" aria-label="Filter skills by family">
          {(["All", ...FAMILIES] as const).map((f) => (
            <button key={f} type="button" className="sk-filter" aria-pressed={family === f} onClick={() => setFamily(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <ul ref={gridRef} className={`sk-grid${inView ? " is-in" : ""}`} aria-label="Skills">
            {SKILLS.map((s, i) => {
              const delay = (cols: number) => `${(Math.floor(i / cols) + (i % cols)) * 40}ms`;
              const dim = family !== "All" && s.family !== family;
              return (
                <li key={s.name}>
                  <button
                    type="button"
                    className={`sk-tile${dim ? " dim" : ""}${active.name === s.name ? " on" : ""}`}
                    style={{ ["--d8" as string]: delay(8), ["--d6" as string]: delay(6), ["--d4" as string]: delay(4) }}
                    aria-pressed={active.name === s.name}
                    aria-label={`${s.name}, ${s.family}`}
                    onMouseEnter={() => setActive(s)}
                    onFocus={() => setActive(s)}
                    onClick={() => setActive(s)}
                  >
                    <span className="sk-n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="sk-dot" aria-hidden="true" />
                    <span className="sk-s" aria-hidden="true">
                      {s.symbol}
                    </span>
                    <span className="sk-name" aria-hidden="true">
                      {s.name}
                    </span>
                    <span className="sk-f" aria-hidden="true">
                      {s.family}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <aside className="card sk-insp" aria-live="polite" aria-label="Skill details">
            <div key={active.name} className="sk-insp-logo" style={{ ["--glow" as string]: tint ?? "transparent" }}>
              <TechLogo name={active.name} size={84} />
            </div>
            <p className="sk-insp-sym">
              {String(SKILLS.indexOf(active) + 1).padStart(2, "0")} · {active.symbol}
            </p>
            <h3>{active.name}</h3>
            <span className="chip fam">{SKILL_GROUPS.find((g) => g.family === active.family)?.resumeLabel}</span>
            {active.note && <p className="note">{active.note}</p>}
            <div className="sk-used">
              <h4>Where I used it</h4>
              {used.length ? (
                <ul>
                  {used.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              ) : (
                <p>Listed in the Technical Skills section of my résumé.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
