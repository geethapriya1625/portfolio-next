import type { ReactNode } from "react";

/** "03 — Selected work" tag + a heading that ends in one serif-italic word. */
export default function SectionHeading({
  index,
  label,
  id,
  children,
  accent,
  className = "",
}: {
  index: string;
  label: string;
  id: string;
  children: ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <header>
      <p className="section-tag rv">
        <span>
          {index} — {label}
        </span>
      </p>
      <h2 id={id} className={`s-title ${className}`}>
        <span className="rv-mask">
          <span>
            {children} <em>{accent}</em>
          </span>
        </span>
      </h2>
    </header>
  );
}
