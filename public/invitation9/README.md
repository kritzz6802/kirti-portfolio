# The Chat — `/invitation9/`

**Format:** Lock screen + live group chat. One of the eleven Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

**How it plays**

1. A phone lock screen showing the real time, with a "LoveChat" notification: *You're invited! Tap to open 💌*.
2. The lock screen slides away and the group chat plays itself out, with typing dots before each message:
   - "WE'RE GETTING MARRIED!" with confetti and a ring sticker;
   - Ganesha and the shloka;
   - both families "joining the chat";
   - a **scratch card** — scratch it (or tap it) to reveal the date;
   - a calendar invite;
   - a **voice note** that plays the music;
   - a swipeable itinerary carousel;
   - a location pin;
   - the story;
   - a **"Will you be there?" poll**. Voting gets a reply, an RSVP link and confetti.
3. You can type a message in the box at the bottom; it sends with floating hearts.
4. **Skip** (top) shows the whole chat at once; Replay plays it again. On desktop the stage is phone-shaped.

## Edit the content

All the wording lives in `invitationData` at the top of **`core.js`**: names, families, date, time, venue,
functions, story, RSVP and contacts. Lines marked `// PLACEHOLDER` still need real details. Routes `invitation4`
to `invitation11` each have their own copy of `core.js`; edit one and copy it to the others to update every
design at once.

Music: `assets/audio/wedding-loop.mp3`, an original loop rendered by `scripts/invitation-music.py`. It starts with
the first tap. All artwork is SVG, CSS and canvas, so it stays sharp on any screen. The page works from
`npm run dev`, from the production build, and opened straight from disk, and honours `prefers-reduced-motion`.
