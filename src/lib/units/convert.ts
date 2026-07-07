import { allUnits, type Dimension, type UnitDef } from './definitions'

export function getUnits(dimension: Dimension): UnitDef[] {
  return allUnits[dimension]
}

export function findUnit(id: string): UnitDef | undefined {
  for (const dim of Object.keys(allUnits) as Dimension[]) {
    const unit = allUnits[dim].find(u => u.id === id)
    if (unit) return unit
  }
  return undefined
}

export function toBaseUnit(value: number, unitId: string): number {
  const unit = findUnit(unitId)
  if (!unit) return value
  const offset = unit.offset ?? 0
  return (value + offset) * unit.baseFactor
}

export function fromBaseUnit(value: number, unitId: string): number {
  const unit = findUnit(unitId)
  if (!unit) return value
  const offset = unit.offset ?? 0
  return value / unit.baseFactor - offset
}

export function convert(value: number, fromUnit: string, toUnit: string): number {
  const base = toBaseUnit(value, fromUnit)
  return fromBaseUnit(base, toUnit)
}

export function formatWithUnit(value: number, unitId: string, decimals: number = 2): string {
  const unit = findUnit(unitId)
  return `${value.toFixed(decimals)}${unit ? ' ' + unit.label : ''}`
}

const siPrefixes = [
  { prefix: 'T', factor: 1e12 },
  { prefix: 'G', factor: 1e9 },
  { prefix: 'M', factor: 1e6 },
  { prefix: 'k', factor: 1e3 },
  { prefix: 'm', factor: 1e-3 },
  { prefix: 'μ', factor: 1e-6 },
  { prefix: 'n', factor: 1e-9 },
]

export function autoScale(value: number, baseUnitId: string): { value: number; unitId: string; label: string } {
  const unit = findUnit(baseUnitId)
  if (!unit) return { value, unitId: baseUnitId, label: baseUnitId }

  const abs = Math.abs(value)
  for (const { prefix, factor } of siPrefixes) {
    if (abs >= factor && abs < factor * 1000) {
      const scaled = value / factor
      return { value: scaled, unitId: prefix + baseUnitId, label: `${prefix}${unit.label}` }
    }
  }
  return { value, unitId: baseUnitId, label: unit.label }
}
