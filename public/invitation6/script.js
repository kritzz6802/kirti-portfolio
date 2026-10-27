/* =============================================================================
   Written in the Stars — constellation opening, then the invitation as stories.
   Content lives in core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const STORY_MS = 7500 // per slide; the celebrations slide gets longer
const STAR = 'M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9Z'

/* ---------------------------------------------------------------- night sky (canvas) */
function createSky(canvas) {
  const ctx = canvas.getContext('2d')
  let stars = []
  let w = 0
  let h = 0
  let raf = 0
  let shoot = null
  let nextShoot = 0

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    stars = Array.from({ length: Math.round((w * h) / 2200) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() < 0.12 ? rand(1.1, 1.9) : rand(0.3, 1),
      p: rand(0, Math.PI * 2),
      s: rand(0.6, 1.8),
      warm: Math.random() < 0.25,
    }))
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h)
    for (const s of stars) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.s + s.p))
      ctx.globalAlpha = a
      ctx.fillStyle = s.warm ? '#f6cdbf' : '#fff6de'
      ctx.beginPath()
      ctx.arc(s.x, (s.y + t * 0.004 * s.r) % h, s.r, 0, Math.PI * 2)
      ctx.fill()
    }
    // an occasional shooting star
    if (!shoot && t > nextShoot) shoot = { x: rand(w * 0.1, w * 0.7), y: rand(0, h * 0.35), t0: t }
    if (shoot) {
      const k = (t - shoot.t0) / 900
      if (k > 1) {
        shoot = null
        nextShoot = t + rand(4000, 9000)
      } else {
        const x = shoot.x + k * w * 0.45
        const y = shoot.y + k * w * 0.2
        const g = ctx.createLinearGradient(x - 70, y - 31, x, y)
        g.addColorStop(0, 'rgba(255,244,214,0)')
        g.addColorStop(1, `rgba(255,244,214,${1 - k})`)
        ctx.globalAlpha = 1
        ctx.strokeStyle = g
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(x - 70, y - 31)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
    raf = requestAnimationFrame(frame)
  }

  resize()
  new ResizeObserver(resize).observe(canvas)
  const run = () => {
    cancelAnimationFrame(raf)
    if (document.hidden) return
    if (reducedMotion()) frame(0) || cancelAnimationFrame(raf)
    else raf = requestAnimationFrame(frame)
  }
  document.addEventListener('visibilitychange', run)
  run()
}

/* ---------------------------------------------------------------- constellation K ♥ D */
const CONSTELLATION = {
  K: { pts: [[40, 50], [40, 100], [40, 150], [84, 52], [52, 100], [84, 148]], lines: [[0, 1], [1, 2], [3, 4], [4, 5]] },
  H: { pts: [[150, 132], [128, 108], [123, 86], [135, 72], [150, 82], [165, 72], [177, 86], [172, 108]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]] },
  D: { pts: [[216, 50], [216, 150], [242, 55], [261, 74], [267, 100], [261, 126], [242, 145]], lines: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]] },
}

function buildConstellation() {
  const lines = []
  const stars = []
  let i = 0
  for (const [key, c] of Object.entries(CONSTELLATION)) {
    for (const [a, b] of c.lines) {
      const [x1, y1] = c.pts[a]
      const [x2, y2] = c.pts[b]
      lines.push(`<line pathLength="1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="--i:${lines.length}" class="${key === 'H' ? 'heart' : ''}"/>`)
    }
    for (const [x, y] of c.pts) {
      const dx = rand(-160, 160).toFixed(0)
      const dy = rand(-120, 120).toFixed(0)
      const big = key === 'H' && (x === 150) ? 1.5 : 1
      stars.push(`<g class="cstar" style="--dx:${dx}px;--dy:${dy}px;--i:${i++}" transform="translate(${x} ${y})"><circle r="9" class="cstar__glow"/><path d="${STAR}" transform="scale(${0.42 * big})"/></g>`)
    }
  }
  $('.constellation__lines').innerHTML = lines.join('')
  $('.constellation__stars').innerHTML = stars.join('')
  $('#opening-names').innerHTML = `<span>${escapeHtml(F.first.name)}</span> <em>&amp;</em> <span>${escapeHtml(F.second.name)}</span>`
}

/* ---------------------------------------------------------------- the slides */
function moonPhase(k, size = 26) {
  // k: 0 new moon → 1 full moon: a lit disc with a shadow disc sliding off it
  const off = k * size * 2.1 // the shadow slides off as the moon fills
  return `<svg class="phase" viewBox="${-size} ${-size} ${size * 2} ${size * 2}" aria-hidden="true">
    <defs><mask id="ph${String(k).replace('.', '')}"><circle r="${size - 2}" fill="#fff"/><circle cx="${-off}" r="${size - 1}" fill="#000"/></mask></defs>
    <circle r="${size - 2}" fill="none" stroke="rgba(232,180,166,.35)" stroke-width="1"/>
    <circle r="${size - 2}" fill="url(#rosegold)" mask="url(#ph${String(k).replace('.', '')})"/></svg>`
}

function slidesHtml() {
  // staggered entrance: every element carrying --i gets the s-item class after render
  const it = (i) => `style="--i:${i}"`
  const fam = F.families
    .map((f, n) => `<div ${it(n + 4)}><p class="caps fam__label">${escapeHtml(f.label)}</p>${f.names.map((x, k) => `<p class="fam__name">${k ? '&amp; ' : ''}${escapeHtml(x)}</p>`).join('')}</div>`)
    .join('<span class="fam__star" aria-hidden="true">✦</span>')
  const phases = [0, 0.2, 0.45, 0.7, 1, 0.7, 0.45].map((k, n) => `<span ${it(n)} class="phase-wrap${k === 1 ? ' is-full' : ''}">${moonPhase(k, k === 1 ? 30 : 20)}</span>`).join('')
  const events = F.events
    .map((e, n) => `<li ${it(n + 2)}><span class="ev__star" aria-hidden="true"><svg viewBox="-10 -10 20 20"><path d="${STAR}"/></svg></span>
      <span class="ev__text"><b>${escapeHtml(e.name)}</b><small>${escapeHtml(e.when)}</small>${e.place ? `<small class="ev__place">${escapeHtml(e.place)}</small>` : ''}${e.dress ? `<small class="ev__place">Dress · ${escapeHtml(e.dress)}</small>` : ''}</span></li>`)
    .join('')
  const ring = Array.from({ length: 36 }, (_, n) => {
    const a = (n / 36) * Math.PI * 2
    const r1 = n % 3 ? 92 : 86
    return `<line x1="${(Math.cos(a) * r1).toFixed(1)}" y1="${(Math.sin(a) * r1).toFixed(1)}" x2="${(Math.cos(a) * 98).toFixed(1)}" y2="${(Math.sin(a) * 98).toFixed(1)}"/>`
  }).join('')
  const mapStars = Array.from({ length: 22 }, () => {
    const a = rand(0, Math.PI * 2)
    const r = rand(18, 78)
    return `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="${rand(0.6, 1.6).toFixed(1)}"/>`
  }).join('')
  const contacts = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')

  return [
    { id: 'blessing', ms: STORY_MS, html: `
      <div ${it(0)}>${ganeshaSvg()}</div>
      <p ${it(1)} class="shloka" lang="sa">॥ ${escapeHtml(F.blessing)} ॥</p>
      <p ${it(2)} class="caps s-eyebrow">With the blessings of our families</p>
      <div class="fams">${fam}</div>
      <p ${it(7)} class="s-lede">${escapeHtml(F.familiesMessage)}</p>` },
    { id: 'names', ms: STORY_MS, html: `
      <svg class="bigmoon s-item" style="--i:0" viewBox="-80 -80 160 160" aria-hidden="true">
        <circle r="78" fill="url(#moonglow)"/><g mask="url(#crescent)"><circle r="46" fill="url(#rosegold)"/></g></svg>
      <p ${it(1)} class="caps s-eyebrow">${escapeHtml(F.openingMessage)}</p>
      <h2 class="names"><span ${it(2)} class="names__first foil">${escapeHtml(F.first.name)}</span>
        <span ${it(3)} class="caps names__last">${escapeHtml(F.first.surname)}</span>
        <span ${it(4)} class="names__amp foil">&amp;</span>
        <span ${it(5)} class="names__first foil">${escapeHtml(F.second.name)}</span>
        <span ${it(6)} class="caps names__last">${escapeHtml(F.second.surname)}</span></h2>
      <p ${it(7)} class="s-lede">${escapeHtml(F.inviteLine)}</p>` },
    { id: 'date', ms: STORY_MS, html: `
      <p ${it(0)} class="caps s-eyebrow">Save the date</p>
      <div class="phases">${phases}</div>
      <p ${it(3)} class="caps date__wd">${F.weekdayName}</p>
      <p ${it(4)} class="date__day foil">${F.dayNumber}</p>
      <p ${it(5)} class="caps date__my">${F.monthName} ${F.year}</p>
      <p ${it(6)} class="date__time">${F.timeLabel}</p>
      <dl ${it(7)} class="count">
        <div><dd data-c="days">0</dd><dt>days</dt></div><div><dd data-c="hours">0</dd><dt>hours</dt></div>
        <div><dd data-c="minutes">0</dd><dt>min</dt></div><div><dd data-c="seconds">0</dd><dt>sec</dt></div></dl>` },
    { id: 'events', ms: STORY_MS + 4000, html: `
      <p ${it(0)} class="caps s-eyebrow">The celebrations</p>
      <h2 ${it(1)} class="s-title">Our constellation of days</h2>
      <ol class="events">${events}</ol>` },
    { id: 'venue', ms: STORY_MS, html: `
      <p ${it(0)} class="caps s-eyebrow">Where the stars meet</p>
      <svg class="starmap s-item" style="--i:1" viewBox="-100 -100 200 200" aria-hidden="true">
        <circle r="98" class="sm-ring"/><circle r="66" class="sm-ring sm-ring--thin"/><circle r="34" class="sm-ring sm-ring--thin"/>
        <g class="sm-ticks">${ring}</g><line x1="-98" y1="0" x2="98" y2="0" class="sm-axis"/><line x1="0" y1="-98" x2="0" y2="98" class="sm-axis"/>
        <g class="sm-stars">${mapStars}</g>
        <text y="-104" class="sm-n">N</text>
        <circle r="16" class="sm-pulse"/><path d="${STAR}" transform="scale(1.3)" class="sm-pin"/></svg>
      <h2 ${it(2)} class="s-title">${escapeHtml(F.venue)}</h2>
      <p ${it(3)} class="caps s-city">${escapeHtml(F.city)}</p>
      <p ${it(4)} class="s-lede">${escapeHtml(F.address)}</p>
      <a ${it(5)} class="btn s-item" href="${F.mapHref}" target="_blank" rel="noopener">Open in Maps</a>` },
    { id: 'rsvp', ms: 0, html: `
      <p ${it(0)} class="caps s-eyebrow">Light a lantern for us</p>
      <button class="lantern s-item" style="--i:1" id="lantern" type="button" aria-label="Release a lantern">
        <svg viewBox="-40 -60 80 120" aria-hidden="true"><circle r="38" cy="2" fill="url(#lanternglow)"/>
          <rect x="-17" y="-24" width="34" height="48" rx="15" fill="url(#lanternbody)"/>
          <rect x="-11" y="-30" width="22" height="7" rx="2" fill="url(#rosegold)"/><rect x="-11" y="23" width="22" height="6" rx="2" fill="url(#rosegold)"/>
          <path d="M0 -10 C-5 -2 -5 6 0 10 C5 6 5 -2 0 -10Z" fill="#fff7d8" opacity=".9"/></svg>
      </button>
      <p ${it(2)} class="lantern__hint">Tap the lantern to send your blessing</p>
      <h2 ${it(3)} class="s-title">Kindly reply</h2>
      <p ${it(4)} class="caps s-city">by ${escapeHtml(F.rsvpByLong)}</p>
      ${F.rsvpHref ? `<a ${it(5)} class="btn s-item" href="${F.rsvpHref}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : ''}
      <div ${it(6)} class="contacts">${contacts}</div>
      <p ${it(7)} class="closing foil">${escapeHtml(F.closingMessage)}</p>` },
  ]
}

/* ---------------------------------------------------------------- the story player */
function createStories(slides, onEnd) {
  const host = $('#slides')
  const bars = $('#bars')
  host.innerHTML = slides.map((s) => `<article class="slide slide--${s.id}" data-id="${s.id}" aria-hidden="true"><div class="slide__inner">${s.html}</div></article>`).join('')
  bars.innerHTML = slides.map(() => '<span><i></i></span>').join('')
  $$('[style*="--i"]', host).forEach((e) => e.classList.add('s-item'))
  const els = $$('.slide', host)
  const fills = $$('i', bars)
  let index = -1
  let t0 = 0
  let elapsed = 0
  let paused = false
  let raf = 0

  function paint() {
    fills.forEach((f, n) => {
      const k = n < index ? 1 : n > index ? 0 : slides[index].ms ? Math.min(1, elapsed / slides[index].ms) : 1
      f.style.transform = `scaleX(${k})`
    })
  }

  function tick(t) {
    if (!paused) elapsed = t - t0
    paint()
    const ms = slides[index].ms
    if (ms && elapsed >= ms) return go(index + 1, 1)
    raf = requestAnimationFrame(tick)
  }

  function go(n, dir = 1) {
    if (n < 0) n = 0
    if (n >= slides.length) return onEnd()
    cancelAnimationFrame(raf)
    const prev = els[index]
    if (prev && prev !== els[n]) {
      prev.classList.remove('is-active', 'in-fwd', 'in-back')
      prev.classList.add(dir > 0 ? 'out-fwd' : 'out-back')
      prev.setAttribute('aria-hidden', 'true')
      prev.addEventListener('animationend', () => prev.classList.remove('out-fwd', 'out-back'), { once: true })
    }
    index = n
    const el = els[n]
    el.classList.remove('out-fwd', 'out-back')
    void el.offsetWidth
    el.classList.add('is-active', prev && prev !== el ? (dir > 0 ? 'in-fwd' : 'in-back') : 'in-fwd')
    el.setAttribute('aria-hidden', 'false')
    elapsed = 0
    t0 = performance.now()
    paused = false
    raf = requestAnimationFrame(tick)
  }

  return {
    start: () => go(0, 1),
    next: () => go(index + 1, 1),
    prev: () => go(index - 1, -1),
    pause(on) {
      if (on && !paused) paused = true
      else if (!on && paused) {
        paused = false
        t0 = performance.now() - elapsed
      }
    },
    stop() {
      cancelAnimationFrame(raf)
      els.forEach((e) => e.classList.remove('is-active', 'in-fwd', 'in-back', 'out-fwd', 'out-back'))
      index = -1
    },
    get index() {
      return index
    },
  }
}

/* ---------------------------------------------------------------- page */
function init() {
  const stage = $('#stage')
  const opening = $('#opening')
  const stories = $('#stories')
  const music = createMusic(F.music, $('#sound-btn'))
  let countTimer = 0

  // shared gradients for every inline svg
  document.body.insertAdjacentHTML('beforeend', `<svg class="sr-only" aria-hidden="true"><defs>
    <linearGradient id="rosegold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a8695c"/><stop offset=".35" stop-color="#e8b4a6"/><stop offset=".55" stop-color="#fde6dc"/><stop offset=".8" stop-color="#d99a87"/><stop offset="1" stop-color="#b9786a"/></linearGradient>
    <radialGradient id="moonglow"><stop offset=".55" stop-color="#fde6dc" stop-opacity=".35"/><stop offset="1" stop-color="#fde6dc" stop-opacity="0"/></radialGradient>
    <radialGradient id="lanternglow"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".8"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
    <linearGradient id="lanternbody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a8"/><stop offset=".55" stop-color="#f6a55a"/><stop offset="1" stop-color="#e0703c"/></linearGradient>
    <mask id="crescent"><circle r="46" fill="#fff"/><circle cx="20" cy="-12" r="42" fill="#000"/></mask></defs></svg>`)

  createSky($('#sky'))
  buildConstellation()
  $('#who').textContent = `${F.first.name} & ${F.second.name}`
  $('.storyhead__avatar').textContent = `${F.monogram[0]}${F.monogram[1]}`

  const player = createStories(slidesHtml(), () => {})
  requestAnimationFrame(() => stage.classList.add('is-opening'))

  function paintCount() {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }

  function begin() {
    if (!stories.hidden) return
    music.start()
    music.reveal()
    stage.classList.add('is-leaving')
    setTimeout(() => {
      opening.hidden = true
      stories.hidden = false
      stage.classList.add('is-stories')
      player.start()
      paintCount()
      countTimer = setInterval(paintCount, 1000)
    }, reducedMotion() ? 0 : 900)
  }
  $('#begin').addEventListener('click', begin)

  // tap left/right to move, hold anywhere to pause, swipe sideways too
  let downAt = 0
  let downX = 0
  let held = false
  let holdTimer = 0
  const zones = [$('#prev'), $('#next')]
  zones.forEach((z) => {
    z.addEventListener('pointerdown', (e) => {
      downAt = performance.now()
      downX = e.clientX
      held = false
      holdTimer = setTimeout(() => {
        held = true
        player.pause(true)
        stage.classList.add('is-held')
      }, 220)
    })
    z.addEventListener('pointerup', (e) => {
      clearTimeout(holdTimer)
      stage.classList.remove('is-held')
      if (held) return player.pause(false)
      const dx = e.clientX - downX
      if (Math.abs(dx) > 40) return dx < 0 ? player.next() : player.prev()
      if (performance.now() - downAt < 400) (z.id === 'next' ? player.next : player.prev)()
    })
    z.addEventListener('pointercancel', () => {
      clearTimeout(holdTimer)
      stage.classList.remove('is-held')
      player.pause(false)
    })
  })
  document.addEventListener('keydown', (e) => {
    if (stories.hidden) return
    if (e.key === 'ArrowRight') player.next()
    if (e.key === 'ArrowLeft') player.prev()
  })
  setTimeout(() => $('#hint').classList.add('is-gone'), 9000)

  // the lantern floats away when tapped
  $('#slides').addEventListener('click', (e) => {
    const lantern = e.target.closest('#lantern')
    if (!lantern) return
    lantern.classList.remove('is-flying')
    void lantern.offsetWidth
    lantern.classList.add('is-flying')
  })

  $('#replay-btn').addEventListener('click', (e) => {
    e.stopPropagation()
    clearInterval(countTimer)
    player.stop()
    stories.hidden = true
    opening.hidden = false
    stage.classList.remove('is-stories', 'is-leaving', 'is-opening')
    $('#lantern').classList.remove('is-flying')
    buildConstellation()
    void stage.offsetWidth
    requestAnimationFrame(() => stage.classList.add('is-opening'))
    music.restart()
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
