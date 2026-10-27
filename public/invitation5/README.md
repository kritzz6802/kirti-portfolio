# L’Amour · The Wedding Issue — `/invitation5/`

**Format:** Magazine with 3D page turns. One of the seven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

```
invitation5/
├── index.html   book shell, tap zones, folio, tools
├── styles.css   page turns, editorial typography, every page layout
├── script.js    wisteria/peony art, calendar, the eight pages, page-turn engine
└── core.js      invitationData + shared helpers
```

**How it plays**

1. The cover builds itself:
   - the L’AMOUR masthead letters drop in;
   - wisteria grows down from the top edge;
   - a champagne arch draws itself, and "Kirti & Dharmil" is written into it;
   - cover lines, peonies and a barcode follow.
2. Tap (or swipe, or press →) to turn the page. Each turn is a 3D page flip around the spine, with a shadow
   sweeping across. The pages:
   1. **Contents:** Ganesha and the shloka, with an "In this issue" list where each entry jumps to its page.
   2. **Feature:** "Two families, one celebration", with a drop cap and both families' names.
   3. **Save the Date:** a giant date, a calendar with the day **circled by hand**, and a countdown.
   4. **The Itinerary:** every function.
   5. **Our Story:** a pull quote.
   6. **The Venue:** an arched window with wisteria and a directions link.
   7. **The back cover:** RSVP on violet, with a DK seal.
3. A folio shows the page number. The corner curl hints that you can turn the page. Replay (top right) closes the
   book back to the cover.

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
