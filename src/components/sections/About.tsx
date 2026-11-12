import { PROFILE, asset } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import IDCard from "../ui/IDCard";

const css = `
.about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(28px,4vw,64px);align-items:start;margin-top:8px}
.about-title{font-size:clamp(40px,4.6vw,72px)}
.about-copy p{margin-top:22px;font-size:17px;line-height:1.6;color:var(--ink-2);max-width:52ch}
.about-copy p.lead{font-size:clamp(18px,1.5vw,21px);color:var(--ink);line-height:1.5}
.about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
.about-facts{padding:26px 26px 22px}
.about-facts h3{font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
.about-facts dl{margin-top:14px}
.about-facts dl div{display:grid;grid-template-columns:110px 1fr;gap:12px;padding:12px 0;border-top:1px solid var(--line);font-size:14.5px}
.about-facts dt{color:var(--mute)}
.about-facts dd{font-weight:500}
.about-quote{margin-top:18px;padding:26px;font-family:var(--font-serif);font-style:italic;font-size:clamp(22px,1.9vw,28px);line-height:1.2;letter-spacing:-.01em}
.about-quote::before{content:"“";display:block;font-size:56px;line-height:.6;color:var(--faint);margin-bottom:6px}
.about-quote cite{display:block;margin-top:14px;font-family:var(--font-mono);font-style:normal;font-size:11px;letter-spacing:.08em;color:var(--mute);text-transform:uppercase}
@media (max-width: 1100px){
  .about-grid{grid-template-columns:minmax(0,1fr) 320px}
  .about-side{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .about-quote{margin-top:0}
}
@media (max-width: 760px){
  .about-grid{grid-template-columns:minmax(0,1fr)}
  .about-side{grid-template-columns:minmax(0,1fr)}
}
`;

const FACTS = [
  { k: "Based in", v: PROFILE.location },
  { k: "Experience", v: "4 years in production" },
  { k: "Now", v: "Software Engineering Intern, University of Georgia" },
  { k: "Studying", v: `MS Computer Science, UGA · ${PROFILE.graduation}` },
  { k: "Core stack", v: "Java · Spring Boot · Python · React" },
];

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <style>{css}</style>
      <div className="wrap about-grid">
        <div className="about-copy">
          <SectionHeading index="01" label="About" id="about-title" accent="Geetha Priya." className="about-title">
            Hi, I&apos;m
          </SectionHeading>
          <p className="lead rv">{PROFILE.resumeSummary}</p>
          <p className="rv">{PROFILE.extraLine}</p>
          <div className="about-btns rv">
            <a className="btn btn-primary" href={asset(PROFILE.resume)} download>
              Résumé <span aria-hidden="true">↓</span>
            </a>
            <a className="btn btn-secondary" href={PROFILE.github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a className="btn btn-secondary" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="rv" style={{ ["--i" as string]: 1 }}>
          <IDCard />
        </div>

        <aside className="about-side" aria-label="Quick facts">
          <div className="card about-facts rv" style={{ ["--i" as string]: 2 }}>
            <h3>Quick facts</h3>
            <dl>
              {FACTS.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <blockquote className="card about-quote rv" style={{ ["--i" as string]: 3 }}>
            {PROFILE.quote}
            <cite>— in my own words</cite>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}
