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
| `404.html` | Off-the-atlas page with the same search and navigation |
| `joosatlas-v10.css` | Single stylesheet — dual-theme token system, layout, components, print styles |
| `joosatlas-v10.js` | Single script — theme, command palette, method explorer, sensitivity lab, evidence explorer, SVG charts. No dependencies. |
| `tools/` | The visual audit: renders every page at four viewports and checks the rendered pixels for cropped faces and lost symbols. See `tools/README.md`. |

Everything is static. There is no build step, no framework and no external network request: the site runs identically from GitHub Pages, from any static host, and from a local `file://` open.

---

## What is new in v10

**A dual-theme design system.** Every colour, rule and surface is a CSS custom property with a selected light ("paper") and dark ("field night") value. The theme follows the operating system by default, can be switched from the header or by pressing `T`, and is remembered between visits. Photographic sections stay dark-toned in both themes so the editorial imagery reads consistently.

**A command palette.** `⌘K` / `Ctrl-K` — or simply `/` — opens a fuzzy-search palette over every section of every page plus site actions: switch theme, copy a link to the current section, print or save as PDF, jump to the repository and the disclosure document. Arrow keys navigate, Enter opens, Escape closes.

**Three data visualizations built from the disclosed summary.** Each is drawn as inline SVG at real pixel dimensions, re-renders responsively and on theme change, carries a hover and keyboard-reachable tooltip, and ships an equivalent data table so no value is gated behind interaction:

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

- Every interactive control is a real `<button>` or `<input>` with an accessible name; the method explorer is a proper tab set with arrow-key navigation.
- `prefers-reduced-motion` disables reveals, parallax and smooth scrolling.
- A print stylesheet drops the chrome, expands hidden content and prints link targets.
- Images are lazy-loaded below the fold; the hero image is marked `fetchpriority="high"`.
- One CSS file (51 KB raw, 11 KB gzipped) and one JS file (41 KB raw, 13 KB gzipped), with no web-font request and no third-party script.

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
symbol is still on screen. Current status: **108 checks passed, 0 failed**.

Run it before publishing a layout change:

```
python3 -m http.server 8899
node tools/visual_audit.mjs
```

---

© 2026 Yonghoe JOO. Affiliations are biographical context; JoosAtlas is an independent personal research platform.
