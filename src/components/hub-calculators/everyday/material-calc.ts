import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialType: z.string().min(1), wastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '5' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '5' },
    { name: 'materialType', label: 'Material Type', type: 'select', options: [{ label: 'Tile (12×12 in)', value: 'tile' }, { label: 'Hardwood Planks', value: 'hardwood' }, { label: 'Laminate Planks', value: 'laminate' }, { label: 'Vinyl Sheets', value: 'vinyl' }, { label: 'Carpet (12 ft rolls)', value: 'carpet' }] },
    { name: 'wastePct', label: 'Waste Factor (%)', type: 'number', min: 0, max: 30, step: '5' },
  ],
  compute: (v) => {
    const area = v.length * v.width
    const materialFactors: Record<string, { coveragePerUnit: number; unitLabel: string }> = { tile: { coveragePerUnit: 1, unitLabel: 'tiles' }, hardwood: { coveragePerUnit: 2.25, unitLabel: 'sq ft per plank' }, laminate: { coveragePerUnit: 2, unitLabel: 'sq ft per plank' }, vinyl: { coveragePerUnit: 20, unitLabel: 'sq ft per roll' }, carpet: { coveragePerUnit: 12, unitLabel: 'linear ft per row' } }
    const mat = materialFactors[v.materialType as keyof typeof materialFactors] || materialFactors.tile
    const waste = area * (v.wastePct / 100)
    const totalNeeded = area + waste
    const units = v.materialType === 'carpet' ? Math.ceil(totalNeeded / 12) : Math.ceil(totalNeeded / mat.coveragePerUnit)
    return { result: totalNeeded, label: 'Total Material Needed', unit: 'sq ft', steps: [{ label: 'Area', value: `${area} sq ft` }, { label: 'Waste Allowance', value: `${waste.toFixed(1)} sq ft` }, { label: 'Total Needed', value: `${totalNeeded.toFixed(1)} sq ft` }, { label: `Units (${mat.unitLabel})`, value: `${units}` }] }
  },
  description: 'Calculate flooring material quantities including waste factor for tile, hardwood, laminate, vinyl, and carpet installations.',
  formula: 'Total = (L×W) × (1 + Waste%/100) | Units = Total / CoveragePerUnit',
  interpretation: 'Standard waste factors: 10% for tile/wood, 5% for carpet, 15% for diagonal patterns. Always buy extra for future repairs. Store unopened boxes for returns.'
}

export default calcDef
