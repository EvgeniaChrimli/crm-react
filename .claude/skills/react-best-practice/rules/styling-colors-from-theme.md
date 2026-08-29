---
title: Colors Come From the Theme, Not Arbitrary Values
impact: HIGH
tags: styling, tailwind, colors, theme
---

## Colors Come From the Theme, Not Arbitrary Values

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
