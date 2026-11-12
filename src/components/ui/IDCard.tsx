"use client";

import { useEffect, useRef, useState } from "react";
import { ID_CARD, PROFILE, asset } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const css = `
.idc-stage{position:relative;width:320px;max-width:100%;height:530px;margin-inline:auto;touch-action:pan-y}
.idc-swing{position:absolute;left:50%;top:0;width:300px;margin-left:-150px;transform-origin:50% 0;will-change:transform}
.idc-strap{position:relative;width:30px;height:56px;margin:0 auto;background:var(--ink);overflow:hidden;border-radius:2px 2px 0 0}
.idc-strap span{position:absolute;left:50%;top:0;writing-mode:vertical-rl;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:9px;letter-spacing:.2em;color:rgba(255,255,255,.7);white-space:nowrap;
  animation:idc-strap 9s linear infinite}
@keyframes idc-strap{from{transform:translate(-50%,0)}to{transform:translate(-50%,-50%)}}
.idc-clip{position:relative;width:44px;height:26px;margin:-2px auto 0;border-radius:6px 6px 10px 10px;
  background:linear-gradient(180deg,#d9d7d3,#9c9a96 55%,#c8c6c2);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 2px 4px rgba(0,0,0,.18)}
.idc-clip::after{content:"";position:absolute;left:50%;bottom:-9px;width:14px;height:14px;margin-left:-7px;border-radius:50%;
  border:3px solid #a7a5a1;border-top-color:#d4d2ce}
.idc-card{position:relative;width:300px;height:404px;margin-top:6px;perspective:1400px;cursor:pointer;border-radius:24px;outline-offset:6px}
.idc-inner{position:absolute;inset:0;transform-style:preserve-3d;transition:transform 1s var(--ease)}
.idc-card.flipped .idc-inner{transform:rotateY(180deg)}
.idc-face{position:absolute;inset:0;border-radius:24px;background:var(--card);box-shadow:var(--hair),var(--lift);
  -webkit-backface-visibility:hidden;backface-visibility:hidden;overflow:hidden;display:flex;flex-direction:column}
.idc-back{transform:rotateY(180deg);padding:26px 24px 22px}
.idc-hole{position:absolute;top:12px;left:50%;width:46px;height:8px;margin-left:-23px;border-radius:99px;background:var(--paper);box-shadow:inset 0 1px 2px rgba(0,0,0,.15);z-index:2}
.idc-band{height:64px;padding:26px 20px 0;display:flex;justify-content:space-between;align-items:center;background:var(--ink);color:#fff;
  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.18em}
.idc-band b{width:26px;height:26px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.6);display:grid;place-items:center;
  font-family:var(--font-sans);font-size:10px;letter-spacing:0;font-weight:700}
.idc-body{flex:1;padding:18px 20px 16px;display:grid;grid-template-columns:128px 1fr;gap:6px 16px;align-content:start}
.idc-photo{position:relative;width:128px;height:156px;border-radius:16px;overflow:hidden;background:var(--soft);
  box-shadow:0 0 0 3px #fff,0 0 0 4px #c9c6c0,0 14px 30px -12px rgba(13,13,13,.35)}
.idc-photo::before{content:"";position:absolute;inset:-30%;background:radial-gradient(closest-side,rgba(255,255,255,.9),transparent);z-index:0}
.idc-photo img{position:relative;z-index:1;width:100%;height:100%;object-fit:cover;transition:transform .8s var(--ease)}
.idc-card:hover .idc-photo img{transform:scale(1.07)}
.idc-who{align-self:end;padding-bottom:4px}
.idc-who strong{display:block;font-size:19px;line-height:1.05;letter-spacing:-.03em}
.idc-who span{display:block;margin-top:6px;font-size:12px;color:var(--mute);line-height:1.35}
.idc-rows{grid-column:1/-1;margin-top:12px;display:grid;gap:7px}
.idc-rows div{display:flex;justify-content:space-between;gap:12px;font-size:12.5px;border-bottom:1px dashed var(--line);padding-bottom:6px}
.idc-rows dt{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.idc-rows dd{font-weight:600}
.idc-foot{display:flex;align-items:flex-end;justify-content:space-between;padding:0 20px 18px}
.idc-bar{display:flex;align-items:flex-end;gap:1.5px;height:30px}
.idc-bar i{display:block;height:100%;background:var(--ink)}
.idc-holo{width:42px;height:42px;border-radius:50%;
  background:conic-gradient(from var(--a,0deg),#f6f5f2,#bdbab4,#fdfdfc,#8f8c86,#ecebe7,#b3b0aa,#f6f5f2);
  box-shadow:inset 0 0 0 1px rgba(13,13,13,.12);animation:idc-holo 6s linear infinite}
@property --a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes idc-holo{to{--a:360deg}}
.idc-back h3{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}
.idc-back ul{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
.idc-back li{display:flex;gap:10px;font-size:13.5px;line-height:1.35;color:var(--ink-2)}
.idc-back li::before{content:"";flex:none;width:5px;height:5px;margin-top:7px;border-radius:50%;background:var(--ink)}
.idc-sign{margin-top:auto;font-family:var(--font-serif);font-style:italic;font-size:30px;letter-spacing:-.01em;line-height:1;
  border-bottom:1px solid var(--line);padding-bottom:8px}
.idc-found{margin-top:10px;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
.idc-hint{position:absolute;left:0;right:0;bottom:0;text-align:center;font-family:var(--font-mono);font-size:11px;color:var(--mute)}
@media (prefers-reduced-motion: reduce){.idc-strap span,.idc-holo{animation:none}}
`;

/** Deterministic barcode widths from a string. */
function bars(seed: string) {
  const out: number[] = [];
  let h = 2166136261;
  for (let i = 0; i < 46; i++) {
    h ^= seed.charCodeAt(i % seed.length);
    h = Math.imul(h, 16777619) >>> 0;
    out.push(1 + (h % 3));
  }
  return out;
}
const BARS = bars(PROFILE.email);

export default function IDCard() {
  const stageRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const canHover = useRef(false);

  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  // damped pendulum driven by pointer velocity, plus a gentle idle sway
  useEffect(() => {
    const stage = stageRef.current;
    const swing = swingRef.current;
    if (!stage || !swing || prefersReducedMotion()) return;
    let theta = 0; // deg
    let omega = 0; // deg/s
    let last = performance.now();
    let lastX = 0;
    let lastT = 0;
    let raf = 0;
    let running = false;

    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const idle = Math.sin(now / 1400) * 1.4;
      const k = 38; // stiffness
      const c = 2.6; // damping
      const acc = -k * (theta - idle) - c * omega;
      omega += acc * dt;
      theta += omega * dt;
      theta = Math.max(-18, Math.min(18, theta));
      swing.style.transform = `rotate(${theta.toFixed(3)}deg)`;
      raf = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      const t = e.timeStamp;
      if (lastT && t - lastT < 80) {
        const vx = (e.clientX - lastX) / Math.max(1, t - lastT); // px/ms
        omega += Math.max(-40, Math.min(40, vx * 9));
      }
      lastX = e.clientX;
      lastT = t;
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(stage);
    stage.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      stop();
      io.disconnect();
      stage.removeEventListener("pointermove", onMove);
    };
  }, []);

  const showBack = flipped !== hovered;

  return (
    <div className="idc-stage" ref={stageRef}>
      <style>{css}</style>
      <div className="idc-swing" ref={swingRef}>
        <div className="idc-strap" aria-hidden="true">
          <span>{`${PROFILE.name.toUpperCase()} · ${PROFILE.githubHandle.toUpperCase()} · `.repeat(4)}</span>
        </div>
        <div className="idc-clip" aria-hidden="true" />
        <div
          className={`idc-card${showBack ? " flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={showBack}
          aria-label={`Developer ID card for ${PROFILE.name}. Press to flip.`}
          aria-describedby="idc-desc"
          onPointerEnter={(e) => e.pointerType === "mouse" && canHover.current && setHovered(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
          onPointerUp={(e) => (e.pointerType !== "mouse" || !canHover.current) && setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          }}
        >
          <div className="idc-inner" aria-hidden="true">
            <div className="idc-face idc-front">
              <span className="idc-hole" />
              <div className="idc-band">
                <span>DEVELOPER ID</span>
                <b>{PROFILE.initials}</b>
              </div>
              <div className="idc-body">
                <div className="idc-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset("/portrait-bust.webp")} alt="" width={128} height={156} loading="lazy" decoding="async" />
                </div>
                <div className="idc-who">
                  <strong>{PROFILE.greetingName}</strong>
                  <span>{PROFILE.role}</span>
                </div>
                <dl className="idc-rows">
                  {ID_CARD.rows.map((r) => (
                    <div key={r.k}>
                      <dt>{r.k}</dt>
                      <dd>{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="idc-foot">
                <div className="idc-bar">
                  {BARS.map((w, i) => (
                    <i key={i} style={{ width: w, opacity: i % 7 === 3 ? 0 : 1 }} />
                  ))}
                </div>
                <span className="idc-holo" />
              </div>
            </div>
            <div className="idc-face idc-back">
              <h3>What I am</h3>
              <ul>
                {ID_CARD.back.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="idc-sign">{PROFILE.greetingName}</p>
              <p className="idc-found">If found, say hello · {PROFILE.email}</p>
            </div>
          </div>
        </div>
      </div>
      <p id="idc-desc" className="sr-only-focusable">
        Front: {PROFILE.greetingName}, {PROFILE.role}. {ID_CARD.rows.map((r) => `${r.k} ${r.v}`).join(", ")}. Back:{" "}
        {ID_CARD.back.join(". ")}.
      </p>
      <p className="idc-hint" aria-hidden="true">
        hover or tap to flip
      </p>
    </div>
  );
}
