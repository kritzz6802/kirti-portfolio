/* =============================================================================
   Invitation gallery — one card per design. Add a design by adding a row.
   ========================================================================== */

'use strict'

const INVITATIONS = [
  {
    route: '../invitation17/',
    name: 'The Pop-up Words',
    tag: '3D pop-up',
    text: 'A maroon-and-gold pop-up card with words instead of pictures — open it and laser-cut panels (a Mughal arch, a gold lace card, a mandala medallion, a foil ribbon) spring up in jewel tones, each line appearing in turn.',
    colours: ['#5c0f23', '#e6c470', '#145a43'],
  },
  {
    route: '../invitation16/',
    name: 'The Wedding Book',
    tag: '3D book',
    text: 'A wine-and-gold card that opens like a real book lying open — a horizontal two-page spread where pages turn in 3D and each line appears in turn: blessings, families, the date, every celebration and the RSVP.',
    colours: ['#6d1a2a', '#fffaf1', '#c9a24b'],
  },
  {
    route: '../invitation14/',
    name: 'The Pop-up Card',
    tag: '3D paper',
    text: 'A laser-cut card that opens and pops up in real 3D paper layers — palace, elephants, mandap, henna hands — a new pop-up page for every celebration. Tilt to see the depth.',
    colours: ['#fffaf2', '#f4acb7', '#c9a24b'],
  },
  {
    route: '../invitation15/',
    name: 'The Acrylic Card',
    tag: 'Acrylic',
    text: 'A clear acrylic card with liquid-gold foil and pressed flowers that you can turn in your hand and flip; the celebrations are tinted acrylic tiles.',
    colours: ['#121212', '#e6c27a', '#f2b5c0'],
  },
  {
    route: '../invitation13/',
    name: 'A Reel of Forever',
    tag: 'Photo film',
    text: 'A cinematic film built from real photos — slow camera moves, film grain and light leaks, falling polaroids, and each celebration as a colour-graded photo chapter.',
    colours: ['#0d0a0b', '#d9b56c', '#b3122e'],
  },
  {
    route: '../invitation12/',
    name: 'Our Shaadi Story',
    tag: 'Animated film',
    text: 'An animated wedding film — Kirti & Dharmil meet, then every function plays as its own scene with the families: aarti, mehendi on a swing, haldi, sangeet, the pheras and the reception.',
    colours: ['#ffcad4', '#c9184a', '#ffd166'],
  },
  {
    route: '../invitation8/',
    name: 'Now Playing',
    tag: 'Vinyl',
    text: 'The wedding as an album — the record slides out onto a turntable and spins; tracklist, karaoke lyrics, liner-note credits.',
    colours: ['#f3ead9', '#7b1e2b', '#e9b949'],
  },
  {
    route: '../invitation9/',
    name: 'The Chat',
    tag: 'Chat',
    text: 'A lock-screen notification opens a live group chat — typing dots, a scratch-to-reveal date, a voice note and a “Will you come?” poll.',
    colours: ['#fdf1ef', '#e85d75', '#4b7bec'],
  },
  {
    route: '../invitation10/',
    name: 'Kai Po Che!',
    tag: 'Kites',
    text: 'An Uttarayan kite unfolds into the card; scrolling turns morning into a starry night where you release a tukkal lantern.',
    colours: ['#7fc4e8', '#ff5d73', '#ffd166'],
  },
  {
    route: '../invitation11/',
    name: 'Coming Soon',
    tag: 'Premiere',
    text: 'A Bollywood premiere — curtains part, a film-leader countdown, poster, cast, showtimes, a marquee and book-your-seat RSVP.',
    colours: ['#120a0c', '#8e1424', '#f2c14e'],
  },
  {
    route: '../invitation6/',
    name: 'Written in the Stars',
    tag: 'Stories',
    text: 'Stars fly together into K ♥ D, then the invitation plays as tap-through stories — moon-phase date, constellation timeline, a lantern to release.',
    colours: ['#0b1430', '#e8b4a6', '#fff4d6'],
  },
  {
    route: '../invitation4/',
    name: 'The Pichwai Scroll',
    tag: 'Scroll',
    text: 'A tied painted scroll unrolls into the whole invitation — Pichwai cows, lotus date medallion, a temple bell to ring and a koi pond.',
    colours: ['#fbe9ec', '#a9c7e8', '#e05a8c'],
  },
  {
    route: '../invitation7/',
    name: 'Our Little Scrapbook',
    tag: 'Scrapbook',
    text: 'A kraft envelope bursts into cards you can move around — polaroid, boarding pass, ticket stubs, flip clock, map and postcard.',
    colours: ['#efe1cc', '#c96f4f', '#e2a64f'],
  },
  {
    route: '../invitation5/',
    name: 'L’Amour · The Wedding Issue',
    tag: 'Magazine',
    text: 'An editorial magazine with real page turns — cover story, families feature, a circled calendar and the itinerary.',
    colours: ['#f3eefa', '#5a4680', '#c9b07f'],
  },
  {
    route: '../invitation3/',
    name: 'Emerald Peacock',
    text: 'Palace doors with peacocks, a DK crest, emerald velvet and gold.',
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
