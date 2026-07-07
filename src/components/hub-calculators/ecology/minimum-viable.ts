import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ne: z.string().min(1).refine(v => parseInt(v) > 0, '>0'), inbreeding: z.string().optional() }),
  fields: [
    { name: 'ne', label: 'Effective population size (Ne)', type: 'number', min: 1, step: '1' },
    { name: 'inbreeding', label: 'Inbreeding coefficient (F, optional)', type: 'number', min: 0, max: 1, step: '0.01' },
  ],
  compute: (v) => { const Ne = parseInt(v.ne); const NeOverN = 0.35; const Nc = Ne/NeOverN; const mvp50 = 50; const mvp500 = 500; const status = Ne<50?'Critically endangered':Ne<250?'Endangered':Ne<500?'Vulnerable':'Low risk'; return { result: Nc, label: 'Census Population (Nc)', unit: '', steps: [{ label: 'Effective size Ne', value: `${Ne}` }, { label: 'Estimated census Nc (Ne/0.35)', value: `${Math.round(Nc)}` }, { label: 'MVP short-term (50)', value: `${mvp50}` }, { label: 'MVP long-term (500)', value: `${mvp500}` }, { label: 'Conservation status', value: status }] } },
  description: 'Minimum Viable Population (MVP) is the smallest isolated population with a high probability (typically 99%) of persisting for a given time.',
  formula: 'Ne/N ≈ 0.35 typical | MVP: 50 for short-term, 500 for long-term | Franklin 1980',
  interpretation: 'MVP of 50 prevents inbreeding depression (short-term). MVP of 500 maintains genetic diversity (long-term). Larger MVPs for fluctuating environments.'
}

export default calcDef
