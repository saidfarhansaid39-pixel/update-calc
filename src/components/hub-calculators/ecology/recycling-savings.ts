import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ paper: z.string().optional(), plastic: z.string().optional(), glass: z.string().optional(), metal: z.string().optional() }),
  fields: [
    { name: 'paper', label: 'Paper recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'plastic', label: 'Plastic recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'glass', label: 'Glass recycled (kg)', type: 'number', min: 0, step: '1' },
    { name: 'metal', label: 'Metal recycled (kg)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const paper = parseFloat(v.paper)||0; const plastic = parseFloat(v.plastic)||0; const glass = parseFloat(v.glass)||0; const metal = parseFloat(v.metal)||0; const co2Saved = paper * 3.5 + plastic * 1.5 + glass * 0.6 + metal * 9.2; const total = paper + plastic + glass + metal; return { result: co2Saved, label: 'CO₂ Savings from Recycling', unit: 'kg', steps: [{ label: 'Paper recycled', value: `${paper} kg` }, { label: 'Plastic recycled', value: `${plastic} kg` }, { label: 'Glass recycled', value: `${glass} kg` }, { label: 'Metal recycled', value: `${metal} kg` }, { label: 'Total CO₂ saved', value: `${co2Saved.toFixed(1)} kg` }] } },
  description: 'Estimates greenhouse gas reductions achieved through recycling common materials.',
  formula: 'CO₂ saved = Σ(material × emission factor)',
  interpretation: 'Recycling 1 kg of aluminum saves ~9.2 kg CO₂e. Paper: ~3.5 kg. Glass: ~0.6 kg.'
}

export default calcDef
