# Pichwai Pastel — `/invitation4/`

One of the seven Kirti & Dharmil invitations. The gallery at `/invite/` links all of them.

**Look:** blush pink and powder blue, Pichwai-style lotus pond, white Kamdhenu cows with pink saddle cloths, lotus pots on the pillars, pink-and-white flower garlands. **Doors:** powder-blue doors with gold inlay and lotus medallions.

It uses the same sequence as `/invitation3/`:

1. The DK crest draws itself on load, then shrinks onto the door seal.
2. "Tap the seal to open": light down the seam, the doors swing open in 3D with a petal burst, then a flash
   through the arch onto the card.
3. Ganesha and the shloka, the names written in metallic foil, the date and venue.
4. The auto tour through Families, Countdown, Celebrations, Venue, Story, Stay, Gifts and RSVP.

The page has a Replay button and a sound button, and supports reduced motion.

```
invitation4/
├── index.html   markup (intro, palace doors, card, eight sections)
├── styles.css   shared layout + this theme's palette (:root) and theme block
├── art.js       this theme's vector art: palette, flowers, garlands, side figures, palace front, doors, crest
├── script.js    invitationData (all content), timelines, tour, countdown, music, replay
└── assets/      audio/wedding-loop.mp3 (original loop); fonts/ and images/ are empty
```

**Content** is in `invitationData` at the top of `script.js`: the same fields as `/invitation3/`. Lines marked
`// PLACEHOLDER` still need the real date, venue, functions, RSVP number and contacts.

**Regenerating:** this route was generated from `/invitation3/` by `scripts/invitation-themes.py`
(`python3 scripts/invitation-themes.py public`). Regenerating rebuilds the code from `/invitation3/` and keeps
this README, so make content edits in `invitation3/script.js` first, or re-apply them afterwards.

All artwork is vector: gradients and shapes, with no photos or blur, so it stays sharp on any screen.
