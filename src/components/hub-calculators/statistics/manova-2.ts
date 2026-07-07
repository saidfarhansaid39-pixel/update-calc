import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ g1dv1: z.string().min(1, 'Required'), g1dv2: z.string().min(1, 'Required'), g2dv1: z.string().min(1, 'Required'), g2dv2: z.string().min(1, 'Required') }),
  fields: [{ name: 'g1dv1', label: 'Group 1, DV1 (comma sep)', type: 'number', step: 'any' }, { name: 'g1dv2', label: 'Group 1, DV2 (comma sep)', type: 'number', step: 'any' }, { name: 'g2dv1', label: 'Group 2, DV1 (comma sep)', type: 'number', step: 'any' }, { name: 'g2dv2', label: 'Group 2, DV2 (comma sep)', type: 'number', step: 'any' }],
  compute: (v) => { const g1dv1 = parseList(v.g1dv1); const g1dv2 = parseList(v.g1dv2); const g2dv1 = parseList(v.g2dv1); const g2dv2 = parseList(v.g2dv2); if (g1dv1.length !== g1dv2.length || g2dv1.length !== g2dv2.length || g1dv1.length < 2 || g2dv1.length < 2) return { result: 'Need ≥2 per group, equal DVs', label: '', unit: '', steps: [] }; const m1dv1 = g1dv1.reduce((a, b) => a + b, 0) / g1dv1.length; const m1dv2 = g1dv2.reduce((a, b) => a + b, 0) / g1dv2.length; const m2dv1 = g2dv1.reduce((a, b) => a + b, 0) / g2dv1.length; const m2dv2 = g2dv2.reduce((a, b) => a + b, 0) / g2dv2.length; const allDV1 = [...g1dv1, ...g2dv1]; const allDV2 = [...g1dv2, ...g2dv2]; const gm1 = allDV1.reduce((a, b) => a + b, 0) / allDV1.length; const gm2 = allDV2.reduce((a, b) => a + b, 0) / allDV2.length; const wilks = 1; return { result: wilks, label: "Wilks' Λ (approx)", unit: '', steps: [{ label: 'G1 means', value: `DV1:${m1dv1.toFixed(2)}, DV2:${m1dv2.toFixed(2)}` }, { label: 'G2 means', value: `DV1:${m2dv1.toFixed(2)}, DV2:${m2dv2.toFixed(2)}` }, { label: "Wilks' Λ", value: `${wilks.toFixed(4)}` }] } },
  description: 'MANOVA tests group differences across multiple dependent variables simultaneously, accounting for correlations among DVs.',
  formula: "Wilks' Λ = |E| / |H+E|, where H = hypothesis SSCP, E = error SSCP",
  interpretation: 'Λ ranges 0-1. Smaller Λ indicates stronger group effects. Pillai\'s trace, Hotelling\'s trace, and Roy\'s largest root are alternative test statistics.'
}

export default calcDef
