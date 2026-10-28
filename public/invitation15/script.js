/* =============================================================================
   The Acrylic Card — clear acrylic with gold foil and pressed flowers.
   Drag to turn it, tap to flip; the celebrations fan out as a deck of tinted
   acrylic cards. Wording comes from core.js.
   ========================================================================== */

'use strict'

const F = buildFields()
const TINTS = { kalash: '#ffb36b', mehendi: '#7fd1a7', haldi: '#ffd84d', sangeet: '#b79cff', mandap: '#ff6b81', reception: '#8fb8ff' }

/* ---------------------------------------------------------------- pressed flowers inside the acrylic */
function flowers(seed) {
  let s = seed
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  const out = []
  const sprig = (x, y, rot, len, col) => {
    out.push(`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 C4 -${len * 0.4} -2 -${len * 0.7} 2 -${len}" stroke="#9fb89a" stroke-width="1" fill="none" opacity=".8"/>`)
    for (let k = 0; k < 7; k++) {
      const t = k / 6
      out.push(`<circle cx="${(Math.sin(k * 2) * 6).toFixed(1)}" cy="${(-len * t).toFixed(1)}" r="${(2.4 - t).toFixed(1)}" fill="${col}" opacity=".9"/>`)
    }
    out.push('</g>')
  }
  const rose = (x, y, sc, col) => out.push(`<g transform="translate(${x} ${y}) scale(${sc})">${Array.from({ length: 8 }, (_, k) => `<ellipse cx="0" cy="-6" rx="5" ry="8" fill="${col}" opacity=".55" transform="rotate(${k * 45})"/>`).join('')}<circle r="4" fill="${col}"/><ellipse cx="-10" cy="10" rx="9" ry="3.4" fill="#9fb89a" opacity=".7" transform="rotate(-35 -10 10)"/></g>`)
  // flowers gather in the top-left and bottom-right corners
  for (let i = 0; i < 5; i++) sprig(10 + r() * 30, 70 + r() * 30, -40 + r() * 50, 40 + r() * 30, i % 2 ? '#fff' : '#f7d6dc')
  for (let i = 0; i < 5; i++) sprig(160 + r() * 30, 270 - r() * 20, 140 + r() * 60, 40 + r() * 30, i % 2 ? '#fff' : '#f7d6dc')
  rose(24, 40, 1.1, '#f2b5c0')
  rose(178, 246, 1.2, '#f2b5c0')
  rose(44, 22, 0.7, '#fbe3e8')
  rose(160, 262, 0.75, '#fbe3e8')
  return out.join('')
}

/* ---------------------------------------------------------------- fill content */
function paint() {
  const fields = {
    ...F,
    shloka: `॥ ${F.blessing} ॥`,
    first: F.first.name,
    second: F.second.name,
    pair: `${F.first.name} & ${F.second.name}`,
    day: String(F.dayNumber).padStart(2, '0'),
    month: F.monthName.toUpperCase(),
    year: String(F.year),
    whereShort: `${F.venue} · ${F.city}`.toUpperCase(),
    calHref: calendarHref(F),
  }
  $$('[data-field]').forEach((el) => (el.textContent = fields[el.dataset.field] ?? ''))
  $$('[data-href]').forEach((el) => {
    const h = fields[el.dataset.href]
    if (h) el.href = h
    else el.hidden = true
  })
  $('[data-art="flowers"]').innerHTML = flowers(7)
  $('[data-art="flowers2"]').innerHTML = flowers(19)
  $('[data-list="families"]').innerHTML = F.families.map((f) => `<p><small>${escapeHtml(f.label)}</small>${f.names.map(escapeHtml).join('<br />& ')}</p>`).join('')
  $('[data-list="contacts"]').innerHTML = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')
  document.title = `${F.first.name} & ${F.second.name} — the acrylic invitation`

  // the celebrations deck
  $('#deck').innerHTML = F.events
    .map((e, i) => {
      const a = i % 2 ? 2.5 : -2.5
      return `<button type="button" class="mini" data-i="${i}" style="--a:${a}deg;--i:${i};--tint:${TINTS[e.icon] || '#e6c27a'}" aria-label="${escapeHtml(e.name)}">
        <span class="mini__no">${String(i + 1).padStart(2, '0')}</span><span class="mini__name">${escapeHtml(e.name)}</span><span class="mini__date">${escapeHtml(e.short)}</span></button>`
    })
    .join('')

  // floating bokeh
  $('.bokeh').innerHTML = Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 7.3) % 100}%;--y:${(i * 17) % 90}%;--s:${4 + (i % 4) * 3}cqw;--t:${8 + (i % 5) * 2}s;--d:${-i}s"></i>`).join('')
}

function focusCard(i) {
  const e = F.events[i]
  const host = $('#focus')
  host.innerHTML = `<div class="acrylic acrylic--focus" style="--tint:${TINTS[e.icon] || '#e6c27a'}">
    <div class="slab" aria-hidden="true"></div>
    <div class="face face--front">
      <p class="f-pre">Celebration ${String(i + 1).padStart(2, '0')}</p>
      <h3 class="ev-name">${escapeHtml(e.name)}</h3>
      <span class="rule"></span>
      <p class="b-time">${escapeHtml(e.when)}</p>
      ${e.place ? `<p class="f-small">${escapeHtml(e.place)}</p>` : ''}
      ${e.dress ? `<p class="f-small">Dress code · ${escapeHtml(e.dress)}</p>` : ''}
      <button class="close" type="button">Back to all</button>
      <span class="glare"></span>
    </div></div>`
  host.classList.add('is-on')
  $('.close', host).addEventListener('click', () => host.classList.remove('is-on'))
}

/* ---------------------------------------------------------------- page */
function init() {
  paint()
  const stage = $('#stage')
  const card = $('#card')
  const music = createMusic(F.music, $('#sound-btn'))
  let rx = 0
  let ry = 0
  let flipped = false
  let dragging = false
  let lastX = 0
  let lastY = 0
  let moved = 0
  let raf = 0

  // the card floats and turns; glare follows the angle
  function apply() {
    const yaw = ry + (flipped ? 180 : 0)
    card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg)`
    stage.style.setProperty('--gx', `${(50 + ((ry % 360) + 360) % 360 / 3.6 - 50).toFixed(1)}%`)
    stage.style.setProperty('--gy', `${(50 - rx * 2).toFixed(1)}%`)
  }
  function float(t) {
    if (!dragging && !reducedMotion() && !card.classList.contains('is-flipping')) {
      rx += (Math.sin(t / 1600) * 6 - rx) * 0.04
      ry += (Math.sin(t / 2300) * 14 - ry) * 0.04
      apply()
    }
    raf = requestAnimationFrame(float)
  }

  card.addEventListener('pointerdown', (e) => {
    dragging = true
    moved = 0
    lastX = e.clientX
    lastY = e.clientY
    card.setPointerCapture(e.pointerId)
    card.classList.add('is-drag')
  })
  card.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dy = e.clientY - lastY
    moved += Math.abs(dx) + Math.abs(dy)
    ry += dx * 0.5
    rx = Math.max(-35, Math.min(35, rx - dy * 0.35))
    lastX = e.clientX
    lastY = e.clientY
    apply()
  })
  const end = () => {
    if (!dragging) return
    dragging = false
    card.classList.remove('is-drag')
    if (moved < 6) flip()
    // past a quarter turn, settle onto the other face
    if (Math.abs(ry) > 90) {
      flipped = !flipped
      ry -= Math.sign(ry) * 180
    }
  }
  card.addEventListener('pointerup', end)
  card.addEventListener('pointercancel', end)

  function flip() {
    flipped = !flipped
    card.classList.add('is-flipping')
    apply()
    setTimeout(() => card.classList.remove('is-flipping'), 900)
  }
  $('#flip-btn').addEventListener('click', () => {
    if (stage.dataset.view !== 'hero') go('hero')
    flip()
  })

  function go(view) {
    stage.dataset.view = view
    $$('.tabs button').forEach((b) => b.classList.toggle('is-on', b.dataset.go === view))
    $('#focus').classList.remove('is-on')
  }
  $$('.tabs button').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)))
  $('#deck').addEventListener('click', (e) => {
    const m = e.target.closest('.mini')
    if (m) focusCard(+m.dataset.i)
  })

  $('#open-btn').addEventListener('click', () => {
    music.start()
    music.reveal()
    stage.classList.add('is-open')
    go('hero')
    apply()
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(float)
  })

  const paintCount = () => {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }
  paintCount()
  setInterval(paintCount, 1000)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
