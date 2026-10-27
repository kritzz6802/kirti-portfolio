/* =============================================================================
   Invitation gallery — one card per design. Add a design by adding a row.
   ========================================================================== */

'use strict'

const INVITATIONS = [
  {
    route: '../invitation6/',
    name: 'Midnight Celestial',
    tag: 'New',
    text: 'Navy night sky, a rose-gold moon, constellations and floating lanterns.',
    colours: ['#0e1a3a', '#e8b4a6', '#fff4d6'],
  },
  {
    route: '../invitation4/',
    name: 'Pichwai Pastel',
    tag: 'New',
    text: 'Blush and powder blue, a lotus pond and white Pichwai cows.',
    colours: ['#fbe9ec', '#a9c7e8', '#f2a7be'],
  },
  {
    route: '../invitation7/',
    name: 'Terracotta Boho Sunset',
    tag: 'New',
    text: 'Rainbow arches, a sun disc, pampas vases and dried palms.',
    colours: ['#fbede3', '#d9805f', '#e2a64f'],
  },
  {
    route: '../invitation5/',
    name: 'Lavender & Champagne',
    tag: 'New',
    text: 'Wisteria cascades, lilac peonies, pearl strings and butterflies.',
    colours: ['#f3eefa', '#b9a3e3', '#c9b07f'],
  },
  {
    route: '../invitation3/',
    name: 'Emerald Peacock',
    text: 'Emerald velvet and gold, peacocks, lotus and jasmine.',
    colours: ['#0d3f31', '#c9a24b', '#f2a7be'],
  },
  {
    route: '../invitation2/',
    name: 'Ivory & Gold Royal',
    text: 'Maroon palace doors, marigolds, roses and a gold-foil card.',
    colours: ['#fbf6ec', '#7a1f2b', '#c9a24b'],
  },
  {
    route: '../invitation/',
    name: 'Mediterranean Watercolour',
    text: 'A ribbon-tied envelope and a painted coastal village.',
    colours: ['#ece6f0', '#4f6fc6', '#f6efe1'],
  },
]

function card(inv, i) {
  const slug = inv.route.replace(/\.\.\/|\//g, '')
  const swatches = inv.colours.map((c) => `<i style="background:${c}"></i>`).join('')
  return `
    <a class="card" href="${inv.route}" style="--i:${i}">
      <span class="card__frame">
        <img class="card__img card__img--cover" src="previews/${slug}-cover.jpg" alt="" loading="${i < 3 ? 'eager' : 'lazy'}" width="540" height="960" />
        <img class="card__img card__img--inside" src="previews/${slug}-card.jpg" alt="" loading="lazy" width="540" height="960" />
        <span class="card__sheen" aria-hidden="true"></span>
        ${inv.tag ? `<span class="card__tag">${inv.tag}</span>` : ''}
      </span>
      <span class="card__body">
        <span class="card__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="card__name">${inv.name}</span>
        <span class="card__text">${inv.text}</span>
        <span class="card__foot">
          <span class="card__swatches" aria-hidden="true">${swatches}</span>
          <span class="card__open">Open <span aria-hidden="true">→</span></span>
        </span>
      </span>
    </a>`
}

function init() {
  const gallery = document.getElementById('gallery')
  gallery.innerHTML = INVITATIONS.map(card).join('')

  // Cards rise in as they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        }
      }
    },
    { threshold: 0.12 },
  )
  gallery.querySelectorAll('.card').forEach((c) => io.observe(c))

  // A few drifting petals
  const petals = document.querySelector('.petals')
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('i')
      p.style.cssText = `--x:${(i * 7.3 + Math.random() * 5).toFixed(1)}%;--s:${(10 + Math.random() * 12).toFixed(0)}px;--t:${(12 + Math.random() * 10).toFixed(1)}s;--d:${(-Math.random() * 20).toFixed(1)}s;--sway:${(Math.random() * 120 - 60).toFixed(0)}px`
      petals.append(p)
    }
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
else init()
