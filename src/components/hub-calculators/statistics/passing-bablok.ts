import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ xValues: z.string().min(1, 'Required'), yValues: z.string().min(1, 'Required') }),
  fields: [{ name: 'xValues', label: 'X Values (comma separated)', type: 'number', step: 'any' }, { name: 'yValues', label: 'Y Values (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const x = parseList(v.xValues); const y = parseList(v.yValues); if (x.length !== y.length || x.length < 3) return { result: 'Need ≥3 pairs', label: '', unit: '', steps: [] }; const slopes: number[] = []; for (let i = 0; i < x.length; i++) { for (let j = i + 1; j < x.length; j++) { const d = x[j] - x[i]; if (d !== 0) slopes.push((y[j] - y[i]) / d) } }; const sortedSlopes = [...slopes].sort((a, b) => a - b); const medSlope = sortedSlopes[Math.floor(sortedSlopes.length / 2)]; const intercepts = y.map((yi, i) => yi - medSlope * x[i]); const sortedInt = [...intercepts].sort((a, b) => a - b); const medInt = sortedInt[Math.floor(sortedInt.length / 2)]; return { result: `${medSlope.toFixed(4)}x + ${medInt.toFixed(4)}`, label: 'Passing-Bablok Equation', unit: '', steps: [{ label: 'N pairs', value: `${x.length}` }, { label: 'Slope pairs computed', value: `${slopes.length}` }, { label: 'Median slope', value: `${medSlope.toFixed(4)}` }, { label: 'Median intercept', value: `${medInt.toFixed(4)}` }] } },
  description: 'Passing-Bablok regression is a non-parametric method for comparing two measurement methods. It is robust to outliers.',
  formula: 'Slope = median of all pairwise slopes (yⱼ-yᵢ)/(xⱼ-xᵢ), Intercept = median(yᵢ - slope × xᵢ)',
  interpretation: 'If 95% CI of slope includes 1 and intercept includes 0, the two methods agree. No distributional assumptions required.'
}

export default calcDef
