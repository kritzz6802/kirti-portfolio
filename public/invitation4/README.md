# The Pichwai Scroll — `/invitation4/`

**Format:** Unrolling scroll. One of the seven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

```
invitation4/
├── index.html   closed scroll + the open scroll's sections
├── styles.css   roll, rods, untie/unroll animation, paper, sections
├── art.js       lotus, cows, Pichwai border tile, toran, date medallion, bell, pond, koi
├── script.js    painting, reveal-on-scroll, rods that turn with the scroll, synthesised temple bell
└── core.js      invitationData + shared helpers
```

**How it plays**

1. A rolled painted scroll with gold finials, tied with a pink tassel and a name tag, floats above a lotus pond.
2. Tap it and the tie slips off, the tassel and tag fall away, and the scroll unrolls downward between two
   wooden rods.
3. Scroll inside it; the rods' grain turns as you scroll. In order:
   - a flower toran, then Ganesha in a lotus arch, शुभ विवाह and the names;
   - two Pichwai cows facing a lotus;
   - the families in jharokha windows;
   - a blooming lotus date medallion with a countdown in lotus buds;
   - painted arched panels for each function;
   - a pond map with ripples;
   - the story;
   - a **temple bell you can ring** (synthesised in the browser), then the RSVP;
   - a koi pond at the end.
4. Replay (bottom right) scrolls back up, rolls the scroll closed, and plays again.

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
