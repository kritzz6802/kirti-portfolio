/* =============================================================================
   Now Playing — the wedding as an album: sleeve, turntable, tracklist, lyrics.
   Content lives in core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const TIMING = { out: 100, deck: 1000, arm: 2300, spin: 3000, ready: 3600 }
const TIMING_REDUCED = { out: 0, deck: 50, arm: 100, spin: 150, ready: 300 }

/* ---------------------------------------------------------------- the 70s album cover */
function coverArt() {
  const bands = ['#7b1e2b', '#e2673b', '#e9b949', '#2f6f73', '#f3ead9', '#7b1e2b', '#e2673b', '#e9b949']
  const rays = bands.map((c, i) => `<circle cx="150" cy="330" r="${300 - i * 34}" fill="${c}"/>`).join('')
  const stars = Array.from({ length: 10 }, (_, i) => {
    const x = 20 + ((i * 67) % 260)
    const y = 20 + ((i * 41) % 90)
    return `<path d="M${x} ${y - 6} l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" fill="#f3ead9" opacity=".8"/>`
  }).join('')
  return `<rect width="300" height="300" fill="#f3ead9"/>${rays}
    <rect width="300" height="300" fill="url(#grain)" opacity=".5"/>${stars}
    <defs><pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#000" opacity=".12"/><circle cx="4" cy="4" r=".5" fill="#fff" opacity=".2"/></pattern></defs>`
}

/* ---------------------------------------------------------------- fill the page */
function paint() {
  $$('[data-art="cover"]').forEach((el) => (el.innerHTML = coverArt()))
  $$('[data-art-html="ganesha"]').forEach((el) => (el.outerHTML = ganeshaSvg()))
  const fields = {
    ...F,
    firstName: F.first.name,
    secondName: F.second.name,
    mono: `${F.first.name[0]} & ${F.second.name[0]}`,
    ringText: `THE WEDDING ALBUM · ${F.dateLong.toUpperCase()} · THE WEDDING ALBUM · `,
    labelLine: `${F.first.surname} × ${F.second.surname} Records · ${F.year}`,
    trackTitle: `${F.first.name} & ${F.second.name} — Forever`,
    artistLine: `${F.first.surname} × ${F.second.surname} Records · feat. everyone we love`,
    shloka: `॥ ${F.blessing} ॥`,
    calHref: calendarHref(F),
    copyright: `℗ & © ${F.year} ${F.first.surname} × ${F.second.surname} Records. All love reserved.`,
  }
  $$('[data-field]').forEach((el) => (el.textContent = fields[el.dataset.field] ?? ''))
  $$('[data-href]').forEach((el) => {
    const href = fields[el.dataset.href]
    if (href) el.href = href
    else el.hidden = true
  })
  document.title = `Now Playing — ${F.first.name} & ${F.second.name} · The Wedding Album`

  // tracklist: side A and side B
  const half = Math.ceil(F.events.length / 2)
  const row = (e, n) => `<details class="track reveal${e.main ? ' is-now' : ''}" style="--d:${n % half}">
    <summary><span class="track__n">${String(n + 1).padStart(2, '0')}</span>
      <span class="track__t"><b>${escapeHtml(e.name)}</b><small>${escapeHtml(e.place || 'Venue to be announced')}</small></span>
      ${e.main ? '<span class="eq" aria-label="Now playing"><i></i><i></i><i></i><i></i></span>' : ''}
      <span class="track__d">${escapeHtml(e.short.split(' · ')[0])}</span></summary>
    <div class="track__more"><p>${escapeHtml(e.when)}</p>${e.place ? `<p>${escapeHtml(e.place)}</p>` : ''}${e.dress ? `<p>Dress code · ${escapeHtml(e.dress)}</p>` : ''}</div></details>`
  $('[data-list="tracks"]').innerHTML =
    `<h3 class="side reveal">Side A</h3>${F.events.slice(0, half).map((e, n) => row(e, n)).join('')}` +
    `<h3 class="side reveal">Side B</h3>${F.events.slice(half).map((e, n) => row(e, n + half)).join('')}`

  // lyrics: the story, sung line by line
  const lines = [`${F.openingMessage},`, ...F.story, `${F.first.name} & ${F.second.name}`, F.inviteLine]
  $('[data-list="lyrics"]').innerHTML = lines.map((l, i) => `<p style="--i:${i}">${escapeHtml(l)}</p>`).join('')

  // credits from the families
  const [a, b] = F.families
  const credits = [
    ['Lead vocals', `${F.first.name} ${F.first.surname} & ${F.second.name} ${F.second.surname}`],
    ['Produced by', a.names.join(' & ')],
    ['Co-produced by', b.names.join(' & ')],
    ['Featuring', 'Every one of you'],
    ['Recorded live at', `${F.venue}, ${F.city}`],
    ['Release date', `${F.dateFull} · ${F.timeLabel}`],
  ]
  $('[data-list="credits"]').innerHTML = credits.map(([k, v]) => `<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')
  $('[data-list="contacts"]').innerHTML = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')
}

/* ---------------------------------------------------------------- page */
function init() {
  paint()
  const stage = $('#stage')
  const scroller = $('#scroller')
  const music = createMusic(F.music, $('#sound-btn'), (on) => stage.classList.toggle('is-playing', on))
  const replay = $('#replay-btn')
  let timers = []
  let opened = false
  let lyricTimer = 0
  const later = (ms, fn) => timers.push(setTimeout(fn, ms))

  // countdown as the track's remaining time; the bar fills over the final year
  function tick() {
    const p = countdownParts(F.target)
    $('#remaining').textContent = `-${p.days}d ${String(p.hours).padStart(2, '0')}:${String(p.minutes).padStart(2, '0')}:${String(p.seconds).padStart(2, '0')}`
    const k = Math.max(0, Math.min(1, 1 - (F.target - Date.now()) / (365 * 86400000)))
    $('#progress-fill').style.transform = `scaleX(${k})`
  }
  tick()
  setInterval(tick, 1000)

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-in')
        if (e.target.classList.contains('lyrics__box')) singLyrics(e.target)
      }),
    { root: scroller, threshold: 0.2 },
  )
  $$('.reveal').forEach((el) => io.observe(el))

  // karaoke: each line lights up in turn, then the verse holds
  function singLyrics(box) {
    clearInterval(lyricTimer)
    const lines = $$('p', box)
    let i = 0
    const step = () => {
      lines.forEach((l, n) => {
        l.classList.toggle('is-sung', n < i)
        l.classList.toggle('is-now', n === i)
      })
      if (i++ >= lines.length) clearInterval(lyricTimer)
    }
    step()
    lyricTimer = setInterval(step, reducedMotion() ? 200 : 1900)
  }

  function open() {
    if (opened) return
    opened = true
    music.start()
    const t = reducedMotion() ? TIMING_REDUCED : TIMING
    later(t.out, () => stage.classList.add('is-out'))
    later(t.deck, () => stage.classList.add('is-deck'))
    later(t.arm, () => stage.classList.add('is-arm'))
    later(t.spin, () => {
      stage.classList.add('is-spin')
      music.reveal()
    })
    later(t.ready, () => {
      stage.classList.add('is-ready')
      stage.classList.remove('is-sealed')
      replay.hidden = false
    })
  }
  $('#open-btn').addEventListener('click', open)
  $('#sleeve').addEventListener('click', open)

  $('#to-top').addEventListener('click', () => scroller.scrollTo({ top: 0, behavior: 'smooth' }))
  $('#to-tracks').addEventListener('click', () => $('#tracks').scrollIntoView({ behavior: 'smooth' }))

  // a little burst of hearts
  $('#heart').addEventListener('click', (e) => {
    const btn = e.currentTarget
    btn.classList.toggle('is-loved')
    const host = $('#hearts')
    const r = btn.getBoundingClientRect()
    const s = stage.getBoundingClientRect()
    for (let i = 0; i < 10; i++) {
      const h = document.createElement('i')
      h.textContent = '♥'
      h.style.cssText = `left:${r.left - s.left + r.width / 2}px;top:${r.top - s.top}px;--x:${rand(-60, 60).toFixed(0)}px;--y:${rand(-140, -60).toFixed(0)}px;--r:${rand(-40, 40).toFixed(0)}deg;--d:${(i * 0.04).toFixed(2)}s`
      host.append(h)
      setTimeout(() => h.remove(), 1600)
    }
  })

  replay.addEventListener('click', () => {
    timers.forEach(clearTimeout)
    timers = []
    clearInterval(lyricTimer)
    replay.hidden = true
    scroller.scrollTo({ top: 0, behavior: 'auto' })
    stage.classList.remove('is-ready', 'is-spin', 'is-arm', 'is-deck', 'is-out')
    stage.classList.add('is-sealed')
    $$('.reveal').forEach((el) => {
      el.classList.remove('is-in')
      io.unobserve(el)
      io.observe(el)
    })
    opened = false
    later(1400, () => {
      music.restart()
      open()
    })
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
