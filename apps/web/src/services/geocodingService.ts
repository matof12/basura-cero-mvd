import type { GeocodingResult } from '../types/index'
import { NOMINATIM_CONFIG,URLS } from '../constants/index'

// Cache privado — nadie fuera del módulo lo ve
const cache = new Map<string, string>()

interface NominatimResponse {
  display_name: string
  lat: string
  lon: string
  address?: {
    road?: string
    pedestrian?: string
    footway?: string
    house_number?: string
    suburb?: string
    neighbourhood?: string
    quarter?: string
  }
}

/**
 * Formatea la dirección desde la respuesta de Nominatim
 */
function formatAddress(data: NominatimResponse): string {
  const a = data.address || {}
  const road = (a.road || a.pedestrian || a.footway || '').trim()
  const rawNumber = (a.house_number || '').trim()
  const suburb = (a.suburb || a.neighbourhood || a.quarter || '').trim()

  const oneNumber = rawNumber
    .split(/[;,/]/)[0]
    .trim()

  const street = oneNumber ? `${road} ${oneNumber}`.trim() : road
  const parts = [street, suburb].filter(Boolean)

  return parts.join(', ') || data.display_name
}

const headers = {
  'Accept-Language': 'es',
  'User-Agent': NOMINATIM_CONFIG.USER_AGENT
}

/**
 * Busca direcciones por texto
 */
export async function search(query: string): Promise<GeocodingResult[]> {
const url = new URL(`${URLS.NOMINATIM_BASE}/search`)
  url.searchParams.append('format', 'json')
  url.searchParams.append('limit', '5')
  url.searchParams.append('countrycodes', 'uy')
  url.searchParams.append('q', query)

  const response = await fetch(url.toString(), { headers })
  if (!response.ok) throw new Error(`Error en búsqueda: ${response.statusText}`)

  const data: NominatimResponse[] = await response.json()
  return data.map(item => ({
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName: item.display_name,
    address: formatAddress(item)
  }))
}

/**
 * Busca dirección por coordenadas (con cache)
 */
export async function reverse(lat: number, lng: number): Promise<string> {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`

  if (cache.has(key)) {
    return cache.get(key)!
  }

  const url = new URL(`${URLS.NOMINATIM_BASE}/reverse`)
  url.searchParams.append('format', 'json')
  url.searchParams.append('lat', lat.toString())
  url.searchParams.append('lon', lng.toString())
  url.searchParams.append('zoom', '18')
  url.searchParams.append('addressdetails', '1')

  const response = await fetch(url.toString(), { headers })
  if (!response.ok) throw new Error(`Error en búsqueda inversa: ${response.statusText}`)

  const data: NominatimResponse = await response.json()
  const address = formatAddress(data)

  cache.set(key, address)
  return address
}
