/* =============================================================================
   Laser-cut panels. Each panel is two sheets: a gold-foil sheet behind, and a
   coloured sheet in front with lace cut through it, so the gold shows through
   every hole. The viewBox is the panel's size in cqw, so circles stay round.
   ========================================================================== */

'use strict'

const Cut = (() => {
  let uid = 0
  const f = (n) => +n.toFixed(2)

  // points along a cubic bezier
  function bez(p0, p1, p2, p3, n) {
    const out = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const u = 1 - t
      out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]])
    }
    return out
  }

  const dots = (pts, r) => pts.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}"/>`).join('')
  const line = (x0, y0, x1, y1, n) => Array.from({ length: n + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n])
  // a little cut-out flower: six petals round a centre
  const rosette = (x, y, r) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.32)}"/>` + Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI * 2; return `<ellipse cx="${f(x + Math.cos(a) * r * 0.7)}" cy="${f(y + Math.sin(a) * r * 0.7)}" rx="${f(r * 0.32)}" ry="${f(r * 0.16)}" transform="rotate(${f((a * 180) / Math.PI)} ${f(x + Math.cos(a) * r * 0.7)} ${f(y + Math.sin(a) * r * 0.7)})"/>` }).join('')

  // a pointed Mughal arch: straight sides, an ogee curve up to a point
  function archGeom(w, h, i) {
    const x0 = i
    const x1 = w - i
    const W = x1 - x0
    const ys = i + W * 0.34
    const top = i
    const L = [[x0, ys], [x0, ys - W * 0.2], [w / 2 - W * 0.16, top + W * 0.08], [w / 2, top]]
    const R = [[w / 2, top], [w / 2 + W * 0.16, top + W * 0.08], [x1, ys - W * 0.2], [x1, ys]]
    const d = `M${f(x0)} ${f(h - i)} V${f(ys)} C${L.slice(1).map((p) => `${f(p[0])} ${f(p[1])}`).join(' ')} C${R.slice(1).map((p) => `${f(p[0])} ${f(p[1])}`).join(' ')} V${f(h - i)}Z`
    return { d, L, R, x0, x1, ys }
  }

  function sheet(w, h, back, front, holes, extra = '') {
    const m = `cut${++uid}`
    return `<svg class="cut" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><mask id="${m}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#fff"/><g fill="#000">${holes}</g></mask></defs>
      <g class="cut__gold">${back}</g><g class="cut__front" mask="url(#${m})">${front}</g>${extra}</svg>`
  }

  /* ---------------------------------------------------------------- arch */
  function arch(w, h) {
    const o = archGeom(w, h, 0)
    const fr = archGeom(w, h, 1.3)
    const lace = archGeom(w, h, 3)
    const curve = [...bez(...lace.L, 16), ...bez(...lace.R, 16).slice(1)]
    const holes = dots(curve, 0.55) + dots(line(lace.x0, lace.ys + 2.2, lace.x0, h - 3.6, Math.max(2, Math.round((h - lace.ys) / 2.4))), 0.5) + dots(line(lace.x1, lace.ys + 2.2, lace.x1, h - 3.6, Math.max(2, Math.round((h - lace.ys) / 2.4))), 0.5) + rosette(lace.x0 + 3, h - 4.4, 1.8) + rosette(lace.x1 - 3, h - 4.4, 1.8)
    return sheet(w, h, `<path d="${o.d}" fill="url(#foil)"/>`, `<path d="${fr.d}" fill="var(--sheet)"/>`, holes, `<path d="${archGeom(w, h, 4.6).d}" fill="none" stroke="url(#foil)" stroke-width=".22"/>`)
  }

  /* ---------------------------------------------------------------- lace card (scalloped all round) */
  function lace(w, h) {
    const r = 1.3
    const edge = []
    const nx = Math.round(w / (r * 2.1))
    const ny = Math.round(h / (r * 2.1))
    for (let k = 0; k <= nx; k++) edge.push([r + ((w - 2 * r) * k) / nx, r], [r + ((w - 2 * r) * k) / nx, h - r])
    for (let k = 0; k <= ny; k++) edge.push([r, r + ((h - 2 * r) * k) / ny], [w - r, r + ((h - 2 * r) * k) / ny])
    const back = `<rect x="${r}" y="${r}" width="${w - 2 * r}" height="${h - 2 * r}" fill="url(#foil)"/><g fill="url(#foil)">${dots(edge, r)}</g>`
    const i = 2.4
    const holes = dots(line(i + 2.4, i + 1.3, w - i - 2.4, i + 1.3, Math.round((w - 2 * i) / 2.2)), 0.42) + dots(line(i + 2.4, h - i - 1.3, w - i - 2.4, h - i - 1.3, Math.round((w - 2 * i) / 2.2)), 0.42) + [[i + 2.2, i + 2.2], [w - i - 2.2, i + 2.2], [i + 2.2, h - i - 2.2], [w - i - 2.2, h - i - 2.2]].map(([x, y]) => rosette(x, y, 1.5)).join('')
    return sheet(w, h, back, `<rect x="${i}" y="${i}" width="${w - 2 * i}" height="${h - 2 * i}" rx=".8" fill="var(--sheet)"/>`, holes, `<rect x="${i + 3.6}" y="${i + 3.2}" width="${w - 2 * i - 7.2}" height="${h - 2 * i - 6.4}" rx=".6" fill="none" stroke="url(#foil)" stroke-width=".2"/>`)
  }

  /* ---------------------------------------------------------------- mandala medallion */
  function medallion(w, h) {
    const cx = w / 2
    const cy = h / 2
    const R = Math.min(w, h) / 2
    const petals = Array.from({ length: 24 }, (_, k) => { const a = (k / 24) * Math.PI * 2; return `<circle cx="${f(cx + Math.cos(a) * (R - 1.3))}" cy="${f(cy + Math.sin(a) * (R - 1.3))}" r="1.4"/>` }).join('')
    const ring = (rr, n, s) => dots(Array.from({ length: n }, (_, k) => { const a = (k / n) * Math.PI * 2; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr] }), s)
    const leaves = Array.from({ length: 16 }, (_, k) => { const a = (k / 16) * 360; return `<ellipse cx="${f(cx)}" cy="${f(cy - (R - 4.2))}" rx=".5" ry="1.2" transform="rotate(${a} ${f(cx)} ${f(cy)})"/>` }).join('')
    return sheet(w, h, `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R - 1.4)}" fill="url(#foil)"/><g fill="url(#foil)">${petals}</g>`, `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R - 2.4)}" fill="var(--sheet)"/>`, leaves + ring(R - 6.2, 40, 0.32), `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R - 7.6)}" fill="none" stroke="url(#foil)" stroke-width=".22"/>`)
  }

  /* ---------------------------------------------------------------- ribbon */
  function ribbon(w, h) {
    const n = Math.min(4, w * 0.06)
    const body = `M${n} 0 H${w - n} L${w} 0 L${w - n * 0.9} ${h / 2} L${w} ${h} H0 L${n * 0.9} ${h / 2} L0 0Z`
    const holes = dots(line(n + 2, 1.3, w - n - 2, 1.3, Math.round((w - 2 * n) / 1.8)), 0.32) + dots(line(n + 2, h - 1.3, w - n - 2, h - 1.3, Math.round((w - 2 * n) / 1.8)), 0.32)
    return sheet(w, h, `<path d="${body}" fill="url(#foilDark)"/>`, `<path d="${body}" fill="url(#foil)"/>`, holes)
  }

  return { arch, lace, medallion, ribbon }
})()
