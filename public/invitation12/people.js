/* =============================================================================
   People — illustrated characters drawn as SVG.
   Front-facing, feet at (0, 0), about 170 units tall. Arms rotate at the
   shoulder from CSS (--a1 → --a2), so poses and dances are pure CSS.
   ========================================================================== */

'use strict'

const People = (() => {
  const SKIN = { kirti: '#eab894', dharmil: '#d49a74', a: '#f1c7a6', b: '#e3a983', c: '#c98e6a', d: '#f3d2b8', e: '#d9a07a' }
  const HAIR = { dark: '#2b1a12', brown: '#3d2416', grey: '#b9b4ad', black: '#1b120d' }

  // arm poses: [left a1, left a2], [right a1, right a2] in degrees.
  // Positive rotates a hand outward on the left arm and inward on the right arm.
  const POSES = {
    idle: { l: [7, 7], r: [-7, -7] },
    sway: { l: [5, 12], r: [-5, -12] },
    namaste: { l: [-23, -23], r: [23, 23] },
    namasteM: { l: [-27, -27], r: [27, 27] },
    clap: { l: [-14, -26], r: [14, 26] },
    clapM: { l: [-18, -30], r: [18, 30] },
    dance: { l: [150, 118], r: [-150, -118] },
    bhangra: { l: [165, 135], r: [-95, -125] },
    wave: { l: [7, 7], r: [-150, -118] },
    waveBoth: { l: [150, 120], r: [-150, -120] },
    offerR: { l: [7, 7], r: [-48, -40] },
    offerL: { l: [48, 40], r: [-7, -7] },
    aarti: { l: [-24, -24], r: [-40, -24] },
    drum: { l: [-28, -10], r: [28, 10] },
    holdR: { l: [7, 10], r: [-32, -32] },
    holdL: { l: [32, 32], r: [-7, -10] },
    toast: { l: [7, 7], r: [-120, -105] },
    lap: { l: [-30, -30], r: [30, 30] },
  }

  const f = (n) => +n.toFixed(1)

  /* ---------------------------------------------------------------- props held in a hand at (x, y) */
  function prop(kind, x, y) {
    switch (kind) {
      case 'cone':
        return `<path d="M${x - 2} ${y - 2} L${x + 9} ${y - 12} L${x + 5} ${y + 2}Z" fill="#5d3a1a"/><path d="M${x + 7} ${y - 11} l3 -3" stroke="#3d7a3a" stroke-width="2"/>`
      case 'plate':
        return `<ellipse cx="${x}" cy="${y - 2}" rx="11" ry="3.4" fill="#e3b341" stroke="#a87a1e" stroke-width=".8"/>
          <g class="flicker" style="transform-origin:${x}px ${y - 4}px"><path d="M${x} ${y - 14} C${x - 4} ${y - 8} ${x - 3} ${y - 4} ${x} ${y - 3} C${x + 3} ${y - 4} ${x + 4} ${y - 8} ${x} ${y - 14}Z" fill="#ffb02e"/><path d="M${x} ${y - 10} C${x - 1.5} ${y - 7} ${x - 1} ${y - 4.5} ${x} ${y - 4} C${x + 1} ${y - 4.5} ${x + 1.5} ${y - 7} ${x} ${y - 10}Z" fill="#fff3b0"/></g>
          <circle cx="${x - 6}" cy="${y - 3.5}" r="1.4" fill="#e85d75"/><circle cx="${x + 6}" cy="${y - 3.5}" r="1.4" fill="#f9a03f"/>`
      case 'bowl':
        return `<ellipse cx="${x}" cy="${y - 1}" rx="8" ry="4" fill="#b8741a"/><ellipse cx="${x}" cy="${y - 2.4}" rx="6.6" ry="2.2" fill="#ffd23f"/>`
      case 'sparkler':
        return `<path d="M${x} ${y} L${x} ${y - 30}" stroke="#8a8a8a" stroke-width="1.4"/><g class="spark" style="transform-origin:${x}px ${y - 31}px"><path d="M${x} ${y - 39} L${x + 2} ${y - 33} L${x + 8} ${y - 31} L${x + 2} ${y - 29} L${x} ${y - 23} L${x - 2} ${y - 29} L${x - 8} ${y - 31} L${x - 2} ${y - 33}Z" fill="#fff3b0"/></g>`
      case 'dandiya':
        return `<path d="M${x - 2} ${y + 3} L${x + 6} ${y - 24}" stroke="#d9452b" stroke-width="2.6" stroke-linecap="round"/><path d="M${x + 1} ${y - 6} l2 -6" stroke="#ffd23f" stroke-width="2.6"/>`
      case 'glass':
        return `<path d="M${x - 3} ${y - 16} L${x + 3} ${y - 16} L${x + 2} ${y - 6} L${x - 2} ${y - 6}Z" fill="#ffe9a8" opacity=".9" stroke="#fff" stroke-width=".6"/><path d="M${x} ${y - 6} V${y}" stroke="#fff" stroke-width="1"/>`
      case 'flowers':
        return `<circle cx="${x}" cy="${y - 6}" r="4" fill="#f45b69"/><circle cx="${x + 4}" cy="${y - 3}" r="3.4" fill="#ffb703"/><circle cx="${x - 4}" cy="${y - 3}" r="3.4" fill="#ff8fab"/>`
      case 'mic':
        return `<rect x="${x - 1.5}" y="${y - 14}" width="3" height="12" rx="1" fill="#222"/><circle cx="${x}" cy="${y - 15}" r="3.2" fill="#555"/>`
      default:
        return ''
    }
  }

  /* ---------------------------------------------------------------- an arm, shoulder at (sx, sy) */
  function arm(o, side, sx, sy, len, w, sleeveColor, sleeveLen, isF) {
    const [a1, a2] = (o.pose[side] || [0, 0]).map((a) => (side === 'l' ? a : a))
    const x = side === 'l' ? -sx : sx
    const hand = sy + len
    const bangles = isF ? `<rect x="${x - w / 2 - 0.4}" y="${hand - 9}" width="${w + 0.8}" height="1.6" fill="${o.c3}"/><rect x="${x - w / 2 - 0.4}" y="${hand - 6.6}" width="${w + 0.8}" height="1.6" fill="#e85d75"/>` : ''
    const mehendi = o.mehendi ? `<circle cx="${x}" cy="${hand}" r="${w * 0.62}" fill="#9a4a24" opacity=".55"/>` : ''
    return `<g class="arm arm--${side}" style="--a1:${a1}deg;--a2:${a2}deg;transform-origin:${x}px ${sy}px">
      <rect x="${x - w / 2}" y="${sy - 2}" width="${w}" height="${len}" rx="${w / 2}" fill="${o.skin}"/>
      <rect x="${x - w / 2 - 0.5}" y="${sy - 3}" width="${w + 1}" height="${sleeveLen}" rx="${w / 2}" fill="${sleeveColor}"/>
      ${bangles}
      <circle cx="${x}" cy="${hand}" r="${w * 0.62}" fill="${o.skin}"/>${mehendi}
      ${prop(o.props?.[side], x, hand)}
    </g>`
  }

  function face(o, cy) {
    const big = o.laugh
    return `<g class="face">
      <ellipse class="eye" cx="-5" cy="${cy - 1}" rx="1.6" ry="${big ? 1 : 2.1}" fill="#2b1a12"/>
      <ellipse class="eye" cx="5" cy="${cy - 1}" rx="1.6" ry="${big ? 1 : 2.1}" fill="#2b1a12"/>
      <path d="M-6.6 ${cy - 5.6} q1.6 -1.4 3.2 0 M3.4 ${cy - 5.6} q1.6 -1.4 3.2 0" stroke="${o.hairC}" stroke-width="1" fill="none" stroke-linecap="round"/>
      ${big
        ? `<path d="M-4.6 ${cy + 5} Q0 ${cy + 10.5} 4.6 ${cy + 5}Z" fill="#8a2b2b"/>`
        : `<path d="M-4.4 ${cy + 5.6} Q0 ${cy + 9} 4.4 ${cy + 5.6}" stroke="#8a3b2a" stroke-width="1.3" fill="none" stroke-linecap="round"/>`}
      <circle cx="-8.4" cy="${cy + 3.4}" r="2.6" fill="#ff8a8a" opacity=".35"/><circle cx="8.4" cy="${cy + 3.4}" r="2.6" fill="#ff8a8a" opacity=".35"/>
    </g>`
  }

  /* ---------------------------------------------------------------- women */
  function female(o) {
    const { c1, c2, c3, skin, hairC } = o
    const back = []
    const body = []
    const front = []
    if (o.veil) back.push(`<path d="M-15 -154 C-27 -126 -29 -100 -27 -72 L27 -72 C29 -100 27 -126 15 -154Z" fill="${o.veil}" opacity=".9"/>`)
    if (o.hair === 'long') back.push(`<path d="M-14 -150 C-22 -124 -21 -104 -15 -94 L15 -94 C21 -104 22 -124 14 -150Z" fill="${hairC}"/>`)
    if (o.hair === 'bun') back.push(`<circle cx="0" cy="-161" r="8.5" fill="${hairC}"/><path d="M-8 -164 A9 9 0 0 1 8 -164" stroke="#fff" stroke-width="2.4" stroke-dasharray="1 2" fill="none"/>`)

    if (o.sit) {
      body.push(`<path class="skirt" d="M-12 -84 C-28 -72 -46 -46 -46 -30 L46 -30 C46 -46 28 -72 12 -84Z" fill="${c1}"/>
        <path d="M-46 -30 L46 -30 L45 -37 L-45 -37Z" fill="${c3}"/>`)
    } else {
      const motifs = [-60, -40, -20].map((y, i) => [-1, 0, 1].map((k) => `<circle cx="${f(k * (10 + i * 6))}" cy="${y}" r="1.4" fill="${c3}" opacity=".9"/>`).join('')).join('')
      body.push(`<g class="skirt" style="transform-origin:0px -84px"><path d="M-12 -84 C-20 -60 -34 -24 -39 0 L39 0 C34 -24 20 -60 12 -84Z" fill="${c1}"/>
        <path d="M-6 -84 L-14 0 M6 -84 L14 0 M0 -84 V0" stroke="#000" stroke-opacity=".07" stroke-width="2"/>
        ${motifs}<path d="M-39 0 L39 0 L37.5 -8 L-37.5 -8Z" fill="${c3}"/>
        ${o.gown ? '' : `<path d="M-37.5 -8 L37.5 -8" stroke="${c2}" stroke-width="1.4" stroke-dasharray="2 3"/>`}</g>`)
    }
    body.push(`<path d="M-15 -121 C-16 -108 -14 -94 -12 -84 L12 -84 C14 -94 16 -108 15 -121 C9 -125 -9 -125 -15 -121Z" fill="${c2}"/>
      <rect x="-12.6" y="-87" width="25.2" height="3.2" rx="1" fill="${c3}"/>`)
    if (o.dupatta) body.push(`<path d="M-15 -121 C-4 -108 8 -96 15 -86 L20 ${o.sit ? -34 : -22} L28 ${o.sit ? -38 : -26} L22 -92 C16 -106 4 -118 -8 -125Z" fill="${o.dupatta}" opacity=".88" stroke="${c3}" stroke-width="1"/>`)
    body.push(`<rect x="-4" y="-134" width="8" height="12" fill="${skin}"/>`)
    if (o.jewels) body.push(`<path d="M-8 -124 Q0 -114 8 -124" stroke="${c3}" stroke-width="2.4" fill="none"/><circle cx="0" cy="-117" r="2.2" fill="#e85d75"/>`)
    body.push(`<ellipse cx="0" cy="-145" rx="13" ry="15" fill="${skin}"/>`)
    body.push(`<path d="M-13.6 -146 C-15 -164 15 -164 13.6 -146 C11 -156 3 -158 0 -154 C-3 -158 -11 -156 -13.6 -146Z" fill="${hairC}"/>`)
    body.push(face(o, -145))
    body.push(`<circle cx="0" cy="-152" r="1.3" fill="#d62828"/><circle cx="-13" cy="-139" r="2" fill="${c3}"/><circle cx="13" cy="-139" r="2" fill="${c3}"/>`)
    if (o.jewels) body.push(`<path d="M0 -161 V-155" stroke="${c3}" stroke-width="1"/><circle cx="0" cy="-154.6" r="1.8" fill="${c3}"/><circle cx="3.6" cy="-140" r="1.6" fill="none" stroke="${c3}" stroke-width=".9"/>`)
    if (o.hair === 'braid') front.push(`<path d="M10 -151 C18 -132 17 -112 13 -94" stroke="${hairC}" stroke-width="6.5" fill="none" stroke-linecap="round"/><path d="M11 -140 C16 -126 16 -112 13 -100" stroke="#fff" stroke-width="2" stroke-dasharray="1 3" fill="none"/>`)
    if (o.veil) front.push(`<path d="M-15.5 -150 C-16 -169 16 -169 15.5 -150 C11 -162 -11 -162 -15.5 -150Z" fill="${o.veil}" stroke="${c3}" stroke-width="1.2"/>`)
    if (o.tiara) front.push(`<path d="M-9 -158 L-5 -165 L0 -160 L5 -165 L9 -158" stroke="${c3}" stroke-width="1.6" fill="none"/>`)
    const arms = arm(o, 'l', 17, -119, 43, 6, c2, 10, true) + arm(o, 'r', 17, -119, 43, 6, c2, 10, true)
    return back.join('') + body.join('') + front.join('') + arms
  }

  /* ---------------------------------------------------------------- men */
  function male(o) {
    const { c1, c2, c3, skin, hairC } = o
    const out = []
    const shoe = o.shoe || '#4a2c1a'
    if (o.sit) {
      out.push(`<ellipse cx="0" cy="-40" rx="30" ry="9" fill="${c3}"/><ellipse cx="-20" cy="-36" rx="7" ry="4" fill="${shoe}"/><ellipse cx="20" cy="-36" rx="7" ry="4" fill="${shoe}"/>`)
    } else {
      for (const s of [-1, 1]) {
        out.push(`<g class="leg leg--${s < 0 ? 'l' : 'r'}" style="transform-origin:${s * 6}px -62px"><rect x="${s < 0 ? -10.5 : 2.5}" y="-64" width="8" height="60" rx="3.5" fill="${c3}"/><ellipse cx="${s * 7}" cy="-3" rx="6.4" ry="3.2" fill="${shoe}"/></g>`)
      }
    }
    const hem = o.outfit === 'sherwani' ? -28 : o.outfit === 'suit' ? -64 : o.sit ? -44 : -50
    if (o.outfit === 'suit') {
      out.push(`<rect x="-10.5" y="-70" width="21" height="10" fill="${c1}"/>`)
      out.push(`<path d="M-20 -122 C-22 -100 -22 -82 -21 ${hem} L21 ${hem} C22 -82 22 -100 20 -122 C12 -128 -12 -128 -20 -122Z" fill="${c1}"/>
        <path d="M-7 -125 L0 -104 L7 -125Z" fill="#fff"/><path d="M-4 -122 L0 -119 L4 -122 L4 -118 L0 -120 L-4 -118Z" fill="${c2}"/>
        <path d="M-9 -125 L-3 -104 L-8 -100 L-12 -112Z M9 -125 L3 -104 L8 -100 L12 -112Z" fill="#000" opacity=".22"/>
        <circle cx="0" cy="-96" r="1.3" fill="${c2}"/><circle cx="0" cy="-88" r="1.3" fill="${c2}"/><path d="M11 -112 l5 -1 l-1 4z" fill="#f6c3cf"/>`)
    } else {
      out.push(`<path d="M-20 -122 C-22 -100 -23 -70 -24 ${hem} L24 ${hem} C23 -70 22 -100 20 -122 C12 -128 -12 -128 -20 -122Z" fill="${c1}"/>
        <path d="M-24 ${hem} L24 ${hem} L23.8 ${hem - 4} L-23.8 ${hem - 4}Z" fill="${c2}"/>
        <path d="M0 -125 V${o.outfit === 'sherwani' ? hem : -96}" stroke="${c2}" stroke-width="1.2"/>
        ${[0, 1, 2, 3].map((k) => `<circle cx="1.6" cy="${-118 + k * 7}" r="1.1" fill="${c2}"/>`).join('')}`)
      if (o.outfit === 'sherwani') out.push(`<path d="M-8 -126 L8 -126 L8 -121 L-8 -121Z" fill="${c2}"/>`)
    }
    if (o.jacket) out.push(`<path d="M-17 -121 L-6 -98 L-6 -76 L-18 -76 Z M17 -121 L6 -98 L6 -76 L18 -76Z" fill="${o.jacket}"/>`)
    if (o.stole) out.push(`<path d="M-20 -121 C-8 -106 6 -92 18 -80 L22 -40 L28 -44 L24 -88 C16 -104 2 -118 -10 -126Z" fill="${o.stole}" opacity=".92" stroke="${c2}" stroke-width=".8"/>`)
    if (o.dhol) out.push(`<g class="dhol"><rect x="-26" y="-98" width="52" height="24" rx="11" fill="#c8102e"/><path d="M-18 -98 L-10 -74 M-6 -98 L2 -74 M6 -98 L14 -74 M-14 -74 L-6 -98 M-2 -74 L6 -98 M10 -74 L18 -98" stroke="#ffd23f" stroke-width="1"/><ellipse cx="-26" cy="-86" rx="4" ry="12" fill="#f5e6c8"/><ellipse cx="26" cy="-86" rx="4" ry="12" fill="#f5e6c8"/></g>`)
    out.push(`<rect x="-4.5" y="-134" width="9" height="11" fill="${skin}"/>`)
    out.push(`<ellipse cx="0" cy="-147" rx="14" ry="16" fill="${skin}"/>`)
    if (o.safa) {
      out.push(`<path d="M-16.5 -151 C-19 -175 19 -175 16.5 -151 C10 -158 -10 -158 -16.5 -151Z" fill="${o.safa}"/>
        <path d="M-15 -160 C-6 -166 6 -166 15 -160 M-14 -166 C-5 -171 5 -171 14 -166" stroke="#000" stroke-opacity=".15" stroke-width="1.6" fill="none"/>
        <circle cx="0" cy="-163" r="3" fill="${c2}"/><path d="M1 -166 C4 -178 10 -184 8 -172" stroke="${c2}" stroke-width="1.8" fill="none"/>
        <path d="M14 -154 C24 -150 26 -136 22 -126" stroke="${o.safa}" stroke-width="5" fill="none" stroke-linecap="round"/>`)
    } else if (o.bald) {
      out.push(`<path d="M-14 -144 C-15 -150 -13 -152 -12 -152 M14 -144 C15 -150 13 -152 12 -152" stroke="${hairC}" stroke-width="3" fill="none"/>`)
    } else {
      out.push(`<path d="M-14.4 -149 C-16 -168 16 -168 14.4 -149 C12 -157 4 -160 -2 -156 C-8 -158 -12 -156 -14.4 -149Z" fill="${hairC}"/>`)
    }
    out.push(face(o, -147))
    if (o.tilak) out.push(`<path d="M0 -160 V-153" stroke="#d62828" stroke-width="1.6"/>`)
    if (o.mustache) out.push(`<path d="M-6 -140 Q0 -143 6 -140 Q0 -138.5 -6 -140Z" fill="${hairC}"/>`)
    if (o.beard) out.push(`<path d="M-13 -146 C-13 -132 -6 -128 0 -128 C6 -128 13 -132 13 -146 C10 -136 -10 -136 -13 -146Z" fill="${hairC}" opacity=".85"/>`)
    if (o.glasses) out.push(`<circle cx="-5.4" cy="-148" r="4" fill="none" stroke="#333" stroke-width="1"/><circle cx="5.4" cy="-148" r="4" fill="none" stroke="#333" stroke-width="1"/><path d="M-1.4 -148 H1.4" stroke="#333" stroke-width="1"/>`)
    const sleeve = o.outfit === 'suit' ? c1 : c1
    return out.join('') + arm(o, 'l', 21, -121, 46, 8, sleeve, 42, false) + arm(o, 'r', 21, -121, 46, 8, sleeve, 42, false)
  }

  /* ---------------------------------------------------------------- public: one character as an <svg> */
  function draw(o) {
    const opts = {
      c3: '#e9c46a',
      hairC: HAIR.dark,
      skin: SKIN.a,
      hair: 'long',
      ...o,
      pose: POSES[o.pose || 'idle'] || o.pose,
    }
    const inner = opts.g === 'm' ? male(opts) : female(opts)
    return `<svg class="person" viewBox="-62 -208 124 212" aria-hidden="true">${inner}</svg>`
  }

  return { draw, SKIN, HAIR, POSES }
})()
