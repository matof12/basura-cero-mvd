import { useMemo } from 'react'
import type { Container, DashboardStats, MunicipalityStats } from '../types'
import { getStatus, getMunicipality } from '../utils/container'

export function useDashboard(containers: Container[]): DashboardStats {
  return useMemo(() => {
    const stats: DashboardStats = {
      total: 0,
      ok: 0,
      warn: 0,
      crit: 0,
      byMunicipality: [],
      worst: null,
    }

    if (containers.length === 0) {
      return stats
    }

    const municipalityMap = new Map<string, MunicipalityStats>()
    let worstContainer: Container | null = null

    for (const container of containers) {
      const status = getStatus(container.daysWithoutLift)
      const municipality = getMunicipality(container.circuitCode)

      stats.total += 1
      stats[status] += 1

      const existing = municipalityMap.get(municipality)
      const municipalityStats: MunicipalityStats = existing ?? {
        name: municipality,
        total: 0,
        ok: 0,
        warn: 0,
        crit: 0,
      }

      municipalityStats.total += 1
      municipalityStats[status] += 1
      municipalityMap.set(municipality, municipalityStats)

      if (
        worstContainer === null ||
        container.daysWithoutLift > worstContainer.daysWithoutLift
      ) {
        worstContainer = container
      }
    }

    stats.byMunicipality = Array.from(municipalityMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    )
    stats.worst = worstContainer

    return stats
  }, [containers])
}
