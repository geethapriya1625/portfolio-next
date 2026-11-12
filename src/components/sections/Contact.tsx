import { PROFILE } from "@/lib/data";
import CopyEmail from "../ui/CopyEmail";
import BackToTop from "../ui/BackToTop";

const css = `
.ct{padding-top:var(--section-pad);padding-bottom:0}
.ct-title{margin-top:22px;font-weight:700;font-size:clamp(46px,9.2vw,148px);letter-spacing:-.05em;line-height:.95}
.ct-line{display:block}
.ct-line.serif{font-family:var(--font-serif);font-style:italic;font-weight:400;letter-spacing:-.02em;color:var(--mute)}
.ct-l{display:inline-block;transition:transform .5s var(--ease)}
.ct-l:hover{animation:ct-hop .55s var(--ease)}
@keyframes ct-hop{0%{transform:none}40%{transform:translateY(-.14em)}100%{transform:none}}
.ct-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-top:56px;padding-top:40px;border-top:1px solid var(--line)}
.ct-label{font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
.ct-email-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:12px}
.ct-email{font-size:clamp(24px,3.6vw,52px);font-weight:600;letter-spacing:-.035em;line-height:1.1;background:linear-gradient(currentColor,currentColor) 0 100%/0 2px no-repeat;
  transition:background-size .7s var(--ease);overflow-wrap:anywhere}
.ct-email:hover{background-size:100% 2px}
.ct-copy{cursor:pointer;transition:background-color .3s,color .3s}
.ct-copy:hover{background:var(--ink);color:#fff}
.ct-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.ct-badge{position:relative;width:150px;height:150px;display:grid;place-items:center;border-radius:50%}
.ct-badge svg{position:absolute;inset:0;width:100%;height:100%;animation:ct-spin 18s linear infinite}
.ct-badge text{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;fill:var(--ink)}
.ct-badge span{width:58px;height:58px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:22px;transition:transform .6s var(--ease)}
.ct-badge:hover span{transform:rotate(-45deg) scale(1.08)}
@keyframes ct-spin{to{transform:rotate(360deg)}}
.ct-foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 24px;margin-top:80px;padding:22px 0 32px;border-top:1px solid var(--line);
  font-size:13px;color:var(--mute)}
.ct-foot a,.ct-foot button{color:var(--ink-2)}
.ct-foot a:hover,.ct-foot button:hover{color:var(--ink)}
@media (max-width: 760px){ .ct-grid{grid-template-columns:minmax(0,1fr)} .ct-badge{width:120px;height:120px} }
`;

function Letters({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(word).map((ch, i) => (
              <span key={i} className="ct-l">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="ct" aria-labelledby="contact-title">
      <style>{css}</style>
      <div className="wrap">
        <p className="section-tag rv">
          <span>05 — Contact</span>
        </p>
        <h2 id="contact-title" className="ct-title" aria-label="Let's build something together.">
          <span className="rv-mask" aria-hidden="true">
            <span className="ct-line">
              <Letters text="Let's build" />
            </span>
          </span>
          <span className="rv-mask" aria-hidden="true" style={{ ["--i" as string]: 1 }}>
            <span className="ct-line serif">
              <Letters text="something together." />
            </span>
          </span>
        </h2>

        <div className="ct-grid">
          <div className="rv">
            <p className="ct-label">Email</p>
            <div className="ct-email-row">
              <a className="ct-email" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <CopyEmail email={PROFILE.email} />
            </div>
            <div className="ct-links">
              <a className="btn btn-secondary" href={PROFILE.phoneHref}>
                {PROFILE.phone}
              </a>
              <a className="btn btn-secondary" href={PROFILE.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a className="btn btn-secondary" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <a
            className="ct-badge rv"
            href={`mailto:${PROFILE.email}`}
            aria-label={`Say hello by email`}
            style={{ ["--i" as string]: 1 }}
          >
            <svg viewBox="0 0 150 150" aria-hidden="true">
              <defs>
                <path id="ct-circle" d="M75,75 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
              </defs>
              <text>
                <textPath href="#ct-circle" textLength="360" lengthAdjust="spacing">say hello · say hello · say hello ·</textPath>
              </text>
            </svg>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="wrap">
      <div className="ct-foot">
        <span>
          © {year} {PROFILE.name}
        </span>
        <BackToTop />
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}
