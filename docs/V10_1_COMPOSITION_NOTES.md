# v10.1 — naming, voice, composition and the visual audit

This revision answers three pieces of outside feedback and one composition
failure, and adds the automated check that would have caught the failure.

## 1. Name

The site now uses **Yonghoe JOO** throughout — given name first, family name in
capitals — with 주용회 shown alongside on the profile. Structured data carries
`givenName`, `familyName` and `alternateName` separately so search engines and
citation tools resolve the name correctly rather than guessing at the order.

## 2. Voice

The profile was written in the third person ("He is also President of…"), which
reads as a press release on someone's own page. Every biographical passage on
`about.html` and the profile section of `index.html` is now first person and
plainly stated. Words that praised the subject — "rigorous", "Researcher.
Operator. Builder." as a slogan — are gone. The page now opens with a factual
sentence, "I work between a laboratory and an industrial yard", and says
explicitly that it is an account of the work rather than a list of achievements.
Where the work is unfinished the text says so.

## 3. Contact

The profile ends with a contact section, and the two addresses also appear in the
footer of every page and in the command palette:

- `daejinpipero@yonsei.ac.kr` — academic
- `daejinpipero@gmail.com` — general

## 4. Composition

The previous profile hero used the lectern photograph as a full-bleed background.
That photograph is 635 × 710 — almost square — so a wide hero crop cut through the
subject's head and removed the Yonsei University emblem on the lectern. Both are
the point of the picture.

The hero is now a split layout on a paper background: the portrait sits in its own
frame at its native aspect ratio, uncropped, beside the text. The profile block on
the home page was changed the same way.

The full-bleed photographic sections were also failing. On a phone a landscape
photograph in a tall container can show only about 43 % of its width, which put the
welder off-frame entirely. Below 900 px those sections now stack: the photograph
keeps its own frame above the text instead of sitting behind it. On wider screens
the copy moved to the side opposite the subject, so text and subject no longer
overlap, and each photograph carries an explicit focal point.

## 5. The check that keeps it that way

`tools/visual_audit.mjs` renders all four pages at four viewports and hands each
protected element to `tools/detect_audit.py`, which judges the rendered pixels:
the geometric half recomputes the browser's own `object-fit: cover` crop and
asserts that measured regions — the head, the emblem, the torso, the welder, the
yard — are still inside it; the perceptual half runs Haar face detection for
headroom and framing, and multi-scale template matching to confirm the Yonsei
emblem is still on screen.

At the time of release the audit reports **108 checks passed, 0 failed** across
`index`, `about`, `case-001` and `404` at 1440, 1180, 834 and 390 px. The
interaction suite reports 24 assertions passed with no page errors.

Faults the audit found and forced fixes for, rather than my noticing them by eye:

- the home-page profile portrait rendered 128 px wide on a phone, because an
  inline `grid-template-columns` beat the responsive rule;
- the welder cropped out of frame at 390 px, and clipped top and bottom at 1440 px;
- the office building and pipe yard clipped on both sides at 390 px;
- the group photograph's face band cut at tablet width.

Two further defects surfaced during the visual review that the audit does not
cover, and were fixed: a "write to me" link rendered white on the paper
background, and the aerial photograph's overlay was too weak to keep the heading
legible over the bright roof.
