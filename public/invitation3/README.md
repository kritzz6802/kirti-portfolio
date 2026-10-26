# Emerald & gold invitation with the DK crest — `/invitation3/`

The same animation sequence as `/invitation2/` (palace doors, light, petals, the card written in gold, the auto tour),
in a richer theme: emerald velvet and gold, pearl-ivory doors, peacocks with feather trains, pink lotus, white
jasmine and marigold. Before the doors appear, a **DK monogram crest** opens the page.

```
public/invitation3/
├── index.html   markup: the DK intro, the palace doors, the hero card and eight sections
├── styles.css   shared layout, the emerald theme (after the palette in :root), the intro animation
├── art.js       vector art: crest, peacocks, lotus, jasmine, pearl doors, mandalas, diyas
├── script.js    invitationData (all content), intro and door timelines, tour, countdown, music, replay
└── assets/      audio/wedding-loop.mp3 (original); fonts/ and images/ are empty
```

All the artwork is vector, built from gradients and shapes with no photos and no blur, so it stays sharp on any
screen.

## Run it

| How | URL |
| --- | --- |
| `npm run dev` | <http://localhost:5173/invitation3/> |
| `npm run build && npm run preview` | <http://localhost:4173/invitation3/> |
| Netlify / Apache (`dist/`) | `https://<site>/invitation3/` |
| No server | open `public/invitation3/index.html` directly |

## The sequence

| Time | What happens |
| --- | --- |
| 0 – 4.6 s (on load) | The crest's gold rings draw themselves; the emerald medallion fills in; laurel leaves appear one by one; "D" and "K" are traced in gold, then filled; a lotus settles on top; a light sweep crosses the crest; "Kirti & Dharmil · Wedding Invitation" fades in |
| 4.6 – 6 s | The background melts away and the crest shrinks onto the doors, where it becomes the door seal |
| after | Emerald palace with peacocks, garlands and diyas; "Tap the seal to open". Tapping during the crest skips straight here and opens the doors |
| tap → | The same sequence as `/invitation2/`: the seal flares, light opens down the seam, the doors swing open with a petal burst, then a flash as the view moves through the arch onto the card; Ganesha and the shloka, the names written in gold, the date and venue, then the auto tour through every section |

**Replay** replays the crest, then opens the doors on its own. With `prefers-reduced-motion`, everything still
appears in the same order, but without the movement.

## Change the content

All the content is in `invitationData` at the top of `script.js`, with the same fields as `/invitation2/` (see
its README), plus two more:

- `monogram: ['D', 'K']` — the two letters in the crest, used both in the intro and on the door seal.
- `introLine` — the line under the names on the crest screen.

Lines marked `// PLACEHOLDER` still need real details: the date, time, venue, functions, story, hotels, RSVP
number and contacts.

## Music

`assets/audio/wedding-loop.mp3` is an original 63-second loop (tanpura, santoor-like plucks, a bansuri-like
melody and a soft dholak), rendered by `scripts/invitation-music.py`, so there are no licensing worries. It starts
with the tap. To use your own track, change `music.src`.
