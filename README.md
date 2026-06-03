# bfsg-andersen.de

Landingpage für das BFSG-Angebot von Andersen Webworks. Barrierefreie Websites nach dem Barrierefreiheitsstärkungsgesetz: Technik und Texte aus einer Hand (Erik Andersen, Technik; Annemarie Andersen, Sprache).

## Struktur

```
.
├── index.html              Landingpage
├── llms.txt                KI-/Agent-Sichtbarkeit (GEO/AVO)
├── css/                    tokens, base, components, sections
├── assets/                 Logo, Favicon, site.js
└── barrierefreiheit/       Erklärung zur Barrierefreiheit der LP
```

Konzept und Marktrecherche (`docs/`) sowie der Projektkontext (`.claude/`) werden bewusst lokal gehalten und nicht im öffentlichen Repo veröffentlicht.

## Entwicklung

Statische Seite, kein Build nötig. Lokal ansehen:

```powershell
python -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Deployment

GitHub Pages. Kein automatischer Live-Versand, keine externen Trigger.

## Standards

WCAG-2.2-AA-orientiert, manuell getestet. Die Seite ist ihr eigenes Schaufenster: Sie erfüllt, was sie verkauft. Details in `.claude/CLAUDE.md`.
