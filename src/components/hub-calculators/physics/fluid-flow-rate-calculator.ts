import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), velocity: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'area', label: 'Cross-Sectional Area', type: 'number', unit: 'm^2', min: 0.0001, step: '0.0001' }, { name: 'velocity', label: 'Flow Velocity', type: 'number', unit: 'm/s', min: 0.01, step: '0.01' }],
  compute: (v) => ({ result: v.area * v.velocity, label: 'Volumetric Flow Rate', unit: 'm^3/s', steps: [{ label: 'Formula', value: 'Q = Av' }, { label: 'Substitute', value: `${v.area} × ${v.velocity}` }, { label: 'Result', value: `${(v.area * v.velocity).toFixed(6)} m^3/s` }] }),
  description: 'Volumetric flow rate is the volume of fluid passing through a cross-section per unit time.',
  formula: 'Q = A × v',
  interpretation: 'Flow rate is conserved in incompressible flow (continuity equation). Constricted pipes increase velocity to maintain Q.'
}

export default calcDef
