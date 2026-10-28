/* =============================================================================
   Kai Po Che! — an Uttarayan kite-festival invitation.
   Tap the kite: its paper unfolds into the card; scrolling turns day to night.
   Content lives in core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const KITE_COLOURS = [['#ff5d73', '#ffd166'], ['#06d6a0', '#118ab2'], ['#9b5de5', '#f15bb5'], ['#ff9f1c', '#ff5d73'], ['#118ab2', '#ffd166'], ['#f15bb5', '#06d6a0']]

/* ---------------------------------------------------------------- art */
function kiteSvg() {
  return `<defs>
    <linearGradient id="k1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7a8a"/><stop offset="1" stop-color="#ff3d5a"/></linearGradient>
    <linearGradient id="k2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#ffbf3a"/></linearGradient></defs>
    <path d="M0 -130 L100 0 L0 130 L-100 0Z" fill="url(#k1)"/>
    <path d="M0 -130 L100 0 L0 0Z" fill="url(#k2)"/>
    <path d="M0 0 L-100 0 L0 130Z" fill="url(#k2)"/>
    <circle r="26" fill="#fff" opacity=".95"/>
    <path d="M0 -14 C-6 -6 -6 6 0 14 C6 6 6 -6 0 -14Z M-14 0 C-6 -6 6 -6 14 0 C6 6 -6 6 -14 0Z" fill="#ff5d73"/>
    <path d="M0 -130 V130 M-100 0 Q0 -40 100 0" stroke="#7a3a1a" stroke-width="2.4" fill="none"/>
    <path d="M0 130 L-16 150 L16 150Z" fill="#06d6a0"/>
    <path d="M-100 0 H100" stroke="#fff" stroke-width="1" stroke-dasharray="3 5" opacity=".6"/>`
}

function rooftops() {
  const o = ['<rect y="150" width="600" height="10" fill="#3a2440"/>']
  let x = -10
  let i = 0
  const tones = ['#f4a259', '#e76f51', '#f4d35e', '#90be6d', '#e5989b', '#a8dadc', '#cdb4db']
  while (x < 600) {
    const w = 46 + ((i * 37) % 40)
    const h = 50 + ((i * 53) % 70)
    const y = 160 - h
    const c = tones[i % tones.length]
    o.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`)
    o.push(`<rect x="${x}" y="${y}" width="${w}" height="6" fill="#00000022"/>`)
    for (let r = 0; r < 2; r++) for (let k = 0; k < Math.floor(w / 18); k++) o.push(`<rect class="win" x="${x + 6 + k * 18}" y="${y + 16 + r * 22}" width="8" height="12" fill="#3a2440" style="--d:${((i + k + r) % 7) * 0.3}s"/>`)
    if (i % 3 === 0) o.push(`<path d="M${x + 4} ${y} V${y - 22} M${x + w - 4} ${y} V${y - 22} M${x + 4} ${y - 18} Q${x + w / 2} ${y - 6} ${x + w - 4} ${y - 18}" stroke="#3a2440" stroke-width="1.5" fill="none"/>` +
      Array.from({ length: 5 }, (_, k) => `<path d="M${x + 8 + k * ((w - 16) / 4)} ${y - 14 + Math.sin(k) * 3} l4 6 l-8 0z" fill="${KITE_COLOURS[k % 6][0]}"/>`).join(''))
    x += w + 2
    i++
  }
  return o.join('')
}

/* ---------------------------------------------------------------- fill the page */
function paint() {
  $$('[data-art="kite"]').forEach((el) => (el.innerHTML = kiteSvg()))
  $$('[data-art="rooftops"]').forEach((el) => (el.innerHTML = rooftops()))
  $$('[data-art-html="ganesha"]').forEach((el) => (el.outerHTML = ganeshaSvg()))
  const fields = {
    ...F,
    firstName: F.first.name,
    secondName: F.second.name,
    shloka: `॥ ${F.blessing} ॥`,
    calHref: calendarHref(F),
  }
  $$('[data-field]').forEach((el) => (el.textContent = fields[el.dataset.field] ?? ''))
  $$('[data-href]').forEach((el) => {
    const href = fields[el.dataset.href]
    if (href) el.href = href
    else el.hidden = true
  })
  document.title = `Kai Po Che! — ${F.first.name} & ${F.second.name} · શુભ લગ્ન`

  $('[data-list="families"]').innerHTML = F.families
    .map((f) => `<div><p class="fams__label">${escapeHtml(f.label)}</p>${f.names.map((n, k) => `<p class="fams__name">${k ? '&amp; ' : ''}${escapeHtml(n)}</p>`).join('')}</div>`)
    .join('<span class="fams__amp" aria-hidden="true">✦</span>')

  $('[data-list="events"]').innerHTML = F.events
    .map((e, i) => {
      const [c1, c2] = KITE_COLOURS[i % KITE_COLOURS.length]
      return `<article class="pkite" style="--c1:${c1};--c2:${c2};--i:${i};--tilt:${i % 2 ? 6 : -6}deg">
        <div class="pkite__shape"><div class="pkite__text"><b>${escapeHtml(e.name)}</b><small>${escapeHtml(e.short)}</small></div></div>
        <p class="pkite__place">${escapeHtml(e.place || 'Venue to be announced')}${e.dress ? ` · ${escapeHtml(e.dress)}` : ''}</p></article>`
    })
    .join('')
  $('[data-list="story"]').innerHTML = F.story.map((s) => `<p>${escapeHtml(s)}</p>`).join('')
  if (!F.story.length) $('[data-optional="story"]').remove()
  $('[data-list="contacts"]').innerHTML = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')

  // small kites drifting in the background sky
  const bg = $('#bgkites')
  KITE_COLOURS.concat(KITE_COLOURS.slice(0, 3)).forEach(([c1, c2], i) => {
    const k = document.createElement('i')
    k.style.cssText = `--c1:${c1};--c2:${c2};--x:${(5 + i * 10.5).toFixed(1)}%;--y:${(8 + ((i * 37) % 60)).toFixed(0)}%;--s:${(5 + (i % 3) * 2).toFixed(0)}cqw;--t:${(5 + (i % 4)).toFixed(1)}s;--d:${(-i * 0.7).toFixed(1)}s`
    bg.append(k)
  })
}

/* ---------------------------------------------------------------- stars (for night) */
function drawStars(canvas) {
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.scale(dpr, dpr)
  for (let i = 0; i < (w * h) / 1800; i++) {
    ctx.globalAlpha = rand(0.3, 1)
    ctx.fillStyle = '#fff6d8'
    ctx.beginPath()
    ctx.arc(rand(0, w), rand(0, h * 0.75), rand(0.3, 1.4), 0, Math.PI * 2)
    ctx.fill()
  }
}

/* ---------------------------------------------------------------- page */
function init() {
  paint()
  const stage = $('#stage')
  const scroller = $('#scroller')
  const music = createMusic(F.music, $('#sound-btn'))
  const replay = $('#replay-btn')
  let timers = []
  let opened = false
  const later = (ms, fn) => timers.push(setTimeout(fn, ms))
  drawStars($('#stars'))

  // scroll drives the time of day and draws the kite string down the page
  const longpath = $('#longpath')
  function onScroll() {
    const max = scroller.scrollHeight - scroller.clientHeight || 1
    const k = Math.min(1, Math.max(0, scroller.scrollTop / max))
    stage.style.setProperty('--day', k.toFixed(3))
    stage.classList.toggle('is-night', k > 0.82)
    longpath.style.strokeDashoffset = String(1 - k)
  }
  scroller.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')), { root: scroller, threshold: 0.15 })
  $$('.reveal').forEach((el) => io.observe(el))

  function paintCount() {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }
  paintCount()
  setInterval(paintCount, 1000)

  function open() {
    if (opened) return
    opened = true
    music.start()
    const fast = reducedMotion()
    stage.classList.add('is-tug')
    later(fast ? 0 : 700, () => stage.classList.add('is-unfold'))
    later(fast ? 50 : 2300, () => {
      stage.classList.add('is-ready')
      stage.classList.remove('is-sealed')
      music.reveal()
      replay.hidden = false
    })
  }
  $('#open-btn').addEventListener('click', open)
  $('#kite').addEventListener('click', open)

  // tukkal: release a lantern each tap
  $('#tukkal').addEventListener('click', () => {
    const host = $('#sky-lanterns')
    const l = document.createElement('i')
    l.style.cssText = `--x:${rand(-30, 30).toFixed(0)}cqw;--t:${rand(5, 7).toFixed(1)}s`
    host.append(l)
    setTimeout(() => l.remove(), 7200)
    $('#tukkal').classList.remove('is-lift')
    void $('#tukkal').offsetWidth
    $('#tukkal').classList.add('is-lift')
  })

  replay.addEventListener('click', () => {
    timers.forEach(clearTimeout)
    timers = []
    replay.hidden = true
    scroller.scrollTo({ top: 0, behavior: 'auto' })
    stage.classList.remove('is-ready', 'is-unfold', 'is-tug')
    stage.classList.add('is-sealed')
    $$('.reveal').forEach((el) => {
      el.classList.remove('is-in')
      io.unobserve(el)
      io.observe(el)
    })
    opened = false
    later(1200, () => {
      music.restart()
      open()
    })
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
