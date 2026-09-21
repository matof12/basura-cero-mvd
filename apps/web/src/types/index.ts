// ─── Primitivos ───────────────────────────────────────────
export type ContainerStatus = 'ok' | 'warn' | 'crit'

export type ViewMode = 'map' | 'dashboard' | 'reportar'

// ─── Datos del CSV (un contenedor) ────────────────────────
export interface Container {
  dateData: string
  circuitCode: string
  position: number
  daysWithoutLift: number
  lat: number
  long: number
}

// ─── Dashboard ────────────────────────────────────────────
export interface MunicipalityStats {
  name: string
  total: number
  ok: number
  warn: number
  crit: number
}

export interface DashboardStats {
  total: number
  ok: number
  warn: number
  crit: number
  byMunicipality: MunicipalityStats[]
  worst: Container | null
}

// ─── Geocodificación ──────────────────────────────────────
export interface GeocodingResult {
  displayName: string,
  address: string,
  lat: number
  lng: number
}

export interface UserLocation {
  lat: number
  lng: number
}

// ─── Reciclaje ────────────────────────────────────────────
export interface RecyclingPoint {
  name: string
  type: string
  lat: number
  lng: number
}