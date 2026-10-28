/* =============================================================================
   Laser-cut paper art for the pop-up card. Every piece is an SVG silhouette
   with holes cut through it (masks), so each layer reads as cut card stock.
   ========================================================================== */

'use strict'

const Paper = (() => {
  let uid = 0
  const id = (p) => `${p}${++uid}`

  // fill + holes → a cut-paper piece
  function cut(vb, solid, holes, fill, stroke = 'rgba(0,0,0,.18)') {
    const m = id('m')
    return `<svg viewBox="${vb}" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><mask id="${m}"><rect x="-999" y="-999" width="3000" height="3000" fill="#fff"/><g fill="#000">${holes}</g></mask></defs>
      <g mask="url(#${m})" fill="${fill}" stroke="${stroke}" stroke-width=".6">${solid}</g></svg>`
  }

  const dots = (pts, r) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')
  const arch = (x, y, w, h) => `<path d="M${x} ${y} V${y - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y - h + w / 2} V${y}Z"/>`
  const onion = (cx, base, w, h) => `<path d="M${cx - w / 2} ${base} C${cx - w / 2} ${base - h * 0.45} ${cx - w * 0.15} ${base - h * 0.7} ${cx} ${base - h} C${cx + w * 0.15} ${base - h * 0.7} ${cx + w / 2} ${base - h * 0.45} ${cx + w / 2} ${base}Z"/><path d="M${cx} ${base - h} V${base - h - 10}" stroke-width="2"/>`

  /* ---------------------------------------------------------------- palace skyline (300 x 200) */
  function palace(fill) {
    const solid = `<rect x="20" y="112" width="260" height="88"/>${onion(150, 112, 84, 70)}
      <rect x="40" y="78" width="40" height="122"/>${onion(60, 78, 34, 30)}
      <rect x="220" y="78" width="40" height="122"/>${onion(240, 78, 34, 30)}
      <rect x="6" y="60" width="12" height="140"/>${onion(12, 60, 14, 18)}<rect x="282" y="60" width="12" height="140"/>${onion(288, 60, 14, 18)}
      ${[96, 204].map((x) => `<rect x="${x - 10}" y="96" width="20" height="16"/>${onion(x, 96, 20, 16)}`).join('')}
      ${Array.from({ length: 27 }, (_, i) => `<rect x="${20 + i * 10}" y="106" width="6" height="7"/>`).join('')}`
    const holes = `${Array.from({ length: 7 }, (_, i) => arch(34 + i * 34, 196, 22, 46)).join('')}
      ${[48, 228].map((x) => arch(x + 6, 132, 12, 26)).join('')}${[48, 228].map((x) => arch(x + 6, 170, 12, 22)).join('')}
      ${arch(141, 104, 18, 30)}
      ${dots(Array.from({ length: 12 }, (_, i) => [26 + i * 22.5, 124]), 2.4)}`
    return cut('0 0 300 200', solid, holes, fill)
  }

  /* ---------------------------------------------------------------- elephant (120 x 90), facing right */
  function elephant(fill, cloth) {
    const body = `<path d="M14 60 C8 40 20 22 42 20 C52 19 60 21 66 26 C70 16 84 12 92 20 C98 26 96 36 100 44 C103 50 108 50 110 42 L115 44 C113 58 100 62 95 53 C93 50 91 47 90 45 C88 51 86 55 84 57 L84 84 L74 84 L73 64 L52 64 L50 84 L40 84 L39 64 L28 64 L26 84 L16 84 L15 66 C14 64 14 62 14 60Z"/>
      <path d="M14 58 C7 60 5 68 8 74" fill="none" stroke="${fill}" stroke-width="2.4"/>`
    const holes = `<circle cx="88" cy="30" r="1.8"/><path d="M76 24 C70 30 70 42 78 46 C74 38 74 30 76 24Z"/>`
    const blanket = `<path d="M34 24 C46 21 58 22 66 28 L68 50 C56 56 40 56 30 50Z" fill="${cloth}"/>`
    const bh = id('m')
    return `<svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><mask id="${bh}"><rect width="120" height="90" fill="#fff"/><g fill="#000">${holes}</g></mask>
      <mask id="${bh}b"><rect width="120" height="90" fill="#fff"/><g fill="#000">${dots([[40, 32], [48, 30], [56, 32], [44, 42], [52, 42], [60, 40], [40, 50], [56, 50]], 1.8)}</g></mask></defs>
      <g mask="url(#${bh})" fill="${fill}" stroke="rgba(0,0,0,.18)" stroke-width=".6">${body}</g>
      <g mask="url(#${bh}b)">${blanket}</g>
      <path d="M94 50 C98 56 104 56 104 52" fill="none" stroke="#fffaf0" stroke-width="2"/>
      <path d="M62 20 L66 10 L72 20" fill="${cloth}"/></svg>`
  }

  /* ---------------------------------------------------------------- the couple (120 x 160) */
  function couple(fill, dance = false) {
    const groomArm = dance
      ? '<path d="M54 44 C60 34 64 20 66 10 L70 12 C68 24 64 38 58 48Z"/>'
      : '<path d="M54 44 C60 56 64 66 66 74 L62 76 C58 68 54 58 52 50Z"/>'
    const brideArm = dance
      ? '<path d="M72 44 C70 32 68 20 67 10 L71 9 C73 20 76 32 77 44Z"/>'
      : '<path d="M71 46 C68 56 66 66 64 74 L68 76 C70 68 73 58 75 50Z"/>'
    const skirt = dance ? 'M72 66 C60 100 46 128 40 156 L112 156 C106 128 94 100 84 66Z' : 'M72 66 C66 100 58 130 54 156 L104 156 C100 130 92 100 84 66Z'
    const solid = `<circle cx="44" cy="28" r="9"/><path d="M34 27 C34 11 54 11 54 27 C50 20 38 20 34 27Z"/><path d="M48 15 C51 6 57 3 56 10" fill="none" stroke="${fill}" stroke-width="2"/>
      <rect x="41" y="36" width="6" height="6"/>
      <path d="M33 41 C30 70 29 100 28 112 L60 112 C59 100 58 70 55 41 C50 38 38 38 33 41Z"/>
      <path d="M34 112 L36 152 L42 152 L44 116 L46 152 L52 152 L54 112Z"/>
      <path d="M33 44 C29 60 28 76 29 90 L33 90 C33 76 34 62 36 50Z"/>${groomArm}
      <circle cx="78" cy="32" r="8"/><circle cx="86" cy="30" r="4.6"/>
      <path d="M69 31 C68 17 89 17 88 31 C84 23 73 23 69 31Z"/>
      <path d="M70 30 C63 52 60 92 60 156 L68 156 C67 112 70 72 76 42Z"/>
      <path d="M71 42 C70 52 71 62 72 66 L84 66 C85 62 86 52 85 42 C81 39 75 39 71 42Z"/>
      <path d="${skirt}"/>${brideArm}`
    const holes = `${dots(Array.from({ length: 14 }, (_, i) => [70 + (i % 5) * 7 - Math.floor(i / 5) * 3, 104 + Math.floor(i / 5) * 16]), 1.6)}
      ${dots([[44, 56], [44, 66], [44, 76], [44, 86], [44, 96]], 1.2)}`
    return cut('0 0 120 160', solid, holes, fill)
  }

  /* ---------------------------------------------------------------- mandap (200 x 200) */
  function mandap(fill) {
    const solid = `<path d="M8 74 C8 30 60 8 100 8 C140 8 192 30 192 74Z"/><rect x="2" y="70" width="196" height="8"/>
      <rect x="16" y="78" width="12" height="114"/><rect x="172" y="78" width="12" height="114"/>
      <rect x="0" y="190" width="200" height="10"/>${onion(100, 12, 18, 16)}
      <path d="M28 80 C50 120 60 140 58 186 L64 186 C66 140 56 110 40 80Z M172 80 C150 120 140 140 142 186 L136 186 C134 140 144 110 160 80Z"/>`
    const holes = `${Array.from({ length: 9 }, (_, i) => arch(30 + i * 16, 60, 10, 22)).join('')}${dots(Array.from({ length: 10 }, (_, i) => [22, 90 + i * 10]).concat(Array.from({ length: 10 }, (_, i) => [178, 90 + i * 10])), 2)}`
    return cut('0 0 200 200', solid, holes, fill)
  }

  /* ---------------------------------------------------------------- an arched frame with lace edge (200 x 220) */
  function archFrame(fill) {
    const solid = `<rect x="0" y="0" width="200" height="220"/>`
    const holes = `<path d="M30 220 V96 C30 50 62 26 100 26 C138 26 170 50 170 96 V220Z"/>
      ${Array.from({ length: 22 }, (_, i) => { const a = Math.PI + (i / 21) * Math.PI; return `<circle cx="${(100 + Math.cos(a) * 82).toFixed(1)}" cy="${(96 + Math.sin(a) * 80).toFixed(1)}" r="3"/>` }).join('')}
      ${dots(Array.from({ length: 12 }, (_, i) => [14, 30 + i * 16]).concat(Array.from({ length: 12 }, (_, i) => [186, 30 + i * 16])), 3)}`
    return cut('0 0 200 220', solid, holes, fill)
  }

  /* ---------------------------------------------------------------- flowers border (300 x 90) */
  function florals(fill, petal, leaf) {
    const out = []
    for (let i = 0; i < 9; i++) {
      const x = 16 + i * 34
      const y = 60 - (i % 2) * 14
      out.push(`<path d="M${x} 90 C${x + 4} 76 ${x - 2} ${y + 10} ${x} ${y}" stroke="${leaf}" stroke-width="2.4" fill="none"/>`)
      out.push(`<ellipse cx="${x - 10}" cy="${y + 18}" rx="9" ry="4" fill="${leaf}" transform="rotate(-30 ${x - 10} ${y + 18})"/><ellipse cx="${x + 10}" cy="${y + 22}" rx="9" ry="4" fill="${leaf}" transform="rotate(30 ${x + 10} ${y + 22})"/>`)
      out.push(Array.from({ length: 6 }, (_, k) => `<ellipse cx="${x}" cy="${y - 8}" rx="5.4" ry="9" fill="${k % 2 ? fill : petal}" transform="rotate(${k * 60} ${x} ${y})"/>`).join(''))
      out.push(`<circle cx="${x}" cy="${y}" r="4" fill="#e3b341"/>`)
    }
    return `<svg viewBox="0 0 300 90" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${out.join('')}</svg>`
  }

  /* ---------------------------------------------------------------- marigold curtain (300 x 200) */
  function marigolds(a, b) {
    const out = []
    for (let s = 0; s < 13; s++) {
      const x = 10 + s * 23.3
      const len = 120 + ((s * 37) % 60)
      out.push(`<path d="M${x} 0 V${len}" stroke="#7a5a2a" stroke-width="1"/>`)
      for (let y = 8, k = 0; y < len; y += 11, k++) out.push(`<circle cx="${x}" cy="${y}" r="5.4" fill="${k % 2 ? a : b}"/>`)
      out.push(`<path d="M${x - 4} ${len + 2} L${x} ${len + 14} L${x + 4} ${len + 2}Z" fill="#2e7d32"/>`)
    }
    return `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${out.join('')}</svg>`
  }

  /* ---------------------------------------------------------------- henna hands (200 x 130) */
  function hands(fill, ink) {
    const hand = 'M60 128 V88 C60 78 52 58 50 48 C49 42 56 40 58 46 L64 68 L62 28 C62 21 71 21 71 28 L72 64 L74 22 C74 15 83 15 83 22 L82 64 L86 30 C86 23 95 24 94 31 L90 74 L96 58 C98 52 106 54 104 60 L94 94 C90 108 88 116 88 128Z'
    const henna = `<g fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"><circle cx="76" cy="98" r="10"/><circle cx="76" cy="98" r="4.6"/><path d="M66 98 C60 90 62 82 68 80 M86 98 C92 90 90 82 84 80 M76 86 V70"/><path d="M66 36 h0 M78 28 h0 M90 36 h0"/><path d="M64 120 C70 114 82 114 88 120"/></g>`
    return `<svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g transform="translate(-6 0)"><path d="${hand}" fill="${fill}" stroke="rgba(0,0,0,.18)"/>${henna}</g>
      <g transform="translate(206 0) scale(-1 1)"><path d="${hand}" fill="${fill}" stroke="rgba(0,0,0,.18)"/>${henna}</g>
      <path d="M100 20 C94 10 82 14 86 24 L100 38 L114 24 C118 14 106 10 100 20Z" fill="#e85d75"/></svg>`
  }

  /* ---------------------------------------------------------------- swing with the bride (140 x 200) */
  function swing(fill, rope) {
    return `<svg viewBox="0 0 140 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <path d="M20 0 V150 M120 0 V150" stroke="${rope}" stroke-width="2.4"/>
      ${[20, 120].map((x) => Array.from({ length: 8 }, (_, k) => `<circle cx="${x}" cy="${8 + k * 18}" r="4" fill="${k % 2 ? '#ffd23f' : '#ff5d8f'}"/>`).join('')).join('')}
      <rect x="10" y="148" width="120" height="8" rx="3" fill="#8d5524"/>
      <g fill="${fill}" stroke="rgba(0,0,0,.18)" stroke-width=".6"><circle cx="70" cy="96" r="8"/><circle cx="78" cy="94" r="4.4"/>
      <path d="M63 106 C62 116 63 124 64 128 L76 128 C77 124 78 116 77 106 C73 103 67 103 63 106Z"/>
      <path d="M64 128 C50 132 38 142 36 150 L104 150 C102 142 90 132 76 128Z"/>
      <path d="M63 110 C58 116 56 122 58 128 L62 127 C61 122 63 116 66 113Z"/><path d="M77 110 C82 116 84 122 82 128 L78 127 C79 122 77 116 74 113Z"/></g></svg>`
  }

  /* ---------------------------------------------------------------- kalash + diyas (240 x 120) */
  function kalashRow(fill) {
    const kalash = (x, s) => `<g transform="translate(${x} 120) scale(${s})"><path d="M-22 0 C-30 -20 -26 -44 0 -48 C26 -44 30 -20 22 0Z" fill="${fill}" stroke="rgba(0,0,0,.2)"/><path d="M-12 -48 H12 L10 -56 H-10Z" fill="${fill}"/>
      <path d="M-14 -56 C-18 -66 -8 -70 -6 -62 M14 -56 C18 -66 8 -70 6 -62 M0 -58 C-4 -70 4 -70 0 -58" stroke="#2e7d32" stroke-width="4" fill="none"/><circle cy="-72" r="8" fill="#a0522d"/>
      <path d="M-20 -24 H20" stroke="#c1121f" stroke-width="3"/></g>`
    const diya = (x) => `<g transform="translate(${x} 120)"><path d="M-12 -2 C-10 -10 10 -10 12 -2Z" fill="#c9952c"/><path class="pf" d="M0 -10 C-4 -16 -2 -22 0 -26 C2 -22 4 -16 0 -10Z" fill="#ffb02e"/></g>`
    return `<svg viewBox="0 0 240 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${diya(18)}${diya(54)}${kalash(120, 1.3)}${diya(186)}${diya(222)}</svg>`
  }

  /* ---------------------------------------------------------------- dhol + notes (240 x 110) */
  function dhol(fill) {
    return `<svg viewBox="0 0 240 110" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g transform="translate(120 70)"><rect x="-52" y="-30" width="104" height="60" rx="26" fill="${fill}" stroke="rgba(0,0,0,.2)"/>
      <path d="M-36 -30 L-16 30 M-12 -30 L8 30 M12 -30 L32 30 M-20 30 L0 -30 M4 30 L24 -30" stroke="#ffd23f" stroke-width="2"/>
      <ellipse cx="-52" rx="9" ry="28" fill="#f5e6c8"/><ellipse cx="52" rx="9" ry="28" fill="#f5e6c8"/></g>
      <text class="pn" x="28" y="40" font-size="30" fill="#ffd23f">♪</text><text class="pn pn--2" x="196" y="34" font-size="34" fill="#ff8fab">♫</text></svg>`
  }

  /* ---------------------------------------------------------------- chandelier + fireworks (300 x 160) */
  function chandelier(fill) {
    const burst = (x, y, r, c) => Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<path d="M${x + Math.cos(a) * r * 0.3} ${y + Math.sin(a) * r * 0.3} L${(x + Math.cos(a) * r).toFixed(1)} ${(y + Math.sin(a) * r).toFixed(1)}" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>` }).join('')
    return `<svg viewBox="0 0 300 160" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <g class="fwk">${burst(46, 50, 34, '#ffd166')}${burst(254, 44, 30, '#ff8fab')}${burst(150, 26, 22, '#bde0fe')}</g>
      <g transform="translate(150 0)" fill="${fill}"><path d="M0 0 V40" stroke="${fill}" stroke-width="2"/>
      <path d="M-46 60 C-40 46 40 46 46 60 C30 66 -30 66 -46 60Z"/><path d="M-30 86 C-26 74 26 74 30 86 C18 92 -18 92 -30 86Z"/>
      ${[-40, -26, -12, 0, 12, 26, 40].map((x) => `<path d="M${x} 62 V76" stroke="${fill}" stroke-width="1.4"/><path d="M${x} 76 l-3 6 l3 6 l3 -6z"/>`).join('')}
      ${[-20, 0, 20].map((x) => `<path d="M${x} 88 V104" stroke="${fill}" stroke-width="1.4"/><path d="M${x} 104 l-3 7 l3 7 l3 -7z"/>`).join('')}
      <circle cx="0" cy="40" r="6"/></g></svg>`
  }

  return { palace, elephant, couple, mandap, archFrame, florals, marigolds, hands, swing, kalashRow, dhol, chandelier }
})()
