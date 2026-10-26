# Development Conventions & Standards

## Architectural & Coding Rules
1. **Feature-Based Folders**: Components and utilities are organized by feature domain (e.g., `src/components/`, `src/motion/`, `src/tokens.ts`).
2. **Tokens in One File**: All design tokens (colors, fonts, spacing constants) are strictly defined in `src/tokens.ts` and imported wherever needed. No hard-coded color hex values elsewhere in components.
3. **Motion Code Isolation**: All GSAP and ScrollTrigger animation logic must reside exclusively within `src/motion/` (e.g. `src/motion/cardStack.ts`). Components consume motion hooks or setup functions rather than embedding raw ScrollTrigger scripts.
4. **Strict TypeScript**: No `any` types allowed. Explicitly type all props, state, and animation return objects.
5. **No Console Logs**: Production code must be completely free of `console.log`, `console.warn`, or debugging statements.
6. **Intentional Commenting**: Comments must explain **why** a specific decision or math calculation was made (e.g. depth stacking transform math), not **what** the code is doing.
