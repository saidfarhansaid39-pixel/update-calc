import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Point Charge', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'distance', label: 'Distance from Charge', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { charge: '1e-6', distance: '0.01' },
  presets: [
    { label: 'Point charge (1 μC, 1 cm)', values: { charge: '1e-6', distance: '0.01' } },
    { label: 'Parallel plates (100 V, 1 mm)', values: { voltage: '100', distance: '0.001' } },
    { label: 'Electron field in H atom (0.053 nm)', values: { charge: '1.6e-19', distance: '5.3e-11' } },
  ],
  compute: (v) => { const k = 8.988e9; const E = k * v.charge / (v.distance * v.distance); return { result: E, label: 'Electric Field Strength', unit: 'N/C', steps: [{ label: 'Formula', value: 'E = kq/r^2' }, { label: 'k', value: '8.988×10^9 N·m^2/C^2' }, { label: 'Result', value: `${E.toExponential(4)} N/C` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Electric fields control everything from CRT displays to lightning strikes. Air breaks down at ~3×10⁶ V/m (dielectric breakdown).' },
        { label: 'Common Values', value: 'E = k_e q/r² for point charge. E = V/d for parallel plates. Air breakdown: ~3 MV/m. Earth\'s field: ~100 V/m (fair weather). Under power lines: ~10 kV/m.' },
        { label: 'Precision Tip', value: 'Electric field is a vector — direction is from + to -. For multiple charges, use superposition (vector sum of each field).' },
        { label: 'Related Formula', value: 'E = k_e q/r². E = -dV/dr (potential gradient). Gauss: ∮E·dA = Q/ε₀. F = qE (force on charge).' },
        { label: 'Unit Conversion Note', value: 'E in V/m = N/C. 1 V/m = 1 N/C. kV/m = 10³ V/m. MV/m = 10⁶ V/m.' }
      ]} },
  description: 'Electric field strength from a point charge decreases with the square of distance, following Coulomb\'s Law.',
  formula: 'E = k·q / r^2',
  interpretation: 'k = 8.988×10^9 N·m^2/C^2. Electric field is a vector pointing away from positive charges and toward negative charges. Units: N/C or V/m.'
}

export default calcDef
