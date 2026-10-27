/* =============================================================================
   L’Amour — The Wedding Issue. A magazine invitation with 3D page turns.
   Content lives in core.js (invitationData).
   ========================================================================== */

'use strict'

const F = buildFields()

/* ---------------------------------------------------------------- illustration helpers */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// a hanging wisteria raceme, top at (0,0), growing downward
function raceme(len, seed) {
  const r = rng(seed)
  const out = []
  const n = Math.round(len / 3.2)
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const w = 7 - t * 5.2
    const y = 4 + i * 3.2
    const c = `rgb(${Math.round(155 + 80 * t)},${Math.round(127 + 100 * t)},${Math.round(212 + 39 * t)})`
    for (const s of [-1, 1]) out.push(`<ellipse cx="${(s * w * 0.42 + (r() - 0.5)).toFixed(1)}" cy="${(y + (s > 0 ? 1 : 0)).toFixed(1)}" rx="${(w * 0.44).toFixed(1)}" ry="2.5" fill="${c}"/>`)
  }
  return `<path d="M0 0 V6" stroke="#8fa79a" stroke-width="1"/>${out.join('')}`
}

function wisteriaBand(width, seed, maxLen = 120) {
  const r = rng(seed)
  const out = [`<path d="M0 4 C${width * 0.3} 18 ${width * 0.6} -6 ${width} 8" stroke="#9c8a74" stroke-width="2.2" fill="none"/>`]
  const n = Math.round(width / (maxLen < 100 ? 20 : 15))
  for (let i = 0; i <= n; i++) {
    const x = (width * i) / n + r() * 6 - 3
    const len = maxLen * (0.35 + r() * 0.65)
    // the outer group places the raceme; the inner one is free for CSS to grow it
    out.push(`<g transform="translate(${x.toFixed(1)} ${(6 + r() * 8).toFixed(1)})"><g class="raceme" style="--i:${i}">${raceme(len, seed * 31 + i)}</g></g>`)
    if (i % 2) out.push(`<ellipse cx="${(x + 5).toFixed(1)}" cy="${(10 + r() * 6).toFixed(1)}" rx="6" ry="3" fill="url(#leafG)" transform="rotate(${(r() * 80 - 40).toFixed(0)} ${(x + 5).toFixed(1)} 12)"/>`)
  }
  return out.join('')
}

function peony(x, y, s, seed) {
  const r = rng(seed)
  const a = [0, 60, 120, 180, 240, 300].map((d) => `<ellipse cx="0" cy="-10" rx="11" ry="10" fill="url(#peony)" stroke="#b9a3e3" stroke-width=".6" transform="rotate(${d + r() * 10})"/>`).join('')
  const b = [30, 102, 174, 246, 318].map((d) => `<ellipse cx="0" cy="-6" rx="7.5" ry="7" fill="url(#peonyDeep)" stroke="#a58bd8" stroke-width=".5" transform="rotate(${d})"/>`).join('')
  const leaves = [-40, 30, 150].map((d) => `<ellipse cx="0" cy="-22" rx="5" ry="11" fill="url(#leafG)" transform="rotate(${d + r() * 20})"/>`).join('')
  return `<g transform="translate(${x} ${y}) scale(${s})">${leaves}${a}${b}<circle r="5" fill="#cbb6ef"/><path d="M-3 -1 C-3 -4 3 -4 3 -1 C3 2 -2 3 -2 0" fill="none" stroke="#8f74c9" stroke-width=".9"/></g>`
}

function barcode(seed) {
  const r = rng(seed)
  const bars = []
  for (let x = 0; x < 100; ) {
    const w = 0.6 + r() * 2.2
    bars.push(`#2b2140 ${x.toFixed(1)}% ${(x + w).toFixed(1)}%`, `transparent ${(x + w).toFixed(1)}% ${(x + w + 1.1).toFixed(1)}%`)
    x += w + 1.1
  }
  return `linear-gradient(90deg, ${bars.join(', ')})`
}

/* ---------------------------------------------------------------- the pages */
function pages() {
  const it = (i) => `style="--i:${i}"`
  const mono = `${F.monogram[0]}${F.monogram[1]}`
  const issue = `${F.monthName.slice(0, 3).toUpperCase()} ${F.year}`

  // calendar for the wedding month, with the day circled by hand
  const first = new Date(Date.UTC(F.year, F.month, 1)).getUTCDay()
  const days = new Date(Date.UTC(F.year, F.month + 1, 0)).getUTCDate()
  const cells = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<b>${d}</b>`)
  for (let i = 0; i < first; i++) cells.push('<span></span>')
  for (let d = 1; d <= days; d++) {
    cells.push(d === F.dayNumber
      ? `<span class="cal__day is-day">${d}<svg viewBox="0 0 60 50" aria-hidden="true"><path pathLength="1" d="M8 26 C6 10 30 4 46 10 C58 15 56 36 40 42 C24 48 6 40 9 24 C11 14 22 9 30 9"/></svg></span>`
      : `<span>${d}</span>`)
  }

  const contents = [
    ['03', 'The Families', 'Two families, one celebration'],
    ['04', 'Save the Date', 'Mark your calendar'],
    ['05', 'The Celebrations', 'Six days of joy'],
    ['06', 'Our Story', 'How it all began'],
    ['07', 'The Venue', 'Where to find us'],
    ['08', 'RSVP', 'Kindly reply'],
  ]
  const rows = F.events
    .map((e, n) => `<li class="m-item" ${it(n + 2)}><span class="it__no">${String(n + 1).padStart(2, '0')}</span>
      <div><b>${escapeHtml(e.name)}</b><small>${escapeHtml(e.when)}</small>${e.place ? `<small class="it__place">${escapeHtml(e.place)}</small>` : ''}${e.dress ? `<small class="it__place">Dress code · ${escapeHtml(e.dress)}</small>` : ''}</div></li>`)
    .join('')
  const contacts = F.contacts
    .map((c) => {
      const tel = String(c.phone || '').replace(/[^\d+]/g, '')
      return `<p>${escapeHtml(c.name)}${tel ? ` · <a href="tel:${tel}">${escapeHtml(c.phone)}</a>` : ''}</p>`
    })
    .join('')
  const [famA, famB] = F.families

  return [
    // 01 · cover
    `<section class="pg cover">
      <svg class="cover__wisteria" viewBox="0 0 360 170" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${wisteriaBand(360, 3, 70)}</svg>
      <div class="cover__top m-item" ${it(0)}><span>The Wedding Issue</span><span>Vol. 01 · ${issue}</span></div>
      <h1 class="masthead" aria-label="L’Amour">${[...'L’AMOUR'].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</h1>
      <svg class="cover__arch" viewBox="0 0 200 260" aria-hidden="true"><path pathLength="1" d="M10 258 V100 A90 90 0 0 1 190 100 V258"/><path pathLength="1" d="M22 258 V102 A78 78 0 0 1 178 102 V258"/></svg>
      <h2 class="cover__names"><span class="cover__first">${escapeHtml(F.first.name)}</span><span class="cover__amp">&amp;</span><span class="cover__second">${escapeHtml(F.second.name)}</span></h2>
      <ul class="coverlines">
        <li class="m-item" ${it(6)}><b>Exclusive</b> The date is set — p.04</li>
        <li class="m-item" ${it(7)}><b>${F.events.length} celebrations</b> you won’t want to miss — p.05</li>
        <li class="m-item" ${it(8)}><b>Where to</b> find us — p.07</li>
      </ul>
      <svg class="cover__peonies" viewBox="0 0 360 120" aria-hidden="true">${peony(40, 90, 2.1, 1)}${peony(92, 104, 1.4, 2)}${peony(318, 92, 2, 3)}${peony(270, 108, 1.3, 4)}</svg>
      <div class="cover__foot m-item" ${it(9)}><span class="barcode" style="background:${barcode(F.dayNumber * 7)}"></span>
        <p>${escapeHtml(F.first.name)} ${escapeHtml(F.first.surname)} &amp; ${escapeHtml(F.second.name)} ${escapeHtml(F.second.surname)}<br /><em>are getting married</em></p></div>
    </section>`,

    // 02 · contents
    `<section class="pg contents">
      <div class="m-item" ${it(0)}>${ganeshaSvg()}</div>
      <p class="m-item shloka" ${it(1)} lang="sa">॥ ${escapeHtml(F.blessing)} ॥</p>
      <h2 class="m-item kicker" ${it(2)}>In this issue</h2>
      <ol class="toc">${contents.map(([n, t, s], k) => `<li class="m-item" ${it(k + 3)}><button type="button" data-goto="${Number(n) - 1}"><span class="toc__n">${n}</span><span><b>${t}</b><small>${s}</small></span></button></li>`).join('')}</ol>
      <svg class="corner-peony" viewBox="0 0 120 120" aria-hidden="true">${peony(80, 90, 2.4, 9)}</svg>
    </section>`,

    // 03 · the families (feature)
    `<section class="pg feature">
      <p class="m-item label" ${it(0)}>Feature</p>
      <h2 class="m-item headline" ${it(1)}>Two families, <em>one celebration</em></h2>
      <p class="m-item byline" ${it(2)}>With the blessings of our elders</p>
      <p class="m-item dropcap" ${it(3)}>${escapeHtml(F.familiesMessage)} ${escapeHtml(F.openingMessage)}, ${escapeHtml(F.first.name)} and ${escapeHtml(F.second.name)} ${escapeHtml(F.inviteLine)}.</p>
      <div class="fams">
        <div class="m-item" ${it(4)}><p class="label">${escapeHtml(famA.label)}</p>${famA.names.map((n, k) => `<p class="fam__n">${k ? '&amp; ' : ''}${escapeHtml(n)}</p>`).join('')}</div>
        <div class="m-item" ${it(5)}><p class="label">${escapeHtml(famB.label)}</p>${famB.names.map((n, k) => `<p class="fam__n">${k ? '&amp; ' : ''}${escapeHtml(n)}</p>`).join('')}</div>
      </div>
      <svg class="feature__vine m-item" ${it(6)} viewBox="0 0 360 90" aria-hidden="true">${wisteriaBand(360, 21, 70)}</svg>
    </section>`,

    // 04 · save the date
    `<section class="pg date">
      <p class="m-item label" ${it(0)}>Save the date</p>
      <div class="date__hero">
        <span class="date__month m-item" ${it(1)}>${F.monthName}</span>
        <b class="date__day m-item" ${it(2)}>${F.dayNumber}</b>
      </div>
      <p class="m-item date__sub" ${it(3)}>${F.weekdayName} · ${F.year} · ${F.timeLabel}</p>
      <div class="cal m-item" ${it(4)}><p class="cal__title">${F.monthName} ${F.year}</p><div class="cal__grid">${cells.join('')}</div></div>
      <p class="m-item date__count" ${it(5)}><b data-c="days">0</b> days · <b data-c="hours">0</b> hrs · <b data-c="minutes">0</b> min · <b data-c="seconds">0</b> sec</p>
    </section>`,

    // 05 · itinerary
    `<section class="pg itin">
      <p class="m-item label" ${it(0)}>The celebrations</p>
      <h2 class="m-item headline" ${it(1)}>The <em>Itinerary</em></h2>
      <ol class="itinerary">${rows}</ol>
    </section>`,

    // 06 · story
    `<section class="pg story">
      <span class="quote m-item" ${it(0)} aria-hidden="true">“</span>
      <div class="story__lines">${F.story.map((s, k) => `<p class="m-item" ${it(k + 1)}>${escapeHtml(s)}</p>`).join('')}</div>
      <p class="m-item story__sign" ${it(F.story.length + 1)}>${escapeHtml(F.first.name)} &amp; ${escapeHtml(F.second.name)}</p>
      <svg class="story__vine" viewBox="0 0 360 160" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${wisteriaBand(360, 33, 130)}</svg>
    </section>`,

    // 07 · venue
    `<section class="pg venue">
      <p class="m-item label" ${it(0)}>The venue</p>
      <div class="window m-item" ${it(1)}>
        <svg viewBox="0 0 200 250" aria-hidden="true">
          <path d="M14 248 V96 A86 86 0 0 1 186 96 V248Z" fill="#f1eafc" stroke="url(#champ)" stroke-width="3"/>
          <path d="M100 12 V248 M14 150 H186" stroke="url(#champ)" stroke-width="2"/>
          <g transform="translate(0 6)">${wisteriaBand(200, 41, 110)}</g>
          ${peony(30, 236, 1.6, 12)}${peony(172, 238, 1.4, 13)}
        </svg>
      </div>
      <h2 class="m-item headline" ${it(2)}>${escapeHtml(F.venue)}</h2>
      <p class="m-item label" ${it(3)}>${escapeHtml(F.city)}</p>
      <p class="m-item venue__addr" ${it(4)}>${escapeHtml(F.address)}</p>
      <a class="m-item btn" ${it(5)} href="${F.mapHref}" target="_blank" rel="noopener">Get directions</a>
    </section>`,

    // 08 · back cover
    `<section class="pg back">
      <svg class="back__wisteria" viewBox="0 0 360 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${wisteriaBand(360, 55, 130)}</svg>
      <div class="seal m-item" ${it(0)}><span>${mono}</span></div>
      <h2 class="m-item back__title" ${it(1)}>Kindly reply</h2>
      <p class="m-item label" ${it(2)}>by ${escapeHtml(F.rsvpByLong)}</p>
      ${F.rsvpHref ? `<a class="m-item btn btn--light" ${it(3)} href="${F.rsvpHref}" target="_blank" rel="noopener">RSVP on WhatsApp</a>` : ''}
      <div class="m-item back__contacts" ${it(4)}>${contacts}</div>
      <p class="m-item back__closing" ${it(5)}>${escapeHtml(F.closingMessage)}</p>
      <div class="back__foot m-item" ${it(6)}><span class="barcode barcode--light" style="background:${barcode(F.dayNumber * 13)}"></span><span>L’Amour · The Wedding Issue · ${issue}</span></div>
    </section>`,
  ]
}

/* ---------------------------------------------------------------- the book */
function init() {
  const stage = $('#stage')
  const book = $('#book')
  const list = pages()
  book.innerHTML = list
    .map((html, i) => `<div class="leaf" data-i="${i}" aria-hidden="${i ? 'true' : 'false'}"><div class="leaf__front">${html}</div><div class="leaf__back" aria-hidden="true"></div></div>`)
    .join('')
  const leaves = $$('.leaf', book)
  const music = createMusic(F.music, $('#sound-btn'))
  const replay = $('#replay-btn')
  $('#folio-total').textContent = String(leaves.length).padStart(2, '0')
  let page = 0
  let started = false
  let countTimer = 0

  function layer() {
    leaves.forEach((leaf, i) => {
      leaf.style.zIndex = String(i < page ? i + 1 : leaves.length * 2 - i)
      leaf.classList.toggle('is-flipped', i < page)
      leaf.classList.toggle('is-current', i === page)
      leaf.setAttribute('aria-hidden', String(i !== page))
    })
    $('#folio-num').textContent = String(page + 1).padStart(2, '0')
    stage.classList.toggle('is-last', page === leaves.length - 1)
    stage.classList.toggle('is-first', page === 0)
  }

  function go(n) {
    n = Math.max(0, Math.min(leaves.length - 1, n))
    if (n === page) return
    const forward = n > page
    // the leaf being turned rides above everything while it moves
    const turning = forward ? leaves[page] : leaves[n]
    turning.style.zIndex = String(leaves.length * 3)
    turning.classList.add('is-turning')
    setTimeout(() => turning.classList.remove('is-turning'), 1100)
    page = n
    leaves.forEach((leaf, i) => {
      leaf.classList.toggle('is-flipped', i < page)
      leaf.classList.toggle('is-current', i === page)
      leaf.setAttribute('aria-hidden', String(i !== page))
    })
    $('#folio-num').textContent = String(page + 1).padStart(2, '0')
    stage.classList.toggle('is-last', page === leaves.length - 1)
    stage.classList.toggle('is-first', page === 0)
    setTimeout(layer, 1000)
  }

  function start() {
    if (started) return
    started = true
    music.start()
    music.reveal()
    replay.hidden = false
    stage.classList.add('is-started')
    paintCount()
    countTimer = setInterval(paintCount, 1000)
  }

  function paintCount() {
    const p = countdownParts(F.target)
    $$('[data-c]').forEach((el) => (el.textContent = String(p[el.dataset.c]).padStart(2, '0')))
  }

  const next = () => {
    start()
    go(page + 1)
  }
  const prev = () => go(page - 1)

  // tap zones + swipe
  let sx = 0
  for (const [el, fn] of [[$('#next'), next], [$('#prev'), prev]]) {
    el.addEventListener('pointerdown', (e) => (sx = e.clientX))
    el.addEventListener('pointerup', (e) => {
      const dx = e.clientX - sx
      if (Math.abs(dx) > 40) return dx < 0 ? next() : prev()
      fn()
    })
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') next()
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev()
  })
  book.addEventListener('click', (e) => {
    const b = e.target.closest('[data-goto]')
    if (b) go(Number(b.dataset.goto))
  })

  replay.addEventListener('click', () => {
    go(0)
    setTimeout(() => {
      stage.classList.remove('is-assembled')
      void stage.offsetWidth
      requestAnimationFrame(() => stage.classList.add('is-assembled'))
      music.restart()
    }, 1100)
  })

  layer()
  requestAnimationFrame(() => stage.classList.add('is-assembled'))
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
