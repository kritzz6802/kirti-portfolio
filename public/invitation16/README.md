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

1. A closed wine-coloured book floats at an angle: gold "K & D" monogram, names and date. Tap it to open.
2. The cover swings open in 3D, and the first page's lines appear **one by one**, like ink settling. Names and
   titles are written on from left to right.
3. Pages turn on their own after each one has been read; tap the right side, swipe, use ‹ › or the arrow keys
   to turn yourself, and ❚❚ to stop the automatic turning.

**Pages:** Ganesha and the blessing, then the bride's parents inviting you to the wedding of Kirti with Dharmil
(and his parents), then save the date with the countdown and venue. After that comes one page per celebration,
then our story, and finally the RSVP with save-the-date and directions.

## Edit the content

All the wording is in `invitationData` at the top of `core.js`. Lines marked `// PLACEHOLDER` still need real
details. Pages are generated from it, so adding a function adds a page. Music: `assets/audio/wedding-loop.mp3`,
an original loop that starts with the first tap. The page honours `prefers-reduced-motion` and works opened from
disk.
