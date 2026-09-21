import { useEffect, useState } from 'react'
import type { Container } from '../../types'
import { reverse } from '../../services/geocodingService'
import { getPillLabel, getStatusColor } from '../../utils/container'
import { URLS } from '../../constants'
import styles from './ContainerPopup.module.css'

interface ContainerPopupProps {
  container: Container
}

export function ContainerPopup({ container }: ContainerPopupProps) {
  const [address, setAddress]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState<string | null>(null)

  useEffect(() => {
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)
    setAddress('')

    reverse(container.lat, container.long)
      .then((result) => { if (active) setAddress(result) })
      .catch((err)   => { if (active) setError(err instanceof Error ? err.message : 'Error') })
      .finally(()    => { if (active) setLoading(false) })

    return () => { active = false }
  }, [container.lat, container.long])

  const dias   = container.daysWithoutLift
  const color  = getStatusColor(dias)
  const label  = getPillLabel(dias)

  const wppText = encodeURIComponent(
    `Reporte contenedor ${container.circuitCode} · ${label} · maps.google.com/?q=${container.lat},${container.long}`
  )

  return (
    <div className={styles.popup}>
      <div className={styles.head}>
        <span className={styles.circuit}>
          Mun. {container.circuitCode.split('_')[0]} · {container.circuitCode}
        </span>
        <span className={styles.pill} style={{ background: `${color}22`, color }}>
          {label}
        </span>
      </div>

      <div className={styles.diasBox} style={{ background: `${color}15` }}>
        <span className={styles.diasNum} style={{ color }}>{dias}</span>
        <span className={styles.diasLabel}>días sin<br />levantar</span>
      </div>

      <div className={styles.row}>
        <strong>Dirección:</strong>{' '}
        {loading
          ? <span className={styles.addrLoading}>Buscando...</span>
          : error ? 'No disponible'
          : address || 'No disponible'}
      </div>

      <div className={styles.row}>
        <strong>Datos al:</strong> {container.dateData}
      </div>

      <a
        className={styles.wppBtn}
        href={`${URLS.WHATSAPP}?text=${wppText}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        📢 Reportar → 092 250 260
      </a>
    </div>
  )
}