# Neuen Blog Post mit Bildern erstellen

## 1. Bilder vorbereiten

Lege deine Bilder in einem lokalen Ordner ab, z.B.:
```
~/Desktop/mein-neuer-post/
├── bild1.jpeg
├── bild2.jpeg
└── bild3.jpeg
```

## 2. Bilder auf R2 hochladen

```bash
rclone copy ~/Desktop/mein-neuer-post/ r2:vanventures-images/images/van-life/mein-neuer-post/ --progress
```

Oder einzelne Bilder:
```bash
rclone copy ~/Desktop/bild.jpeg r2:vanventures-images/images/van-life/mein-neuer-post/ --progress
```

## 3. Prüfen ob Upload erfolgreich

```bash
curl -I https://cdn.vanventures.blog/images/van-life/mein-neuer-post/bild1.jpeg
```

Sollte `HTTP/2 200` zurückgeben.

## 4. Blog Post schreiben

Erstelle die Markdown-Datei wie gewohnt:

```markdown
---
title: "Mein neuer Post"
slug: "2026-01-22-mein-neuer-post"
date: "2026-01-22"
author: "Stefan"
excerpt: "..."
categories:
  - 📖 Story
heroImage: "/images/van-life/mein-neuer-post/bild1.jpeg"
heroImageAlt: "Beschreibung"
status: published
---

Text hier...

:::gallery
columns=2
ratio=1:1
/images/van-life/mein-neuer-post/bild1.jpeg
/images/van-life/mein-neuer-post/bild2.jpeg
/images/van-life/mein-neuer-post/bild3.jpeg
:::

Mehr Text...
```

**Wichtig:** Die Pfade beginnen weiterhin mit `/images/...` - der CDN-Rewrite passiert automatisch.

## 5. Commit & Deploy

```bash
git add content/van-life/2026-01-22-mein-neuer-post.de.md
git add content/van-life/2026-01-22-mein-neuer-post.en.md
git commit -m "Add new post: Mein neuer Post"
git push
```

## Zusammenfassung

| Schritt | Aktion |
|---------|--------|
| Bilder | `rclone copy` nach R2 |
| Post | Markdown mit `/images/...` Pfaden |
| Deploy | Nur Markdown committen |

## Nützliche Befehle

```bash
# Alle Bilder in einem R2-Ordner auflisten
rclone ls r2:vanventures-images/images/van-life/mein-neuer-post/

# Bild löschen
rclone delete r2:vanventures-images/images/van-life/mein-neuer-post/altes-bild.jpeg

# Ordner löschen
rclone purge r2:vanventures-images/images/van-life/alter-ordner/
```
