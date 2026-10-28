/* =============================================================================
   Our Shaadi Story — an animated wedding film, one scene per function.
   Characters come from people.js, content from core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const P = People.draw
const SK = People.SKIN
const HC = People.HAIR
const SCENE_MS = 9500
const INTRO_MS = 8000

/* ---------------------------------------------------------------- the cast and their outfits per event */
const LOOK = {
  intro: { bride: { c1: '#f7a1b5', c2: '#fbd3dc', dupatta: '#fff0f3', hair: 'long', jewels: 1 }, groom: { c1: '#fdf6e3', c2: '#c9952c', c3: '#e8dcc4', stole: '#f7a1b5' } },
  kalash: { bride: { c1: '#ffb703', c2: '#e85d04', dupatta: '#f48c06', hair: 'bun', jewels: 1 }, groom: { c1: '#f48c06', c2: '#ffd23f', c3: '#fff7e6' } },
  mehendi: { bride: { c1: '#2e8b57', c2: '#ff5d8f', dupatta: '#ffb3c6', hair: 'braid', jewels: 1, mehendi: 1 }, groom: { c1: '#cfe8c4', c2: '#2e8b57', c3: '#f4f1e8', stole: '#ffd23f' } },
  haldi: { bride: { c1: '#ffd23f', c2: '#ffcf33', c3: '#f77f00', hair: 'braid', laugh: 1 }, groom: { c1: '#ffe066', c2: '#f77f00', c3: '#fff8e1', laugh: 1 } },
  sangeet: { bride: { c1: '#7b2cbf', c2: '#e0aaff', c3: '#f2c14e', dupatta: '#c77dff', hair: 'long', jewels: 1 }, groom: { c1: '#14213d', c2: '#e0b04a', c3: '#14213d', outfit: 'sherwani' } },
  mandap: { bride: { c1: '#b30f2e', c2: '#b30f2e', c3: '#f2c14e', veil: '#d1203f', hair: 'none', jewels: 1, mehendi: 1 }, groom: { c1: '#f6ead0', c2: '#c9952c', c3: '#f6ead0', outfit: 'sherwani', safa: '#c8102e', stole: '#c8102e' } },
  reception: { bride: { c1: '#f7c6d0', c2: '#f7c6d0', c3: '#e0b860', gown: 1, tiara: 1, hair: 'long', jewels: 1 }, groom: { c1: '#1d2b53', c2: '#c9952c', c3: '#1d2b53', outfit: 'suit' } },
}

const bride = (key, extra = {}) => ({ g: 'f', skin: SK.kirti, hairC: HC.dark, ...(LOOK[key] || LOOK.intro).bride, ...extra })
const groom = (key, extra = {}) => ({ g: 'm', skin: SK.dharmil, hairC: HC.black, ...(LOOK[key] || LOOK.intro).groom, ...extra })

// families: Koyani (bride's side) and Jarsaniya (groom's side)
const kDad = (x = {}) => ({ g: 'm', skin: SK.c, hairC: HC.grey, mustache: 1, glasses: 1, c1: '#fffaf0', c2: '#c9952c', c3: '#fffaf0', jacket: '#7b1e2b', ...x })
const kMom = (x = {}) => ({ g: 'f', skin: SK.b, hairC: HC.brown, hair: 'bun', c1: '#c1121f', c2: '#ffb703', dupatta: '#ffb703', ...x })
const jDad = (x = {}) => ({ g: 'm', skin: SK.e, hairC: HC.grey, mustache: 1, c1: '#e9f5db', c2: '#606c38', c3: '#fefae0', jacket: '#283618', ...x })
const jMom = (x = {}) => ({ g: 'f', skin: SK.a, hairC: HC.dark, hair: 'bun', c1: '#3a0ca3', c2: '#f72585', dupatta: '#f72585', ...x })
const girl = (i, c1, c2, x = {}) => ({ g: 'f', skin: [SK.a, SK.d, SK.b][i % 3], hairC: [HC.dark, HC.brown, HC.black][i % 3], hair: ['long', 'braid', 'bun'][i % 3], c1, c2, dupatta: c2, ...x })
const boy = (i, c1, c2, x = {}) => ({ g: 'm', skin: [SK.e, SK.a, SK.c][i % 3], hairC: [HC.black, HC.brown, HC.dark][i % 3], c1, c2, c3: '#fff8ee', beard: i === 2, ...x })

/* ---------------------------------------------------------------- building blocks */
// an actor: entrance on the outer div, a looping motion on the inner one
function actor(o, { x, b = 8, h = 34, enter = 'pop', loop = 'sway', d = 0, at = 0.7, z = 2, cls = '' } = {}) {
  return `<div class="actor e-${enter} ${cls}" style="--x:${x}%;--b:${b}%;--h:${h}cqh;--d:${d}s;--at:${at}s;z-index:${z}">
    <div class="act l-${loop}">${P(o)}</div></div>`
}

function petals(n, colours, cls = 'petal') {
  return Array.from({ length: n }, (_, i) => `<i class="${cls}" style="--x:${(i * (100 / n) + rand(0, 100 / n)).toFixed(1)}%;--c:${colours[i % colours.length]};--t:${rand(4.5, 8).toFixed(1)}s;--dl:${rand(0, 5).toFixed(1)}s;--sw:${rand(-12, 12).toFixed(0)}cqw;--s:${rand(1.6, 3.2).toFixed(1)}cqw"></i>`).join('')
}

function caption(e, tag, i, total) {
  return `<div class="cap">
    <p class="cap__tag">${escapeHtml(tag)}</p>
    <h2 class="cap__title">${escapeHtml(e.name)}</h2>
    <p class="cap__when">${escapeHtml(e.when)}</p>
    ${e.place ? `<p class="cap__place">📍 ${escapeHtml(e.place)}</p>` : ''}
    ${e.dress ? `<p class="cap__place">👗 Dress code · ${escapeHtml(e.dress)}</p>` : ''}
    <p class="cap__step">Celebration ${i} of ${total}</p></div>`
}

const svgBg = (inner) => `<svg class="bg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg>`

function marigoldStrand(x, y0, y1, a = '#ff9f1c', b = '#ffbf00') {
  const out = [`<path d="M${x} ${y0} V${y1}" stroke="#7a5a2a" stroke-width="1"/>`]
  for (let y = y0 + 6, k = 0; y < y1; y += 9, k++) out.push(`<circle cx="${x}" cy="${y}" r="4.4" fill="${k % 2 ? a : b}"/>`)
  return out.join('')
}

function swag(x0, x1, y, sag, a = '#ff9f1c', b = '#ffbf00') {
  const out = []
  for (let i = 0; i <= 16; i++) {
    const t = i / 16
    out.push(`<circle cx="${(x0 + (x1 - x0) * t).toFixed(1)}" cy="${(y + 4 * sag * t * (1 - t)).toFixed(1)}" r="4.6" fill="${i % 2 ? a : b}"/>`)
  }
  return out.join('')
}

/* ---------------------------------------------------------------- scenes */
const SCENES = {
  intro() {
    const bg = svgBg(`<defs><linearGradient id="iSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcad4"/><stop offset=".55" stop-color="#ffe5b4"/><stop offset="1" stop-color="#fff4e0"/></linearGradient></defs>
      <rect width="360" height="640" fill="url(#iSky)"/>
      <circle class="sun" cx="180" cy="300" r="70" fill="#ffd166" opacity=".85"/>
      <path d="M0 400 C80 340 160 380 240 350 C300 330 330 350 360 340 V640 H0Z" fill="#b9e4c9"/>
      <path d="M0 450 C90 410 180 440 260 420 C310 408 340 420 360 415 V640 H0Z" fill="#8fd3a8"/>
      ${[[40, 400, 34], [320, 390, 30], [90, 430, 24], [270, 425, 26]].map(([x, y, r]) => `<rect x="${x - 4}" y="${y}" width="8" height="${r + 10}" fill="#7a5230"/><circle cx="${x}" cy="${y - r * 0.5}" r="${r}" fill="#5fb37f"/><circle cx="${x - r * 0.4}" cy="${y - r * 0.2}" r="${r * 0.7}" fill="#76c893"/>${[0, 1, 2, 3].map((k) => `<circle cx="${x - r * 0.6 + k * r * 0.4}" cy="${y - r * 0.6 + (k % 2) * 10}" r="3.4" fill="#ff8fab"/>`).join('')}`).join('')}
      <path d="M150 640 C160 560 170 520 180 470 C190 520 200 560 210 640Z" fill="#f8e7c9"/>
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${12 + i * 26}" cy="${598 + (i % 3) * 10}" r="5" fill="${['#ff8fab', '#ffd166', '#fff', '#c77dff'][i % 4]}"/>`).join('')}`)
    return {
      key: 'intro',
      ms: INTRO_MS,
      label: 'How it began',
      html: `${bg}
        <div class="heart" aria-hidden="true">❤</div>
        <div class="introtext"><p class="introtext__pre">${escapeHtml(F.openingMessage)}</p>
          <h2 class="introtext__names">${escapeHtml(F.first.name)} <em>&amp;</em> ${escapeHtml(F.second.name)}</h2>
          <p class="introtext__sub">are getting married · ${escapeHtml(F.dateLong)}</p></div>
        ${actor(groom('intro', { pose: 'holdR' }), { x: 41, b: 9, h: 40, enter: 'walkL', loop: 'none', cls: 'reach' })}
        ${actor(bride('intro', { pose: 'holdL' }), { x: 59, b: 9, h: 38, enter: 'walkR', loop: 'none', cls: 'reach' })}
        <div class="fx">${petals(10, ['#ff8fab', '#ffd6e0', '#fff'])}</div>`,
    }
  },

  kalash(e) {
    const bg = svgBg(`<defs><radialGradient id="kG" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#ffe0a3"/><stop offset=".6" stop-color="#ff9e57"/><stop offset="1" stop-color="#c8553d"/></radialGradient></defs>
      <rect width="360" height="640" fill="url(#kG)"/>
      <path d="M40 640 V300 C40 200 120 150 180 150 C240 150 320 200 320 300 V640" fill="#8c2f39" opacity=".25"/>
      <path d="M70 640 V310 C70 230 130 190 180 190 C230 190 290 230 290 310 V640" fill="none" stroke="#ffd166" stroke-width="5"/>
      ${swag(0, 180, 30, 40, '#ff9f1c', '#ffd23f')}${swag(180, 360, 30, 40, '#ff9f1c', '#ffd23f')}
      ${[20, 340].map((x) => marigoldStrand(x, 30, 260)).join('')}
      ${[100, 260].map((x) => `<g class="bell" style="transform-origin:${x}px 30px"><path d="M${x} 30 V110" stroke="#a87a1e" stroke-width="2"/><path d="M${x - 14} 140 C${x - 14} 116 ${x + 14} 116 ${x + 14} 140Z" fill="#e3b341"/><circle cx="${x}" cy="143" r="3.4" fill="#a87a1e"/></g>`).join('')}
      <rect x="0" y="540" width="360" height="100" fill="#7b2d26"/><path d="M0 540 H360" stroke="#ffd166" stroke-width="3"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${20 + i * 64} 560 l10 -10 l10 10 l-10 10z" fill="#ffd166" opacity=".5"/>`).join('')}`)
    return {
      key: 'kalash',
      label: e.name,
      html: `${bg}
        <div class="idol"><div class="idol__aura"></div><div class="idol__disc">${ganeshaSvg('idol__g')}</div>
          <div class="altar"><span class="diya"></span><span class="diya"></span><span class="diya"></span></div></div>
        ${caption(e, 'Seeking Bappa’s blessings', e._n, e._total)}
        ${actor(kMom({ pose: 'namaste' }), { x: 12, b: 13, h: 30, d: 0.3, z: 1 })}
        ${actor(kDad({ pose: 'aarti', props: { r: 'plate' } }), { x: 27, b: 11, h: 33, d: 0.5, z: 1, cls: 'aarti' })}
        ${actor(jDad({ pose: 'namasteM' }), { x: 73, b: 11, h: 33, d: 0.6, z: 1 })}
        ${actor(jMom({ pose: 'aarti', props: { r: 'plate' } }), { x: 88, b: 13, h: 30, d: 0.4, z: 1, cls: 'aarti' })}
        ${actor(bride('kalash', { pose: 'namaste' }), { x: 41, b: 7, h: 34, d: 1, z: 3 })}
        ${actor(groom('kalash', { pose: 'namasteM' }), { x: 59, b: 7, h: 36, d: 1.1, z: 3 })}
        <div class="fx">${petals(14, ['#ff9f1c', '#ffd23f', '#e85d04', '#fff'])}</div>`,
    }
  },

  mehendi(e) {
    const umbrellas = [[40, 50, '#ff5d8f'], [120, 30, '#ffd23f'], [200, 45, '#2ec4b6'], [280, 28, '#ff9f1c'], [340, 52, '#c77dff']]
      .map(([x, y, c]) => `<g class="umb" style="transform-origin:${x}px ${y - 40}px"><path d="M${x} ${y - 40} V${y}" stroke="#7a5a2a"/><path d="M${x - 26} ${y} A26 18 0 0 1 ${x + 26} ${y}Z" fill="${c}"/>${[-20, -10, 0, 10, 20].map((k) => `<circle cx="${x + k}" cy="${y + 2}" r="2.4" fill="#fff"/>`).join('')}</g>`).join('')
    const bg = svgBg(`<defs><linearGradient id="mG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3ec"/><stop offset=".6" stop-color="#e8f7e4"/><stop offset="1" stop-color="#c7ebd0"/></linearGradient></defs>
      <rect width="360" height="640" fill="url(#mG)"/>${umbrellas}
      ${[60, 160, 250].map((x) => marigoldStrand(x, 80, 200, '#2e8b57', '#ffd23f')).join('')}
      <rect x="0" y="520" width="360" height="120" fill="#f3d9b1"/>
      <path d="M10 560 H350 V630 H10Z" fill="#e85d75" opacity=".25"/><path d="M20 570 H340 V620 H20Z" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="6 6"/>`)
    const hand = `<svg viewBox="0 0 100 120" aria-hidden="true"><path d="M30 118 V70 C30 60 26 40 26 30 C26 24 34 24 35 30 L38 58 L38 14 C38 7 47 7 47 14 L48 54 L50 8 C50 1 59 1 59 8 L58 54 L62 14 C62 7 71 8 70 15 L67 60 L74 42 C76 36 84 38 82 45 L72 82 C68 96 66 104 66 118Z" fill="#eab894"/>
      <g class="henna" fill="none" stroke="#8a3a17" stroke-width="1.6" stroke-linecap="round">
      <path pathLength="1" d="M48 92 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0"/><path pathLength="1" d="M48 92 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0"/>
      <path pathLength="1" d="M36 92 C30 86 30 78 36 74 M60 92 C66 86 66 78 60 74 M48 80 V60"/>
      <path pathLength="1" d="M42 20 h0 M53 14 h0 M64 20 h0 M33 34 h0"/>
      <path pathLength="1" d="M40 46 C44 42 52 42 56 46 C52 50 44 50 40 46Z M45 30 C47 27 51 27 53 30"/>
      <path pathLength="1" d="M34 108 C42 102 54 102 62 108"/></g></svg>`
    return {
      key: 'mehendi',
      label: e.name,
      html: `${bg}
        ${caption(e, 'Henna, giggles & dholki', e._n, e._total)}
        <div class="bubble">${hand}<span>the bride’s mehendi</span></div>
        ${actor(kMom({ pose: 'clap', c1: '#2a9d8f', dupatta: '#e9c46a', c2: '#e76f51' }), { x: 10, b: 20, h: 25, d: 0.4, loop: 'sway', at: 0.3, z: 1 })}
        ${actor(jMom({ pose: 'clap', c1: '#e76f51', c2: '#2a9d8f', dupatta: '#2a9d8f' }), { x: 90, b: 20, h: 25, d: 0.6, loop: 'sway', at: 0.3, z: 1 })}
        <div class="swing"><svg class="swing__frame" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0 V170 M80 0 V170" stroke="#2e8b57" stroke-width="2.4"/>${[20, 80].map((x) => Array.from({ length: 9 }, (_, k) => `<circle cx="${x}" cy="${10 + k * 18}" r="3.4" fill="${k % 2 ? '#ffd23f' : '#ff5d8f'}"/>`).join('')).join('')}<rect x="8" y="168" width="84" height="8" rx="3" fill="#a0522d"/></svg>
          ${actor(bride('mehendi', { sit: 1, pose: 'offerL' }), { x: 50, b: -1, h: 64, enter: 'none', loop: 'none' })}</div>
        ${actor(girl(0, '#f72585', '#ffd6e0', { pose: 'offerL', props: { l: 'cone' } }), { x: 8, b: 6, h: 29, d: 0.8, z: 3, loop: 'sway' })}
        ${actor(girl(1, '#ffb703', '#2e8b57', { pose: 'offerR', props: { r: 'cone' } }), { x: 46, b: 6, h: 29, d: 1, z: 4, loop: 'sway' })}
        ${actor(groom('mehendi', { pose: 'bhangra' }), { x: 67, b: 8, h: 35, d: 1.4, z: 3, loop: 'dance', at: 0.45 })}
        ${actor(boy(0, '#ffd23f', '#2e8b57', { pose: 'bhangra' }), { x: 84, b: 9, h: 32, d: 1.6, z: 2, loop: 'dance', at: 0.5 })}
        ${actor(boy(1, '#90e0ef', '#0077b6', { pose: 'dance' }), { x: 93, b: 4, h: 30, d: 1.8, z: 4, loop: 'dance', at: 0.42 })}
        <div class="fx">${petals(12, ['#2e8b57', '#70c18c', '#ff5d8f', '#ffd23f'], 'leaf')}</div>`,
    }
  },

  haldi(e) {
    const bg = svgBg(`<defs><radialGradient id="hG" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#fff3b0"/><stop offset=".6" stop-color="#ffd23f"/><stop offset="1" stop-color="#f4a261"/></radialGradient></defs>
      <rect width="360" height="640" fill="url(#hG)"/>
      ${Array.from({ length: 9 }, (_, i) => marigoldStrand(14 + i * 41, 0, 230 + (i % 2) * 40, '#f77f00', '#ffbf00')).join('')}
      <path d="M-20 640 C10 500 0 420 30 380 C40 460 50 560 40 640Z M380 640 C350 500 360 420 330 380 C320 460 310 560 320 640Z" fill="#40916c"/>
      <path d="M-10 640 C20 520 30 470 60 430 C50 520 50 590 50 640Z M370 640 C340 520 330 470 300 430 C310 520 310 590 310 640Z" fill="#52b788"/>
      <rect x="0" y="545" width="360" height="95" fill="#e9c46a"/>
      <rect x="100" y="512" width="72" height="16" rx="4" fill="#9c6644"/><rect x="106" y="528" width="8" height="20" fill="#7f5539"/><rect x="158" y="528" width="8" height="20" fill="#7f5539"/>
      <rect x="190" y="512" width="72" height="16" rx="4" fill="#9c6644"/><rect x="196" y="528" width="8" height="20" fill="#7f5539"/><rect x="248" y="528" width="8" height="20" fill="#7f5539"/>`)
    const puffs = [[40, 50], [60, 52], [40, 46], [60, 48]].map(([x, y], i) => `<i class="puff" style="--x:${x}%;--y:${y}%;--dl:${1.6 + i * 1.7}s"></i>`).join('')
    return {
      key: 'haldi',
      label: e.name,
      html: `${bg}
        ${caption(e, 'A splash of sunshine', e._n, e._total)}
        ${actor(bride('haldi', { sit: 1, pose: 'lap' }), { x: 38, b: 14, h: 30, d: 0.3, loop: 'giggle', z: 2 })}
        ${actor(groom('haldi', { sit: 1, pose: 'lap' }), { x: 62, b: 14, h: 32, d: 0.4, loop: 'giggle', z: 2 })}
        ${actor(kMom({ c1: '#ffd23f', c2: '#f77f00', dupatta: '#f77f00', pose: 'offerR', props: { r: 'bowl' } }), { x: 15, b: 8, h: 32, d: 0.8, z: 3, cls: 'apply-r' })}
        ${actor(girl(2, '#ffe066', '#e76f51', { pose: 'clap', laugh: 1 }), { x: 26, b: 3, h: 28, d: 1.2, z: 4, loop: 'bounce', at: 0.3 })}
        ${actor(boy(0, '#fff3b0', '#f77f00', { pose: 'clapM', laugh: 1 }), { x: 75, b: 3, h: 30, d: 1.3, z: 4, loop: 'bounce', at: 0.3 })}
        ${actor(jDad({ c1: '#fff8e1', jacket: '#f4a261', pose: 'offerL', props: { l: 'bowl' } }), { x: 86, b: 8, h: 34, d: 0.9, z: 3, cls: 'apply-l' })}
        <div class="fx">${puffs}${petals(18, ['#f77f00', '#ffbf00', '#ffd23f', '#fff'])}</div>`,
    }
  },

  sangeet(e) {
    const tiles = Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, c) => `<rect class="tile" style="--i:${(r + c) % 5}" x="${c * 40}" y="${520 + r * 20}" width="39" height="19" fill="${['#ff006e', '#8338ec', '#3a86ff', '#ffbe0b', '#fb5607'][(r * 2 + c) % 5]}"/>`).join('')).join('')
    const bg = svgBg(`<defs><radialGradient id="sG" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#5a189a"/><stop offset=".6" stop-color="#240046"/><stop offset="1" stop-color="#10002b"/></radialGradient></defs>
      <rect width="360" height="640" fill="url(#sG)"/>
      ${Array.from({ length: 40 }, (_, i) => `<circle class="twinkle" style="--i:${i % 7}" cx="${(i * 97) % 360}" cy="${(i * 53) % 300}" r="1.4" fill="#fff"/>`).join('')}
      <path d="M0 500 H360 V520 H0Z" fill="#3c096c"/>${tiles}`)
    const notes = Array.from({ length: 8 }, (_, i) => `<i class="note" style="--x:${8 + i * 12}%;--dl:${(i * 0.7).toFixed(1)}s">${i % 2 ? '♪' : '♫'}</i>`).join('')
    return {
      key: 'sangeet',
      label: e.name,
      html: `${bg}
        <div class="spot spot--l" aria-hidden="true"></div><div class="spot spot--r" aria-hidden="true"></div>
        <div class="disco" aria-hidden="true"></div>
        ${caption(e, 'Let the music play', e._n, e._total)}
        ${actor(boy(2, '#ffbe0b', '#fb5607', { pose: 'drum', dhol: 1 }), { x: 12, b: 11, h: 31, d: 0.4, loop: 'bounce', at: 0.18, z: 2 })}
        ${actor(girl(1, '#3a86ff', '#ff006e', { pose: 'dance' }), { x: 28, b: 15, h: 28, d: 0.7, loop: 'dance', at: 0.4, z: 1 })}
        ${actor(boy(1, '#ff006e', '#ffbe0b', { pose: 'waveBoth' }), { x: 73, b: 15, h: 30, d: 0.8, loop: 'dance', at: 0.45, z: 1 })}
        ${actor(girl(0, '#ffbe0b', '#8338ec', { pose: 'dance', props: { l: 'dandiya', r: 'dandiya' } }), { x: 88, b: 11, h: 29, d: 0.5, loop: 'dance', at: 0.38, z: 2 })}
        ${actor(groom('sangeet', { pose: 'holdR' }), { x: 43, b: 7, h: 37, d: 1, loop: 'dance', at: 0.6, z: 3 })}
        ${actor(bride('sangeet', { pose: 'waveBoth' }), { x: 58, b: 7, h: 35, d: 1.1, loop: 'twirl', at: 0.6, z: 3 })}
        <div class="fx">${notes}</div>`,
    }
  },

  mandap(e) {
    const bg = svgBg(`<defs><radialGradient id="wG" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#9d0208"/><stop offset=".6" stop-color="#6a040f"/><stop offset="1" stop-color="#370617"/></radialGradient>
        <linearGradient id="wGold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a87a1e"/><stop offset=".5" stop-color="#f6d77a"/><stop offset="1" stop-color="#a87a1e"/></linearGradient></defs>
      <rect width="360" height="640" fill="url(#wG)"/>
      ${Array.from({ length: 30 }, (_, i) => `<circle class="twinkle" style="--i:${i % 7}" cx="${(i * 71) % 360}" cy="${(i * 37) % 220}" r="1.3" fill="#ffe9a8"/>`).join('')}
      <path d="M20 250 C60 200 120 180 180 180 C240 180 300 200 340 250 Z" fill="#c1121f"/>
      <path d="M20 250 C60 210 120 192 180 192 C240 192 300 210 340 250" fill="none" stroke="url(#wGold)" stroke-width="5"/>
      ${Array.from({ length: 15 }, (_, i) => `<path d="M${24 + i * 22} 250 q11 14 22 0" fill="#ffd166"/>`).join('')}
      ${[40, 320].map((x) => `<rect x="${x - 7}" y="250" width="14" height="300" fill="url(#wGold)"/><path d="M${x} 250 C${x + (x < 180 ? 40 : -40)} 300 ${x + (x < 180 ? 30 : -30)} 380 ${x + (x < 180 ? 8 : -8)} 420" fill="none" stroke="#e85d75" stroke-width="14" opacity=".8"/>`).join('')}
      ${[70, 110, 250, 290].map((x) => marigoldStrand(x, 252, 330, '#fff', '#ff9f1c')).join('')}
      <rect x="0" y="550" width="360" height="90" fill="#4a0e0e"/>
      ${Array.from({ length: 6 }, (_, i) => `<path d="M${30 + i * 60} 590 m-12 0 a12 6 0 1 0 24 0 a12 6 0 1 0 -24 0" fill="none" stroke="#ffd166" stroke-width="1.5" opacity=".6"/>`).join('')}`)
    return {
      key: 'mandap',
      label: e.name,
      html: `${bg}
        ${caption(e, 'Seven steps, forever', e._n, e._total)}
        ${actor({ g: 'm', skin: SK.c, hairC: HC.grey, bald: 1, tilak: 1, c1: '#f77f00', c2: '#ffd23f', c3: '#fff', sit: 1, pose: 'namasteM' }, { x: 22, b: 15, h: 26, d: 0.2, loop: 'sway', z: 1 })}
        <div class="kund" aria-hidden="true"><span class="flame"></span><span class="flame flame--2"></span><span class="flame flame--3"></span></div>
        <div class="phera">
          ${actor(groom('mandap', { pose: 'holdR' }), { x: 30, b: 0, h: 100, enter: 'none', loop: 'walkcycle', z: 1 })}
          ${actor(bride('mandap', { pose: 'holdL' }), { x: 70, b: 0, h: 95, enter: 'none', loop: 'walkcycle', z: 1 })}
          <svg class="knot" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="M30 6 C45 30 55 30 70 6" stroke="#ffd166" stroke-width="3" fill="none"/></svg>
        </div>
        <p class="pheracount"><span>Phera</span> <b class="pheracount__n"></b> <span>of 7</span></p>
        ${actor(kDad({ pose: 'clapM' }), { x: 8, b: 4, h: 32, d: 0.6, z: 5 })}
        ${actor(kMom({ pose: 'clap', c1: '#9d0208', dupatta: '#ffd23f' }), { x: 20, b: 2, h: 29, d: 0.7, z: 5 })}
        ${actor(jMom({ pose: 'clap', c1: '#ffb703', c2: '#9d0208', dupatta: '#9d0208' }), { x: 80, b: 2, h: 29, d: 0.8, z: 5 })}
        ${actor(jDad({ pose: 'clapM' }), { x: 92, b: 4, h: 32, d: 0.9, z: 5 })}
        <div class="fx">${petals(22, ['#ff4d6d', '#ffd166', '#fff', '#ff8fa3'])}</div>`,
    }
  },

  reception(e) {
    const bulbs = (y, sag, c) => Array.from({ length: 13 }, (_, i) => { const t = i / 12; return `<circle class="twinkle" style="--i:${i % 5}" cx="${(t * 360).toFixed(1)}" cy="${(y + 4 * sag * t * (1 - t)).toFixed(1)}" r="3" fill="${c}"/>` }).join('')
    const bg = svgBg(`<defs><linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b132b"/><stop offset=".6" stop-color="#3a0ca3"/><stop offset="1" stop-color="#7209b7"/></linearGradient></defs>
      <rect width="360" height="640" fill="url(#rG)"/>
      <path d="M0 40 Q180 120 360 40" stroke="#f1e3b5" stroke-width=".8" fill="none"/>${bulbs(40, 80, '#ffe9a8')}
      <path d="M0 90 Q180 170 360 90" stroke="#f1e3b5" stroke-width=".8" fill="none"/>${bulbs(90, 80, '#ffc8dd')}
      <path d="M60 520 V330 C60 250 120 220 180 220 C240 220 300 250 300 330 V520" fill="none" stroke="#ffc8dd" stroke-width="14" opacity=".9"/>
      ${Array.from({ length: 22 }, (_, i) => { const a = Math.PI - (i / 21) * Math.PI; return `<circle cx="${(180 + Math.cos(a) * 120).toFixed(1)}" cy="${(330 - Math.sin(a) * 110).toFixed(1)}" r="${7 + (i % 3)}" fill="${['#ff8fab', '#fff', '#ffc8dd'][i % 3]}"/>` }).join('')}
      <rect x="0" y="520" width="360" height="120" fill="#240046"/><path d="M0 520 H360" stroke="#e0b860" stroke-width="2"/>`)
    const fireworks = [[20, 18, '#ffbe0b'], [78, 14, '#ff006e'], [50, 9, '#3a86ff'], [32, 24, '#c77dff']].map(([x, y, c], i) => `<i class="fw" style="--x:${x}%;--y:${y}%;--c:${c};--dl:${(0.6 + i * 1.3).toFixed(1)}s">${Array.from({ length: 12 }, (_, k) => `<b style="--a:${k * 30}deg"></b>`).join('')}</i>`).join('')
    return {
      key: 'reception',
      label: e.name,
      html: `${bg}<div class="fx fx--back">${fireworks}</div>
        <p class="neon" aria-hidden="true">${escapeHtml(F.monogram[1])} ♥ ${escapeHtml(F.monogram[0])}</p>
        ${caption(e, 'Raise a toast', e._n, e._total)}
        <div class="cake" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
        ${actor(boy(1, '#2b2d42', '#e0b860', { outfit: 'suit', c3: '#2b2d42', pose: 'toast', props: { r: 'glass' } }), { x: 11, b: 6, h: 32, d: 0.5, z: 3 })}
        ${actor(girl(2, '#ffafcc', '#ffafcc', { gown: 1, pose: 'toast', props: { r: 'glass' } }), { x: 25, b: 9, h: 29, d: 0.7, z: 2 })}
        ${actor(groom('reception', { pose: 'holdR' }), { x: 47, b: 8, h: 37, d: 1, loop: 'sway', z: 3 })}
        ${actor(bride('reception', { pose: 'holdL' }), { x: 61, b: 8, h: 35, d: 1.1, loop: 'sway', z: 3 })}
        ${actor(jDad({ c1: '#1d3557', c3: '#1d3557', outfit: 'suit', jacket: null, pose: 'toast', props: { r: 'glass' } }), { x: 89, b: 6, h: 32, d: 0.6, z: 3 })}`,
    }
  },

  generic(e) {
    const bg = svgBg(`<rect width="360" height="640" fill="#ffe5ec"/><rect x="0" y="520" width="360" height="120" fill="#ffc2d1"/>`)
    return {
      key: 'generic',
      label: e.name,
      html: `${bg}${caption(e, 'Celebrate with us', e._n, e._total)}
        ${actor(groom('intro', { pose: 'wave' }), { x: 40, b: 8, h: 38, d: 0.4 })}
        ${actor(bride('intro', { pose: 'wave' }), { x: 60, b: 8, h: 36, d: 0.5 })}
        <div class="fx">${petals(16, ['#ff8fab', '#ffd166', '#fff'])}</div>`,
    }
  },

  finale() {
    const contacts = F.contacts
      .map((c) => {
        const tel = String(c.phone || '').replace(/[^\d+]/g, '')
        return `<span>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</span>`
      })
      .join('')
    const fams = F.families.map((f) => `<p><small>${escapeHtml(f.label)}</small>${f.names.map(escapeHtml).join(' & ')}</p>`).join('')
    const bg = svgBg(`<defs><linearGradient id="fG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffafcc"/><stop offset=".5" stop-color="#ffd6a5"/><stop offset="1" stop-color="#fdffb6"/></linearGradient></defs>
      <rect width="360" height="640" fill="url(#fG)"/>
      <path d="M0 470 C90 430 270 430 360 470 V640 H0Z" fill="#caffbf"/>
      ${swag(0, 180, 10, 30, '#ff8fab', '#fff')}${swag(180, 360, 10, 30, '#ff8fab', '#fff')}`)
    return {
      key: 'finale',
      ms: 0,
      label: 'See you there!',
      html: `${bg}
        <div class="final">
          ${ganeshaSvg('final__g')}
          <p class="final__pre">With the blessings of our families</p>
          <h2 class="final__names">${escapeHtml(F.first.name)} <em>&amp;</em> ${escapeHtml(F.second.name)}</h2>
          <p class="final__date">${escapeHtml(F.dateFull)} · ${escapeHtml(F.timeLabel)}</p>
          <p class="final__venue">${escapeHtml(F.venue)}, ${escapeHtml(F.city)}</p>
          <dl class="final__count"><div><dd data-c="days">0</dd><dt>days</dt></div><div><dd data-c="hours">0</dd><dt>hrs</dt></div><div><dd data-c="minutes">0</dd><dt>min</dt></div><div><dd data-c="seconds">0</dd><dt>sec</dt></div></dl>
          <div class="final__fams">${fams}</div>
          <div class="final__btns">
            ${F.rsvpHref ? `<a class="btn" href="${F.rsvpHref}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : ''}
            <a class="btn btn--ghost" href="${calendarHref(F)}" target="_blank" rel="noopener">Save the date</a>
            <a class="btn btn--ghost" href="${F.mapHref}" target="_blank" rel="noopener">Directions</a>
          </div>
          <p class="final__by">Kindly reply by ${escapeHtml(F.rsvpByLong)}</p>
          <p class="final__contacts">${contacts}</p>
          <p class="final__closing">${escapeHtml(F.closingMessage)}</p>
        </div>
        ${actor(kMom({ pose: 'waveBoth' }), { x: 8, b: 2, h: 22, d: 0.5, loop: 'sway', z: 2 })}
        ${actor(kDad({ pose: 'wave' }), { x: 20, b: 1, h: 24, d: 0.6, loop: 'sway', z: 2 })}
        ${actor(groom('mandap', { pose: 'holdR' }), { x: 42, b: 1, h: 27, d: 0.3, loop: 'sway', z: 3 })}
        ${actor(bride('mandap', { pose: 'holdL' }), { x: 58, b: 1, h: 26, d: 0.35, loop: 'sway', z: 3 })}
        ${actor(jDad({ pose: 'wave' }), { x: 80, b: 1, h: 24, d: 0.7, loop: 'sway', z: 2 })}
        ${actor(jMom({ pose: 'waveBoth' }), { x: 92, b: 2, h: 22, d: 0.8, loop: 'sway', z: 2 })}
        <div class="fx">${petals(12, ['#ff8fab', '#fff', '#ffd166'])}</div>`,
    }
  },
}

/* ---------------------------------------------------------------- build the film */
function buildFilm() {
  const events = F.events.map((e, i) => ({ ...e, _n: i + 1, _total: F.events.length }))
  const list = [SCENES.intro(), ...events.map((e) => (SCENES[e.icon] || SCENES.generic)(e)), SCENES.finale()]
  $('#film').innerHTML = list.map((s, i) => `<section class="scene scene--${s.key}" data-i="${i}" aria-label="${escapeHtml(s.label)}" aria-hidden="true">${s.html}</section>`).join('')
  $('#bars').innerHTML = list.map(() => '<span><i></i></span>').join('')
  return list.map((s) => ({ ms: s.ms ?? SCENE_MS, label: s.label }))
}

/* ---------------------------------------------------------------- player */
function init() {
  const stage = $('#stage')
  const meta = buildFilm()
  const scenes = $$('.scene')
  const fills = $$('#bars i')
  const label = $('#label')
  const pauseBtn = $('#pause-btn')
  const music = createMusic(F.music, $('#sound-btn'))
  let index = -1
  let t0 = 0
  let elapsed = 0
  let paused = false
  let raf = 0
  let started = false
  let pheraTimer = 0

  $('#cover-names').textContent = `${F.first.name} & ${F.second.name}`
  $('#cover-date').textContent = F.dateLong
  // the couple wait on the poster, a little apart
  $('.cover').insertAdjacentHTML('beforeend',
    actor(groom('intro', { pose: 'wave' }), { x: 24, b: 4, h: 36, enter: 'none', loop: 'none' }) +
    actor(bride('intro', { pose: 'wave' }), { x: 76, b: 4, h: 34, enter: 'none', loop: 'none' }))

  function paintBars() {
    fills.forEach((f, n) => {
      const ms = meta[index]?.ms
      const k = n < index ? 1 : n > index ? 0 : ms ? Math.min(1, elapsed / ms) : 1
      f.style.transform = `scaleX(${k})`
    })
  }

  function tick(t) {
    if (!paused) elapsed = t - t0
    paintBars()
    const ms = meta[index].ms
    if (ms && elapsed >= ms) return go(index + 1)
    raf = requestAnimationFrame(tick)
  }

  function go(n) {
    n = Math.max(0, Math.min(scenes.length - 1, n))
    cancelAnimationFrame(raf)
    clearInterval(pheraTimer)
    const prev = scenes[index]
    scenes.forEach((s) => s.classList.remove('is-prev'))
    if (prev && prev !== scenes[n]) {
      prev.classList.remove('is-active')
      prev.classList.add('is-prev')
      prev.setAttribute('aria-hidden', 'true')
    }
    index = n
    const el = scenes[n]
    el.classList.remove('is-active')
    void el.offsetWidth
    el.classList.add('is-active')
    el.setAttribute('aria-hidden', 'false')
    label.textContent = meta[n].label
    stage.classList.toggle('is-last', n === scenes.length - 1)
    // count the pheras
    const counter = $('.pheracount__n', el)
    if (counter) {
      let k = 1
      counter.textContent = '1'
      pheraTimer = setInterval(() => (counter.textContent = String(Math.min(7, ++k))), reducedMotion() ? 99999 : 3000)
    }
    elapsed = 0
    t0 = performance.now()
    setPaused(false)
    raf = requestAnimationFrame(tick)
  }

  function setPaused(on) {
    if (on === paused) return
    paused = on
    stage.classList.toggle('is-paused', on)
    pauseBtn.setAttribute('aria-label', on ? 'Play' : 'Pause')
    pauseBtn.classList.toggle('is-paused', on)
    if (!on) t0 = performance.now() - elapsed
  }

  function begin() {
    if (started) return
    started = true
    music.start()
    music.reveal()
    stage.classList.add('is-started')
    go(0)
  }

  $('#play-btn').addEventListener('click', begin)
  $('#next-btn').addEventListener('click', () => go(index + 1))
  $('#prev-btn').addEventListener('click', () => go(index - 1))
  pauseBtn.addEventListener('click', () => setPaused(!paused))
  $('#replay-btn').addEventListener('click', () => {
    music.restart()
    go(0)
  })
  document.addEventListener('keydown', (e) => {
    if (!started) return
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
    if (e.key === ' ') {
      e.preventDefault()
      setPaused(!paused)
    }
  })

  function paintCount() {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }
  paintCount()
  setInterval(paintCount, 1000)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
