# vektor

**Arbeit:** `dev` (ein Push auf `dev` deployt nichts Neues).
**Live:** `main` — jeder Push auf `main` deployt nach vektor.dpsg-marcelcallo.de (siehe `DEPLOYMENT.md`). Release `dev` → `main`, nur auf Anweisung:
`git checkout main && git merge --no-ff dev && git push && git checkout dev`

Vor dem Bearbeiten `README.md` lesen. vektor ist eine funktionierende, abhängigkeitsfreie statische App; sie bleibt browser-lokal, sofern nicht anders gewünscht. Der gesamte App-Code liegt in `dist/`. Es gibt keinen Build-Schritt.

Gewünscht war ein Werkzeug wie Adobe Capture, das eine Skizze in SVG umwandelt. Umgesetzt sind einfarbiges Vektor-Tracing, SVG-Download, Live-Kamera mit Zweiton-Vorschau und Gedrückthalten zum Vergleich. Echte, bearbeitbare SVG-Pfade und lokale Bildverarbeitung erhalten.

Zum Einstieg `node --check dist/app.js` und `node tests/trace.cjs` laufen lassen, dann `dist/` mit Python ausliefern und im Browser prüfen. Echte Browser-QA, Tracing-Qualität und Bedienbarkeit haben Vorrang vor neuen Features. Die synthetischen Tests sind begrenzt und ersetzen keine visuelle Prüfung.

Mögliche Verbesserungen, falls gewünscht: Bézier-Kurvenanpassung oder eine ausgereifte Tracing-Engine, Zuschneiden/Drehen/Perspektivkorrektur für fotografierte Skizzen, höher aufgelöstes Tracing in einem Web Worker. Vor einer Erweiterung des Umfangs fragen, welche Richtung gewünscht ist.

Die Dateien sind kompakt und enthalten lange Zeilen; sie lesbarer zu formatieren ist in Ordnung. Es werden keine Secrets oder Umgebungsvariablen gebraucht.
