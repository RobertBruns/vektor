# vektor

Browser-local sketch-to-SVG app (German UI; based on the Inktrace handoff). Upload JPG, PNG, or WebP; tune threshold, edge simplification, and speckle removal; change ink color; export editable SVG paths.

## Run locally

No build, package install, or API keys required. From this directory:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000. You can also open `dist/index.html` directly.

## Source

- `dist/index.html`: app structure and help dialog
- `dist/style.css`: responsive styling
- `dist/app.js`: image loading, sample drawing, tracing, controls, SVG download

Deploy the contents of `dist/` to any static host; see DEPLOYMENT.md for the live setup. No server-side processing or storage is used. Fonts (DM Sans, Manrope, OFL) are self-hosted in `dist/fonts/`, so the app makes no external requests.

## Current behavior and limits

- Input images are scaled to at most 900 pixels on their longest side.
- Single-color tracing uses luminance thresholding, connected-component speckle removal, pixel-edge contour extraction, and polyline simplification.
- Even-odd fill preserves holes. Exports contain vector paths, not embedded raster images.
- This is a focused sketch tracing tool, not the entire Adobe Capture feature suite.
- Smoothing simplifies polygon edges; it does not fit Bezier curves.
- No cropping, perspective correction, multicolor tracing, undo history, or project persistence yet.
- On narrow screens, only the vector panel is displayed.

## Validation

`node --check dist/app.js` passed. Synthetic checks covered solid shapes, holes, blank images, disconnected shapes, and SVG output. A reusable version is included at `tests/trace.cjs`; run `node tests/trace.cjs`.

Visual browser QA was not completed: the original environment blocked the preview server's port. Check desktop and mobile layouts, file upload, drag-and-drop, all controls, and SVG download in a real browser before making further release claims.

The handoff intentionally excludes Git history, credentials, and the original hosting identity. It is portable source, not a connection to the existing deployment.
