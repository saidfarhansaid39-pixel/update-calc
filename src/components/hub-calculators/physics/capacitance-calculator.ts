import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ area: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), separation: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), dielectric: z.string().min(1).refine(v => parseFloat(v) >= 1, '>0') }),
  fields: [{ name: 'area', label: 'Plate Area', type: 'number', unit: 'm^2', min: 1e-6, step: '1e-6' }, { name: 'separation', label: 'Plate Separation', type: 'number', unit: 'm', min: 1e-6, step: '1e-6' }, { name: 'dielectric', label: 'Dielectric Constant', type: 'number', unit: '', min: 1, step: '0.1' }],
  defaults: { area: '0.01', distance: '0.001' },
  presets: [
    { label: 'Parallel plate (1 m², 1 mm gap)', values: { area: '1', distance: '0.001' } },
    { label: 'Ceramic capacitor (10 μF)', values: { charge: '0.00005', voltage: '5' } },
    { label: 'Electrolytic (470 μF, 16 V)', values: { charge: '0.00752', voltage: '16' } },
  ],
  compute: (v) => { const eps0 = 8.854e-12; const C = v.dielectric * eps0 * v.area / v.separation; return { result: C, label: 'Capacitance', unit: 'F', steps: [{ label: 'Formula', value: 'C = κeps0A/d' }, { label: 'eps0', value: '8.854×10⁻¹^2 F/m' }, { label: 'Result', value: `${C.toExponential(4)} F` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Capacitors are essential in power supplies (smoothing), timing circuits (RC time constant), and camera flashes (rapid discharge).' },
        { label: 'Common Values', value: 'ε₀ = 8.854×10⁻¹² F/m. Ceramic: pF-nF range. Electrolytic: μF-mF range. Supercapacitors: up to farads. Typical USB decoupling: 100 nF.' },
        { label: 'Precision Tip', value: 'Parallel plate: C = ε₀ε_rA/d. Dielectric materials increase capacitance. Voltage rating must exceed circuit voltage to prevent breakdown.' },
        { label: 'Related Formula', value: 'Q = CV. Energy: E = ½CV² = ½QV. RC time constant: τ = RC. Capacitors in parallel: C_eq = C₁+C₂. In series: 1/C_eq = 1/C₁+1/C₂.' },
        { label: 'Unit Conversion Note', value: '1 F = 1 C/V. 1 μF = 10⁻⁶ F. 1 nF = 10⁻⁹ F. 1 pF = 10⁻¹² F. ε₀ = 8.854 × 10⁻¹² F/m.' }
      ]} },
  description: 'Capacitance of a parallel-plate capacitor depends on plate area, separation, and the dielectric material between them.',
  formula: 'C = κ·eps0·A / d',
  interpretation: 'eps0 = 8.854×10⁻¹^2 F/m. Dielectric constant κ = 1 for vacuum, ~80 for water. Capacitors store electrical energy as U = ½CV^2.'
}

export default calcDef
