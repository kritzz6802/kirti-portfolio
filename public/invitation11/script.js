/* =============================================================================
   Coming Soon — a Bollywood premiere: curtains, film leader, title card,
   poster, cast, showtimes, trailer subtitles, marquee, seat booking, credits.
   Content lives in core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const TIMING = { curtain: 100, leader: 1400, title: 6600, ready: 8600 }
const TIMING_REDUCED = { curtain: 0, leader: 50, title: 100, ready: 300 }

/* ---------------------------------------------------------------- poster art: two silhouettes under a burst */
function posterArt() {
  const rays = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2
    return `<path d="M150 150 L${150 + Math.cos(a) * 320} ${150 + Math.sin(a) * 320} L${150 + Math.cos(a + 0.13) * 320} ${150 + Math.sin(a + 0.13) * 320}Z" fill="${i % 2 ? '#e8452c' : '#f26a2e'}"/>`
  }).join('')
  return `<defs><radialGradient id="glow" cx="50%" cy="38%" r="60%"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".4" stop-color="#f2c14e" stop-opacity=".9"/><stop offset="1" stop-color="#f2c14e" stop-opacity="0"/></radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#120a0c" stop-opacity="0"/><stop offset="1" stop-color="#120a0c"/></linearGradient></defs>
    <rect width="300" height="400" fill="#c9302c"/>${rays}
    <circle cx="150" cy="150" r="140" fill="url(#glow)"/>
    <g fill="#2a0f12">
      <path d="M118 400 L114 300 C110 270 118 246 132 236 C124 226 122 210 128 200 C134 190 150 188 156 200 C160 210 156 224 148 232 C164 244 170 268 166 300 L162 400Z"/>
      <path d="M150 400 L156 296 C160 268 172 250 186 244 C178 232 178 218 186 208 C194 200 208 202 212 214 C214 226 206 236 198 240 C214 250 222 272 218 300 L210 400Z"/>
      <path d="M180 214 C196 206 214 212 220 228 L230 330 C232 360 226 400 226 400 L196 400 C200 340 196 280 190 252Z" opacity=".75"/>
    </g>
    <path d="M140 262 Q160 252 178 262" stroke="#f2c14e" stroke-width="3" fill="none"/>
    <rect width="300" height="400" fill="url(#fade)"/>`
}

/* ---------------------------------------------------------------- fill the page */
function paint() {
  $$('[data-art="poster"]').forEach((el) => (el.innerHTML = posterArt()))
  $$('[data-art-html="ganesha"]').forEach((el) => (el.outerHTML = ganeshaSvg()))
  const short = `${F.dayNumber} ${F.monthName.slice(0, 3).toUpperCase()} ${F.year}`
  const fields = {
    ...F,
    firstName: F.first.name,
    secondName: F.second.name,
    production: `A ${F.first.surname} × ${F.second.surname} Production`,
    dateShort: short,
    billing: `${F.families[0].names.join(' & ')} and ${F.families[1].names.join(' & ')} present · Starring ${F.first.name} ${F.first.surname} and ${F.second.name} ${F.second.surname} · Featuring everyone we love`,
    shloka: `॥ ${F.blessing} ॥`,
    venueCaps: F.venue.toUpperCase(),
    cityCaps: F.city.toUpperCase(),
    dateCaps: `${short} · ${F.timeLabel}`,
    calHref: calendarHref(F),
  }
  $$('[data-field]').forEach((el) => (el.textContent = fields[el.dataset.field] ?? ''))
  $$('[data-href]').forEach((el) => {
    const href = fields[el.dataset.href]
    if (href) el.href = href
    else el.hidden = true
  })
  document.title = `Coming Soon — ${F.first.name} & ${F.second.name} · A Love Story`

  // cast: the couple as leads, families as the producers
  const [a, b] = F.families
  const cast = [
    { role: 'In the lead role', name: `${F.first.name} ${F.first.surname}`, big: true, mono: F.first.name[0] },
    { role: 'In the lead role', name: `${F.second.name} ${F.second.surname}`, big: true, mono: F.second.name[0] },
    { role: a.label, name: a.names.join(' & ') },
    { role: b.label, name: b.names.join(' & ') },
  ]
  $('[data-list="cast"]').innerHTML = cast
    .map((c, i) => `<article class="castcard reveal${c.big ? ' castcard--lead' : ''}" style="--d:${i}">
      ${c.big ? `<span class="castcard__face" aria-hidden="true">${escapeHtml(c.mono)}</span>` : ''}
      <small>${escapeHtml(c.role)}</small><b>${escapeHtml(c.name)}</b></article>`)
    .join('')

  $('[data-list="shows"]').innerHTML = F.events
    .map((e, i) => `<article class="show reveal${e.main ? ' show--premiere' : ''}" style="--d:${i % 3}">
      <div class="show__screen"><span>SCREEN</span><b>${String(i + 1).padStart(2, '0')}</b></div>
      <div class="show__info"><h3>${escapeHtml(e.name)}</h3><p>${escapeHtml(e.when)}</p>${e.place ? `<p class="show__place">📍 ${escapeHtml(e.place)}</p>` : ''}${e.dress ? `<p class="show__place">Dress code · ${escapeHtml(e.dress)}</p>` : ''}</div>
      ${e.main ? '<span class="show__badge">PREMIERE</span>' : ''}</article>`)
    .join('')

  $('[data-list="contacts"]').innerHTML = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')

  const credits = [
    ['A film by', `${F.first.name} & ${F.second.name}`],
    ['Produced by', a.names.join(' & ')],
    ['Produced by', b.names.join(' & ')],
    ['With the blessings of', 'Shri Ganesh'],
    ['Starring', 'Every one of you'],
    ['Location', `${F.venue}, ${F.city}`],
    ['Release date', `${F.dateFull} · ${F.timeLabel}`],
  ]
  $('[data-list="credits"]').innerHTML =
    credits.map(([k, v]) => `<div><small>${escapeHtml(k)}</small><b>${escapeHtml(v)}</b></div>`).join('') +
    `<p class="credits__end">${escapeHtml(F.closingMessage)}</p><p class="credits__fin">The beginning</p>`

  // a row of theatre seats along the bottom of the opening screen
  $('.seats-row').innerHTML = Array.from({ length: 9 }, () => '<i></i>').join('')
}

/* ---------------------------------------------------------------- seat picker */
function buildSeats() {
  const map = $('#seatmap')
  const rows = ['A', 'B', 'C', 'D', 'E']
  const taken = new Set(['A2', 'A7', 'B4', 'C1', 'C8', 'D5', 'E3', 'E6'])
  map.innerHTML = rows
    .map((r) => `<div class="seatrow"><span class="seatrow__l">${r}</span>${Array.from({ length: 8 }, (_, i) => {
      const id = `${r}${i + 1}`
      return `<button type="button" class="seat${taken.has(id) ? ' is-taken' : ''}${r === 'E' && (i === 3 || i === 4) ? ' is-vip' : ''}" data-seat="${id}" ${taken.has(id) ? 'disabled aria-label="Seat ' + id + ' — reserved for family"' : `aria-label="Seat ${id}"`}></button>${i === 3 ? '<span class="aisle"></span>' : ''}`
    }).join('')}</div>`)
    .join('')
  map.addEventListener('click', (e) => {
    const s = e.target.closest('.seat:not(.is-taken)')
    if (!s) return
    $$('.seat.is-mine', map).forEach((x) => x.classList.remove('is-mine'))
    s.classList.add('is-mine')
    const id = s.dataset.seat
    $('#seat-chosen').innerHTML = `🎟️ Seat <b>${id}</b> is yours${s.classList.contains('is-vip') ? ' — front row, VIP!' : '!'} Now confirm your RSVP 👇`
    const link = $('#rsvp-link')
    if (F.rsvpHref) link.href = `${F.rsvpHref}${encodeURIComponent(`I've booked seat ${id}! `)}`
  })
}

/* ---------------------------------------------------------------- trailer subtitles */
function createTrailer() {
  // the story is optional; the trailer still plays its own lines without it
  const lines = [
    `In a world full of noise…`,
    `two hearts found the same song.`,
    ...F.story,
    `This season…`,
    `${F.first.name.toUpperCase()} & ${F.second.name.toUpperCase()}`,
    `${F.dateLong}. Don’t miss it.`,
  ]
  const el = $('#subtitle')
  let i = 0
  let timer = 0
  const show = () => {
    el.classList.remove('is-on')
    void el.offsetWidth
    el.textContent = lines[i % lines.length]
    el.classList.add('is-on')
    i++
  }
  return {
    start() {
      if (timer) return
      show()
      timer = setInterval(show, reducedMotion() ? 2500 : 2600)
    },
    stop() {
      clearInterval(timer)
      timer = 0
      i = 0
    },
  }
}

/* ---------------------------------------------------------------- page */
function init() {
  paint()
  buildSeats()
  const stage = $('#stage')
  const scroller = $('#scroller')
  const music = createMusic(F.music, $('#sound-btn'))
  const replay = $('#replay-btn')
  const trailer = createTrailer()
  let timers = []
  let opened = false
  const later = (ms, fn) => timers.push(setTimeout(fn, ms))

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-in')
        if (e.target.classList.contains('trailer__screen')) trailer.start()
      }),
    { root: scroller, threshold: 0.2 },
  )
  $$('.reveal').forEach((el) => io.observe(el))
  io.observe($('.credits'))

  function leader() {
    const n = $('#leader-n')
    let k = 5
    n.textContent = String(k)
    const step = () => {
      k--
      if (k < 1) return
      n.textContent = String(k)
      later(1000, step)
    }
    later(1000, step)
  }

  function open() {
    if (opened) return
    opened = true
    music.start()
    const fast = reducedMotion()
    const t = fast ? TIMING_REDUCED : TIMING
    later(t.curtain, () => stage.classList.add('is-open'))
    later(t.leader, () => {
      stage.classList.add('is-leader')
      if (!fast) leader()
    })
    later(t.title, () => stage.classList.add('is-title'))
    later(t.ready, () => {
      stage.classList.add('is-ready')
      stage.classList.remove('is-sealed')
      music.reveal()
      replay.hidden = false
    })
  }
  $('#open-btn').addEventListener('click', open)

  replay.addEventListener('click', () => {
    timers.forEach(clearTimeout)
    timers = []
    trailer.stop()
    replay.hidden = true
    scroller.scrollTo({ top: 0, behavior: 'auto' })
    stage.classList.remove('is-ready', 'is-title', 'is-leader', 'is-open')
    stage.classList.add('is-sealed')
    $$('.reveal, .credits').forEach((el) => {
      el.classList.remove('is-in')
      io.unobserve(el)
      io.observe(el)
    })
    opened = false
    later(1600, () => {
      music.restart()
      open()
    })
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
