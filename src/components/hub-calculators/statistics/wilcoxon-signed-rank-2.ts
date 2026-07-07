import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ before: z.string().min(1, 'Required'), after: z.string().min(1, 'Required') }),
  fields: [{ name: 'before', label: 'Before (comma separated)', type: 'number', step: 'any' }, { name: 'after', label: 'After (comma separated)', type: 'number', step: 'any' }],
  compute: (v) => { const pre = parseList(v.before); const post = parseList(v.after); if (pre.length !== post.length || pre.length < 2) return { result: 'Need >=2 pairs', label: '', unit: '', steps: [] }; const diffs = pre.map((x, i) => post[i] - x).filter(d => d !== 0); const absDiffs = diffs.map(d => Math.abs(d)); const sorted = absDiffs.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v); sorted.forEach((item, idx, arr) => { let j = idx; while (j + 1 < arr.length && arr[j + 1].v === item.v) j++; const avg = (idx + 1 + j + 1) / 2; for (let k = idx; k <= j; k++) (arr[k] as any).r = avg; return j }); let wPos = 0; let wNeg = 0; sorted.forEach((item, idx) => { const origDiff = diffs[item.i]; if (origDiff > 0) wPos += (item as any).r || 1; else wNeg += (item as any).r || 1 }); const w = Math.min(wPos, wNeg); return { result: w, label: 'Wilcoxon W', unit: '', steps: [{ label: 'Pairs (nonzero diffs)', value: `${diffs.length}` }, { label: 'W+', value: `${wPos.toFixed(0)}` }, { label: 'W-', value: `${wNeg.toFixed(0)}` }, { label: 'W (smaller)', value: `${w.toFixed(0)}` }] } },
  description: 'Wilcoxon signed-rank test is a non-parametric alternative to the paired t-test.',
  formula: 'W = Σ rank(D⁺) for positive differences',
  interpretation: 'Tests whether the median difference is zero. Does not assume normality. Less powerful than paired t if normality holds.'
}

export default calcDef
