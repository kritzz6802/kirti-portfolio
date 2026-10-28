# Kai Po Che! — `/invitation10/`

**Format:** Uttarayan kite festival, day-to-night scroll. One of the eleven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

**How it plays**

1. A blue morning sky with drifting clouds and small kites, and "કાઈ પો છે!" in Gujarati. A big pink-and-yellow
   patang flutters on its string.
2. Tap the kite and it straightens, then its paper **unfolds** from a diamond into the invitation card: Ganesha,
   શુભ લગ્ન, the names and the date.
3. Scroll down and the **sky changes with you**: morning blue, then a sunset, then a starry night with a moon. The
   sun sets, a kite string draws itself down the page, and the rooftop windows light up at night.
4. The sections are cards with little kites on them:
   - families;
   - the date with a countdown;
   - each function as a **fluttering patang**;
   - the story;
   - the venue.
5. At night, tap the **tukkal lantern** to release lanterns into the sky. RSVP, save-to-calendar and contacts are
   there too.

## Edit the content

All the wording lives in `invitationData` at the top of **`core.js`**: names, families, date, time, venue,
functions, story, RSVP and contacts. Lines marked `// PLACEHOLDER` still need real details. Routes `invitation4`
to `invitation11` each have their own copy of `core.js`; edit one and copy it to the others to update every
design at once.

Music: `assets/audio/wedding-loop.mp3`, an original loop rendered by `scripts/invitation-music.py`. It starts with
the first tap. All artwork is SVG, CSS and canvas, so it stays sharp on any screen. The page works from
`npm run dev`, from the production build, and opened straight from disk, and honours `prefers-reduced-motion`.
