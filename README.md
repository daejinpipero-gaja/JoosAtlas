# JoosAtlas

**Research that survives contact with the field.**

JoosAtlas is the independent research platform of **Yonghoe JOO (주용회)**, connecting surveying, photogrammetry, computer vision, industrial operation and professional community.

Public site: <https://daejinpipero-gaja.github.io/JoosAtlas/>

---

## Structure

| File | Purpose |
|---|---|
| `index.html` | Editorial home — premise, 60-second experiment, Case 001 entry, profile, three worlds, atlas index |
| `case-001.html` | Public companion for Case 001 — question, five-stage method explorer, equation ledger with symbol glossaries and sign convention, field realization, sensitivity lab, three data visualizations, selected evidence, claim boundary, release ledger |
| `about.html` | Yonghoe JOO — a first-person account of the research, the workshop, the company and the alumni community, ending with contact addresses |
| `library.html` | The whole atlas on one shelf — every entry with its kind, language and status label, drawn from the registry |
| `film-001.html` | Film F·001 — the player, a scene list that drives it, and a ledger setting each of the film's statements against a public source |
| `manual-001/` | Field Manual M·001 — *Water-Based Fire Protection, Illustrated*; a self-contained illustrated manual (Korean) with the site's masthead and footer |
| `media/` | Film files and their posters |
| `404.html` | Off-the-atlas page with the same search and navigation |
| `joosatlas-library.js` | The registry — one block per entry; the home index, the library shelf and the ⌘K palette are drawn from it. See `docs/CONTENT_GUIDE_KR.md`. |
| `joosatlas-v10.css` | Single stylesheet — dual-theme token system, layout, components, print styles |
| `joosatlas-v10.js` | Single script — theme, command palette, method explorer, sensitivity lab, evidence explorer, SVG charts. No dependencies. |
| `joosatlas-i18n.js` | The Korean dictionary — one line per string, editable without touching any other file |
| `tools/` | The visual audit: renders every page at four viewports and checks the rendered pixels for cropped faces and lost symbols. See `tools/README.md`. |

Everything is static. There is no build step, no framework and no external network request: the site runs identically from GitHub Pages, from any static host, and from a local `file://` open.

---

## What is new in v12

**A registry.** `joosatlas-library.js` lists everything on the site once, in both languages. An entry without an address is shown as not yet open. Adding material means adding its files and one block to this file; the index, the shelf and the palette follow.

**A library.** `library.html` is the shelf, with a legend that fixes what each status label is allowed to mean.

**Field material.** Section 05 of the home page hangs two plates on a dark plane: Field Manual M·001 and Film F·001. The film is a real `<video>` with `preload="none"` — nothing is fetched until it is played — and its page sets every figure the film states against a public source, marking the ones that could not be matched.

**Page copy carries its own Korean.** New pages write `<p data-ko="…">English</p>`; the dictionary keeps only the chrome shared by all pages.

Design rationale and the verification record are in `docs/V12_LIBRARY_NOTES.md`.

## What is new in v10

**Both languages, everywhere.** A KR/EN control sits in the header (or press `L`). Switching translates every visible string on the page — headings, body text, chart axes, tooltips, the sensitivity lab's readouts, the command palette and the `alt` text — from `joosatlas-i18n.js`, then updates `<html lang>` so screen readers and machine translation behave correctly. Korean gets its own type stack, tracking, line height and `word-break: keep-all`, and its own measure on display lines, because a `ch`-based measure collapses when the glyphs are full-width. The choice is remembered; a first-time visitor whose browser is set to Korean lands in Korean. Numbers, units, symbols and proper nouns are shown identically in both by design.

**A dual-theme design system.** Every colour, rule and surface is a CSS custom property with a selected light ("paper") and dark ("field night") value. The theme follows the operating system by default, can be switched from the header or by pressing `T`, and is remembered between visits. Photographic sections stay dark-toned in both themes so the editorial imagery reads consistently.

**A command palette.** `⌘K` / `Ctrl-K` — or simply `/` — opens a fuzzy-search palette over every section of every page plus site actions: switch theme, copy a link to the current section, print or save as PDF, jump to the repository and the disclosure document. Arrow keys navigate, Enter opens, Escape closes.

**Three data visualizations built from the disclosed summary.** Each is drawn as inline SVG at real pixel dimensions, re-renders responsively and on theme change, carries a tooltip on hover and on keyboard focus, and ships an equivalent data table so no value is gated behind interaction:

- *Ground effect against image displacement* — one line per selected local inverse-Jacobian scale, the 5 cm limit as an explicit reference line, the crossing point marked on each line, and a gold marker that follows the sensitivity lab live.
- *Camera placements in the local N–E frame* — a plan view drawn from the estimated origin, the nominal 1.5 m primitive and 5.5 m generated boundary, and each condition's disclosed local camera vector with its viewing axis.
- *Residual profile of the selected TS boundary checks* — mean error (bias) as a dot, ±RMSE (dispersion) as a band, and the ±max |error| envelope as a whisker, per condition.

**A rebuilt sensitivity lab.** The slider, both unit-bearing rulers, the four result tiles and the curve chart all consume the same explicit relation `g = p × m ÷ 10`, so no readout can disagree with another. "Set the 5 cm limit" snaps to the largest displacement that stays inside the threshold for the selected range.

The palette was validated with a colour-vision-deficiency and contrast checker in both themes: all series colours clear the lightness band, the chroma floor, the all-pairs CVD separation floor and 3:1 contrast against their own surface.

---

## Interactive learning

The sensitivity lab lets a visitor change the viewing range and the image displacement, then observe the selected local ground consequence against a 5 cm threshold. It is an educational comparison, not a global system-accuracy specification.

Selected local scales used throughout: **27.815 mm/px at 7 m**, **41.079 mm/px at 9 m**, **61.782 mm/px at 12 m**. The corresponding 5 cm pixel limits are 1.798 px, 1.217 px and 0.809 px.

---

## Public disclosure

The public site includes selected field records, theory and object-space evidence. Raw coordinates, complete terminal image results, calibration files and reviewer correspondence remain outside the public package. See [`docs/PUBLIC_DISCLOSURE.md`](docs/PUBLIC_DISCLOSURE.md).

The signed radial-difference convention displayed on the site must remain synchronized with the final accepted manuscript. If the manuscript reverses the subtraction order, the sign labels in `case-001.html` must reverse with it.

---

## Deploying

Copy the contents of this package to the repository root and push. `.nojekyll` is included so GitHub Pages serves the files verbatim.

Korean deployment guide: [`README_GITHUB_UPDATE_KR.md`](README_GITHUB_UPDATE_KR.md).

---

## Accessibility & performance notes

- Every interactive control is a real `<button>` or `<input>` with an accessible name; the method explorer is a proper tab set with arrow-key navigation, and the command palette is a `combobox` + `listbox` with `role="option"` and `aria-activedescendant`.
- Every chart mark is focusable and carries its values in an `aria-label`, so the data is reachable by keyboard as well as by pointer; each chart also ships an equivalent table.
- `prefers-reduced-motion` disables reveals, parallax and smooth scrolling.
- A print stylesheet drops the chrome, expands hidden content and prints link targets.
- Images are lazy-loaded below the fold, served through `srcset` at 800 / 1400 / full width, and the hero image is marked `fetchpriority="high"`.
- One CSS file, one JS file and one dictionary — no web-font request, no third-party script, no build step.

## Contact

- `daejinpipero@yonsei.ac.kr` — academic
- `daejinpipero@gmail.com` — general

---

## Composition is checked, not eyeballed

Photographs on this site carry protected regions — a head, the Yonsei University
emblem on the lectern, the welder and the arc, the office building and the pipe
yard — measured from the source files. `tools/visual_audit.mjs` renders all four
pages at 1440, 1180, 834 and 390 px, recomputes the browser's own
`object-fit: cover` crop for every marked element, and fails if a protected region
falls outside it. It then runs face detection and template matching on the
rendered pixels to confirm, perceptually, that the subject has headroom and the
symbol is still on screen. Current status: **108 checks passed, 0 failed**. A second harness, `lang_audit`, loads every page in Korean, exercises the interactive parts, and fails if any *visible* text node is still English: currently **418 strings checked, 0 still English**.

Run it before publishing a layout change:

```
python3 -m http.server 8899
node tools/visual_audit.mjs
```

---

© 2026 Yonghoe JOO. Affiliations are biographical context; JoosAtlas is an independent personal research platform.
