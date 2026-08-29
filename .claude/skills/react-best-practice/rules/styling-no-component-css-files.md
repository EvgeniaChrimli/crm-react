---
title: No Per-Component CSS Files — Style Inline With Tailwind
impact: HIGH
tags: styling, tailwind, css
---

## No Per-Component CSS Files — Style Inline With Tailwind

Don't create a `.css` or `.module.css` file per component. Write styling as Tailwind
utility classes directly in the component's `className`. The only stylesheet in the
project is the single shared global file (`src/index.css`) that holds the `@theme`
block and any centralized animations/classes — see `styling-colors-from-theme.md` and
`styling-centralize-reusable-classes.md`.

**Incorrect:**

```
components/Card/
  Card.tsx
  Card.module.css   ← don't create this
```

```css
/* Card.module.css */
.card {
  border-radius: 0.5rem;
  padding: 1rem;
  background: white;
}
```

**Correct:**

```
components/card/
  card.tsx
```

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg p-4 bg-white">{children}</div>;
}
```

If the same combination of classes is needed in several components, that's not a
reason to reach for a stylesheet — see `styling-centralize-reusable-classes.md`
instead.
