import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), materialType: z.string().min(1), wastePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { length: '20', width: '15', materialType: 'hardwood', wastePct: '10' },
  presets: [
    { label: 'Tile Kitchen Floor', values: { length: '12', width: '10', materialType: 'tile', wastePct: '15' } },
    { label: 'Hardwood Living Room', values: { length: '25', width: '18', materialType: 'hardwood', wastePct: '10' } },
    { label: 'Carpet Bedroom', values: { length: '14', width: '12', materialType: 'carpet', wastePct: '5' } },
    { label: 'Vinyl Bathroom', values: { length: '8', width: '5', materialType: 'vinyl', wastePct: '10' } },
  ],
  fields: [
    { name: 'length', label: 'Length (ft)', type: 'number', min: 1, step: '5' },
    { name: 'width', label: 'Width (ft)', type: 'number', min: 1, step: '5' },
    { name: 'materialType', label: 'Material Type', type: 'select', options: [{ label: 'Tile (12×12 in)', value: 'tile' }, { label: 'Hardwood Planks', value: 'hardwood' }, { label: 'Laminate Planks', value: 'laminate' }, { label: 'Vinyl Sheets', value: 'vinyl' }, { label: 'Carpet (12 ft rolls)', value: 'carpet' }] },
    { name: 'wastePct', label: 'Waste Factor (%)', type: 'number', min: 0, max: 30, step: '5' },
  ],
  compute: (v) => {
    const L = parseFloat(v.length)
    const W = parseFloat(v.width)
    const area = L * W
    const materialFactors: Record<string, { coveragePerUnit: number; unitLabel: string }> = { tile: { coveragePerUnit: 1, unitLabel: 'tiles' }, hardwood: { coveragePerUnit: 2.25, unitLabel: 'sq ft per plank' }, laminate: { coveragePerUnit: 2, unitLabel: 'sq ft per plank' }, vinyl: { coveragePerUnit: 20, unitLabel: 'sq ft per roll' }, carpet: { coveragePerUnit: 12, unitLabel: 'linear ft per row' } }
    const mat = materialFactors[v.materialType as keyof typeof materialFactors] || materialFactors.tile
    const waste = area * (v.wastePct / 100)
    const totalNeeded = area + waste
    const units = v.materialType === 'carpet' ? Math.ceil(totalNeeded / 12) : Math.ceil(totalNeeded / mat.coveragePerUnit)
    return { result: totalNeeded, label: 'Total Material Needed', unit: 'sq ft', steps: [
      { label: '1. Room Area', value: `${L} × ${W} = ${area} sq ft (L × W = floor area)` },
      { label: '2. Waste Addition', value: `${area} × ${v.wastePct}% = ${waste.toFixed(1)} sq ft (waste buffer)` },
      { label: '3. Total Needed', value: `${area} + ${waste.toFixed(1)} = ${totalNeeded.toFixed(1)} sq ft (area + waste)` },
      { label: `4. Cover per Unit`, value: `${mat.coveragePerUnit} ${mat.unitLabel} per unit` },
      { label: '5. Units Required', value: `ceil(${totalNeeded.toFixed(1)} / ${mat.coveragePerUnit}) = ${units} units` },
    ],
    extras: [
      { label: 'Tile Spacing', value: '12×12 in tiles cover 1 sq ft each. Add 1/8 in grout lines — they take up negligible space but affect layout.' },
      { label: 'Hardwood Direction', value: 'Planks laid parallel to longest wall look best and reduce waste by 2-5%. Diagonal patterns increase waste to 15%.' },
      { label: 'Carpet Seams', value: 'Standard carpet comes in 12 ft wide rolls. Rooms wider than 12 ft need seams — place them in low-traffic areas.' },
      { label: 'Buy Extra', value: 'Store 5-10% extra material for future repairs. Tile and hardwood can be discontinued — matching later is nearly impossible.' },
      { label: 'Return Policy', value: 'Most home centers accept unopened box returns within 90 days. Keep receipts and note batch/lot numbers.' },
      { label: 'Vinyl Layout', value: 'Vinyl sheets come in 6, 12, and 13.2 ft widths. Seamless installation requires matching room width to roll width.' },
      { label: 'Laminate Click-Lock', value: 'Laminate planks (4-7 ft long, 5-8 in wide) use click-lock systems. No glue needed, but need 1/4 in expansion gap around walls.' },
      { label: 'Subfloor Prep', value: 'All flooring needs a clean, level subfloor (±3/16 in over 10 ft). Patching costs $0.50-2/sq ft extra.' },
    ]}
  },
  description: 'Calculate exact flooring material quantities for tile, hardwood, laminate, vinyl, and carpet. Includes waste factor, coverage per unit, and seam planning.',
  formula: 'Total sq ft = (L × W) × (1 + Waste%/100). Units = ceil(Total / CoveragePerUnit). Carpet rows = ceil(Total / 12).',
  interpretation: 'Standard waste factors: 10% for wood/tile, 5% for carpet, 15% for diagonal/herringbone patterns. Always buy extra for future matching — discontinued products are common. Store unopened boxes flat in a climate-controlled area.'
}

export default calcDef
