import {THRESHOLDS,COLORS} from '../constants/index';
import type { ContainerStatus } from '../types';

export const getStatus = (daysWithoutLift: number): ContainerStatus => {
    if (daysWithoutLift <= THRESHOLDS.OK) {
        return 'ok';
    }
    if (daysWithoutLift <= THRESHOLDS.WARN) {
        return 'warn';
    }
    return 'crit';
};

export const getStatusColor = (daysWithoutLift: number): string => {
    switch (getStatus(daysWithoutLift)) {
        case 'ok':
            return COLORS.OK;
        case 'warn':
            return COLORS.WARN;
        case 'crit':
            return COLORS.CRIT;
    }
};

export const getPillLabel = (daysWithoutLift: number): string => {
  if (daysWithoutLift === 0) return 'Hoy'
  if (daysWithoutLift === 1) return 'Ayer'
  return `${daysWithoutLift} días`
}

export const getMunicipality = (circuitCode: string): string => {
  return circuitCode.split('_')[0].trim().toUpperCase()
}