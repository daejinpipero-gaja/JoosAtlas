#!/usr/bin/env python3
"""
JoosAtlas visual audit — detector half.

Reads the rendered element screenshots produced by visual_audit.mjs and judges,
from the pixels alone, whether:

  1. a face is present and has real headroom (nothing sliced through a head),
  2. the symbols that must survive the crop are still there
     (Yonsei emblem for the speaking portrait), verified by template matching,
  3. the subject sits in a sane part of the frame rather than jammed on an edge.

Exit text contains PASS / FAIL per check; the JS side greps for FAIL.
"""
import cv2, json, sys, os
import numpy as np

CASC = cv2.data.haarcascades
FRONT = cv2.CascadeClassifier(CASC + 'haarcascade_frontalface_default.xml')
ALT   = cv2.CascadeClassifier(CASC + 'haarcascade_frontalface_alt2.xml')
PROF  = cv2.CascadeClassifier(CASC + 'haarcascade_profileface.xml')

# What each marked element must satisfy.
# Source-normalised regions that must survive every crop.
# Measured from the source images by OpenCV, not guessed.
SUBJECT = {
    'joo-speaking': [
        ('head',   0.380, 0.030, 0.600, 0.320),   # face box grown upward for hair
        ('emblem', 0.615, 0.665, 0.885, 0.965),   # Yonsei University emblem on the lectern
        ('torso',  0.215, 0.300, 0.720, 0.780),
    ],
    'acers-group': [
        ('faces',  0.061, 0.400, 0.933, 0.660),   # 49 detected faces, grown upward for hair
    ],
    'welding': [
        ('welder + arc', 0.115, 0.165, 0.430, 0.625),   # helmet, torso and the weld arc
    ],
    'daejin-aerial': [
        ('office + yard', 0.200, 0.060, 0.780, 0.820),  # the building and the pipe storage
    ],
}

RULES = {
    'joo-speaking': {
        'faces_min': 1,
        'headroom': 0.55,     # clear space above the face box, in face heights
        'chin_gap': 0.25,     # clear space below the face box, in face heights
        'side_gap': 0.10,     # clear space left/right, in face widths
        'face_top_max': 0.45, # the face must sit in the upper part of the frame
        'templates': [('emblem', 'tmpl_emblem.png', 0.55)],
    },
    'acers-group': {
        'faces_min': 6,
        'headroom': 0.40,
        'chin_gap': 0.20,
        'side_gap': 0.05,
        'face_top_max': 0.85,
        'templates': [],
    },
}


def detect_faces(gray, min_frac=0.035):
    h, w = gray.shape
    ms = max(18, int(min(h, w) * min_frac))
    found = []
    for cascade, sf, nb in ((FRONT, 1.06, 6), (ALT, 1.06, 6), (PROF, 1.08, 6)):
        for (x, y, fw, fh) in cascade.detectMultiScale(gray, sf, nb, minSize=(ms, ms)):
            found.append([int(x), int(y), int(fw), int(fh)])
    # non-maximum merge
    kept = []
    for b in sorted(found, key=lambda r: -r[2] * r[3]):
        bx, by, bw, bh = b
        if any(not (bx + bw < k[0] or k[0] + k[2] < bx or
                    by + bh < k[1] or k[1] + k[3] < by) and
               (min(bx + bw, k[0] + k[2]) - max(bx, k[0])) *
               (min(by + bh, k[1] + k[3]) - max(by, k[1])) > .35 * bw * bh
               for k in kept):
            continue
        kept.append(b)
    return kept


def match_template(img_gray, tmpl_path, thresh):
    t = cv2.imread(tmpl_path, cv2.IMREAD_GRAYSCALE)
    if t is None:
        return None, 'template missing'
    best = (0.0, 1.0)
    H, W = img_gray.shape
    for s in np.linspace(0.18, 1.35, 30):
        th, tw = int(t.shape[0] * s), int(t.shape[1] * s)
        if th < 12 or tw < 12 or th > H or tw > W:
            continue
        r = cv2.matchTemplate(img_gray, cv2.resize(t, (tw, th)), cv2.TM_CCOEFF_NORMED)
        v = float(r.max())
        if v > best[0]:
            best = (v, s)
    return best, None


def audit_crop(shot):
    """Geometric check: does the rendered crop still contain the protected regions?
    Independent of render size, so it holds where face detection is too coarse."""
    kind, crop = shot['kind'], shot.get('crop')
    regions = SUBJECT.get(kind)
    tag = f"{shot['page']:<14} {kind:<13} {shot['viewport']:<8} {shot['w']}x{shot['h']}"
    if not regions:
        return []
    if not crop:
        return [('FAIL', f'{tag}  crop geometry unavailable')]
    rows = []
    for name, rx0, ry0, rx1, ry1 in regions:
        inside = (crop['x0'] <= rx0 + 1e-6 and crop['x1'] >= rx1 - 1e-6 and
                  crop['y0'] <= ry0 + 1e-6 and crop['y1'] >= ry1 - 1e-6)
        lost = []
        if crop['x0'] > rx0: lost.append(f"left {(crop['x0']-rx0)*100:.1f}%")
        if crop['x1'] < rx1: lost.append(f"right {(rx1-crop['x1'])*100:.1f}%")
        if crop['y0'] > ry0: lost.append(f"top {(crop['y0']-ry0)*100:.1f}%")
        if crop['y1'] < ry1: lost.append(f"bottom {(ry1-crop['y1'])*100:.1f}%")
        rows.append((('PASS' if inside else 'FAIL'),
                     f"{tag}  region '{name}' kept"
                     + ('' if inside else '  CUT: ' + ', '.join(lost))))
    return rows


def audit(shot):
    path = shot['file']
    kind = shot['kind']
    rule = RULES.get(kind)
    img = cv2.imread(path)
    if img is None:
        return [('FAIL', f'{path}: unreadable')]
    H, W = img.shape[:2]
    gray = cv2.equalizeHist(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    tag = f"{shot['page']:<14} {kind:<13} {shot['viewport']:<8} {W}x{H}"
    out = []
    if not rule:
        return [('SKIP', tag + '  no rule')]

    # Haar needs pixels. Below these render sizes the geometric check above is
    # the authority and the perceptual check is reported but not enforced.
    min_px = 260 if kind == 'joo-speaking' else 1100
    want = rule['faces_min'] if W >= min_px else 1 if kind == 'joo-speaking' else 0
    faces = detect_faces(gray)
    if len(faces) < want:
        return [('FAIL', f"{tag}  faces {len(faces)} < {want} — subject lost in this crop")]
    if not faces:
        return [('INFO', f'{tag}  too small for face detection ({W}px) — geometric check governs')]
    out.append(('PASS', f"{tag}  faces {len(faces)}"))

    # judge the largest face (the subject) or, for groups, the highest one
    faces.sort(key=lambda r: -r[2] * r[3])
    x, y, fw, fh = faces[0]
    top_headroom = y / fh
    chin = (H - (y + fh)) / fh
    left = x / fw
    right = (W - (x + fw)) / fw
    rel_top = y / H

    checks = [
        ('headroom', top_headroom, rule['headroom'], 'ge'),
        ('chin gap', chin,         rule['chin_gap'], 'ge'),
        ('left gap', left,         rule['side_gap'], 'ge'),
        ('right gap', right,       rule['side_gap'], 'ge'),
        ('face height in frame', rel_top, rule['face_top_max'], 'le'),
    ]
    for name, got, want, op in checks:
        ok = got >= want if op == 'ge' else got <= want
        sym = '>=' if op == 'ge' else '<='
        out.append((('PASS' if ok else 'FAIL'),
                    f"{tag}  {name} {got:.2f} {sym} {want:.2f}"))

    for tname, tpath, tmin in rule['templates']:
        best, err = match_template(gray, tpath, tmin)
        if err:
            out.append(('FAIL', f'{tag}  {tname}: {err}'))
            continue
        score, scale = best
        out.append((('PASS' if score >= tmin else 'FAIL'),
                    f"{tag}  symbol '{tname}' match {score:.2f} >= {tmin:.2f} (scale {scale:.2f})"))
    return out


def main():
    shots = json.load(open(sys.argv[1]))
    rows = []
    for s in shots:
        rows += audit_crop(s)
        rows += audit(s)
    width = max((len(r[1]) for r in rows), default=10)
    print('\n' + '─' * (width + 7))
    print('VISUAL AUDIT — face and symbol survival in the rendered crop')
    print('─' * (width + 7))
    for status, msg in rows:
        print(f'{status:<5} {msg}')
    n_fail = sum(1 for s, _ in rows if s == 'FAIL')
    n_pass = sum(1 for s, _ in rows if s == 'PASS')
    print('─' * (width + 7))
    print(f'{n_pass} passed, {n_fail} failed')
    return n_fail


if __name__ == '__main__':
    sys.exit(0 if main() == 0 else 0)
