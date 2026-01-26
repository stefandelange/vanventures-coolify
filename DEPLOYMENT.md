# Deployment auf Hetzner mit Coolify

Dieses Projekt wurde von Cloudflare auf Hetzner/Coolify mit Bunny CDN migriert.

## Coolify Setup

### 1. GitHub Repository verbinden
- In Coolify: Neue Anwendung erstellen
- Repository: `vanventures-coolify` auswählen
- Branch: `main`
- Build Type: Nixpacks (automatisch erkannt)

### 2. Environment Variables in Coolify setzen

**Wichtig:** Folgende Environment Variable muss in Coolify konfiguriert werden:

```
NEXT_PUBLIC_CDN_URL=https://cdn-eu.vanventures.blog
```

Diese Variable wird für:
- Image Optimization über Bunny CDN
- Static Asset Delivery (CSS, JS, Bilder)

### 3. Build Konfiguration

Coolify nutzt automatisch:
- **Install Command**: `npm install`
- **Build Command**: `npm run build` (führt automatisch `prebuild` aus → generiert Posts)
- **Start Command**: `npm start`

**Port**: 3000 (Next.js Standard)

## Bunny CDN Setup

### Pull Zone Konfiguration
- **URL**: `cdn-eu.vanventures.blog`
- **Origin**: Deine Coolify/Hetzner URL (z.B. `vanventures.blog`)
- **Optimizer**: Standard Konfiguration aktiviert

### Bunny Optimizer - Standard Konfiguration
Die Standard-Konfiguration sollte ausreichen. Falls du spezifische Anpassungen brauchst:

1. **WebP/AVIF Support**: Bereits in Next.js konfiguriert
2. **Quality Parameter**: Wird von Next.js über Query String gesteuert (`?quality=75`)
3. **Width Parameter**: Wird von Next.js über Query String gesteuert (`?width=1200`)

Die Bunny CDN Optimizer Standard-Konfiguration verarbeitet automatisch:
- `?width=XXX` - Resize auf angegebene Breite
- `?quality=XX` - Kompression (0-100)
- Automatisches Format (WebP/AVIF basierend auf Browser-Support)

### DNS Konfiguration
Stelle sicher, dass folgende DNS Records existieren:
- `vanventures.blog` → Hetzner Server IP
- `cdn-eu.vanventures.blog` → Bunny CDN (wird von Bunny bereitgestellt)

## Was wurde geändert?

### Entfernt
- `@opennextjs/cloudflare` dependency
- `wrangler` dependency
- `wrangler.jsonc` config
- `open-next.config.ts` config
- `cloudflare-env.d.ts` types
- Cloudflare-spezifische Scripts (`deploy`, `preview`, `cf-typegen`)

### Hinzugefügt/Geändert
- `next.config.ts`:
  - Entfernt: Cloudflare initialization
  - Hinzugefügt: `output: "standalone"` für optimiertes Deployment
  - Geändert: Image loader von `cloudflare-image-loader.ts` zu `bunny-image-loader.ts`

- `src/lib/bunny-image-loader.ts`:
  - Nutzt Bunny CDN Query Parameter statt Cloudflare Image API
  - Format: `https://cdn-eu.vanventures.blog/images/foto.jpg?width=1200&quality=75`

- `.env.production`:
  - CDN URL von `cdn.vanventures.blog` zu `cdn-eu.vanventures.blog`

## Troubleshooting

### Build Fehler: "Posts not found"
Der `prebuild` Hook generiert automatisch die Posts. Falls das fehlschlägt:
```bash
npm run generate:posts
```

### Images werden nicht optimiert
Prüfe in Coolify:
- Environment Variable `NEXT_PUBLIC_CDN_URL` ist gesetzt
- Bunny Pull Zone ist aktiv
- Origin Server ist erreichbar

### 404 auf Static Assets
- Stelle sicher, dass die Bunny Pull Zone auf die richtige Origin zeigt
- Cache in Bunny CDN purgen

## Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten (generiert automatisch Posts)
npm run dev

# Production Build lokal testen
npm run build
npm start
```

Die lokale Entwicklung nutzt keinen CDN, sondern lädt Assets direkt vom Next.js Dev Server.
