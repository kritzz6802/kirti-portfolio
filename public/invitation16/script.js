/* =============================================================================
   The Wedding Book — a 3D card you open and read page by page.
   Each page's lines appear one after another, like ink settling on paper.
   Wording comes from core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const READ_MS = 3200 // pause after a page's last line before turning on its own

const esc = escapeHtml
// one line of a page; `k` is the kind of type
const ln = (text, k = 'body') => ({ text, k })

const ORNAMENT = `<svg class="orn" viewBox="0 0 200 24" aria-hidden="true"><path d="M8 12 H82 M118 12 H192" /><path d="M82 12 C88 4 94 4 100 12 C106 20 112 20 118 12 C112 4 106 4 100 12 C94 20 88 20 82 12Z" /><circle cx="100" cy="12" r="2.4" /></svg>`

/* ---------------------------------------------------------------- the pages */
function pages() {
  const [bf, gf] = F.families
  const list = []

  list.push({ kind: 'cover' })

  list.push({
    lines: [
      ln('ganesha', 'ganesha'),
      ln(`॥ ${F.blessing} ॥`, 'deva'),
      ln('—', 'orn'),
      ln('With the divine blessings of', 'small'),
      ln('Lord Ganesha', 'caps'),
      ln('and the love of our elders', 'small'),
      ln('we joyfully invite you', 'italic'),
      ln('to celebrate a new beginning', 'italic'),
    ],
  })

  list.push({
    lines: [
      ln(bf.names[0], 'parent'),
      ln(`& ${bf.names[1]}`, 'parent'),
      ln('request the honour of your presence at the wedding of their daughter', 'italic'),
      ln(F.bride.name, 'name'),
      ln('with', 'with'),
      ln(F.groom.name, 'name'),
      ln('son of', 'italic'),
      ln(gf.names[0], 'parent'),
      ln(`& ${gf.names[1]}`, 'parent'),
    ],
  })

  list.push({
    lines: [
      ln('Save the date', 'caps'),
      ln('—', 'orn'),
      ln(F.weekdayName, 'small'),
      ln(String(F.dayNumber), 'bigdate'),
      ln(`${F.monthName} ${F.year}`, 'caps'),
      ln(`at ${F.timeLabel}`, 'italic'),
      ln('—', 'orn'),
      ln(F.venue, 'venue'),
      ln(`${F.address}, ${F.city}`, 'small'),
      ln('countdown', 'count'),
    ],
  })

  F.events.forEach((e, i) => {
    list.push({
      lines: [
        ln(`Celebration ${i + 1} of ${F.events.length}`, 'small'),
        ln(e.name, 'event'),
        ln('—', 'orn'),
        ln(e.when, 'body'),
        ...(e.place ? [ln(e.place, 'italic')] : []),
        ...(e.dress ? [ln(`Dress code · ${e.dress}`, 'small')] : []),
      ],
    })
  })

  if (F.story.length) list.push({ lines: [ln('Our story', 'caps'), ln('—', 'orn'), ...F.story.map((s) => ln(s, 'italic')), ln(`${F.first.name} & ${F.second.name}`, 'sign')] })

  list.push({
    lines: [
      ln('Kindly reply', 'sign'),
      ln(`by ${F.rsvpByLong}`, 'small'),
      ln('—', 'orn'),
      ln('buttons', 'buttons'),
      ...F.contacts.map((c) => ln(c.phone ? `${c.name} · ${c.phone}` : c.name, 'small')),
      ln('—', 'orn'),
      ln(F.closingMessage, 'italic'),
      ln(`${F.first.name} & ${F.second.name}`, 'caps'),
    ],
  })

  list.push({ kind: 'back' })
  return list
}

/* ---------------------------------------------------------------- render one page */
function line(l, i) {
  const s = `style="--i:${i}"`
  switch (l.k) {
    case 'ganesha':
      return `<div class="ln ln--ganesha" ${s}>${ganeshaSvg('g')}</div>`
    case 'orn':
      return `<div class="ln ln--orn" ${s}>${ORNAMENT}</div>`
    case 'count':
      return `<dl class="ln count" ${s}><div><dd data-c="days">0</dd><dt>days</dt></div><div><dd data-c="hours">0</dd><dt>hours</dt></div><div><dd data-c="minutes">0</dd><dt>min</dt></div><div><dd data-c="seconds">0</dd><dt>sec</dt></div></dl>`
    case 'buttons':
      return `<div class="ln btns" ${s}>${F.rsvpHref ? `<a class="btn" href="${F.rsvpHref}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : ''}<a class="btn btn--ghost" href="${calendarHref(F)}" target="_blank" rel="noopener">Save the date</a><a class="btn btn--ghost" href="${F.mapHref}" target="_blank" rel="noopener">Directions</a></div>`
    case 'name':
    case 'event':
    case 'sign':
      // script lines are written on, left to right
      return `<p class="ln ln--${l.k}" ${s}><span class="ink">${esc(l.text)}</span></p>`
    default:
      return `<p class="ln ln--${l.k}" ${s}${l.k === 'deva' ? ' lang="sa"' : ''}>${esc(l.text)}</p>`
  }
}

function pageHtml(p, n, total) {
  if (p.kind === 'cover') {
    return `<div class="cover"><span class="cover__frame"></span>
      <span class="cover__mono">${esc(F.first.name[0])}<i>&amp;</i>${esc(F.second.name[0])}</span>
      <p class="cover__pre">The wedding of</p>
      <p class="cover__names">${esc(F.first.name)}<br /><em>&amp;</em><br />${esc(F.second.name)}</p>
      <p class="cover__date">${esc(F.dateLong)}</p>
      <span class="ribbon" aria-hidden="true"></span></div>`
  }
  if (p.kind === 'back') {
    return `<div class="cover cover--back"><span class="cover__frame"></span><span class="cover__mono">${esc(F.first.name[0])}<i>&amp;</i>${esc(F.second.name[0])}</span><p class="cover__pre">with love</p></div>`
  }
  return `<div class="paper"><span class="paper__frame"></span><div class="paper__text">${p.lines.map(line).join('')}</div><span class="folio">${n} · ${total}</span></div>`
}

/* ---------------------------------------------------------------- the book */
function init() {
  const stage = $('#stage')
  const book = $('#book')
  const list = pages()
  const readable = list.length - 1 // the back cover is never "read"
  $('#leaves').innerHTML = list
    .slice(0, -1)
    .map((p, i) => `<section class="leaf${p.kind === 'cover' ? ' leaf--cover' : ''}" data-i="${i}" aria-hidden="${i ? 'true' : 'false'}">
      <div class="leaf__front">${pageHtml(p, i, readable - 1)}</div>
      <div class="leaf__back" aria-hidden="true"><div class="paper paper--back"><span class="paper__frame"></span>${ORNAMENT}</div></div></section>`)
    .join('')
  $('.book__back').innerHTML = pageHtml(list[list.length - 1])
  const leaves = $$('.leaf')
  const music = createMusic(F.music, $('#sound-btn'))
  const autoBtn = $('#auto-btn')
  $('#page-total').textContent = String(leaves.length)
  document.title = `${F.first.name} & ${F.second.name} — The Wedding Book`

  let page = 0 // the leaf currently on top
  let auto = true
  let timer = 0
  let opened = false

  function stack() {
    leaves.forEach((leaf, i) => {
      leaf.style.zIndex = String(i < page ? i + 1 : leaves.length * 2 - i)
      leaf.classList.toggle('is-turned', i < page)
      leaf.setAttribute('aria-hidden', String(i !== page))
    })
  }

  function read() {
    clearTimeout(timer)
    leaves.forEach((l, i) => l.classList.toggle('is-reading', i === page))
    $('#page-n').textContent = String(page + 1)
    stage.classList.toggle('is-last', page === leaves.length - 1)
    if (!auto || page === 0 || page >= leaves.length - 1) return
    const n = $$('.ln', leaves[page]).length
    timer = setTimeout(() => go(page + 1), (reducedMotion() ? 600 : n * 450 + 900) + READ_MS)
  }

  function go(n) {
    n = Math.max(0, Math.min(leaves.length - 1, n))
    if (n === page) return read()
    const forward = n > page
    const turning = forward ? leaves[page] : leaves[n]
    turning.style.zIndex = String(leaves.length * 3)
    turning.classList.add('is-turning')
    setTimeout(() => turning.classList.remove('is-turning'), 1300)
    page = n
    leaves.forEach((leaf, i) => leaf.classList.toggle('is-turned', i < page))
    stage.classList.toggle('is-open', page > 0)
    setTimeout(stack, 1250)
    setTimeout(read, reducedMotion() ? 0 : 650)
  }

  function open() {
    if (!opened) {
      opened = true
      music.start()
      music.reveal()
      stage.classList.add('is-started')
    }
    go(page + 1)
  }

  // tap the book: right side turns forward, left side back
  book.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return
    if (!opened) return open()
    const r = book.getBoundingClientRect()
    if (e.clientX < r.left + r.width * 0.3) go(page - 1)
    else go(page + 1)
  })
  let sx = 0
  book.addEventListener('pointerdown', (e) => (sx = e.clientX))
  book.addEventListener('pointerup', (e) => {
    const dx = e.clientX - sx
    if (opened && Math.abs(dx) > 50) dx < 0 ? go(page + 1) : go(page - 1)
  })
  $('#next-btn').addEventListener('click', () => (opened ? go(page + 1) : open()))
  $('#prev-btn').addEventListener('click', () => go(page - 1))
  autoBtn.addEventListener('click', () => {
    auto = !auto
    autoBtn.classList.toggle('is-paused', !auto)
    autoBtn.setAttribute('aria-label', auto ? 'Pause page turning' : 'Turn pages automatically')
    read()
  })
  $('#replay-btn').addEventListener('click', () => {
    music.restart()
    go(0)
    // close the book, then open it again from the first page
    setTimeout(() => go(1), reducedMotion() ? 300 : 1500)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') opened ? go(page + 1) : open()
    if (e.key === 'ArrowLeft') go(page - 1)
  })

  // the book follows the pointer or the phone's tilt a little
  const tilt = (x, y) => {
    stage.style.setProperty('--tx', `${(x * 12).toFixed(2)}deg`)
    stage.style.setProperty('--ty', `${(y * -8).toFixed(2)}deg`)
  }
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect()
    tilt((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5)
  })
  stage.addEventListener('pointerleave', () => tilt(0, 0))
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma != null) tilt(Math.max(-0.5, Math.min(0.5, e.gamma / 60)), Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 60)))
  })

  stack()
  read()

  const paintCount = () => {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }
  paintCount()
  setInterval(paintCount, 1000)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
