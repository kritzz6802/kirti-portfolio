# Our Shaadi Story — `/invitation12/`

**Format:** an animated wedding film with illustrated characters, one scene per function. It is one of the
twelve Kirti & Dharmil invitations; the gallery at `/invite/` links them all.

```
invitation12/
├── index.html   poster, film container, progress bars, scene nav
├── styles.css   character motion (walk, dance, clap, twirl), scene backdrops and effects, film chrome
├── people.js    the character builder: SVG men and women with outfits, hair, jewellery, props and arm poses
├── script.js    the cast, outfits per event, the scenes, the film player
└── core.js      invitationData + shared helpers (dates, music, countdown, Ganesha)
```

## The film

| Scene | What happens |
| --- | --- |
| Poster | “Our Shaadi Story” with Kirti and Dharmil waving from opposite sides. Tap **Play our story** (music starts) |
| How it began | Dharmil walks in from the left and Kirti from the right through a sunset garden. They meet, reach out and hold hands; a heart pops up and the names appear |
| Ganesh Sthapana | A temple with a glowing Ganpati, ringing bells and diyas. Both families do aarti with the couple in front, in marigold and saffron |
| Mehendi | Kirti in green and pink on a flower swing while her bridesmaids hold mehendi cones and a henna pattern draws itself on a hand. Dharmil and his friends do bhangra; the mothers clap |
| Haldi | The couple sit on chowkis in yellow, laughing, while the family lean in with haldi bowls. Turmeric puffs and marigold petals fly |
| Sangeet | A disco stage with sweeping spotlights, a disco ball and LED tiles. The couple dance (Kirti twirls), friends dance with dandiya, a dhol player drums and music notes float up |
| Wedding | A mandap with a sacred fire and a pandit. The couple, tied by the gathbandhan, circle the fire for the pheras (with a phera counter) as both families clap and petals shower |
| Reception | Fairy lights, a floral arch and a neon K ♥ D. The couple in a gown and suit, a cake, guests toasting and fireworks |
| See you there! | The whole cast waves. The date, countdown, families, RSVP, save-the-date, directions and contacts |

Scenes advance on their own; progress bars run along the top. **‹ ›** skip, **❚❚** pauses, the arrow
keys and the space bar work too, and ↺ replays the film. Each event scene shows that function's date, time,
venue and dress code from `invitationData`.

**Event scenes come from your data.** Each entry in `functions` picks its scene by `icon`: `kalash` (Ganesh
Sthapana), `mehendi`, `haldi`, `sangeet`, `mandap` (wedding) or `reception`. Any other icon gets a general
celebration scene. Removing or reordering functions changes the film to match.

**Changing the cast:** the outfits per event are in `LOOK` at the top of `script.js` (colours, hair, jewellery,
veil, safa). The family members are `kDad`, `kMom`, `jDad` and `jMom`. Poses come from `People.POSES` in
`people.js`.

## Edit the content

All the wording is in `invitationData` at the top of `core.js`. Lines marked `// PLACEHOLDER` still need real
details. Music: `assets/audio/wedding-loop.mp3`, an original loop. All artwork is SVG and CSS, so it stays sharp
on any screen. The page works from `npm run dev`, from the production build, and opened from disk. With
`prefers-reduced-motion`, the scenes still advance but the movement inside them stops.
