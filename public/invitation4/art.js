/* =============================================================================
   Pichwai scroll — vector artwork (lotus, cows, border, bell, koi, toran)
   All shapes and gradients: sharp at any size.
   ========================================================================== */

'use strict'

const Art = (() => {
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
  const use = (id, x, y, s = 1, r = 0) => `<use href="#${id}" transform="translate(${f(x)} ${f(y)}) rotate(${f(r)}) scale(${f(s)})"/>`

  function defs() {
    return `
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a6420"/><stop offset=".3" stop-color="#d4ae58"/><stop offset=".5" stop-color="#f7e8b4"/><stop offset=".7" stop-color="#c99f45"/><stop offset="1" stop-color="#8f6a24"/></linearGradient>
      <radialGradient id="petal" cx="50%" cy="100%" r="105%"><stop offset="0" stop-color="#fff6f9"/><stop offset=".45" stop-color="#f9c7d8"/><stop offset="1" stop-color="#e05a8c"/></radialGradient>
      <radialGradient id="petalDeep" cx="50%" cy="100%" r="100%"><stop offset="0" stop-color="#fde3ec"/><stop offset="1" stop-color="#d9457c"/></radialGradient>
      <radialGradient id="pad" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#9cc9b6"/><stop offset="1" stop-color="#4b8a77"/></radialGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe3f6"/><stop offset="1" stop-color="#9fc0e4"/></linearGradient>
      <linearGradient id="bellG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a7428"/><stop offset=".35" stop-color="#f7e8b4"/><stop offset=".6" stop-color="#d4ae58"/><stop offset="1" stop-color="#8a6420"/></linearGradient>
      <linearGradient id="koi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#ffd9c7"/><stop offset="1" stop-color="#f08a5d"/></linearGradient>
      <g id="lotus">
        ${[-62, -31, 31, 62].map((a) => `<path d="M0 0 C-7 -8 -6.5 -24 0 -33 C6.5 -24 7 -8 0 0Z" fill="url(#petal)" stroke="#d9578a" stroke-width=".6" transform="rotate(${a})"/>`).join('')}
        <path d="M0 0 C-8 -9 -7 -27 0 -37 C7 -27 8 -9 0 0Z" fill="url(#petal)" stroke="#d9578a" stroke-width=".6"/>
        ${[-44, 44].map((a) => `<path d="M0 1 C-6 -6 -5.5 -19 0 -26 C5.5 -19 6 -6 0 1Z" fill="url(#petalDeep)" stroke="#c94a7a" stroke-width=".6" transform="rotate(${a})"/>`).join('')}
        <path d="M0 2 C-6 -4 -5 -16 0 -22 C5 -16 6 -4 0 2Z" fill="url(#petal)" stroke="#c94a7a" stroke-width=".5"/>
        <path d="M-12 3 Q0 8 12 3" fill="none" stroke="#c9a24b" stroke-width="1.2"/></g>
      <g id="bud"><path d="M0 0 C-7 -6 -6.5 -19 0 -28 C6.5 -19 7 -6 0 0Z" fill="url(#petalDeep)" stroke="#c94a7a" stroke-width=".6"/>
        <path d="M0 -3 C-3 -9 -2.5 -18 0 -24" fill="none" stroke="#fde9f0" stroke-width=".9"/><path d="M0 0 V16" stroke="#4b8a77" stroke-width="1.8"/></g>
      <g id="padS"><path d="M0 0 L15 -4 A15.5 15.5 0 1 0 15 4 Z" fill="url(#pad)"/>
        <path d="M0 0 L-13 -7 M0 0 L-14 5 M0 0 L-4 -14 M0 0 L-3 14 M0 0 L9 -12 M0 0 L9 12" stroke="#c7e4d6" stroke-width=".6" opacity=".7"/></g>
      <g id="jas">${[0, 72, 144, 216, 288].map((a) => `<path d="M0 0 C-2.6 -3.4 -2.3 -9 0 -11.5 C2.3 -9 2.6 -3.4 0 0Z" fill="#fffef8" stroke="#e6dcc4" stroke-width=".4" transform="rotate(${a + 18})"/>`).join('')}<circle r="1.6" fill="#f0d98a"/></g>
      <g id="mg">${Array.from({ length: 14 }, (_, i) => `<ellipse cx="0" cy="-6" rx="2.4" ry="3.6" fill="${['#f6b3c7', '#f29ab5', '#f8c4d3', '#ee8fae'][i % 4]}" transform="rotate(${i * 25.7})"/>`).join('')}<circle r="2.4" fill="#d9578a"/></g>`
  }

  /* ---------------------------------------------------------------- Pichwai cow (feet at 0,0, facing +x) */
  function cow() {
    return `<g>
      <path d="M-70 -78 C-92 -64 -90 -36 -86 -18" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M-90 -22 c-4 6 0 14 6 14 c2 -6 -1 -12 -6 -14z" fill="#f29ab5"/>
      ${[-58, -40, 38, 54].map((x) => `<rect x="${x}" y="-52" width="10" height="48" rx="4" fill="#fffaf5" stroke="#ead3da"/><rect x="${x - 1}" y="-8" width="12" height="8" rx="2" fill="url(#gold)"/>`).join('')}
      <path d="M-72 -62 C-74 -100 -40 -114 0 -112 C40 -114 68 -106 76 -82 C82 -62 72 -48 52 -46 L-52 -46 C-68 -46 -72 -52 -72 -62Z" fill="#fffaf5" stroke="#ead3da" stroke-width="1.2"/>
      <ellipse cx="-30" cy="-70" rx="20" ry="12" fill="#f8d3df" opacity=".45"/>
      <path d="M26 -110 C34 -128 54 -126 62 -106" fill="#fffaf5" stroke="#ead3da" stroke-width="1.2"/>
      <path d="M-42 -112 C-20 -118 20 -118 38 -112 L34 -70 C10 -64 -18 -64 -38 -70Z" fill="#a9c7e8" stroke="url(#gold)" stroke-width="2.4"/>
      <path d="M-36 -78 C-14 -72 12 -72 32 -78" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 4" fill="none"/>
      ${use('jas', -2, -92, 1.6)}
      <path d="M66 -102 C76 -126 102 -130 112 -114 C120 -100 118 -84 106 -76 C98 -70 84 -74 78 -86Z" fill="#fffaf5" stroke="#ead3da" stroke-width="1.2"/>
      <path d="M78 -114 C66 -126 54 -122 50 -116 C58 -110 68 -108 78 -106Z" fill="#fbdbe5" stroke="#ead3da"/>
      <path d="M90 -124 C86 -136 92 -146 102 -148 M100 -122 C102 -134 110 -140 118 -140" stroke="url(#gold)" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M94 -104 q4 3 8 0" stroke="#5b2a3c" stroke-width="1.6" fill="none"/>
      <ellipse cx="110" cy="-82" rx="5" ry="4" fill="#f6b3c7"/>
      <path d="M70 -96 C74 -80 74 -70 70 -58" stroke="url(#gold)" stroke-width="3" fill="none"/>
      <circle cx="70" cy="-54" r="6" fill="url(#gold)"/></g>`
  }

  /* ---------------------------------------------------------------- scene: two cows facing a lotus (600 x 300) */
  function cowsScene() {
    const r = rng(4)
    const o = ['<ellipse cx="300" cy="286" rx="290" ry="14" fill="#a9c7e8" opacity=".35"/>']
    for (let i = 0; i < 14; i++) o.push(use(i % 3 ? 'padS' : 'bud', 40 + i * 40 + r() * 10, 270 + r() * 16, 1.2 + r() * 0.4, r() * 40 - 20))
    o.push(`<g transform="translate(118 280) scale(1.05)">${cow()}</g>`)
    o.push(`<g transform="translate(482 280) scale(-1.05 1.05)">${cow()}</g>`)
    o.push(`<path d="M300 280 C300 240 302 210 300 190" stroke="#4b8a77" stroke-width="3" fill="none"/>`)
    o.push(use('padS', 270, 250, 1.6, -30), use('padS', 330, 255, 1.5, 200))
    o.push(use('lotus', 300, 204, 1.9, 0), use('bud', 282, 216, 1.1, -24), use('bud', 318, 216, 1.1, 24))
    return o.join('')
  }

  /* ---------------------------------------------------------------- vertical Pichwai border tile (40 x 80) */
  function borderTile() {
    return `<rect width="40" height="80" fill="#fbe3ea"/>
      <path d="M3 0 V80 M37 0 V80" stroke="url(#gold)" stroke-width="1.4"/>
      ${use('bud', 20, 34, 0.75, 0)}${use('jas', 20, 62, 0.8, 0)}
      <circle cx="9" cy="10" r="1.4" fill="#c9a24b"/><circle cx="31" cy="10" r="1.4" fill="#c9a24b"/>`
  }

  /* ---------------------------------------------------------------- toran of flowers (600 x 90) */
  function toran() {
    const o = []
    for (const [x0, x1] of [[0, 200], [200, 400], [400, 600]]) {
      const n = 12
      for (let i = 0; i <= n; i++) {
        const t = i / n
        o.push(use(i % 2 ? 'jas' : 'mg', x0 + (x1 - x0) * t, 10 + 4 * 34 * t * (1 - t), i % 2 ? 1.1 : 1.2, i * 20))
      }
    }
    for (const x of [100, 300, 500]) {
      for (let k = 0; k < 4; k++) o.push(use(k % 2 ? 'jas' : 'mg', x, 48 + k * 11, 0.9, k * 30))
      o.push(use('bud', x, 104, 0.8, 180))
    }
    return o.join('')
  }

  /* ---------------------------------------------------------------- the date lotus medallion (centred, r 120) */
  function medallion() {
    const o = []
    for (let i = 0; i < 16; i++) o.push(`<path d="M0 0 C-22 -30 -18 -92 0 -118 C18 -92 22 -30 0 0Z" fill="url(#petal)" stroke="#d9578a" stroke-width=".8" opacity=".95" transform="rotate(${i * 22.5 + 11.25})"/>`)
    for (let i = 0; i < 12; i++) o.push(`<path d="M0 0 C-16 -24 -14 -70 0 -90 C14 -70 16 -24 0 0Z" fill="url(#petalDeep)" stroke="#c94a7a" stroke-width=".6" transform="rotate(${i * 30})"/>`)
    o.push('<circle r="62" fill="#fffaf3" stroke="url(#gold)" stroke-width="3"/><circle r="55" fill="none" stroke="#e9c46a" stroke-width="1" stroke-dasharray="2 4"/>')
    return o.join('')
  }

  /* ---------------------------------------------------------------- temple bell (top of chain at 0,0) */
  function bell() {
    return `<path d="M0 0 V46" stroke="url(#gold)" stroke-width="3" stroke-dasharray="6 3"/>
      <circle cy="50" r="6" fill="none" stroke="url(#gold)" stroke-width="3"/>
      <path d="M-34 130 C-34 92 -24 62 0 58 C24 62 34 92 34 130 Z" fill="url(#bellG)"/>
      <path d="M-40 130 H40 C40 138 -40 138 -40 130Z" fill="url(#gold)"/>
      <path d="M-26 96 H26 M-30 112 H30" stroke="#8a6420" stroke-width="1.2" opacity=".6"/>
      ${use('lotus', 0, 92, 0.6, 0)}
      <g class="bell__clapper"><path d="M0 120 V138" stroke="#8a6420" stroke-width="2.4"/><circle cy="142" r="6" fill="url(#gold)"/></g>`
  }

  /* ---------------------------------------------------------------- pond with lotus pin (300 x 180) */
  function pond() {
    const r = rng(9)
    const o = ['<rect x="6" y="6" width="288" height="168" rx="84" fill="url(#water)" stroke="url(#gold)" stroke-width="3"/>']
    for (let y = 40; y < 160; y += 22) o.push(`<path d="M40 ${y} q20 -6 40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="1" opacity=".6" fill="none"/>`)
    for (let i = 0; i < 9; i++) o.push(use('padS', 40 + r() * 220, 40 + r() * 100, 1 + r() * 0.5, r() * 360))
    o.push('<circle cx="150" cy="96" r="24" class="pond__ripple" fill="none" stroke="#fff" stroke-width="2"/>')
    o.push('<circle cx="150" cy="96" r="24" class="pond__ripple pond__ripple--2" fill="none" stroke="#fff" stroke-width="2"/>')
    o.push(use('padS', 150, 100, 1.8, 30), use('lotus', 150, 98, 1.5, 0))
    return o.join('')
  }

  function koi(color = 'url(#koi)') {
    return `<path d="M0 0 C10 -10 34 -10 46 0 C34 10 10 10 0 0Z" fill="${color}"/><path d="M0 0 L-14 -9 L-10 0 L-14 9Z" fill="#f6a07a"/>
      <circle cx="38" cy="-2" r="1.6" fill="#5b2a3c"/><path d="M22 -6 l6 -8 l2 8z M22 6 l6 8 l2 -8z" fill="#f6a07a" opacity=".8"/>
      <ellipse cx="20" cy="0" rx="6" ry="3.5" fill="#f08a5d" opacity=".55"/>`
  }

  return { defs, cow, cowsScene, borderTile, toran, medallion, bell, pond, koi, use }
})()
