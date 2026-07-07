import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ P: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), V: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'P', label: 'Pressure P', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 'V', label: 'Volume V', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }, { name: 'T', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'n', label: 'Moles n', type: 'number', unit: 'mol', min: 0.01, step: '0.01' }],
  compute: (v) => { const R = 8.314; const a = 0.244; const b = 2.66e-5; const vm = v.V / v.n; const P_vdw = R * v.T / (vm - b) - a / (vm * vm); const dev = Math.abs(P_vdw - v.P) / v.P * 100; return { result: P_vdw, label: 'van der Waals Pressure', unit: 'Pa', steps: [{ label: 'Formula', value: '(P + a(n/V)²)(V − nb) = nRT' }, { label: 'Molar volume', value: `${vm.toExponential(4)} m³/mol` }, { label: 'vW Pressure', value: `${P_vdw.toExponential(4)} Pa` }, { label: 'Deviation from ideal', value: `${dev.toFixed(2)}%` }] } },
  description: 'The van der Waals equation accounts for intermolecular forces (a) and finite molecular size (b) in real gases. Uses CO₂ parameters by default (a = 0.244 Pa·m⁶/mol², b = 2.66×10⁻⁵ m³/mol).',
  formula: '(P + a(n/V)²)(V − nb) = nRT',
  interpretation: 'At high T and low P, vdW reduces to ideal gas law. Near the critical point, real gases deviate significantly. The vdW equation predicts liquid-vapor phase transitions below the critical temperature.'
}

export default calcDef
