/* =============================================================================
   The Pop-up Card — a laser-cut card that opens and pops up in 3D paper layers.
   Each celebration is a new pop-up page. Wording comes from core.js.
   ========================================================================== */

'use strict'

const F = buildFields()
const PAGE_MS = 8500

/* ---------------------------------------------------------------- the pop-up pages */
// a layer: art, where its hinge sits on the card (y, % from the back), size in cqw, x offset, delay
const L = (art, y, w, h, x = 0, dl = 0, cls = '') => ({ art, y, w, h, x, dl, cls })

const sky = (top, bottom, extra = '') => `<svg viewBox="0 0 100 76" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="s${top.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="100" height="76" fill="url(#s${top.slice(1)})"/>${extra}</svg>`
const stars = (n, c = '#fff') => Array.from({ length: n }, (_, i) => `<circle cx="${(i * 37) % 100}" cy="${(i * 23) % 50}" r="${0.3 + (i % 3) * 0.2}" fill="${c}" class="tw" style="--i:${i % 5}"/>`).join('')
const sunburst = (c) => Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return `<path d="M50 52 L${(50 + Math.cos(a) * 70).toFixed(1)} ${(52 + Math.sin(a) * 70).toFixed(1)} L${(50 + Math.cos(a + 0.12) * 70).toFixed(1)} ${(52 + Math.sin(a + 0.12) * 70).toFixed(1)}Z" fill="${c}" opacity=".35"/>` }).join('')

const elephants = (fill, cloth) => `<div class="pair">${Paper.elephant(fill, cloth)}<span class="flip">${Paper.elephant(fill, cloth)}</span></div>`
const ganeshDisc = () => `<div class="disc">${ganeshaSvg('disc__g')}</div>`

function pages() {
  const ev = Object.fromEntries(F.events.map((e) => [e.icon, e]))
  const list = [
    {
      key: 'intro',
      label: 'You’re invited',
      wall: sky('#f9c6c9', '#fde4cf', `<circle cx="50" cy="50" r="16" fill="#ffd6a5"/><path d="M0 60 C25 50 45 58 60 54 C75 50 90 56 100 52 V76 H0Z" fill="#f4acb7" opacity=".6"/>`),
      layers: [
        L(Paper.palace('#f8ad9d'), 34, 78, 52, 0, 0.1),
        L(elephants('#fbe9e2', '#c9952c'), 62, 84, 26, 0, 0.35),
        L(Paper.couple('#fffaf4'), 76, 30, 38, 0, 0.6),
        L(Paper.florals('#fff4f1', '#f4acb7', '#7bb08f'), 99, 86, 15, 0, 0.85),
      ],
      tag: { pre: F.openingMessage, title: `${F.first.name} & ${F.second.name}`, lines: [F.inviteLine, F.dateFull] },
    },
  ]
  const recipes = {
    kalash: () => ({
      wall: sky('#ff9e57', '#ffd6a5', sunburst('#fff3c4')),
      layers: [L(Paper.archFrame('#c8553d'), 40, 64, 52, 0, 0.1), L(ganeshDisc(), 46, 26, 26, 0, 0.4), L(Paper.kalashRow('#e3b341'), 76, 72, 24, 0, 0.65), L(Paper.florals('#fff3c4', '#ff9f1c', '#2e7d32'), 99, 86, 15, 0, 0.85)],
      pre: 'With Bappa’s blessings',
    }),
    mehendi: () => ({
      wall: sky('#b7e4c7', '#f1faee', `<path d="M0 76 C30 60 70 66 100 58 V76Z" fill="#95d5b2"/>`),
      layers: [L(Paper.marigolds('#2e8b57', '#ff5d8f'), 30, 84, 46, 0, 0.1), L(Paper.swing('#f72585', '#2e8b57'), 66, 34, 40, -18, 0.4, 'sway'), L(Paper.couple('#fff5f8', true), 70, 26, 34, 20, 0.55), L(Paper.hands('#eab894', '#8a3a17'), 99, 62, 24, 0, 0.8)],
      pre: 'Henna & happiness',
    }),
    haldi: () => ({
      wall: sky('#ffd23f', '#fff3b0', sunburst('#fff')),
      layers: [L(Paper.marigolds('#f77f00', '#ffbf00'), 32, 84, 48, 0, 0.1), L(Paper.couple('#fff8e1'), 70, 30, 36, 0, 0.45), L(Paper.kalashRow('#f4a261'), 86, 76, 22, 0, 0.65), L(Paper.florals('#fff3b0', '#f77f00', '#2e7d32'), 99, 86, 14, 0, 0.85)],
      pre: 'A splash of sunshine',
    }),
    sangeet: () => ({
      wall: sky('#240046', '#5a189a', stars(40)),
      layers: [L(Paper.archFrame('#7b2cbf'), 38, 70, 54, 0, 0.1), L(Paper.couple('#ffd6ff', true), 72, 34, 40, 0, 0.45, 'sway'), L(Paper.dhol('#c8102e'), 99, 64, 22, 0, 0.75)],
      pre: 'Music, dance & us',
    }),
    mandap: () => ({
      wall: sky('#6a040f', '#9d0208', stars(26, '#ffe9a8')),
      layers: [L(Paper.mandap('#e3b341'), 50, 72, 56, 0, 0.1), L(Paper.couple('#fff1e6'), 74, 30, 36, 0, 0.45), L(Paper.kalashRow('#e3b341'), 99, 74, 20, 0, 0.75)],
      pre: 'Seven vows, one forever',
    }),
    reception: () => ({
      wall: sky('#0b132b', '#3a0ca3', stars(36)),
      layers: [L(Paper.chandelier('#f1dfb4'), 30, 86, 40, 0, 0.1), L(Paper.couple('#ffe5ec', true), 74, 34, 40, 0, 0.45, 'sway'), L(Paper.florals('#ffe5ec', '#ffafcc', '#52796f'), 99, 86, 15, 0, 0.75)],
      pre: 'Raise a toast',
    }),
  }
  F.events.forEach((e) => {
    const r = (recipes[e.icon] || recipes.reception)()
    list.push({ key: e.icon, label: e.name, wall: r.wall, layers: r.layers, tag: { pre: r.pre, title: e.name, lines: [e.when, e.place, e.dress && `Dress code · ${e.dress}`].filter(Boolean) } })
  })
  list.push({
    key: 'finale',
    label: 'See you there',
    wall: sky('#fde2e4', '#fff1e6'),
    layers: [L(Paper.palace('#f4acb7'), 36, 78, 50, 0, 0.1), L(Paper.couple('#fffaf4'), 74, 30, 36, 0, 0.45), L(Paper.florals('#fff', '#f4acb7', '#7bb08f'), 99, 86, 15, 0, 0.7)],
    finale: true,
  })
  void ev
  return list
}

/* ---------------------------------------------------------------- render */
function render(list) {
  $('#walls').innerHTML = list.map((p, i) => `<div class="wallart" data-p="${i}">${p.wall}</div>`).join('')
  $('#floor-layers').innerHTML = list
    .map((p, i) => p.layers.map((l) => `<div class="layer ${l.cls}" data-p="${i}" style="--y:${l.y}%;--w:${l.w}cqw;--h:${l.h}cqw;--x:${l.x}cqw;--dl:${l.dl}s">${l.art}</div>`).join(''))
    .join('')
  $('#tags').innerHTML = list
    .map((p, i) => p.finale
      ? `<div class="tag tag--final" data-p="${i}">${finaleCard()}</div>`
      : `<div class="tag" data-p="${i}"><p class="tag__pre">${escapeHtml(p.tag.pre)}</p><h2 class="tag__title">${escapeHtml(p.tag.title)}</h2>${p.tag.lines.map((l) => `<p class="tag__line">${escapeHtml(l)}</p>`).join('')}</div>`)
    .join('')
}

function finaleCard() {
  const fams = F.families.map((f) => `<p><small>${escapeHtml(f.label)}</small>${f.names.map(escapeHtml).join(' & ')}</p>`).join('')
  const contacts = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<span>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</span>`
    })
    .join('')
  return `<p class="tag__pre" lang="sa">॥ ${escapeHtml(F.blessing)} ॥</p>
    <h2 class="tag__title">${escapeHtml(F.first.name)} &amp; ${escapeHtml(F.second.name)}</h2>
    <p class="tag__line">${escapeHtml(F.dateFull)} · ${escapeHtml(F.timeLabel)}</p>
    <p class="tag__line">${escapeHtml(F.venue)}, ${escapeHtml(F.city)}</p>
    <dl class="count"><div><dd data-c="days">0</dd><dt>days</dt></div><div><dd data-c="hours">0</dd><dt>hrs</dt></div><div><dd data-c="minutes">0</dd><dt>min</dt></div><div><dd data-c="seconds">0</dd><dt>sec</dt></div></dl>
    <div class="fams">${fams}</div>
    <div class="btns">${F.rsvpHref ? `<a class="btn" href="${F.rsvpHref}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : ''}<a class="btn btn--ghost" href="${calendarHref(F)}" target="_blank" rel="noopener">Save the date</a><a class="btn btn--ghost" href="${F.mapHref}" target="_blank" rel="noopener">Directions</a></div>
    <p class="tag__small">Kindly reply by ${escapeHtml(F.rsvpByLong)}</p><p class="tag__small">${contacts}</p>`
}

/* ---------------------------------------------------------------- player */
function init() {
  const list = pages()
  render(list)
  const stage = $('#stage')
  const music = createMusic(F.music, $('#sound-btn'))
  const pauseBtn = $('#pause-btn')
  $('#bars').innerHTML = list.map(() => '<span><i></i></span>').join('')
  const fills = $$('#bars i')
  $('#cover-names').innerHTML = `${escapeHtml(F.first.name)}<em>&amp;</em>${escapeHtml(F.second.name)}`
  $('#cover-date').textContent = F.dateLong
  $('#cover-mono').textContent = `${F.first.name[0]}${F.second.name[0]}`

  let page = -1
  let t0 = 0
  let elapsed = 0
  let paused = false
  let raf = 0
  let opened = false
  let swap = 0

  const byPage = (sel, i) => $$(`${sel}[data-p="${i}"]`)

  function show(i) {
    clearTimeout(swap)
    const prev = page
    page = i
    $('#label').textContent = list[i].label
    stage.classList.toggle('is-last', i === list.length - 1)
    // fold the old page down, then pop the new one up
    if (prev >= 0) byPage('.layer', prev).forEach((l) => l.classList.remove('up'))
    $$('.tag').forEach((t) => t.classList.remove('on'))
    $$('.wallart').forEach((w) => w.classList.toggle('on', +w.dataset.p === i))
    swap = setTimeout(() => {
      byPage('.layer', i).forEach((l) => l.classList.add('up'))
      byPage('.tag', i).forEach((t) => t.classList.add('on'))
    }, prev >= 0 && !reducedMotion() ? 800 : 0)
    elapsed = 0
    t0 = performance.now()
    setPaused(false)
  }

  function tick(t) {
    if (!paused) elapsed = t - t0
    const ms = page === list.length - 1 ? 0 : PAGE_MS
    fills.forEach((f, n) => (f.style.transform = `scaleX(${n < page ? 1 : n > page ? 0 : ms ? Math.min(1, elapsed / ms) : 1})`))
    if (ms && elapsed >= ms) show(page + 1)
    raf = requestAnimationFrame(tick)
  }

  function setPaused(on) {
    if (on === paused) return
    paused = on
    pauseBtn.classList.toggle('is-paused', on)
    pauseBtn.setAttribute('aria-label', on ? 'Play' : 'Pause')
    if (!on) t0 = performance.now() - elapsed
  }

  function open() {
    if (opened) return
    opened = true
    music.start()
    music.reveal()
    stage.classList.add('is-open')
    setTimeout(() => {
      stage.classList.add('is-started')
      show(0)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }, reducedMotion() ? 0 : 1300)
  }
  $('#open-btn').addEventListener('click', open)
  $('#next-btn').addEventListener('click', () => show(Math.min(list.length - 1, page + 1)))
  $('#prev-btn').addEventListener('click', () => show(Math.max(0, page - 1)))
  pauseBtn.addEventListener('click', () => setPaused(!paused))
  $('#replay-btn').addEventListener('click', () => {
    music.restart()
    show(0)
  })
  document.addEventListener('keydown', (e) => {
    if (!opened) return
    if (e.key === 'ArrowRight') show(Math.min(list.length - 1, page + 1))
    if (e.key === 'ArrowLeft') show(Math.max(0, page - 1))
  })

  // tilt the card with the mouse or the phone's motion: the paper layers shift in depth
  const tilt = (x, y) => {
    stage.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
    stage.style.setProperty('--rx', `${(y * -6).toFixed(2)}deg`)
  }
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect()
    tilt((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5)
  })
  stage.addEventListener('pointerleave', () => tilt(0, 0))
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return
    tilt(Math.max(-1, Math.min(1, e.gamma / 30)) / 2, Math.max(-1, Math.min(1, (e.beta - 45) / 30)) / 2)
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
