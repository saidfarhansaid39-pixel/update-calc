import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ Q: z.string().min(1).refine(v => parseFloat(v) !== 0, '≠0'), r: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'Q', label: 'Point Charge Q', type: 'number', unit: 'C', min: -1e-6, step: '1e-9' }, { name: 'r', label: 'Distance from Charge r', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { charge: '1e-6', voltage: '9' },
  presets: [
    { label: 'Battery terminal (9 V, 1 μC)', values: { charge: '1e-6', voltage: '9' } },
    { label: 'Point charge (1 μC, 10 cm)', values: { charge: '1e-6', distance: '0.1' } },
    { label: 'Electron in 1 V potential', values: { charge: '1.6e-19', voltage: '1' } },
  ],
  compute: (v) => { const k = 8.987551787e9; const V = k * v.Q / v.r; const E = k * Math.abs(v.Q) / (v.r * v.r); return { result: V, label: 'Electric Potential V', unit: 'V', steps: [{ label: 'Formula', value: 'V = kQ/r' }, { label: 'Field strength', value: `${E.toExponential(4)} N/C` }, { label: 'Potential', value: `${V.toExponential(4)} V` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Electric potential (voltage) drives current in circuits, enables battery operation, and determines energy of charged particles.' },
        { label: 'Common Values', value: 'V = k_e q/r (point charge). 1 V = 1 J/C. Battery: 1.5-12 V. Power line: 120-765 kV. Lightning: ~100 MV. Electron-volt: 1 eV = 1.602×10⁻¹⁹ J.' },
        { label: 'Precision Tip', value: 'Potential difference (voltage) matters, not absolute potential. Reference point (ground) is arbitrary — typically Earth at 0 V.' },
        { label: 'Related Formula', value: 'V = k_e q/r. E = -∇V. U = qV (potential energy). Power: P = IV. Ohm: V = IR. Capacitor: Q = CV.' },
        { label: 'Unit Conversion Note', value: '1 V = 1 J/C. 1 kV = 10³ V. 1 MV = 10⁶ V. 1 mV = 10⁻³ V. 1 μV = 10⁻⁶ V.' }
      ]} },
  description: 'Electric potential (voltage) at a distance r from a point charge Q. V = kQ/r where k = 8.99×10⁹ N·m²/C².',
  formula: 'V = kQ/r',
  interpretation: 'Positive charge creates positive potential; negative charge creates negative potential. Potential difference (voltage) drives current. A 1 C charge at 1 m gives V = 8.99×10⁹ V.'
}

export default calcDef
