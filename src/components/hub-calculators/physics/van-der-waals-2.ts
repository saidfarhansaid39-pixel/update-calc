import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ P: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), V: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), T: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), n: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'P', label: 'Pressure P', type: 'number', unit: 'Pa', min: 100, step: '100' }, { name: 'V', label: 'Volume V', type: 'number', unit: 'm³', min: 0.001, step: '0.001' }, { name: 'T', label: 'Temperature T', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'n', label: 'Moles n', type: 'number', unit: 'mol', min: 0.01, step: '0.01' }],
  defaults: { P: '1', V: '1', T: '1', n: '1' },
  presets: [
    { label: 'Standard example 1', values: { P: '1', V: '1', T: '1', n: '1' } },
    { label: 'Standard example 2', values: { P: '10', V: '10', T: '10', n: '10' } },
    { label: 'Standard example 3', values: { P: '100', V: '100', T: '100', n: '100' } },
  ],
  compute: (v) => { const R = 8.314; const a = 0.244; const b = 2.66e-5; const vm = v.V / v.n; const P_vdw = R * v.T / (vm - b) - a / (vm * vm); const dev = Math.abs(P_vdw - v.P) / v.P * 100; return { result: P_vdw, label: 'van der Waals Pressure', unit: 'Pa', steps: [{ label: 'Formula', value: '(P + a(n/V)²)(V − nb) = nRT' }, { label: 'Molar volume', value: `${vm.toExponential(4)} m³/mol` }, { label: 'vW Pressure', value: `${P_vdw.toExponential(4)} Pa` }, { label: 'Deviation from ideal', value: `${dev.toFixed(2)}%` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The van der Waals equation accounts for intermolecular forces (a) and finite molecular size (b) in real gases. Uses CO₂ parameters by default (a = 0.244 Pa·m⁶/mol², b = 2.66×10⁻⁵ m³/mol).',
  formula: '(P + a(n/V)²)(V − nb) = nRT',
  interpretation: 'At high T and low P, vdW reduces to ideal gas law. Near the critical point, real gases deviate significantly. The vdW equation predicts liquid-vapor phase transitions below the critical temperature.'
}

export default calcDef
