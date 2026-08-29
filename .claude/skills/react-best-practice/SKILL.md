---
name: project-rules-template
description: >-
  Project-specific development conventions for this CRM React + Tailwind app —
  architecture and file organization, data fetching and state, component patterns,
  performance, testing, UI-state completeness (loading/error/empty), and Tailwind
  styling/theming conventions. Consult this whenever writing, editing, reviewing, or
  refactoring almost any code in this repository — not only for styling questions.
  This rule set grows over time: always check rules/_sections.md for the categories
  that exist right now and open the specific rules/<prefix>-*.md file(s) that match
  the current task, rather than assuming from this description alone which rules are
  written yet.
license: MIT
metadata:
  author: "Evgenia"
  version: "0.1.0"
---

# Project Rules

This document collects project-specific conventions for the crm-react codebase —
architecture, data fetching, components, performance, testing, UI states, and
Tailwind styling. Follow them instead of introducing a new one-off approach: code
written against these rules stays consistent with the rest of the project, whether
it's written by you or by whoever touches this repo next. Rules are compiled from
individual files under `rules/` — see `rules/_sections.md` for the current map.evant, this part
of the file is read in full every single time the skill triggers.

## When to Apply

This rule set is meant to grow over time — new rule files land under `rules/`
without this section needing to change. So don't rely on a static list here;
instead, for any non-trivial change in this repo:

1. Skim `rules/_sections.md` for the categories that exist right now.
2. Open whichever `rules/<prefix>-*.md` file(s) match what you're about to touch.
3. If `_sections.md` lists a category with no matching files under `rules/` yet,
   treat it as "not written yet" — don't invent a rule that isn't there.

This applies to almost any implementation, review, or refactor request — not just
whichever categories happen to be filled in today.

## Rule Categories by Priority

Keep this table in sync with `rules/_sections.md` by hand — it exists so a human or
an agent can see the whole map without opening every rule file. `_sections.md` is
the source of truth the build script actually reads; this table is a convenience
copy.

| Priority | Category                 | Impact | Prefix          |
| -------- | ------------------------ | ------ | --------------- |
| 1        | Architecture & Structure | HIGH   | `architecture-` |
| 2        | Data Fetching & State    | HIGH   | `data-`         |
| 3        | Component Patterns       | MEDIUM | `components-`   |
| 4        | Styling Conventions      | MEDIUM | `styling-`      |
| 5        | UI State Completeness    | HIGH   | `ui-states-`    |
| 6        | Performance              | MEDIUM | `performance-`  |
| 7        | Testing                  | MEDIUM | `testing-`      |

## Quick Reference (optional — for humans skimming this file)

Add one line per rule as you write it, so this file stays a fast index. Update it
whenever you add a rule file.

- `styling-colors-from-theme` — No arbitrary color values; add colors to `@theme`
  once and reuse them, don't add near-duplicates
- `styling-centralize-reusable-classes` — Repeated class combos and animations go in
  the shared stylesheet once, not retyped per component
- `styling-no-component-css-files` — No per-component `.css`/`.module.css` files;
  style inline with Tailwind utility classes

## How to Use

For a specific rule, read its file directly: `rules/<prefix-name>.md`. Each file is
small on purpose — read only the ones relevant to the current task.

For the full compiled reference with every rule expanded: `AGENTS.md`.

After adding or editing a rule, run `npm run build && npm run validate` (or let
your project's own pre-commit hook do it — see `README.md`).
