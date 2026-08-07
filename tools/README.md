# Visual audit

A two-part check that renders the site and then judges the rendered pixels,
so a cropped face or a lost symbol fails a build instead of reaching a reader.

```
npm i playwright
pip install opencv-python-headless --break-system-packages
python3 -m http.server 8899          # from the site root
node tools/visual_audit.mjs          # prints PASS / FAIL per check
```

## What it does

`visual_audit.mjs` loads every page at four viewports (1440, 1180, 834 and 390 px),
forces lazy images to load, then for every element carrying `data-portrait="…"`:

1. screenshots that element alone, and
2. computes the exact source region the crop keeps — the same
   `object-fit: cover` arithmetic the browser performs, read back from
   `getComputedStyle`, so the answer is the browser's, not an estimate.

`detect_audit.py` then judges each one twice.

**Geometric check.** Every `data-portrait` kind has protected regions measured
from the source image, in source-normalised coordinates: the head, the Yonsei
emblem on the lectern, the torso, the welder and the arc, the office and the
pipe yard. If a crop no longer contains one, the report names the region and
says exactly how much was lost and from which edge.

**Perceptual check.** OpenCV Haar cascades (frontal, alt2 and profile, merged by
non-maximum suppression) look for faces in the rendered pixels and require real
headroom above the head, a chin gap below it, side clearance, and the face
sitting in the upper part of the frame. The Yonsei emblem is confirmed by
multi-scale template matching against `tmpl_emblem.png`, which was cut from the
source photograph — so the report can state that the symbol survived, rather
than assuming it. Below a render width where Haar stops being reliable the
perceptual check reports INFO and the geometric check governs.

## Adding a new protected image

1. Put `data-portrait="my-photo"` on the element (the `<img>` or its wrapper).
2. Add its protected regions to `SUBJECT` in `detect_audit.py`, normalised to the
   source image, measured — not guessed.
3. Optionally add face rules to `RULES` and a template PNG for any symbol that
   must survive.
4. Re-run. Fix the layout until it passes; do not loosen the region to make the
   check green.

---

# Language audit

```
python3 -m http.server 8899
node tools/lang_audit.mjs
```

Loads every page with Korean selected, clicks through the method explorer, the
evidence explorer, the range selector and a data table so the JavaScript-generated
text is included, then walks the rendered DOM and reports any *visible* text node
still showing English. It also verifies that `<html lang>` is set and that
switching back to English is lossless.

Numbers, units, symbols, e-mail addresses and proper nouns are allowed through by
the `ALLOWED` pattern and the `KEEP` set at the top of the file. Everything else
must have a Korean counterpart in `joosatlas-i18n.js`.

To rebuild the dictionary after adding new copy:

```
python3 tools/build_i18n.py
```

It extracts every translatable string from the four pages, checks the dictionary
covers all of them, and exits non-zero — naming the missing strings — if it does
not. Add the Korean for anything it reports, then run it again.
