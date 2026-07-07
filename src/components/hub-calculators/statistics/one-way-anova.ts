import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ g1: z.string().min(1, 'Required'), g2: z.string().min(1, 'Required'), g3: z.string().min(1, 'Required') }),
  fields: [{ name: 'g1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }, { name: 'g2', label: 'Group 2 (comma separated)', type: 'number', step: 'any' }, { name: 'g3', label: 'Group 3 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const gs = [parseList(v.g1), parseList(v.g2), parseList(v.g3)].filter(g => g.length > 0); if (gs.length < 2) return { result: 'Need ≥2 groups', label: '', unit: '', steps: [] }; const all = gs.flat(); const grandMean = all.reduce((a, b) => a + b, 0) / all.length; const ssB = gs.reduce((acc, g) => acc + g.length * (g.reduce((a, b) => a + b, 0) / g.length - grandMean) ** 2, 0); const ssW = gs.reduce((acc, g) => { const gm = g.reduce((a, b) => a + b, 0) / g.length; return acc + g.reduce((s, x) => s + (x - gm) ** 2, 0) }, 0); const dfB = gs.length - 1; const dfW = all.length - gs.length; const msB = ssB / dfB; const msW = ssW / dfW; const f = msW > 0 ? msB / msW : 0; const ssT = all.reduce((acc, x) => acc + (x - grandMean) ** 2, 0); const eta2 = ssT > 0 ? ssB / ssT : 0; return { result: f, label: 'F-Statistic', unit: '', steps: [{ label: 'SS between', value: `${ssB.toFixed(4)}` }, { label: 'SS within', value: `${ssW.toFixed(4)}` }, { label: 'F', value: `${f.toFixed(4)}` }, { label: 'η²', value: `${eta2.toExponential(4)}` }] } },
  description: 'One-way ANOVA tests whether means of two or more groups are significantly different using F-distribution.',
  formula: 'F = MS_between / MS_within = (SSB/dfB) / (SSW/dfW)',
  interpretation: 'F > critical value rejects equal means. Post-hoc tests (Tukey, Bonferroni) identify which group pairs differ significantly.'
}

export default calcDef
