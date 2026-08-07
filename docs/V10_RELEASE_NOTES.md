# JoosAtlas v10 release notes

Version 10.0.0 — "Instrument". A full recreation of the public site on a new design system, with a productivity layer and a data-visualization layer added. All scientific content, numbers, equations, symbol glossaries, sign conventions and claim boundaries carry over from v9 unchanged.

## Design system

A single token layer drives both themes. Every surface, rule, ink and series colour is a CSS custom property declared three times — once for light, once under `[data-theme="dark"]`, and once under `prefers-color-scheme: dark` guarded so an explicit light choice still wins. A `.tone-dark` scope re-declares the dark tokens locally, which is how photographic sections stay dark-toned in the light theme without hard-coded colours.

Typography moved to a system stack with no web-font request: an editorial serif for display, the platform UI sans for body, and a monospace for every label, figure and readout. Numbers in columns use tabular figures; standalone values use proportional figures.

## Colour validation

The chart palette was checked with a CVD and contrast validator against each theme's own chart surface (`#fffdf8` light, `#0f2130` dark) on the all-pairs list, because the geometry plot places any two series marks side by side:

| Slot | Light | Dark |
|---|---|---|
| C3 | `#2a63c9` | `#4a86e8` |
| R3 | `#16967d` | `#2aa385` |
| D3 | `#b97e28` | `#bd8524` |

All three clear the lightness band, the chroma floor, ≥ 3:1 contrast, the all-pairs CVD separation target (worst pair ΔE 10.0 light / 11.1 dark under protanopia, OKLab ×100) and the normal-vision floor (18.5 light / 17.9 dark, floor 15).

The three viewing ranges are an *ordered* quantity, not independent identities, so the sensitivity curves use a one-hue ordinal ramp instead — `#7fa0e0 → #2a63c9 → #16386f` light, `#a9c3f5 → #5e93ec → #2a63c9` dark — validated for monotone lightness, adjacent ΔL ≥ 0.06 and light-end contrast ≥ 2:1.

The 5 cm threshold wears a reserved limit colour (`#b3322e` light, `#ef7b74` dark) that is never used for a series, and always ships with a visible label.

## Productivity layer

- **Command palette** — `⌘K`, `Ctrl-K` or `/`. Fuzzy subsequence matching with match highlighting, scored so a title hit always outranks a keyword hit. Indexes 23 sections across four pages plus six actions: toggle theme, copy a link to the section currently in view, print, back to top, repository, disclosure document.
- **Theme control** — header button or `T`. Persisted in `localStorage`; falls back to the OS preference when never set. An inline head script applies the stored theme before first paint, so there is no flash.
- **Section-aware navigation** — the reading-progress bar, the header tone and the highlighted nav item all track the section in view.
- **Table view for every chart** — each visualization ships an equivalent HTML table behind a toggle, so no value is reachable only by hovering.

## Visualization layer

Three inline-SVG charts, drawn at real pixel dimensions and re-rendered on container resize and on theme change, so text never scales away on a phone:

1. **Ground effect against image displacement** (`#chart-curves`) — one line per selected local scale, the 5 cm reference line, the crossing point marked on each line, a crosshair tooltip listing all three series at the hovered displacement, and a live gold marker driven by the sensitivity lab.
2. **Camera placements in the local N–E frame** (`#chart-geometry`) — plan view from the estimated origin with the nominal 1.5 m primitive and 5.5 m generated boundary, and each condition's disclosed local camera vector plus its viewing axis drawn as a wedge back toward the origin. Ranges and azimuths are computed from the disclosed vectors: C3 9.25 m at 332.4°, R3 8.62 m at 284.8°, D3 5.16 m at 255.6°.
3. **Residual profile** (`#chart-residual`) — per condition, mean error as a dot (bias), ±RMSE as a band (dispersion), ±max |error| as a whisker (observed envelope).

A fourth, simpler comparison chart appears on the home page for the fixed 2.0 px case.

## Corrections and consistency

- The sensitivity lab, the ruler gauges, the result tiles and the curve chart are all computed from one function, so a displayed status can never contradict a displayed value.
- The 5 cm pixel limit is now reported as **1.798 px** at 7 m (correctly rounded from 1.79760…), replacing the truncated 1.797 px shown in v9.
- The evidence explorer reads its metrics from the same in-page dataset as the residual chart and the geometry plot, so the three cannot drift apart.

## Verification performed

Rendered in Chromium at 1440 × 950 and 390 × 844, in both themes, across all four pages. A scripted suite exercised the command palette, theme toggle and persistence, the method explorer including arrow-key navigation, every lab control and its arithmetic, both table toggles, the evidence explorer across all six placement/view combinations, the lightbox, chart tooltips and the mobile navigation — 25 assertions, no page errors.

## Unchanged from v9

Every equation, symbol definition, sign-convention row, claim-boundary item, release-ledger status and disclosure statement is carried over verbatim. `docs/PUBLIC_DISCLOSURE.md`, `docs/V9_CORRECTION_NOTES.md` and the earlier test records remain in the package.
