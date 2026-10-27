"""Generates the themed invitations public/invitation4..7 from public/invitation3.

Each theme swaps the palette, the flower/garland symbols, the palace front, the doors and the CSS theme
block; the animation, content and playback code is inherited unchanged from invitation3.

Usage (from the repository root):  python3 scripts/invitation-themes.py public
Re-running overwrites invitation4..7.
"""
import math, os, random, shutil, sys, urllib.parse

PUB = sys.argv[1]
SRC = os.path.join(PUB, 'invitation3')


def stops(cols):
    n = len(cols)
    return ''.join(f'<stop offset="{i / (n - 1):.2f}" stop-color="{c}"/>' for i, c in enumerate(cols))


def metal(cols):
    offs = ['0', '.22', '.42', '.58', '.8', '1']
    return ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in zip(offs, cols))


def svg_uri(svg):
    return 'url("data:image/svg+xml,' + urllib.parse.quote(svg, safe=" =:/'.,-#") + '")'


# ----------------------------------------------------------------------------- generated symbols
def wisteria_raceme():
    out = ['<path d="M0 4 V-2" stroke="#7d968a" stroke-width="1"/>']
    for i in range(15):
        y = -3 - i * 3.1
        w = 7 - i * 0.38
        t = i / 14
        r = int(0x9b + (0xec - 0x9b) * t); g = int(0x7f + (0xe2 - 0x7f) * t); b = int(0xd4 + (0xfb - 0xd4) * t)
        c = f'#{r:02x}{g:02x}{b:02x}'
        for s in (-1, 1):
            out.append(f'<ellipse cx="{s * w * 0.42:.2f}" cy="{y + (0.8 if s > 0 else 0):.2f}" rx="{w * 0.42:.2f}" ry="2.5" fill="{c}" stroke="#8f74c9" stroke-width=".25"/>')
    return ''.join(out)


def pampas_plume():
    random.seed(9)
    out = ['<path d="M0 0 C1.5 -20 0 -30 0 -42" stroke="#c9a77a" stroke-width="1.3" fill="none"/>']
    for i in range(46):
        t = i / 45
        y = -40 - t * 72
        spread = math.sin(math.pi * min(1, t * 1.15)) * 10 + 2
        x = random.uniform(-spread, spread)
        rot = 18 if x > 0 else -18
        c = random.choice(['#f6ead8', '#ead7b8', '#fbf3e6', '#e3c9a2', '#f1e0c6'])
        out.append(f'<ellipse cx="{x:.2f}" cy="{y:.2f}" rx="1.9" ry="6.5" fill="{c}" opacity=".95" transform="rotate({rot} {x:.2f} {y:.2f})"/>')
    return ''.join(out)


def palm_fan():
    out = ['<path d="M0 6 V0" stroke="#b5532f" stroke-width="1.2"/>']
    for i in range(11):
        a = math.radians(-70 + i * 14)
        b = math.radians(-70 + i * 14 + 11)
        R = 28
        p1 = (math.sin(a) * R, -math.cos(a) * R)
        p2 = (math.sin(b) * R, -math.cos(b) * R)
        c = '#d9805f' if i % 2 else '#e9c8a8'
        out.append(f'<path d="M0 0 L{p1[0]:.2f} {p1[1]:.2f} L{p2[0]:.2f} {p2[1]:.2f}Z" fill="{c}"/>')
    return ''.join(out)


# ----------------------------------------------------------------------------- JS helper blocks per theme
COW = r'''
  /* ------------------------------------------------------------ Pichwai cow (feet at 0,0, facing +x) */
  function cow() {
    return `<g>
      <path d="M-70 -78 C-92 -64 -90 -36 -86 -18" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M-90 -22 c-4 6 0 14 6 14 c2 -6 -1 -12 -6 -14z" fill="#f29ab5"/>
      ${[-58, -40, 38, 54].map((x) => `<rect x="${x}" y="-52" width="10" height="48" rx="4" fill="#fffaf5" stroke="#ead3da" stroke-width="1"/><rect x="${x - 1}" y="-8" width="12" height="8" rx="2" fill="url(#gGold)"/>`).join('')}
      <path d="M-72 -62 C-74 -100 -40 -114 0 -112 C40 -114 68 -106 76 -82 C82 -62 72 -48 52 -46 L-52 -46 C-68 -46 -72 -52 -72 -62Z" fill="#fffaf5" stroke="#ead3da" stroke-width="1.2"/>
      <ellipse cx="-30" cy="-70" rx="20" ry="12" fill="#f8d3df" opacity=".45"/>
      <path d="M26 -110 C34 -128 54 -126 62 -106" fill="#fffaf5" stroke="#ead3da" stroke-width="1.2"/>
      <path d="M-42 -112 C-20 -118 20 -118 38 -112 L34 -70 C10 -64 -18 -64 -38 -70Z" fill="#f29ab5" stroke="url(#gGold)" stroke-width="2.4"/>
      <path d="M-36 -78 C-14 -72 12 -72 32 -78" stroke="#fde6ee" stroke-width="1.4" stroke-dasharray="2 4" fill="none"/>
      ${use('jasmine', -2, -92, 1.6, 0)}
      <path d="M66 -102 C76 -126 102 -130 112 -114 C120 -100 118 -84 106 -76 C98 -70 84 -74 78 -86Z" fill="#fffaf5" stroke="#ead3da" stroke-width="1.2"/>
      <path d="M78 -114 C66 -126 54 -122 50 -116 C58 -110 68 -108 78 -106Z" fill="#fbdbe5" stroke="#ead3da"/>
      <path d="M90 -124 C86 -136 92 -146 102 -148 M100 -122 C102 -134 110 -140 118 -140" stroke="url(#gGold)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M94 -104 q4 3 8 0" stroke="#5b2a3c" stroke-width="1.6" fill="none"/>
      <ellipse cx="110" cy="-82" rx="5" ry="4" fill="#f6b3c7"/>
      <path d="M70 -96 C74 -80 74 -70 70 -58" stroke="url(#gGold)" stroke-width="3" fill="none"/>
      <circle cx="70" cy="-54" r="6" fill="url(#gGold)"/></g>`
  }
'''

POND = r'''
  /* ------------------------------------------------------------ Pichwai lotus pond along the step */
  function pond(seed = 3) {
    const r = rng(seed)
    const out = ['<rect x="0" y="1480" width="900" height="120" fill="url(#gWater)"/>']
    for (let y = 1500; y < 1600; y += 18) {
      let d = `M0 ${y}`
      for (let x = 0; x <= 900; x += 30) d += ` q15 -5 30 0`
      out.push(`<path d="${d}" stroke="#ffffff" stroke-width="1" opacity=".55" fill="none"/>`)
    }
    out.push('<path d="M0 1480 H900" stroke="url(#gGoldH)" stroke-width="3"/>')
    for (let x = 30; x < 900; x += 64) {
      out.push(use('pad', x + r() * 20, 1540 + r() * 40, 1.6 + r() * 0.5, r() * 360))
      if (r() > 0.35) out.push(use(r() > 0.5 ? 'lotus' : 'lbud', x + 24 + r() * 10, 1560 + r() * 30, 1.3 + r() * 0.5, r() * 16 - 8))
    }
    return out.join('')
  }
'''

WISTERIA = r'''
  /* ------------------------------------------------------------ wisteria cascade hanging from a vine */
  function wisteria(x0, x1, y, seed = 4) {
    const r = rng(seed)
    const out = [`<path d="M${x0} ${y} C${x0 + (x1 - x0) * 0.3} ${y + 30} ${x0 + (x1 - x0) * 0.6} ${y - 20} ${x1} ${y + 10}" stroke="#9c8a74" stroke-width="3" fill="none"/>`]
    const n = Math.round((x1 - x0) / 16)
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n + r() * 8 - 4
      const yy = y + 8 + r() * 14
      out.push(use('lbud', x, yy, 1.6 + r() * 1.9, 180 + r() * 10 - 5))
      if (i % 2) out.push(use('pad', x + 6, yy - 4, 0.9 + r() * 0.4, r() * 360))
    }
    return out.join('')
  }
'''

BUTTERFLIES = r'''
  function butterflies(list) {
    return list.map(([x, y, s, rot]) => `<g class="bfly" transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><use href="#bfly"/></g>`).join('')
  }
'''

CELESTIAL = r'''
  /* ------------------------------------------------------------ night sky: stars, constellations, moon, lanterns */
  function starField(seed = 8) {
    const r = rng(seed)
    const out = []
    for (let i = 0; i < 170; i++) {
      const x = r() * 900
      const y = r() * 1480
      const big = r() > 0.85
      out.push(`<circle class="${big ? 'twinkle' : ''}" style="animation-delay:${(r() * 4).toFixed(2)}s" cx="${f(x)}" cy="${f(y)}" r="${f(big ? 1.8 + r() * 1.4 : 0.6 + r() * 0.9)}" fill="#fff4d6" opacity="${f(0.5 + r() * 0.5)}"/>`)
    }
    // two little constellations in the top corners
    for (const pts of [[[60, 110], [120, 150], [170, 120], [210, 175], [260, 160]], [[640, 160], [690, 120], [750, 150], [800, 110], [840, 170]]]) {
      out.push(`<path d="M${pts.map((p) => p.join(' ')).join(' L')}" stroke="#e8b4a6" stroke-width="1" opacity=".55" fill="none"/>`)
      for (const [x, y] of pts) out.push(use('jasmine', x, y, 0.9, 0))
    }
    return out.join('')
  }

  function moon(cx, cy, R) {
    return `<circle cx="${cx}" cy="${cy}" r="${R * 1.9}" fill="url(#gGlow)" opacity=".5"/>
      <g transform="translate(${cx} ${cy})"><circle r="${R}" fill="url(#gGold)" mask="url(#moonMask)"/></g>`
  }

  function lanterns(x, seed = 2) {
    const r = rng(seed)
    const out = []
    for (let i = 0; i < 3; i++) {
      const lx = x + i * 34 - 34 + r() * 10
      const ly = 220 + i * 110 + r() * 60
      out.push(`<g class="lantern" style="transform-origin:${f(lx)}px 0px;animation-delay:${(r() * 2).toFixed(2)}s">
        <path d="M${f(lx)} 0 V${f(ly - 26)}" stroke="#e8b4a6" stroke-width="1"/>
        <circle cx="${f(lx)}" cy="${f(ly)}" r="44" fill="url(#gGlow)" opacity=".6"/>
        <rect x="${f(lx - 16)}" y="${f(ly - 22)}" width="32" height="44" rx="14" fill="url(#gLantern)"/>
        <rect x="${f(lx - 10)}" y="${f(ly - 28)}" width="20" height="7" rx="2" fill="url(#gGold)"/>
        <rect x="${f(lx - 10)}" y="${f(ly + 21)}" width="20" height="6" rx="2" fill="url(#gGold)"/>
        <path d="M${f(lx)} ${f(ly + 27)} v12" stroke="#e8b4a6" stroke-width="1.4"/></g>`)
    }
    return out.join('')
  }
'''

BOHO = r'''
  /* ------------------------------------------------------------ boho: rainbow bands, sun, pampas vases */
  function rainbow(o) {
    const bands = [[150, '#e2a64f'], [118, '#f2b8a2'], [86, '#e9c8a8'], [54, '#d9805f']]
    return bands.map(([k, c]) => `<path d="${arch(o.x0 - k, o.x1 + k, o.spring, o.apex - k, o.bottom, 9, 0)}" fill="none" stroke="${c}" stroke-width="30"/>`).join('')
  }

  function sun(cx, cy, R) {
    const rays = []
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2
      rays.push(`M${f(cx + Math.cos(a) * (R + 10))} ${f(cy + Math.sin(a) * (R + 10))} L${f(cx + Math.cos(a) * (R + (i % 2 ? 22 : 32)))} ${f(cy + Math.sin(a) * (R + (i % 2 ? 22 : 32)))}`)
    }
    return `<path d="${rays.join(' ')}" stroke="url(#gGold)" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#gSun)"/>`
  }

  function vase(seed = 1) {
    const r = rng(seed)
    const out = []
    for (let i = 0; i < 9; i++) {
      const a = -42 + i * 10.5 + r() * 6 - 3
      out.push(use('lotus', r() * 10 - 5, -136, 1.5 + r() * 0.7, a))
    }
    out.push(use('pad', -26, -150, 2, -40), use('pad', 28, -146, 1.8, 36), use('lbud', -10, -140, 1.6, -18), use('lbud', 14, -140, 1.5, 14))
    out.push(`<path d="M-48 0 C-64 -42 -56 -94 -26 -112 L-24 -140 L24 -140 L26 -112 C56 -94 64 -42 48 0Z" fill="url(#gVase)"/>`)
    out.push('<path d="M-54 -40 H54 M-58 -54 H58" stroke="#f3e2c7" stroke-width="3" opacity=".8"/><path d="M-30 -140 H30" stroke="#8f4e30" stroke-width="5" stroke-linecap="round"/>')
    out.push('<path d="M-40 -70 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8" stroke="#f3e2c7" stroke-width="2" fill="none"/>')
    return out.join('')
  }
'''

# ----------------------------------------------------------------------------- the four themes
THEMES = {
    'invitation4': dict(
        name='Pichwai Pastel', dark=False,
        header='Pichwai pastel — blush, powder blue, lotus pond, white cows',
        metal=['#8a6420', '#d4ae58', '#f7e8b4', '#c99f45', '#8f6a24', '#d9b968'],
        metal_mid='#c9a24b', metal_light='#f3e0a1', metal_dark='#8a6420',
        leaf=['#3f7d6c', '#8fbfae'], base=['#fde8ee', '#f8d6e0', '#f2c4d2'], disk=['#d6e7f7', '#a9c7e8'],
        door=['#e3effa', '#cfe1f4', '#b8d1ec'], flower=['#fff6f9', '#f9c7d8', '#e05a8c'], flower_deep=['#fde3ec', '#d9457c'],
        pad=['#8fbfae', '#3f7d6c'], jaali='#c9a24b',
        mg_o="${mg('mgO', ['#f6b3c7', '#f29ab5', '#f8c4d3', '#ee8fae'], '#d9578a')}",
        mg_y="${mg('mgY', ['#fffaf3', '#fbefe3', '#ffffff', '#f6e8d8'], '#e7c873')}",
        symbols=None,  # keeps the lotus, bud, pad and jasmine
        extra_defs='<linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6e7f7"/><stop offset="1" stop-color="#a9c7e8"/></linearGradient>',
        helpers=COW + POND,
        pillar_fill='#fff1f5', mould='#d9578a', medallion="use('lotus', 0, 14, 1.6, 0)", seam='#8a6420',
        decor=r'''
    // lotus-and-jasmine garlands, lotus pots on the pillars, a lotus pond with two cows
    out.push(swag(0, 300, 22, 110, 7), swag(300, 600, 22, 90, 8), swag(600, 900, 22, 110, 9))
    for (const x of [8, 300, 600, 892]) out.push(`<circle cx="${x}" cy="22" r="9" fill="url(#gGold)"/>`)
    out.push(strand(178, 30, 520, 21), strand(722, 30, 520, 22), strand(128, 30, 330, 23, ['jasmine', 'jasmine']), strand(772, 30, 330, 24, ['jasmine', 'jasmine']))
    for (const x of [82, 818]) out.push(`<g transform="translate(${x} 668)">${use('lotus', 0, 0, 2.6, 0)}${use('lbud', -22, 4, 1.6, -30)}${use('lbud', 22, 4, 1.6, 30)}</g>`)
    out.push(pond(3))
    out.push(`<g transform="translate(112 1482) scale(.92)">${cow()}</g>`, `<g transform="translate(788 1482) scale(-.92 .92)">${cow()}</g>`)''',
        crest="mandala(450, 196, 70, 'url(#gGold)', 1.3) + use('lotus', 450, 128, 2.2, 0)",
        opening=None, lobes=None,
        css=dict(bg='#fbe9ec', bg2='#f6dce3', paper='#fff7f9', text='#5b2a3c', btn_text='#4a1f30', soft='rgba(91, 42, 60, 0.8)',
                 deep='#a8812f', title='#6b2f45', blush='#f2a7be', card_hi='#fff6f8', card_mid='#fbe3ea', card_lo='#f4cdd8',
                 block_hi='#fff4f7', block2_hi='#fbe7ee', palace=['#fde8ee', '#f2c4d2'], light_edge='#e9c46a',
                 intro=['#fff6f8', '#f8d9e3', '#efbfcf'], petal=['#fff4f8', '#f6b9cf', '#e05a8c'], hint_text='#5b2a3c', ctl='#5b2a3c',
                 pattern_svg="<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='none' stroke='#e58fab' stroke-width='.8' opacity='.45'><path d='M24 30c-4-3-4-9 0-13c4 4 4 10 0 13zM24 30c-6 0-10-4-11-8c5 0 9 3 11 8zM24 30c6 0 10-4 11-8c-5 0-9 3-11 8z'/></g><circle cx='0' cy='0' r='1.2' fill='#c9a24b' opacity='.35'/></svg>",
                 pattern_op='0.55'),
        burst="['radial-gradient(circle at 35% 35%, #fdeef1, #f2b9c6 60%, #e39aaa)', 'radial-gradient(circle at 35% 35%, #fff4f6, #f6c9d3 70%)', 'radial-gradient(circle at 40% 40%, #ffffff, #fbefe3)', 'radial-gradient(circle at 40% 40%, #e8f2fc, #a9c7e8)', 'radial-gradient(circle at 40% 40%, #fff, #f3e0a1)']",
    ),
    'invitation5': dict(
        name='Lavender & Champagne', dark=False,
        header='Lavender & champagne — wisteria, peonies, pearls, butterflies',
        metal=['#7d6842', '#b39a68', '#efe2c4', '#c9b07f', '#7a6644', '#d6c39a'],
        metal_mid='#b39a68', metal_light='#f6ecd6', metal_dark='#7a6644',
        leaf=['#8fa79a', '#c8d5cc'], base=['#f6f2fc', '#ece4f8', '#e1d5f2'], disk=['#7b62b0', '#4a3b63'],
        door=['#fffdfb', '#f6f1fc', '#e9e0f6'], flower=['#fdfbff', '#dccdf3', '#a98bdc'], flower_deep=['#f1eafc', '#9b7fd4'],
        pad=['#d3ded7', '#8fa79a'], jaali='#c9b07f',
        mg_o='<g id="mgO"><circle r="6" fill="url(#gPearlBead)"/><circle cx="-2" cy="-2" r="1.6" fill="#fff" opacity=".95"/></g>',
        mg_y='<g id="mgY"><circle r="3.8" fill="#e3d2ae"/><circle cx="-1" cy="-1" r=".9" fill="#fff"/></g>',
        symbols=dict(
            lotus='<g id="lotus">${[0, 60, 120, 180, 240, 300].map((a) => `<ellipse cx="0" cy="-10" rx="11" ry="10" fill="url(#gLotus)" stroke="#b9a3e3" stroke-width=".6" transform="rotate(${a})"/>`).join(\'\')}${[30, 102, 174, 246, 318].map((a) => `<ellipse cx="0" cy="-6" rx="7.5" ry="7" fill="url(#gLotusDeep)" stroke="#a58bd8" stroke-width=".5" transform="rotate(${a})"/>`).join(\'\')}<circle r="5" fill="#cbb6ef"/><path d="M-3 -1 C-3 -4 3 -4 3 -1 C3 2 -2 3 -2 0" fill="none" stroke="#8f74c9" stroke-width=".9"/></g>',
            lbud='<g id="lbud">' + wisteria_raceme() + '</g>',
            pad='<g id="pad"><circle cx="0" cy="-8" r="8" fill="url(#gPad)"/><path d="M0 0 V-14" stroke="#7d968a" stroke-width=".8"/></g>',
            jasmine='<g id="jasmine">${[0, 90, 180, 270].map((a) => `<ellipse cx="0" cy="-4" rx="3" ry="4.2" fill="#fefcff" stroke="#d9cbf2" stroke-width=".4" transform="rotate(${a + 45})"/>`).join(\'\')}<circle r="1.4" fill="#d8c29a"/></g>',
        ),
        extra_defs='<radialGradient id="gPearlBead" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#ece6f5"/><stop offset="1" stop-color="#cfc4e3"/></radialGradient>'
                   '<g id="bfly"><g class="wing wing--l"><path d="M0 0 C-6 -16 -24 -22 -24 -9 C-24 0 -12 3 0 1Z" fill="#c3b0ea" stroke="#c9b07f" stroke-width=".8"/><path d="M0 1 C-10 5 -18 14 -11 18 C-5 20 -2 11 0 3Z" fill="#a98bdc"/></g>'
                   '<g class="wing wing--r"><path d="M0 0 C6 -16 24 -22 24 -9 C24 0 12 3 0 1Z" fill="#c3b0ea" stroke="#c9b07f" stroke-width=".8"/><path d="M0 1 C10 5 18 14 11 18 C5 20 2 11 0 3Z" fill="#a98bdc"/></g>'
                   '<path d="M0 -7 L0 11" stroke="#5b4a78" stroke-width="2" stroke-linecap="round"/></g>',
        helpers=WISTERIA + BUTTERFLIES,
        pillar_fill='#fbf9ff', mould='#b9a3e3', medallion="use('lotus', 0, 0, 2.2, 0)", seam='#8d7550',
        decor=r'''
    // pearl swags, pearl strings, wisteria cascades and butterflies
    out.push(swag(0, 300, 22, 110, 7), swag(300, 600, 22, 90, 8), swag(600, 900, 22, 110, 9))
    for (const x of [8, 300, 600, 892]) out.push(`<circle cx="${x}" cy="22" r="9" fill="url(#gGold)"/>`)
    out.push(strand(150, 30, 470, 21, ['mgO', 'mgY']), strand(750, 30, 470, 22, ['mgO', 'mgY']))
    out.push(wisteria(-10, 330, 40, 4), `<g transform="translate(900 0) scale(-1 1)">${wisteria(-10, 330, 40, 5)}</g>`)
    out.push(wisteria(0, 120, 640, 6), `<g transform="translate(900 0) scale(-1 1)">${wisteria(0, 120, 640, 7)}</g>`)
    out.push(butterflies([[96, 560, 1.4, -14], [812, 470, 1.2, 18], [700, 1180, 1, -8], [210, 1300, 1.1, 12]]))
    out.push(`<rect x="0" y="1480" width="900" height="120" fill="#e9e0f6"/><path d="M0 1480 H900 M0 1500 H900" stroke="url(#gGoldH)" stroke-width="4"/>`)
    for (const x of [150, 750]) out.push(`<g transform="translate(${x} 1568) scale(1.7)">${diya(0, 0)}</g>`)''',
        crest="mandala(450, 196, 70, 'url(#gGold)', 1.3) + use('lotus', 450, 130, 1.9, 0)",
        opening=None, lobes=None,
        css=dict(bg='#f3eefa', bg2='#ebe3f6', paper='#fdfbff', text='#4a3b63', btn_text='#3b2d52', soft='rgba(74, 59, 99, 0.8)',
                 deep='#8d7550', title='#5a4680', blush='#c3b0ea', card_hi='#fdfbff', card_mid='#f1ebfa', card_lo='#e3d8f4',
                 block_hi='#fbf9ff', block2_hi='#f2ecfb', palace=['#f6f2fc', '#e1d5f2'], light_edge='#d8c29a',
                 intro=['#fdfbff', '#ece4f8', '#dacdf0'], petal=['#fdfbff', '#dccdf3', '#a98bdc'], hint_text='#4a3b63', ctl='#4a3b63',
                 pattern_svg="<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><g fill='#b9a3e3' opacity='.35'><ellipse cx='22' cy='17' rx='2.4' ry='3.4'/><ellipse cx='22' cy='27' rx='2.4' ry='3.4'/><ellipse cx='17' cy='22' rx='3.4' ry='2.4'/><ellipse cx='27' cy='22' rx='3.4' ry='2.4'/></g><circle cx='22' cy='22' r='1.2' fill='#c9b07f' opacity='.6'/></svg>",
                 pattern_op='0.6'),
        burst="['radial-gradient(circle at 35% 35%, #fdfbff, #dccdf3 60%, #a98bdc)', 'radial-gradient(circle at 35% 35%, #ffffff, #ece4f8 70%)', 'radial-gradient(circle at 40% 40%, #fff, #e3d2ae)', 'radial-gradient(circle at 40% 40%, #f1eafc, #b9a3e3)', 'radial-gradient(circle at 40% 40%, #ffffff, #f6ecd6)']",
    ),
    'invitation6': dict(
        name='Midnight Celestial', dark=True,
        header='Midnight celestial — navy sky, rose-gold moon, stars, lanterns',
        metal=['#9c5f52', '#d99a87', '#fde6dc', '#e8b4a6', '#a8695c', '#f2c4b3'],
        metal_mid='#e8b4a6', metal_light='#fde6dc', metal_dark='#9c5f52',
        leaf=['#5b6f9e', '#a9b8de'], base=['#1a2b5c', '#111f45', '#0b1530'], disk=['#22356c', '#0f1b3d'],
        door=['#26386e', '#1b2a58', '#121d45'], flower=['#ffffff', '#e6ecfb', '#b9c6ef'], flower_deep=['#f4f6fd', '#c9d3f0'],
        pad=['#a9b8de', '#5b6f9e'], jaali='#e8b4a6',
        mg_o='<g id="mgO"><circle r="12" fill="url(#gGlow)"/><circle r="4.4" fill="#fff1c9"/></g>',
        mg_y='<g id="mgY"><circle r="9" fill="url(#gGlow)"/><circle r="3.1" fill="#fff8e0"/></g>',
        symbols=dict(
            lotus='<g id="lotus">${[0, 72, 144, 216, 288].map((a) => `<path d="M0 0 C-12 -6 -12 -20 0 -24 C12 -20 12 -6 0 0Z" fill="url(#gLotus)" stroke="#c9d3f0" stroke-width=".6" transform="rotate(${a})"/><path d="M0 -3 L0 -20" stroke="#e8b4a6" stroke-width=".6" opacity=".7" transform="rotate(${a})"/>`).join(\'\')}<circle r="4" fill="#fff4d6"/></g>',
            lbud='<g id="lbud"><path d="M0 0 C-6 -5 -5 -15 0 -21 C5 -15 6 -5 0 0Z" fill="url(#gLotusDeep)" stroke="#c9d3f0" stroke-width=".5"/><path d="M0 0 V12" stroke="#9fb2d8" stroke-width="1.4"/></g>',
            pad='<g id="pad"><path d="M0 0 C7 -7 8 -20 0 -30 C-8 -20 -7 -7 0 0Z" fill="url(#gPad)"/></g>',
            jasmine='<g id="jasmine"><path d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9Z" fill="#fde6dc"/></g>',
        ),
        extra_defs='<mask id="moonMask"><circle r="72" fill="#fff"/><circle cx="28" cy="-16" r="64" fill="#000"/></mask>'
                   '<linearGradient id="gLantern" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8"/><stop offset=".55" stop-color="#f6a55a"/><stop offset="1" stop-color="#e0703c"/></linearGradient>',
        helpers=CELESTIAL,
        pillar_fill='#16244c', mould='#fde6dc', medallion="use('lotus', 0, 0, 2.2, 0)", seam='#0a1230',
        decor=r'''
    // fairy-light swags, light strings, hanging lanterns
    out.push(swag(0, 300, 22, 110, 7), swag(300, 600, 22, 90, 8), swag(600, 900, 22, 110, 9))
    for (const x of [8, 300, 600, 892]) out.push(`<circle cx="${x}" cy="22" r="7" fill="url(#gGold)"/>`)
    out.push(strand(178, 30, 520, 21), strand(722, 30, 520, 22))
    out.push(lanterns(80, 2), lanterns(820, 3))
    out.push(`<rect x="0" y="1480" width="900" height="120" fill="#0a1230"/><path d="M0 1480 H900 M0 1500 H900" stroke="url(#gGoldH)" stroke-width="3"/>`)
    for (const x of [150, 750]) out.push(`<g transform="translate(${x} 1568) scale(1.7)">${diya(0, 0)}</g>`)''',
        pre_decor="    out.push(starField(8))\n",
        crest="moon(450, 190, 64)",
        opening=None, lobes=None,
        css=dict(bg='#0e1a3a', bg2='#0b1530', paper='#16244c', text='#f7efe4', btn_text='#0e1a3a', soft='rgba(247, 239, 228, 0.8)',
                 deep='#e8b4a6', title='#f2c4b3', blush='#e8b4a6', card_hi='#1f3268', card_mid='#121f45', card_lo='#0a1230',
                 block_hi='#18295a', block2_hi='#132250', palace=['#1a2b5c', '#0b1530'], light_edge='#f2c4b3',
                 intro=['#22356c', '#0f1b3d', '#070e24'], petal=['#ffffff', '#e6ecfb', '#e8b4a6'], hint_text='#0e1a3a', ctl='#0e1a3a',
                 pattern_svg="<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='#fff4d6'><circle cx='8' cy='12' r='.9' opacity='.6'/><circle cx='40' cy='6' r='.6' opacity='.5'/><circle cx='28' cy='34' r='1.1' opacity='.7'/><circle cx='52' cy='44' r='.7' opacity='.5'/><circle cx='14' cy='50' r='.6' opacity='.45'/></g><path d='M44 24 c.4 2 .8 2.4 2.8 2.8 c-2 .4-2.4.8-2.8 2.8 c-.4-2-.8-2.4-2.8-2.8 c2-.4 2.4-.8 2.8-2.8z' fill='#e8b4a6' opacity='.55'/></svg>",
                 pattern_op='0.9'),
        burst="['radial-gradient(circle at 35% 35%, #ffffff, #e6ecfb 60%, #b9c6ef)', 'radial-gradient(circle at 35% 35%, #fff4f0, #f2c4b3 70%)', 'radial-gradient(circle at 40% 40%, #fff8e0, #ffd98a)', 'radial-gradient(circle at 40% 40%, #ffffff, #fde6dc)', 'radial-gradient(circle at 40% 40%, #fff, #e8b4a6)']",
    ),
    'invitation7': dict(
        name='Terracotta Boho Sunset', dark=False,
        header='Terracotta boho sunset — rainbow arches, sun, pampas, dried palms',
        metal=['#8f4e30', '#c8774f', '#f7d4bd', '#d98c64', '#8a4a2e', '#e6a07d'],
        metal_mid='#c8774f', metal_light='#f7d4bd', metal_dark='#8a4a2e',
        leaf=['#a8936b', '#d8c39b'], base=['#fdf3ea', '#fbe7d8', '#f5d6bf'], disk=['#fffaf3', '#ecd3b8'],
        door=['#f6e6d2', '#ecd3b8', '#dfb995'], flower=['#fbf3e6', '#ead7b8', '#d9b88f'], flower_deep=['#f6e7d2', '#d9805f'],
        pad=['#e9c8a8', '#d9805f'], jaali='#d9805f',
        mg_o='<g id="mgO"><circle r="5.6" fill="#c96f4f"/><circle cx="-1.8" cy="-1.8" r="1.4" fill="#f2b49a"/></g>',
        mg_y='<g id="mgY"><circle r="4.4" fill="#f3e2c7"/><circle cx="-1.2" cy="-1.2" r="1" fill="#fff"/></g>',
        symbols=dict(
            lotus='<g id="lotus">' + pampas_plume() + '</g>',
            lbud='<g id="lbud"><path d="M0 0 V-14" stroke="#c9a77a" stroke-width="1"/><ellipse cy="-20" rx="4.5" ry="7.5" fill="#fbf3e6" stroke="#e3cfae" stroke-width=".5"/></g>',
            pad='<g id="pad">' + palm_fan() + '</g>',
            jasmine='<g id="jasmine">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<ellipse cx="0" cy="-5" rx="2.2" ry="4.6" fill="#fffdf8" stroke="#ead7b8" stroke-width=".4" transform="rotate(${a})"/>`).join(\'\')}<circle r="2.4" fill="#e2a64f"/></g>',
        ),
        extra_defs='<linearGradient id="gVase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e09170"/><stop offset="1" stop-color="#a84a2a"/></linearGradient>'
                   '<radialGradient id="gSun" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fbd7b4"/><stop offset=".6" stop-color="#ef9f74"/><stop offset="1" stop-color="#d9805f"/></radialGradient>',
        helpers=BOHO,
        pillar_fill=None, mould='#d9805f', medallion="use('jasmine', 0, 0, 3.4, 0)", seam='#8f4e30',
        decor=r'''
    // bead swags, macrame strings, pampas vases
    out.push(swag(0, 300, 22, 100, 7), swag(300, 600, 22, 80, 8), swag(600, 900, 22, 100, 9))
    out.push(strand(120, 30, 360, 21), strand(780, 30, 360, 22))
    out.push(`<rect x="0" y="1480" width="900" height="120" fill="#ecd3b8"/><path d="M0 1480 H900" stroke="url(#gGoldH)" stroke-width="3"/>`)
    out.push(`<g transform="translate(86 1486)">${vase(1)}</g>`, `<g transform="translate(814 1486) scale(-1 1)">${vase(2)}</g>`)''',
        pre_decor="    out.push(rainbow(o))\n",
        crest="sun(450, 150, 52)",
        opening="{ x0: 150, x1: 750, spring: 700, apex: 400, bottom: 1480 }", lobes=(9, 0),
        css=dict(bg='#fbede3', bg2='#f6e0d0', paper='#fff8f2', text='#6b3a2a', btn_text='#5a2e20', soft='rgba(107, 58, 42, 0.82)',
                 deep='#a8583a', title='#b5532f', blush='#f2b8a2', card_hi='#fffaf5', card_mid='#fbeadf', card_lo='#f4d6c2',
                 block_hi='#fff7f0', block2_hi='#fbe9dc', palace=['#fdf3ea', '#f5d6bf'], light_edge='#ef9f74',
                 intro=['#fff7ef', '#fbe0cd', '#f2c3a6'], petal=['#fffdf8', '#f3e2c7', '#d9805f'], hint_text='#6b3a2a', ctl='#6b3a2a',
                 pattern_svg="<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='none' stroke='#d9805f' stroke-width='1' opacity='.35'><path d='M14 30 a10 10 0 0 1 20 0'/><path d='M18 30 a6 6 0 0 1 12 0'/></g><circle cx='24' cy='30' r='1.4' fill='#e2a64f' opacity='.5'/></svg>",
                 pattern_op='0.6'),
        burst="['radial-gradient(circle at 35% 35%, #fffdf8, #f3e2c7 70%)', 'radial-gradient(circle at 40% 40%, #f7c59a, #d9805f)', 'radial-gradient(circle at 40% 40%, #fbf3e6, #ead7b8)', 'radial-gradient(circle at 40% 40%, #fbd7b4, #e2a64f)', 'radial-gradient(circle at 40% 40%, #fff, #f2b8a2)']",
    ),
}


def must(s, a, b):
    assert a in s, f'pattern not found: {a[:80]!r}'
    return s.replace(a, b, 1)


def build_art(t):
    s = open(os.path.join(SRC, 'art.js')).read()
    s = must(s, 'Vector artwork for the emerald & gold invitation — peacocks, lotus, jasmine.', f'Vector artwork for the {t["header"]} invitation.')
    a = s.index('    const goldStops = `'); b = s.index('`', s.index('`', a) + 1) + 1
    s = s[:a] + f'    const goldStops = `{metal(t["metal"])}`' + s[b:]
    def grad(gid, cols):
        nonlocal s
        a = s.index(f'id="{gid}"'); a = s.index('>', a) + 1; b = s.index('</', a)
        s = s[:a] + stops(cols) + s[b:]
    grad('gLeaf', t['leaf']); grad('gEmerald', t['base']); grad('gEmeraldR', t['disk']); grad('gPearl', t['door'])
    grad('gLotus', t['flower']); grad('gLotusDeep', t['flower_deep']); grad('gPad', t['pad'])
    a = s.index('<pattern id="jaali"'); b = s.index('</pattern>', a)
    s = s[:a] + s[a:b].replace('#c9a24b', t['jaali']) + s[b:]
    s = must(s, "      ${mg('mgO', ['#f29a2e', '#f6a93f', '#ec8a22', '#f8b44f'], '#c9701a')}", '      ' + t['mg_o'])
    s = must(s, "      ${mg('mgY', ['#f7c948', '#f9d665', '#f2b632', '#fbe08a'], '#d99a1c')}", '      ' + t['mg_y'])
    if t['symbols']:
        a = s.index('      <g id="lotus">'); b = s.index('      <g id="eye">')
        s = s[:a] + '\n'.join('      ' + t['symbols'][k] for k in ('lotus', 'lbud', 'pad', 'jasmine')) + '\n' + s[b:]
    s = must(s, '      <g id="star">', '      ' + t['extra_defs'] + '\n      <g id="star">')
    s = s.replace('fill="#f4dc95"/></g>`', f'fill="{t["metal_light"]}"/></g>`')
    # facade
    a = s.index('  function facade() {'); b = s.index('  function diya(x, y) {')
    if t['opening']:
        s = must(s, 'const OPENING = { x0: 150, x1: 750, spring: 700, apex: 330, bottom: 1480 }', f'const OPENING = {t["opening"]}')
    lob = f', {t["lobes"][0]}, {t["lobes"][1]}' if t['lobes'] else ''
    lobm1 = f'9, 0' if t['lobes'] else '9, 16'
    lobm2 = f'9, 0' if t['lobes'] else '9, 15'
    pillars = ''
    if t['pillar_fill']:
        pillars = f'''    for (const x of [62, 798]) {{
      out.push(`<rect x="${{x}}" y="690" width="40" height="790" fill="{t['pillar_fill']}" stroke="url(#gGoldV)" stroke-width="3"/>`)
      for (const dx of [10, 20, 30]) out.push(`<path d="M${{x + dx}} 720 V1450" stroke="{t['metal_mid']}" stroke-width="1" opacity=".6"/>`)
      out.push(`<path d="M${{x - 12}} 690 h64 l-8 -22 h-48z" fill="url(#gGold)"/><path d="M${{x - 10}} 1480 h60 v-16 h-60z" fill="url(#gGold)"/>`)
    }}
'''
    fac = f'''  function facade() {{
    const o = OPENING
    const hole = arch(o.x0, o.x1, o.spring, o.apex, o.bottom{lob})
    const out = []
    out.push(`<path d="M0 0 H900 V1600 H0Z ${{hole}}" fill="url(#gEmerald)" fill-rule="evenodd"/>`)
    out.push(`<path d="M0 0 H900 V1600 H0Z ${{hole}}" fill="url(#jaali)" fill-rule="evenodd" opacity=".22"/>`)
{t.get('pre_decor', '')}{pillars}    // arch mouldings
    out.push(`<path d="${{arch(o.x0 - 46, o.x1 + 46, o.spring, o.apex - 62, o.bottom, {lobm1})}}" fill="none" stroke="{t['mould']}" stroke-width="1.5" opacity=".55"/>`)
    out.push(`<path d="${{arch(o.x0 - 26, o.x1 + 26, o.spring, o.apex - 34, o.bottom, {lobm2})}}" fill="none" stroke="url(#gGold)" stroke-width="5"/>`)
    out.push(`<path d="${{hole}}" fill="none" stroke="url(#gGold)" stroke-width="13"/>`)
    out.push(`<path d="${{hole}}" fill="none" stroke="#ffffff" stroke-width="2" opacity=".55"/>`)
    // crest above the apex
    out.push({t['crest']})
    // spandrel florals
    out.push(`<g transform="translate(0 300)">${{cluster(11, 200)}}</g>`)
    out.push(`<g transform="translate(900 300) scale(-1 1)">${{cluster(12, 200)}}</g>`)
{t['decor']}
    return out.join('')
  }}
{t['helpers']}
'''
    s = s[:a] + fac + s[b:]
    # drop the peacock
    a = s.index('  /* ------------------------------------------------------------ peacock'); b = s.index('  /* ------------------------------------------------------------ monogram crest')
    s = s[:a] + s[b:]
    s = must(s, 'diyaRow, peacock, monogram, OPENING }', 'diyaRow, monogram, OPENING }')
    # doors and monogram colours
    s = must(s, '<path d="${lat.join(\' \')}" stroke="#c9a24b"', f'<path d="${{lat.join(\' \')}}" stroke="{t["metal_mid"]}"')
    s = must(s, 'fill="none" stroke="#d4ae58" stroke-width="1.5"/>`)', f'fill="none" stroke="{t["metal_mid"]}" stroke-width="1.5"/>`)')
    s = must(s, "${use('lotus', 0, 14, 1.6, 0)}</g>`)", '${' + t['medallion'] + '}</g>`)')
    s = must(s, '<path d="M300 0 V${H}" stroke="#8a6420"', f'<path d="M300 0 V${{H}}" stroke="{t["seam"]}"')
    s = s.replace('stroke="#f3e0a1" stroke-width="1">${first}', f'stroke="{t["metal_light"]}" stroke-width="1">${{first}}')
    s = s.replace('stroke="#f3e0a1" stroke-width="1">${second}', f'stroke="{t["metal_light"]}" stroke-width="1">${{second}}')
    s = s.replace('r="93" fill="none" stroke="#d4ae58"', f'r="93" fill="none" stroke="{t["metal_mid"]}"')
    s = s.replace('<circle r="2.6" cx="0" cy="58" fill="#d4ae58"/>', f'<circle r="2.6" cx="0" cy="58" fill="{t["metal_mid"]}"/>')
    s = s.replace('stroke="#b8892e" stroke-width="1.2"/>`]', f'stroke="{t["metal_mid"]}" stroke-width="1.2"/>`]')
    s = s.replace('<path d="M${x} ${y + length + 12} l-4 14 h8z" fill="#c9a24b"/>', f'<path d="M${{x}} ${{y + length + 12}} l-4 14 h8z" fill="{t["metal_mid"]}"/>')
    s = s.replace('<path d="M-30 -20 H30" stroke="#8a6420"', f'<path d="M-30 -20 H30" stroke="{t["metal_dark"]}"')
    s = s.replace('<path d="M-12 -4 h24 l4 6 h-32z" fill="#b8892e"/>', f'<path d="M-12 -4 h24 l4 6 h-32z" fill="{t["metal_mid"]}"/>')
    return s


def build_css(t):
    c = open(os.path.join(SRC, 'styles.css')).read()
    k = t['css']
    c = must(c, 'Royal wedding invitation — emerald & gold (peacock, lotus, jasmine)', f'Wedding invitation — {t["header"]}')
    m = t['metal']
    foil = f'linear-gradient(105deg, {m[0]} 0%, {m[1]} 18%, {m[2]} 32%, {m[3]} 46%, {m[4]} 62%, {m[5]} 78%, {m[0]} 100%)'
    pattern = svg_uri(k['pattern_svg'])
    a = c.index(':root {'); b = c.index('}', a)
    old = c[a:b]
    keep = [l for l in old.split('\n') if l.strip().startswith(('--cinzel', '--serif', '--script', '--deva', '--ease'))]
    root = f'''  --ivory: {k['bg']};
  --ivory-2: {k['bg2']};
  --paper: {k['paper']};
  --maroon: {k['text']};
  --maroon-2: {k['btn_text']};
  --maroon-soft: {k['soft']};
  --gold: {t['metal_mid']};
  --gold-deep: {k['deep']};
  --gold-light: {k['title']};
  --blush: {k['blush']};
  --emerald-dark: {k['card_lo']};
  --velvet: {pattern};
  --foil: {foil};
  --btn: linear-gradient(135deg, {m[1]}, {m[2]} 45%, {m[3]} 70%, {m[5]});
'''
    c = c[:a] + ':root {\n' + root + '\n'.join(keep) + '\n' + c[b:]
    a = c.index('/* =============================================================================\n   EMERALD THEME')
    b = c.index('/* =============================================================================\n   DK MONOGRAM INTRO')
    shadow = ('0 24px 60px rgba(0, 0, 0, 0.45),\n    0 60px 120px rgba(0, 0, 0, 0.3)' if t['dark'] else
              f'0 24px 60px rgba(60, 30, 40, 0.18),\n    0 60px 120px rgba(60, 30, 40, 0.12)')
    door_shade = 'rgba(5, 10, 30, 0.6)' if t['dark'] else 'rgba(60, 40, 50, 0.35)'
    theme = f'''/* =============================================================================
   THEME — {t['name']}: surfaces, contrast, texture
   ========================================================================== */
body {{
  background: {k['bg']};
}}

.backdrop {{
  background:
    radial-gradient(70% 60% at 50% 45%, {k['card_hi']}, transparent 70%),
    radial-gradient(60% 50% at 0% 0%, {k['blush']}55, transparent 70%),
    radial-gradient(60% 50% at 100% 100%, {t['metal_mid']}33, transparent 70%),
    linear-gradient(160deg, {k['card_mid']}, {k['card_lo']});
}}

.backdrop::before {{
  background-image: var(--velvet);
  background-size: 48px 48px;
  opacity: {k['pattern_op']};
}}

.stage {{
  box-shadow:
    0 0 0 1px {t['metal_mid']},
    0 0 0 6px {k['paper']},
    0 0 0 7px {t['metal_mid']}aa,
    {shadow};
}}

@media (max-width: 600px), (max-height: 520px) and (max-width: 900px) {{
  body {{
    background: var(--ivory);
  }}
}}

.btn {{
  background: var(--btn);
}}

.card {{
  background:
    radial-gradient(90% 60% at 50% 40%, {t['metal_light']}22, transparent 70%),
    var(--velvet) 0 0 / 48px 48px,
    radial-gradient(100% 70% at 50% 45%, {k['card_hi']} 0%, {k['card_mid']} 60%, {k['card_lo']} 100%);
}}

.block {{
  background:
    var(--velvet) 0 0 / 48px 48px,
    radial-gradient(120% 80% at 50% 0%, {k['block_hi']}, var(--ivory) 70%);
}}

.block:nth-of-type(odd) {{
  background:
    var(--velvet) 0 0 / 48px 48px,
    radial-gradient(120% 80% at 50% 0%, {k['block2_hi']}, var(--ivory-2) 70%);
}}

.is-card .card__watermark {{
  opacity: 0.12;
}}

.block__mandala {{
  opacity: 0.1;
}}

.title,
.shloka {{
  color: var(--gold-light);
}}

.palace {{
  background: linear-gradient(180deg, {k['palace'][0]}, {k['palace'][1]});
}}

.palace__light {{
  background: radial-gradient(60% 50% at 50% 45%, #fffef8 0%, #fff6e3 35%, {t['metal_light']} 70%, {k['light_edge']} 100%);
}}

.door--left::after {{
  background: linear-gradient(90deg, transparent, {door_shade});
}}

.door--right::after {{
  background: linear-gradient(270deg, transparent, {door_shade});
}}

.palace__hint {{
  background: rgba(255, 253, 250, 0.95);
}}

.palace__hint .caps {{
  color: {k['hint_text']};
}}

.event {{
  background:
    radial-gradient(80% 50% at 50% 0%, {k['blush']}2e, transparent 70%),
    var(--paper);
  box-shadow:
    inset 0 0 0 1.6cqw var(--paper),
    inset 0 0 0 calc(1.6cqw + 1px) {t['metal_mid']}73,
    0 2cqw 6cqw rgba(0, 0, 0, {0.25 if t['dark'] else 0.08});
}}

.family,
.hotel,
.countdown__arch {{
  background: var(--paper);
}}

.ico .fill-soft {{
  fill: {k['blush']}8c;
}}

.ctl {{
  background: rgba(255, 253, 250, 0.94);
}}

.ctl svg {{
  stroke: {k['ctl']};
}}

.ctl__speaker {{
  fill: {k['ctl']};
}}

.drift-petal {{
  background: radial-gradient(circle at 35% 35%, {k['petal'][0]}, {k['petal'][1]} 60%, {k['petal'][2]});
}}

'''
    extra = ''
    if t['name'] == 'Lavender & Champagne':
        extra = '''#bfly .wing {
  transform-box: fill-box;
  animation: flap-wing 0.5s ease-in-out infinite alternate;
}

#bfly .wing--l {
  transform-origin: 100% 40%;
}

#bfly .wing--r {
  transform-origin: 0% 40%;
}

@keyframes flap-wing {
  to {
    transform: scaleX(0.35);
  }
}

.bfly {
  animation: hover-b 6s ease-in-out infinite alternate;
}

@keyframes hover-b {
  to {
    translate: 10px -14px;
  }
}

'''
    if t['name'] == 'Midnight Celestial':
        extra = '''.facade .twinkle,
.intro .twinkle {
  animation: twinkle-star 2.6s ease-in-out infinite;
}

@keyframes twinkle-star {
  50% {
    opacity: 0.15;
  }
}

.lantern {
  animation: lantern-sway 5s ease-in-out infinite alternate;
}

@keyframes lantern-sway {
  from {
    transform: rotate(-2.2deg);
  }
  to {
    transform: rotate(2.2deg);
  }
}

.palace::after,
.intro::after {
  content: '';
  position: absolute;
  z-index: 9;
  top: 10%;
  left: -20%;
  width: 26cqw;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #fff4d6);
  transform: rotate(-24deg);
  opacity: 0;
  animation: shooting-star 7s ease-in 2s infinite;
  pointer-events: none;
}

@keyframes shooting-star {
  0% {
    opacity: 0;
    translate: 0 0;
  }
  4% {
    opacity: 1;
  }
  14% {
    opacity: 0;
    translate: 120cqw 50cqw;
  }
  100% {
    opacity: 0;
    translate: 120cqw 50cqw;
  }
}

'''
    c = c[:a] + theme + extra + c[b:]
    c = must(c, 'radial-gradient(80% 55% at 50% 48%, #17614b 0%, #0a3328 65%, #061f18 100%);',
             f'radial-gradient(80% 55% at 50% 48%, {k["intro"][0]} 0%, {k["intro"][1]} 65%, {k["intro"][2]} 100%);')
    return c


def build(route, t):
    dst = os.path.join(PUB, route)
    readme = os.path.join(dst, 'README.md')
    kept = open(readme).read() if os.path.exists(readme) else None  # a route's README survives regeneration
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(SRC, dst)
    os.remove(readme)
    if kept:
        open(readme, 'w').write(kept)
    open(os.path.join(dst, 'art.js'), 'w').write(build_art(t))
    open(os.path.join(dst, 'styles.css'), 'w').write(build_css(t))
    js = open(os.path.join(dst, 'script.js')).read()
    a = js.index('  const colours = ['); b = js.index(']', js.index('\n', a + 30)) + 1
    js = js[:a] + '  const colours = ' + t['burst'] + js[b:]
    js = js.replace("watermark: () => Art.mandala(0, 0, 190, '#d4ae58', 1),", f"watermark: () => Art.mandala(0, 0, 190, '{t['metal_mid']}', 1),")
    open(os.path.join(dst, 'script.js'), 'w').write(js)
    h = open(os.path.join(dst, 'index.html')).read()
    h = h.replace('<meta name="theme-color" content="#0d3f31" />', f'<meta name="theme-color" content="{t["css"]["bg"]}" />')
    h = h.replace('%230d3f31', '%23' + t['css']['card_lo'].lstrip('#'))
    open(os.path.join(dst, 'index.html'), 'w').write(h)
    print('built', route, t['name'])


for route, t in THEMES.items():
    build(route, t)
