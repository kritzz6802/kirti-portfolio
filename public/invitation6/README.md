# Written in the Stars — `/invitation6/`

**Format:** Tap-through stories. One of the seven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

```
invitation6/
├── index.html   opening (constellation) + story player shell
├── styles.css   night sky, story chrome, cube-style turns, slide layouts
├── script.js    canvas starfield, K ♥ D constellation, slides, story player
└── core.js      invitationData + shared helpers (dates, music, countdown, Ganesha)
```

**How it plays**

1. A canvas night sky twinkles, with an occasional shooting star. About 20 stars fly in from scattered positions
   and join into **K ♥ D**; the lines draw between them, then the names and a "Tap to begin our story" button
   appear.
2. The tap starts the music and the stories. Progress bars run along the top, and each slide turns like a cube
   face.
   - **Tap** the right side for the next slide, the left side to go back.
   - **Hold** to pause; **swipe** sideways; or use the **arrow keys**.
3. The slides:
   1. Ganesha drawn in rose gold, the shloka and both families.
   2. A crescent moon rising over the names.
   3. Moon phases leading to a full moon on the wedding date, with a live countdown.
   4. The functions as a constellation timeline.
   5. A star-map venue with a pulsing pin and a Maps link.
   6. A sky lantern you tap to release, then RSVP, contacts and the closing line.

   The last slide stays on screen. Replay (top right) goes back to the constellation.

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
