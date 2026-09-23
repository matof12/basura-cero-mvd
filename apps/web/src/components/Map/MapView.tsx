/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import type { Container } from '../../types'
import { reverse } from '../../services/geocodingService'
import { getStatus, getStatusColor, getMunicipality, getPillLabel } from '../../utils/container'
import { haversine, formatDist } from '../../utils/geoUtils'
import { MAP_CONFIG, URLS } from '../../constants'
import { AddressSearch } from './AddressSearch'
import { GeoLocate } from './GeoLocate'
import { NearestPanel } from './NearestPanel'
import styles from './MapView.module.css'

function buildWhatsAppMessage(container: Container, address?: string): string {
  const municipality = getMunicipality(container.circuitCode)
  const lines = [
    'Hola, quiero reportar un contenedor en:',
    '',
  ]

  if (address) {
    lines.push(`📍 ${address}`)
  }

  lines.push(`🗑️ Lleva ${container.daysWithoutLift} días sin ser levantado`)
  lines.push(`📋 Circuito: ${container.circuitCode} · Municipio ${municipality}`)

  return lines.join('\n')
}

function buildPopupHtml(container: Container, address?: string): string {
  const dias = container.daysWithoutLift
  const color = getStatusColor(dias)
  const label = getPillLabel(dias)
  const message = buildWhatsAppMessage(container, address)
  const wppHref = `${URLS.WHATSAPP}?text=${encodeURIComponent(message)}`

  return `
    <div style="min-width:200px;font-family:'DM Sans',sans-serif">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #dde3dd">
        <span style="font-family:'DM Mono',monospace;font-size:0.78rem;color:#7a8c7a">Mun. ${getMunicipality(container.circuitCode)}</span>
        <span style="background:${color}22;color:${color};padding:2px 8px;border-radius:99px;font-size:0.7rem;font-weight:700">${label}</span>
      </div>
      <div style="padding:8px;border-radius:6px;background:${color}15;margin-bottom:8px;display:flex;align-items:center;gap:8px">
        <span style="font-family:'DM Mono',monospace;font-size:1.6rem;font-weight:500;color:${color}">${dias}</span>
        <span style="font-size:0.78rem;color:#3d4f3d">días sin<br>levantar</span>
      </div>
      <div style="font-size:0.82rem;color:#3d4f3d;margin-bottom:4px"><strong>Circuito:</strong> ${container.circuitCode}</div>
      <div style="font-size:0.82rem;color:#3d4f3d;margin-bottom:10px"><strong>Datos al:</strong> ${container.dateData}</div>
      <a href="${wppHref}" target="_blank" rel="noopener"
        style="display:block;padding:8px;background:#25d366;color:white;border-radius:6px;font-size:0.8rem;font-weight:600;text-align:center;text-decoration:none">
        📢 Reportar → 092 250 260
      </a>
    </div>
  `
}

interface MapViewProps {
  containers: Container[]
  loading: boolean
  error: string | null
  municipalityFilter?: string
  onMunicipalityFilterChange?: (municipio: string) => void
}

// ── Cluster interno ──────────────────────────────────────────
function ClusterLayer({ containers }: { containers: Container[] }) {
  const map = useMap()
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)
  const addressCacheRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    const cluster = (L as any).markerClusterGroup({
      maxClusterRadius: MAP_CONFIG.CLUSTER_RADIUS,
      showCoverageOnHover: false,
      iconCreateFunction: (group: L.MarkerClusterGroup) => {
        const children = (group as any).getAllChildMarkers()
        const total = children.length
        const ok   = children.filter((m: any) => m._status === 'ok').length
        const warn = children.filter((m: any) => m._status === 'warn').length
        const crit = children.filter((m: any) => m._status === 'crit').length

        const r = 20, cx = 22, cy = 22, stroke = 6
        const circ = 2 * Math.PI * r
        const aOk   = circ * ok / total
        const aWarn = circ * warn / total
        const aCrit = circ * crit / total
        const offOk   = circ * 0.25
        const offWarn = offOk - aOk
        const offCrit = offWarn - aWarn

        const svg = `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="#e2e8f0" stroke-width="1"/>
          ${aOk > 0 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1a7a4a" stroke-width="${stroke}" stroke-dasharray="${aOk.toFixed(1)} ${(circ-aOk).toFixed(1)}" stroke-dashoffset="${offOk.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>` : ''}
          ${aWarn > 0 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#d97706" stroke-width="${stroke}" stroke-dasharray="${aWarn.toFixed(1)} ${(circ-aWarn).toFixed(1)}" stroke-dashoffset="${offWarn.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>` : ''}
          ${aCrit > 0 ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#dc2626" stroke-width="${stroke}" stroke-dasharray="${aCrit.toFixed(1)} ${(circ-aCrit).toFixed(1)}" stroke-dashoffset="${offCrit.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>` : ''}
          <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="DM Mono,monospace" font-size="${total >= 1000 ? 9 : 11}" font-weight="700" fill="#0f1a0f">${total}</text>
        </svg>`

        return L.divIcon({ html: svg, className: '', iconSize: [44, 44], iconAnchor: [22, 22] })
      }
    })

    clusterRef.current = cluster
    map.addLayer(cluster)
    return () => { map.removeLayer(cluster) }
  }, [map])

  useEffect(() => {
    const cluster = clusterRef.current
    if (!cluster) return
    cluster.clearLayers()

    containers.forEach((container) => {
      const dias   = container.daysWithoutLift
      const status = getStatus(dias)
      const color  = getStatusColor(dias)

      const icon = L.divIcon({
        html: `<div style="width:12px;height:12px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
        className: '',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })

      const marker = L.marker([container.lat, container.long], { icon }) as any
      marker._status = status

      const key = `${container.lat.toFixed(4)},${container.long.toFixed(4)}`
      const cachedAddress = addressCacheRef.current.get(key)

      const loadAddress = async () => {
        const cached = addressCacheRef.current.get(key)
        if (cached) {
          marker.setPopupContent(buildPopupHtml(container, cached))
          return
        }

        marker.setPopupContent('<div style="min-width:200px;font-family:\'DM Sans\',sans-serif;color:#3d4f3d">Buscando dirección...</div>')

        try {
          const address = await reverse(container.lat, container.long)
          addressCacheRef.current.set(key, address)
          marker.setPopupContent(buildPopupHtml(container, address))
        } catch {
          marker.setPopupContent(buildPopupHtml(container))
        }
      }

      marker.bindPopup(buildPopupHtml(container, cachedAddress), { maxWidth: 260 })
      marker.on('popupopen', () => {
        const nextCached = addressCacheRef.current.get(key)
        if (nextCached) {
          marker.setPopupContent(buildPopupHtml(container, nextCached))
          return
        }

        void loadAddress()
      })

      cluster.addLayer(marker)
    })
  }, [containers])

  return null
}

function FocusLocationMarker({ location }: { location: { lat: number; lng: number; name: string } | null }) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!location) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    const userIcon = L.divIcon({
      html: `
        <div class="${styles.userMarker}">
          <div class="${styles.userMarkerRing}"></div>
          <div class="${styles.userMarkerDot}"></div>
        </div>
      `,
      className: '',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })

    if (markerRef.current) {
      markerRef.current.remove()
      markerRef.current = null
    }

    const marker = L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(location.name)

    markerRef.current = marker

    map.flyTo([location.lat, location.lng], MAP_CONFIG.LOCATE_ZOOM, {
      animate: true,
      duration: 1.1,
    })

    return () => {
      marker.remove()
      markerRef.current = null
    }
  }, [map, location])

  return null
}

function MapResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [map])

  return null
}

// ── Componente principal ─────────────────────────────────────
export function MapView({
  containers,
  loading,
  error: _error,
  municipalityFilter = 'Todos',
  onMunicipalityFilterChange,
}: MapViewProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'ok' | 'warn' | 'crit'>('all')
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [focusLocation, setFocusLocation] = useState<{ lat: number; lng: number; name: string } | null>(null)

  const clearFocusLocation = () => {
    setUserLocation(null)
    setFocusLocation(null)
  }

  const handleFilterMuniChange = (muni: string) => {
    onMunicipalityFilterChange?.(muni)
  }

  const resetMapView = () => {
    setFilterStatus('all')
    onMunicipalityFilterChange?.('Todos')
    clearFocusLocation()
  }

  const hasActiveMapState = municipalityFilter !== 'Todos' || filterStatus !== 'all' || Boolean(focusLocation)

  const filteredContainers = useMemo(() => {
    return containers.filter((c) => {
      const statusOk = filterStatus === 'all' || getStatus(c.daysWithoutLift) === filterStatus
      const muniOk   = municipalityFilter === 'Todos' || getMunicipality(c.circuitCode) === municipalityFilter
      return statusOk && muniOk
    })
  }, [containers, filterStatus, municipalityFilter])

  const nearest = useMemo(() => {
    if (!userLocation) return []
    return containers
      .map((c) => ({
        container: c,
        dist: haversine(userLocation[0], userLocation[1], c.lat, c.long),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3)
      .map((x) => ({ ...x.container, distLabel: formatDist(x.dist) }))
  }, [containers, userLocation])

  const munis = useMemo(() => {
    const set = new Set(containers.map((c) => getMunicipality(c.circuitCode)))
    return ['Todos', ...Array.from(set).sort()]
  }, [containers])

  const FILTER_BUTTONS = [
    { status: 'all'  as const, label: 'Todos'    },
    { status: 'ok'   as const, label: 'Al día'   },
    { status: 'warn' as const, label: '2 días'   },
    { status: 'crit' as const, label: '3+ días'  },
  ]

  return (
    <section className={styles.mapView}>
      <aside className={styles.sidebar}>
        <div>
          <p className={styles.sidebarTitle}>Contenedores en Montevideo</p>
          <p className={styles.sidebarSubtitle}>Fuente: Portal de Datos Abiertos IM</p>
        </div>

        {/* Stats */}
        <div className={styles.statRow}>
          <div className={styles.statBox}>
            <div className={styles.statNum}>{filteredContainers.length.toLocaleString('es-UY')}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={`${styles.statBox} ${styles.statBoxGreen}`}>
            <div className={styles.statNum}>
              {filteredContainers.filter(c => getStatus(c.daysWithoutLift) === 'ok').length.toLocaleString('es-UY')}
            </div>
            <div className={styles.statLabel}>0-1 día sin levantar</div>
          </div>
          <div className={`${styles.statBox} ${styles.statBoxAmber}`}>
            <div className={styles.statNum}>
              {filteredContainers.filter(c => getStatus(c.daysWithoutLift) === 'warn').length.toLocaleString('es-UY')}
            </div>
            <div className={styles.statLabel}>2 días sin levantar</div>
          </div>
          <div className={`${styles.statBox} ${styles.statBoxRed}`}>
            <div className={styles.statNum}>
              {filteredContainers.filter(c => getStatus(c.daysWithoutLift) === 'crit').length.toLocaleString('es-UY')}
            </div>
            <div className={styles.statLabel}>3+ días sin levantar</div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Filtro estado */}
        <div>
          <p className={styles.filterTitle}>Estado de recolección</p>
          <div className={styles.chips}>
            {FILTER_BUTTONS.map(({ status, label }) => (
              <button
                key={status}
                className={`${styles.chip} ${filterStatus === status ? styles.chipActive : ''} ${status === 'warn' ? styles.chipAmber : ''} ${status === 'crit' ? styles.chipRed : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Filtro municipio */}
        <div>
          <p className={styles.filterTitle}>Municipio</p>
          <div className={styles.chips}>
            {munis.map((muni) => (
              <button
                key={muni}
                className={`${styles.chip} ${municipalityFilter === muni ? styles.chipActive : ''}`}
                onClick={() => handleFilterMuniChange(muni)}
              >
                {muni}
              </button>
            ))}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Buscador */}
        <AddressSearch onSelect={(lat, lng, name) => {
          setUserLocation([lat, lng])
          setFocusLocation({ lat, lng, name })
        }} />

        {/* Geolocalización */}
        <GeoLocate
          onLocate={(lat, lng) => {
            setUserLocation([lat, lng])
            setFocusLocation({ lat, lng, name: 'Mi ubicación' })
          }}
          onClear={clearFocusLocation}
        />

        {/* Panel cercanos */}
        {userLocation && nearest.length > 0 && (
          <NearestPanel items={nearest} />
        )}

        <hr className={styles.divider} />

        {/* Leyenda */}
        <div className={styles.legendList}>
          <p className={styles.filterTitle}>Leyenda</p>
          <div className={styles.legendRow}>
            <div className={styles.legendDot} style={{ background: '#1a7a4a' }} />
            <span>Normal — 0 o 1 día</span>
          </div>
          <div className={styles.legendRow}>
            <div className={styles.legendDot} style={{ background: '#d97706' }} />
            <span>Atención — 2 días</span>
          </div>
          <div className={styles.legendRow}>
            <div className={styles.legendDot} style={{ background: '#dc2626' }} />
            <span>Crítico — 3 o más días</span>
          </div>
        </div>
      </aside>

      <div className={styles.mapWrap}>
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Cargando contenedores...</p>
          </div>
        )}
        {!loading && (
          <>
            <MapContainer
              center={MAP_CONFIG.CENTER}
              zoom={MAP_CONFIG.DEFAULT_ZOOM}
              scrollWheelZoom
              style={{ width: '100%', height: '100%' }}
              className={styles.map}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <MapResizeHandler />
              <ClusterLayer containers={filteredContainers} />
              <FocusLocationMarker location={focusLocation} />
            </MapContainer>

            {hasActiveMapState && (
              <button type="button" className={styles.mapResetButton} onClick={resetMapView}>
                Restablecer vista
              </button>
            )}
          </>
        )}
      </div>
    </section>
  )
}