/* =============================================================================
   PHOTOS — swap these for your own pictures.
   Put your files in invitation13/photos/ and change the names below.
   Portrait photos (taller than wide) look best; around 1080 px wide is plenty.
   `focus` is which part of the photo to keep in frame ("50% 30%" = centre, upper third).

   The sample photos currently here are free stock photos from Unsplash
   (unsplash.com/license) — replace them with your own before sharing.
   ========================================================================== */

'use strict'

const PHOTOS = {
  poster: { src: 'photos/couple3.jpg', focus: '50% 35%' },
  opening: { src: 'photos/couple5.jpg', focus: '50% 30%' },

  // "Our moments" — the polaroids that drop in, in this order
  moments: [
    { src: 'photos/couple4.jpg', focus: '50% 40%' },
    { src: 'photos/woods.jpg', focus: '50% 70%' },
    { src: 'photos/couple2.jpg', focus: '50% 30%' },
    { src: 'photos/river.jpg', focus: '50% 30%' },
  ],

  // one photo per function, matched by the function's icon in core.js
  events: {
    kalash: { src: 'photos/couple2.jpg', focus: '55% 30%' },
    mehendi: { src: 'photos/mehendi.jpg', focus: '45% 50%' },
    haldi: { src: 'photos/bride.jpg', focus: '45% 30%' },
    sangeet: { src: 'photos/river.jpg', focus: '55% 30%' },
    mandap: { src: 'photos/canopy.jpg', focus: '50% 40%' },
    reception: { src: 'photos/hero.jpg', focus: '50% 40%' },
  },
  fallback: { src: 'photos/couple5.jpg', focus: '50% 30%' },

  finale: { src: 'photos/woods.jpg', focus: '50% 60%' },
}
