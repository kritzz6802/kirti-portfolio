# The Pop-up Card — `/invitation14/`

**Format:** a laser-cut paper pop-up card in real 3D (CSS 3D transforms).

```
invitation14/
├── index.html   the card (base, standing wall, cover), tags, chrome
├── styles.css   the 3D card, folding layers, cover lace, tags
├── art.js       laser-cut paper art: palace, elephants, couple, mandap, arch, florals, marigolds, henna hands,
│                swing, kalash and diyas, dhol, chandelier
├── script.js    the pages (one per function), the player, the tilt-parallax
└── core.js      invitationData + shared helpers
```

**How it plays**

1. An ivory card with a lace border, gold monogram and names lies on a table. Tap **Open the card**.
2. The cover lifts up on its hinge and becomes the backdrop, and the paper layers **fold up from flat** one
   behind another (palace, then elephants, then the couple, then flowers), each casting a shadow.
3. Every function is a new pop-up page. The old layers fold down, the backdrop changes colour, and new paper rises:
   - **Ganesh Sthapana:** an arch with Ganpati, a kalash and diyas;
   - **Mehendi:** marigold strings, a swing and henna hands;
   - **Haldi:** a marigold curtain and a kalash;
   - **Sangeet:** a purple stage arch, a dancing couple and a dhol;
   - **Wedding:** a gold mandap with the couple;
   - **Reception:** a chandelier with fireworks.

   A hanging tag shows each function's date, venue and dress code.
4. The final page has the RSVP card with the countdown and families.

Moving the mouse, or **tilting the phone**, shifts the card in 3D so the layers separate in depth. Pages
advance on their own; ‹ ❚❚ › and the arrow keys work.

## Edit the content

All the wording is in `invitationData` at the top of `core.js`. Lines marked `// PLACEHOLDER` still need real
details (date, venue, functions, RSVP number, contacts). Music: `assets/audio/wedding-loop.mp3`, an original loop
that starts with the first tap. Everything is drawn with HTML, CSS and SVG, so it stays sharp on any screen. The
page works from `npm run dev`, from the build, and opened from disk, and honours `prefers-reduced-motion`.
