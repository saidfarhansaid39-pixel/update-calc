import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), species: z.string().optional(), z: z.string().optional() }),
  fields: [
    { name: 'area', label: 'Habitat area (km²)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'species', label: 'Known species (optional)', type: 'number', min: 1, step: '1' },
    { name: 'z', label: 'z-value (slope)', type: 'number', min: 0.1, max: 0.5, step: '0.01' },
  ],
  compute: (v) => { const a = parseFloat(v.area); const S = parseFloat(v.species)||50; const zVal = parseFloat(v.z)||0.25; const refArea = 1; const logS = Math.log(S); const logA = Math.log(a); const predS = S * Math.pow(a/refArea, zVal); const per10x = S * Math.pow(10, zVal); return { result: predS, label: 'Predicted Species (S = cA^z)', unit: '', steps: [{ label: 'Area (A)', value: `${a} km²` }, { label: 'Known species (S)', value: `${S}` }, { label: 'z-value', value: zVal.toFixed(2) }, { label: 'c = S/A^z', value: (S/Math.pow(refArea, zVal)).toFixed(2) }, { label: 'Predicted species', value: predS.toFixed(0) }, { label: 'Species at 10× area', value: per10x.toFixed(0) }] } },
  description: 'Species-area relationship (SAR) predicts species richness as a function of habitat area using S = cA^z.',
  formula: 'S = cA^z | log(S) = log(c) + z·log(A)',
  interpretation: 'z ≈ 0.25 for continents, 0.25-0.35 for islands, 0.35-0.5 for isolated habitats. Higher z = steeper diversity loss with area reduction.'
}

export default calcDef
