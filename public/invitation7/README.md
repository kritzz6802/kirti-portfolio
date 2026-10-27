# Our Little Scrapbook — `/invitation7/`

**Format:** Envelope + draggable cards (full-width page). One of the seven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

```
invitation7/
├── index.html   envelope + the table of cards
├── styles.css   linen table, envelope, every card's design, cassette, layouts for phone/tablet/desktop
├── script.js    art (sunset, map, stamp, pampas), fly-out, typewriter, flip clock, drag, polaroid flip
└── core.js      invitationData + shared helpers
```

**How it plays**

1. A kraft envelope tied with twine, with a terracotta **DK** wax seal and pampas tucked in. Tap it and the twine
   slips off, the seal pops and the flap opens.
2. Every card flies out of the envelope to its place on a linen table:
   - a Ganesha sticker;
   - a **polaroid** that turns over to show your story;
   - a typed note that **types itself out** with the families' names;
   - a **"KD Airways" boarding pass** (flight number from the date, gate = venue);
   - colourful **ticket stubs** for each function;
   - a **flip-clock countdown**;
   - a folded **map** with the route drawing itself to a heart pin;
   - an **airmail RSVP postcard** with a stamp and postmark.
3. With a mouse, drag cards around the table. On touch screens the cards scroll with the page, and a tap flips
   the polaroid.
4. Music is a little **cassette** (bottom left) whose reels spin while it plays. "Seal it again" (bottom right)
   puts everything back in the envelope.

This one is a full-width page: a single column on phones, two columns on tablets and three on desktop.

## Edit the content

All the wording lives in `invitationData` at the top of **`core.js`**: names, families, date, time, venue,
functions, story, RSVP and contacts. Lines marked `// PLACEHOLDER` still need real details. `core.js` is the same
in `invitation4/` to `invitation7/`, so to change all four designs at once, edit one copy and copy it over the
other three.

Music: `assets/audio/wedding-loop.mp3`, an original loop rendered by `scripts/invitation-music.py`. Playback
starts with the first tap, and the sound control only appears once the track has loaded.

All artwork is vector (SVG, CSS and canvas), so it stays sharp on any screen. The page works from `npm run dev`,
from the production build, and opened straight from disk. With `prefers-reduced-motion`, everything still appears
in order, without the movement.
