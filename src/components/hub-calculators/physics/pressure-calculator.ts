import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ force: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'force', label: 'Force', type: 'number', unit: 'N', min: 0.001, step: '0.001' }, { name: 'area', label: 'Area', type: 'number', unit: 'm^2', min: 0.001, step: '0.001' }],
  defaults: { force: '1000', area: '0.01' },
  presets: [
    { label: 'Atmospheric pressure (sea level)', values: { force: '101325', area: '1' } },
    { label: 'Car tire (32 psi)', values: { force: '22063', area: '0.01' } },
    { label: 'Elephant foot (0.1 m², 5000 kg)', values: { force: '49050', area: '0.1' } },
  ],
  compute: (v) => ({ result: v.force / v.area, label: 'Pressure', unit: 'Pa', steps: [{ label: 'Formula', value: 'P = F/A' }, { label: 'Substitute', value: `${v.force} / ${v.area}` }, { label: 'Result', value: `${(v.force / v.area).toFixed(2)} Pa` }],
      extras: [
        { label: 'Real-World Application', value: 'Pressure explains why sharp knives cut better (small area = high pressure), why snowshoes prevent sinking, and how hydraulic systems multiply force.' },
        { label: 'Common Values', value: '1 atm = 101,325 Pa. Car tire: 220 kPa (32 psi). Blood pressure: ~16 kPa (120 mmHg). Deep ocean (10 m): 2 atm. Atmospheric pressure decreases by ~12 Pa/m.' },
        { label: 'Precision Tip', value: 'Pressure = force/area. In fluids: P = ρgh (hydrostatic pressure). Gauge pressure = absolute - atmospheric. A 1 Pa = 1 N/m².' },
        { label: 'Related Formula', value: 'P = F/A. P = ρgh. Pascal\'s principle: F₁/A₁ = F₂/A₂. Ideal gas: PV = nRT. Bernoulli: P + ½ρv² + ρgh = constant.' },
        { label: 'Unit Conversion Note', value: '1 Pa = 1 N/m². 1 atm = 101,325 Pa. 1 bar = 10⁵ Pa. 1 psi = 6895 Pa. 1 mmHg = 133.3 Pa.' }
      ] }),
  description: 'Pressure is force per unit area. It describes how concentrated a force is over a surface.',
  formula: 'P = F / A',
  interpretation: '1 Pa = 1 N/m^2. Standard atmospheric pressure is 101,325 Pa. A sharp knife concentrates force for easier cutting.'
}

export default calcDef
