/* =============================================================================
   The Chat — a lock-screen notification that opens into a live group chat.
   Content lives in core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const EMOJI = { kalash: '🪔', mehendi: '🌿', haldi: '💛', sangeet: '🎶', mandap: '💍', reception: '🥂' }

const RING = `<svg class="ring" viewBox="0 0 120 120" aria-hidden="true">
  <defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8892e"/><stop offset=".5" stop-color="#f6e3a6"/><stop offset="1" stop-color="#c99f45"/></linearGradient>
  <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#d9f1ff"/><stop offset="1" stop-color="#9fd3f2"/></linearGradient></defs>
  <circle cx="60" cy="74" r="30" fill="none" stroke="url(#gold)" stroke-width="9"/>
  <path d="M46 40 L60 24 L74 40 L60 52Z" fill="url(#gem)" stroke="#8cc4e6" stroke-width="1.5"/>
  <path d="M46 40 H74 M60 24 L54 40 L60 52 L66 40Z" stroke="#8cc4e6" stroke-width="1" fill="none"/>
  <g class="ring__spark"><path d="M92 20 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#f6c34a"/><path d="M24 30 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z" fill="#f6c34a"/></g></svg>`

/* ---------------------------------------------------------------- the conversation */
function script() {
  const A = F.first.name
  const B = F.second.name
  const fam = F.families.map((f) => {
    const [x, y] = f.names
    const sur = x.split(' ').slice(-1)[0]
    return `${x.split(' ')[0]} & ${y.split(' ')[0]} ${sur}`
  })
  const story = F.story.map((s) => ({ from: 'a', type: 'text', text: s }))
  return [
    { from: 'a', type: 'text', text: 'Hey you! 👋' },
    { from: 'b', type: 'text', text: 'We have some news… 🤭' },
    { from: 'a', type: 'sticker' },
    { from: 'b', type: 'big', text: 'WE’RE GETTING MARRIED! 💍' },
    { from: 'a', type: 'ganesha', text: 'With Ganpati Bappa’s blessings 🙏' },
    ...fam.map((n) => ({ from: 'sys', type: 'sys', text: `${n} joined the chat` })),
    { from: 'fam', type: 'text', text: F.familiesMessage, name: `${F.first.surname} & ${F.second.surname} families` },
    { from: 'b', type: 'text', text: 'Save the date 👇 (scratch it!)' },
    { from: 'b', type: 'scratch' },
    { from: 'a', type: 'event' },
    { from: 'a', type: 'text', text: 'Turn the sound on — we made you a little song 🎧' },
    { from: 'a', type: 'voice' },
    { from: 'b', type: 'text', text: 'Here’s the plan 🎉 swipe →' },
    { from: 'b', type: 'carousel' },
    { from: 'a', type: 'location' },
    { from: 'b', type: 'text', text: 'Our story, in short ✨' },
    ...story,
    { from: 'b', type: 'poll' },
    { from: 'a', type: 'text', text: `Kindly reply by ${F.rsvpByLong} 🙏` },
    ...(F.contacts.some((c) => c.phone) ? [{ from: 'a', type: 'contacts' }] : []),
    { from: 'b', type: 'text', text: `${F.closingMessage} ❤️`, react: true },
  ].map((m) => ({ ...m, who: m.from === 'a' ? A : m.from === 'b' ? B : m.name }))
}

/* ---------------------------------------------------------------- bubbles */
function now() {
  const d = new Date()
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`
}

function bubble(m) {
  const meta = `<span class="meta">${now()}</span>`
  const head = m.who ? `<b class="who">${escapeHtml(m.who)}</b>` : ''
  switch (m.type) {
    case 'sys':
      return `<p class="sys">${escapeHtml(m.text)}</p>`
    case 'big':
      return `<div class="msg big">${head}<p>${escapeHtml(m.text)}</p>${meta}</div>`
    case 'sticker':
      return `<div class="sticker">${RING}</div>`
    case 'ganesha':
      return `<div class="msg media">${head}<div class="card-ganesha">${ganeshaSvg()}<p lang="sa">॥ ${escapeHtml(F.blessing)} ॥</p></div><p>${escapeHtml(m.text)}</p>${meta}</div>`
    case 'scratch':
      return `<div class="msg media">${head}<div class="scratch" data-scratch>
        <div class="scratch__under"><small>${F.weekdayName}</small><b>${F.dayNumber} ${F.monthName}</b><span>${F.year} · ${F.timeLabel}</span></div>
        <canvas class="scratch__cover" aria-label="Scratch card — tap or scratch to reveal the date" tabindex="0" role="button"></canvas></div>${meta}</div>`
    case 'event':
      return `<div class="msg media">${head}<div class="event">
        <span class="event__cal"><small>${F.monthName.slice(0, 3).toUpperCase()}</small><b>${F.dayNumber}</b></span>
        <span class="event__txt"><b>${escapeHtml(F.first.name)} & ${escapeHtml(F.second.name)}’s Wedding</b><small>${F.dateFull} · ${F.timeLabel}</small><small>${escapeHtml(F.venue)}, ${escapeHtml(F.city)}</small></span></div>
        <a class="chip" href="${calendarHref(F)}" target="_blank" rel="noopener">📅 Add to calendar</a>${meta}</div>`
    case 'voice': {
      const bars = Array.from({ length: 28 }, (_, i) => `<i style="--h:${(0.25 + Math.abs(Math.sin(i * 1.7)) * 0.75).toFixed(2)};--i:${i}"></i>`).join('')
      return `<div class="msg voice">${head}<div class="voice__row"><button class="voice__play" type="button" data-voice aria-label="Play our song"><svg viewBox="0 0 24 24"><path class="i-play" d="M8 5 L19 12 L8 19Z"/><path class="i-pause" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg></button><span class="wave">${bars}</span><small>1:03</small></div>${meta}</div>`
    }
    case 'carousel':
      return `<div class="carousel" tabindex="0" aria-label="The celebrations">${F.events
        .map((e) => `<article class="slide${e.main ? ' is-main' : ''}"><span class="slide__emoji">${EMOJI[e.icon] || '✨'}</span><b>${escapeHtml(e.name)}</b><small>${escapeHtml(e.when)}</small>${e.place ? `<small>📍 ${escapeHtml(e.place)}</small>` : ''}${e.dress ? `<small>👗 ${escapeHtml(e.dress)}</small>` : ''}</article>`)
        .join('')}</div>`
    case 'location':
      return `<div class="msg media">${head}<a class="loc" href="${F.mapHref}" target="_blank" rel="noopener">
        <svg viewBox="0 0 240 120" aria-hidden="true"><rect width="240" height="120" fill="#eef3ea"/>
          <path d="M0 80 C60 60 120 100 240 70" stroke="#bfe0f2" stroke-width="16" fill="none"/>
          <path d="M40 0 V120 M0 40 H240 M150 0 C140 60 170 80 160 120" stroke="#fff" stroke-width="7"/>
          <rect x="70" y="52" width="30" height="20" fill="#dbe7d0"/><rect x="180" y="12" width="40" height="22" fill="#dbe7d0"/>
          <g class="loc__pin" transform="translate(120 58)"><path d="M0 0 C-12 -14 -14 -26 -7 -32 C-3 -35 3 -35 7 -32 C14 -26 12 -14 0 0Z" fill="#e85d75"/><circle cy="-22" r="4" fill="#fff"/></g></svg>
        <b>${escapeHtml(F.venue)}</b><small>${escapeHtml(F.address)}, ${escapeHtml(F.city)}</small><span class="chip">📍 Open in Maps</span></a>${meta}</div>`
    case 'poll':
      return `<div class="msg poll">${head}<p class="poll__q">Will you be there? 🥺</p>
        <button type="button" class="poll__opt" data-vote="yes"><span>Yes! Wouldn’t miss it 🥳</span><i></i><em></em></button>
        <button type="button" class="poll__opt" data-vote="away"><span>Sending love from afar 💌</span><i></i><em></em></button>${meta}</div>`
    case 'contacts':
      return `<div class="msg">${head}${F.contacts
        .filter((c) => c.phone)
        .map((c) => `<a class="chip" href="tel:${String(c.phone).replace(/[^\d+]/g, '')}">📞 ${escapeHtml(c.name)}</a>`)
        .join('')}${meta}</div>`
    default:
      return `<div class="msg">${head}<p>${escapeHtml(m.text)}</p>${meta}${m.react ? '<span class="reacts">❤️ 12 · 🥳 8</span>' : ''}</div>`
  }
}

/* ---------------------------------------------------------------- scratch card */
function scratchCard(host, onDone) {
  const canvas = $('canvas', host)
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const w = host.clientWidth
  const h = host.clientHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.scale(dpr, dpr)
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#d9d9df')
  g.addColorStop(0.5, '#f5f5f8')
  g.addColorStop(1, '#bdbdc6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
  }
  ctx.fillStyle = '#7a7a86'
  ctx.font = '700 15px Nunito, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🎁 Scratch to reveal the date', w / 2, h / 2 + 5)
  ctx.globalCompositeOperation = 'destination-out'

  let done = false
  let down = false
  let last = null
  const at = (e) => {
    const r = canvas.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }
  const finish = () => {
    if (done) return
    done = true
    host.classList.add('is-revealed')
    onDone()
  }
  const cleared = () => {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let clear = 0
    let n = 0
    for (let i = 3; i < data.length; i += 4 * 40) {
      n++
      if (data[i] === 0) clear++
    }
    return clear / n
  }
  const draw = (p) => {
    ctx.lineWidth = 34
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(...(last || p))
    ctx.lineTo(...p)
    ctx.stroke()
    last = p
  }
  canvas.addEventListener('pointerdown', (e) => {
    down = true
    last = null
    canvas.setPointerCapture(e.pointerId)
    draw(at(e))
  })
  canvas.addEventListener('pointermove', (e) => down && draw(at(e)))
  canvas.addEventListener('pointerup', () => {
    down = false
    if (cleared() > 0.45) finish()
  })
  // a tap or the keyboard reveals it too
  canvas.addEventListener('click', () => setTimeout(() => !done && cleared() < 0.02 && finish(), 50))
  canvas.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && finish())
  return { reveal: finish }
}

/* ---------------------------------------------------------------- effects */
function confetti(host, n = 60) {
  const colours = ['#e85d75', '#f6c34a', '#7cc6a4', '#7aa7f0', '#f08a6c', '#c58cf0']
  for (let i = 0; i < n; i++) {
    const c = document.createElement('i')
    c.className = 'confetti'
    c.style.cssText = `--x:${rand(5, 95).toFixed(0)}%;--c:${colours[i % colours.length]};--r:${rand(-540, 540).toFixed(0)}deg;--t:${rand(1.6, 2.8).toFixed(2)}s;--d:${rand(0, 0.4).toFixed(2)}s;--s:${rand(6, 11).toFixed(0)}px;--sx:${rand(-40, 40).toFixed(0)}px`
    host.append(c)
    setTimeout(() => c.remove(), 3400)
  }
}

function hearts(host) {
  for (let i = 0; i < 12; i++) {
    const h = document.createElement('i')
    h.className = 'floatheart'
    h.textContent = ['❤️', '💖', '💕', '🥰'][i % 4]
    h.style.cssText = `--x:${rand(60, 92).toFixed(0)}%;--sx:${rand(-50, 30).toFixed(0)}px;--d:${(i * 0.06).toFixed(2)}s`
    host.append(h)
    setTimeout(() => h.remove(), 2600)
  }
}

/* ---------------------------------------------------------------- page */
function init() {
  const stage = $('#stage')
  const thread = $('#thread')
  const status = $('#status')
  const fx = $('#fx')
  const replay = $('#replay-btn')
  const skip = $('#skip-btn')
  const soundBtn = $('#sound-btn')
  const music = createMusic(F.music, soundBtn, (on) => stage.classList.toggle('is-playing', on))
  const fields = { mono: `${F.monogram[0]}${F.monogram[1]}`, groupName: `${F.first.name} & ${F.second.name} 💍` }
  $$('[data-field]').forEach((el) => (el.textContent = fields[el.dataset.field] ?? ''))

  // lock screen clock
  const clock = () => {
    const d = new Date()
    $('#lock-time').textContent = `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`
    $('#lock-date').textContent = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  }
  clock()
  setInterval(clock, 15000)

  const steps = script()
  let i = 0
  let run = 0
  let timer = 0
  let opened = false

  const nearBottom = () => thread.scrollHeight - thread.scrollTop - thread.clientHeight < 160
  const toBottom = (force) => (force || nearBottom()) && thread.scrollTo({ top: thread.scrollHeight, behavior: reducedMotion() ? 'auto' : 'smooth' })

  function wire(el, m) {
    if (m.type === 'big') confetti(fx)
    if (m.type === 'scratch') scratchCard($('[data-scratch]', el), () => confetti(fx, 40))
    if (m.type === 'voice') $('[data-voice]', el).addEventListener('click', () => (soundBtn.hidden ? null : soundBtn.click()))
    if (m.type === 'poll') {
      $$('[data-vote]', el).forEach((b) =>
        b.addEventListener('click', () => {
          if (el.classList.contains('is-voted')) return
          el.classList.add('is-voted')
          b.classList.add('is-mine')
          const yes = b.dataset.vote === 'yes'
          $$('[data-vote]', el).forEach((o) => {
            const share = o === b ? 1 : 0
            o.style.setProperty('--share', share)
            $('em', o).textContent = `${share * 100}%`
          })
          append({ from: 'me', type: 'text', text: $('span', b).textContent }, true)
          setTimeout(() => {
            append({ from: 'a', who: F.first.name, type: 'text', text: yes ? 'Yay!! See you there 🥰' : 'We’ll miss you — thank you for the love ❤️' }, true)
            if (F.rsvpHref) append({ from: 'b', who: F.second.name, type: 'rsvp' }, true)
            if (yes) confetti(fx, 40)
          }, 900)
        }),
      )
    }
  }

  function append(m, force) {
    const wrap = document.createElement('div')
    wrap.className = `row row--${m.from === 'me' ? 'me' : m.from === 'sys' ? 'sys' : 'them'} row--${m.type}`
    if (m.type === 'rsvp') {
      wrap.innerHTML = `<div class="msg"><b class="who">${escapeHtml(m.who)}</b><p>Please confirm here too 👇</p><a class="chip" href="${F.rsvpHref}" target="_blank" rel="noopener">✅ RSVP on WhatsApp</a></div>`
    } else if (m.from === 'me') {
      wrap.innerHTML = `<div class="msg"><p>${escapeHtml(m.text)}</p><span class="meta">${now()} ✓✓</span></div>`
    } else {
      const avatar = (m.from === 'a' || m.from === 'b') && m.type !== 'carousel' && m.type !== 'sticker'
      wrap.innerHTML = (avatar ? `<span class="av av--${m.from}" aria-hidden="true">${escapeHtml(m.who[0])}</span>` : '') + bubble(m)
    }
    thread.append(wrap)
    wire(wrap, m)
    toBottom(force)
    return wrap
  }

  function typing(m) {
    const t = document.createElement('div')
    t.className = 'row row--them row--typing'
    t.innerHTML = `<span class="av av--${m.from}" aria-hidden="true">${escapeHtml((m.who || '•')[0])}</span><div class="msg dots"><i></i><i></i><i></i></div>`
    thread.append(t)
    status.textContent = `${m.who} is typing…`
    toBottom()
    return t
  }

  function next(token) {
    if (token !== run || i >= steps.length) {
      if (i >= steps.length) {
        status.textContent = 'online'
        skip.hidden = true
      }
      return
    }
    const m = steps[i++]
    const fast = reducedMotion()
    if (m.from === 'sys' || fast) {
      append(m)
      timer = setTimeout(() => next(token), fast ? 60 : 650)
      return
    }
    const t = typing(m)
    const typeMs = Math.min(1700, 600 + (m.text ? m.text.length * 18 : 700))
    timer = setTimeout(() => {
      if (token !== run) return
      t.remove()
      status.textContent = 'online'
      append(m)
      timer = setTimeout(() => next(token), m.type === 'big' ? 1400 : 550)
    }, typeMs)
  }

  function start() {
    run++
    i = 0
    $$('.row', thread).forEach((r) => r.remove())
    skip.hidden = false
    next(run)
  }

  function open() {
    if (opened) return
    opened = true
    music.start()
    music.reveal()
    stage.classList.add('is-unlocked')
    replay.hidden = false
    setTimeout(start, reducedMotion() ? 0 : 700)
  }
  $('#open-btn').addEventListener('click', open)

  skip.addEventListener('click', () => {
    run++
    clearTimeout(timer)
    $$('.row--typing', thread).forEach((t) => t.remove())
    while (i < steps.length) append(steps[i++])
    status.textContent = 'online'
    skip.hidden = true
    toBottom(true)
  })

  replay.addEventListener('click', () => {
    clearTimeout(timer)
    music.restart()
    start()
  })

  // the composer: whatever you send comes back with hearts
  $('#composer').addEventListener('submit', (e) => {
    e.preventDefault()
    const input = $('#msg')
    const text = input.value.trim() || '❤️'
    input.value = ''
    append({ from: 'me', type: 'text', text }, true)
    hearts(fx)
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
