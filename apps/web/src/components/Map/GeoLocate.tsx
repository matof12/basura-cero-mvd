import { useState } from 'react'
import styles from './GeoLocate.module.css'

interface GeoLocateProps {
  onLocate: (lat: number, lng: number) => void
  onClear?: () => void
}

export function GeoLocate({ onLocate, onClear }: GeoLocateProps) {
  const [loading, setLoading] = useState(false)
  const [located, setLocated] = useState(false)

  const handleLocate = () => {
    if (located) {
      setLocated(false)
      onClear?.()
      return
    }

    if (!navigator.geolocation) {
      alert('Geolocalización no disponible en este navegador.')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false)
        setLocated(true)
        onLocate(position.coords.latitude, position.coords.longitude)
      },
      () => {
        setLoading(false)
        alert('No se pudo obtener la ubicación. Verificá los permisos.')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  return (
    <button
      className={`${styles.btn} ${located ? styles.btnLocated : ''}`}
      onClick={handleLocate}
      disabled={loading}
      type="button"
    >
      {loading ? 'Buscando...' : located ? '📍 Quitar ubicación' : '📍 Mostrar mi ubicación'}
    </button>
  )
}