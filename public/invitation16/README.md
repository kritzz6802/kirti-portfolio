# The Wedding Book — `/invitation16/`

**Format:** a 3D invitation card you open and read like a book. Wine linen cover with gold foil, ivory pages.
Only text and ornament, with no illustrations.

```
invitation16/
├── index.html   the book (cover, pages, back cover) and chrome
├── styles.css   3D book, page turns, paper, gold-foil type, the line-by-line reveal
├── script.js    the pages (built from core.js), page turning, auto-reading, tilt
└── core.js      invitationData (wording, dates, venue, RSVP) + shared helpers
```

**How it plays**

The stage is landscape: on a computer it is a wide card, and on a phone it fills the screen. Turned sideways, the
phone shows the book at its biggest. Upright, the book is smaller, and a hint suggests turning the phone.

1. A closed wine-coloured book floats at an angle: gold "K & D" monogram, names and date. Tap it to open.
2. The cover swings open over the spine, and the book lies open as a **two-page spread**. The lines on the left
   page, then the right page, appear **one by one** like ink settling. Names and titles are written on from left
   to right.
3. Spreads turn on their own once read. Tap the right page (or ›, a swipe, or the arrow key) to turn forward and
   the left page to go back; ❚❚ stops the automatic turning.

**Spreads:**

| Left page | Right page |
| --- | --- |
| Ganesha and the blessing | "We joyfully invite you to the wedding of Kirti & Dharmil" |
| Bride's parents invite you to the wedding of their daughter **Kirti** | with **Dharmil**, son of the groom's parents |
| Save the date: weekday, the big "12", month and time | Venue, address and a live countdown |
| One celebration per page, two to a spread | |
| Our story | Kindly reply: RSVP, save-the-date, directions, contacts |

## Edit the content

All the wording is in `invitationData` at the top of `core.js`. Lines marked `// PLACEHOLDER` still need real
details. Pages are generated from it, so adding a function adds a page. Music: `assets/audio/wedding-loop.mp3`,
an original loop that starts with the first tap. The page honours `prefers-reduced-motion` and works opened from
disk.
