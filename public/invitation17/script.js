/* =============================================================================
   The Pop-up Words — a card that opens, and the invitation itself pops up in
   3D: every page is a stack of cut-paper panels carrying the text, which
   appears line by line. Wording comes from core.js.
   ========================================================================== */

'use strict'

const F = buildFields()
const PAGE_MS = 8500

/* ---------------------------------------------------------------- the pop-up pages */
// a pop-up panel: its laser-cut shape, its hinge on the card (y, % from the back), size in cqw, delay, sheet tone, text lines
const P = (shape, y, w, h, dl, tone, lines, pad = '') => ({ shape, y, w, h, dl, tone, lines, pad })
// one line of text on a panel; `k` is its kind of type
const t = (text, k = 'line') => ({ text, k })

// each page has a jewel tone: the backdrop, and the deep sheet of its back panel
const THEME = {
  intro: ['#7a1630', '#2e0711', '#6d1a2a'],
  families: ['#145a43', '#062018', '#0f4a37'],
  date: ['#1f3a78', '#0a1430', '#1b3266'],
  kalash: ['#9c3d0e', '#3a1204', '#8a330b'],
  mehendi: ['#1d6b47', '#06241a', '#145a3b'],
  haldi: ['#9a6a06', '#3a2600', '#7d5604'],
  sangeet: ['#53208a', '#1a0733', '#45197a'],
  mandap: ['#8c1328', '#2c040c', '#7a1024'],
  reception: ['#1f3a78', '#0a1430', '#1b3266'],
  finale: ['#7a1630', '#2e0711', '#6d1a2a'],
}

// the standing backdrop: jewel velvet with a gold jaali and an arch window
const wall = ([c1, c2]) => `<div class="wash" style="--c1:${c1};--c2:${c2}"><span class="lattice"></span><span class="arch"></span><span class="arch arch--in"></span></div>`

function pages() {
  const [bf, gf] = F.families
  const list = []
  const page = (key, label, panels, extra = {}) => list.push({ label, wall: wall(THEME[key]), deep: THEME[key][2], panels, ...extra })

  page('intro', 'You’re invited', [
    P('arch', 34, 66, 56, 0.1, 'deep', [t('', 'ganesha'), t(`॥ ${F.blessing} ॥`, 'deva'), t('With the blessings of Lord Ganesha', 'small')]),
    P('lace', 68, 78, 28, 0.5, 'light', [t('Together with their families', 'pre'), t(`${F.first.name} & ${F.second.name}`, 'script')]),
    P('ribbon', 94, 74, 12, 0.9, 'gold', [t(F.dateFull, 'line')]),
  ])
  page('families', 'The families', [
    P('arch', 34, 80, 56, 0.1, 'deep', [t(bf.label, 'pre'), t(bf.names[0], 'line'), t(`& ${bf.names[1]}`, 'line'), t('request the honour of your presence at the wedding of their daughter', 'italic')], 'wide'),
    P('lace', 68, 78, 24, 0.5, 'light', [t(`${F.bride.name} & ${F.groom.name}`, 'script')]),
    P('ribbon', 95, 86, 16, 0.9, 'gold', [t('son of', 'small'), t(`${gf.names[0]} & ${gf.names[1]}`, 'smallline')]),
  ])
  page('date', 'Save the date', [
    P('arch', 34, 70, 56, 0.1, 'deep', [t('Save the date', 'pre'), t(F.weekdayName, 'italic')]),
    P('medallion', 68, 40, 40, 0.5, 'light', [t(String(F.dayNumber), 'big'), t(`${F.monthName} ${F.year}`, 'pre'), t(`at ${F.timeLabel}`, 'italic')]),
    P('ribbon', 95, 80, 12, 0.9, 'gold', [t(`${F.venue}, ${F.city}`, 'line')]),
  ])
  F.events.forEach((e, i) => {
    page(e.icon in THEME ? e.icon : 'reception', e.name, [
      P('arch', 34, 70, 56, 0.1, 'deep', [t(`Celebration ${i + 1} of ${F.events.length}`, 'pre'), t(e.name, 'script')]),
      P('lace', 70, 72, 24, 0.5, 'light', [t(e.when, 'line'), ...(e.dress && e.place ? [t(`Dress code · ${e.dress}`, 'small')] : [])]),
      ...(e.place || e.dress ? [P('ribbon', 95, 82, 12, 0.9, 'gold', [t(e.place || `Dress code · ${e.dress}`, 'italic')])] : []),
    ])
  })
  page('finale', 'See you there', [P('ribbon', 95, 82, 12, 0.3, 'gold', [t(F.closingMessage, 'italic')])], { finale: true })
  return list
}

/* ---------------------------------------------------------------- render */
function panelHtml(p, deep) {
  const lines = p.lines
    .map((l, i) => (l.k === 'ganesha' ? `<span class="pl pl--ganesha" style="--i:${i}">${ganeshaSvg('pg')}</span>` : `<p class="pl pl--${l.k}" style="--i:${i}"${l.k === 'deva' ? ' lang="sa"' : ''}>${escapeHtml(l.text)}</p>`))
    .join('')
  const sheet = p.tone === 'deep' ? deep : '#fff8ec'
  return `<div class="pw"><div class="pp pp--${p.shape} pp--${p.tone} ${p.pad ? `pp--${p.pad}` : ''}" style="--sheet:${sheet}">${Cut[p.shape](p.w, p.h)}${p.shape === 'lace' || p.shape === 'ribbon' ? '<span class="shine"></span>' : ''}<div class="pp__text">${lines}</div></div></div>`
}

function render(list) {
  $('#walls').innerHTML = list.map((p, i) => `<div class="wallart" data-p="${i}">${p.wall}</div>`).join('')
  $('#floor-layers').innerHTML = list
    .map((p, i) => p.panels.map((l) => `<div class="layer" data-p="${i}" style="--y:${l.y}%;--w:${l.w}cqw;--h:${l.h}cqw;--x:0cqw;--dl:${l.dl}s">${panelHtml(l, p.deep)}</div>`).join(''))
    .join('')
  $('#tags').innerHTML = list
    .map((p, i) => (p.finale ? `<div class="tag tag--final" data-p="${i}">${finaleCard()}</div>` : ''))
    .join('')
}

/* ---------------------------------------------------------------- gold dust, released as each page pops up */
function dust() {
  const host = $('#dust')
  if (reducedMotion()) return
  host.innerHTML = Array.from({ length: 26 }, () => `<i style="--x:${rand(14, 86).toFixed(1)}%;--y:${rand(40, 70).toFixed(1)}%;--s:${rand(0.4, 1.2).toFixed(2)}cqw;--d:${rand(0.6, 2.2).toFixed(2)}s;--t:${rand(2.6, 4.4).toFixed(2)}s;--dx:${rand(-8, 8).toFixed(1)}cqw"></i>`).join('')
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
      dust()
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
