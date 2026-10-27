/* =============================================================================
   Vector artwork for the Terracotta boho sunset — rainbow arches, sun, pampas, dried palms invitation.
   Everything is plain SVG — gradients and shapes, no raster images and no
   blur filters — so it stays sharp at any screen density.
   ========================================================================== */

'use strict'

const Art = (() => {
  // Small seeded random so every composition is the same on every load
  function rng(seed) {
    let a = seed >>> 0
    return () => {
      a = (a + 0x6d2b79f5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  const f = (n) => +n.toFixed(2)
  const use = (id, x, y, s = 1, r = 0, extra = '') =>
    `<use href="#${id}" transform="translate(${f(x)} ${f(y)}) rotate(${f(r)}) scale(${f(s)})"${extra}/>`

  /* ------------------------------------------------------------ shared defs */
  function defs() {
    const goldStops = `<stop offset="0" stop-color="#8f4e30"/><stop offset=".22" stop-color="#c8774f"/><stop offset=".42" stop-color="#f7d4bd"/><stop offset=".58" stop-color="#d98c64"/><stop offset=".8" stop-color="#8a4a2e"/><stop offset="1" stop-color="#e6a07d"/>`
    const petals = []
    for (let k = 0; k < 5; k++) {
      petals.push(`<path d="M0 0 C-13 -4 -15 -21 0 -25 C15 -21 13 -4 0 0Z" fill="url(#gPetal)" stroke="#e3a1b1" stroke-width=".7" transform="rotate(${k * 72})"/>`)
    }
    const mid = []
    for (let k = 0; k < 5; k++) {
      mid.push(`<path d="M0 0 C-9 -3 -10 -15 0 -17 C10 -15 9 -3 0 0Z" fill="url(#gPetalDeep)" stroke="#d98a9c" stroke-width=".6" transform="rotate(${k * 72 + 36})"/>`)
    }
    const mg = (id, shades, centre) => {
      const parts = []
      ;[[11, 18, 3.4, 2.6], [8, 14, 3, 2.3], [5, 10, 2.6, 2]].forEach(([r, n, rx, ry], ring) => {
        for (let i = 0; i < n; i++) {
          const a = (i / n) * 360 + ring * 9
          parts.push(`<ellipse cx="0" cy="${-r}" rx="${rx}" ry="${ry}" fill="${shades[(i + ring) % shades.length]}" transform="rotate(${f(a)})"/>`)
        }
      })
      return `<g id="${id}">${parts.join('')}<circle r="3" fill="${centre}"/></g>`
    }
    return `
      <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">${goldStops}</linearGradient>
      <linearGradient id="gGoldH" x1="0" y1="0" x2="1" y2="0">${goldStops}</linearGradient>
      <linearGradient id="gGoldV" x1="0" y1="0" x2="0" y2="1">${goldStops}</linearGradient>
      <linearGradient id="gMaroon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8a2534"/><stop offset=".5" stop-color="#6e1a27"/><stop offset="1" stop-color="#4f111c"/></linearGradient>
      <linearGradient id="gIvory" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffdf8"/><stop offset=".6" stop-color="#f9f2e3"/><stop offset="1" stop-color="#f1e5cc"/></linearGradient>
      <radialGradient id="gPetal" cx="50%" cy="85%" r="90%">
        <stop offset="0" stop-color="#fdeef1"/><stop offset=".55" stop-color="#f6c9d3"/><stop offset="1" stop-color="#e9a3b4"/></radialGradient>
      <radialGradient id="gPetalDeep" cx="50%" cy="85%" r="90%">
        <stop offset="0" stop-color="#f8d3dc"/><stop offset="1" stop-color="#dc8a9e"/></radialGradient>
      <linearGradient id="gLeaf" x1="0" y1="1" x2="0" y2="0"><stop offset="0.00" stop-color="#a8936b"/><stop offset="1.00" stop-color="#d8c39b"/></linearGradient>
      <linearGradient id="gEmerald" x1="0" y1="0" x2="0" y2="1"><stop offset="0.00" stop-color="#fdf3ea"/><stop offset="0.50" stop-color="#fbe7d8"/><stop offset="1.00" stop-color="#f5d6bf"/></linearGradient>
      <radialGradient id="gEmeraldR" cx="50%" cy="40%" r="75%"><stop offset="0.00" stop-color="#fffaf3"/><stop offset="1.00" stop-color="#ecd3b8"/></radialGradient>
      <linearGradient id="gPearl" x1="0" y1="0" x2="1" y2="1"><stop offset="0.00" stop-color="#f6e6d2"/><stop offset="0.50" stop-color="#ecd3b8"/><stop offset="1.00" stop-color="#dfb995"/></linearGradient>
      <radialGradient id="gLotus" cx="50%" cy="100%" r="105%"><stop offset="0.00" stop-color="#fbf3e6"/><stop offset="0.50" stop-color="#ead7b8"/><stop offset="1.00" stop-color="#d9b88f"/></radialGradient>
      <radialGradient id="gLotusDeep" cx="50%" cy="100%" r="100%"><stop offset="0.00" stop-color="#f6e7d2"/><stop offset="1.00" stop-color="#d9805f"/></radialGradient>
      <radialGradient id="gPad" cx="40%" cy="40%" r="70%"><stop offset="0.00" stop-color="#e9c8a8"/><stop offset="1.00" stop-color="#d9805f"/></radialGradient>
      <linearGradient id="gPeacock" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2a7fd1"/><stop offset=".5" stop-color="#1450a3"/><stop offset="1" stop-color="#0d7a84"/></linearGradient>
      <radialGradient id="gFlame" cx="50%" cy="80%" r="75%">
        <stop offset="0" stop-color="#fffbe6"/><stop offset=".35" stop-color="#ffe08a"/><stop offset=".75" stop-color="#f8a531"/><stop offset="1" stop-color="#e9661d" stop-opacity="0"/></radialGradient>
      <radialGradient id="gGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#fff3c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></radialGradient>
      <pattern id="jaali" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 2 L38 20 L20 38 L2 20Z M20 12 L28 20 L20 28 L12 20Z" fill="none" stroke="#d9805f" stroke-width=".8"/>
        <circle cx="20" cy="20" r="1.6" fill="#d9805f"/></pattern>

      <g id="rose">${petals.join('')}${mid.join('')}
        <circle r="7.5" fill="#e7a0b1"/>
        <path d="M-4.5 -1 C-4.5 -6.5 4.5 -6.5 4.5 -1 C4.5 4.5 -3.5 5.5 -3.5 0 C-3.5 -3.5 2.2 -3.5 2.2 0" fill="none" stroke="#c46f84" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M-10 -14 C-5 -18 5 -18 10 -14" fill="none" stroke="#fff" stroke-width="1" opacity=".55" stroke-linecap="round"/></g>
      <g id="bud">
        <path d="M0 -14 C-7 -10 -7 2 0 4 C7 2 7 -10 0 -14Z" fill="url(#gPetalDeep)" stroke="#d98a9c" stroke-width=".6"/>
        <path d="M0 -12 C-3 -8 -3 0 0 2" fill="none" stroke="#fde9ee" stroke-width=".9"/>
        <path d="M-7 1 C-4 6 4 6 7 1 C4 3 -4 3 -7 1Z" fill="#5f7f52"/><path d="M0 5 L0 16" stroke="#5f7f52" stroke-width="1.6"/></g>
      <g id="leaf">
        <path d="M0 0 C7 -7 8 -20 0 -30 C-8 -20 -7 -7 0 0Z" fill="url(#gLeaf)"/>
        <path d="M0 -2 L0 -27" stroke="#e5eedb" stroke-width=".7" opacity=".7"/></g>
      <g id="bloom">${[0, 72, 144, 216, 288].map((a) => `<circle cx="0" cy="-3.2" r="2.6" fill="#fffdf6" stroke="#eadfca" stroke-width=".4" transform="rotate(${a})"/>`).join('')}
        <circle r="1.5" fill="#d8b45a"/></g>
      <g id="sprig" fill="none" stroke="url(#gGold)" stroke-width="1.3" stroke-linecap="round">
        <path d="M0 0 C4 -10 4 -22 0 -34"/>
        ${[6, 13, 20, 27].map((y, i) => `<path d="M${f(1.4 + i * 0.2)} ${-y} q${i % 2 ? 7 : -7} -3 ${i % 2 ? 9 : -9} -9"/>`).join('')}</g>
      <g id="mgO"><circle r="5.6" fill="#c96f4f"/><circle cx="-1.8" cy="-1.8" r="1.4" fill="#f2b49a"/></g>
      <g id="mgY"><circle r="4.4" fill="#f3e2c7"/><circle cx="-1.2" cy="-1.2" r="1" fill="#fff"/></g>
      <g id="lotus"><path d="M0 0 C1.5 -20 0 -30 0 -42" stroke="#c9a77a" stroke-width="1.3" fill="none"/><ellipse cx="-0.15" cy="-40.00" rx="1.9" ry="6.5" fill="#fbf3e6" opacity=".95" transform="rotate(-18 -0.15 -40.00)"/><ellipse cx="-1.30" cy="-41.60" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(-18 -1.30 -41.60)"/><ellipse cx="2.64" cy="-43.20" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 2.64 -43.20)"/><ellipse cx="-1.42" cy="-44.80" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(-18 -1.42 -44.80)"/><ellipse cx="4.11" cy="-46.40" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 4.11 -46.40)"/><ellipse cx="-1.96" cy="-48.00" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(-18 -1.96 -48.00)"/><ellipse cx="2.65" cy="-49.60" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(18 2.65 -49.60)"/><ellipse cx="-4.85" cy="-51.20" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(-18 -4.85 -51.20)"/><ellipse cx="7.21" cy="-52.80" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(18 7.21 -52.80)"/><ellipse cx="-5.91" cy="-54.40" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(-18 -5.91 -54.40)"/><ellipse cx="-8.25" cy="-56.00" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(-18 -8.25 -56.00)"/><ellipse cx="0.12" cy="-57.60" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(18 0.12 -57.60)"/><ellipse cx="-8.92" cy="-59.20" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(-18 -8.92 -59.20)"/><ellipse cx="6.16" cy="-60.80" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 6.16 -60.80)"/><ellipse cx="9.23" cy="-62.40" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(18 9.23 -62.40)"/><ellipse cx="3.95" cy="-64.00" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(18 3.95 -64.00)"/><ellipse cx="9.03" cy="-65.60" rx="1.9" ry="6.5" fill="#fbf3e6" opacity=".95" transform="rotate(18 9.03 -65.60)"/><ellipse cx="9.70" cy="-67.20" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(18 9.70 -67.20)"/><ellipse cx="-5.22" cy="-68.80" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(-18 -5.22 -68.80)"/><ellipse cx="-7.21" cy="-70.40" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(-18 -7.21 -70.40)"/><ellipse cx="9.10" cy="-72.00" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 9.10 -72.00)"/><ellipse cx="9.45" cy="-73.60" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(18 9.45 -73.60)"/><ellipse cx="-8.52" cy="-75.20" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(-18 -8.52 -75.20)"/><ellipse cx="-1.75" cy="-76.80" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(-18 -1.75 -76.80)"/><ellipse cx="10.55" cy="-78.40" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 10.55 -78.40)"/><ellipse cx="-8.38" cy="-80.00" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(-18 -8.38 -80.00)"/><ellipse cx="-6.47" cy="-81.60" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(-18 -6.47 -81.60)"/><ellipse cx="-3.49" cy="-83.20" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(-18 -3.49 -83.20)"/><ellipse cx="-7.18" cy="-84.80" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(-18 -7.18 -84.80)"/><ellipse cx="0.01" cy="-86.40" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(18 0.01 -86.40)"/><ellipse cx="-0.06" cy="-88.00" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(-18 -0.06 -88.00)"/><ellipse cx="-1.29" cy="-89.60" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(-18 -1.29 -89.60)"/><ellipse cx="-4.57" cy="-91.20" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(-18 -4.57 -91.20)"/><ellipse cx="2.70" cy="-92.80" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(18 2.70 -92.80)"/><ellipse cx="-3.93" cy="-94.40" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(-18 -3.93 -94.40)"/><ellipse cx="2.31" cy="-96.00" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 2.31 -96.00)"/><ellipse cx="-4.00" cy="-97.60" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(-18 -4.00 -97.60)"/><ellipse cx="1.36" cy="-99.20" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(18 1.36 -99.20)"/><ellipse cx="1.42" cy="-100.80" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(18 1.42 -100.80)"/><ellipse cx="2.10" cy="-102.40" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 2.10 -102.40)"/><ellipse cx="1.47" cy="-104.00" rx="1.9" ry="6.5" fill="#e3c9a2" opacity=".95" transform="rotate(18 1.47 -104.00)"/><ellipse cx="1.80" cy="-105.60" rx="1.9" ry="6.5" fill="#ead7b8" opacity=".95" transform="rotate(18 1.80 -105.60)"/><ellipse cx="-1.35" cy="-107.20" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(-18 -1.35 -107.20)"/><ellipse cx="-1.83" cy="-108.80" rx="1.9" ry="6.5" fill="#fbf3e6" opacity=".95" transform="rotate(-18 -1.83 -108.80)"/><ellipse cx="1.38" cy="-110.40" rx="1.9" ry="6.5" fill="#f1e0c6" opacity=".95" transform="rotate(18 1.38 -110.40)"/><ellipse cx="0.36" cy="-112.00" rx="1.9" ry="6.5" fill="#f6ead8" opacity=".95" transform="rotate(18 0.36 -112.00)"/></g>
      <g id="lbud"><path d="M0 0 V-14" stroke="#c9a77a" stroke-width="1"/><ellipse cy="-20" rx="4.5" ry="7.5" fill="#fbf3e6" stroke="#e3cfae" stroke-width=".5"/></g>
      <g id="pad"><path d="M0 6 V0" stroke="#b5532f" stroke-width="1.2"/><path d="M0 0 L-26.31 -9.58 L-24.00 -14.42Z" fill="#e9c8a8"/><path d="M0 0 L-23.21 -15.66 L-19.80 -19.80Z" fill="#d9805f"/><path d="M0 0 L-18.74 -20.81 L-14.42 -24.00Z" fill="#e9c8a8"/><path d="M0 0 L-13.15 -24.72 L-8.19 -26.78Z" fill="#d9805f"/><path d="M0 0 L-6.77 -27.17 L-1.47 -27.96Z" fill="#e9c8a8"/><path d="M0 0 L0.00 -28.00 L5.34 -27.49Z" fill="#d9805f"/><path d="M0 0 L6.77 -27.17 L11.83 -25.38Z" fill="#e9c8a8"/><path d="M0 0 L13.15 -24.72 L17.62 -21.76Z" fill="#d9805f"/><path d="M0 0 L18.74 -20.81 L22.36 -16.85Z" fill="#e9c8a8"/><path d="M0 0 L23.21 -15.66 L25.77 -10.94Z" fill="#d9805f"/><path d="M0 0 L26.31 -9.58 L27.66 -4.38Z" fill="#e9c8a8"/></g>
      <g id="jasmine">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<ellipse cx="0" cy="-5" rx="2.2" ry="4.6" fill="#fffdf8" stroke="#ead7b8" stroke-width=".4" transform="rotate(${a})"/>`).join('')}<circle r="2.4" fill="#e2a64f"/></g>
      <g id="eye">
        <ellipse rx="11" ry="15" fill="#6e9c3a"/><ellipse rx="8.6" ry="12" fill="#d4ae58"/>
        <ellipse rx="6.9" ry="9.8" fill="#14918f"/><ellipse rx="4.7" ry="6.8" fill="#1f45a0" cy="1"/>
        <ellipse rx="2.6" ry="3.9" fill="#0b1d4f" cy="1.5"/></g>
      <linearGradient id="gVase" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e09170"/><stop offset="1" stop-color="#a84a2a"/></linearGradient><radialGradient id="gSun" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fbd7b4"/><stop offset=".6" stop-color="#ef9f74"/><stop offset="1" stop-color="#d9805f"/></radialGradient>
      <g id="star"><path d="M0 -10 C1 -2 2 -1 10 0 C2 1 1 2 0 10 C-1 2 -2 1 -10 0 C-2 -1 -1 -2 0 -10Z" fill="#f7d4bd"/></g>`
  }

  /* ------------------------------------------------------------ floral cluster
     A corner spray anchored at (0,0) that spreads into the quarter (+x, +y). */
  function cluster(seed, R = 300) {
    const r = rng(seed)
    const out = []
    const polar = (rad, deg) => [Math.cos((deg * Math.PI) / 180) * rad, Math.sin((deg * Math.PI) / 180) * rad]
    for (let i = 0; i < 20; i++) {
      const a = 4 + r() * 82
      const [x, y] = polar(R * (0.25 + r() * 0.62), a)
      out.push(use(i % 3 ? 'leaf' : 'pad', x, y, i % 3 ? 1.3 + r() * 1.1 : 1.2 + r() * 0.6, a + 90 + (r() * 50 - 25)))
    }
    for (let i = 0; i < 6; i++) {
      const a = 5 + r() * 80
      const [x, y] = polar(R * (0.45 + r() * 0.4), a)
      out.push(use('sprig', x, y, 1.4 + r() * 0.8, a + 90 + (r() * 30 - 15)))
    }
    const roses = [[0.2, 45, 2.4], [0.46, 20, 1.75], [0.44, 70, 1.8], [0.68, 40, 1.3], [0.7, 8, 1.05], [0.66, 82, 1.1]]
    for (const [d, a, s] of roses) {
      const [x, y] = polar(R * d, a)
      out.push(use('lotus', x, y, s * 0.95, a + 90 + (r() * 16 - 8)))
    }
    for (let i = 0; i < 5; i++) {
      const a = 6 + r() * 78
      const [x, y] = polar(R * (0.78 + r() * 0.16), a)
      out.push(use('lbud', x, y, 1.1 + r() * 0.4, a + 90))
    }
    for (let i = 0; i < 14; i++) {
      const a = r() * 90
      const [x, y] = polar(R * (0.3 + r() * 0.62), a)
      out.push(use('jasmine', x, y, 0.9 + r() * 0.7, r() * 72))
    }
    return out.join('')
  }

  /* ------------------------------------------------------------ marigold garlands */
  function strand(x, y, length, seed = 3, kinds = ['mgO', 'mgY']) {
    const r = rng(seed)
    const out = [`<path d="M${x} ${y} V${y + length}" stroke="#c8774f" stroke-width="1.2"/>`]
    for (let d = 10, i = 0; d < length; d += 19, i++) {
      if (i % 3 === 2) {
        out.push(use('leaf', x - 3, y + d + 4, 0.5, -130), use('leaf', x + 3, y + d + 4, 0.5, 130))
      } else {
        out.push(use(kinds[i % 2], x, y + d, kinds[0] === 'jasmine' ? 1.1 : 0.82 + r() * 0.1, r() * 30))
      }
    }
    out.push(`<circle cx="${x}" cy="${y + length + 8}" r="4" fill="url(#gGold)"/>`, `<path d="M${x} ${y + length + 12} l-4 14 h8z" fill="#c8774f"/>`)
    return out.join('')
  }

  function swag(x0, x1, y, sag, seed = 5) {
    const r = rng(seed)
    const out = []
    const n = Math.round((x1 - x0) / 17)
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const x = x0 + (x1 - x0) * t
      const yy = y + 4 * sag * t * (1 - t)
      out.push(use(i % 2 ? 'mgY' : 'mgO', x, yy, 0.86 + r() * 0.12, r() * 40))
      if (i % 4 === 2) out.push(use('leaf', x, yy + 9, 0.5, 180 + (r() * 40 - 20)))
    }
    return out.join('')
  }

  /* ------------------------------------------------------------ mandala */
  function mandala(cx, cy, R, stroke = 'url(#gGold)', w = 1.2) {
    const out = [`<g transform="translate(${cx} ${cy})" fill="none" stroke="${stroke}" stroke-width="${w}">`]
    for (const k of [1, 0.93, 0.71, 0.5, 0.3, 0.14]) out.push(`<circle r="${f(R * k)}"/>`)
    const ring = (n, a, b, wd, rot = 0) => {
      const p = `M${f(-wd)} ${f(-a)} C${f(-wd)} ${f(-(a + b) / 2)} ${f(-wd / 3)} ${f(-b)} 0 ${f(-b)} C${f(wd / 3)} ${f(-b)} ${f(wd)} ${f(-(a + b) / 2)} ${f(wd)} ${f(-a)}`
      for (let i = 0; i < n; i++) out.push(`<path d="${p}" transform="rotate(${f((i / n) * 360 + rot)})"/>`)
    }
    ring(32, R * 0.71, R * 0.92, R * 0.07)
    ring(16, R * 0.5, R * 0.7, R * 0.1, 11.25)
    ring(12, R * 0.3, R * 0.49, R * 0.1)
    ring(8, R * 0.14, R * 0.29, R * 0.08, 22.5)
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2
      out.push(`<circle cx="${f(Math.cos(a) * R * 0.965)}" cy="${f(Math.sin(a) * R * 0.965)}" r="${f(R * 0.012)}" fill="${stroke}" stroke="none"/>`)
    }
    out.push(`<circle r="${f(R * 0.05)}" fill="${stroke}" stroke="none"/></g>`)
    return out.join('')
  }

  /* ------------------------------------------------------------ scalloped Mughal arch */
  function arch(x0, x1, spring, apex, bottom, lobes = 9, depth = 14) {
    const cx = (x0 + x1) / 2
    const half = (x1 - x0) / 2
    const h = spring - apex
    const R = (half * half + h * h) / (2 * half)
    // left arc: centre (x0 + R, spring), swept from the springing point up to the apex
    const aEnd = Math.atan2(apex - spring, cx - (x0 + R)) + Math.PI * 2
    const pts = []
    for (let i = 0; i <= lobes; i++) {
      const a = Math.PI + (aEnd - Math.PI) * (i / lobes)
      pts.push([x0 + R + Math.cos(a) * R, spring + Math.sin(a) * R])
    }
    const right = pts.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y])
    const all = pts.concat(right)
    let d = `M${x0} ${bottom} L${x0} ${spring}`
    for (let i = 1; i < all.length; i++) {
      const [ax, ay] = all[i - 1]
      const [bx, by] = all[i]
      const mx = (ax + bx) / 2
      const my = (ay + by) / 2
      // push the lobe outward, away from the opening's centre
      const vx = mx - cx
      const vy = my - spring
      const len = Math.hypot(vx, vy) || 1
      d += ` Q${f(mx + (vx / len) * depth)} ${f(my + (vy / len) * depth)} ${f(bx)} ${f(by)}`
    }
    return `${d} L${x1} ${bottom} Z`
  }

  /* ------------------------------------------------------------ palace facade (900 x 1600) */
  const OPENING = { x0: 150, x1: 750, spring: 700, apex: 400, bottom: 1480 }

  function facade() {
    const o = OPENING
    const hole = arch(o.x0, o.x1, o.spring, o.apex, o.bottom, 9, 0)
    const out = []
    out.push(`<path d="M0 0 H900 V1600 H0Z ${hole}" fill="url(#gEmerald)" fill-rule="evenodd"/>`)
    out.push(`<path d="M0 0 H900 V1600 H0Z ${hole}" fill="url(#jaali)" fill-rule="evenodd" opacity=".22"/>`)
    out.push(rainbow(o))
    // arch mouldings
    out.push(`<path d="${arch(o.x0 - 46, o.x1 + 46, o.spring, o.apex - 62, o.bottom, 9, 0)}" fill="none" stroke="#d9805f" stroke-width="1.5" opacity=".55"/>`)
    out.push(`<path d="${arch(o.x0 - 26, o.x1 + 26, o.spring, o.apex - 34, o.bottom, 9, 0)}" fill="none" stroke="url(#gGold)" stroke-width="5"/>`)
    out.push(`<path d="${hole}" fill="none" stroke="url(#gGold)" stroke-width="13"/>`)
    out.push(`<path d="${hole}" fill="none" stroke="#ffffff" stroke-width="2" opacity=".55"/>`)
    // crest above the apex
    out.push(sun(450, 150, 52))
    // spandrel florals
    out.push(`<g transform="translate(0 300)">${cluster(11, 200)}</g>`)
    out.push(`<g transform="translate(900 300) scale(-1 1)">${cluster(12, 200)}</g>`)

    // bead swags, macrame strings, pampas vases
    out.push(swag(0, 300, 22, 100, 7), swag(300, 600, 22, 80, 8), swag(600, 900, 22, 100, 9))
    out.push(strand(120, 30, 360, 21), strand(780, 30, 360, 22))
    out.push(`<rect x="0" y="1480" width="900" height="120" fill="#ecd3b8"/><path d="M0 1480 H900" stroke="url(#gGoldH)" stroke-width="3"/>`)
    out.push(`<g transform="translate(86 1486)">${vase(1)}</g>`, `<g transform="translate(814 1486) scale(-1 1)">${vase(2)}</g>`)
    return out.join('')
  }

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

  function diya(x, y) {
    return `<g transform="translate(${x} ${y})">
      <ellipse cx="0" cy="-44" rx="34" ry="44" fill="url(#gGlow)" class="diya__glow"/>
      <g class="diya__flame"><path d="M0 -54 C-9 -38 -9 -26 0 -20 C9 -26 9 -38 0 -54Z" fill="url(#gFlame)"/>
      <path d="M0 -40 C-3 -33 -3 -27 0 -24 C3 -27 3 -33 0 -40Z" fill="#fffef2"/></g>
      <path d="M-30 -20 C-26 -2 26 -2 30 -20 Z" fill="url(#gGold)"/>
      <path d="M-30 -20 H30" stroke="#8a4a2e" stroke-width="1.5"/>
      <path d="M-12 -4 h24 l4 6 h-32z" fill="#c8774f"/></g>`
  }

  /* ------------------------------------------------------------ monogram crest (centred, radius 100) */
  function monogram(first = 'D', second = 'K') {
    const o = ['<g class="mono">']
    o.push('<circle class="mono__ring" pathLength="1" r="100" fill="none" stroke="url(#gGold)" stroke-width="3"/>')
    o.push('<circle class="mono__ring" pathLength="1" r="93" fill="none" stroke="#c8774f" stroke-width="1"/>')
    o.push('<circle r="86" fill="url(#gEmeraldR)" stroke="url(#gGold)" stroke-width="1.6"/>')
    // laurel: two branches rising from the bottom
    for (const side of [-1, 1]) {
      for (let i = 0; i < 11; i++) {
        const a = Math.PI / 2 + side * (0.32 + i * 0.205)
        const x = Math.cos(a) * 72
        const y = Math.sin(a) * 72
        const tan = (a * 180) / Math.PI + (side > 0 ? 180 : 0)
        o.push(`<ellipse class="mono__leaf" style="--i:${i}" cx="${f(x)}" cy="${f(y)}" rx="7" ry="2.4" fill="url(#gGold)" transform="rotate(${f(tan + side * 35)} ${f(x)} ${f(y)})"/>`)
        o.push(`<ellipse class="mono__leaf" style="--i:${i}" cx="${f(Math.cos(a) * 78)}" cy="${f(Math.sin(a) * 78)}" rx="5.5" ry="2" fill="url(#gGold)" transform="rotate(${f(tan - side * 30)} ${f(Math.cos(a) * 78)} ${f(Math.sin(a) * 78)})"/>`)
      }
    }
    o.push(`<g class="mono__crown">${use('lotus', 0, -88, 0.62, 0)}</g>`)
    o.push(`<text class="mono__letter mono__letter--a" x="-14" y="30" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-weight="500" font-size="80" fill="url(#gGold)" stroke="#f7d4bd" stroke-width="1">${first}</text>`)
    o.push(`<text class="mono__letter mono__letter--b" x="10" y="33" text-anchor="middle" font-family="'Great Vibes', cursive" font-size="86" fill="url(#gGold)" stroke="#f7d4bd" stroke-width="1">${second}</text>`)
    o.push('<circle r="2.6" cx="0" cy="58" fill="#c8774f"/></g>')
    return o.join('')
  }

  /* ------------------------------------------------------------ the doors (600 x 1150, seam at x = 300) */
  function doors(first = 'D', second = 'K') {
    const W = 600
    const H = 1150
    const o = []
    o.push(`<rect width="${W}" height="${H}" fill="url(#gPearl)"/>`)
    for (const [x0, x1] of [[0, 300], [300, 600]]) {
      const w = x1 - x0
      o.push(`<rect x="${x0 + 12}" y="12" width="${w - 24}" height="${H - 24}" fill="none" stroke="url(#gGold)" stroke-width="6"/>`)
      o.push(`<rect x="${x0 + 28}" y="28" width="${w - 56}" height="${H - 56}" fill="none" stroke="#c8774f" stroke-width="1.5"/>`)
      // panels
      o.push(`<rect x="${x0 + 48}" y="560" width="${w - 96}" height="150" rx="6" fill="none" stroke="url(#gGold)" stroke-width="3"/>`)
      o.push(`<rect x="${x0 + 48}" y="760" width="${w - 96}" height="340" rx="6" fill="none" stroke="url(#gGold)" stroke-width="3"/>`)
      o.push(`<clipPath id="lp${x0}"><rect x="${x0 + 52}" y="764" width="${w - 104}" height="332"/></clipPath>`)
      const lat = []
      for (let k = -340; k < 340; k += 34) {
        lat.push(`M${x0 + 52 + k} 764 l340 340 M${x0 + 52 + k + 340} 764 l-340 340`)
      }
      o.push(`<path d="${lat.join(' ')}" stroke="#c8774f" stroke-width="1" opacity=".55" clip-path="url(#lp${x0})"/>`)
      o.push(`<g transform="translate(${x0 + w / 2} 635)"><circle r="44" fill="none" stroke="url(#gGold)" stroke-width="2"/>${use('jasmine', 0, 0, 3.4, 0)}</g>`)
      // studs
      for (let y = 60; y < H - 40; y += 64) {
        o.push(`<circle cx="${x0 + 20}" cy="${y}" r="4" fill="url(#gGold)"/><circle cx="${x1 - 20}" cy="${y}" r="4" fill="url(#gGold)"/>`)
      }
    }
    // handles near the seam
    o.push(`<circle cx="270" cy="930" r="20" fill="none" stroke="url(#gGold)" stroke-width="5"/><circle cx="270" cy="908" r="7" fill="url(#gGold)"/>`)
    o.push(`<circle cx="330" cy="930" r="20" fill="none" stroke="url(#gGold)" stroke-width="5"/><circle cx="330" cy="908" r="7" fill="url(#gGold)"/>`)
    // big mandala centred on the seam — whole when the doors are shut
    o.push(mandala(300, 330, 190, 'url(#gGold)', 1.6))
    // seam
    o.push(`<path d="M300 0 V${H}" stroke="#8f4e30" stroke-width="2.5"/>`)
    // wax seal with monogram, split by the seam
    // monogram seal, split by the seam
    o.push(`<g class="door-seal" transform="translate(300 470) scale(.66)">${monogram(first, second)}</g>`)
    return o.join('')
  }

  /* ------------------------------------------------------------ Ganesha (line art, 100 x 110) */
  const GANESHA = [
    // crown
    'M40 24 L42 13 L46 15 L50 4 L54 15 L58 13 L60 24',
    'M37 27 Q50 20 63 27',
    // head and cheeks
    'M38 28 C33 35 33 45 40 52',
    'M62 28 C67 35 67 45 60 52',
    // ears
    'M37 30 C22 23 9 35 13 51 C16 63 29 66 37 56',
    'M63 30 C78 23 91 35 87 51 C84 63 71 66 63 56',
    'M30 38 C24 40 22 48 27 53',
    'M70 38 C76 40 78 48 73 53',
    // eyes and tilak
    'M42 38 Q45 35 48 38',
    'M52 38 Q55 35 58 38',
    'M50 28 L50 34',
    // trunk
    'M46 42 C44 56 46 70 54 79 C60 85 69 83 70 75 C71 70 66 68 64 72',
    'M54 42 C54 54 55 64 59 70 C62 74 64 74 65 72',
    // tusk
    'M58 52 L66 57 L60 59',
    // lotus seat
    'M28 102 Q39 90 50 102 Q61 90 72 102',
    'M24 106 H76',
  ]
  function ganesha() {
    return GANESHA.map((d) => `<path pathLength="1" d="${d}"/>`).join('') + '<circle cx="50" cy="36.5" r="1.4" class="fill"/>'
  }

  /* ------------------------------------------------------------ function icons (40 x 40, gold line) */
  const ICONS = {
    kalash: '<path d="M12 31 C7 24 11 17 20 17 C29 17 33 24 28 31Z"/><path d="M14 17 H26 M16 17 L15 13 H25 L24 17"/><circle cx="20" cy="9" r="4"/><path d="M15 12 Q11 8 9 11 M25 12 Q29 8 31 11"/><path d="M14 35 H26 M20 31 V35"/>',
    mehendi: '<path d="M14 35 V19 Q14 16 16 16 Q18 16 18 19 V12 Q18 9 20 9 Q22 9 22 12 V11 Q22 8 24 8 Q26 8 26 11 V15 Q26 12 28 12 Q30 12 30 15 V26 Q30 34 22 36 Q16 36 14 35Z"/><circle cx="22" cy="25" r="3"/><circle cx="22" cy="25" r="5.5" stroke-dasharray="1 2"/><path d="M20 13 v2 M24 12 v2 M28 16 v2"/>',
    haldi: '<path d="M7 22 H33 Q31 33 20 33 Q9 33 7 22Z"/><path d="M11 22 Q20 13 29 22" class="fill-soft"/><path d="M14 36 H26"/><path d="M30 9 l-6 9 M27 8 l5 3"/>',
    sangeet: '<ellipse cx="20" cy="22" rx="13" ry="8"/><path d="M7 22 V27 Q20 37 33 27 V22"/><path d="M12 16 L28 28 M28 16 L12 28" opacity=".6"/><path d="M30 6 V14 M30 6 L35 8"/><circle cx="28.5" cy="14.5" r="2"/>',
    mandap: '<path d="M6 34 H34 M9 34 V17 M31 34 V17 M6 17 H34"/><path d="M9 17 Q20 3 31 17"/><circle cx="20" cy="6" r="1.6"/><path d="M20 31 C16 27 18 23 20 21 C22 23 24 27 20 31Z" class="fill-soft"/><path d="M15 31 H25"/>',
    reception: '<path d="M10 8 H18 L17 18 Q14 22 11 18Z"/><path d="M14 20 V31 M10 31 H18"/><path d="M22 8 H30 L29 18 Q26 22 23 18Z"/><path d="M26 20 V31 M22 31 H30"/><path d="M18 4 L20 1 M20 6 L23 4"/>',
  }
  function icon(name) {
    return `<svg class="ico" viewBox="0 0 40 40" aria-hidden="true">${ICONS[name] || ICONS.mandap}</svg>`
  }

  /* ------------------------------------------------------------ ornaments */
  function divider() {
    return `<svg class="divider" viewBox="0 0 240 24" aria-hidden="true">
      <path d="M4 12 H96 M144 12 H236" stroke="url(#gGoldH)" stroke-width="1.2"/>
      <path d="M96 12 C104 4 112 4 120 12 C128 20 136 20 144 12 C136 4 128 4 120 12 C112 20 104 20 96 12Z" fill="none" stroke="url(#gGold)" stroke-width="1.4"/>
      <circle cx="120" cy="12" r="3" fill="url(#gGold)"/><circle cx="86" cy="12" r="1.8" fill="#c9a24b"/><circle cx="154" cy="12" r="1.8" fill="#c9a24b"/></svg>`
  }

  function corner() {
    return `<path pathLength="1" d="M4 70 V18 Q4 4 18 4 H70"/>
      <path pathLength="1" d="M14 60 V24 Q14 14 24 14 H60"/>
      <path pathLength="1" d="M4 18 C20 18 18 4 30 4 M18 4 C18 20 4 18 4 30"/>
      <path pathLength="1" d="M24 24 C34 30 36 40 30 46 C26 40 24 32 24 24Z M24 24 C30 34 40 36 46 30 C40 26 32 24 24 24Z"/>`
  }

  /* ------------------------------------------------------------ wreath (centred, radius R) */
  function wreath(R = 128, seed = 61) {
    const r = rng(seed)
    const out = []
    for (let i = 0; i < 44; i++) {
      const a = (i / 44) * 360
      const rad = (a * Math.PI) / 180
      out.push(use('leaf', Math.cos(rad) * (R + r() * 10 - 5), Math.sin(rad) * (R + r() * 10 - 5), 1 + r() * 0.5, a + (i % 2 ? 40 : 140)))
    }
    for (let i = 0; i < 14; i++) {
      const rad = ((i / 14) * 360 * Math.PI) / 180
      out.push(use(i % 3 === 2 ? 'lbud' : 'lotus', Math.cos(rad) * R, Math.sin(rad) * R, i % 3 === 2 ? 1.1 : 1.1 + r() * 0.3, (i / 14) * 360 + 90))
    }
    for (let i = 0; i < 18; i++) {
      const rad = r() * Math.PI * 2
      out.push(use('jasmine', Math.cos(rad) * (R + 14), Math.sin(rad) * (R + 14), 1.1, r() * 72))
    }
    return out.join('')
  }

  /* ------------------------------------------------------------ a row of diyas (900 x 200) */
  function diyaRow() {
    const out = [`<path d="M40 176 H860" stroke="url(#gGoldH)" stroke-width="2"/>`]
    ;[150, 300, 450, 600, 750].forEach((x, i) => {
      const s = i === 2 ? 1.6 : i % 2 ? 1.25 : 1.05
      out.push(`<g transform="translate(${x} 174) scale(${s})">${diya(0, 0)}</g>`)
    })
    return out.join('')
  }

  return { defs, cluster, mandala, facade, doors, ganesha, icon, divider, corner, strand, swag, arch, wreath, diyaRow, monogram, OPENING }
})()
