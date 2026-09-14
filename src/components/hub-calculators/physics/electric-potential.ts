import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ charge: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'charge', label: 'Charge', type: 'number', unit: 'C', min: 1e-9, step: '1e-9' }, { name: 'distance', label: 'Distance', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { charge: '1e-6', voltage: '9' },
  presets: [
    { label: 'Battery terminal (9 V, 1 μC)', values: { charge: '1e-6', voltage: '9' } },
    { label: 'Point charge (1 μC, 10 cm)', values: { charge: '1e-6', distance: '0.1' } },
    { label: 'Electron in 1 V potential', values: { charge: '1.6e-19', voltage: '1' } },
  ],
  compute: (v) => { const k = 8.988e9; const V = k * v.charge / v.distance; return { result: V, label: 'Electric Potential', unit: 'V', steps: [{ label: 'Formula', value: 'V = kq/r' }, { label: 'Substitute', value: `k × ${v.charge} / ${v.distance}` }, { label: 'Result', value: `${V.toExponential(4)} V` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Electric potential (voltage) drives current in circuits, enables battery operation, and determines energy of charged particles.' },
        { label: 'Common Values', value: 'V = k_e q/r (point charge). 1 V = 1 J/C. Battery: 1.5-12 V. Power line: 120-765 kV. Lightning: ~100 MV. Electron-volt: 1 eV = 1.602×10⁻¹⁹ J.' },
        { label: 'Precision Tip', value: 'Potential difference (voltage) matters, not absolute potential. Reference point (ground) is arbitrary — typically Earth at 0 V.' },
        { label: 'Related Formula', value: 'V = k_e q/r. E = -∇V. U = qV (potential energy). Power: P = IV. Ohm: V = IR. Capacitor: Q = CV.' },
        { label: 'Unit Conversion Note', value: '1 V = 1 J/C. 1 kV = 10³ V. 1 MV = 10⁶ V. 1 mV = 10⁻³ V. 1 μV = 10⁻⁶ V.' }
      ]} },
  description: 'Electric potential (voltage) at a distance from a point charge is the work per unit charge to bring a test charge from infinity.',
  formula: 'V = k·q / r',
  interpretation: 'Potential is a scalar quantity. 1 V = 1 J/C. Potential decreases with distance from a positive charge.'
}

export default calcDef
