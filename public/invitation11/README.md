# Coming Soon — `/invitation11/`

**Format:** Bollywood premiere. One of the eleven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

**How it plays**

1. Red velvet curtains with gold tie-backs and a flickering "NOW SHOWING" marquee. Tap the ticket that says
   *Raise the curtain*.
2. The curtains part, the projector beam comes on, and a sepia **film-leader countdown** runs 5-4-3-2-1. Then the
   title card: *A Koyani × Jarsaniya Production presents — Kirti weds Dharmil*.
3. Scroll for the full feature:
   - a **movie poster** with billing, tagline and rating;
   - **The Cast** (the couple as leads, the families' names);
   - **Showtimes**, one screen per function, with the wedding marked PREMIERE;
   - **The Trailer**, where the story plays as subtitles;
   - a lit **marquee letterboard** for the venue;
   - **Book your seat**: pick a seat on the seat map (the front row is VIP), and the WhatsApp RSVP mentions your
     seat;
   - **rolling end credits**.

## Edit the content

All the wording lives in `invitationData` at the top of **`core.js`**: names, families, date, time, venue,
functions, story, RSVP and contacts. Lines marked `// PLACEHOLDER` still need real details. Routes `invitation4`
to `invitation11` each have their own copy of `core.js`; edit one and copy it to the others to update every
design at once.

Music: `assets/audio/wedding-loop.mp3`, an original loop rendered by `scripts/invitation-music.py`. It starts with
the first tap. All artwork is SVG, CSS and canvas, so it stays sharp on any screen. The page works from
`npm run dev`, from the production build, and opened straight from disk, and honours `prefers-reduced-motion`.
