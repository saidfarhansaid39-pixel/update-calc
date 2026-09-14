import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ wallLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wallHeight: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hasCeiling: z.string().optional(), costPerSheet: z.string().optional() }),
  fields: [
    { name: 'wallLength', label: 'Wall Length (ft)', type: 'number', min: 1, step: '5' },
    { name: 'wallHeight', label: 'Wall Height (ft)', type: 'number', min: 4, step: '1' },
    { name: 'hasCeiling', label: 'Includes Ceiling?', type: 'select', options: [{ label: 'Walls Only', value: 'no' }, { label: 'Walls + Ceiling', value: 'yes' }] },
    { name: 'costPerSheet', label: 'Cost per Sheet ($)', type: 'number', min: 0, step: '5' },
  ],
  compute: (v) => {
    const wallArea = v.wallLength * v.wallHeight
    const ceilingFactor = v.hasCeiling === 'yes' ? 1.5 : 1
    const totalArea = wallArea * ceilingFactor
    const sheet4x8 = 32
    const sheet4x12 = 48
    const sheets4x8 = Math.ceil(totalArea * 1.1 / sheet4x8)
    const sheets4x12 = Math.ceil(totalArea * 1.1 / sheet4x12)
    const compoundBuckets = Math.ceil(sheets4x8 / 4)
    const tapeRolls = Math.ceil(sheets4x8 / 4)
    const screwsLbs = Math.ceil(sheets4x8 / 4)
    const cost = v.costPerSheet ? sheets4x8 * v.costPerSheet : null
    return { result: sheets4x8, label: 'Drywall Sheets Needed (4x8)', unit: 'sheets', steps: [{ label: 'Total Area', value: `${totalArea.toFixed(1)} sq ft` }, { label: '4x8 Sheets', value: `${sheets4x8} sheets (32 sq ft each)` }, { label: '4x12 Sheets', value: `${sheets4x12} sheets (48 sq ft each)` }, { label: 'Joint Compound', value: `${compoundBuckets} bucket(s) (1 per 4 sheets)` }, { label: 'Tape Rolls', value: `${tapeRolls} roll(s)` }, { label: 'Screws', value: `${screwsLbs} lb (1 lb per 4 sheets)` }, ...(cost !== null ? [{ label: 'Total Cost', value: `$${cost.toFixed(2)}` }] : [])], extras: [
      { label: '4x12 Alternative', value: `${sheets4x12} sheets` },
      { label: 'Joint Compound', value: `${compoundBuckets} bucket(s)` },
      { label: 'Tape Needed', value: `${tapeRolls} roll(s)` },
      { label: 'Screws Needed', value: `${screwsLbs} lb` },
      ...(cost !== null ? [{ label: 'Estimated Cost', value: `$${cost.toFixed(2)}` }] : []),
      { label: 'Waste Factor', value: '10% for cutouts and waste' },
    ] }
  },
  description: 'Estimate the number of drywall sheets for a room including joint compound, tape, and screws.',
  formula: 'Sheets = ceil(Area × 1.1 / 32) | Compound = ceil(Sheets / 4) | Tape = ceil(Sheets / 4) | Screws = ceil(Sheets / 4)',
  interpretation: 'Standard 4x8 ft drywall sheets cover 32 sq ft each. Add 10% for waste and cutouts. Use 1/2" for walls, 5/8" for ceilings (fire-rated). Joint compound: 1 bucket per 4 sheets. Tape: 1 roll per 4 sheets. Screws: 1 lb per 4 sheets.'
}

export default calcDef
