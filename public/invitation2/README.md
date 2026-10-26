# Royal wedding invitation — `/invitation2/`

An ivory & gold animated invitation for Kirti & Dharmil, written in plain HTML, CSS and JavaScript.
It is separate from `/invitation/` (the first, watercolour version), and neither page depends on the other.

```
public/invitation2/
├── index.html   markup: the palace doors, the hero card and eight sections
├── styles.css   layout, 3D doors, light and petal effects, reveals, responsive and reduced-motion rules
├── art.js       every illustration as vector SVG: doors, palace, Ganesha, roses, marigolds, mandalas, diyas
├── script.js    invitationData (all content), timeline, auto tour, countdown, music, replay
└── assets/      audio/wedding-loop.mp3; fonts/ and images/ are empty, for your own files
```

All the artwork is vector, built from gradients and shapes with no photos and no blur, so it stays sharp at any size.

## Run it

| How | URL |
| --- | --- |
| `npm run dev` | <http://localhost:5173/invitation2/> |
| `npm run build && npm run preview` | <http://localhost:4173/invitation2/> |
| Netlify / Apache (`dist/`) | `https://<site>/invitation2/` |
| No server | open `public/invitation2/index.html` directly |

## Fill in the details

Everything shown on the page comes from `invitationData` at the top of `script.js`. Every line marked
`// PLACEHOLDER` still needs a real value.

| Field | What it is |
| --- | --- |
| `bride`, `groom`, `brideFirst` | Names and surnames, and which name comes first |
| `showGanesha`, `blessing` | Ganesha line art and the shloka at the top of the card |
| `openingMessage`, `inviteLine` | The wording around the names |
| `date`, `time`, `utcOffset` | The wedding date (`YYYY-MM-DD`) and time (`HH:MM`, 24-hour); the weekday and the countdown come from these |
| `venue`, `city`, `address`, `mapUrl` | Where the wedding is. If `mapUrl` is empty, the Map button searches Google Maps for the venue |
| `familiesEyebrow`, `familiesMessage`, `families` | The family blessing section: each family has a label and a list of names |
| `functions` | One card per function: `name`, `icon`, `date`, `time`, `venue`, `dress`. `main: true` uses the wedding's own date, time and venue. Leave the date empty to show "Details to follow"; delete an entry to remove that function |
| `story` | Our Story paragraphs. An empty list hides the section |
| `hotels` | Where to Stay. An empty list hides the section; a hotel without a `url` has no Book button |
| `gift` | Gift text and an optional link. The button stays hidden until `url` is set |
| `rsvpBy`, `rsvpWhatsApp` | Reply-by date and a WhatsApp number in international format (`919800000000`). The RSVP button appears once the number is set and opens WhatsApp with a message already filled in |
| `contacts` | Names and phone numbers; each number becomes a tap-to-call link |
| `closingMessage` | The last line |
| `music` | `src` and `volume`. Plays `assets/audio/wedding-loop.mp3`: an original 63-second loop rendered by `scripts/invitation-music.py`, so there are no licensing worries. Replace it with your own file if you prefer |
| `autoTour` | `false` keeps the page still, and the guest scrolls by hand |

Function icons: `kalash`, `mehendi`, `haldi`, `sangeet`, `mandap`, `reception`.

## The sequence

| Time from the tap | What happens |
| --- | --- |
| before | Ivory palace front with a scalloped Mughal arch, marigold garlands, rose sprays, flickering diyas, rising gold dust; maroon doors with a gold mandala and a K & D seal, which pulses with "Tap the seal to open" |
| 0 – 0.45 s | The seal flares with light |
| 0.45 s | A line of light opens down the seam between the doors |
| 1.0 – 3.4 s | The doors swing inward in 3D, each on its own hinge, getting darker as they turn; warm light fills the arch; 40 rose petals and marigold petals burst out and drift down |
| 2.7 – 5 s | A flash of light as the view moves through the arch onto the card, which settles from 114 % to 100 % |
| 3.4 s → | The gold frame opens out from the centre; the corner flourishes draw themselves; rose sprays bloom into two corners; Ganesha is traced in gold, then glows; the shloka appears |
| 4.5 s → | "Kirti" and "Dharmil" are written on, left to right, in shimmering gold foil; then the surnames, &, the invitation line, the date row, the time and the venue; sparkles twinkle; petals keep falling softly |
| 10 s | Scrolling unlocks and the Replay button appears |
| 12 s → | The auto tour moves through Families, Countdown, Celebrations, Venue, Our Story, Where to Stay, Gifts and RSVP, then holds on the final frame (a mandala monogram and a row of diyas) |

**Replay** resets everything, closes the doors again, and replays the sequence. Pressing it repeatedly never
stacks animations. Any scroll, touch or key press stops the tour. With `prefers-reduced-motion`, everything still
appears in the same order, but without the movement.
