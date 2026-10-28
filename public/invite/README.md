# Invitation gallery — `/invite/`

One page that links every Kirti & Dharmil invitation (fifteen designs). Each card shows the opening scene; on hover (desktop) it
crossfades to the finished card. Clicking a card opens that invitation.

| # | Design | Format | Route |
| --- | --- | --- | --- |
| 01 | The Pop-up Card | 3D paper pop-up card | `/invitation14/` |
| 02 | The Acrylic Card | Luxury acrylic 3D card | `/invitation15/` |
| 03 | A Reel of Forever | Cinematic photo film | `/invitation13/` |
| 04 | Our Shaadi Story | Animated character film, a scene per function | `/invitation12/` |
| 05 | Now Playing | Vinyl album + turntable | `/invitation8/` |
| 06 | The Chat | Lock screen + live group chat | `/invitation9/` |
| 07 | Kai Po Che! | Uttarayan kite, day-to-night scroll | `/invitation10/` |
| 08 | Coming Soon | Bollywood premiere | `/invitation11/` |
| 09 | Written in the Stars | Tap-through stories | `/invitation6/` |
| 10 | The Pichwai Scroll | Unrolling scroll | `/invitation4/` |
| 11 | Our Little Scrapbook | Envelope + draggable cards (full page) | `/invitation7/` |
| 12 | L’Amour · The Wedding Issue | Magazine with page turns | `/invitation5/` |
| 13 | Emerald Peacock | Palace doors + scrolling card | `/invitation3/` |
| 14 | Ivory & Gold Royal | Palace doors + scrolling card | `/invitation2/` |
| 15 | Mediterranean Watercolour | Envelope + scrolling card | `/invitation/` |

- **Add or reorder designs:** edit the `INVITATIONS` list at the top of `script.js`.
- **Previews:** `previews/<route>-cover.jpg` and `previews/<route>-card.jpg` (540 x 960) are screenshots of each
  invitation. Retake them after a design changes, so the gallery matches.
- Links are relative (`../invitation6/`), so the gallery works on any host path.
