#!/usr/bin/env python3
"""Genera le icone Android (cesto della spesa in stile incisione su pergamena).
Uso: python3 scripts/make_icons.py   (richiede Pillow)
Scrive in icons/res/ i file che il workflow copia dentro il progetto Android."""
import os
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RES = os.path.join(ROOT, "icons", "res")
INK, RED, GOLD = (58, 40, 20, 255), (139, 46, 31, 255), (176, 138, 60, 255)
PARCH_IN, PARCH_OUT = (250, 240, 210), (220, 194, 138)
SS = 4  # supersampling


def bez(p0, p1, p2, p3, n=40):
    out = []
    for i in range(n + 1):
        t = i / n
        a, b, c, d = (1 - t) ** 3, 3 * t * (1 - t) ** 2, 3 * t * t * (1 - t), t ** 3
        out.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
                    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return out


def stroke(d, pts, w, col):
    for a, b in zip(pts, pts[1:]):
        d.line([a, b], fill=col, width=int(w))
    r = w / 2
    for x, y in pts:
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)


def basket(d, S, tx, ty, sc):
    k = S / 1024.0
    m = lambda x, y: ((tx + sc * x) * k, (ty + sc * y) * k)
    w1, w2 = 1.7 * sc * k, 0.9 * sc * k
    stroke(d, [m(8, 20), m(40, 20), m(36, 40), m(12, 40), m(8, 20)], w1, INK)
    stroke(d, [m(6, 20), m(42, 20)], w1, INK)
    stroke(d, [m(*p) for p in bez((15, 20), (15, 10), (33, 10), (33, 20))], w1, INK)
    for a, b in [((14, 26), (16, 36)), ((21, 26), (21, 36)), ((27, 26), (27, 36)),
                 ((34, 26), (32, 36)), ((11, 24), (37, 24)), ((13, 32), (35, 32))]:
        stroke(d, [m(*a), m(*b)], w2, INK)


def ring(d, S, r, w, col):
    k = S / 1024.0
    c, R = 512 * k, r * k
    d.ellipse([c - R, c - R, c + R, c + R], outline=col, width=int(w * k))


def full_icon(size):
    S = size * SS
    grad = Image.radial_gradient("L").resize((S, S))  # 0 al centro, 255 ai bordi
    im = Image.composite(Image.new("RGB", (S, S), PARCH_OUT), Image.new("RGB", (S, S), PARCH_IN), grad).convert("RGBA")
    d = ImageDraw.Draw(im)
    ring(d, S, 420, 16, RED)
    ring(d, S, 388, 6, RED)
    k = S / 1024.0
    for x, y in [(512, 92), (512, 932), (92, 512), (932, 512)]:
        d.ellipse([(x - 14) * k, (y - 14) * k, (x + 14) * k, (y + 14) * k], fill=GOLD)
    basket(d, S, 212, 190, 12.5)
    return im.resize((size, size), Image.LANCZOS)


def fg_icon(size):
    S = size * SS
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    ring(d, S, 318, 14, RED)
    ring(d, S, 292, 6, RED)
    basket(d, S, 282, 288, 9.6)
    return im.resize((size, size), Image.LANCZOS)


def masked(im, shape):
    s = im.size[0]
    mask = Image.new("L", (s * 4, s * 4), 0)
    md = ImageDraw.Draw(mask)
    if shape == "round":
        md.ellipse([0, 0, s * 4 - 1, s * 4 - 1], fill=255)
    else:
        md.rounded_rectangle([0, 0, s * 4 - 1, s * 4 - 1], radius=int(s * 4 * 0.18), fill=255)
    mask = mask.resize((s, s), Image.LANCZOS)
    out = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    return out


DENS = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
os.makedirs(os.path.join(ROOT, "icons", "master"), exist_ok=True)
full_icon(1024).save(os.path.join(ROOT, "icons", "master", "icon-1024.png"))
for name, f in DENS.items():
    dd = os.path.join(RES, f"mipmap-{name}")
    os.makedirs(dd, exist_ok=True)
    legacy = full_icon(int(48 * f))
    masked(legacy, "square").save(os.path.join(dd, "ic_launcher.png"))
    masked(legacy, "round").save(os.path.join(dd, "ic_launcher_round.png"))
    fg_icon(int(108 * f)).save(os.path.join(dd, "ic_launcher_foreground.png"))

os.makedirs(os.path.join(RES, "values"), exist_ok=True)
with open(os.path.join(RES, "values", "ic_launcher_background.xml"), "w") as fh:
    fh.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#EFE1BC</color>\n</resources>\n')

os.makedirs(os.path.join(RES, "mipmap-anydpi-v26"), exist_ok=True)
adaptive = ('<?xml version="1.0" encoding="utf-8"?>\n'
            '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
            '    <background android:drawable="@color/ic_launcher_background"/>\n'
            '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n'
            '</adaptive-icon>\n')
for fn in ("ic_launcher.xml", "ic_launcher_round.xml"):
    with open(os.path.join(RES, "mipmap-anydpi-v26", fn), "w") as fh:
        fh.write(adaptive)
print("Icone generate in", os.path.abspath(RES))
