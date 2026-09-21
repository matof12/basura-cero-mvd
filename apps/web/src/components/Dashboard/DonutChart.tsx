// src/components/Dashboard/DonutChart.tsx
import styles from './DonutChart.module.css'

interface DonutChartProps {
  ok: number
  warn: number
  crit: number
}

export function DonutChart({ ok, warn, crit }: DonutChartProps) {
  const total = Math.max(ok + warn + crit, 1)
  const pOk   = ok   / total
  const pWarn = warn / total
  const pCrit = crit / total

  const r    = 55
  const cx   = 75
  const cy   = 75
  const sw   = 22
  const circ = 2 * Math.PI * r

  const dOk   = circ * pOk
  const dWarn = circ * pWarn
  const dCrit = circ * pCrit

  // Offset negativo → desplaza en sentido horario
  const offOk   = 0
  const offWarn = -(dOk)
  const offCrit = -(dOk + dWarn)

  const okPct = Math.round(pOk * 100)

  return (
    <div className={styles.wrap}>
      <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7e5" strokeWidth={sw} />
        {/* OK */}
        {dOk > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a7a4a" strokeWidth={sw}
            strokeDasharray={`${dOk.toFixed(1)} ${(circ - dOk).toFixed(1)}`}
            strokeDashoffset={offOk}
            transform={`rotate(-90 ${cx} ${cy})`} />
        )}
        {/* WARN */}
        {dWarn > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#d97706" strokeWidth={sw}
            strokeDasharray={`${dWarn.toFixed(1)} ${(circ - dWarn).toFixed(1)}`}
            strokeDashoffset={offWarn.toFixed(1)}
            transform={`rotate(-90 ${cx} ${cy})`} />
        )}
        {/* CRIT */}
        {dCrit > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#dc2626" strokeWidth={sw}
            strokeDasharray={`${dCrit.toFixed(1)} ${(circ - dCrit).toFixed(1)}`}
            strokeDashoffset={offCrit.toFixed(1)}
            transform={`rotate(-90 ${cx} ${cy})`} />
        )}
        <text x={cx} y={cy - 5} textAnchor="middle"
          fontFamily="DM Mono, monospace" fontSize="18" fontWeight="700" fill="#0f1a0f">
          {okPct}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle"
          fontFamily="DM Sans, sans-serif" fontSize="9" fill="#7a8c7a">
          al día
        </text>
      </svg>

      <div className={styles.legend}>
        <div className={styles.legendRow}>
          <div className={styles.dot} style={{ background: '#1a7a4a' }} />
          <span className={styles.legendLabel}>Al día (0-1d)</span>
          <span className={styles.legendVal}>{Math.round(pOk * 100)}%</span>
        </div>
        <div className={styles.legendRow}>
          <div className={styles.dot} style={{ background: '#d97706' }} />
          <span className={styles.legendLabel}>Atención (2d)</span>
          <span className={styles.legendVal}>{Math.round(pWarn * 100)}%</span>
        </div>
        <div className={styles.legendRow}>
          <div className={styles.dot} style={{ background: '#dc2626' }} />
          <span className={styles.legendLabel}>Crítico (3+d)</span>
          <span className={styles.legendVal}>{Math.round(pCrit * 100)}%</span>
        </div>
      </div>
    </div>
  )
}