# JoosAtlas v12.0 — "Library"

v11 was a site about one research case. v12 turns it into a site that can keep
receiving material without being rebuilt each time, and adds the first two
pieces of field material.

## What changed

| | |
|---|---|
| `joosatlas-library.js` | New. The registry: one block per entry. The home index, the library shelf and the ⌘K palette are all drawn from it. |
| `library.html` | New. Every entry on one shelf, filterable by kind, with a legend that fixes the meaning of each status label. |
| `manual-001/` | New. Field Manual M·001, *Water-Based Fire Protection, Illustrated* — five chapters, 53 parts, 114 symptoms, 8 decision paths. Korean only. |
| `film-001.html`, `media/film-001/` | New. Film F·001, *Sparks*, with a scene list that drives the player and a ledger setting each of the film's statements against a public source. |
| `index.html` | New section 05 "Field library" (two plates); section 06 index now drawn from the registry; nav and footer gained the library. |
| `joosatlas-v10.css` | Section 22 appended: vault plane, plates, shelf, film page. Nothing above it was edited. |
| `joosatlas-v10.js` | Command palette reads the registry, shows Korean titles for registry entries, and translates its group headings. |
| `joosatlas-i18n.js` | 31 chrome and palette strings added. |
| `case-001.html`, `about.html`, `404.html` | Footer link to the library, registry script, cache-bust to `?v=12.0.0`. Their content, and their "Updated" stamps, are unchanged. |
| Two phone-width defects from v11 | On Case 001 at 390 px in English, a chart card and a data table ran 39 px past the screen. Both are fixed in CSS section 22 (`minmax(0,1fr)` tracks; the table scrolls inside its own box). No markup was changed. |

## Why it is built this way

**One registry instead of three lists.** Before v12 the index rows, the palette
entries and any future catalogue would each have been edited by hand. Three
hand-kept lists drift. Now an entry is written once, in both languages, and an
entry without an `href` is listed as not yet open rather than silently absent.

**Labels with fixed meanings.** The site's premise is that nothing is presented
as complete before its status can be stated. `library.html#labels` writes down
what *Open*, *Under review*, *In development* and *Planned* are allowed to mean,
and the status text of an open entry says what is still unchecked.

**Plates, not cards.** The manual and the film are hung on the home page as two
matted frames on a dark plane, at a column ratio (2.9 : 1) where a wide drawing
and a 9:16 film reach the same height. The aim was weight: few elements, each
given room.

**The film is not fetched until it is played.** The player is a real `<video>`
with `preload="none"`; the 15 MB file costs a visitor nothing unless they press
play. Language switching repaints text in place, so a playing film is not
interrupted.

**A film is not a source.** The film states figures. `film-001.html#claims`
places each one beside a public document and marks the two that could not be
fully matched. This applies the Case 001 discipline to material the site did
not originate.

**Page copy carries its own Korean.** New pages write
`<p data-ko="한국어">English</p>`. The dictionary now holds only chrome shared by
every page, so adding a page no longer means editing the dictionary.

**No external requests, still.** The manual's standalone edition loads a web
font; the edition served here does not. The site continues to run from
`file://` and from any static host.

## Verification

Run on 26 November 2026 against a local static server.

- 285 local references (links, images, anchors, registry and palette targets): 0 broken.
- 140 page loads — 7 pages × 5 viewport/engine combinations (Chrome at 1440, 1180
  and 834 px; WebKit at iPhone 13 and 1280 px) × 2 languages × 2 themes: no script
  errors, no failed requests, no broken images, no horizontal overflow. (The first
  run found the two v11 overflows noted above; the figures here are from the run
  after the fix.)
- 59 interaction assertions in Chrome and WebKit: plates and index drawn from the
  registry, film not fetched before play, playback, scene seek, language switch
  during playback, palette search in both languages, shelf filter, manual
  navigation, and the no-script fallbacks.

## Known limits

- The manual is Korean only. Clause numbers it could not check against the
  current standard text are marked "대조 필요" in the manual itself.
- The film's "15 m" figure and the escape-facility part of its third rule were
  not matched to a public source; the page says so.
- KOSHA GUIDE A-G-14-2026 was not opened; the guideline was read in its 2016 reprint.
- `tools/build_i18n.py` received the new strings for parity, but it still needs
  the `strings.json` extraction that is not in the repository.


---

# v12.1 — the thesis, and the film where it belongs

v12.0 hung the film beside the fire-protection manual. That was the wrong wall: the
film is about welding sparks, which is the subject of the author's master's thesis and
of the welding photograph already on the home page. v12.1 moves it there and gives the
thesis its own page.

## What changed

| | |
|---|---|
| `thesis-2023.html` | New. *Detection of Fire Hazard Factors on Construction Sites using YOLOv5* (Yonsei University, 2023), read in plain language: problem, idea, data and labels, findings, limits, the film's scenes and sources, bibliographic record. |
| `index.html` | The welding scene (`#sparks`) now carries the film as a 9:16 plate and a link to the thesis. Section 05 hangs the manual alone. Index gains the thesis row. |
| `film-001.html` | Now a forwarding stub to `thesis-2023.html#film`, so the v12.0 address keeps working. Its scene list and source ledger moved to the thesis page unchanged. |
| `joosatlas-library.js` | Thesis entry added (`MSc`); the film entry points at the thesis page and is no longer hung on the home page. A single home plate is laid out drawing-left, caption-right. |
| `joosatlas-v10.css` | Section 23 appended. Also: buttons on photograph sections are now light-on-dark (the line button there had no visible rule), and grid children may shrink so a scrolling table cannot widen a phone page. |
| `manual-001/index.html` | Masthead and footer link to the thesis instead of the old film page. |

## Why the thesis page is built this way

**It follows the thesis, not the film.** The page is ordered as an argument: why the
usual detector fails on a site, why three classes instead of one alarm, what went wrong
with the first labels, what eight models showed, what none of it proves.

**The failure is given the most room.** The first dataset boxed the whole shower of
sparks; 69% of background was called welding and only 43% of welding was found. That
finding, and the plain fix (box the core, keep boxes tight, drop hidden objects), is
the part of the thesis most useful to someone else, so it has its own section.

**Every figure is from the thesis.** Table 1.1 (fires per year), the confusion-matrix
percentages, Table 5.1 (eight models) and the YOLOv8 comparison are transcribed, not
re-measured. The results table is drawn with bars on a 0–1 scale so that near-equal
mAP50 values look near-equal. No result was added that the thesis does not contain.

**Limits are stated as limits.** The thesis detects; it does not alarm. It was scored
on held-out images and recorded video, not on a site. The page says so in its own
section rather than in a footnote.

**The full text is not hosted.** The page gives the bibliographic record instead.

## Verification (v12.1)

Run on 26 November 2026 against a local static server.

- 279 local references (links, images, anchors, registry and palette targets): 0 broken.
- 112 page loads — 7 pages × 4 viewport/engine combinations (Chrome at 1440, 1024 and
  834 px; WebKit at iPhone 13) × 2 languages × 2 themes: no script errors, no failed
  requests, no broken images, no horizontal overflow.
- 67 interaction assertions in Chrome and WebKit: film plays inside the welding scene
  and is not fetched before that, language switch during playback, thesis page scene
  seek, eight result rows and five yearly bars present, palette finds the thesis in
  both languages, the old film address forwards with and without script.

## Known limits

- The Korean name of the department and of the supervisor are not printed in the
  thesis, so the record gives them in English only.


---

# v12.1.1 — figures from the thesis

The thesis page now carries eleven figures reproduced from the thesis, each placed
where the argument needs it and captioned in both languages:

| Section | Figures |
|---|---|
| 02 Idea | 3.4 (how YOLOv5 reads a frame), 3.1 (welding filmed at 0.02 s intervals) |
| 03 Data | 4.3 (images that misled the model), 4.4 (confusion matrix with the first labels), 4.7 (the repaired box), 3.3 (research loop), 4.10 (F1 before and after Focal Loss) |
| 04 Findings | 5.2 (best confusion matrix after the repairs), 5.3 (labels against predictions), 5.1 (input size), 5.6 (YOLOv5 against YOLOv8) |

Files are in `assets/images/thesis/`, cut from the PDF at the resolution of the
embedded originals. Left out: figures the thesis quotes from other publications or
from news and online footage (1.1, 1.2, 2.1–2.8, 3.2, 4.1, 4.2, 4.6, 4.8, 5.4, 5.5) and
the figure showing children (4.5).

Reading Figures 4.4 and 5.2 side by side gave the page a before-and-after it did not
have: Welding found correctly rose from 0.43 to 0.98. The page also now words the
background column of a YOLOv5 confusion matrix for what it is — the make-up of the
false detections by class — rather than as a rate.

Checked: all eleven images load in Chrome and WebKit, no horizontal overflow at
1440 px or on an iPhone 13; 301 local references, 0 broken; the 67-assertion
interaction suite passes unchanged.
