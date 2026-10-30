/* =============================================================================
   The Pop-up Words — a card that opens, and the invitation itself pops up in
   3D: every page is a stack of cut-paper panels carrying the text, which
   appears line by line. Wording comes from core.js.
   ========================================================================== */

'use strict'

const F = buildFields()
const PAGE_MS = 8500

/* ---------------------------------------------------------------- the pop-up pages */
// a pop-up panel: its shape, where its hinge sits on the card (y, % from the back), size in cqw, delay, text lines
const P = (shape, y, w, h, dl, lines, align = 'top') => ({ shape, y, w, h, dl, lines, align })
// one line of text on a panel; `k` is its kind of type
const t = (text, k = 'line') => ({ text, k })

// the standing backdrop: a soft wash with a fine gold lattice
const wall = (c1, c2) => `<div class="wash" style="--c1:${c1};--c2:${c2}"><span class="lattice"></span><span class="arch"></span></div>`

const TINT = {
  kalash: ['#ffe2c2', '#fff4e4', '#b4441f'],
  mehendi: ['#d9f0dc', '#f4fbf2', '#2f6b45'],
  haldi: ['#ffeaa0', '#fff8db', '#9a6a00'],
  sangeet: ['#e6d8ff', '#f7f1ff', '#5a2a9a'],
  mandap: ['#ffd3d6', '#fff1ee', '#9b1b30'],
  reception: ['#d8e2ff', '#f3f6ff', '#26408b'],
}

function pages() {
  const [bf, gf] = F.families
  const list = []
  list.push({
    label: 'You’re invited',
    wall: wall('#f9d3d6', '#fff4ee'),
    acc: '#a23a55',
    panels: [
      P('arch', 34, 62, 50, 0.1, [t('', 'ganesha'), t(`॥ ${F.blessing} ॥`, 'deva'), t('With the blessings of Lord Ganesha', 'small')]),
      P('scallop', 64, 74, 32, 0.45, [t('Together with their families', 'pre'), t(`${F.first.name} & ${F.second.name}`, 'script')]),
      P('banner', 94, 70, 13, 0.8, [t(F.dateFull, 'line')], 'center'),
    ],
  })
  list.push({
    label: 'The families',
    wall: wall('#ffe0c9', '#fff6ee'),
    acc: '#a23a55',
    panels: [
      P('plaque', 34, 70, 48, 0.1, [t(bf.label, 'pre'), t(bf.names[0], 'line'), t(`& ${bf.names[1]}`, 'line'), t('request the honour of your presence at the wedding of their daughter', 'italic')]),
      P('scallop', 64, 76, 30, 0.45, [t(`${F.bride.name} & ${F.groom.name}`, 'script')], 'center'),
      P('banner', 95, 82, 17, 0.8, [t('son of', 'small'), t(`${gf.names[0]} & ${gf.names[1]}`, 'smallline')], 'center'),
    ],
  })
  list.push({
    label: 'Save the date',
    wall: wall('#f6e7c1', '#fffaf0'),
    acc: '#8a6420',
    panels: [
      P('arch', 34, 60, 50, 0.1, [t('Save the date', 'pre'), t(F.weekdayName, 'italic')]),
      P('plaque', 66, 56, 36, 0.45, [t(String(F.dayNumber), 'big'), t(`${F.monthName} ${F.year}`, 'pre'), t(`at ${F.timeLabel}`, 'italic')], 'center'),
      P('banner', 95, 80, 14, 0.8, [t(`${F.venue}, ${F.city}`, 'line')], 'center'),
    ],
  })
  F.events.forEach((e, i) => {
    const [c1, c2, acc] = TINT[e.icon] || TINT.reception
    const front = e.place || e.dress
    list.push({
      label: e.name,
      wall: wall(c1, c2),
      acc,
      panels: [
        P('arch', 34, 66, 50, 0.1, [t(`Celebration ${i + 1} of ${F.events.length}`, 'pre'), t(e.name, 'script')]),
        P('scallop', 66, 70, 28, 0.45, [t(e.when, 'line'), ...(e.dress && e.place ? [t(`Dress code · ${e.dress}`, 'small')] : [])], 'center'),
        ...(front ? [P('banner', 95, 80, 14, 0.8, [t(e.place || `Dress code · ${e.dress}`, 'italic')], 'center')] : []),
      ],
    })
  })
  list.push({
    label: 'See you there',
    wall: wall('#f9d3d6', '#fff4ee'),
    acc: '#a23a55',
    panels: [P('banner', 95, 80, 14, 0.3, [t(F.closingMessage, 'italic')], 'center')],
    finale: true,
  })
  return list
}

/* ---------------------------------------------------------------- render */
function panelHtml(p) {
  const lines = p.lines
    .map((l, i) => (l.k === 'ganesha' ? `<span class="pl pl--ganesha" style="--i:${i}">${ganeshaSvg('pg')}</span>` : `<p class="pl pl--${l.k}" style="--i:${i}"${l.k === 'deva' ? ' lang="sa"' : ''}>${escapeHtml(l.text)}</p>`))
    .join('')
  return `<div class="pw"><div class="pp pp--${p.shape} pp--${p.align}"><span class="pp__frame"></span><div class="pp__text">${lines}</div></div></div>`
}

function render(list) {
  $('#walls').innerHTML = list.map((p, i) => `<div class="wallart" data-p="${i}">${p.wall}</div>`).join('')
  $('#floor-layers').innerHTML = list
    .map((p, i) => p.panels.map((l) => `<div class="layer" data-p="${i}" style="--y:${l.y}%;--w:${l.w}cqw;--h:${l.h}cqw;--x:0cqw;--dl:${l.dl}s;--acc:${p.acc}">${panelHtml(l)}</div>`).join(''))
    .join('')
  $('#tags').innerHTML = list
    .map((p, i) => (p.finale ? `<div class="tag tag--final" data-p="${i}">${finaleCard()}</div>` : ''))
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
