import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ stress: z.string().optional(), dimensions: z.string().optional() }),
  fields: [
    { name: 'stress', label: 'Stress value from NMDS output', type: 'number', min: 0, max: 1, step: '0.01' },
    { name: 'dimensions', label: 'Number of dimensions (k)', type: 'number', min: 1, max: 6, step: '1' },
    ],
  presets: [
    { label: 'Forest gradient', values: { species: '25,18,30,10,15,8,5,12,20,7', env1: '200', env2: '45' } },
    { label: 'Pollution gradient', values: { species: '5,3,8,12,2,1,4,6', disturbance: '8', nutrients: '15' } },
    { label: 'Elevation transect', values: { elevation: '1500', species: '12,8,15,20,10,5', temp: '12' } },
    { label: 'Restoration chronosequence', values: { yearsSinceDist: '20', speciesRichness: '18', coverPct: '65' } },
    { label: 'Coral reef health', values: { liveCoral: '45', algalCover: '25', fishDiversity: '22' } }
    ],
  compute: (v) => { const s = parseFloat(v.stress)||0.2; const k = parseInt(v.dimensions)||2; const quality = s<0.05?'Excellent':s<0.1?'Good':s<0.2?'Fair':'Poor'; const maxAcceptable = 0.2 + (k-2)*0.02; return { result: s, label: 'NMDS Stress', unit: '', steps: [{ label: 'Dimensions (k)', value: `${k}` }, { label: 'Stress value', value: s.toFixed(3) }, { label: 'Interpretation', value: quality }, { label: 'Max acceptable stress', value: maxAcceptable.toFixed(3) }, { label: 'Acceptable?', value: s<=maxAcceptable?'Yes':'No — increase k or remove outliers' }] ,
    extras: [
      { label: "Environmental Context", value: "Multivariate methods reveal latent structure in ecological data — identifying gradients, clusters, and key environmental drivers of community composition." },
      { label: "Measurement Method", value: "Species abundance/environmental matrices collected via standardized field sampling. Data typically Hellinger- or log-transformed before analysis." },
      { label: "Conservation Note", value: "Ordination helps identify environmental variables most strongly associated with biodiversity patterns, guiding reserve design and restoration priorities." },
      { label: "Typical Ranges", value: "Stress < 0.1 (excellent NMDS fit), < 0.2 (good), < 0.3 (poor). Eigenvalues > 1 often retained in PCA. PERMANOVA p < 0.05 indicates group differences." },
      { label: "Related Concepts", value: "Constrained ordination (CCA/RDA), PERMANOVA, indicator species analysis, gradient analysis, beta diversity partitioning." }
    ]} },
  description: 'Non-metric multidimensional scaling stress evaluation. Lower stress indicates better ordination fit.',
  formula: 'Stress = √(Σ(d̂_ij - d_ij)² / Σ(d_ij)²)',
  interpretation: 'Stress < 0.1 = good ordination. Stress 0.1-0.2 = usable but some species poorly fit. Stress > 0.2 = unreliable.'
}

export default calcDef
