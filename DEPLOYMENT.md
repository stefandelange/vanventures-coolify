# Deployment auf Hetzner mit Coolify

Dieses Projekt wurde von Cloudflare auf Hetzner/Coolify mit Bunny CDN migriert.

## Coolify Setup

### 1. GitHub Repository verbinden
- In Coolify: Neue Anwendung erstellen
- Repository: `vanventures-coolify` auswählen
- Branch: `main`
- **Build Type: Dockerfile** (wichtig! Nicht Nixpacks wegen npm ci Issues)
- **Is it a static site?** → NEIN (nicht anhaken)
- **Is it a SPA?** → NEIN (nicht anhaken)
- **Port**: 3000

### 2. CDN Konfiguration

Die CDN URL ist direkt im Code konfiguriert in [src/config/cdn.ts](src/config/cdn.ts):

```typescript
export const CDN_URL = "https://cdn-eu.vanventures.blog";
export const SITE_URL = "https://vanventures.blog";
```

**Um den CDN zu ändern:**
1. Bearbeite `src/config/cdn.ts`
2. Commit und Push zu GitHub
3. Coolify baut automatisch neu (oder manuell triggern)

Keine Environment Variables in Coolify notwendig!

### 3. Build Konfiguration

Das Projekt nutzt einen **Dockerfile** für den Build:
- Multi-stage Build für optimierte Image-Größe
- Automatische Post-Generierung via `npm run generate:posts`
- Next.js Standalone Output
- Production-optimiert mit Node 20 Alpine

**Warum Dockerfile und nicht Nixpacks?**
Nixpacks nutzt `npm ci`, was bei Next.js manchmal zu Version-Konflikten führt (z.B. `@swc/helpers`). Der Dockerfile nutzt `npm install`, was robuster ist.

## Bunny CDN Setup

### Storage + Pull Zone (dein Setup)
- **URL**: `cdn-eu.vanventures.blog`
- **Assets liegen in**: Bunny Storage (nicht Origin-Pull!)
- **Optimizer**: Standard Konfiguration aktiviert

Da deine Assets bereits im Bunny Storage liegen, brauchst du **keine Origin-Konfiguration**. Die Pull Zone liefert direkt aus dem Storage aus.

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
- **`Dockerfile`** und **`.dockerignore`**:
  - Multi-stage Build für Next.js standalone
  - Umgeht npm ci Issues mit Nixpacks

- **`src/config/cdn.ts`** (NEU):
  - Zentrale CDN Konfiguration
  - Keine Environment Variables notwendig
  - Einfach zu ändern per Code

- `next.config.ts`:
  - Entfernt: Cloudflare initialization
  - Hinzugefügt: `output: "standalone"` für optimiertes Deployment
  - Geändert: Image loader von `cloudflare-image-loader.ts` zu `bunny-image-loader.ts`

- `src/lib/bunny-image-loader.ts`:
  - Nutzt Bunny CDN Query Parameter statt Cloudflare Image API
  - Format: `https://cdn-eu.vanventures.blog/images/foto.jpg?width=1200&quality=75`
  - Importiert CDN URL aus zentraler Config

- `src/app/layout.tsx` und `src/app/manifest.ts`:
  - Nutzen zentrale CDN Config für Icons

- `tsconfig.json`:
  - Entfernt: Cloudflare types Referenz

## Troubleshooting

### Build Fehler: "Posts not found"
Der `prebuild` Hook generiert automatisch die Posts. Falls das fehlschlägt:
```bash
npm run generate:posts
```

### Images werden nicht optimiert / laden von falscher URL
**Symptom:** Images laden von falscher URL statt `cdn-eu.vanventures.blog`

**Lösung:**
1. Prüfe [src/config/cdn.ts](src/config/cdn.ts) - ist die CDN_URL korrekt?
2. Falls geändert: Commit, Push, und Rebuild in Coolify
3. Im Browser Network Tab: Prüfe ob Images von der richtigen CDN URL laden

**Falls immer noch falsch:**
- Bunny Pull Zone ist aktiv?
- Assets existieren im Bunny Storage unter dem richtigen Pfad?
- DNS für `cdn-eu.vanventures.blog` korrekt?

### 404 auf Static Assets
- Prüfe, ob Assets im Bunny Storage unter dem richtigen Pfad liegen
- Cache in Bunny CDN purgen
- DNS für `cdn-eu.vanventures.blog` korrekt?

### npm ci Error beim Build
Wenn trotz Dockerfile `npm ci` Fehler auftreten:
- Stelle sicher, dass Coolify "Dockerfile" als Build Type nutzt (nicht Nixpacks)
- Im Zweifel: Cache in Coolify löschen und neu builden

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
