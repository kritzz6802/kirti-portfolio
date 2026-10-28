# The Acrylic Card — `/invitation15/`

**Format:** a luxury clear-acrylic invitation in 3D.

```
invitation15/
├── index.html   unveil screen, the card (front/back), celebrations, RSVP, tabs
├── styles.css   acrylic glass, edge thickness, gold foil, glare, deck and focus cards
├── script.js    drag-to-rotate and flip, glare tracking, pressed-flower art, celebrations tiles
└── core.js      invitationData + shared helpers
```

**How it plays**

1. Darkness, "Kirti & Dharmil" in gold foil, and **Unveil the invitation**.
2. The acrylic card swoops in under a spotlight and floats gently. It is clear acrylic with real edge thickness,
   pressed flowers set inside, **shimmering gold-foil** names, and a light glare that follows the angle.
3. **Drag to turn it in your hand**, and tap it (or press ⟲) to **flip it**. The back holds the date, time,
   venue and both families.
4. **Celebrations:** tinted acrylic tiles (saffron, mint, gold, lilac, rose, blue) deal onto the table. Tap one and
   it flies forward with that function's details.
5. **RSVP:** an acrylic card with the countdown, the RSVP, save-the-date and directions buttons, and contacts.

## Edit the content

All the wording is in `invitationData` at the top of `core.js`. Lines marked `// PLACEHOLDER` still need real
details (date, venue, functions, RSVP number, contacts). Music: `assets/audio/wedding-loop.mp3`, an original loop
that starts with the first tap. Everything is drawn with HTML, CSS and SVG, so it stays sharp on any screen. The
page works from `npm run dev`, from the build, and opened from disk, and honours `prefers-reduced-motion`.
