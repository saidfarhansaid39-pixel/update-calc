import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ impurity: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), sampleCount: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1'), bestSplitImpurity: z.string().min(1).refine(v => parseFloat(v) >= 0, '≥0'), bestSplitSamples: z.string().min(1).refine(v => parseInt(v) >= 1, '≥1') }),
  fields: [{ name: 'impurity', label: 'Current Node Impurity', type: 'number', min: 0, step: '0.01' }, { name: 'sampleCount', label: 'Current Sample Count', type: 'number', min: 1, step: '1' }, { name: 'bestSplitImpurity', label: 'Child Weighted Impurity', type: 'number', min: 0, step: '0.01' }, { name: 'bestSplitSamples', label: 'Samples After Split', type: 'number', min: 1, step: '1' }],
  compute: (v) => { const curImp = n(v.impurity); const curN = Math.round(n(v.sampleCount)); const splitImp = n(v.bestSplitImpurity); const splitN = Math.round(n(v.bestSplitSamples)); const gain = curImp - splitImp; const gainRatio = curImp > 0 ? gain / curImp : 0; return { result: gain, label: 'Information Gain', unit: '', steps: [{ label: 'Current impurity', value: `${curImp.toFixed(4)}` }, { label: 'Weighted child impurity', value: `${splitImp.toFixed(4)}` }, { label: 'Gain', value: `${gain.toExponential(4)}` }, { label: 'Gain ratio', value: `${gainRatio.toExponential(4)}` }] } },
  description: 'Decision trees split data recursively to maximize purity (or minimize impurity) in child nodes.',
  formula: 'Gain = Impurity(parent) - Σ(nᵢ/n) × Impurity(childᵢ)',
  interpretation: 'Gini impurity or entropy measures node purity. Pruning prevents overfitting. Trees handle non-linear relationships.'
}

export default calcDef
