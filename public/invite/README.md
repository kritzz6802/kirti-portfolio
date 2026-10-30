# Invitation gallery — `/invite/`

One page that links every Kirti & Dharmil invitation (sixteen designs). Each card shows the opening scene; on hover (desktop) it
crossfades to the finished card. Clicking a card opens that invitation.

| # | Design | Format | Route |
| --- | --- | --- | --- |
| 01 | The Wedding Book | 3D book you read page by page | `/invitation16/` |
| 02 | The Pop-up Card | 3D paper pop-up card | `/invitation14/` |
| 03 | The Acrylic Card | Luxury acrylic 3D card | `/invitation15/` |
| 04 | A Reel of Forever | Cinematic photo film | `/invitation13/` |
| 05 | Our Shaadi Story | Animated character film, a scene per function | `/invitation12/` |
| 06 | Now Playing | Vinyl album + turntable | `/invitation8/` |
| 07 | The Chat | Lock screen + live group chat | `/invitation9/` |
| 08 | Kai Po Che! | Uttarayan kite, day-to-night scroll | `/invitation10/` |
| 09 | Coming Soon | Bollywood premiere | `/invitation11/` |
| 10 | Written in the Stars | Tap-through stories | `/invitation6/` |
| 11 | The Pichwai Scroll | Unrolling scroll | `/invitation4/` |
| 12 | Our Little Scrapbook | Envelope + draggable cards (full page) | `/invitation7/` |
| 13 | L’Amour · The Wedding Issue | Magazine with page turns | `/invitation5/` |
| 14 | Emerald Peacock | Palace doors + scrolling card | `/invitation3/` |
| 15 | Ivory & Gold Royal | Palace doors + scrolling card | `/invitation2/` |
| 16 | Mediterranean Watercolour | Envelope + scrolling card | `/invitation/` |

- **Add or reorder designs:** edit the `INVITATIONS` list at the top of `script.js`.
- **Previews:** `previews/<route>-cover.jpg` and `previews/<route>-card.jpg` (540 x 960) are screenshots of each
  invitation. Retake them after a design changes, so the gallery matches.
- Links are relative (`../invitation6/`), so the gallery works on any host path.
