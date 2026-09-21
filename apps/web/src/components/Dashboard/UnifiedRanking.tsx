import { Fragment, useMemo, useState } from 'react'
import type { MunicipalityStats } from '../../types'
import styles from './UnifiedRanking.module.css'

interface GlobalStats {
  ok: number
  warn: number
  crit: number
  total: number
}

interface UnifiedRankingProps {
  municipalities: MunicipalityStats[]
  activeFilter: string
  onFilterChange: (muni: string) => void
  globalStats: GlobalStats
  onViewInMap: (municipio: string) => void
}

type SortMode = 'pct' | 'crit' | 'total'

const SORT_BUTTONS: Array<{ mode: SortMode; label: string }> = [
  { mode: 'pct', label: '% cumplimiento' },
  { mode: 'crit', label: 'Más críticos' },
  { mode: 'total', label: 'Total' },
]

const MEDAL_COLORS = ['#f59e0b', '#94a3b8', '#cd7f32']

export function UnifiedRanking({
  municipalities,
  activeFilter,
  onFilterChange,
  globalStats,
  onViewInMap,
}: UnifiedRankingProps) {
  const [sortMode, setSortMode] = useState<SortMode>('pct')
  const [expandedMunicipio, setExpandedMunicipio] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return [...municipalities].sort((a, b) => {
      if (sortMode === 'pct') return (b.ok / b.total) - (a.ok / a.total)
      if (sortMode === 'crit') return b.crit - a.crit
      return b.total - a.total
    })
  }, [municipalities, sortMode])

  return (
    <div className={styles.root}>
      <div className={styles.sortControls}>
        <span className={styles.sortLabel}>Ordenar por:</span>
        {SORT_BUTTONS.map(({ mode, label }) => (
          <button
            key={mode}
            type="button"
            className={`${styles.sortBtn} ${sortMode === mode ? styles.sortBtnActive : ''}`}
            onClick={() => setSortMode(mode)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Municipio</th>
              <th className={styles.right}>Total</th>
              <th className={styles.right} style={{ color: '#1a7a4a' }}>Al día</th>
              <th className={styles.right} style={{ color: '#d97706' }}>Atención</th>
              <th className={styles.right} style={{ color: '#dc2626' }}>Crítico</th>
              <th>Estado</th>
              <th className={styles.right}>Cumplimiento</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => {
              const total = item.total || 0
              const pct = total > 0 ? (item.ok / total) * 100 : 0
              const warnPct = total > 0 ? (item.warn / total) * 100 : 0
              const critPct = total > 0 ? (item.crit / total) * 100 : 0
              const okPct = total > 0 ? (item.ok / total) * 100 : 0
              const badgeClass = pct >= 80 ? styles.pctGood : pct >= 60 ? styles.pctMid : styles.pctBad
              const isActive = activeFilter === item.name
              const isExpanded = expandedMunicipio === item.name

              const globalOk = globalStats.total > 0 ? (globalStats.ok / globalStats.total) * 100 : 0
              const globalWarn = globalStats.total > 0 ? (globalStats.warn / globalStats.total) * 100 : 0
              const globalCrit = globalStats.total > 0 ? (globalStats.crit / globalStats.total) * 100 : 0

              const statusText = pct >= 80
                ? '✅ Por encima del promedio'
                : pct >= 60
                  ? '⚠️ Cerca del promedio'
                  : '🚨 Por debajo del promedio'

              return (
                <Fragment key={item.name}>
                  <tr
                    className={`${styles.tr} ${isActive ? styles.trActive : ''}`}
                    onClick={() => setExpandedMunicipio(isExpanded ? null : item.name)}
                  >
                    <td>
                      <div className={styles.medalCell}>
                        <div
                          className={styles.medal}
                          style={{ background: MEDAL_COLORS[i] ?? '#7a8c7a' }}
                        >
                          {i + 1}
                        </div>
                        <span className={styles.muniName}>Municipio {item.name}</span>
                      </div>
                    </td>
                    <td className={`${styles.numCell} ${styles.numTotal}`}>
                      {total.toLocaleString('es-UY')}
                    </td>
                    <td className={`${styles.numCell} ${styles.numOk}`}>
                      {item.ok.toLocaleString('es-UY')}
                    </td>
                    <td className={`${styles.numCell} ${styles.numWarn}`}>
                      {item.warn.toLocaleString('es-UY')}
                    </td>
                    <td className={`${styles.numCell} ${styles.numCrit}`}>
                      {item.crit.toLocaleString('es-UY')}
                    </td>
                    <td>
                      <div className={styles.stateBarTrack}>
                        <div
                          className={styles.stateBarSeg}
                          style={{ width: `${okPct}%`, background: '#1a7a4a' }}
                        />
                        <div
                          className={styles.stateBarSeg}
                          style={{ width: `${warnPct}%`, background: '#d97706' }}
                        />
                        <div
                          className={styles.stateBarSeg}
                          style={{ width: `${critPct}%`, background: '#dc2626' }}
                        />
                      </div>
                    </td>
                    <td className={styles.pctCell}>
                      <span className={`${styles.pctBadge} ${badgeClass}`}>
                        {pct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>

                  <tr className={styles.expandRow}>
                    <td colSpan={7} className={styles.expandCell}>
                      <div className={`${styles.detailPanel} ${isExpanded ? styles.detailPanelOpen : ''}`}>
                        <div className={styles.detailHeader}>Detalle — Municipio {item.name}</div>

                        <div className={styles.detailGrid}>
                          <div className={styles.detailMetric} style={{ background: 'rgba(26, 122, 74, 0.08)', borderColor: 'rgba(26, 122, 74, 0.25)' }}>
                            <span className={styles.metricLabel}>Al día</span>
                            <strong>{okPct.toFixed(1)}% (promedio global: {globalOk.toFixed(1)}%)</strong>
                          </div>

                          <div className={styles.detailMetric} style={{ background: 'rgba(217, 119, 6, 0.08)', borderColor: 'rgba(217, 119, 6, 0.25)' }}>
                            <span className={styles.metricLabel}>Atención</span>
                            <strong>{warnPct.toFixed(1)}% (promedio global: {globalWarn.toFixed(1)}%)</strong>
                          </div>

                          <div className={styles.detailMetric} style={{ background: 'rgba(220, 38, 38, 0.08)', borderColor: 'rgba(220, 38, 38, 0.25)' }}>
                            <span className={styles.metricLabel}>Crítico</span>
                            <strong>{critPct.toFixed(1)}% (promedio global: {globalCrit.toFixed(1)}%)</strong>
                          </div>
                        </div>

                        <div className={styles.detailFooter}>
                          <span className={styles.detailSummary}>{statusText}</span>
                          <button
                            type="button"
                            className={styles.detailButton}
                            onClick={(event) => {
                              event.stopPropagation()
                              onFilterChange(item.name)
                              onViewInMap(item.name)
                            }}
                          >
                            Ver en el mapa →
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}