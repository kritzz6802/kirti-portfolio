# A Reel of Forever — `/invitation13/`

**Format:** a cinematic wedding film built from real photographs: black and champagne gold, film grain, slow
Ken Burns camera moves and light leaks. It is one of the thirteen Kirti & Dharmil invitations; `/invite/` links
them all.

```
invitation13/
├── index.html   poster, film container, chrome
├── styles.css   camera moves, colour grades, transitions, titles, polaroids, film strip
├── photos.js    ← which photo goes where (edit this to use your own pictures)
├── photos/      the image files
├── script.js    scenes and the film player
└── core.js      invitationData (wording, dates, venue, RSVP) + shared helpers
```

## The film

| Scene | What happens |
| --- | --- |
| Poster | Full-screen couple photo slowly zooming, a gold frame drawing itself, the names, and **Begin our story** |
| Our story | Cinema letterbox bars; the names rise letter by letter over the photo with a warm light leak; then the bars open up |
| Our moments | Polaroids drop and pile up one by one, with captions, over a scrolling film strip |
| One chapter per function | A full-bleed photo with its own camera move and colour grade: Ganesh saffron, Mehendi green, Haldi gold, Sangeet violet, Wedding red, Reception midnight. Each chapter has its own transition (iris, slide, shutter, diagonal, zoom), and the name, date, venue and dress code are revealed in elegant type |
| See you there | A frosted card over the last photo: Ganesha, names, date, countdown, both families, RSVP, save-the-date, directions and contacts |

Scenes advance on their own, with progress bars at the top. **‹ ❚❚ ›**, the arrow keys and the space bar
work, and ↺ replays the film.

## Use your own photos

1. Put your pictures in `invitation13/photos/`. Portrait (tall) photos work best; around 1080 px wide is plenty.
2. Open `photos.js` and change the file names: `poster`, `opening`, the four `moments`, one photo per event,
   and `finale`.
3. If a face is cut off, adjust `focus` (for example `'50% 25%'` keeps the top part in frame).

**The sample photos now in `photos/` are free stock images from Unsplash** (unsplash.com/license, free to use).
They are placeholders only; replace them with your own before sharing the invitation.

## Edit the wording

Everything else is in `invitationData` at the top of `core.js`. Lines marked `// PLACEHOLDER` still need real
details. Music: `assets/audio/wedding-loop.mp3`, an original loop.
