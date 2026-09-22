import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDashboard } from '../../../hooks/useDashboard'
import type { Container } from '../../../types'

const mockContainers: Container[] = [
  { circuitCode: 'A_DU_RM_CL_001', daysWithoutLift: 0, lat: -34.9, long: -56.1, position: 1, dateData: '2026-09-22' },
  { circuitCode: 'A_DU_RM_CL_001', daysWithoutLift: 1, lat: -34.9, long: -56.1, position: 2, dateData: '2026-09-22' },
  { circuitCode: 'B_DU_RM_CL_001', daysWithoutLift: 2, lat: -34.9, long: -56.1, position: 1, dateData: '2026-09-22' },
  { circuitCode: 'B_DU_RM_CL_001', daysWithoutLift: 5, lat: -34.9, long: -56.1, position: 2, dateData: '2026-09-22' },
  { circuitCode: 'CH_DU_RM_CL_001', daysWithoutLift: 3, lat: -34.9, long: -56.1, position: 1, dateData: '2026-09-22' },
]

describe('useDashboard', () => {
  it('calcula el total correctamente', () => {
    const { result } = renderHook(() => useDashboard(mockContainers))
    expect(result.current.total).toBe(5)
  })

  it('ok + warn + crit === total', () => {
    const { result } = renderHook(() => useDashboard(mockContainers))
    const { ok, warn, crit, total } = result.current
    expect(ok + warn + crit).toBe(total)
  })

  it('clasifica correctamente los estados', () => {
    const { result } = renderHook(() => useDashboard(mockContainers))
    expect(result.current.ok).toBe(2)   // 0 y 1 días
    expect(result.current.warn).toBe(1)  // 2 días
    expect(result.current.crit).toBe(2)  // 3 y 5 días
  })

  it('el worst es el de mayor daysWithoutLift', () => {
    const { result } = renderHook(() => useDashboard(mockContainers))
    expect(result.current.worst?.daysWithoutLift).toBe(5)
  })

  it('byMunicipality tiene los 3 municipios', () => {
    const { result } = renderHook(() => useDashboard(mockContainers))
    expect(result.current.byMunicipality).toHaveLength(3)
  })

  it('la suma de byMunicipality es igual al total', () => {
    const { result } = renderHook(() => useDashboard(mockContainers))
    const suma = result.current.byMunicipality.reduce((acc, m) => acc + m.total, 0)
    expect(suma).toBe(result.current.total)
  })

  it('retorna stats vacías para array vacío', () => {
    const { result } = renderHook(() => useDashboard([]))
    expect(result.current.total).toBe(0)
    expect(result.current.worst).toBeNull()
    expect(result.current.byMunicipality).toHaveLength(0)
  })
})