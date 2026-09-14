import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ eigen1: z.string().optional(), eigen2: z.string().optional(), totalVar: z.string().optional() }),
  fields: [
    { name: 'eigen1', label: 'PC1 eigenvalue', type: 'number', min: 0, step: '0.01' },
    { name: 'eigen2', label: 'PC2 eigenvalue', type: 'number', min: 0, step: '0.01' },
    { name: 'totalVar', label: 'Total variance', type: 'number', min: 0, step: '0.1' },
    ],
  presets: [
    { label: 'Forest gradient', values: { species: '25,18,30,10,15,8,5,12,20,7', env1: '200', env2: '45' } },
    { label: 'Pollution gradient', values: { species: '5,3,8,12,2,1,4,6', disturbance: '8', nutrients: '15' } },
    { label: 'Elevation transect', values: { elevation: '1500', species: '12,8,15,20,10,5', temp: '12' } },
    { label: 'Restoration chronosequence', values: { yearsSinceDist: '20', speciesRichness: '18', coverPct: '65' } },
    { label: 'Coral reef health', values: { liveCoral: '45', algalCover: '25', fishDiversity: '22' } }
    ],
  compute: (v) => { const e1 = parseFloat(v.eigen1)||2.5; const e2 = parseFloat(v.eigen2)||1.2; const tv = parseFloat(v.totalVar)||10; const pc1 = tv>0?e1/tv*100:0; const pc2 = tv>0?e2/tv*100:0; const cumul = pc1+pc2; return { result: pc1, label: 'PC1 Variance Explained', unit: '%', steps: [{ label: 'PC1 eigenvalue', value: e1.toFixed(2) }, { label: 'PC2 eigenvalue', value: e2.toFixed(2) }, { label: 'PC1 variance', value: `${pc1.toFixed(1)}%` }, { label: 'PC2 variance', value: `${pc2.toFixed(1)}%` }, { label: 'Cumulative (PC1+PC2)', value: `${cumul.toFixed(1)}%` }] ,
    extras: [
      { label: "Environmental Context", value: "Multivariate methods reveal latent structure in ecological data — identifying gradients, clusters, and key environmental drivers of community composition." },
      { label: "Measurement Method", value: "Species abundance/environmental matrices collected via standardized field sampling. Data typically Hellinger- or log-transformed before analysis." },
      { label: "Conservation Note", value: "Ordination helps identify environmental variables most strongly associated with biodiversity patterns, guiding reserve design and restoration priorities." },
      { label: "Typical Ranges", value: "Stress < 0.1 (excellent NMDS fit), < 0.2 (good), < 0.3 (poor). Eigenvalues > 1 often retained in PCA. PERMANOVA p < 0.05 indicates group differences." },
      { label: "Related Concepts", value: "Constrained ordination (CCA/RDA), PERMANOVA, indicator species analysis, gradient analysis, beta diversity partitioning." }
    ]} },
  description: 'Evaluates principal component analysis results by calculating variance explained by each axis.',
  formula: '% Variance = (λᵢ / Σλ) × 100',
  interpretation: 'Kaiser criterion: retain PCs with λ > 1. Good ordination typically explains 60-80% in 2-3 axes.'
}

export default calcDef
