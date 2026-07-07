import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dbh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'dbh', label: 'Diameter at breast height (cm)', type: 'number', min: 1, step: '0.1' },
    { name: 'height', label: 'Tree height (m)', type: 'number', min: 1, step: '0.5' },
  ],
  compute: (v) => { const d = parseFloat(v.dbh); const h = parseFloat(v.height); const r = d/200; const vol = Math.PI * r*r * h * 0.5; return { result: vol, label: 'Tree Volume', unit: 'm³', steps: [{ label: 'DBH', value: `${d} cm` }, { label: 'Height', value: `${h} m` }, { label: 'Radius', value: `${r.toFixed(3)} m` }, { label: 'Volume = πr²h × 0.5', value: `${vol.toFixed(2)} m³` }] } },
  description: 'Tree volume estimation uses DBH and height with a form factor (typically 0.5) to calculate merchantable timber volume.',
  formula: 'V = π × (DBH/200)² × H × F | where F = 0.5 (form factor)',
  interpretation: 'Form factor varies by species (0.4-0.6). Higher form factors = more cylindrical boles. Total volume includes branches for biomass estimation.'
}

export default calcDef
