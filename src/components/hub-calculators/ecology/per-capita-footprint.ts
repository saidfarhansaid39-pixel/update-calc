import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalFootprint: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), population: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'totalFootprint', label: 'Total ecological footprint (gha)', type: 'number', min: 0.1, step: '0.1' },
    { name: 'population', label: 'Population size', type: 'number', min: 1, step: '1' },
  ],
  compute: (v) => { const tf = parseFloat(v.totalFootprint); const pop = parseFloat(v.population); const perCap = tf/pop; const earths = perCap/1.6; return { result: perCap, label: 'Per Capita Footprint', unit: 'gha', steps: [{ label: 'Total footprint', value: `${tf} gha` }, { label: 'Population', value: `${pop}` }, { label: 'Per capita', value: `${perCap.toFixed(2)} gha` }, { label: 'Earths if global', value: `${earths.toFixed(2)} planets` }, { label: 'Comparison', value: perCap<1.6?'Below planetary boundary':perCap<4?'Moderate':'High consumer' }] } },
  description: 'Per capita ecological footprint divides total resource demand by population, allowing comparison of individual environmental impact across regions.',
  formula: 'Per capita EF = Total EF / Population | Sustainable < 1.6 gha',
  interpretation: 'World average: ~2.8 gha. US: ~8.1 gha. EU: ~4.5 gha. India: ~1.2 gha. Living sustainably requires < 1.6 gha per person.'
}

export default calcDef
