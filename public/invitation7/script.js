/* =============================================================================
   Our little scrapbook — a kraft envelope that bursts into a table of cards.
   Content lives in core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()

/* ---------------------------------------------------------------- vector art */
const ART = {
  defs: `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c59a"/><stop offset=".55" stop-color="#f2b8a2"/><stop offset="1" stop-color="#fbe2cf"/></linearGradient>
    <radialGradient id="sun" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff1d6"/><stop offset=".5" stop-color="#f6a46f"/><stop offset="1" stop-color="#d9805f"/></radialGradient>
    <linearGradient id="hill1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9805f"/><stop offset="1" stop-color="#b5532f"/></linearGradient>
    <linearGradient id="hill2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9b48f"/><stop offset="1" stop-color="#d9805f"/></linearGradient>`,

  plume(x, y, s, r, seed) {
    let a = seed
    const rnd = () => ((a = (a * 9301 + 49297) % 233280) / 233280)
    const parts = [`<path d="M0 0 C1.5 -20 0 -30 0 -42" stroke="#c9a77a" stroke-width="1.3" fill="none"/>`]
    for (let i = 0; i < 34; i++) {
      const t = i / 33
      const yy = -40 - t * 66
      const spread = Math.sin(Math.PI * Math.min(1, t * 1.15)) * 9 + 2
      const xx = (rnd() * 2 - 1) * spread
      parts.push(`<ellipse cx="${xx.toFixed(1)}" cy="${yy.toFixed(1)}" rx="1.8" ry="6" fill="${['#f6ead8', '#ead7b8', '#fbf3e6', '#e3c9a2'][i % 4]}" transform="rotate(${xx > 0 ? 18 : -18} ${xx.toFixed(1)} ${yy.toFixed(1)})"/>`)
    }
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">${parts.join('')}</g>`
  },

  pampas() {
    return [-24, -10, 6, 20].map((r, i) => ART.plume(60, 160, 1.3 - i * 0.05, r, i * 7 + 3)).join('')
  },

  sunset() {
    const rays = Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI - Math.PI
      return `<path d="M${150 + Math.cos(a) * 62} ${170 + Math.sin(a) * 62} L${150 + Math.cos(a) * 110} ${170 + Math.sin(a) * 110}" stroke="#fbe2cf" stroke-width="5" stroke-linecap="round" opacity=".6"/>`
    }).join('')
    return `<rect width="300" height="300" fill="url(#sky)"/>${rays}
      <circle cx="150" cy="170" r="54" fill="url(#sun)"/>
      ${[[118, '#e2a64f'], [96, '#f2b8a2'], [74, '#e9c8a8']].map(([r, c]) => `<path d="M${150 - r} 300 V${300 - r * 0.2} A${r} ${r} 0 0 1 ${150 + r} ${300 - r * 0.2} V300" fill="none" stroke="${c}" stroke-width="16" opacity=".85"/>`).join('')}
      <path d="M0 230 C60 200 110 214 150 226 C200 240 250 205 300 218 V300 H0Z" fill="url(#hill2)"/>
      <path d="M0 262 C70 240 120 256 170 262 C220 268 260 250 300 256 V300 H0Z" fill="url(#hill1)"/>
      <g fill="#5a2e20"><circle cx="138" cy="226" r="6"/><path d="M131 233 h14 l3 28 h-20z"/><circle cx="162" cy="224" r="6"/><path d="M154 231 h16 l6 30 h-28z" fill="#7a3a26"/>
      <path d="M145 242 h10" stroke="#5a2e20" stroke-width="3"/></g>
      ${ART.plume(40, 300, 1.3, -12, 11)}${ART.plume(258, 300, 1.4, 10, 17)}${ART.plume(276, 300, 1.1, 22, 23)}
      <path d="M118 130 q-6 -6 -12 0 M188 116 q-5 -5 -10 0" stroke="#7a3a26" stroke-width="2" fill="none"/>`
  },

  map() {
    return `<rect width="320" height="200" fill="#f6ead6"/>
      <path d="M0 0 H107 V200 H0Z" fill="#000" opacity=".03"/><path d="M213 0 H320 V200 H213Z" fill="#000" opacity=".05"/>
      <path d="M107 0 V200 M213 0 V200" stroke="#cdb491" stroke-width="1"/>
      <path d="M0 150 C60 120 90 170 150 140 C210 110 250 150 320 120" stroke="#a9c3d8" stroke-width="16" fill="none" opacity=".7"/>
      <path d="M30 0 C40 60 20 120 60 200 M250 0 C230 70 280 120 260 200" stroke="#e3cfae" stroke-width="7" fill="none"/>
      <path d="M0 70 H320" stroke="#e3cfae" stroke-width="5"/>
      ${[[60, 40], [180, 30], [270, 70], [90, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#c7cfae" opacity=".8"/>`).join('')}
      <path class="map__route" pathLength="1" d="M28 178 C70 150 60 110 110 100 C160 90 150 50 200 56 C230 60 236 80 238 92" stroke="#c96f4f" stroke-width="3" stroke-dasharray="1" fill="none"/>
      <g class="map__pin" transform="translate(238 92)"><path d="M0 0 C-12 -14 -14 -26 -6 -32 C-2 -35 0 -32 0 -30 C0 -32 2 -35 6 -32 C14 -26 12 -14 0 0Z" fill="#c96f4f"/></g>
      <text x="22" y="194" font-family="Caveat" font-size="15" fill="#7a3a26">you are here</text>
      <text x="196" y="40" font-family="Caveat" font-size="16" fill="#7a3a26">we’re here!</text>`
  },

  stamp() {
    const holes = []
    for (let i = 0; i <= 10; i++) holes.push(`<circle cx="${i * 10}" cy="0" r="3.4"/><circle cx="${i * 10}" cy="120" r="3.4"/>`)
    for (let i = 0; i <= 12; i++) holes.push(`<circle cx="0" cy="${i * 10}" r="3.4"/><circle cx="100" cy="${i * 10}" r="3.4"/>`)
    return `<mask id="perf"><rect width="100" height="120" fill="#fff"/><g fill="#000">${holes.join('')}</g></mask>
      <g mask="url(#perf)"><rect width="100" height="120" fill="#fbf3e6"/>
      <rect x="8" y="8" width="84" height="104" fill="url(#sky)"/><circle cx="50" cy="66" r="20" fill="url(#sun)"/>
      <path d="M8 92 C30 80 60 96 92 86 V112 H8Z" fill="url(#hill1)"/>
      <text x="50" y="26" text-anchor="middle" font-family="Jost" font-weight="600" font-size="10" fill="#7a3a26" letter-spacing="1">LOVE · ${F.year}</text></g>`
  },
}

/* ---------------------------------------------------------------- fill the cards */
function paint() {
  $('#defs').innerHTML = ART.defs
  $$('[data-art]').forEach((el) => (el.innerHTML = ART[el.dataset.art]()))
  $$('[data-art-html="ganesha"]').forEach((el) => (el.outerHTML = ganeshaSvg()))

  const dd = String(F.dayNumber).padStart(2, '0')
  const mm = String(F.month + 1).padStart(2, '0')
  const fields = {
    ...F,
    mono: `${F.monogram[0]}${F.monogram[1]}`,
    firstName: F.first.name,
    secondName: F.second.name,
    firstFull: `${F.first.name} ${F.first.surname}`,
    secondFull: `${F.second.name} ${F.second.surname}`,
    shloka: `॥ ${F.blessing} ॥`,
    flight: `KD ${dd}${mm}`,
    dateShort: `${dd} ${F.monthName.slice(0, 3).toUpperCase()} ${F.year}`,
    familyLine: F.families.map((f) => f.names[0].split(' ').slice(-1)[0]).join(' & ') + ' families',
  }
  $$('[data-field]').forEach((el) => (el.textContent = fields[el.dataset.field] ?? ''))
  $$('[data-href]').forEach((el) => {
    const href = fields[el.dataset.href]
    if (href) el.href = href
    else el.hidden = true
  })
  document.title = `${F.first.name} & ${F.second.name} — our little scrapbook`

  $('[data-list="story"]').innerHTML = F.story.map((s) => `<p>${escapeHtml(s)}</p>`).join('')
  $('[data-list="contacts"]').innerHTML = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')

  const colours = ['#c96f4f', '#e2a64f', '#a8b59a', '#f2b8a2', '#b5532f', '#d9b88f']
  $('[data-list="events"]').innerHTML = F.events
    .map((e, i) => `<div class="ticket" style="--c:${colours[i % colours.length]};--r:${((i % 2 ? 1 : -1) * (1 + (i % 3))).toFixed(1)}deg">
      <div class="ticket__main"><small>ADMIT TWO · No. ${String(i + 1).padStart(2, '0')}</small><b>${escapeHtml(e.name)}</b><span>${escapeHtml(e.short)}</span>${e.place ? `<span class="ticket__place">${escapeHtml(e.place)}</span>` : ''}${e.dress ? `<span class="ticket__place">dress: ${escapeHtml(e.dress)}</span>` : ''}</div>
      <div class="ticket__stub" aria-hidden="true"><b>${String(i + 1).padStart(2, '0')}</b></div></div>`)
    .join('')

  // the typewritten note
  const famLines = F.families.map((f) => `${f.label.toUpperCase()}\n${f.names.join('\n& ')}`).join('\n\n')
  const note = `${F.openingMessage},\n\n${famLines}\n\n${F.inviteLine} —\n${F.first.name} & ${F.second.name}.\n\n${F.familiesMessage}`
  $('#note-text').textContent = note
  $('#typed').dataset.text = note

  // barcode: random bars, seeded by the date so it never changes
  let s = F.dayNumber * 97 + F.month * 13
  const bars = []
  for (let x = 0; x < 100; ) {
    s = (s * 9301 + 49297) % 233280
    const w = 0.6 + (s / 233280) * 2.4
    bars.push(`#3a2018 ${x.toFixed(1)}% ${(x + w).toFixed(1)}%`, `transparent ${(x + w).toFixed(1)}% ${(x + w + 1.2).toFixed(1)}%`)
    x += w + 1.2
  }
  $('.barcode').style.background = `linear-gradient(90deg, ${bars.join(', ')})`
}

/* ---------------------------------------------------------------- typewriter */
function typewriter(el, fast) {
  const text = el.dataset.text
  if (fast) {
    el.textContent = text
    return () => {}
  }
  let i = 0
  let timer = 0
  el.textContent = ''
  el.classList.add('is-typing')
  const step = () => {
    i += text[i] === '\n' ? 1 : 1 + (Math.random() < 0.2 ? 1 : 0)
    el.textContent = text.slice(0, i)
    if (i < text.length) timer = setTimeout(step, text[i - 1] === '\n' ? 180 : 22 + Math.random() * 30)
    else el.classList.remove('is-typing')
  }
  timer = setTimeout(step, 300)
  return () => clearTimeout(timer)
}

/* ---------------------------------------------------------------- flip clock */
function createClock() {
  const units = Object.fromEntries($$('.flip').map((el) => [el.dataset.unit, el]))
  const last = {}
  function set(unit, value) {
    const el = units[unit]
    const v = String(value).padStart(2, '0')
    if (last[unit] === v) return
    last[unit] = v
    const card = $('.flip__card', el)
    card.classList.remove('is-flipping')
    void card.offsetWidth
    card.dataset.next = v
    card.classList.add('is-flipping')
    setTimeout(() => ($('b', card).textContent = v), 240)
  }
  return {
    tick() {
      const p = countdownParts(F.target)
      for (const k in p) set(k, p[k])
    },
  }
}

/* ---------------------------------------------------------------- dragging cards around the table */
function makeDraggable(card, onTap) {
  let sx = 0
  let sy = 0
  let ox = 0
  let oy = 0
  let moved = false
  let active = false
  card.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return
    // on touch screens the cards scroll with the page; only a mouse or pen drags them
    if (e.pointerType === 'touch') {
      sx = e.clientX
      sy = e.clientY
      active = true
      moved = false
      return
    }
    active = true
    moved = false
    sx = e.clientX
    sy = e.clientY
    ox = parseFloat(card.style.getPropertyValue('--mx')) || 0
    oy = parseFloat(card.style.getPropertyValue('--my')) || 0
    card.setPointerCapture(e.pointerId)
  })
  card.addEventListener('pointermove', (e) => {
    if (!active) return
    if (e.pointerType === 'touch') {
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 8) moved = true
      return
    }
    const dx = e.clientX - sx
    const dy = e.clientY - sy
    if (!moved && Math.hypot(dx, dy) < 6) return
    if (!moved) {
      moved = true
      card.classList.add('is-dragging')
      card.style.zIndex = String(++makeDraggable.z)
    }
    card.style.setProperty('--mx', `${ox + dx}px`)
    card.style.setProperty('--my', `${oy + dy}px`)
  })
  const end = () => {
    if (!active) return
    active = false
    card.classList.remove('is-dragging')
    if (!moved && onTap) onTap()
  }
  card.addEventListener('pointerup', end)
  card.addEventListener('pointercancel', end)
}
makeDraggable.z = 10

/* ---------------------------------------------------------------- page */
function init() {
  paint()
  const body = document.body
  const music = createMusic(F.music, $('#sound-btn'), (on) => body.classList.toggle('is-playing', on))
  const cards = $$('.card')
  const replay = $('#replay-btn')
  const clock = createClock()
  let clockTimer = 0
  let stopTyping = () => {}
  let opened = false
  let timers = []
  const later = (ms, fn) => timers.push(setTimeout(fn, ms))

  cards.forEach((c) => makeDraggable(c, c.id === 'polaroid' ? () => c.classList.toggle('is-flipped') : null))
  if (!window.matchMedia('(pointer: fine)').matches) $('.masthead__hint').textContent = 'tap the polaroid to turn it over'
  $('#polaroid').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.currentTarget.classList.toggle('is-flipped')
    }
  })

  // the note types itself out when it is first seen
  const noteIo = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting) && body.classList.contains('is-open')) {
      noteIo.disconnect()
      stopTyping = typewriter($('#typed'), reducedMotion())
    }
  }, { threshold: 0.3 })

  // cards fly out of the envelope to their places on the table
  function scatter() {
    const env = $('#open-btn').getBoundingClientRect()
    const cx = env.left + env.width / 2
    const cy = env.top + env.height / 2
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect()
      const dx = cx - (r.left + r.width / 2)
      const dy = cy - (r.top + r.height / 2)
      card.style.transition = 'none'
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${(i % 2 ? 1 : -1) * 25}deg) scale(0.2)`
      card.style.opacity = '0'
      void card.offsetWidth
      card.style.transition = `transform 1.1s cubic-bezier(0.2, 0.8, 0.25, 1.05) ${i * 0.09}s, opacity 0.4s ease ${i * 0.09}s`
      card.style.transform = ''
      card.style.opacity = ''
    })
  }

  function open() {
    if (opened) return
    opened = true
    music.start()
    const fast = reducedMotion()
    body.classList.add('is-opening')
    later(fast ? 0 : 1300, () => {
      body.classList.remove('is-sealed')
      body.classList.add('is-open')
      if (!fast) scatter()
    })
    later(fast ? 50 : 2600, () => {
      body.classList.add('is-settled')
      music.reveal()
      replay.hidden = false
      noteIo.observe($('.note'))
      clock.tick()
      clockTimer = setInterval(() => clock.tick(), 1000)
    })
  }
  $('#open-btn').addEventListener('click', open)

  replay.addEventListener('click', () => {
    timers.forEach(clearTimeout)
    timers = []
    clearInterval(clockTimer)
    stopTyping()
    noteIo.disconnect()
    replay.hidden = true
    window.scrollTo({ top: 0, behavior: 'auto' })
    cards.forEach((c) => {
      c.classList.remove('is-flipped')
      c.style.removeProperty('--mx')
      c.style.removeProperty('--my')
      c.style.zIndex = ''
    })
    $('#typed').textContent = ''
    body.classList.remove('is-open', 'is-settled', 'is-opening')
    body.classList.add('is-sealed')
    opened = false
    music.restart()
    later(900, open)
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
