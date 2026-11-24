# He's Not Heavy, He's My Brother

A single-page visual story about brotherhood, empathy, and showing up for one another. The experience moves through four chapters with a scroll-driven card sequence.

[View the live site](https://hes-not-heavy.vercel.app/)

## Experience

- Four chapters presented as a responsive card stack.
- Scroll motion built with GSAP and ScrollTrigger, with Lenis for smooth scrolling.
- An About dialog with keyboard focus handling and a close action.
- Reduced-motion support for visitors who prefer less animation.

## Built with

React, TypeScript, Vite, Tailwind CSS, GSAP, and Lenis. Bun manages the dependencies and runs the project scripts. The published site is a static build; it does not require an API key or a server-side AI service.

## Project layout

```text
.
├── public/             Images served from the site root
├── src/
│   ├── components/     Page sections and About dialog
│   ├── content/        Chapter text and site copy
│   ├── lib/            Shared browser helpers
│   ├── motion/         GSAP scroll and reveal sequences
│   ├── App.tsx         Page composition
│   ├── index.css       Global styles and responsive rules
│   └── tokens.ts       Shared color values
├── index.html          Document entry point
├── vite.config.ts      Vite configuration
└── CONVENTIONS.md      Notes for maintaining the project
```

## Run locally

Install [Bun](https://bun.sh/) if needed, then run from the repository root:

```bash
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:3000/>. To check the project before publishing:

```bash
bun run lint
bun run build
```

`bun run build` writes the static site to `dist/`. `bun run preview` serves that build locally.

## Make it your own

The story lives in `src/content/cards.ts`; the About copy is in `src/content/about.ts`. Update the visuals in `public/` and their references in the components. Layout and colors are in `src/index.css`, component classes, and `src/tokens.ts`; scroll behavior is in `src/motion/`.

The story and imagery are specific to this project. If you use the repository as a reference, replace them with content you have the right to use and check the experience at desktop and mobile sizes, with a keyboard, and with reduced motion enabled.

## Deployment

Build as a Vite static site and publish `dist/`. The live version is hosted on Vercel at [hes-not-heavy.vercel.app](https://hes-not-heavy.vercel.app/). The images in `public/` use root-relative URLs, so deploy at a domain root or adjust those paths.
