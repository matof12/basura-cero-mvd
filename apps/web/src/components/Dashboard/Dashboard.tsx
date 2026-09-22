// src/components/Dashboard/Dashboard.tsx
import { useState } from 'react'
import type { Container } from '../../types'
import { useDashboard } from '../../hooks/useDashboard'
import { getMunicipality } from '../../utils/container'
import { WorstWidget } from './WorstWidget'
import { KpiCard } from './KpiCard'
import { UnifiedRanking } from './UnifiedRanking'
import styles from './Dashboard.module.css'

interface DashboardProps {
  containers: Container[]
  loading: boolean
  onViewInMap?: (municipio: string) => void
}

export function Dashboard({ containers, loading, onViewInMap }: DashboardProps) {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filteredContainers = activeFilter === 'Todos'
    ? containers
    : containers.filter((container) => getMunicipality(container.circuitCode) === activeFilter)

  const stats = useDashboard(filteredContainers)

  const handleFilterChange = (muni: string) => {
    setActiveFilter(muni)
  }

  const handleViewInMap = (municipio: string) => {
    setActiveFilter(municipio)
    onViewInMap?.(municipio)
  }

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.hero}>
          <p className={styles.heroSub}>Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>Montevideo en tiempo real</h2>
        <p className={styles.heroSub}>
          Estado de recolección de contenedores domiciliarios
        </p>
      </div>

      <WorstWidget
        count={stats.crit}
        worstContainer={stats.worst}
      />

      <div className={styles.kpiRow}>
        <KpiCard icon="🗑️" value={stats.total} label="Contenedores totales" color="#0f1a0f" />
        <KpiCard icon="✅" value={stats.ok} label="Normal (0-1 día sin levantar)" color="#1a7a4a" />
        <KpiCard icon="⚠️" value={stats.warn} label="Atención (2 días sin levantar)" color="#d97706" />
        <KpiCard icon="🚨" value={stats.crit} label="Crítico (3+ días sin levantar)" color="#dc2626" />
      </div>

      <UnifiedRanking
        municipalities={stats.byMunicipality}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        globalStats={{ ok: stats.ok, warn: stats.warn, crit: stats.crit, total: stats.total }}
        onViewInMap={handleViewInMap}
      />
    </div>
  )
}