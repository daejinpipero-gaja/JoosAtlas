# v11 — Korean, and a quieter instrument

Two requests drove this revision: the site had to be readable in Korean, and the
atmosphere was to follow NASA and Apple. Both are visible changes; the first is
also a structural one.

## Korean

The site now carries both languages rather than relying on a browser's machine
translation. A KR/EN control sits in the header, `L` toggles it from the
keyboard, and it is also an entry in the command palette. The choice is
remembered between visits, and a first-time visitor whose browser is set to
Korean arrives in Korean without touching anything.

Switching does four things. It replaces every visible string from
`joosatlas-i18n.js`; it replaces the translatable attributes — `alt`,
`placeholder`, `aria-label`, `title` — along with the page title and meta
description; it sets `<html lang>` so assistive technology and any external
translation layer behave correctly; and it re-renders the charts and the
sensitivity lab, whose axis titles, legends, tooltips and status lines are
generated in JavaScript rather than written in the HTML.

The dictionary is one file with one line per string, English on the left and
Korean on the right. To change a Korean phrase, edit the right-hand side; nothing
else needs to move. Strings absent from the file — numbers, units, symbols,
e-mail addresses, `RMSE`, `Yonghoe JOO`, `ACERS` — are shown identically in both
languages on purpose.

The terminology follows the manuscript work rather than a dictionary: 생성원 for
the surveyed primitive, 물체공간 for object space, 역투영 for back-projection,
부호 있는 종단 감사 for the signed terminal audit, 역야코비안 스케일 for the
inverse-Jacobian scale, 잔차 and 산포 and 편향 for residual, dispersion and bias.

Korean also gets its own typography, because reusing the Latin settings produces
bad Korean. It takes a Hangul-capable stack, looser tracking, a taller line, and
`word-break: keep-all` so a technical term never splits mid-word. Display lines
get their measure in `em` rather than `ch`: Hangul is full-width, so a
`ch`-based measure that reads well in English collapses to a narrow column in
Korean — the research-principle line wrapped onto seven lines before this was
fixed, and reads on two now.

## NASA and Apple

The two references pull in different directions, and the site uses each where it
belongs.

From NASA: precision as an aesthetic. A telemetry strip now runs above the home
ledger carrying the local-frame origin, the declared scale factor λ = 11/3, and a
UTC clock that ticks. It is small, monospaced and quiet, and it is all true —
the coordinates are the estimated origin from the disclosed summary. The site
already numbered its chapters and labelled its axes with units; the strip
finishes the instrument feel without adding decoration.

From Apple: restraint and air. A single full-bleed statement now sits between the
chapters on the home page, holding one sentence — *Do not claim what the
measurement chain cannot support* — with nothing competing for attention, hairline
rules top and bottom, and one line of context beneath it. The research principle
had been a blockquote at the end of a section; it is now the moment the page
pauses on.

## Also fixed

The README claimed the chart tooltips were keyboard-reachable. They were not —
the hit targets were `<rect>` elements with pointer listeners and no tab stop. Each
one is now focusable, carries its values in an `aria-label`, and opens its tooltip
on focus. The claim is true now, which matters on a site whose argument is that
you do not state more than you can support.

The command palette announced itself as a `listbox` while its children were plain
buttons. The input is now a `combobox` with `aria-autocomplete` and
`aria-activedescendant`, and each row is an `option` with `aria-selected`.

The nine heaviest photographs are served through `srcset` at 800, 1400 and full
width, so a phone no longer downloads a 2400 px hero. Every page footer carries a
visible last-updated date.

## Verification

Three harnesses, all run against the rendered page rather than the source:

| Harness | Result |
|---|---|
| `lang_audit` — Korean coverage in the rendered DOM | 418 visible strings checked, 0 still English |
| `visual_audit` — face and symbol survival at four viewports | 108 checks passed, 0 failed |
| interaction suite — palette, theme, explorer, lab arithmetic, tables, evidence, lightbox, tooltips | 24 assertions passed, no page errors |

The language audit exercises the interactive parts before measuring, so the
method explorer's third stage, the R3 placement, the 3D view, the 12 m range and
an opened data table are all included in the count. It also checks that switching
back to English is lossless, since the engine caches every original string rather
than re-parsing the page.
