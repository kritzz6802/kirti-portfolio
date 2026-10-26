/* =============================================================================
   Wedding invitation — content, timeline and playback
   Edit `invitationData` below; every visible value is read from it.
   ========================================================================== */

'use strict'

/* ---------------------------------------------------------------- content
   Placeholders — replace with the real details. Dates are YYYY-MM-DD and
   times are 24-hour HH:MM, both in the venue's local time. */
const invitationData = {
  occasion: 'Wedding Invitation',
  openingMessage: 'We invite you to celebrate our wedding',
  personOneName: 'Kirti Koyani',
  personTwoName: 'Dharmil Jarsaniya',

  date: '2027-07-27',
  time: '17:30',
  utcOffset: '+05:30', // venue's offset from UTC, used by the countdown

  venue: 'Your Venue',
  city: 'Your City',
  address: 'Your Venue Address',
  mapUrl: '', // leave empty to search the venue and address on Google Maps

  story: [
    'Replace this paragraph with how your story began — where you met, and what you noticed first.',
    'Add a second line about the days that followed: the conversations, the trips, the small rituals.',
    'Somewhere along the way, a favourite place became being by each other’s side.',
    'And now we are ready for our greatest adventure yet — a lifetime together.',
  ],

  programIntro: 'Our wedding day, from sunset drinks to the last dance.',
  program: [
    { time: '17:30', title: 'Guests arrival & welcome drinks', icon: 'cheers' },
    { time: '18:00', title: 'Ceremony', icon: 'rings' },
    { time: '19:00', title: 'Cocktail hour', icon: 'bouquet' },
    { time: '20:30', title: 'Dinner', icon: 'dinner' },
    { time: '22:00', title: 'Cake & toasts', icon: 'cake' },
    { time: '22:30', title: 'First dance', icon: 'dance' },
    { time: '00:00', title: 'Party until late', icon: 'moon' },
  ],

  dressCode: 'Black tie',
  dressNote: 'Add a note on attire here — colours to wear, or to avoid.',

  soiree: {
    title: 'Welcome Soirée',
    date: '2027-07-26',
    time: '19:00',
    venue: 'Your Soirée Venue',
    text: 'Join us for an intimate evening of cocktails the night before the wedding.',
  },

  hotels: [
    { tag: 'Exclusive wedding rate', name: 'Your Hotel Name', note: 'A short line about the hotel', price: '', url: '' },
    { tag: 'Walking distance', name: 'Second Hotel Name', note: 'A short line about the hotel', price: '', url: '' },
  ],

  gift: {
    text: 'Your presence is the greatest gift. If you wish to honour us with a gift, a note on your preference goes here.',
    button: 'View bank details',
    url: '', // the button is hidden until this is set
  },

  rsvpBy: '2027-05-01',
  rsvpUrl: 'mailto:your-email@example.com?subject=RSVP',
  additionalMessage: 'We warmly invite you to celebrate with us.',
  hostNames:
    'Kishorbhai Vajubhai Koyani & Dimpleben Kishorbhai Koyani\nManojbhai Premjibhai Jarsaniya & Naynaben Manojbhai Jarsaniya',
  contact: 'Your Contact Details',

  music: {
    src: 'assets/audio/wedding-loop.mp3', // original loop (scripts/invitation-music.py); swap in your own file here
    volume: 0.6,
  },

  autoTour: true, // after the reveal, glide through the sections like the reference reel
}

/* ---------------------------------------------------------------- timing (ms from the tap) */
const TIMELINE = {
  untie: 0, // bow slips, ribbon slides apart
  flaps: 1250, // top, side and bottom flaps fold open
  open: 3500, // envelope lifts away, painting blooms in from the edges
  text: 4200, // names, invitation line, date and venue
  ready: 8400, // scrolling unlocked, controls in
  tour: 10200, // auto tour starts
}

const TIMELINE_REDUCED = { untie: 0, flaps: 150, open: 600, text: 800, ready: 1600, tour: null }

/* ---------------------------------------------------------------- helpers */
const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Calendar dates are parsed as UTC parts so no local timezone can shift them.
function parseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function addDays(day, n) {
  return new Date(day.getTime() + n * 86400000)
}

function longDate(day) {
  return `${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]} ${day.getUTCFullYear()}`
}

function clockLabel(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}

function mapsSearch(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

function svgUse(id, cls) {
  return `<svg class="${cls}" viewBox="0 0 36 32" aria-hidden="true"><use href="#${id}"></use></svg>`
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

/* ---------------------------------------------------------------- derived fields */
function buildFields(d) {
  const day = parseDay(d.date)
  const soireeDay = parseDay(d.soiree.date)
  return {
    ...d,
    monthName: MONTHS[day.getUTCMonth()],
    dayNumber: String(day.getUTCDate()),
    weekdayName: WEEKDAYS[day.getUTCDay()],
    yearNumber: String(day.getUTCFullYear()),
    dayMonth: `${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]}`,
    dateLong: longDate(day),
    dateFull: `${WEEKDAYS[day.getUTCDay()]}, ${longDate(day)}`,
    dayMinus2: String(addDays(day, -2).getUTCDate()),
    dayMinus1: String(addDays(day, -1).getUTCDate()),
    dayPlus1: String(addDays(day, 1).getUTCDate()),
    dayPlus2: String(addDays(day, 2).getUTCDate()),
    time: clockLabel(d.time),
    venueShort: `${d.venue}, ${d.city}`,
    mapUrl: d.mapUrl || mapsSearch(`${d.venue}, ${d.address}`),
    soireeTitle: d.soiree.title,
    soireeWhen: `${WEEKDAYS[soireeDay.getUTCDay()]} ${soireeDay.getUTCDate()} ${MONTHS[soireeDay.getUTCMonth()]} · ${clockLabel(d.soiree.time)}`,
    soireeVenue: d.soiree.venue,
    soireeText: d.soiree.text,
    giftText: d.gift.text,
    giftButton: d.gift.button,
    giftUrl: d.gift.url,
    rsvpBy: longDate(parseDay(d.rsvpBy)),
  }
}

/* ---------------------------------------------------------------- render content */
function splitInto(el, text, unit) {
  el.textContent = ''
  el.setAttribute('aria-label', text)
  const parts = unit === 'char' ? [...text] : text.split(/(\s+)/)
  let i = 0
  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      el.append(part)
      continue
    }
    const span = document.createElement('span')
    span.className = unit === 'char' ? 'ch' : 'word'
    span.setAttribute('aria-hidden', 'true')
    span.style.setProperty('--i', i++)
    span.textContent = part === ' ' ? ' ' : part
    el.append(span)
  }
}

function render(fields) {
  document.title = `${fields.personOneName} & ${fields.personTwoName} — ${fields.occasion}`

  $$('[data-field]').forEach((el) => {
    const value = fields[el.dataset.field] ?? ''
    if (el.hasAttribute('data-split')) splitInto(el, value, 'char')
    else if (el.hasAttribute('data-words')) splitInto(el, value, 'word')
    else el.textContent = value
  })

  // The second name starts after the first and the ampersand
  const names = $$('.hero__names .name')
  if (names[1]) names[1].style.setProperty('--base', `${fields.personOneName.length * 55 + 500}ms`)

  // Links: a control without a destination is hidden, never left dead
  $$('[data-href]').forEach((el) => {
    const href = fields[el.dataset.href]
    if (href) el.href = href
    else el.hidden = true
  })

  $('[data-list="story"]').innerHTML = fields.story
    .map((p, i) => `<p class="reveal" style="--d: ${i + 1}">${escapeHtml(p)}</p>`)
    .join('')

  $('[data-list="program"]').innerHTML = fields.program
    .map(
      (item, i) => `
      <li class="reveal" style="--d: ${i + 4}">
        <span class="tl-text"><span class="tl-time">${escapeHtml(clockLabel(item.time))}</span><span class="tl-title">${escapeHtml(item.title)}</span></span>
        ${svgUse(`ic-${item.icon}`, 'tl-icon')}
      </li>`,
    )
    .join('')

  $('[data-list="hotels"]').innerHTML = fields.hotels
    .map(
      (h, i) => `
      <article class="hotel reveal" style="--d: ${i + 2}">
        <img class="hotel__sprig" src="assets/illustrations/blossom-sprig.svg" alt="" aria-hidden="true" />
        ${h.tag ? `<span class="caps hotel__tag">${escapeHtml(h.tag)}</span>` : ''}
        <h3 class="hotel__name">${escapeHtml(h.name)}</h3>
        ${h.note ? `<p class="hotel__note">${escapeHtml(h.note)}</p>` : ''}
        ${h.price ? `<p class="hotel__price">${escapeHtml(h.price)}</p>` : ''}
        ${h.url ? `<a class="btn" href="${escapeHtml(h.url)}" target="_blank" rel="noopener">Book your stay</a>` : ''}
      </article>`,
    )
    .join('')

  // Falling petals for the soirée: a fixed, small set keeps mobile smooth
  const petals = $('.petals')
  petals.innerHTML = ''
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('i')
    p.className = 'petal'
    p.style.setProperty('--x', `${(i * 8.3 + Math.random() * 6).toFixed(1)}%`)
    p.style.setProperty('--s', `${(2.2 + Math.random() * 2).toFixed(2)}cqw`)
    p.style.setProperty('--t', `${(7 + Math.random() * 5).toFixed(1)}s`)
    p.style.setProperty('--delay', `${(-Math.random() * 10).toFixed(1)}s`)
    p.style.setProperty('--sway', `${(Math.random() * 16 - 8).toFixed(1)}cqw`)
    petals.append(p)
  }
}

/* ---------------------------------------------------------------- countdown */
function createCountdown(fields) {
  const target = Date.parse(`${fields.date}T${invitationData.time}:00${fields.utcOffset}`)
  const out = Object.fromEntries($$('[data-count]').map((el) => [el.dataset.count, el]))
  let timer = null
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
    for (const k in p) out[k].textContent = String(p[k])
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
        const dur = 1800
        const step = (t) => {
          const k = Math.min(1, (t - t0) / dur)
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
  const state = { ok: false, on: false, wanted: false, fadeRaf: 0 }
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
    if (document.hidden && state.on) {
      audio.pause()
    } else if (!document.hidden && state.on) {
      audio.play().catch(() => {})
    }
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
   Glides through every section like the reference reel, holding on each.
   Any wheel, touch or key from the viewer hands control straight back. */
function createTour(scroller) {
  let raf = 0
  let timer = 0
  let active = false
  let onDone = null

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  function stops() {
    const view = scroller.clientHeight
    const max = scroller.scrollHeight - view
    const list = []
    for (const s of $$('.scroller > section:not(.hero)')) {
      let y = s.offsetTop
      const end = s.offsetTop + s.offsetHeight - view
      list.push({ y: Math.min(y, max), hold: 2400 })
      while (y + view * 0.7 < end) {
        y += view * 0.7
        list.push({ y: Math.min(y, max), hold: 2000 })
      }
    }
    list.push({ y: max, hold: 0 })
    return list.filter((s, i, a) => i === 0 || Math.abs(s.y - a[i - 1].y) > 8)
  }

  function glide(to, done) {
    const from = scroller.scrollTop
    const dist = Math.abs(to - from)
    const dur = Math.max(900, Math.min(2300, (dist / scroller.clientHeight) * 1500))
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
    if (!active) return
    active = false
    cancelAnimationFrame(raf)
    clearTimeout(timer)
    if (onDone) onDone()
  }

  for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
    scroller.addEventListener(type, stop, { passive: true })
  }

  return {
    play(done) {
      stop()
      active = true
      onDone = done
      const list = stops()
      let i = 0
      const next = () => {
        if (!active) return
        if (i >= list.length) return stop()
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
  const envelope = $('#envelope')
  const openBtn = $('#open-btn')
  const replayBtn = $('#replay-btn')
  const soundBtn = $('#sound-btn')
  const sections = $$('.scroller > section:not(.hero)')
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  let fields
  try {
    fields = buildFields(invitationData)
    render(fields)
  } catch (err) {
    console.error('Invitation: check invitationData in script.js —', err)
    return
  }

  const countdown = createCountdown(fields)
  const music = createMusic(invitationData.music, soundBtn)
  const tour = createTour(scroller)

  // A run token makes stale timers from an earlier play harmless
  let run = 0
  let timers = []
  let opened = false

  const STATES = ['is-untie', 'is-flaps', 'is-open', 'is-text', 'is-ready']

  // A viewer who starts scrolling before the tour begins keeps control
  let viewerScrolled = false
  for (const type of ['wheel', 'touchstart', 'keydown']) {
    scroller.addEventListener(type, () => (viewerScrolled = true), { passive: true })
  }

  function schedule(ms, fn) {
    const token = run
    timers.push(setTimeout(() => token === run && fn(), ms))
  }

  // Sections reveal as they enter the stage's scroll area
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || e.target.classList.contains('is-in')) continue
        e.target.classList.add('is-in')
        if (e.target.id === 'countdown') countdown.start(reducedQuery.matches)
      }
    },
    { root: scroller, threshold: 0.18 },
  )
  sections.forEach((s) => io.observe(s))

  function play() {
    const t = reducedQuery.matches ? TIMELINE_REDUCED : TIMELINE
    opened = true
    viewerScrolled = false
    schedule(t.untie, () => stage.classList.add('is-untie'))
    schedule(t.flaps, () => stage.classList.add('is-flaps'))
    schedule(t.open, () => stage.classList.add('is-open'))
    schedule(t.text, () => stage.classList.add('is-text'))
    schedule(t.ready, () => {
      stage.classList.add('is-ready')
      stage.classList.remove('is-sealed')
      envelope.setAttribute('aria-hidden', 'true')
      replayBtn.hidden = false
      music.reveal()
      scroller.focus({ preventScroll: true })
    })
    if (invitationData.autoTour && t.tour !== null) {
      schedule(t.tour, () => !viewerScrolled && tour.play())
    }
  }

  function reset() {
    run++
    timers.forEach(clearTimeout)
    timers = []
    tour.stop()
    countdown.stop()
    stage.classList.add('is-resetting')
    stage.classList.remove(...STATES)
    stage.classList.add('is-sealed')
    sections.forEach((s) => s.classList.remove('is-in'))
    envelope.removeAttribute('aria-hidden')
    scroller.scrollTop = 0
    void stage.offsetWidth // commit the reset frame before transitions return
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('is-resetting')))
    // re-observe so sections reveal again on the next pass
    sections.forEach((s) => {
      io.unobserve(s)
      io.observe(s)
    })
  }

  function open() {
    if (opened) return
    music.start()
    play()
  }

  envelope.addEventListener('click', open)
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    open()
  })

  replayBtn.addEventListener('click', () => {
    reset()
    opened = false
    music.restart()
    // Replay shows the closed envelope for a beat, then opens it again
    schedule(900, () => {
      opened = true
      play()
    })
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
