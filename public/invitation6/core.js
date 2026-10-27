/* =============================================================================
   Invitation content and shared helpers (dates, music, countdown).
   Edit `invitationData`; every page in this folder reads from it.
   Lines marked PLACEHOLDER still need the real details.
   ========================================================================== */

'use strict'

const invitationData = {
  bride: { name: 'Kirti', surname: 'Koyani' },
  groom: { name: 'Dharmil', surname: 'Jarsaniya' },
  brideFirst: true, // Kirti & Dharmil
  monogram: ['D', 'K'],

  blessing: 'श्री गणेशाय नमः',
  openingMessage: 'Together with their families',
  inviteLine: 'request the pleasure of your company to celebrate their wedding',

  date: '2027-02-12', // PLACEHOLDER — wedding date (YYYY-MM-DD)
  time: '19:30', // PLACEHOLDER — muhurat / start time (24-hour)
  utcOffset: '+05:30', // India; used by the countdown

  venue: 'Your Venue Name', // PLACEHOLDER
  city: 'Your City', // PLACEHOLDER
  address: 'Full venue address', // PLACEHOLDER
  mapUrl: '', // leave empty to search the venue on Google Maps

  familiesMessage: 'With joy in our hearts, we invite you and your family to bless the couple as they begin their new life together.',
  families: [
    { label: 'Bride’s Family', names: ['Kishorbhai Vajubhai Koyani', 'Dimpleben Kishorbhai Koyani'] },
    { label: 'Groom’s Family', names: ['Manojbhai Premjibhai Jarsaniya', 'Naynaben Manojbhai Jarsaniya'] },
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

  story: [
    'PLACEHOLDER — a line about how you met.', // PLACEHOLDER
    'PLACEHOLDER — a line about the moment you knew.', // PLACEHOLDER
    'And now, with the blessings of our families, forever begins.',
  ],

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
}

/* ---------------------------------------------------------------- helpers */
const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const rand = (a, b) => a + Math.random() * (b - a)

// Calendar dates are read as UTC parts, so no local timezone can shift them
function parseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function longDate(day) {
  return `${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]} ${day.getUTCFullYear()}`
}

function clockLabel(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

// Everything a page displays, derived once from invitationData
function buildFields(d = invitationData) {
  const day = parseDay(d.date)
  const [first, second] = d.brideFirst ? [d.bride, d.groom] : [d.groom, d.bride]
  const digits = String(d.rsvpWhatsApp || '').replace(/\D/g, '')
  return {
    ...d,
    first,
    second,
    day,
    year: day.getUTCFullYear(),
    month: day.getUTCMonth(),
    dayNumber: day.getUTCDate(),
    monthName: MONTHS[day.getUTCMonth()],
    weekdayName: WEEKDAYS[day.getUTCDay()],
    dateLong: longDate(day),
    dateFull: `${WEEKDAYS[day.getUTCDay()]}, ${longDate(day)}`,
    timeLabel: clockLabel(d.time),
    target: Date.parse(`${d.date}T${d.time}:00${d.utcOffset}`),
    mapHref: d.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.venue}, ${d.address}, ${d.city}`)}`,
    rsvpHref: digits ? `https://wa.me/${digits}?text=${encodeURIComponent(`Namaste! RSVP for ${first.name} & ${second.name}'s wedding: `)}` : '',
    rsvpByLong: longDate(parseDay(d.rsvpBy)),
    events: d.functions.map((fn) => {
      const date = fn.main ? d.date : fn.date
      const time = fn.main ? d.time : fn.time
      const day2 = date ? parseDay(date) : null
      return {
        ...fn,
        when: day2 ? `${WEEKDAYS[day2.getUTCDay()]}, ${longDate(day2)}${time ? ` · ${clockLabel(time)}` : ''}` : 'Details to follow',
        short: day2 ? `${day2.getUTCDate()} ${MONTHS[day2.getUTCMonth()].slice(0, 3)}${time ? ` · ${clockLabel(time)}` : ''}` : 'To be announced',
        place: fn.main ? `${d.venue}, ${d.city}` : fn.venue,
      }
    }),
  }
}

function countdownParts(target, now = Date.now()) {
  const ms = Math.max(0, target - now)
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

/* ---------------------------------------------------------------- music
   Starts from a tap (browsers block autoplay with sound). The button is only
   shown once the track has actually loaded, so it is never a dead control. */
function createMusic(cfg, button, onState = () => {}) {
  const state = { ok: false, on: false, wanted: false, revealed: false, raf: 0 }
  if (!cfg || !cfg.src) return { start() {}, restart() {}, reveal() {}, get on() { return false } }
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
    cancelAnimationFrame(state.raf)
    const from = audio.volume
    const t0 = performance.now()
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms)
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * k))
      if (k < 1) state.raf = requestAnimationFrame(step)
      else if (then) then()
    }
    state.raf = requestAnimationFrame(step)
  }

  function setOn(on) {
    state.on = on
    button.setAttribute('aria-pressed', String(on))
    onState(on)
    if (on) {
      audio.play().then(() => fadeTo(cfg.volume ?? 0.6, 1600)).catch(() => {
        state.on = false
        button.setAttribute('aria-pressed', 'false')
        onState(false)
      })
    } else {
      fadeTo(0, 700, () => audio.pause())
    }
  }

  button.addEventListener('click', (e) => {
    e.stopPropagation()
    state.wanted = !state.on
    setOn(!state.on)
  })
  document.addEventListener('visibilitychange', () => {
    if (!state.on) return
    if (document.hidden) audio.pause()
    else audio.play().catch(() => {})
  })

  return {
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
    get on() {
      return state.on
    },
  }
}

/* ---------------------------------------------------------------- Ganesha line art (100 x 110) */
const GANESHA_PATHS = [
  'M40 24 L42 13 L46 15 L50 4 L54 15 L58 13 L60 24', 'M37 27 Q50 20 63 27',
  'M38 28 C33 35 33 45 40 52', 'M62 28 C67 35 67 45 60 52',
  'M37 30 C22 23 9 35 13 51 C16 63 29 66 37 56', 'M63 30 C78 23 91 35 87 51 C84 63 71 66 63 56',
  'M30 38 C24 40 22 48 27 53', 'M70 38 C76 40 78 48 73 53',
  'M42 38 Q45 35 48 38', 'M52 38 Q55 35 58 38', 'M50 28 L50 34',
  'M46 42 C44 56 46 70 54 79 C60 85 69 83 70 75 C71 70 66 68 64 72',
  'M54 42 C54 54 55 64 59 70 C62 74 64 74 65 72', 'M58 52 L66 57 L60 59',
  'M28 102 Q39 90 50 102 Q61 90 72 102', 'M24 106 H76',
]
function ganeshaSvg(cls = 'ganesha') {
  return `<svg class="${cls}" viewBox="0 0 100 110" aria-hidden="true">${GANESHA_PATHS.map((d) => `<path pathLength="1" d="${d}"/>`).join('')}</svg>`
}
