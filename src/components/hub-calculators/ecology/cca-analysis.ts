import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalInertia: z.string().optional(), constrInertia: z.string().optional(), axis1: z.string().optional(), axis2: z.string().optional() }),
  fields: [
    { name: 'totalInertia', label: 'Total inertia', type: 'number', min: 0, step: '0.001' },
    { name: 'constrInertia', label: 'Constrained inertia', type: 'number', min: 0, step: '0.001' },
    { name: 'axis1', label: 'CCA1 eigenvalue', type: 'number', min: 0, step: '0.001' },
    { name: 'axis2', label: 'CCA2 eigenvalue', type: 'number', min: 0, step: '0.001' },
  ],
  compute: (v) => { const ti = parseFloat(v.totalInertia)||1; const ci = parseFloat(v.constrInertia)||0.5; const a1 = parseFloat(v.axis1)||0.3; const a2 = parseFloat(v.axis2)||0.15; const propConstr = ti>0?ci/ti*100:0; const propA1 = ti>0?a1/ti*100:0; const propA2 = ti>0?a2/ti*100:0; return { result: propConstr, label: 'Constrained / Total Inertia', unit: '%', steps: [{ label: 'Total inertia', value: ti.toFixed(3) }, { label: 'Constrained inertia', value: ci.toFixed(3) }, { label: '% constrained', value: `${propConstr.toFixed(1)}%` }, { label: 'CCA1 %', value: `${propA1.toFixed(1)}%` }, { label: 'CCA2 %', value: `${propA2.toFixed(1)}%` }] } },
  description: 'Canonical Correspondence Analysis diagnostics — evaluates how much variation is explained by environmental constraints.',
  formula: '% constrained = (Constrained inertia / Total inertia) × 100 | Eigenvalue / Total inertia',
  interpretation: 'Higher constrained % means environmental variables explain more community variation. Low % (<20%) suggests unmeasured factors dominate.'
}

export default calcDef
