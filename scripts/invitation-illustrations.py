"""Regenerates the painted SVG illustrations in public/invitation/assets/illustrations/.

Usage (from the repository root):
    python3 scripts/invitation-illustrations.py public/invitation/assets/illustrations

Output is seeded, so re-running without edits reproduces the same files.
"""
import math, random, sys, os

OUT = sys.argv[1]

# ---------------------------------------------------------------- palette
SKY = ['#3d5bb3', '#4a6ac0', '#5a7bcf', '#6f8edb', '#89a3e2']
CLOUD = ['#f6efe1', '#efe4cf', '#fffaf1', '#e9dfe9', '#f3d9cc']
CLOUD_SH = ['#9fb0dc', '#b6b9de', '#c9c2df']
SEA = ['#1f3c99', '#27479f', '#2f55b4', '#3a63c4', '#18307e']
LEAF = ['#2e4a34', '#3d5c3e', '#4f6e47', '#6b8a5a', '#27402d']
HOUSE = ['#f4e6d3', '#f0d6c0', '#ead2c9', '#f7efe4', '#e9c8b6', '#f1dfc8', '#ddb8a6']
ROOF = ['#c98b6b', '#b8775c', '#d49f80']
PINK = ['#e8a2b6', '#dc8aa2', '#f2c3d1', '#cf7391', '#f6d6df']


def r(a, b):
    return random.uniform(a, b)


def pick(xs):
    return random.choice(xs)


def svg(w, h, body, defs=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<defs>{defs}</defs>{body}</svg>')


def paint_filter(fid, disp=7, freq=0.035, bump=0.07, seed=2, k1=0.8, k3=0.28, elev=52):
    """Displaced edges + an impasto light map multiplied over the paint."""
    return (f'<filter id="{fid}" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">'
            f'<feTurbulence type="fractalNoise" baseFrequency="{freq}" numOctaves="3" seed="{seed}" result="n"/>'
            f'<feDisplacementMap in="SourceGraphic" in2="n" scale="{disp}" xChannelSelector="R" yChannelSelector="G" result="d"/>'
            f'<feTurbulence type="fractalNoise" baseFrequency="{bump}" numOctaves="4" seed="{seed + 7}" result="b"/>'
            f'<feDiffuseLighting in="b" surfaceScale="2.4" lighting-color="#ffffff" result="l">'
            f'<feDistantLight azimuth="225" elevation="{elev}"/></feDiffuseLighting>'
            f'<feComposite in="l" in2="d" operator="arithmetic" k1="{k1}" k2="0" k3="{k3}" k4="0" result="lit"/>'
            f'<feComposite in="lit" in2="d" operator="in"/></filter>')


def stroke(x, y, rx, ry, c, rot, op=1):
    return (f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{c}" '
            f'transform="rotate({rot:.1f} {x:.1f} {y:.1f})" opacity="{op:.2f}"/>')


FLOWER_SYMBOLS = (
    # five-petal blossom, white with a warm centre
    '<g id=\"fw\">'
    + ''.join(f'<ellipse cx="0" cy="-9" rx="6.6" ry="9.5" fill="#fbf7ef" stroke="#d9cfc0" stroke-width=".6" '
              f'transform="rotate({k * 72})"/>' for k in range(5))
    + ''.join(f'<path d="M0 0 L0 -12" stroke="#e8dccb" stroke-width=".7" transform="rotate({k * 72 + 4})"/>' for k in range(5))
    + '<circle r="3.4" fill="#e7c36b"/><circle r="1.6" fill="#b98a3b"/></g>'
    # pink apple blossom
    '<g id=\"fp\">'
    + ''.join(f'<ellipse cx="0" cy="-8.5" rx="6.8" ry="9" fill="{c}" stroke="#c8708a" stroke-width=".5" '
              f'transform="rotate({k * 72})"/>' for k, c in enumerate(['#f6d6df', '#f2c3d1', '#f6d6df', '#ecb3c4', '#f2c3d1']))
    + ''.join(f'<path d="M0 -2 L0 -10" stroke="#d27a95" stroke-width=".8" transform="rotate({k * 72})"/>' for k in range(5))
    + '<circle r="2.8" fill="#e9c46a"/></g>'
    # pink bud
    '<g id=\"fb\">'
    '<ellipse cx="0" cy="-3" rx="4" ry="6" fill="#d97e99"/><ellipse cx="-1" cy="-4" rx="2" ry="3.5" fill="#efb0c2"/>'
    '<path d="M-3 2 Q0 6 3 2" fill="#4f6e47"/></g>'
    # leaf
    '<g id=\"lf\">'
    '<path d="M0 0 C 8 -8, 8 -24, 0 -34 C -8 -24, -8 -8, 0 0Z"/>'
    '<path d="M0 -1 L0 -31" stroke="#9bb08a" stroke-width=".8" opacity=".55" fill="none"/></g>'
)


def use(sym, x, y, s=1, rot=0, fill=None, op=1):
    f = f' fill="{fill}"' if fill else ''
    return (f'<use href="#{sym}" xlink:href="#{sym}" transform="translate({x:.1f} {y:.1f}) rotate({rot:.1f}) scale({s:.2f})"{f}'
            f' opacity="{op:.2f}"/>')


def leaf(x, y, s, rot, c=None):
    return use('lf', x, y, s, rot, c or pick(LEAF))


def cypress(x, y, h, c='#2c4630'):
    w = h * 0.16
    hi = '#4a6a45'
    return (f'<path d="M{x} {y - h} C {x + w * 0.9} {y - h * 0.6}, {x + w} {y - h * 0.2}, {x + w * 0.5} {y} '
            f'L {x - w * 0.5} {y} C {x - w} {y - h * 0.2}, {x - w * 0.9} {y - h * 0.6}, {x} {y - h}Z" fill="{c}"/>'
            f'<path d="M{x - w * 0.15} {y - h * 0.9} C {x - w * 0.6} {y - h * 0.5}, {x - w * 0.6} {y - h * 0.2}, {x - w * 0.3} {y - 4}" '
            f'stroke="{hi}" stroke-width="{w * 0.3:.1f}" fill="none" opacity=".6"/>')


def house(x, y, w, h, c=None, roof=True, windows=True):
    c = c or pick(HOUSE)
    out = f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{c}"/>'
    out += f'<rect x="{x + w * 0.62:.1f}" y="{y:.1f}" width="{w * 0.38:.1f}" height="{h:.1f}" fill="#000" opacity=".07"/>'
    if roof:
        out += f'<rect x="{x - 1:.1f}" y="{y - 3:.1f}" width="{w + 2:.1f}" height="4" fill="{pick(ROOF)}"/>'
    if windows:
        for i in range(int(w // 9)):
            for j in range(int(h // 11)):
                if random.random() < 0.55:
                    out += (f'<rect x="{x + 3 + i * 9:.1f}" y="{y + 4 + j * 11:.1f}" width="3" height="5" '
                            f'fill="{pick(["#6b5a52", "#7f6a5e", "#4a6aa8"])}" opacity=".75"/>')
    return out


def sky_strokes(w, h, n, y0=0, y1=None, cloudiness=0.5):
    y1 = h if y1 is None else y1
    out = [f'<rect x="0" y="{y0}" width="{w}" height="{y1 - y0}" fill="#4f6fc6"/>']
    for _ in range(n):
        x, y = r(-20, w + 20), r(y0 - 10, y1 + 10)
        out.append(stroke(x, y, r(18, 60), r(5, 13), pick(SKY), r(-14, 10)))
    # cloud banks: a few big clumps with a blue-violet shadow under each
    for _ in range(max(2, int(n * cloudiness / 40))):
        cx, cy = r(-60, w + 60), r(y0, y1)
        size = r(150, 300)
        for _ in range(36):
            x, y = cx + r(-size, size), cy + r(-size * 0.15, size * 0.32)
            out.append(stroke(x, y + 14, r(34, 90), r(10, 22), pick(CLOUD_SH), r(-10, 6), .9))
        for _ in range(64):
            dx = r(-size, size)
            x, y = cx + dx, cy + r(-size * 0.32, size * 0.12) * (1 - abs(dx) / size * 0.6)
            out.append(stroke(x, y, r(30, 84), r(10, 22), pick(CLOUD), r(-10, 6)))
    return ''.join(out)


def blossom_cluster(cx, cy, n, spread, kind='fw', smin=0.8, smax=1.4, leaves=True):
    out = []
    if leaves:
        for _ in range(int(n * 1.3)):
            out.append(leaf(cx + r(-spread, spread), cy + r(-spread, spread), r(0.8, 1.5), r(0, 360)))
    for _ in range(n):
        out.append(use(kind, cx + r(-spread, spread) * 0.85, cy + r(-spread, spread) * 0.85, r(smin, smax), r(0, 72)))
    return ''.join(out)


def write(name, content):
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(content)
    print(name, len(content) // 1024, 'KB')


# ---------------------------------------------------------------- 1. sky frame (hero background)
def sky_frame():
    random.seed(11)
    W, H = 900, 1600
    body = f'<g filter="url(#p)">{sky_strokes(W, H, 700, cloudiness=0.9)}</g>'
    # far mountains low on the right, sea glimpses
    random.seed(12)
    m = ''.join(stroke(r(560, 920), r(1270, 1330), r(40, 90), r(10, 22), pick(['#7a76b8', '#8e88c4', '#a29ccf']), r(-8, 8))
                for _ in range(60))
    body += f'<g filter="url(#p)">{m}</g>'
    return svg(W, H, body, paint_filter('p', disp=9, freq=0.03, bump=0.09, seed=4))


# ---------------------------------------------------------------- 2. paper panel (lilac card, ragged painted edge)
def paper_panel():
    W, H = 640, 1140
    d = ('<filter id="e" x="-5%" y="-5%" width="110%" height="110%">'
         '<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="9" result="n"/>'
         '<feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" result="d"/>'
         '<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="g"/>'
         '<feColorMatrix in="g" type="matrix" values="0 0 0 0 .55  0 0 0 0 .5  0 0 0 0 .6  0 0 0 .07 0" result="gr"/>'
         '<feComposite in="gr" in2="d" operator="in" result="gi"/>'
         '<feMerge><feMergeNode in="d"/><feMergeNode in="gi"/></feMerge></filter>'
         '<radialGradient id="pg" cx="45%" cy="40%" r="75%"><stop offset="0" stop-color="#f1ecf3"/>'
         '<stop offset=".7" stop-color="#e9e1ee"/><stop offset="1" stop-color="#ddd2e6"/></radialGradient>')
    body = f'<rect x="28" y="28" width="{W - 56}" height="{H - 56}" rx="18" fill="url(#pg)" filter="url(#e)"/>'
    return svg(W, H, body, d)


# ---------------------------------------------------------------- 3. blossom branch (top-left corner)
def branch(seed=21):
    random.seed(seed)
    W, H = 520, 520
    out = ['<path d="M-10 30 C 90 70, 180 120, 300 240 S 420 380, 470 470" stroke="#5b5148" stroke-width="7" '
           'fill="none" stroke-linecap="round"/>',
           '<path d="M120 80 C 150 40, 200 30, 250 40" stroke="#5b5148" stroke-width="4" fill="none" stroke-linecap="round"/>',
           '<path d="M230 190 C 290 170, 340 150, 400 160" stroke="#5b5148" stroke-width="4" fill="none" stroke-linecap="round"/>']
    pts = []
    for t in [i / 14 for i in range(15)]:
        # rough point along the main stem
        x = -10 + 480 * t + 40 * math.sin(t * 3)
        y = 30 + 440 * t ** 1.15
        pts.append((x, y))
    for (x, y) in pts:
        for side in (-1, 1):
            out.append(leaf(x + r(-8, 8), y + r(-8, 8), r(2.4, 3.4), side * r(40, 80) + 135 + r(-15, 15)))
    for (x, y) in [(250, 40), (400, 160)] + pts[1:12:2]:
        out.append(blossom_cluster(x, y, random.randint(2, 3), 34, 'fw', 1.9, 2.6, leaves=False))
    body = f'<g filter="url(#p)">{"".join(out)}</g>'
    return svg(W, H, body, FLOWER_SYMBOLS + paint_filter('p', disp=3, freq=0.06, bump=0.12, seed=5, k1=.55, k3=.5))


# ---------------------------------------------------------------- 4. castle on the coast (hero bottom-left)
def castle_coast():
    random.seed(31)
    W, H = 620, 520
    o = []
    # sea
    o += [f'<rect x="0" y="330" width="{W}" height="190" fill="#2a4cab"/>']
    o += [stroke(r(0, W), r(330, 520), r(20, 60), r(3, 6), pick(SEA + ['#5b7fd0', '#a9bdf0']), r(-4, 4)) for _ in range(160)]
    # hill
    o.append('<path d="M0 230 C 120 200, 250 230, 380 300 S 560 420, 620 520 L0 520Z" fill="#6b7f4f"/>')
    o += [stroke(r(0, 420), r(240, 520), r(14, 40), r(6, 14), pick(LEAF + ['#8a9a5d', '#a7a46a']), r(-20, 20)) for _ in range(140)]
    # villa and tower
    o.append(house(90, 200, 150, 110, '#efe0c8'))
    o.append('<path d="M84 202 L165 160 L246 202Z" fill="#c4876a"/>')
    o.append(house(250, 150, 64, 170, '#e8d4b8', roof=False))
    o.append(''.join(f'<rect x="{250 + i * 13}" y="138" width="8" height="14" fill="#e8d4b8"/>' for i in range(5)))
    o.append(house(20, 250, 80, 70, '#f3e6d4'))
    o.append(house(320, 250, 70, 70, '#ead2c0'))
    o.append(''.join(f'<path d="M{100 + i * 28} 312 a12 18 0 0 1 24 0 v12 h-24z" fill="#a07f6a" opacity=".6"/>' for i in range(5)))
    for x in [30, 60, 330, 360, 420, 455, 500]:
        o.append(cypress(x + r(-6, 6), r(300, 360), r(90, 160)))
    o += [stroke(r(0, 470), r(330, 470), r(14, 30), r(10, 18), pick(LEAF), r(-10, 10)) for _ in range(60)]
    body = f'<g filter="url(#p)">{"".join(o)}</g>'
    mask = ('<radialGradient id="mg" cx="30%" cy="75%" r="75%"><stop offset=".65" stop-color="#fff"/>'
            '<stop offset="1" stop-color="#000"/></radialGradient><mask id="m"><rect width="620" height="520" fill="url(#mg)"/></mask>')
    return svg(W, H, f'<g mask="url(#m)">{body}</g>', mask + paint_filter('p', disp=8, freq=0.04, bump=0.1, seed=6))


# ---------------------------------------------------------------- 5. coastal village (envelope painting)
def coast_village():
    random.seed(41)
    W, H = 900, 1600
    o = [sky_strokes(W, 560, 420, cloudiness=0.8)]
    # mountains
    o.append('<path d="M300 520 C 420 420, 520 440, 640 470 S 860 430, 900 460 L900 640 L300 640Z" fill="#6c6aa8"/>')
    o += [stroke(r(320, 900), r(460, 620), r(20, 60), r(6, 14), pick(['#5f5d9c', '#7d78b6', '#9a90c6', '#b39fc6']), r(-10, 10)) for _ in range(120)]
    # sea
    o.append(f'<rect x="0" y="600" width="{W}" height="1000" fill="#2848a6"/>')
    o += [stroke(r(0, W), r(600, 1600), r(20, 70), r(3, 8), pick(SEA + ['#4f74cc']), r(-5, 5)) for _ in range(700)]
    o += [stroke(r(300, W), r(620, 1600), r(8, 26), r(1.5, 3), '#dfe8ff', r(-5, 5), .8) for _ in range(160)]
    # cliff with houses descending to the bottom-left
    o.append('<path d="M0 420 C 150 430, 320 520, 400 700 S 480 1050, 440 1250 S 360 1500, 320 1600 L0 1600Z" fill="#7a6a4e"/>')
    o += [stroke(r(0, 330), r(440, 1600), r(16, 44), r(8, 16), pick(LEAF + ['#8a7a58', '#a28a64']), r(-30, 30)) for _ in range(260)]
    rows = 0
    y = 470
    while y < 1450:
        right = 360 + 60 * math.sin((y - 420) / 300) - (y - 470) * 0.02
        x = r(-10, 20)
        while x < right - 30:
            w, h = r(52, 104), r(46, 84)
            o.append(house(x, y + r(-8, 8), w, h))
            x += w + r(-6, 6)
        y += r(64, 84)
        rows += 1
    for _ in range(26):
        o.append(cypress(r(0, 320), r(500, 1500), r(50, 110)))
    o += [stroke(r(0, 320), r(480, 1500), r(10, 22), r(8, 14), pick(LEAF), r(-30, 30)) for _ in range(120)]
    o += [stroke(r(0, 320), r(480, 1500), r(5, 9), r(5, 8), pick(PINK + ['#f4e6d3']), 0) for _ in range(160)]
    # rocks and boats
    o += [stroke(r(400, 520), r(1150, 1300), r(10, 26), r(8, 16), pick(['#8a6f5a', '#6f5a4c', '#a88a70']), r(-30, 30)) for _ in range(10)]
    for _ in range(9):
        bx, by = r(420, 860), r(900, 1550)
        s = r(0.8, 1.6)
        o.append(f'<g transform="translate({bx:.0f} {by:.0f}) scale({s:.2f})"><path d="M0 0 L0 -26 L16 0Z" fill="#fbf8f2"/>'
                 f'<path d="M-10 2 L20 2 L15 7 L-6 7Z" fill="#f4efe6"/></g>')
    # seagulls
    for _ in range(5):
        gx, gy = r(560, 860), r(120, 420)
        o.append(f'<path d="M{gx:.0f} {gy:.0f} q7 -6 14 0 q7 -6 14 0" stroke="#3b3b4a" stroke-width="2.4" fill="none"/>')
    body = f'<g filter="url(#p)">{"".join(o)}</g>'
    # big blossoms bottom-left, above the paint filter for crispness
    random.seed(42)
    fl = ''.join(blossom_cluster(r(0, 220), r(1180, 1600), 5, 70, 'fw', 2.2, 3.2) for _ in range(4))
    body += f'<g filter="url(#q)">{fl}</g>'
    return svg(W, H, body, FLOWER_SYMBOLS + paint_filter('p', disp=10, freq=0.03, bump=0.08, seed=8)
               + paint_filter('q', disp=3, freq=0.06, bump=0.12, seed=9, k1=.5, k3=.55))


# ---------------------------------------------------------------- 6. majolica tile frame (countdown)
def tile_frame():
    random.seed(51)
    W, H = 600, 800
    o = []
    t = 26  # tile size
    bx, by, bw, bh = 40, 40, W - 80, H - 80
    band = 2
    for i in range(int(bw // t)):
        for j in range(int(bh // t)):
            if band <= i < bw // t - band and band <= j < bh // t - band:
                continue
            c = '#2f55b8' if (i + j) % 2 else '#f4f1ea'
            o.append(f'<rect x="{bx + i * t}" y="{by + j * t}" width="{t + .5}" height="{t + .5}" fill="{c}"/>')
    o.append(f'<rect x="{bx}" y="{by}" width="{int(bw // t) * t}" height="{int(bh // t) * t}" fill="none" stroke="#1f3c8f" stroke-width="3"/>')
    o.append(f'<rect x="{bx + band * t}" y="{by + band * t}" width="{(int(bw // t) - 2 * band) * t}" '
             f'height="{(int(bh // t) - 2 * band) * t}" fill="none" stroke="#1f3c8f" stroke-width="2"/>')
    tiles = f'<g filter="url(#t)">{"".join(o)}</g>'
    fl = []
    spots = [(70, 70), (W / 2, 52), (W - 70, 70), (52, H / 2), (W - 52, H / 2), (70, H - 70), (W / 2, H - 52), (W - 70, H - 70),
             (180, 56), (420, 56), (180, H - 56), (420, H - 56), (56, 230), (56, 570), (W - 56, 230), (W - 56, 570)]
    for (x, y) in spots:
        for _ in range(7):
            fl.append(leaf(x + r(-40, 40), y + r(-40, 40), r(1.0, 1.6), r(0, 360)))
        for _ in range(random.randint(2, 4)):
            fl.append(use('fp', x + r(-30, 30), y + r(-30, 30), r(1.2, 1.8), r(0, 72)))
        for _ in range(3):
            fl.append(use('fb', x + r(-38, 38), y + r(-38, 38), r(1.0, 1.4), r(0, 360)))
    flowers = f'<g filter="url(#q)">{"".join(fl)}</g>'
    return svg(W, H, tiles + flowers, FLOWER_SYMBOLS + paint_filter('t', disp=3, freq=0.05, bump=0.2, seed=3, k1=.45, k3=.6)
               + paint_filter('q', disp=2, freq=0.06, bump=0.12, seed=9, k1=.5, k3=.55))


# ---------------------------------------------------------------- 7. clouds (our story)
def clouds():
    random.seed(61)
    W, H = 900, 420
    o = []
    for cx, cy, s in [(120, 120, 120), (420, 80, 150), (760, 140, 130), (260, 260, 110), (640, 290, 120)]:
        for _ in range(40):
            o.append(stroke(cx + r(-s, s), cy + r(-s * .25, s * .3), r(20, 55), r(10, 22), pick(['#c7bfd6', '#b7aecb', '#a99fbe']), r(-10, 10), .85))
        for _ in range(46):
            o.append(stroke(cx + r(-s, s), cy + r(-s * .35, s * .15), r(18, 50), r(10, 22), pick(['#f6f1f6', '#ece6f0', '#fffaf8', '#e2d9ea']), r(-10, 10)))
    fade = ('<linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#000"/>'
            '</linearGradient><mask id="m"><rect width="900" height="420" fill="url(#fg)"/></mask>')
    return svg(W, H, f'<g mask="url(#m)"><g filter="url(#p)">{"".join(o)}</g></g>',
               fade + paint_filter('p', disp=12, freq=0.03, bump=0.06, seed=12, k1=.5, k3=.55))


# ---------------------------------------------------------------- 8. fountain garden -> dark green
def fountain_garden():
    random.seed(71)
    W, H = 900, 760
    o = []
    # cypress wall
    for x in range(-20, 940, 46):
        o.append(cypress(x + r(-10, 10), r(360, 420), r(220, 330), pick(['#2c4630', '#334f36', '#253d2a'])))
    o += [stroke(r(0, W), r(330, 470), r(16, 40), r(10, 18), pick(LEAF), r(-30, 30)) for _ in range(160)]
    # lawn and path
    o.append(f'<rect x="0" y="430" width="{W}" height="330" fill="#56724a"/>')
    o += [stroke(r(0, W), r(430, 760), r(20, 60), r(6, 12), pick(['#5f7c4f', '#4f6a43', '#6d8a58', '#3f5a3a']), r(-6, 6)) for _ in range(260)]
    o.append('<ellipse cx="450" cy="600" rx="330" ry="96" fill="#e9dccb"/>')
    # basin
    o.append('<ellipse cx="450" cy="590" rx="250" ry="62" fill="#d7c7b2"/><ellipse cx="450" cy="580" rx="232" ry="50" fill="#6f95c8"/>')
    o += [stroke(r(240, 660), r(560, 600), r(10, 30), r(2, 4), pick(['#a9c3e8', '#dbe7f6', '#5a82bd']), 0) for _ in range(80)]
    o.append('<rect x="434" y="430" width="32" height="150" fill="#d9cbb7"/><ellipse cx="450" cy="470" rx="70" ry="16" fill="#d2c2ad"/>'
             '<ellipse cx="450" cy="466" rx="62" ry="11" fill="#7aa0d0"/><ellipse cx="450" cy="420" rx="34" ry="9" fill="#d2c2ad"/>')
    # water arcs
    for k in range(-5, 6):
        if k == 0:
            continue
        ex = 450 + k * 42
        o.append(f'<path d="M450 410 Q{450 + k * 24} {300 - abs(k) * 4} {ex} {560 + r(-8, 8):.0f}" stroke="#eaf2fb" stroke-width="3.2" fill="none" opacity=".85"/>')
    o.append('<path d="M450 410 L450 300" stroke="#eaf2fb" stroke-width="4" opacity=".9"/>')
    # rose bushes
    for _ in range(18):
        x, y = pick([r(0, 220), r(680, 900)]), r(470, 740)
        o += [stroke(x + r(-50, 50), y + r(-30, 30), r(10, 22), r(8, 14), pick(LEAF), r(-30, 30)) for _ in range(8)]
        o += [stroke(x + r(-46, 46), y + r(-28, 28), r(5, 9), r(5, 8), pick(PINK + ['#f6efe8']), 0) for _ in range(10)]
    body = f'<g filter="url(#p)">{"".join(o)}</g>'
    defs = ('<linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f3b31" stop-opacity="0"/>'
            '<stop offset="1" stop-color="#2f3b31"/></linearGradient>'
            '<filter id="rag"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="4"/>'
            '<feDisplacementMap in="SourceGraphic" scale="60" xChannelSelector="R" yChannelSelector="G"/></filter>'
            '<mask id="m"><rect x="-30" y="300" width="960" height="520" fill="#fff" filter="url(#rag)"/></mask>')
    body = f'<g mask="url(#m)">{body}<rect y="640" width="{W}" height="120" fill="url(#dg)"/></g>'
    return svg(W, H, body, defs + paint_filter('p', disp=8, freq=0.04, bump=0.1, seed=13))


# ---------------------------------------------------------------- 9. villa on a hillside (dark green -> lilac)
def villa_hill():
    random.seed(81)
    W, H = 900, 560
    o = []
    o.append('<path d="M0 250 C 200 160, 420 170, 600 200 S 820 230, 900 210 L900 560 L0 560Z" fill="#6b7a4c"/>')
    o += [stroke(r(0, W), r(200, 520), r(16, 40), r(8, 16), pick(LEAF + ['#8a9a5d', '#a7a46a', '#b59a74']), r(-20, 20)) for _ in range(320)]
    o.append(house(300, 150, 220, 100, '#efe2cc'))
    o.append('<path d="M294 152 L410 112 L526 152Z" fill="#c4876a"/>')
    o.append(house(350, 88, 60, 66, '#e9d6bb', roof=False))
    o.append(''.join(f'<rect x="{350 + i * 12}" y="78" width="7" height="12" fill="#e9d6bb"/>' for i in range(5)))
    o.append(house(530, 190, 120, 70, '#f1e4d0'))
    o.append(house(180, 200, 110, 64, '#ecd9c4'))
    o.append(house(660, 230, 90, 60, '#e8d0bb'))
    o.append('<rect x="250" y="300" width="380" height="40" fill="#8fb0d6"/>')  # pool / terrace
    for _ in range(26):
        o.append(cypress(r(0, W), r(250, 470), r(60, 140)))
    o += [stroke(r(0, W), r(300, 540), r(12, 26), r(10, 16), pick(LEAF), r(-30, 30)) for _ in range(160)]
    o += [stroke(r(0, W), r(300, 540), r(5, 8), r(5, 7), pick(PINK + ['#f4e6d3']), 0) for _ in range(120)]
    body = f'<g filter="url(#p)">{"".join(o)}</g>'
    defs = ('<filter id="rag"><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="6"/>'
            '<feDisplacementMap in="SourceGraphic" scale="70" xChannelSelector="R" yChannelSelector="G"/></filter>'
            '<mask id="m"><rect x="-40" y="40" width="980" height="440" fill="#fff" filter="url(#rag)"/></mask>')
    return svg(W, H, f'<g mask="url(#m)">{body}</g>', defs + paint_filter('p', disp=7, freq=0.04, bump=0.1, seed=14))


# ---------------------------------------------------------------- 10. dress-code party under a garland
def dress_party():
    random.seed(91)
    W, H = 900, 700
    o = []
    # garland swags with ribbon
    for k in range(3):
        x0 = k * 300
        o.append(f'<path d="M{x0} 60 Q{x0 + 150} 200 {x0 + 300} 60" stroke="#8aa36a" stroke-width="26" fill="none"/>')
        o += [leaf(x0 + 150 + 150 * math.cos(t), 60 + 120 * math.sin(t) * 0.95, r(1.6, 2.4), r(0, 360))
              for t in [i * math.pi / 14 for i in range(15)]]
    o.append('<path d="M0 40 C 220 140, 680 140, 900 40" stroke="#9fbf86" stroke-width="10" fill="none" opacity=".8"/>')
    gowns = ['#f2c3d1', '#d9c6ea', '#c9dcf2', '#f6e3c9', '#e8a2b6', '#cfe0c4', '#f3d0dc', '#bfd2ee', '#e6d4f0']
    xs = list(range(60, 880, 68))
    for i, x in enumerate(xs):
        man = i in (5, 6, 9)
        y = 640
        skin = pick(['#f1d2bf', '#e4bea4', '#d8a888', '#f3dccb'])
        hair = pick(['#4a3528', '#7a5a3c', '#2e2622', '#b08a5a'])
        if man:
            o.append(f'<path d="M{x - 26} {y} L{x - 24} {y - 200} Q{x} {y - 218} {x + 24} {y - 200} L{x + 26} {y}Z" fill="#26262c"/>')
            o.append(f'<path d="M{x - 6} {y - 204} L{x} {y - 150} L{x + 6} {y - 204}Z" fill="#f7f4ef"/>')
        else:
            g = pick(gowns)
            o.append(f'<path d="M{x - 12} {y - 200} Q{x} {y - 212} {x + 12} {y - 200} L{x + 16} {y - 140} '
                     f'Q{x + 52} {y - 40} {x + 50} {y} L{x - 50} {y} Q{x - 52} {y - 40} {x - 16} {y - 140}Z" fill="{g}"/>')
            o.append(f'<path d="M{x + 6} {y - 140} Q{x + 24} {y - 60} {x + 20} {y}" stroke="#ffffff" stroke-width="5" opacity=".35" fill="none"/>')
            o.append(f'<circle cx="{x + r(-8, 8):.0f}" cy="{y - 120}" r="9" fill="{pick(PINK)}"/>')
        o.append(f'<rect x="{x - 4}" y="{y - 222}" width="8" height="14" fill="{skin}"/>')
        o.append(f'<ellipse cx="{x}" cy="{y - 236}" rx="15" ry="18" fill="{skin}"/>')
        o.append(f'<path d="M{x - 14} {y - 236} Q{x} {y - 262} {x + 14} {y - 236} Q{x + 8} {y - 248} {x} {y - 248} Q{x - 8} {y - 248} {x - 14} {y - 236}Z" fill="{hair}"/>')
    o += [stroke(r(0, W), r(640, 700), r(30, 60), r(4, 8), pick(['#cbbfd7', '#ddd3e6', '#bdb0cc']), 0, .6) for _ in range(30)]
    body = f'<g filter="url(#p)">{"".join(o)}</g>'
    return svg(W, H, body, FLOWER_SYMBOLS + paint_filter('p', disp=4, freq=0.05, bump=0.12, seed=15, k1=.55, k3=.5))


# ---------------------------------------------------------------- 11. pink petal spill (welcome soiree edge)
def petal_spill():
    random.seed(101)
    W, H = 900, 380
    o = []
    for _ in range(170):
        x = r(-20, W + 20)
        y = r(0, 220) + 80 * math.sin(x / 140) ** 2
        rx, ry = r(14, 34), r(7, 16)
        c = pick(['#e8a2b6', '#dc8aa2', '#f2c3d1', '#cf7391', '#f6d6df', '#eab5c4'])
        o.append(stroke(x, y, rx, ry, c, r(0, 360)))
        o.append(stroke(x + r(-4, 4), y + r(-3, 3), rx * .5, ry * .35, '#fbe6ec', r(0, 360), .5))
    for _ in range(40):
        o.append(stroke(r(0, W), r(200, 370), r(6, 13), r(3, 7), pick(['#e8a2b6', '#f2c3d1', '#cf7391']), r(0, 360)))
    body = f'<g filter="url(#p)">{"".join(o)}</g>'
    return svg(W, H, body, paint_filter('p', disp=5, freq=0.05, bump=0.12, seed=16, k1=.5, k3=.55))


# ---------------------------------------------------------------- 12. floral wreath (wedding gift)
def wreath():
    random.seed(111)
    W = H = 640
    cx = cy = 320
    R = 236
    o = []
    for i in range(80):
        a = i / 80 * 2 * math.pi
        x, y = cx + R * math.cos(a) + r(-14, 14), cy + R * math.sin(a) + r(-14, 14)
        o.append(leaf(x, y, r(1.5, 2.3), math.degrees(a) + r(-60, 60) + 90))
    for i in range(26):
        a = i / 26 * 2 * math.pi + r(-.08, .08)
        x, y = cx + R * math.cos(a) + r(-12, 12), cy + R * math.sin(a) + r(-12, 12)
        o.append(use(pick(['fp', 'fp', 'fw']), x, y, r(1.6, 2.4), r(0, 72)))
    for i in range(30):
        a = r(0, 2 * math.pi)
        o.append(use('fb', cx + (R + r(-24, 24)) * math.cos(a), cy + (R + r(-24, 24)) * math.sin(a), r(1.3, 1.8), r(0, 360)))
    body = f'<g filter="url(#q)">{"".join(o)}</g>'
    return svg(W, H, body, FLOWER_SYMBOLS + paint_filter('q', disp=3, freq=0.06, bump=0.12, seed=9, k1=.5, k3=.55))


# ---------------------------------------------------------------- 13. window with flowers (rsvp)
def window_flowers():
    random.seed(121)
    W, H = 520, 520
    o = ['<rect x="120" y="70" width="280" height="300" fill="#e8dcc8"/>',
         '<rect x="150" y="100" width="220" height="240" fill="#f1e8d8"/>',
         '<rect x="170" y="120" width="180" height="210" fill="#4f78c4"/>']
    o += [stroke(r(175, 345), r(125, 325), r(10, 30), r(4, 8), pick(['#6d92d6', '#9db8ea', '#3c62b0', '#c7d6f2']), r(-20, 20)) for _ in range(40)]
    o.append('<rect x="256" y="120" width="8" height="210" fill="#f1e8d8"/><rect x="170" y="220" width="180" height="8" fill="#f1e8d8"/>')
    o.append('<rect x="130" y="360" width="260" height="20" fill="#d9cab3"/>')
    for _ in range(36):
        o.append(leaf(r(100, 260), r(300, 470), r(1.3, 2.0), r(120, 260)))
    for _ in range(14):
        o.append(use(pick(['fp', 'fw']), r(110, 250), r(300, 460), r(1.3, 2.0), r(0, 72)))
    body = f'<g filter="url(#p)">{"".join(o)}</g>'
    return svg(W, H, body, FLOWER_SYMBOLS + paint_filter('p', disp=4, freq=0.05, bump=0.12, seed=17, k1=.5, k3=.55))


# ---------------------------------------------------------------- 14. paper texture (envelope inside, page grain)
def paper_grain():
    return svg(400, 400, '<rect width="400" height="400" filter="url(#g)"/>',
               '<filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="2"/>'
               '<feColorMatrix type="matrix" values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .5  0 0 0 .09 0"/></filter>')


def blossom_sprig():
    random.seed(131)
    W, H = 260, 260
    o = ['<path d="M20 240 C 80 180, 140 120, 230 30" stroke="#5b5148" stroke-width="3.5" fill="none" stroke-linecap="round"/>']
    for t in [i / 9 for i in range(10)]:
        x, y = 20 + 210 * t, 240 - 210 * t
        o.append(leaf(x, y, r(1.0, 1.5), r(-60, 60) + (40 if t > .5 else -40)))
    for (x, y) in [(230, 30), (160, 100), (95, 165)]:
        o.append(use('fp', x + r(-10, 10), y + r(-10, 10), r(1.5, 2.0), r(0, 72)))
        o.append(use('fb', x + r(-24, 24), y + r(-24, 24), 1.3, r(0, 360)))
    return svg(W, H, f'<g filter="url(#q)">{"".join(o)}</g>',
               FLOWER_SYMBOLS + paint_filter('q', disp=2, freq=0.06, bump=0.12, seed=9, k1=.5, k3=.55))


write('sky-frame.svg', sky_frame())
write('paper-panel.svg', paper_panel())
write('blossom-branch.svg', branch())
write('castle-coast.svg', castle_coast())
write('coast-village.svg', coast_village())
write('tile-frame.svg', tile_frame())
write('clouds.svg', clouds())
write('fountain-garden.svg', fountain_garden())
write('villa-hill.svg', villa_hill())
write('dress-party.svg', dress_party())
write('petal-spill.svg', petal_spill())
write('wreath.svg', wreath())
write('window-flowers.svg', window_flowers())
write('paper-grain.svg', paper_grain())
write('blossom-sprig.svg', blossom_sprig())


# ---------------------------------------------------------------- 15. silk ribbon band and bow (envelope)
SILK = ('<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#d9d1c8"/><stop offset=".18" stop-color="#f7f3ee"/><stop offset=".42" stop-color="#ece5dd"/>'
        '<stop offset=".62" stop-color="#fbf9f6"/><stop offset=".85" stop-color="#e3dbd2"/><stop offset="1" stop-color="#cfc6bc"/></linearGradient>'
        '<filter id="fray" x="-2%" y="-20%" width="104%" height="140%">'
        '<feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves="2" seed="5" result="n"/>'
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>'
        '<feTurbulence type="fractalNoise" baseFrequency="0.004 0.6" numOctaves="2" seed="8" result="w"/>'
        '<feColorMatrix in="w" type="matrix" values="0 0 0 0 .5  0 0 0 0 .47  0 0 0 0 .44  0 0 0 .16 0" result="ws"/>'
        '<feComposite in="ws" in2="d" operator="in" result="wi"/>'
        '<feMerge><feMergeNode in="d"/><feMergeNode in="wi"/></feMerge></filter>'
        '<filter id="sh" x="-10%" y="-30%" width="120%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>')


def ribbon_band():
    W, H = 1200, 120
    body = (f'<rect x="0" y="40" width="{W}" height="56" fill="#3a3040" opacity=".22" filter="url(#sh)"/>'
            f'<rect x="0" y="30" width="{W}" height="56" fill="url(#sk)" filter="url(#fray)"/>')
    return svg(W, H, body, SILK)


def ribbon_bow():
    W, H = 420, 380
    loop_l = 'M210 170 C 150 90, 40 70, 34 130 C 28 190, 140 200, 210 182Z'
    loop_r = 'M210 170 C 270 90, 380 70, 386 130 C 392 190, 280 200, 210 182Z'
    tail_l = 'M204 182 C 170 240, 140 300, 96 366 L132 372 C 160 316, 190 262, 214 190Z'
    tail_r = 'M216 182 C 240 250, 262 300, 300 360 L268 370 C 240 318, 222 262, 206 190Z'
    sh = ''.join(f'<path d="{p}" fill="#3a3040" opacity=".25" filter="url(#sh)" transform="translate(4 8)"/>' for p in (loop_l, loop_r, tail_l, tail_r))
    fold = ('<path d="M206 172 C 160 120, 80 104, 60 132" stroke="#cfc6bc" stroke-width="3" fill="none" opacity=".8"/>'
            '<path d="M214 172 C 260 120, 340 104, 360 132" stroke="#cfc6bc" stroke-width="3" fill="none" opacity=".8"/>')
    body = (sh + f'<g filter="url(#fray)"><path id="tl" d="{tail_l}" fill="url(#sk)"/><path id="tr" d="{tail_r}" fill="url(#sk)"/>'
            f'<path d="{loop_l}" fill="url(#sk)"/><path d="{loop_r}" fill="url(#sk)"/></g>{fold}'
            '<ellipse cx="210" cy="176" rx="24" ry="20" fill="#3a3040" opacity=".25" filter="url(#sh)"/>'
            '<ellipse cx="210" cy="174" rx="22" ry="18" fill="url(#sk)" filter="url(#fray)"/>')
    return svg(W, H, body, SILK)


write('ribbon-band.svg', ribbon_band())
write('ribbon-bow.svg', ribbon_bow())
