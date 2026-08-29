# Sections

This table is the single source of truth mapping a filename prefix to a section.
`npm run build` reads it to group and order rules in `AGENTS.md`, and `SKILL.md`
points agents here to find out what categories currently exist. Row order here
becomes section order in the output — add, remove, or reorder rows freely.

A rule file's prefix is everything before the first `-` in its filename plus that
`-`. Example: `architecture-colocate-related-files.md` has prefix `architecture-`.

TODO: adjust this table for your project — these seven rows are a reasonable
starting point for a typical React app, not a fixed requirement. Add a row before
you write the first rule in a new category.

| Prefix        | Title                     | Impact | Description                                            |
| ------------- | ------------------------- | ------ | ------------------------------------------------------- |
| architecture- | Architecture & Structure  | HIGH   | Folder layout, module boundaries, where logic lives      |
| data-         | Data Fetching & State     | HIGH   | Fetching, caching, server/client state                   |
| components-   | Component Patterns        | MEDIUM | Composition, props, reusability                          |
| styling-      | Styling Conventions       | MEDIUM | Utility classes, design tokens, className conventions    |
| ui-states-    | UI State Completeness     | HIGH   | Loading, error, and empty states for async UI            |
| performance-  | Performance               | MEDIUM | Rendering, bundle size, memoization                      |
| testing-      | Testing                   | MEDIUM | What and how to test                                     |
