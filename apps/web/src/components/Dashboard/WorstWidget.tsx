// src/components/Dashboard/WorstWidget.tsx
import { useEffect, useState } from 'react'
import type { Container } from '../../types'
import { reverse } from '../../services/geocodingService'
import styles from './WorstWidget.module.css'

interface WorstWidgetProps {
  count: number
  worstContainer: Container | null
}

export function WorstWidget({ count, worstContainer }: WorstWidgetProps) {
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!worstContainer) return
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setAddress('')

    reverse(worstContainer.lat, worstContainer.long)
      .then((result) => { if (active) setAddress(result) })
      .catch(()      => { if (active) setAddress('Dirección no disponible') })
      .finally(()    => { if (active) setLoading(false) })

    return () => { active = false }
  }, [worstContainer])

  if (!worstContainer) return null

  const dias = worstContainer.daysWithoutLift

  return (
    <div className={styles.widget}>
      <div className={styles.left}>
        <span className={styles.icon}>🚨</span>
        <div>
          <div className={styles.label}>
            Contenedores con 3+ días sin recolección
          </div>
          <div className={styles.count}>{count.toLocaleString('es-UY')}</div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.label}>El más crítico hoy</div>
        <div className={styles.circuit}>
          {loading ? 'Buscando dirección...' : address}
        </div>
        <div className={styles.days}>
          {dias} días sin recolección · Mun. {worstContainer.circuitCode.split('_')[0]}
        </div>
      </div>
    </div>
  )
}