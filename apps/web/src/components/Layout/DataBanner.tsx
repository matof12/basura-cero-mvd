import styles from './DataBanner.module.css'

interface DataBannerProps {
  isRealData: boolean
  lastUpdate: string
}

export function DataBanner({ isRealData, lastUpdate }: DataBannerProps) {

  return (
    <div
      className={`${styles.banner} ${isRealData ? styles.bannerReal : styles.bannerMock}`}
      role="status"
      aria-live="polite"
    >
      <span>
        {isRealData
          ? '✅ Datos en tiempo real'
          : '⚠️ No se pudieron cargar los datos reales'}
      </span>
      {lastUpdate && (
        <div className={styles.metaGroup}>
          <span className={styles.time}>
            Actualizado: {lastUpdate}
          </span>
        </div>
      )}
    </div>
  )
} 