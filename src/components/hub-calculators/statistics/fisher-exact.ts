import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ a: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), b: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), c: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0'), d: z.string().min(1).refine(v => parseInt(v) >= 0, '≥0') }),
  fields: [{ name: 'a', label: 'Cell a', type: 'number', min: 0, step: '1' }, { name: 'b', label: 'Cell b', type: 'number', min: 0, step: '1' }, { name: 'c', label: 'Cell c', type: 'number', min: 0, step: '1' }, { name: 'd', label: 'Cell d', type: 'number', min: 0, step: '1' }],
  compute: (v) => { const aVal = n(v.a); const bVal = n(v.b); const cVal = n(v.c); const dVal = n(v.d); const total = aVal + bVal + cVal + dVal; const lnFact = (x: number) => { let s = 0; for (let i = 2; i <= x; i++) s += Math.log(i); return s }; const lnP = lnFact(aVal + bVal) + lnFact(cVal + dVal) + lnFact(aVal + cVal) + lnFact(bVal + dVal) - lnFact(total) - lnFact(aVal) - lnFact(bVal) - lnFact(cVal) - lnFact(dVal); const p = Math.exp(lnP); return { result: p, label: 'Fisher Exact p (one-sided)', unit: '', steps: [{ label: 'Table', value: `[[${aVal},${bVal}],[${cVal},${dVal}]]` }, { label: 'N', value: `${total}` }, { label: 'p-value', value: `${p.toExponential(4)}` }] } },
  description: 'Fisher\'s exact test assesses association in 2×2 contingency tables, especially valid for small samples.',
  formula: 'p = (a+b)!(c+d)!(a+c)!(b+d)! / (n! a! b! c! d!)',
  interpretation: 'The exact p-value is computed from the hypergeometric distribution. Preferred over χ² when expected frequencies < 5.'
}

export default calcDef
