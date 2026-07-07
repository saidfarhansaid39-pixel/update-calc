import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), thickness: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), density: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'area', label: 'Area (sq ft)', type: 'number', min: 1, step: '10' },
    { name: 'thickness', label: 'Thickness (in)', type: 'number', min: 1, step: '0.5' },
    { name: 'density', label: 'Asphalt Density (lb/cu ft)', type: 'number', min: 100, step: '5' },
  ],
  compute: (v) => {
    const volumeCF = v.area * (v.thickness / 12)
    const weightLbs = volumeCF * v.density
    const tons = weightLbs / 2000
    return { result: tons, label: 'Asphalt Required', unit: 'tons', steps: [{ label: 'Volume', value: `${volumeCF.toFixed(1)} cu ft` }, { label: 'Weight', value: `${weightLbs.toFixed(0)} lbs` }, { label: 'Tons', value: `${tons.toFixed(2)} tons` }] }
  },
  description: 'Estimate asphalt tonnage needed for driveways, parking lots, or roads based on area, thickness, and density. Typical asphalt density is 145 lb/cu ft.',
  formula: 'Tons = (Area × Thickness/12 × Density) / 2000',
  interpretation: 'Standard driveway thickness: 2-3 in residential, 3-4 in commercial. Add 5-10% for compaction loss. Typical ton covers ~80 sq ft at 2 in thickness.'
}

export default calcDef
