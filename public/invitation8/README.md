# Now Playing — `/invitation8/`

**Format:** Vinyl album + turntable. One of the eleven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

**How it plays**

1. A 70s-style album sleeve: "Kirti & Dharmil", a sunburst, a "feat. both families" sticker and a
   *Family Advisory* label. Tap **Tap to play**.
2. The record slides out of the sleeve, the turntable rises into view, and the record lands on the platter. The
   tonearm swings over, the record spins while the music plays, and the LED glows.
3. The sleeve shrinks into the player's thumbnail. The player has a heart button that bursts hearts, a progress
   bar whose remaining time is the live countdown to the wedding, and play/pause, back and skip controls.
4. Scroll down for:
   - the **tracklist** (functions as Side A and Side B; tap a track to expand it, and the wedding track has a
     live equaliser);
   - **lyrics**, where the story lights up line by line, karaoke-style;
   - **liner-note credits** (the families as producers);
   - a **"Live at" concert ticket** for the venue;
   - **"Add to your queue"**: RSVP and save to calendar.

## Edit the content

All the wording lives in `invitationData` at the top of **`core.js`**: names, families, date, time, venue,
functions, story, RSVP and contacts. Lines marked `// PLACEHOLDER` still need real details. Routes `invitation4`
to `invitation11` each have their own copy of `core.js`; edit one and copy it to the others to update every
design at once.

Music: `assets/audio/wedding-loop.mp3`, an original loop rendered by `scripts/invitation-music.py`. It starts with
the first tap. All artwork is SVG, CSS and canvas, so it stays sharp on any screen. The page works from
`npm run dev`, from the production build, and opened straight from disk, and honours `prefers-reduced-motion`.
