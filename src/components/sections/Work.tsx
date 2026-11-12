"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import MiniUI, { miniCss } from "../ui/MiniUI";
import { TechLogo } from "../ui/TechLogo";

const css = `
.wk-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px}
.wk-intro{max-width:44ch;font-size:16px;line-height:1.6;color:var(--ink-2)}
.wk-acc{display:flex;gap:10px;height:min(78svh,600px);margin-top:48px}
.wk-panel{position:relative;display:flex;flex:0 0 68px;min-width:0;border-radius:26px;background:var(--card);box-shadow:var(--hair);overflow:hidden;
  transition:flex .9s var(--ease),box-shadow .5s var(--ease)}
.wk-panel.open{flex:8 1 0;box-shadow:var(--hair),var(--lift)}
.wk-panel h3{margin:0;display:flex}
.wk-spine{flex:none;width:68px;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:22px 0;
  transition:background-color .4s var(--ease),color .4s var(--ease);border-radius:26px}
.wk-panel:not(.open) .wk-spine:hover{background:var(--ink);color:#fff}
.wk-spine .n{font-family:var(--font-mono);font-size:12px;color:inherit;opacity:.6}
.wk-spine .t{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:600;font-size:15px;letter-spacing:-.01em;white-space:nowrap;
  max-height:calc(100% - 90px);overflow:hidden;text-overflow:ellipsis}
.wk-plus{width:30px;height:30px;border-radius:50%;box-shadow:inset 0 0 0 1px currentColor;display:grid;place-items:center;font-size:18px;line-height:1;
  transition:transform .7s var(--ease)}
.wk-panel.open .wk-plus{transform:rotate(135deg)}
.wk-panel.open .wk-spine .t{opacity:.35}
.wk-body{flex:1;min-width:0;overflow:hidden}
.wk-inner{width:max(100%,620px);height:100%;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(220px,.85fr);gap:28px;padding:30px 30px 30px 6px}
.wk-text{display:flex;flex-direction:column;min-height:0;opacity:0;transform:translateY(16px);transition:opacity .6s var(--ease),transform .8s var(--ease)}
.wk-panel.open .wk-text{opacity:1;transform:none;transition-delay:.25s}
.wk-num{display:none}
.wk-kicker{margin-top:14px;font-family:var(--font-mono);font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.wk-title{margin-top:10px;font-size:clamp(26px,2.4vw,38px);font-weight:700;letter-spacing:-.04em;line-height:1.02}
.wk-desc{margin-top:14px;font-size:15px;line-height:1.55;color:var(--ink-2);max-width:56ch}
.wk-feats{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:8px 18px;list-style:none;padding:0}
.wk-feats li{display:flex;gap:8px;font-size:13.5px;line-height:1.35}
.wk-feats li::before{content:"";flex:none;width:5px;height:5px;margin-top:6px;border-radius:50%;background:var(--ink)}
.wk-tech{margin-top:auto;padding-top:18px;display:flex;flex-wrap:wrap;gap:6px}
.wk-gh{margin-top:16px;align-self:flex-start}
.wk-ui{position:relative;min-height:0;display:flex;flex-direction:column;gap:8px;clip-path:inset(0 100% 0 0);transition:clip-path 1.1s var(--ease)}
.wk-panel.open .wk-ui{clip-path:inset(0 0 0 0);transition-delay:.35s}
.wk-ui-label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);text-align:right}
.wk-ui > div:last-child{flex:1;min-height:0}
@media (max-width: 1280px){ .wk-feats{grid-template-columns:1fr} .wk-feats li:nth-child(n+5){display:none} }
@media (max-width: 1100px){
  .wk-acc{flex-direction:column;height:auto;gap:10px}
  .wk-panel{flex:none;flex-direction:column}
  .wk-panel.open{flex:none}
  .wk-panel h3{display:block}
  .wk-spine{width:100%;height:auto;flex-direction:row;justify-content:flex-start;gap:16px;padding:18px 20px;text-align:left}
  .wk-spine .t{writing-mode:horizontal-tb;transform:none;white-space:normal;max-height:none;flex:1;font-size:16px}
  .wk-panel.open .wk-spine .t{opacity:1}
  .wk-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .8s var(--ease)}
  .wk-panel.open .wk-body{grid-template-rows:1fr}
  .wk-inner{width:100%;height:auto;min-height:0;overflow:hidden;grid-template-columns:minmax(0,1fr);padding:0 20px;gap:22px}
  .wk-panel.open .wk-inner{padding-bottom:22px}
  .wk-num,.wk-title{display:none}
  .wk-kicker{margin-top:0}
  .wk-feats li:nth-child(n+5){display:list-item;display:flex}
  .wk-ui{height:300px}
}
@media (max-width: 560px){ .wk-feats{grid-template-columns:1fr} }
`;

export default function Work() {
  const [open, setOpen] = useState(0);

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <style>{css + miniCss}</style>
      <div className="wrap">
        <div className="wk-head">
          <SectionHeading index="03" label="Work" id="work-title" accent="work.">
            Selected
          </SectionHeading>
          <p className="wk-intro rv">
            Two projects from my résumé and four open-source builds on GitHub. Open a panel for the details.
          </p>
        </div>

        <div className="wk-acc rv" style={{ ["--i" as string]: 1 }}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article key={p.id} className={`wk-panel${isOpen ? " open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    className="wk-spine"
                    id={`wk-btn-${p.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`wk-body-${p.id}`}
                    onClick={() => setOpen(isOpen && window.matchMedia("(max-width: 1100px)").matches ? -1 : i)}
                  >
                    <span className="n">{p.index}</span>
                    <span className="t">{p.title}</span>
                    <span className="wk-plus" aria-hidden="true">
                      +
                    </span>
                  </button>
                </h3>
                <div className="wk-body" id={`wk-body-${p.id}`} role="region" aria-labelledby={`wk-btn-${p.id}`} inert={!isOpen}>
                  <div className="wk-inner">
                    <div className="wk-text">
                      <span className="wk-num" aria-hidden="true">
                        {p.index} / {String(PROJECTS.length).padStart(2, "0")}
                      </span>
                      <p className="wk-kicker">{p.kicker}</p>
                      <p className="wk-title" aria-hidden="true">
                        {p.title}
                      </p>
                      <p className="wk-desc">{p.description}</p>
                      <ul className="wk-feats">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <ul className="wk-tech" aria-label="Tech stack">
                        {p.tech.map((t) => (
                          <li key={t} className="chip">
                            <TechLogo name={t} size={14} />
                            {t}
                          </li>
                        ))}
                      </ul>
                      {p.github && (
                        <a className="btn btn-primary wk-gh" href={p.github} target="_blank" rel="noreferrer">
                          View on GitHub <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                    <div className="wk-ui">
                      <span className="wk-ui-label">Illustrative UI</span>
                      <MiniUI id={p.id} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
