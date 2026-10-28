# Invitation gallery — `/invite/`

One page that links every Kirti & Dharmil invitation (eleven designs). Each card shows the opening scene; on hover (desktop) it
crossfades to the finished card. Clicking a card opens that invitation.

| # | Design | Format | Route |
| --- | --- | --- | --- |
| 01 | Now Playing | Vinyl album + turntable | `/invitation8/` |
| 02 | The Chat | Lock screen + live group chat | `/invitation9/` |
| 03 | Kai Po Che! | Uttarayan kite, day-to-night scroll | `/invitation10/` |
| 04 | Coming Soon | Bollywood premiere | `/invitation11/` |
| 05 | Written in the Stars | Tap-through stories | `/invitation6/` |
| 06 | The Pichwai Scroll | Unrolling scroll | `/invitation4/` |
| 07 | Our Little Scrapbook | Envelope + draggable cards (full page) | `/invitation7/` |
| 08 | L’Amour · The Wedding Issue | Magazine with page turns | `/invitation5/` |
| 09 | Emerald Peacock | Palace doors + scrolling card | `/invitation3/` |
| 10 | Ivory & Gold Royal | Palace doors + scrolling card | `/invitation2/` |
| 11 | Mediterranean Watercolour | Envelope + scrolling card | `/invitation/` |

- **Add or reorder designs:** edit the `INVITATIONS` list at the top of `script.js`.
- **Previews:** `previews/<route>-cover.jpg` and `previews/<route>-card.jpg` (540 x 960) are screenshots of each
  invitation. Retake them after a design changes, so the gallery matches.
- Links are relative (`../invitation6/`), so the gallery works on any host path.
