# Invitation gallery — `/invite/`

One page that links every Kirti & Dharmil invitation (thirteen designs). Each card shows the opening scene; on hover (desktop) it
crossfades to the finished card. Clicking a card opens that invitation.

| # | Design | Format | Route |
| --- | --- | --- | --- |
| 01 | A Reel of Forever | Cinematic photo film | `/invitation13/` |
| 02 | Our Shaadi Story | Animated character film, a scene per function | `/invitation12/` |
| 03 | Now Playing | Vinyl album + turntable | `/invitation8/` |
| 04 | The Chat | Lock screen + live group chat | `/invitation9/` |
| 05 | Kai Po Che! | Uttarayan kite, day-to-night scroll | `/invitation10/` |
| 06 | Coming Soon | Bollywood premiere | `/invitation11/` |
| 07 | Written in the Stars | Tap-through stories | `/invitation6/` |
| 08 | The Pichwai Scroll | Unrolling scroll | `/invitation4/` |
| 09 | Our Little Scrapbook | Envelope + draggable cards (full page) | `/invitation7/` |
| 10 | L’Amour · The Wedding Issue | Magazine with page turns | `/invitation5/` |
| 11 | Emerald Peacock | Palace doors + scrolling card | `/invitation3/` |
| 12 | Ivory & Gold Royal | Palace doors + scrolling card | `/invitation2/` |
| 13 | Mediterranean Watercolour | Envelope + scrolling card | `/invitation/` |

- **Add or reorder designs:** edit the `INVITATIONS` list at the top of `script.js`.
- **Previews:** `previews/<route>-cover.jpg` and `previews/<route>-card.jpg` (540 x 960) are screenshots of each
  invitation. Retake them after a design changes, so the gallery matches.
- Links are relative (`../invitation6/`), so the gallery works on any host path.
