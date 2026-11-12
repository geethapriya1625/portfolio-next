# Geetha Priya Kanikireddy — Portfolio

Personal portfolio for **Geetha Priya Kanikireddy, Full Stack Software Engineer**.
Next.js 15 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · Lenis.

Every piece of text comes from the résumé (`public/GeethaPriyaKR.pdf`). The four open-source
projects (Approval Workflow Service, Distributed Rate Limiter, LLM Eval Harness, SQL Guard MCP
Server) are not on the résumé; they describe public repos on [github.com/geethapriya1625](https://github.com/geethapriya1625).
All content lives in one file: [`src/lib/data.ts`](src/lib/data.ts).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export to ./out
npm start          # serve ./out locally
npm run lint
```

Requires Node 20+.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. Create a new **public** repo (for example `portfolio-next`) and push this folder to `main`.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The site appears at `https://<user>.github.io/<repo>/`.

The workflow sets `NEXT_PUBLIC_BASE_PATH=/<repo>` so assets resolve under the project path.
For a custom domain or a `<user>.github.io` repo, leave `NEXT_PUBLIC_BASE_PATH` empty and set
`NEXT_PUBLIC_SITE_URL` to the final URL (used for Open Graph tags).

## Sections

| # | Section    | Component                              | What it does |
|---|------------|----------------------------------------|--------------|
| — | Navigation | `src/components/Navigation.tsx`        | Initials mark, frosted pill nav with sliding active indicator, 2 px progress bar, full-screen mobile menu (Esc closes, scroll locked) |
| — | Hero       | `src/components/hero/Hero.tsx`         | Looping intro video (sound on when the browser allows, otherwise muted until the first interaction), ghost name, role, CTAs, résumé download |
| 01 | About     | `src/components/sections/About.tsx`, `ui/IDCard.tsx` | Résumé summary, swinging lanyard ID card (flip on hover, tap, Enter or Space), quick facts, quote |
| 02 | Skills    | `src/components/sections/Skills.tsx`   | Periodic-table of all 53 résumé skills, family filters, sticky inspector showing where each skill was used |
| 03 | Work      | `src/components/sections/Work.tsx`, `ui/MiniUI.tsx` | Accordion of 6 projects with features, tech logos, GitHub links and an illustrative mini UI |
| 04 | Experience| `src/components/sections/Experience.tsx` | Education and work on one timeline that draws as you scroll |
| 05 | Contact   | `src/components/sections/Contact.tsx`  | Email with copy button, phone, GitHub, LinkedIn, footer |

Certifications and Achievements are omitted because the résumé lists none
(`CERTIFICATIONS` and `ACHIEVEMENTS` in `data.ts` are empty arrays, ready if needed).

## Project layout

```
src/
  app/            layout.tsx (fonts, metadata), page.tsx, globals.css (tokens, base, shared classes)
  components/     App.tsx, Navigation.tsx, hero/, sections/, ui/
  lib/            data.ts (all content), hooks.ts, scroll.tsx (Lenis)
  fonts/          Inter Tight, Instrument Serif, JetBrains Mono (woff2 + OFL licences)
public/
  hero/           hero.webm, hero.mp4, poster.webp
  logos/          brand SVGs + licences
  portrait-bust.webp, og.jpg, favicon.svg, GeethaPriyaKR.pdf
scripts/
  build-hero-assets.py
assets-src/
  intro.mp4       source video for the hero
```

Component styles live in a `<style>` block inside each component; shared classes (`.btn`, `.card`,
`.chip`, `.rv` reveal, headings) live in `globals.css` under `@layer components`.

## Rebuild the hero video

Needs Python 3, `ffmpeg` (with libx264, libvpx-vp9, libopus), `numpy` and `Pillow`.

```bash
npm run hero
# same as:
python3 scripts/build-hero-assets.py assets-src/intro.mp4
```

Options:

- `--crop W:H:X:Y` overrides the automatic crop (the script finds the person and centres a 768:960 crop on them).
- `--portrait photo.jpg` uses a photo for the ID-card portrait instead of the sharpest video frame.

What it does:

1. Crops and scales to 768×960 and lifts the background to white (`colorlevels`) so it disappears under `mix-blend-mode: multiply`.
2. Makes the loop seamless with a 0.5 s `xfade` from the end into the start; audio is joined with an equal-power crossfade in numpy (no retiming).
3. Writes `public/hero/hero.mp4` (H.264 CRF 24, AAC 96k, faststart), `public/hero/hero.webm` (VP9 CRF 36, Opus 80k) and `poster.webp`.
4. Writes `public/portrait-bust.webp` (480×600) and `public/og.jpg` (1200×630).

## Design notes

- Palette is white, black and warm grays only; brand logos keep their own colours. `--mute` is
  `#6b6964` (slightly darker than the `#77756f` in the brief) so small gray text passes WCAG AA.
- No loader, no page transitions, no WebGL. Motion is CSS, IntersectionObserver and small rAF loops.
  `prefers-reduced-motion` turns off smooth scrolling, the hero autoplay, the card swing and all reveals.
- Fonts are self-hosted with `next/font/local`. No third-party scripts at runtime.

## QA results (production build)

- `npm run build` and `npm run lint`: clean. First-load JS: **130 kB**.
- No horizontal overflow at 360, 390, 768, 1024, 1280, 1440 and 1920 px.
- Lighthouse (served with gzip): mobile — Performance 91, Accessibility 100, Best Practices 100, SEO 100;
  desktop — 100 / 100 / 100 / 100.
- Checked with Playwright: video loops, pauses below 35 % visibility and resumes, sound button toggles;
  ID card flips with Enter/Space and on tap; mobile menu opens, locks scroll and closes on Esc.

## Credits and licences

- Logos from [devicon](https://github.com/devicons/devicon) (MIT, `public/logos/LICENSE-devicon.txt`):
  Java, Python, TypeScript, JavaScript, Spring, Hibernate, PostgreSQL, MySQL, SQL Server, MongoDB, Redis,
  Kafka, RabbitMQ, AWS, Docker, Kubernetes, Jenkins, Maven, Git, Grafana, JUnit, React, Angular, Node.js,
  Express, SQLite, Lua, GitHub Actions.
- Logos from [simple-icons](https://github.com/simple-icons/simple-icons) (CC0, `public/logos/LICENSE-simple-icons.md`):
  Splunk, LangChain, Model Context Protocol, Pydantic. See `DISCLAIMER-simple-icons.md`.
- All brand names and logos are trademarks of their respective owners and are used only to name the technologies.
- Fonts: Inter Tight, Instrument Serif, JetBrains Mono — SIL Open Font License 1.1 (`src/fonts/*-OFL.txt`).
- Concept icons (SQL, REST, concurrency, testing and similar) are original line drawings in `ui/TechLogo.tsx`.
