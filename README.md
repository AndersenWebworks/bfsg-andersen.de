# bfsg-andersen.de

Landingpage für den **BFSG-Webcheck** von Andersen Webworks. Technische Barrierefreiheit prüfen, priorisieren und verbessern: Technik und Texte aus einer Hand (Erik Andersen, Technik; Annemarie Andersen, freie Sachverständige für Sprachdienstleistungen mit QA-Hintergrund). Keine Rechtsberatung, keine pauschale BFSG-Konformitätsgarantie.

## Struktur

```
.
├── index.html              Landingpage
├── llms.txt                KI-/Agent-Sichtbarkeit (GEO/AVO)
├── robots.txt              Crawler-Regeln und Sitemap-Hinweis
├── sitemap.xml             Indexierbare Seiten
├── ai/                     Maschinenlesbare Zusammenfassungen
├── css/                    tokens, base, components, sections
├── assets/                 Logo, Favicon, site.js
├── en/                     vollständige englische Angebotsseite
├── leichte-sprache/        eigene Fassung in Leichter Sprache
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

WCAG-2.2-AA-orientiert, manuell geprüft. Die Seite ist ihr eigenes Schaufenster: Tastaturbedienung, sichtbarer Fokus, verständliche Fehler, Dark Mode, Schriftgrößen, Reduced Motion, eigene Sprachversionen, selbst gehostete Schriften und progressive Fallbacks. Details in `.claude/CLAUDE.md`.
