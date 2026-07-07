import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ group1: z.string().min(1, 'Required'), group2: z.string().min(1, 'Required'), group3: z.string().min(1, 'Required') }),
  fields: [{ name: 'group1', label: 'Group 1 (comma separated)', type: 'number', step: 'any' }, { name: 'group2', label: 'Group 2 (comma separated)', type: 'number', step: 'any' }, { name: 'group3', label: 'Group 3 (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const gs = [parseList(v.group1), parseList(v.group2), parseList(v.group3)].filter(g => g.length > 0); if (gs.length < 2) return { result: 'Need ≥2 groups', label: '', unit: '', steps: [] }; const all = gs.flat(); const grandMean = all.reduce((a, b) => a + b, 0) / all.length; const ssBetween = gs.reduce((acc, g) => acc + g.length * (g.reduce((a, b) => a + b, 0) / g.length - grandMean) ** 2, 0); const ssWithin = gs.reduce((acc, g) => { const gm = g.reduce((a, b) => a + b, 0) / g.length; return acc + g.reduce((s, x) => s + (x - gm) ** 2, 0) }, 0); const dfB = gs.length - 1; const dfW = all.length - gs.length; const msB = ssBetween / dfB; const msW = ssWithin / dfW; const f = msW > 0 ? msB / msW : 0; return { result: f, label: 'F-Statistic', unit: '', steps: [{ label: 'SS between', value: `${ssBetween.toFixed(4)}` }, { label: 'SS within', value: `${ssWithin.toFixed(4)}` }, { label: 'F', value: `${f.toFixed(4)}` }, { label: 'DF', value: `${dfB}, ${dfW}` }] } },
  description: 'One-way ANOVA tests whether three or more group means are significantly different.',
  formula: 'F = MS_between / MS_within = (SSB/dfB) / (SSW/dfW)',
  interpretation: 'A significant F indicates at least one group mean differs. Post-hoc tests identify which pairs differ.'
}

export default calcDef
