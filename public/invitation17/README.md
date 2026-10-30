# The Pop-up Words — `/invitation17/`

**Format:** a premium 3D pop-up card like `/invitation14/`, but what pops up is **the invitation text itself**,
on laser-cut panels with no illustrations. Maroon velvet and gold foil outside; inside, each page has its own jewel
tone (maroon, emerald, royal blue, saffron, mustard, purple).

```
invitation17/
├── index.html   the card (base, standing back, cover), chrome
├── styles.css   the 3D card, folding layers, jewel-tone theme, gold dust, line reveal
├── cut.js       laser-cut panels: Mughal arch, gold lace card, mandala medallion, foil ribbon; gold shows through every cut
├── script.js    the pages and their panels, the player, the tilt
└── core.js      invitationData (wording, dates, venue, RSVP) + shared helpers
```

**How it plays**

1. A horizontal ivory card with a lace border, gold monogram and names. Tap **Open the card**.
2. The cover lifts and stands up as a jewel-toned backdrop with a gold jaali and arch window. Three laser-cut panels
   **spring up from flat** one behind another, gold dust rises, light sweeps across the foil, and each panel's
   lines of text appear one by one.
3. Every page is a new pop-up: the panels fold down, the backdrop changes colour, and new panels rise.

| Page | Back arch | Middle card / medallion | Front gold ribbon |
| --- | --- | --- | --- |
| Invitation | Ganesha, श्री गणेशाय नमः | "Together with their families", **Kirti & Dharmil** | the date |
| Families | Bride's parents… "wedding of their daughter" | **Kirti & Dharmil** | "son of" the groom's parents |
| Save the date | "Save the date", weekday | the big **12**, month, time | venue |
| Each celebration | its number and name | date and time | venue / dress code |
| See you there | RSVP card: countdown, families, RSVP, save-the-date, directions, contacts | | closing line |

Pages advance on their own, with progress bars at the top. ‹ ❚❚ ›, the arrow keys and ↺ work. Moving the mouse or
tilting the phone shifts the card so the panels separate in depth.

## Edit the content

All the wording is in `invitationData` at the top of `core.js`. Lines marked `// PLACEHOLDER` still need real
details. Music: `assets/audio/wedding-loop.mp3`, an original loop that starts with the first tap. The page honours
`prefers-reduced-motion` and works opened from disk.
