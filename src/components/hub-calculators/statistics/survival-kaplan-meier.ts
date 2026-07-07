import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ times: z.string().min(1, 'Required'), events: z.string().min(1, 'Required') }),
  fields: [{ name: 'times', label: 'Times (comma separated)', type: 'number', step: 'any' }, { name: 'events', label: 'Events (0/1, comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const t = parseList(v.times); const e = parseList(v.events); if (t.length !== e.length || t.length < 2) return { result: 'Need ≥2 obs', label: '', unit: '', steps: [] }; const pairs = t.map((ti, i) => ({ t: ti, e: e[i] })).sort((a, b) => a.t - b.t); let surv = 1; const survProbs = pairs.map((p, i) => { const nRisk = pairs.length - i; if (nRisk > 0 && p.e === 1) { surv *= (nRisk - 1) / nRisk }; return { t: p.t, surv } }); const medianIdx = survProbs.findIndex(sp => sp.surv <= 0.5); const medianTime = medianIdx >= 0 ? survProbs[medianIdx].t : t.reduce((a, b) => Math.max(a, b), 0); return { result: medianTime, label: 'Median Survival Time', unit: '', steps: [{ label: 'Observations', value: `${t.length}` }, { label: 'Events', value: `${e.filter(x => x === 1).length}` }, { label: 'Median survival', value: `${medianTime.toFixed(4)}` }, { label: 'Last survival prob', value: `${survProbs[survProbs.length - 1].surv.toFixed(4)}` }] } },
  description: 'Kaplan-Meier estimator computes the survival function from time-to-event data, handling censored observations.',
  formula: 'Ŝ(t) = Π_{tᵢ ≤ t} ((nᵢ - dᵢ) / nᵢ)',
  interpretation: 'The KM curve shows the probability of surviving past time t. The median survival time is when S(t) = 0.5.'
}

export default calcDef
