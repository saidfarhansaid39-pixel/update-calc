import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ totalInertia: z.string().optional(), constrInertia: z.string().optional(), axis1: z.string().optional(), axis2: z.string().optional() }),
  fields: [
    { name: 'totalInertia', label: 'Total inertia', type: 'number', min: 0, step: '0.001' },
    { name: 'constrInertia', label: 'Constrained inertia', type: 'number', min: 0, step: '0.001' },
    { name: 'axis1', label: 'CCA1 eigenvalue', type: 'number', min: 0, step: '0.001' },
    { name: 'axis2', label: 'CCA2 eigenvalue', type: 'number', min: 0, step: '0.001' },
    ],
  presets: [
    { label: 'Forest gradient', values: { species: '25,18,30,10,15,8,5,12,20,7', env1: '200', env2: '45' } },
    { label: 'Pollution gradient', values: { species: '5,3,8,12,2,1,4,6', disturbance: '8', nutrients: '15' } },
    { label: 'Elevation transect', values: { elevation: '1500', species: '12,8,15,20,10,5', temp: '12' } },
    { label: 'Restoration chronosequence', values: { yearsSinceDist: '20', speciesRichness: '18', coverPct: '65' } },
    { label: 'Coral reef health', values: { liveCoral: '45', algalCover: '25', fishDiversity: '22' } }
    ],
  compute: (v) => { const ti = parseFloat(v.totalInertia)||1; const ci = parseFloat(v.constrInertia)||0.5; const a1 = parseFloat(v.axis1)||0.3; const a2 = parseFloat(v.axis2)||0.15; const propConstr = ti>0?ci/ti*100:0; const propA1 = ti>0?a1/ti*100:0; const propA2 = ti>0?a2/ti*100:0; return { result: propConstr, label: 'Constrained / Total Inertia', unit: '%', steps: [{ label: 'Total inertia', value: ti.toFixed(3) }, { label: 'Constrained inertia', value: ci.toFixed(3) }, { label: '% constrained', value: `${propConstr.toFixed(1)}%` }, { label: 'CCA1 %', value: `${propA1.toFixed(1)}%` }, { label: 'CCA2 %', value: `${propA2.toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Multivariate methods reveal latent structure in ecological data — identifying gradients, clusters, and key environmental drivers of community composition." },
      { label: "Measurement Method", value: "Species abundance/environmental matrices collected via standardized field sampling. Data typically Hellinger- or log-transformed before analysis." },
      { label: "Conservation Note", value: "Ordination helps identify environmental variables most strongly associated with biodiversity patterns, guiding reserve design and restoration priorities." },
      { label: "Typical Ranges", value: "Stress < 0.1 (excellent NMDS fit), < 0.2 (good), < 0.3 (poor). Eigenvalues > 1 often retained in PCA. PERMANOVA p < 0.05 indicates group differences." },
      { label: "Related Concepts", value: "Constrained ordination (CCA/RDA), PERMANOVA, indicator species analysis, gradient analysis, beta diversity partitioning." }
    ]} },
  description: 'Canonical Correspondence Analysis diagnostics — evaluates how much variation is explained by environmental constraints.',
  formula: '% constrained = (Constrained inertia / Total inertia) × 100 | Eigenvalue / Total inertia',
  interpretation: 'Higher constrained % means environmental variables explain more community variation. Low % (<20%) suggests unmeasured factors dominate.'
}

export default calcDef
