#!/usr/bin/env node

/**
 * sync.js — Script de sincronización de datos CKAN
 * Corre cada hora via GitHub Actions
 * Genera:
 *   apps/web/public/data/containers.json
 *   apps/web/public/data/reciclaje.json
 */

const fs      = require('fs')
const path    = require('path')
const https   = require('https')

// ── URLs ────────────────────────────────────────────────────
const CKAN_CONTAINERS = 'https://ckan-data.montevideo.gub.uy/vistas/levantes-contenedores?format=csv'
const CKAN_RECICLAJE  = 'https://datos-abiertos.montevideo.gub.uy/contenedores_reciclables.zip'

// ── Paths de salida ─────────────────────────────────────────
const OUT_DIR        = path.join(__dirname, '..', 'apps', 'web', 'public', 'data')
const OUT_CONTAINERS = path.join(OUT_DIR, 'containers.json')
const OUT_RECICLAJE  = path.join(OUT_DIR, 'reciclaje.json')

// ── Helpers ─────────────────────────────────────────────────

/** Descarga una URL y devuelve el body como Buffer */
function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Seguir redirect
        return download(res.headers.location).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} para ${url}`))
      }
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end',  () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

/** Parsea CSV simple — soporta , y ; como separador */
function parseCSV(text, separator = ',') {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(separator).map(h => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(separator)
    if (values.length !== headers.length) continue

    const row = {}
    headers.forEach((header, j) => {
      row[header] = values[j]?.trim() ?? ''
    })
    rows.push(row)
  }

  return rows
}

/** Convierte coordenadas UTM Zone 21S a lat/lng (sin proj4) */
function utmToLatLng(easting, northing) {
  // Parámetros UTM Zone 21S / WGS84
  const k0    = 0.9996
  const a     = 6378137.0
  const e2    = 0.00669437999014
  const e4    = e2 * e2
  const e6    = e4 * e2
  const e1    = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2))

  const x = easting  - 500000
  const y = northing - 10000000 // hemisferio sur

  const M  = y / k0
  const mu = M / (a * (1 - e2/4 - 3*e4/64 - 5*e6/256))

  const p1 = (3*e1/2  - 27*e1**3/32) * Math.sin(2*mu)
  const p2 = (21*e1**2/16 - 55*e1**4/32) * Math.sin(4*mu)
  const p3 = (151*e1**3/96) * Math.sin(6*mu)
  const p4 = (1097*e1**4/512) * Math.sin(8*mu)
  const phi1 = mu + p1 + p2 + p3 + p4

  const N1    = a / Math.sqrt(1 - e2 * Math.sin(phi1)**2)
  const T1    = Math.tan(phi1)**2
  const C1    = e2 / (1 - e2) * Math.cos(phi1)**2
  const R1    = a * (1 - e2) / (1 - e2 * Math.sin(phi1)**2)**1.5
  const D     = x / (N1 * k0)

  const lat = phi1 - (N1 * Math.tan(phi1) / R1) * (
    D**2/2 -
    (5 + 3*T1 + 10*C1 - 4*C1**2 - 9*e2/(1-e2)) * D**4/24 +
    (61 + 90*T1 + 298*C1 + 45*T1**2 - 252*e2/(1-e2) - 3*C1**2) * D**6/720
  )

  const lon0 = ((21 - 1) * 6 - 180 + 3) * Math.PI / 180 // Zone 21 central meridian
  const lng  = lon0 + (
    D -
    (1 + 2*T1 + C1) * D**3/6 +
    (5 - 2*C1 + 28*T1 - 3*C1**2 + 8*e2/(1-e2) + 24*T1**2) * D**5/120
  ) / Math.cos(phi1)

  return {
    lat: lat * 180 / Math.PI,
    lng: lng * 180 / Math.PI,
  }
}

// ── Sync contenedores ────────────────────────────────────────
async function syncContainers() {
  console.log('📥 Descargando contenedores de CKAN...')
  const buffer = await download(CKAN_CONTAINERS)
  const text   = buffer.toString('utf-8')
  const rows   = parseCSV(text)

  if (rows.length === 0) throw new Error('CSV de contenedores vacío')

  const containers = rows
    .map(row => ({
      dateData:        row['fecha_datos']          ?? '',
      circuitCode:     row['cod_recorrido']         ?? '',
      position:        parseInt(row['posicion'])    || 0,
      daysWithoutLift: parseInt(row['dias_sin_levantar']) || 0,
      long:            parseFloat(row['longitud'])  || 0,
      lat:             parseFloat(row['latitud'])   || 0,
    }))
    .filter(c => c.lat !== 0 && c.long !== 0 && c.circuitCode !== '')

  fs.writeFileSync(OUT_CONTAINERS, JSON.stringify(containers), 'utf-8')
  console.log(`✅ containers.json generado — ${containers.length} registros`)
  return containers.length
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  console.log('🔄 Iniciando sync de datos CKAN...')
  console.log(`📁 Directorio de salida: ${OUT_DIR}`)

  // Crear directorio si no existe
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  try {
    const nContainers = await syncContainers()
    console.log(`\n✅ Sync completado: ${nContainers} contenedores`)
  } catch (err) {
    console.error('❌ Error en sync:', err.message)
    process.exit(1)
  }
}

main()