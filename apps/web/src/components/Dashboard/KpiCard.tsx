// src/components/Dashboard/KpiCard.tsx
import styles from './KpiCard.module.css'

interface KpiCardProps {
  icon: string
  value: number
  label: string
  color: string
}

export function KpiCard({ icon, value, label, color }: KpiCardProps) {
  const iconStyle = {
    backgroundColor: `${color}1A`,
    border: `1px solid ${color}33`,
  }

  return (
    <div className={`${styles.card} ${styles.visible}`}>
      <div className={styles.icon} style={iconStyle}>
        {icon}
      </div>
      <div>
        <div className={styles.value} style={{ color }}>
          {value.toLocaleString('es-UY')}
        </div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  )
}