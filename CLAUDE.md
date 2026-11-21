# Claude Code handoff

Read README.md before editing. This is a working, dependency-free static app; keep it browser-local unless the user requests otherwise. All app source is in dist/. There is no build step.

The user asked for an Adobe Capture-like tool to convert a sketch to SVG. Current implementation covers single-color vector tracing and SVG download. Preserve genuine editable SVG path output and local image processing.

Start by running `node --check dist/app.js` and `node tests/trace.cjs`, then serve dist/ with Python and inspect in a browser. Prioritize real browser QA, tracing quality, and usability over adding unrelated features. The synthetic tests are limited and do not replace visual quality checks.

Likely improvements if requested: Bezier curve fitting or a mature tracing engine, crop/rotate/perspective tools for photographed sketches, higher-resolution tracing in a Web Worker, and a mobile original/vector switch. Ask the user which direction they want before expanding scope.

The existing files are compact and contain long lines. Formatting them for readability is reasonable. No secrets or environment variables are needed. No hosting project identity is included; do not assume publishing access to the original site.
