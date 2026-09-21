import styles from './NearestPanel.module.css'
import type { Container } from '../../types'
import { getStatusColor, getPillLabel } from '../../utils/container'

interface NearestItem extends Container {
  distLabel: string
}

interface NearestPanelProps {
  items: NearestItem[]
  onFlyTo?: (lat: number, lng: number) => void
}


export function NearestPanel({ items, onFlyTo }: NearestPanelProps) {
  if (items.length === 0) return null

  return (
    <div className={styles.panel}>
      <p className={styles.title}>📍 Los 3 más cercanos</p>
      {items.map((item, index) => {
        const color = getStatusColor(item.daysWithoutLift)
        return (
          <button
            key={`${item.circuitCode}-${index}`}
            className={styles.item}
            onClick={() => onFlyTo?.(item.lat, item.long)}
            type="button"
          >
            <span className={styles.rank}
              style={{ background: ['#f59e0b','#94a3b8','#cd7f32'][index] }}>
              {index + 1}
            </span>
            <div className={styles.info}>
              <span className={styles.circuit}>{item.circuitCode}</span>
              <span className={styles.dist}>{item.distLabel}</span>
            </div>
            <span className={styles.dias} style={{ color }}>
              {getPillLabel(item.daysWithoutLift)}
            </span>
          </button>
        )
      })}
    </div>
  )
}