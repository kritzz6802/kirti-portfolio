# Invitation gallery — `/invite/`

One page that links every Kirti & Dharmil invitation. Each card shows the opening scene; on hover (desktop) it
crossfades to the finished card. Clicking a card opens that invitation.

| # | Design | Format | Route |
| --- | --- | --- | --- |
| 01 | Written in the Stars | Tap-through stories | `/invitation6/` |
| 02 | The Pichwai Scroll | Unrolling scroll | `/invitation4/` |
| 03 | Our Little Scrapbook | Envelope + draggable cards (full page) | `/invitation7/` |
| 04 | L’Amour · The Wedding Issue | Magazine with page turns | `/invitation5/` |
| 05 | Emerald Peacock | Palace doors + scrolling card | `/invitation3/` |
| 06 | Ivory & Gold Royal | Palace doors + scrolling card | `/invitation2/` |
| 07 | Mediterranean Watercolour | Envelope + scrolling card | `/invitation/` |

- **Add or reorder designs:** edit the `INVITATIONS` list at the top of `script.js`.
- **Previews:** `previews/<route>-cover.jpg` and `previews/<route>-card.jpg` (540 x 960) are screenshots of each
  invitation. Retake them after a design changes, so the gallery matches.
- Links are relative (`../invitation6/`), so the gallery works on any host path.
