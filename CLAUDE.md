# CLAUDE.md

## Projekt

Gamifiziertes Quiz „AWS AI Practitioner“ (15 Fragen) im Duolingo-Stil mit Apple-Optik.

## Stack und Einschränkungen

- Ausschließlich HTML, CSS und reines JavaScript (Vanilla). Keine Frameworks, kein Build-Schritt, kein npm, kein CDN.
- Dateien: `index.html`, `style.css`, `app.js`, `questions.js`
- Skripte werden per `<script src="...">` eingebunden (keine ES-Module), damit die Seite auch beim direkten Öffnen von `index.html` im Browser funktioniert.
- Alle Dateipfade müssen RELATIV sein (`./style.css`, niemals `/style.css`), da die Seite auf GitHub Pages unter einem Unterpfad (`/repo-name/`) veröffentlicht wird.
- Sprache der Oberfläche und der Fragen: Deutsch.
- Mobile-first und responsiv; `prefers-color-scheme` und `prefers-reduced-motion` berücksichtigen.
- Barrierefreiheit: semantisches HTML, sichtbarer Fokus, `aria-live` für das Feedback, Tastaturnavigation.
- Commits nach Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
