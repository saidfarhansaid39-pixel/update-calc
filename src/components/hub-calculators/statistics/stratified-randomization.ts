import { z } from 'zod'
import { n, parseList } from '../../../lib/statistics-utils'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ strata: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2'), blocks: z.string().min(1).refine(v => parseInt(v) >= 2, '≥2') }),
  fields: [{ name: 'strata', label: 'Number of Strata', type: 'number', min: 2, step: '1' }, { name: 'blocks', label: 'Block Size', type: 'number', min: 2, step: '1' }],
  compute: (v) => { const s = Math.round(n(v.strata)); const b = Math.round(n(v.blocks)); const perArm = s * (b / 2); const total = perArm * 2; return { result: `Total:${total} (${perArm} per arm)`, label: 'Stratified Randomization', unit: '', steps: [{ label: 'Strata', value: `${s}` }, { label: 'Block size', value: `${b}` }, { label: 'Per arm', value: `${perArm}` }, { label: 'Total N (2 arms)', value: `${total}` }] } },
  description: 'Stratified randomization allocates subjects to treatment arms within strata defined by prognostic factors.',
  formula: 'N_total = 2 × strata × (block_size / 2)',
  interpretation: 'Stratification ensures balance on key covariates across treatment arms. Each stratum uses separate block randomization.'
}

export default calcDef
