import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1).refine(v => { const a = parseFloat(v); return a >= 0 && a <= 120 }, '0-120'), mortality: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'age', label: 'Current Age', type: 'number', min: 0, max: 120, step: '1' }, { name: 'mortality', label: 'Mortality Rate (per 1000)', type: 'number', min: 0.01, step: '0.1' }],
  compute: (v) => { const q = n(v.mortality) / 1000; const lx = 100000; const dx = lx * q; const Lx = (lx + (lx - dx)) / 2; const Tx = Lx * (120 - n(v.age)); const ex = lx > 0 ? Tx / lx : 0; return { result: ex, label: 'Remaining Life Expectancy', unit: 'years', steps: [{ label: 'Mortality probability', value: `${q.toExponential(4)}` }, { label: 'Survivors to age', value: `${lx}` }, { label: 'Life expectancy', value: `${ex.toFixed(2)} years` }] } },
  description: 'Life expectancy is the average number of years a person of a given age can expect to live based on current mortality rates.',
  formula: "eₓ = Tₓ / lₓ where Tₓ = total person-years lived after age x | lₓ = survivors to age x",
  interpretation: 'Life expectancy at birth (~79 years in US) differs by sex, region, and socioeconomic factors. Period life tables assume current mortality rates continue.'
}

export default calcDef
