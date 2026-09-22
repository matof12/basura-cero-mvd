import { describe, it, expect } from 'vitest'
import { haversine, formatDist } from '../../../utils/geoUtils'

describe('haversine', () => {
  it('retorna 0 para el mismo punto', () => {
    expect(haversine(-34.9011, -56.1645, -34.9011, -56.1645)).toBe(0)
  })

  it('retorna distancia positiva para puntos distintos', () => {
    const dist = haversine(-34.9011, -56.1645, -34.9055, -56.1915)
    expect(dist).toBeGreaterThan(0)
  })

  it('calcula distancia aproximada entre dos puntos de Montevideo', () => {
    // Distancia entre centro y Pocitos (~3km)
    const dist = haversine(-34.9011, -56.1645, -34.9073, -56.1442)
    expect(dist).toBeGreaterThan(1500)
    expect(dist).toBeLessThan(3000)
  })
})

describe('formatDist', () => {
  it('muestra metros para distancias menores a 1km', () => {
    expect(formatDist(450)).toBe('450 m')
    expect(formatDist(999)).toBe('999 m')
  })

  it('muestra km para distancias mayores a 1km', () => {
    expect(formatDist(1000)).toBe('1.0 km')
    expect(formatDist(2340)).toBe('2.3 km')
  })

  it('redondea metros correctamente', () => {
    expect(formatDist(450.7)).toBe('451 m')
  })
})