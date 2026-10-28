/* =============================================================================
   A Reel of Forever — a cinematic photo invitation.
   Photos come from photos.js, wording from core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const SCENE_MS = 8500

// each event gets its own colour grade, camera move and transition
const GRADE = {
  kalash: { tint: '#ff8c3a', kb: 'kb-in', wipe: 'w-iris', tag: 'With Bappa’s blessings' },
  mehendi: { tint: '#2f8f5b', kb: 'kb-left', wipe: 'w-slide', tag: 'Henna & happiness' },
  haldi: { tint: '#ffbf1f', kb: 'kb-up', wipe: 'w-shutter', tag: 'A splash of sunshine' },
  sangeet: { tint: '#7b2cbf', kb: 'kb-right', wipe: 'w-diag', tag: 'Music, dance & us' },
  mandap: { tint: '#b3122e', kb: 'kb-in', wipe: 'w-iris', tag: 'Seven vows, one forever' },
  reception: { tint: '#1d2b53', kb: 'kb-out', wipe: 'w-zoom', tag: 'Raise a toast' },
}
const DEFAULT_GRADE = { tint: '#b38b59', kb: 'kb-in', wipe: 'w-slide', tag: 'Celebrate with us' }

const img = (p, cls = '') => `<img class="${cls}" src="${p.src}" alt="" style="object-position:${p.focus || '50% 50%'}" />`

// a title whose letters rise one by one
const letters = (s, base = 0) =>
  [...s].map((c, i) => (c === ' ' ? ' ' : `<span class="ch" style="--i:${i + base}">${escapeHtml(c)}</span>`)).join('')

function scenes() {
  const list = []

  list.push({
    key: 'opening',
    wipe: 'w-fade',
    ms: 8000,
    label: 'Our story',
    html: `<div class="kb kb-in">${img(PHOTOS.opening)}</div><span class="shade shade--deep"></span><span class="leak"></span>
      <span class="letterbox letterbox--t"></span><span class="letterbox letterbox--b"></span>
      <div class="titles">
        <p class="t1">${escapeHtml(F.openingMessage)}</p>
        <h2 class="t2">${letters(F.first.name)}</h2>
        <p class="t3">&amp;</p>
        <h2 class="t2 t2--b">${letters(F.second.name, F.first.name.length + 2)}</h2>
        <p class="t4">${escapeHtml(F.inviteLine)}</p>
      </div>`,
  })

  list.push({
    key: 'moments',
    wipe: 'w-slide',
    ms: 8000,
    label: 'Our moments',
    html: `<div class="kb kb-in blur">${img(PHOTOS.opening)}</div><span class="shade shade--deep"></span>
      <p class="moments__title">Little moments,<br /><em>a lifetime of love</em></p>
      <div class="stack">${PHOTOS.moments.map((p, i) => `<figure class="pola" style="--i:${i};--r:${[-8, 6, -4, 9][i % 4]}deg;--x:${[-12, 10, -6, 8][i % 4]}cqw">${img(p)}<figcaption>${['first hello', 'adventures', 'the yes', 'forever'][i % 4]}</figcaption></figure>`).join('')}</div>
      <div class="strip"><div class="strip__track">${[...PHOTOS.moments, ...PHOTOS.moments].map((p) => `<span>${img(p)}</span>`).join('')}</div></div>`,
  })

  F.events.forEach((e, i) => {
    const g = GRADE[e.icon] || DEFAULT_GRADE
    const photo = PHOTOS.events[e.icon] || PHOTOS.fallback
    list.push({
      key: `ev ev--${e.icon}`,
      wipe: g.wipe,
      ms: SCENE_MS,
      label: e.name,
      html: `<div class="kb ${g.kb}">${img(photo)}</div>
        <span class="grade" style="--tint:${g.tint}"></span><span class="shade"></span><span class="leak leak--soft"></span>
        <p class="chapter">Chapter ${String(i + 1).padStart(2, '0')} <i></i> ${String(F.events.length).padStart(2, '0')}</p>
        <div class="ev__text">
          <p class="ev__tag">${escapeHtml(g.tag)}</p>
          <h2 class="ev__name">${escapeHtml(e.name)}</h2>
          <span class="ev__rule"></span>
          <p class="ev__when">${escapeHtml(e.when)}</p>
          ${e.place ? `<p class="ev__place">${escapeHtml(e.place)}</p>` : ''}
          ${e.dress ? `<p class="ev__place">Dress code · ${escapeHtml(e.dress)}</p>` : ''}
        </div>`,
    })
  })

  const fams = F.families.map((f) => `<div><small>${escapeHtml(f.label)}</small><p>${f.names.map(escapeHtml).join('<br />& ')}</p></div>`).join('')
  const contacts = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<span>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</span>`
    })
    .join('')
  list.push({
    key: 'finale',
    wipe: 'w-fade',
    ms: 0,
    label: 'See you there',
    html: `<div class="kb kb-out">${img(PHOTOS.finale)}</div><span class="shade shade--deep"></span>
      <div class="final">
        ${ganeshaSvg('final__g')}
        <p class="final__bless" lang="sa">॥ ${escapeHtml(F.blessing)} ॥</p>
        <h2 class="final__names">${escapeHtml(F.first.name)} <em>&amp;</em> ${escapeHtml(F.second.name)}</h2>
        <p class="final__date">${escapeHtml(F.dateFull)} · ${escapeHtml(F.timeLabel)}</p>
        <p class="final__venue">${escapeHtml(F.venue)}, ${escapeHtml(F.city)}</p>
        <dl class="count"><div><dd data-c="days">0</dd><dt>Days</dt></div><div><dd data-c="hours">0</dd><dt>Hours</dt></div><div><dd data-c="minutes">0</dd><dt>Min</dt></div><div><dd data-c="seconds">0</dd><dt>Sec</dt></div></dl>
        <div class="final__fams">${fams}</div>
        <p class="final__msg">${escapeHtml(F.familiesMessage)}</p>
        <div class="final__btns">
          ${F.rsvpHref ? `<a class="btn" href="${F.rsvpHref}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : ''}
          <a class="btn btn--ghost" href="${calendarHref(F)}" target="_blank" rel="noopener">Save the date</a>
          <a class="btn btn--ghost" href="${F.mapHref}" target="_blank" rel="noopener">Directions</a>
        </div>
        <p class="final__by">Kindly reply by ${escapeHtml(F.rsvpByLong)}</p>
        <p class="final__contacts">${contacts}</p>
        <p class="final__closing">${escapeHtml(F.closingMessage)}</p>
      </div>`,
  })
  return list
}

/* ---------------------------------------------------------------- player */
function init() {
  const stage = $('#stage')
  const list = scenes()
  $('#film').innerHTML = list.map((s, i) => `<section class="scene scene--${s.key} ${s.wipe}" data-i="${i}" aria-label="${escapeHtml(s.label)}" aria-hidden="true">${s.html}</section>`).join('')
  $('#bars').innerHTML = list.map(() => '<span><i></i></span>').join('')
  const els = $$('.scene')
  const fills = $$('#bars i')
  const pauseBtn = $('#pause-btn')
  const music = createMusic(F.music, $('#sound-btn'))

  // poster
  const pimg = $('[data-photo="poster"]')
  pimg.src = PHOTOS.poster.src
  pimg.style.objectPosition = PHOTOS.poster.focus
  $('#poster-names').innerHTML = `${escapeHtml(F.first.name)} <em>&amp;</em> ${escapeHtml(F.second.name)}`
  $('#poster-date').textContent = F.dateLong
  document.title = `${F.first.name} & ${F.second.name} — A Reel of Forever`

  let index = -1
  let t0 = 0
  let elapsed = 0
  let paused = false
  let raf = 0
  let started = false

  function paint() {
    fills.forEach((f, n) => {
      const ms = list[index]?.ms
      f.style.transform = `scaleX(${n < index ? 1 : n > index ? 0 : ms ? Math.min(1, elapsed / ms) : 1})`
    })
  }
  function tick(t) {
    if (!paused) elapsed = t - t0
    paint()
    if (list[index].ms && elapsed >= list[index].ms) return go(index + 1)
    raf = requestAnimationFrame(tick)
  }
  function go(n) {
    n = Math.max(0, Math.min(els.length - 1, n))
    cancelAnimationFrame(raf)
    els.forEach((s) => s.classList.remove('is-prev'))
    const prev = els[index]
    if (prev && prev !== els[n]) {
      prev.classList.remove('is-active')
      prev.classList.add('is-prev')
      prev.setAttribute('aria-hidden', 'true')
    }
    index = n
    const el = els[n]
    el.classList.remove('is-active')
    void el.offsetWidth
    el.classList.add('is-active')
    el.setAttribute('aria-hidden', 'false')
    $('#label').textContent = list[n].label
    stage.classList.toggle('is-last', n === els.length - 1)
    elapsed = 0
    t0 = performance.now()
    setPaused(false)
    raf = requestAnimationFrame(tick)
  }
  function setPaused(on) {
    if (on === paused) return
    paused = on
    stage.classList.toggle('is-paused', on)
    pauseBtn.classList.toggle('is-paused', on)
    pauseBtn.setAttribute('aria-label', on ? 'Play' : 'Pause')
    if (!on) t0 = performance.now() - elapsed
  }

  $('#play-btn').addEventListener('click', () => {
    if (started) return
    started = true
    music.start()
    music.reveal()
    stage.classList.add('is-started')
    go(0)
  })
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

  const paintCount = () => {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }
  paintCount()
  setInterval(paintCount, 1000)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
