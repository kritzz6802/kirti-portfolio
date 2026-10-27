/* =============================================================================
   The Pichwai Scroll — a tied scroll that unrolls into the whole invitation.
   Content lives in core.js (invitationData); artwork in art.js.
   ========================================================================== */

'use strict'

const F = buildFields()

const TIMING = { untie: 0, rise: 800, unroll: 1500, ready: 4200 }
const TIMING_REDUCED = { untie: 0, rise: 50, unroll: 100, ready: 400 }

const ICONS = {
  kalash: '<path d="M12 31 C7 24 11 17 20 17 C29 17 33 24 28 31Z"/><path d="M14 17 H26 M16 17 L15 13 H25 L24 17"/><circle cx="20" cy="9" r="4"/><path d="M15 12 Q11 8 9 11 M25 12 Q29 8 31 11"/>',
  mehendi: '<path d="M14 35 V19 Q14 16 16 16 Q18 16 18 19 V12 Q18 9 20 9 Q22 9 22 12 V11 Q22 8 24 8 Q26 8 26 11 V15 Q26 12 28 12 Q30 12 30 15 V26 Q30 34 22 36 Q16 36 14 35Z"/><circle cx="22" cy="25" r="3"/>',
  haldi: '<path d="M7 22 H33 Q31 33 20 33 Q9 33 7 22Z"/><path d="M11 22 Q20 13 29 22"/><path d="M30 9 l-6 9"/>',
  sangeet: '<ellipse cx="20" cy="22" rx="13" ry="8"/><path d="M7 22 V27 Q20 37 33 27 V22"/><path d="M30 6 V14 M30 6 L35 8"/>',
  mandap: '<path d="M6 34 H34 M9 34 V17 M31 34 V17 M6 17 H34"/><path d="M9 17 Q20 3 31 17"/><path d="M20 31 C16 27 18 23 20 21 C22 23 24 27 20 31Z"/>',
  reception: '<path d="M10 8 H18 L17 18 Q14 22 11 18Z"/><path d="M14 20 V31 M10 31 H18"/><path d="M22 8 H30 L29 18 Q26 22 23 18Z"/><path d="M26 20 V31 M22 31 H30"/>',
}

/* ---------------------------------------------------------------- paint artwork and content */
function paint() {
  $('#defs').innerHTML = Art.defs()
  const painters = {
    toran: () => Art.toran(),
    cows: () => Art.cowsScene(),
    medallion: () => Art.medallion(),
    pond: () => Art.pond(),
    bell: () => Art.bell(),
    koi: () => Art.koi(),
    ground: () => {
      const o = ['<rect y="40" width="600" height="100" fill="url(#water)"/>']
      for (let x = 10; x < 600; x += 46) o.push(Art.use('padS', x, 86 + (x % 3) * 8, 1.6, x), Art.use(x % 4 ? 'bud' : 'lotus', x + 22, 96, 1.3, 0))
      return o.join('')
    },
    koipads: () => Array.from({ length: 9 }, (_, i) => Art.use(i % 3 ? 'padS' : 'lotus', 30 + i * 68, 60 + (i % 2) * 30, 1.6, i * 40)).join(''),
  }
  $$('[data-art]').forEach((el) => {
    const p = painters[el.dataset.art]
    if (p) el.innerHTML = p()
  })
  $$('[data-art-html="ganesha"]').forEach((el) => (el.outerHTML = ganeshaSvg()))
  // the painted side border repeats down the whole scroll as an svg background tile
  const tile = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="80" viewBox="0 0 40 80"><defs>${Art.defs()}</defs>${Art.borderTile()}</svg>`
  $('.paper__content').style.setProperty('--border', `url("data:image/svg+xml,${encodeURIComponent(tile)}")`)

  const fields = {
    ...F,
    tagNames: `${F.first.name} & ${F.second.name}`,
    shloka: `॥ ${F.blessing} ॥`,
    firstName: F.first.name,
    firstSurname: F.first.surname,
    secondName: F.second.name,
    secondSurname: F.second.surname,
  }
  $$('[data-field]').forEach((el) => (el.textContent = fields[el.dataset.field] ?? ''))
  $$('[data-href]').forEach((el) => {
    const href = fields[el.dataset.href]
    if (href) el.href = href
    else el.hidden = true
  })
  document.title = `${F.first.name} & ${F.second.name} — Shubh Vivah`

  $('[data-list="families"]').innerHTML = F.families
    .map((f) => `<div class="jharokha"><p class="caps jharokha__label">${escapeHtml(f.label)}</p>${f.names.map((n, k) => `<p class="jharokha__name">${k ? '&amp; ' : ''}${escapeHtml(n)}</p>`).join('')}</div>`)
    .join('')
  $('[data-list="events"]').innerHTML = F.events
    .map((e, i) => `<article class="panel reveal" style="--d:${i % 2}">
      <svg class="panel__icon" viewBox="0 0 40 40" aria-hidden="true">${ICONS[e.icon] || ICONS.mandap}</svg>
      <h3 class="panel__name">${escapeHtml(e.name)}</h3>
      <p class="panel__when">${escapeHtml(e.short)}</p>
      ${e.place ? `<p class="panel__place">${escapeHtml(e.place)}</p>` : ''}
      ${e.dress ? `<p class="panel__place">Dress · ${escapeHtml(e.dress)}</p>` : ''}</article>`)
    .join('')
  $('[data-list="story"]').innerHTML = F.story.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
  if (!F.story.length) $('[data-optional="story"]').remove()
  $('[data-list="contacts"]').innerHTML = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')

  // a handful of drifting petals behind the scroll
  const drift = $('.drift')
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('i')
    p.style.cssText = `--x:${(i * 8.5 + rand(0, 5)).toFixed(1)}%;--s:${rand(2.4, 4.4).toFixed(1)}cqw;--t:${rand(10, 16).toFixed(1)}s;--d:${(-rand(0, 16)).toFixed(1)}s;--sway:${rand(-10, 10).toFixed(1)}cqw`
    drift.append(p)
  }
}

/* ---------------------------------------------------------------- the temple bell, synthesised */
let audioCtx = null
function ringBell() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    const now = audioCtx.currentTime
    const master = audioCtx.createGain()
    master.gain.value = 0.22
    master.connect(audioCtx.destination)
    for (const [ratio, amp, decay] of [[1, 1, 2.8], [2.76, 0.5, 1.6], [5.4, 0.25, 0.9], [8.93, 0.12, 0.5]]) {
      const o = audioCtx.createOscillator()
      const g = audioCtx.createGain()
      o.frequency.value = 523 * ratio
      g.gain.setValueAtTime(0.0001, now)
      g.gain.exponentialRampToValueAtTime(amp, now + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay)
      o.connect(g).connect(master)
      o.start(now)
      o.stop(now + decay + 0.05)
    }
  } catch {
    /* no Web Audio: the bell still swings */
  }
}

/* ---------------------------------------------------------------- page */
function init() {
  paint()
  const stage = $('#stage')
  const paper = $('#paper')
  const music = createMusic(F.music, $('#sound-btn'))
  const replay = $('#replay-btn')
  let timers = []
  let countTimer = 0
  let opened = false

  const later = (ms, fn) => timers.push(setTimeout(fn, ms))

  // reveal-on-scroll inside the scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
    { root: paper, threshold: 0.15 },
  )
  $$('.reveal', paper).forEach((el) => io.observe(el))

  // the rods turn as the paper scrolls
  paper.addEventListener('scroll', () => stage.style.setProperty('--roll', `${paper.scrollTop * 0.6}px`), { passive: true })

  function paintCount() {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }

  function open() {
    if (opened) return
    opened = true
    music.start()
    const t = reducedMotion() ? TIMING_REDUCED : TIMING
    stage.classList.add('is-untie')
    later(t.rise, () => stage.classList.add('is-rise'))
    later(t.unroll, () => stage.classList.add('is-unroll'))
    later(t.ready, () => {
      stage.classList.add('is-ready')
      music.reveal()
      replay.hidden = false
      paper.focus({ preventScroll: true })
      paintCount()
      countTimer = setInterval(paintCount, 1000)
    })
  }

  $('#open-btn').addEventListener('click', open)
  $('#roll').addEventListener('click', open)

  $('#bell').addEventListener('click', () => {
    const b = $('#bell')
    b.classList.remove('is-ringing')
    void b.offsetWidth
    b.classList.add('is-ringing')
    ringBell()
  })

  replay.addEventListener('click', () => {
    timers.forEach(clearTimeout)
    timers = []
    clearInterval(countTimer)
    replay.hidden = true
    paper.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
    stage.classList.remove('is-ready')
    later(reducedMotion() ? 0 : 700, () => stage.classList.remove('is-unroll'))
    later(reducedMotion() ? 0 : 3000, () => {
      stage.classList.remove('is-rise', 'is-untie')
      $$('.reveal', paper).forEach((el) => el.classList.remove('is-in'))
      opened = false
      later(900, () => {
        music.restart()
        opened = false
        open()
      })
    })
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
