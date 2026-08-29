# Project Rules

**Version 0.1.0**
Evgenia  
29.08.2026



---

## Table of Contents

1. [Styling Conventions](#1-styling-conventions) — **MEDIUM**
   - 1.1 [Centralize Reusable Classes and Animations, Don't Duplicate Them](#11-centralize-reusable-classes-and-animations-don-t-duplicate-them)
   - 1.2 [Colors Come From the Theme, Not Arbitrary Values](#12-colors-come-from-the-theme-not-arbitrary-values)
   - 1.3 [No Per-Component CSS Files — Style Inline With Tailwind](#13-no-per-component-css-files-style-inline-with-tailwind)

---

## 1. Styling Conventions

**Impact: MEDIUM**

Utility classes, design tokens, className conventions

### 1.1 Centralize Reusable Classes and Animations, Don't Duplicate Them

**Impact: MEDIUM**


If a class combination or animation is used in more than one place, define it once in
the shared global stylesheet instead of retyping it (or a near-copy of it) into every
component that needs it.

**Custom animations** go in `@theme` as `--animate-*`, next to their `@keyframes`:

**Incorrect (ad hoc arbitrary animation, redefined slightly differently per component):**

```tsx
// ComponentA.tsx
<div className="animate-[wiggle_0.3s_ease-in-out_infinite]">

// ComponentB.tsx — same idea, retyped slightly differently
<div className="animate-[wiggle_0.3s_ease-in-out_3]">
```

**Correct (defined once in the shared stylesheet, reused by name):**

```css
/* src/index.css */
@theme {
  --animate-wiggle: wiggle 0.3s ease-in-out infinite;

  @keyframes wiggle {
    0%,
    100% {
      transform: rotate(-1deg);
    }
    50% {
      transform: rotate(1deg);
    }
  }
}
```

```tsx
<div className="animate-wiggle">
```

**A repeated combination of utility classes** (not tied to one component's structure)
works the same way — export it as a named constant from a shared file instead of
retyping it everywhere:

**Incorrect (same class string duplicated across many files):**

```tsx
<span className="inline-flex items-center rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700">
```

**Correct (defined once, imported where needed):**

```ts
// lib/shared-classes.ts
export const badgeClasses =
  "inline-flex items-center rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700";
```

```tsx
import { badgeClasses } from "@/lib/shared-classes";

<span className={badgeClasses}>
```

This is different from extracting a reusable _component_ — a shared class string is
for styling that repeats but doesn't need its own component boundary. If the thing
being repeated also has repeated markup/behavior, extract a component instead (see
`components-` rules).

---
### 1.2 Colors Come From the Theme, Not Arbitrary Values

**Impact: HIGH**

Never write an arbitrary color value in a component (`bg-[#1a73e8]`, `text-[rgb(...)]`).
Add the color to the shared `@theme` once, then reference it by name. Before adding a
new color, check whether an existing theme color is already close enough — don't add
a near-duplicate just because the new one is "slightly" different.

**Incorrect (arbitrary value, invisible to the rest of the app):**

```tsx
<div className="bg-[#1a73e8] text-[#1a73e8]">
```

**Incorrect (near-duplicate added instead of reusing an existing token):**

```css
@theme {
  --color-brand-500: (rgb(26, 115, 232));
  --color-link-500: rgb(26, 115, 232); /* barely different from brand-500 */
}
```

**Correct (defined once in the theme, reused by name):**

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-brand-500: (rgb(26, 115, 232));
}
```

```tsx
<div className="bg-brand-500 text-brand-500">
```

If you're not sure a new color is really needed, that's a sign it probably isn't —
check `src/index.css` for the closest existing token first.

Reference: [Tailwind theme docs](https://tailwindcss.com/docs/theme)

---
### 1.3 No Per-Component CSS Files — Style Inline With Tailwind

**Impact: HIGH**


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

---
