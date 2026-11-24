# Development conventions

Keep the site small and easy to follow. The page is composed in `src/App.tsx`; reusable sections live in `src/components/`, story copy in `src/content/`, scroll sequences in `src/motion/`, and shared helpers in `src/lib/`.

- Preserve the meaning and sequence of the story when editing copy. Keep project-specific text out of generic motion helpers.
- Use `src/tokens.ts` and the CSS variables in `src/index.css` for shared colors. Existing component utility classes also contain some color values; do not assume the palette is fully centralized.
- Keep scroll timeline setup in `src/motion/` and clean up listeners, triggers, and animation instances when components unmount.
- Keep the About dialog usable by keyboard and restore focus when it closes.
- Check both ordinary and reduced-motion behavior when changing transitions or scroll timing.
- Run `bun run lint` and `bun run build` before publishing. Review the result at desktop and mobile sizes.
