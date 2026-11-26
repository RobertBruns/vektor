<!-- GEMEINSAME REGELN: in allen Repos gleich. Änderungen hier in allen Repos nachziehen. -->
## Gemeinsame Regeln

**Projekt.** Alles Repo-Spezifische — Arbeits- und Live-Branch, worum es geht, Aufbau, Konventionen —
steht in `PROJEKT.md`. Vor der ersten Änderung lesen.

**Identität.** Wer du bist und wie du committest, steht in den globalen Anweisungen deines
Werkzeugs auf diesem Rechner (Claude Code: `~/.claude/CLAUDE.md`, Mistral Vibe: `~/.vibe/AGENTS.md`, Codex: `~/.codex/AGENTS.md`).
Weißt du es nicht: nicht committen, sondern fragen. Nie mit dem Namen eines KI-Produkts oder
-Herstellers signieren (Claude, Mistral, Vibe, Codex, …), auch nicht als `Co-Authored-By`-Trailer.

**Arbeitsstil.** Knapp: kein Erzählen vor Tool-Aufrufen, keine Einleitung, minimale Diffs, keine
Nebenumbauten ohne Auftrag. Nur fragen, wenn du wirklich blockiert bist, dann eine Frage. Annahmen
in einer Zeile nennen. Substanzielle Antworten enden mit dem 80/20-Block (✅ Ergebnis,
👉 Nächste Schritte, ❓ Entscheidung, ⚠️ Risiko, 🔄 Git — nur die zutreffenden).

**Git.** Welcher Branch für die Arbeit ist und welcher live geht, steht oben in `PROJEKT.md`. Den
Arbeitsbranch darfst du jederzeit pushen. Alles, was live geht — Push auf den Live-Branch,
Deploy-Skripte, Server-Updates — nur auf ausdrückliche Anweisung. Jeder `prod` hat einen `dev`.

**Doku.** `TASKS.md`, `CHANGELOG.md` (mit dem Warum) und `LEARNINGS.md` im selben Commit
aktualisieren wie die Änderung, soweit es sie im Repo gibt.

**Prüfen.** Tests und Checks selbst laufen lassen, Fehler klar benennen. Nie behaupten, etwas baue
oder laufe, ohne es geprüft zu haben.

**Swift ohne Compiler.** Wo keine Swift-Toolchain verfügbar ist: Swift-Änderungen als „nicht gebaut"
kennzeichnen, vor dem Commit den Klammer-Check laufen lassen (geschweifte, runde und eckige Klammern
je Datei ausgeglichen) und sagen, welcher Build sie prüft (Playgrounds, Xcode, Xcode Cloud).

**Sprache.** Doku und Kommunikation auf Deutsch; Code-Konventionen regelt das jeweilige Repo.
<!-- ENDE GEMEINSAME REGELN -->
