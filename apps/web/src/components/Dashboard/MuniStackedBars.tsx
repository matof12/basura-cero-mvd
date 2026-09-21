// src/components/Dashboard/MuniStackedBars.tsx
import type { MunicipalityStats } from '../../types'
import styles from './MuniStackedBars.module.css'

interface MuniStackedBarsProps {
  municipalities: MunicipalityStats[]
  activeFilter: string
  onFilterChange: (muni: string) => void
}

export function MuniStackedBars({ municipalities, activeFilter, onFilterChange }: MuniStackedBarsProps) {
  return (
    <div>
      {municipalities.map((item) => {
        const t      = Math.max(item.total, 1)
        const pOk   = (item.ok   / t * 100).toFixed(1)
        const pWarn = (item.warn / t * 100).toFixed(1)
        const pCrit = (item.crit / t * 100).toFixed(1)
        const isActive = activeFilter === item.name

        return (
          <button
            key={item.name}
            type="button"
            className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
            onClick={() => onFilterChange(isActive ? 'Todos' : item.name)}
            title={isActive ? 'Click para quitar filtro' : 'Click para filtrar'}
          >
            <span className={styles.label}>Mun. {item.name}</span>
            <div className={styles.track}>
              {item.ok > 0 && (
                <div className={`${styles.seg} ${styles.segOk}`} style={{ width: `${pOk}%` }}>
                  {Number(pOk) > 12 && <span>{Math.round(Number(pOk))}%</span>}
                </div>
              )}
              {item.warn > 0 && (
                <div className={`${styles.seg} ${styles.segWarn}`} style={{ width: `${pWarn}%` }}>
                  {Number(pWarn) > 12 && <span>{Math.round(Number(pWarn))}%</span>}
                </div>
              )}
              {item.crit > 0 && (
                <div className={`${styles.seg} ${styles.segCrit}`} style={{ width: `${pCrit}%` }}>
                  {Number(pCrit) > 12 && <span>{Math.round(Number(pCrit))}%</span>}
                </div>
              )}
            </div>
            <span className={styles.total}>{item.total.toLocaleString('es-UY')}</span>
          </button>
        )
      })}

      <div className={styles.legendRow}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#1a7a4a' }} />
          Al día
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#d97706' }} />
          Atención
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: '#dc2626' }} />
          Crítico
        </span>
      </div>
    </div>
  )
}