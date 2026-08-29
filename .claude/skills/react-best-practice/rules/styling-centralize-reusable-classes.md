---
title: Centralize Reusable Classes and Animations, Don't Duplicate Them
impact: MEDIUM
tags: styling, tailwind, animations, dry
---

## Centralize Reusable Classes and Animations, Don't Duplicate Them

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
