import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ eigen1: z.string().optional(), eigen2: z.string().optional(), totalVar: z.string().optional() }),
  fields: [
    { name: 'eigen1', label: 'PC1 eigenvalue', type: 'number', min: 0, step: '0.01' },
    { name: 'eigen2', label: 'PC2 eigenvalue', type: 'number', min: 0, step: '0.01' },
    { name: 'totalVar', label: 'Total variance', type: 'number', min: 0, step: '0.1' },
  ],
  compute: (v) => { const e1 = parseFloat(v.eigen1)||2.5; const e2 = parseFloat(v.eigen2)||1.2; const tv = parseFloat(v.totalVar)||10; const pc1 = tv>0?e1/tv*100:0; const pc2 = tv>0?e2/tv*100:0; const cumul = pc1+pc2; return { result: pc1, label: 'PC1 Variance Explained', unit: '%', steps: [{ label: 'PC1 eigenvalue', value: e1.toFixed(2) }, { label: 'PC2 eigenvalue', value: e2.toFixed(2) }, { label: 'PC1 variance', value: `${pc1.toFixed(1)}%` }, { label: 'PC2 variance', value: `${pc2.toFixed(1)}%` }, { label: 'Cumulative (PC1+PC2)', value: `${cumul.toFixed(1)}%` }] } },
  description: 'Evaluates principal component analysis results by calculating variance explained by each axis.',
  formula: '% Variance = (λᵢ / Σλ) × 100',
  interpretation: 'Kaiser criterion: retain PCs with λ > 1. Good ordination typically explains 60-80% in 2-3 axes.'
}

export default calcDef
