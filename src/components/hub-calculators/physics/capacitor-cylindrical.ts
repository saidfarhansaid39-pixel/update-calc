import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), innerR: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), outerR: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'length', label: 'Length', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'innerR', label: 'Inner Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }, { name: 'outerR', label: 'Outer Radius', type: 'number', unit: 'm', min: 0.001, step: '0.001' }],
  defaults: { area: '0.01', distance: '0.001' },
  presets: [
    { label: 'Parallel plate (1 m², 1 mm gap)', values: { area: '1', distance: '0.001' } },
    { label: 'Ceramic capacitor (10 μF)', values: { charge: '0.00005', voltage: '5' } },
    { label: 'Electrolytic (470 μF, 16 V)', values: { charge: '0.00752', voltage: '16' } },
  ],
  compute: (v) => { const eps0 = 8.854e-12; const C = 2 * Math.PI * eps0 * v.length / Math.log(v.outerR / v.innerR); return { result: C, label: 'Capacitance', unit: 'F', steps: [{ label: 'Formula', value: 'C = 2πϵ0L/ln(b/a)' }, { label: 'ϵ0', value: '8.854×10^-12 F/m' }, { label: 'Result', value: `${C.toExponential(4)} F` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Capacitors are essential in power supplies (smoothing), timing circuits (RC time constant), and camera flashes (rapid discharge).' },
        { label: 'Common Values', value: 'ε₀ = 8.854×10⁻¹² F/m. Ceramic: pF-nF range. Electrolytic: μF-mF range. Supercapacitors: up to farads. Typical USB decoupling: 100 nF.' },
        { label: 'Precision Tip', value: 'Parallel plate: C = ε₀ε_rA/d. Dielectric materials increase capacitance. Voltage rating must exceed circuit voltage to prevent breakdown.' },
        { label: 'Related Formula', value: 'Q = CV. Energy: E = ½CV² = ½QV. RC time constant: τ = RC. Capacitors in parallel: C_eq = C₁+C₂. In series: 1/C_eq = 1/C₁+1/C₂.' },
        { label: 'Unit Conversion Note', value: '1 F = 1 C/V. 1 μF = 10⁻⁶ F. 1 nF = 10⁻⁹ F. 1 pF = 10⁻¹² F. ε₀ = 8.854 × 10⁻¹² F/m.' }
      ]} },
  description: 'A cylindrical capacitor consists of two coaxial cylindrical conductors. Capacitance depends on length and radius ratio.',
  formula: 'C = 2πϵ0·L / ln(b/a)',
  interpretation: 'ϵ0 = 8.854×10^-12 F/m. The capacitance increases with length and decreases with larger radius ratio. Coaxial cables are cylindrical capacitors.'
}

export default calcDef
