#!/usr/bin/env bash
# Regenerates the resume PDFs into public/ using headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}"
FLAGS=(--headless --disable-gpu --no-sandbox --no-pdf-header-footer)

# primary — one page, designed (linked from the site as profile.resumeUrl)
"$CHROME" "${FLAGS[@]}" --print-to-pdf=public/kirti-koyani-resume.pdf      resume/kirti-koyani-resume-onepage.html
# one page, navy-sidebar variant
"$CHROME" "${FLAGS[@]}" --print-to-pdf=public/kirti-koyani-resume-navy.pdf resume/kirti-koyani-resume-onepage-navy.html
# two-page designed variant, for roles that want the long form
"$CHROME" "${FLAGS[@]}" --print-to-pdf=public/kirti-koyani-resume-full.pdf resume/kirti-koyani-resume-designed.html
# plain single-column, for ATS / job-portal uploads
"$CHROME" "${FLAGS[@]}" --print-to-pdf=public/kirti-koyani-resume-ats.pdf  resume/kirti-koyani-resume.html

for f in public/kirti-koyani-resume*.pdf; do
  printf '%-42s %s page(s)\n' "$f" "$(pdfinfo "$f" 2>/dev/null | awk '/^Pages/{print $2}')"
done
