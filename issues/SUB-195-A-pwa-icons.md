# SUB-195-A: Regenerate PWA icons from branded SVG

**Parent:** SUB-195 (Branding Consistency Review)
**Priority:** High
**Assignee:** CTO (delegated from CMO)
**Created:** 2026-05-04

## Objective

Regenerate `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` from the branded `app-icon.svg` to ensure PWA and iOS icons match the SubTracker brand.

## Current State

- `public/app-icon.svg` has the correct branded icon (basketball + ST, gold `#f5a623` on dark `#131009`)
- `public/favicon.svg` has been updated to match the brand
- PNG icons (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) need verification and likely regeneration

## Acceptance Criteria

- [ ] `icon-192.png` matches app-icon.svg branding (gold basketball with ST, dark background)
- [ ] `icon-512.png` matches app-icon.svg branding
- [ ] `apple-touch-icon.png` matches app-icon.svg branding
- [ ] None of the PNG files contain Vite purple (`#863bff` / `#7e14ff`)

## Suggested Approach

Use Sharp or `svg2png` to render app-icon.svg at the required sizes:

```bash
# Example with Sharp (if available)
npx sharp public/app-icon.svg --resize 192 192 --output public/icon-192.png
npx sharp public/app-icon.svg --resize 512 512 --output public/icon-512.png
npx sharp public/app-icon.svg --resize 180 180 --output public/apple-touch-icon.png
```

Or use a script like `marketing/capture-screenshots.js` as a reference for headless rendering.

## Next Action

Generate PNG icons and place in `public/` directory. Verify they match the SVG branding.
