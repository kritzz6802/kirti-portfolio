/* =============================================================================
   The Wedding Book — a card that opens like a book lying open in front of you.
   Every spread shows two pages; their lines appear one after another, like ink
   settling on paper. Wording comes from core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()
const READ_MS = 3600 // pause after a spread's last line before turning on its own
const LINE_S = 0.42 // seconds between lines

const esc = escapeHtml
// one line of a page; `k` is the kind of type
const ln = (text, k = 'body') => ({ text, k })

const ORNAMENT = `<svg class="orn" viewBox="0 0 200 24" aria-hidden="true"><path d="M8 12 H82 M118 12 H192" /><path d="M82 12 C88 4 94 4 100 12 C106 20 112 20 118 12 C112 4 106 4 100 12 C94 20 88 20 82 12Z" /><circle cx="100" cy="12" r="2.4" /></svg>`
const orn = () => ln('—', 'orn')

/* ---------------------------------------------------------------- the spreads (left page, right page) */
function spreads() {
  const [bf, gf] = F.families
  const list = []

  list.push([
    [ln('ganesha', 'ganesha'), ln(`॥ ${F.blessing} ॥`, 'deva'), orn(), ln('With the divine blessings of', 'small'), ln('Lord Ganesha', 'caps'), ln('and the love of our elders', 'small')],
    [ln('we joyfully invite you', 'italic'), ln('to celebrate the wedding of', 'italic'), orn(), ln(F.first.name, 'name'), ln('&', 'with'), ln(F.second.name, 'name'), orn(), ln(F.dateFull, 'small')],
  ])

  list.push([
    [ln(bf.label, 'small'), ln(bf.names[0], 'parent'), ln(`& ${bf.names[1]}`, 'parent'), orn(), ln('request the honour of your presence at the wedding of their daughter', 'italic'), ln(F.bride.name, 'name')],
    [ln('with', 'with'), ln(F.groom.name, 'name'), orn(), ln('son of', 'italic'), ln(gf.names[0], 'parent'), ln(`& ${gf.names[1]}`, 'parent'), ln(gf.label, 'small')],
  ])

  list.push([
    [ln('Save the date', 'caps'), orn(), ln(F.weekdayName, 'small'), ln(String(F.dayNumber), 'bigdate'), ln(`${F.monthName} ${F.year}`, 'caps'), ln(`at ${F.timeLabel}`, 'italic')],
    [ln('The venue', 'caps'), orn(), ln(F.venue, 'venue'), ln(`${F.address}, ${F.city}`, 'small'), ln('Counting down', 'italic'), ln('countdown', 'count')],
  ])

  const eventPage = (e, i) => [ln(`Celebration ${i + 1} of ${F.events.length}`, 'small'), ln(e.name, 'event'), orn(), ln(e.when, 'body'), ...(e.place ? [ln(e.place, 'italic')] : []), ...(e.dress ? [ln(`Dress code · ${e.dress}`, 'small')] : [])]
  for (let i = 0; i < F.events.length; i += 2) {
    const right = F.events[i + 1] ? eventPage(F.events[i + 1], i + 1) : [ln('ganesha', 'ganesha'), ln('More details to follow', 'italic')]
    list.push([eventPage(F.events[i], i), right])
  }

  const story = F.story.length ? [ln('Our story', 'caps'), orn(), ...F.story.map((s) => ln(s, 'italic')), ln(`${F.first.name} & ${F.second.name}`, 'sign')] : [ln(F.closingMessage, 'sign'), orn(), ln(`${F.first.name} & ${F.second.name}`, 'caps')]
  list.push([
    story,
    [ln('Kindly reply', 'sign'), ln(`by ${F.rsvpByLong}`, 'small'), orn(), ln('buttons', 'buttons'), ...F.contacts.map((c) => ln(c.phone ? `${c.name} · ${c.phone}` : c.name, 'small')), orn(), ln(F.closingMessage, 'italic')],
  ])
  return list
}

/* ---------------------------------------------------------------- render a page */
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

const paper = (lines, folio, side) => `<div class="paper paper--${side}"><span class="paper__frame"></span><div class="paper__text">${lines.map(line).join('')}</div><span class="folio">${folio}</span></div>`

const cover = () => `<div class="cover"><span class="cover__frame"></span>
  <span class="cover__mono">${esc(F.first.name[0])}<i>&amp;</i>${esc(F.second.name[0])}</span>
  <p class="cover__pre">The wedding of</p>
  <p class="cover__names">${esc(F.first.name)}<br /><em>&amp;</em><br />${esc(F.second.name)}</p>
  <p class="cover__date">${esc(F.dateLong)}</p>
  <span class="ribbon" aria-hidden="true"></span></div>`

/* ---------------------------------------------------------------- the book */
function init() {
  const stage = $('#stage')
  const book = $('#book')
  const S = spreads()

  // leaf 0: cover | spread 0 left; leaf k: spread k-1 right | spread k left; the inside back cover holds the last right page
  const leafHtml = (front, back, i) => `<section class="leaf" data-i="${i}" style="--k:${i}"><div class="face face--front">${front}</div><div class="face face--back">${back}</div></section>`
  $('#leaves').innerHTML = S.map((sp, k) => leafHtml(k === 0 ? cover() : paper(S[k - 1][1], k * 2, 'right'), paper(sp[0], k * 2 + 1, 'left'), k)).join('')
  $('.book__back').innerHTML = paper(S[S.length - 1][1], S.length * 2, 'right')

  const leaves = $$('.leaf')
  const music = createMusic(F.music, $('#sound-btn'))
  const autoBtn = $('#auto-btn')
  const last = leaves.length // spread index once every leaf is turned
  $('#page-total').textContent = String(last + 1)
  document.title = `${F.first.name} & ${F.second.name} — The Wedding Book`

  let at = 0 // 0 = closed; n = n leaves turned (showing spread n-1)
  let auto = true
  let timer = 0
  let opened = false

  // the two faces visible at spread n
  const faces = (n) => (n === 0 ? [] : [$('.face--back', leaves[n - 1]), n < last ? $('.face--front', leaves[n]) : $('.book__back')])

  function stack() {
    leaves.forEach((leaf, i) => (leaf.style.zIndex = String(i < at ? i + 1 : leaves.length * 2 - i)))
  }

  function read() {
    clearTimeout(timer)
    $$('.is-reading').forEach((f) => f.classList.remove('is-reading'))
    const [left, right] = faces(at)
    let count = 0
    if (left) {
      count = $$('.ln', left).length
      left.style.setProperty('--o', '0')
      left.classList.add('is-reading')
      right.style.setProperty('--o', String(count))
      right.classList.add('is-reading')
      count += $$('.ln', right).length
    }
    $$('.face, .book__back').forEach((f) => f.setAttribute('aria-hidden', String(!f.classList.contains('is-reading') && !(at === 0 && f === $('.face--front', leaves[0])))))
    $('#page-n').textContent = String(at + 1)
    stage.classList.toggle('is-last', at === last)
    if (!auto || at === 0 || at === last) return
    timer = setTimeout(() => go(at + 1), (reducedMotion() ? 800 : count * LINE_S * 1000 + 1200) + READ_MS)
  }

  function go(n) {
    n = Math.max(0, Math.min(last, n))
    if (n === at) return read()
    const step = n > at ? 1 : -1
    // turn one leaf at a time so a jump still looks like turning pages
    const turnOne = () => {
      const leaf = step > 0 ? leaves[at] : leaves[at - 1]
      leaf.style.zIndex = String(leaves.length * 3)
      leaf.classList.add('is-turning')
      setTimeout(() => leaf.classList.remove('is-turning'), 1300)
      at += step
      leaf.classList.toggle('is-turned', step > 0)
      stage.classList.toggle('is-open', at > 0)
      if (at !== n) setTimeout(turnOne, 220)
      else {
        setTimeout(stack, 1250)
        setTimeout(read, reducedMotion() ? 0 : 700)
      }
    }
    $$('.is-reading').forEach((f) => f.classList.remove('is-reading'))
    turnOne()
  }

  function open() {
    if (!opened) {
      opened = true
      music.start()
      music.reveal()
      stage.classList.add('is-started')
    }
    go(at + 1)
  }

  // tap the book: the left page turns back, the right page forward
  book.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return
    if (!opened) return open()
    const r = $('.scene').getBoundingClientRect()
    go(e.clientX < r.left + r.width / 2 ? at - 1 : at + 1)
  })
  let sx = 0
  book.addEventListener('pointerdown', (e) => (sx = e.clientX))
  book.addEventListener('pointerup', (e) => {
    const dx = e.clientX - sx
    if (opened && Math.abs(dx) > 50) go(dx < 0 ? at + 1 : at - 1)
  })
  $('#next-btn').addEventListener('click', () => (opened ? go(at + 1) : open()))
  $('#prev-btn').addEventListener('click', () => go(at - 1))
  autoBtn.addEventListener('click', () => {
    auto = !auto
    autoBtn.classList.toggle('is-paused', !auto)
    autoBtn.setAttribute('aria-label', auto ? 'Pause page turning' : 'Turn pages automatically')
    read()
  })
  $('#replay-btn').addEventListener('click', () => {
    music.restart()
    go(0)
    // close the book, then open it again at the first spread
    setTimeout(() => go(1), reducedMotion() ? 300 : 1300 + last * 220)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') opened ? go(at + 1) : open()
    if (e.key === 'ArrowLeft') go(at - 1)
  })

  // the book follows the pointer or the phone's tilt a little
  const tilt = (x, y) => {
    stage.style.setProperty('--tx', `${(x * 8).toFixed(2)}deg`)
    stage.style.setProperty('--ty', `${(y * -6).toFixed(2)}deg`)
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
