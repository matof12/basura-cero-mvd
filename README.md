# BasuraCero MVD 🗑️

Plataforma civic tech que visualiza en tiempo real el estado de los **10.600+ contenedores de residuos domiciliarios** de Montevideo, consumiendo datos directamente del Portal de Datos Abiertos de la Intendencia de Montevideo.

🔗 **Demo en vivo:** https://basuracero.vercel.app

---
## ¿Qué problema resuelve?

La Intendencia de Montevideo publica datos en tiempo real sobre el estado de recolección de sus más de 10.000 contenedores domiciliarios. Sin embargo, esa información vive en un archivo CSV técnico que 
es difícil de interpretar para el ciudadano común.

BasuraCero MVD toma esos datos abiertos y los transforma en algo visual y accionable — un mapa, estadísticas por municipio y la posibilidad de reportar problemas directamente a los canales oficiales de la IM.
---
## Features

- 🗺️ **Mapa interactivo** con clustering dinámico tricolor (verde/amarillo/rojo) según días sin recolección
- 📊 **Dashboard** con estadísticas en tiempo real por municipio y ranking de cumplimiento
- 🔍 **Buscador de direcciones** con geocodificación via Nominatim / OpenStreetMap
- 📍 **Geolocalización** — encontrá los 3 contenedores más cercanos a tu ubicación
- 🏙️ **Filtros** por estado de recolección y por municipio (A al G)
- 📱 **PWA** — instalable en el celular como app nativa
- ⚡ **Datos actualizados cada hora** via GitHub Actions
---
## Stack técnico

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 + TypeScript | Framework y tipado |
| Vite | Build tool |
| react-leaflet + Leaflet | Mapa interactivo |
| leaflet.markercluster | Clustering de markers |
| CSS Modules | Estilos por componente |
| vite-plugin-pwa | PWA y service worker |

### Automatización
| Tecnología | Uso |
|---|---|
| GitHub Actions | Pipeline de datos cada hora |
| Node.js | Script de sync (sync.js) |
| JSZip | Descompresión de ZIP |
| proj4 | Conversión de coordenadas UTM → lat/lng |

### APIs y datos
| Fuente | Dataset |
|---|---|
| Portal de Datos Abiertos IM | Levantes de contenedores (CSV, ~10.600 registros) |
| Nominatim / OpenStreetMap | Geocodificación directa e inversa |

---
## Arquitectura
```
GitHub Actions (cada hora)
       ↓
Descarga CSV de CKAN → genera containers.json
       ↓
Commitea al repo (sin servidor propio)
       ↓
Frontend React (Vercel)
Lee el JSON estático → calcula stats → dibuja mapa y dashboard
```

Sin backend, sin base de datos, sin costos de infraestructura.
---
## Cómo correrlo localmente

### Requisitos
- Node.js 22+
- npm 10+
### Instalación

```bash
# Clonar el repo
git clone https://github.com/matof12/basura-cero-mvd.git
cd basura-cero-mvd

# Instalar dependencias del frontend
cd apps/web
npm install

# Generar datos reales (requiere conexión a internet)
cd ../..
cd scripts && npm install && cd ..
node scripts/sync.js

# Correr en desarrollo
cd apps/web
npm run dev
```
La app queda disponible en `http://localhost:5173`

### Build de producción

```bash
cd apps/web
npm run build
npm run preview
```
---

## Estructura del proyecto
```
basura-cero-mvd/
├── apps/
│   └── web/                    ← Frontend React + TypeScript
│       ├── public/
│       │   └── data/
│       │       └── containers.json  ← generado por GitHub Actions
│       └── src/
│           ├── components/     ← Layout, Map, Dashboard, Reportar
│           ├── hooks/          ← useContainers, useDashboard
│           ├── services/       ← data.service, geocoding.service
│           ├── types/          ← interfaces TypeScript
│           ├── utils/          ← container.utils, geo.utils
│           └── constants/      ← thresholds, URLs, config
├── scripts/
│   └── sync.js                 ← pipeline de datos
└── .github/
    └── workflows/
        └── sync-data.yml       ← cron cada hora
```

---

## Datos utilizados

- **Dataset:** [Levantes de contenedores domiciliarios](https://ckan.montevideo.gub.uy/dataset/informacion-de-levantes-de-contenedores-domiciliarios)
- **Fuente:** Portal de Datos Abiertos — Intendencia de Montevideo
- **Licencia:** [DAG-UY](https://montevideo.gub.uy/dag-uy) — Datos Abiertos Gubernamentales Uruguay
- **Geocodificación:** [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org) contributors

---

## POC

Antes de migrar a React, validé la idea completa en un prototipo de un solo archivo HTML consumiendo datos reales:

🔗 [Ver POC](https://matof12.github.io/basura-cero-mvd-poc/) · [Repo POC](https://github.com/matof12/basura-cero-mvd-poc)

---

## Contribuciones

El proyecto es de código abierto. Si encontrás un bug o tenés una idea, abrí un issue o un PR.
---
*Iniciativa ciudadana independiente · No afiliada con la Intendencia de Montevideo*