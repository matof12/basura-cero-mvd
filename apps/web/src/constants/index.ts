// ─── Thresholds ───────────────────────────────────────────
export const THRESHOLDS = {
  OK: 1,    // 0-1 días → verde
  WARN: 2,  // 2 días → amarillo
             // 3+ días → rojo (no necesita constante, es el default)
} as const

// ─── Colores ──────────────────────────────────────────────
export const COLORS = {
  OK:   '#1a7a4a',
  WARN: '#d97706',
  CRIT: '#dc2626',
} as const

// ─── Mapa ─────────────────────────────────────────────────
export const MAP_CONFIG = {
  CENTER: [-34.9011, -56.1645] as [number, number],
  DEFAULT_ZOOM: 12,
  LOCATE_ZOOM: 15,
  CLUSTER_RADIUS: 50,
} as const

// ─── URLs externas ────────────────────────────────────────
export const URLS = {
  WHATSAPP:          'https://wa.me/59892250260',
  NOMINATIM_BASE:    'https://nominatim.openstreetmap.org',
  CKAN_CONTAINERS:   'https://ckan-data.montevideo.gub.uy/vistas/levantes-contenedores?format=csv',
  CKAN_RECICLAJE:    'https://datos-abiertos.montevideo.gub.uy/contenedores_reciclables.zip',
  CKAN_ATTRIBUTION:  'https://ckan.montevideo.gub.uy',
  IM_WEB:            'https://montevideo.gub.uy',
  IM_CCZ:            'https://montevideo.gub.uy/ciudad/gobierno/ccz',
} as const

// ─── Nominatim ────────────────────────────────────────────
export const NOMINATIM_CONFIG = {
  USER_AGENT:    'BasuraCeroMVD/1.0 (github.com/matof12/basura-cero-mvd)',
  SEARCH_LIMIT:  5,
  COUNTRY_CODE:  'uy',
  SEARCH_DELAY:  400, // ms entre keystroke y búsqueda
} as const

// ─── Municipios ───────────────────────────────────────────
export const MUNICIPALITIES = ['A', 'B', 'C', 'CH', 'D', 'E', 'F', 'G'] as const

export type Municipality = typeof MUNICIPALITIES[number]

// ─── Datos locales ────────────────────────────────────────
export const DATA_PATHS = {
  CONTAINERS: '/data/containers.json',
  RECICLAJE:  '/data/reciclaje.json',
} as const

// ─── Contacto IM ──────────────────────────────────────────
export const IM_CONTACT = {
  WHATSAPP_NUMBER:  '092 250 260',
  PHONE:            '1950 int. 6100',
} as const