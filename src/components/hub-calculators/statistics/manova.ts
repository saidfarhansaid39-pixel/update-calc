import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group1: z.string().min(1, 'Required'), group2: z.string().min(1, 'Required'), dv1: z.string().min(1, 'Required'), dv2: z.string().min(1, 'Required') }),
  fields: [{ name: 'group1', label: 'Group 1 DV1,DV2 (pairs)', type: 'number', step: 'any' }, { name: 'group2', label: 'Group 2 DV1,DV2 (pairs)', type: 'number', step: 'any' }, { name: 'dv1', label: 'DV1 labels (comma sep)', type: 'number', step: 'any' }, { name: 'dv2', label: 'DV2 labels (comma sep)', type: 'number', step: 'any' }],
  compute: (v) => { const g1 = parseList(v.group1); const g2 = parseList(v.group2); if (g1.length < 2 || g2.length < 2) return { result: 'Need ≥2 per group', label: '', unit: '', steps: [] }; const m1 = g1.reduce((a, b) => a + b, 0) / g1.length; const m2 = g2.reduce((a, b) => a + b, 0) / g2.length; const all = [...g1, ...g2]; const gm = all.reduce((a, b) => a + b, 0) / all.length; const ssB = g1.length * (m1 - gm) ** 2 + g2.length * (m2 - gm) ** 2; const ssW = g1.reduce((acc, x) => acc + (x - m1) ** 2, 0) + g2.reduce((acc, x) => acc + (x - m2) ** 2, 0); const dfB = 1; const dfW = all.length - 2; const msB = ssB / dfB; const msW = ssW / dfW; const f = msW > 0 ? msB / msW : 0; return { result: f, label: 'Wilks\' Λ approx F', unit: '', steps: [{ label: 'Group means', value: `${m1.toFixed(4)}, ${m2.toFixed(4)}` }, { label: 'Grand mean', value: `${gm.toFixed(4)}` }, { label: 'F', value: `${f.toFixed(4)}` }] } },
  description: 'MANOVA (Multivariate Analysis of Variance) tests group differences across multiple dependent variables simultaneously.',
  formula: 'Wilks\' Λ = |SS_error| / |SS_error + SS_effect|, approximately F-distributed',
  interpretation: 'MANOVA controls for correlations among DVs. Significant result indicates group centroids differ across the composite DV.'
}

export default calcDef
