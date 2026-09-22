import { describe, it, expect } from 'vitest'
import { getStatus, getStatusColor, getPillLabel, getMunicipality } from '../../../utils/container'
describe('getStatus', () => {
  it('retorna ok para 0 días', () => {
    expect(getStatus(0)).toBe('ok')
  })
  it('retorna ok para 1 día', () => {
    expect(getStatus(1)).toBe('ok')
  })
  it('retorna warn para 2 días', () => {
    expect(getStatus(2)).toBe('warn')
  })
  it('retorna crit para 3 días', () => {
    expect(getStatus(3)).toBe('crit')
  })
  it('retorna crit para 116 días', () => {
    expect(getStatus(116)).toBe('crit')
  })
})

describe('getStatusColor', () => {
  it('retorna verde para ok', () => {
    expect(getStatusColor(0)).toBe('#1a7a4a')
  })
  it('retorna amarillo para warn', () => {
    expect(getStatusColor(2)).toBe('#d97706')
  })
  it('retorna rojo para crit', () => {
    expect(getStatusColor(3)).toBe('#dc2626')
  })
})

describe('getPillLabel', () => {
  it('retorna Hoy para 0 días', () => {
    expect(getPillLabel(0)).toBe('Hoy')
  })
  it('retorna Ayer para 1 día', () => {
    expect(getPillLabel(1)).toBe('Ayer')
  })
  it('retorna X días para más de 1', () => {
    expect(getPillLabel(5)).toBe('5 días')
    expect(getPillLabel(116)).toBe('116 días')
  })
})

describe('getMunicipality', () => {
  it('extrae municipio simple', () => {
    expect(getMunicipality('A_DU_RM_CL_104')).toBe('A')
  })
  it('extrae municipio CH correctamente', () => {
    expect(getMunicipality('CH_DU_RM_CL_201')).toBe('CH')
  })
  it('funciona con todos los municipios', () => {
    expect(getMunicipality('B_DU_RM_CL_001')).toBe('B')
    expect(getMunicipality('G_DU_RM_CL_116')).toBe('G')
  })
})