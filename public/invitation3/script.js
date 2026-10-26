/* =============================================================================
   Royal wedding invitation — content, timeline and playback
   Edit `invitationData` below; every visible value is read from it.
   Lines marked PLACEHOLDER still need the real details.
   ========================================================================== */

'use strict'

/* ---------------------------------------------------------------- content
   Dates are YYYY-MM-DD and times 24-hour HH:MM, in the venue's local time. */
const invitationData = {
  bride: { name: 'Kirti', surname: 'Koyani' },
  groom: { name: 'Dharmil', surname: 'Jarsaniya' },
  brideFirst: true, // Kirti & Dharmil
  monogram: ['D', 'K'], // letters in the logo crest: intro and door seal
  introLine: 'Wedding Invitation',

  showGanesha: true,
  blessing: 'श्री गणेशाय नमः',
  openingMessage: 'Together with their families',
  inviteLine: 'request the pleasure of your company to celebrate their wedding',

  date: '2027-02-12', // PLACEHOLDER — wedding date
  time: '19:30', // PLACEHOLDER — muhurat / start time
  utcOffset: '+05:30', // India; used by the countdown

  venue: 'Your Venue Name', // PLACEHOLDER
  city: 'Your City', // PLACEHOLDER
  address: 'Full venue address', // PLACEHOLDER
  mapUrl: '', // leave empty to search the venue on Google Maps

  familiesEyebrow: 'With the blessings of our elders',
  familiesMessage: 'We joyfully invite you and your family to grace the wedding of our children and bless the couple as they begin their new life together.',
  families: [
    { label: 'Bride’s Family', names: ['Kishorbhai Vajubhai Koyani', '& Dimpleben Kishorbhai Koyani'] },
    { label: 'Groom’s Family', names: ['Manojbhai Premjibhai Jarsaniya', '& Naynaben Manojbhai Jarsaniya'] },
  ],

  // Leave date / time / venue empty to show "Details to follow". Delete an entry to drop that function.
  functions: [
    { name: 'Ganesh Sthapana', icon: 'kalash', date: '', time: '', venue: '', dress: '' }, // PLACEHOLDER
    { name: 'Mehendi', icon: 'mehendi', date: '', time: '', venue: '', dress: '' }, // PLACEHOLDER
    { name: 'Haldi', icon: 'haldi', date: '', time: '', venue: '', dress: '' }, // PLACEHOLDER
    { name: 'Sangeet Sandhya', icon: 'sangeet', date: '', time: '', venue: '', dress: '' }, // PLACEHOLDER
    { name: 'Wedding Ceremony', icon: 'mandap', main: true, dress: '' }, // uses the main date, time and venue
    { name: 'Reception', icon: 'reception', date: '', time: '', venue: '', dress: '' }, // PLACEHOLDER
  ],

  // Empty list = section hidden
  story: [
    'PLACEHOLDER — a line about how you met.', // PLACEHOLDER
    'PLACEHOLDER — a line about the moment you knew.', // PLACEHOLDER
    'And now, with the blessings of our families, forever begins.',
  ],

  hotels: [
    { name: 'Hotel name', note: 'A short note — distance, special rate', url: '' }, // PLACEHOLDER
  ],

  gift: {
    text: 'Your presence and blessings are the most precious gift to us.',
    button: 'View gift details',
    url: '', // the button is hidden until this is set
  },

  rsvpBy: '2027-01-20', // PLACEHOLDER
  rsvpWhatsApp: '', // PLACEHOLDER — digits with country code, e.g. '919800000000'
  contacts: [
    { name: 'Contact name', phone: '' }, // PLACEHOLDER
  ],
  closingMessage: 'We look forward to celebrating with you',

  music: {
    src: 'assets/audio/wedding-loop.mp3', // original loop (scripts/invitation-music.py); swap in your own file here
    volume: 0.6,
  },

  autoTour: true, // after the reveal, glide through every section
}

/* ---------------------------------------------------------------- timing (ms from the tap) */
const TIMELINE = {
  tap: 0, // the seal glows
  light: 450, // a line of light opens down the seam
  doors: 1000, // doors swing inward, petals burst out
  through: 2700, // light floods, the camera moves through the arch
  card: 3400, // frame, corners, flowers and Ganesha draw in
  text: 4500, // names are written in gold, then date and venue
  ready: 10000, // scrolling unlocked, controls in
  tour: 12000,
}

const TIMELINE_REDUCED = { tap: 0, light: 50, doors: 100, through: 300, card: 500, text: 700, ready: 1500, tour: null }

// The DK crest that opens the page, before the doors
const INTRO = { draw: 150, docked: 4600, done: 6000 }
const INTRO_REDUCED = { draw: 0, docked: 1200, done: 1700 }

/* ---------------------------------------------------------------- helpers */
const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Calendar dates are read as UTC parts, so no local timezone can shift them
function parseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function longDate(day) {
  return `${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]} ${day.getUTCFullYear()}`
}

function fullDate(iso) {
  const day = parseDay(iso)
  return `${WEEKDAYS[day.getUTCDay()]}, ${longDate(day)}`
}

function clockLabel(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

const rand = (a, b) => a + Math.random() * (b - a)

/* ---------------------------------------------------------------- derived fields */
function buildFields(d) {
  const day = parseDay(d.date)
  const [first, second] = d.brideFirst ? [d.bride, d.groom] : [d.groom, d.bride]
  const digits = String(d.rsvpWhatsApp || '').replace(/\D/g, '')
  return {
    ...d,
    firstName: first.name,
    firstSurname: first.surname,
    secondName: second.name,
    secondSurname: second.surname,
    firstInitial: first.name.charAt(0),
    secondInitial: second.name.charAt(0),
    introNames: `${first.name} & ${second.name}`,
    monthName: MONTHS[day.getUTCMonth()],
    dayNumber: String(day.getUTCDate()),
    weekdayName: WEEKDAYS[day.getUTCDay()],
    yearNumber: String(day.getUTCFullYear()),
    dateLong: longDate(day),
    timeLabel: clockLabel(d.time),
    mapUrl: d.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.venue}, ${d.address}, ${d.city}`)}`,
    rsvpUrl: digits
      ? `https://wa.me/${digits}?text=${encodeURIComponent(`Namaste! RSVP for ${first.name} & ${second.name}'s wedding: `)}`
      : '',
    rsvpBy: longDate(parseDay(d.rsvpBy)),
    giftText: d.gift.text,
    giftButton: d.gift.button,
    giftUrl: d.gift.url,
  }
}

/* ---------------------------------------------------------------- artwork */
function paintArt() {
  const [m1, m2] = invitationData.monogram
  $('#art-defs').innerHTML = `${Art.defs()}<g id="door-art">${Art.doors(m1, m2)}</g>`
  const inner = (svg) => svg.replace(/^<svg[^>]*>|<\/svg>$/g, '')

  const painters = {
    facade: () => Art.facade(),
    monogram: () => Art.monogram(m1, m2),
    watermark: () => Art.mandala(0, 0, 190, '#d4ae58', 1),
    mandala: () => Art.mandala(0, 0, 190),
    corner: () => Art.corner(),
    cluster: (el) => {
      const flip = { x: 'translate(300 0) scale(-1 1)', y: 'translate(0 300) scale(1 -1)' }[el.dataset.flip] || ''
      return `<g transform="${flip}"><g class="sway">${Art.cluster(Number(el.dataset.seed) || 1, 290)}</g></g>`
    },
    ganesha: () => Art.ganesha(),
    divider: () => inner(Art.divider()),
    garland: () => Art.swag(0, 300, 12, 70, 3) + Art.swag(300, 600, 12, 56, 4) + Art.swag(600, 900, 12, 70, 5),
    wreath: () => Art.wreath(128),
    diyas: () => Art.diyaRow(),
    arch: () =>
      `<path d="${Art.arch(10, 290, 190, 20, 392, 7, 9)}" fill="url(#gEmeraldR)" stroke="url(#gGold)" stroke-width="2.5"/>` +
      `<path d="${Art.arch(24, 276, 192, 38, 378, 7, 8)}" fill="none" stroke="#c9a24b" stroke-width="1"/>` +
      Art.mandala(150, 112, 44) +
      `<g transform="translate(16 392) scale(.32 -.32)">${Art.cluster(51, 290)}</g>` +
      `<g transform="translate(284 392) scale(-.32 -.32)">${Art.cluster(52, 290)}</g>`,
  }

  $$('[data-art]').forEach((el) => {
    const paint = painters[el.dataset.art]
    if (paint) el.innerHTML = paint(el)
  })

  if (!invitationData.showGanesha) {
    $('.ganesha').remove()
    $('.shloka').remove()
  }
}

/* ---------------------------------------------------------------- content */
function render(fields) {
  document.title = `${fields.firstName} & ${fields.secondName} — Wedding Invitation`

  $$('[data-field]').forEach((el) => {
    el.textContent = fields[el.dataset.field] ?? ''
  })

  // A control without a destination is hidden, never left dead
  $$('[data-href]').forEach((el) => {
    const href = fields[el.dataset.href]
    if (href) el.href = href
    else el.hidden = true
  })

  $('[data-list="families"]').innerHTML = fields.families
    .map(
      (f, i) => `<div class="family reveal" style="--d: ${i + 4}">
        <p class="caps family__label">${escapeHtml(f.label)}</p>
        <p class="family__names">${f.names.map(escapeHtml).join('<br />')}</p></div>`,
    )
    .join('')

  $('[data-list="functions"]').innerHTML = fields.functions
    .map((fn, i) => {
      const date = fn.main ? fields.date : fn.date
      const time = fn.main ? fields.time : fn.time
      const venue = fn.main ? `${fields.venue}, ${fields.city}` : fn.venue
      const when = date ? `${fullDate(date)}${time ? ` · ${clockLabel(time)}` : ''}` : 'Details to follow'
      return `<article class="event reveal reveal--rise" style="--d: ${i % 2 + 2}">
        <span class="event__icon">${Art.icon(fn.icon)}</span>
        <h3 class="event__name">${escapeHtml(fn.name)}</h3>
        <p class="caps event__when">${escapeHtml(when)}</p>
        ${venue ? `<p class="event__venue">${escapeHtml(venue)}</p>` : ''}
        ${fn.dress ? `<p class="event__dress">Dress code · ${escapeHtml(fn.dress)}</p>` : ''}
      </article>`
    })
    .join('')

  $('[data-list="story"]').innerHTML = fields.story
    .map((p, i) => `<p class="reveal" style="--d: ${i + 2}">${escapeHtml(p)}</p>`)
    .join('')

  $('[data-list="hotels"]').innerHTML = fields.hotels
    .map(
      (h, i) => `<article class="hotel reveal" style="--d: ${i + 2}">
        <h3 class="hotel__name">${escapeHtml(h.name)}</h3>
        ${h.note ? `<p class="hotel__note">${escapeHtml(h.note)}</p>` : ''}
        ${h.url ? `<a class="btn" href="${escapeHtml(h.url)}" target="_blank" rel="noopener">Book your stay</a>` : ''}
      </article>`,
    )
    .join('')

  $('[data-list="contacts"]').innerHTML = fields.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')

  // Optional sections disappear when their content is empty
  $$('[data-optional]').forEach((section) => {
    const v = fields[section.dataset.optional]
    if (!v || (Array.isArray(v) && v.length === 0)) section.remove()
  })
}

/* ---------------------------------------------------------------- ambient particles */
function seedParticles() {
  for (const dust of $$('.dust, .intro__dust')) {
    for (let i = 0; i < 18; i++) {
      const m = document.createElement('i')
      m.className = 'mote'
      m.style.cssText = `--x:${rand(4, 96).toFixed(1)}%;--s:${rand(0.6, 1.6).toFixed(2)}cqw;--t:${rand(7, 13).toFixed(1)}s;--delay:${(-rand(0, 12)).toFixed(1)}s;--sway:${rand(-8, 8).toFixed(1)}cqw`
      dust.append(m)
    }
  }

  const sparkles = $('.sparkles')
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('i')
    s.className = 'sparkle'
    s.innerHTML = '<svg viewBox="-10 -10 20 20"><use href="#star"/></svg>'
    s.style.cssText = `--x:${rand(12, 84).toFixed(1)}%;--y:${rand(26, 60).toFixed(1)}%;--s:${rand(2, 4).toFixed(1)}cqw;--t:${rand(2.4, 4).toFixed(1)}s;--delay:${rand(0, 3).toFixed(1)}s`
    sparkles.append(s)
  }

  const card = $('#card')
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('i')
    p.className = 'drift-petal'
    p.setAttribute('aria-hidden', 'true')
    p.style.cssText = `--x:${(i * 11 + rand(0, 6)).toFixed(1)}%;--s:${rand(2.4, 4).toFixed(2)}cqw;--t:${rand(9, 14).toFixed(1)}s;--delay:${(i * 1.3).toFixed(1)}s;--sway:${rand(-10, 10).toFixed(1)}cqw`
    card.append(p)
  }
}

// Petals and marigold flowers thrown out as the doors open
function burstPetals() {
  const burst = $('.burst')
  const colours = [
    'radial-gradient(circle at 35% 35%, #fdeef1, #f2b9c6 60%, #e39aaa)',
    'radial-gradient(circle at 35% 35%, #fff4f6, #f6c9d3 70%)',
    'radial-gradient(circle at 40% 40%, #ffd27a, #f29a2e)',
    'radial-gradient(circle at 40% 40%, #fff0a6, #f5c542)',
    'radial-gradient(circle at 40% 40%, #fff, #f3e0a1)',
  ]
  const frag = document.createDocumentFragment()
  for (let i = 0; i < 40; i++) {
    const a = rand(0, Math.PI * 2)
    const dist = rand(18, 62)
    const p = document.createElement('i')
    p.className = 'burst__petal'
    p.style.cssText =
      `--x:${(Math.cos(a) * dist).toFixed(1)}cqw;--y:${(Math.sin(a) * dist * 1.2 - 12).toFixed(1)}cqw;` +
      `--r:${rand(-260, 260).toFixed(0)}deg;--s:${rand(2.2, 4.6).toFixed(2)}cqw;--t:${rand(2.8, 4.2).toFixed(2)}s;` +
      `--delay:${rand(0, 0.35).toFixed(2)}s;--c:${colours[i % colours.length]}`
    frag.append(p)
  }
  burst.append(frag)
}

/* ---------------------------------------------------------------- countdown */
function createCountdown(fields) {
  const target = Date.parse(`${fields.date}T${fields.time}:00${fields.utcOffset}`)
  const out = Object.fromEntries($$('[data-count]').map((el) => [el.dataset.count, el]))
  let timer = 0
  let raf = 0

  function parts(now) {
    const ms = Math.max(0, target - now)
    return {
      days: Math.floor(ms / 86400000),
      hours: Math.floor(ms / 3600000) % 24,
      minutes: Math.floor(ms / 60000) % 60,
      seconds: Math.floor(ms / 1000) % 60,
    }
  }

  function paint(p) {
    for (const k in p) out[k].textContent = String(p[k]).padStart(2, '0')
  }

  return {
    // Count up from zero once, then tick live every second
    start(reduced) {
      this.stop()
      const final = parts(Date.now())
      if (reduced) {
        paint(final)
      } else {
        const t0 = performance.now()
        const step = (t) => {
          const k = Math.min(1, (t - t0) / 1800)
          const e = 1 - Math.pow(1 - k, 3)
          paint(Object.fromEntries(Object.entries(final).map(([key, v]) => [key, Math.round(v * e)])))
          if (k < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      }
      timer = setTimeout(function tick() {
        paint(parts(Date.now()))
        timer = setTimeout(tick, 1000 - (Date.now() % 1000))
      }, reduced ? 1000 : 1900)
    },
    stop() {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
      paint({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    },
  }
}

/* ---------------------------------------------------------------- music */
function createMusic(cfg, button) {
  const state = { ok: false, on: false, wanted: false, revealed: false, fadeRaf: 0 }
  if (!cfg || !cfg.src) return { start() {}, restart() {}, reveal() {} }

  const audio = new Audio()
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0
  audio.addEventListener('canplay', () => {
    state.ok = true
    if (state.revealed) button.hidden = false
  }, { once: true })
  audio.addEventListener('error', () => {
    state.ok = false
    button.hidden = true
  })
  audio.src = cfg.src

  function fadeTo(target, ms, then) {
    cancelAnimationFrame(state.fadeRaf)
    const from = audio.volume
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms)
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * k))
      if (k < 1) state.fadeRaf = requestAnimationFrame(step)
      else if (then) then()
    }
    state.fadeRaf = requestAnimationFrame(step)
  }

  function setOn(on) {
    state.on = on
    button.setAttribute('aria-pressed', String(on))
    if (on) {
      audio.play().then(() => fadeTo(cfg.volume ?? 0.6, 1600)).catch(() => {
        state.on = false
        button.setAttribute('aria-pressed', 'false')
      })
    } else {
      fadeTo(0, 700, () => audio.pause())
    }
  }

  button.addEventListener('click', () => {
    state.wanted = !state.on
    setOn(!state.on)
  })

  document.addEventListener('visibilitychange', () => {
    if (!state.on) return
    if (document.hidden) audio.pause()
    else audio.play().catch(() => {})
  })

  return {
    // Must run inside the tap handler so browsers allow playback
    start() {
      state.wanted = true
      setOn(true)
    },
    restart() {
      if (!state.wanted) return
      audio.currentTime = 0
      audio.volume = 0
      setOn(true)
    },
    reveal() {
      state.revealed = true
      if (state.ok) button.hidden = false
    },
  }
}

/* ---------------------------------------------------------------- auto tour
   Glides through every section, holding on each. Any wheel, touch or key
   from the guest hands control straight back. */
function createTour(scroller) {
  let raf = 0
  let timer = 0
  let active = false

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  function stops() {
    const view = scroller.clientHeight
    const max = scroller.scrollHeight - view
    const list = []
    for (const s of $$('.scroller > section:not(.hero)')) {
      let y = s.offsetTop
      const end = s.offsetTop + s.offsetHeight - view
      list.push({ y: Math.min(y, max), hold: 2600 })
      while (y + view * 0.7 < end) {
        y += view * 0.7
        list.push({ y: Math.min(y, max), hold: 2200 })
      }
    }
    list.push({ y: max, hold: 0 })
    return list.filter((s, i, a) => i === 0 || Math.abs(s.y - a[i - 1].y) > 8)
  }

  function glide(to, done) {
    const from = scroller.scrollTop
    const dur = Math.max(900, Math.min(2300, (Math.abs(to - from) / scroller.clientHeight) * 1500))
    const t0 = performance.now()
    const step = (t) => {
      if (!active) return
      const k = Math.min(1, (t - t0) / dur)
      scroller.scrollTop = from + (to - from) * ease(k)
      if (k < 1) raf = requestAnimationFrame(step)
      else done()
    }
    raf = requestAnimationFrame(step)
  }

  function stop() {
    active = false
    cancelAnimationFrame(raf)
    clearTimeout(timer)
  }

  for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    scroller.addEventListener(type, stop, { passive: true })
  }

  return {
    play() {
      stop()
      active = true
      const list = stops()
      let i = 0
      const next = () => {
        if (!active || i >= list.length) return stop()
        const { y, hold } = list[i++]
        glide(y, () => {
          timer = setTimeout(next, hold)
        })
      }
      next()
    },
    stop,
  }
}

/* ---------------------------------------------------------------- the player */
function init() {
  const stage = $('#stage')
  const scroller = $('#scroller')
  const palace = $('#palace')
  const openBtn = $('#open-btn')
  const replayBtn = $('#replay-btn')
  const soundBtn = $('#sound-btn')
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  let fields
  try {
    paintArt()
    fields = buildFields(invitationData)
    render(fields)
    seedParticles()
  } catch (err) {
    console.error('Invitation: check invitationData in script.js —', err)
    return
  }

  const sections = $$('.scroller > section:not(.hero)')
  const countdown = createCountdown(fields)
  const music = createMusic(invitationData.music, soundBtn)
  const tour = createTour(scroller)

  // A run token makes timers left over from an earlier play harmless
  let run = 0
  let timers = []
  let opened = false
  let guestScrolled = false

  const STATES = ['is-intro', 'is-docked', 'is-intro-done', 'is-tap', 'is-light', 'is-doors', 'is-through', 'is-card', 'is-text', 'is-ready']
  const intro = $('#intro')
  let introDone = false

  for (const type of ['wheel', 'touchstart', 'keydown']) {
    scroller.addEventListener(type, () => (guestScrolled = true), { passive: true })
  }

  function schedule(ms, fn) {
    const token = run
    timers.push(setTimeout(() => token === run && fn(), ms))
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || e.target.classList.contains('is-in')) continue
        e.target.classList.add('is-in')
        if (e.target.id === 'countdown') countdown.start(reducedQuery.matches)
      }
    },
    { root: scroller, threshold: 0.15 },
  )
  sections.forEach((s) => io.observe(s))

  function play() {
    const t = reducedQuery.matches ? TIMELINE_REDUCED : TIMELINE
    opened = true
    guestScrolled = false
    schedule(t.tap, () => stage.classList.add('is-tap'))
    schedule(t.light, () => stage.classList.add('is-light'))
    schedule(t.doors, () => {
      stage.classList.add('is-doors')
      if (!reducedQuery.matches) burstPetals()
    })
    schedule(t.through, () => stage.classList.add('is-through'))
    schedule(t.card, () => stage.classList.add('is-card'))
    schedule(t.text, () => stage.classList.add('is-text'))
    schedule(t.ready, () => {
      stage.classList.add('is-ready')
      stage.classList.remove('is-sealed')
      palace.setAttribute('aria-hidden', 'true')
      replayBtn.hidden = false
      music.reveal()
      scroller.focus({ preventScroll: true })
    })
    if (invitationData.autoTour && t.tour !== null) {
      schedule(t.tour, () => !guestScrolled && tour.play())
    }
  }

  function reset() {
    run++
    timers.forEach(clearTimeout)
    timers = []
    tour.stop()
    countdown.stop()
    $('.burst').replaceChildren()
    stage.classList.add('is-resetting')
    stage.classList.remove(...STATES)
    stage.classList.add('is-sealed')
    sections.forEach((s) => {
      s.classList.remove('is-in')
      io.unobserve(s)
      io.observe(s)
    })
    palace.removeAttribute('aria-hidden')
    scroller.scrollTop = 0
    void stage.offsetWidth // commit the reset frame before transitions return
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('is-resetting')))
  }

  // The crest draws itself, then shrinks into the door seal. `then` runs once it has docked.
  function playIntro(then) {
    const t = reducedQuery.matches ? INTRO_REDUCED : INTRO
    introDone = false
    schedule(t.draw, () => stage.classList.add('is-intro'))
    schedule(t.docked, () => stage.classList.add('is-docked'))
    schedule(t.done, () => {
      stage.classList.add('is-intro-done')
      introDone = true
      if (then) then()
    })
  }

  // A tap during the crest skips straight to the doors, then opens them
  function skipIntro() {
    run++
    timers.forEach(clearTimeout)
    timers = []
    stage.classList.add('is-intro', 'is-docked')
    schedule(500, () => {
      stage.classList.add('is-intro-done')
      introDone = true
      play()
    })
  }

  function open() {
    if (opened) return
    music.start()
    if (introDone) play()
    else {
      opened = true
      skipIntro()
    }
  }

  intro.addEventListener('click', open)
  palace.addEventListener('click', open)
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    open()
  })

  replayBtn.addEventListener('click', () => {
    reset()
    opened = true
    music.restart()
    // Replay the crest, then open the doors on their own
    playIntro(() => schedule(700, play))
  })

  playIntro()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
