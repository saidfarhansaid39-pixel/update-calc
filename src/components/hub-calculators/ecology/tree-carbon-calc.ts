import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ dbh: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().optional(), species: z.string().optional() }),
  fields: [
    { name: 'dbh', label: 'Diameter at breast height (cm)', type: 'number', min: 1, step: '0.1' },
    { name: 'height', label: 'Tree height (m)', type: 'number', min: 1, step: '0.5' },
    { name: 'species', label: 'Species group', type: 'select', options: [{ label: 'Hardwood deciduous', value: 'hard' }, { label: 'Softwood conifer', value: 'soft' }, { label: 'Tropical', value: 'trop' }] },
  ],
  compute: (v) => { const d = parseFloat(v.dbh); const h = parseFloat(v.height)||d*0.8; const sp = v.species||'hard'; const fMap: Record<string, number> = { hard: 0.12, soft: 0.09, trop: 0.15 }; const f = fMap[sp]; const biomass = f * (d**2 * h) * 0.5; const carbon = biomass * 0.47; const co2 = carbon * 3.67; return { result: co2, label: 'Carbon Stored', unit: 'kg CO₂e', steps: [{ label: 'DBH', value: `${d} cm` }, { label: 'Height', value: `${h.toFixed(1)} m` }, { label: 'Above-ground biomass', value: `${biomass.toFixed(1)} kg` }, { label: 'Carbon content', value: `${carbon.toFixed(1)} kg` }, { label: 'CO₂ equivalent', value: `${co2.toFixed(0)} kg` }] } },
  description: 'Estimates carbon stored in a tree using allometric equations based on diameter and height.',
  formula: 'Biomass = f × D²H | Carbon = Biomass × 0.47 | CO₂ = C × 3.67',
  interpretation: 'A mature tree (30 cm DBH) stores ~500-1500 kg CO₂e. Younger trees store less but sequester faster.'
}

export default calcDef
