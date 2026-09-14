import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ r: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), rc: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), gamma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'r', label: 'Compression Ratio r', type: 'number', unit: '', min: 1.1, step: '0.1' }, { name: 'rc', label: 'Cutoff Ratio r_c', type: 'number', unit: '', min: 1.1, step: '0.1' }, { name: 'gamma', label: 'Specific Heat Ratio γ', type: 'number', unit: '', min: 1.1, step: '0.01' }],
  defaults: { r: '1', rc: '1', gamma: '1' },
  presets: [
    { label: 'Standard example 1', values: { r: '1', rc: '1', gamma: '1' } },
    { label: 'Standard example 2', values: { r: '10', rc: '10', gamma: '10' } },
    { label: 'Standard example 3', values: { r: '100', rc: '100', gamma: '100' } },
  ],
  compute: (v) => { const invR = Math.pow(v.r, -(v.gamma - 1)); const eff = 1 - invR * (Math.pow(v.rc, v.gamma) - 1) / (v.gamma * (v.rc - 1)); return { result: eff, label: 'Diesel Cycle Efficiency η_diesel', unit: '', steps: [{ label: 'Formula', value: 'η = 1 - (1/r^(γ-1))·(r_c^γ-1)/(γ(r_c-1))' }, { label: 'Result', value: `${(eff * 100).toFixed(1)}%` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Diesel cycle models the ideal compression-ignition engine. Unlike the Otto cycle, heat is added at constant pressure, not constant volume.',
  formula: 'η = 1 - (1/r^(γ-1))·(r_c^γ-1)/(γ(r_c-1))',
  interpretation: 'Diesel engines have higher compression ratios (r ≈ 14-25) than gasoline engines, giving higher efficiency. Typical η ≈ 50-60% for ideal cycle. The cutoff ratio r_c = V₃/V₂ describes the constant-pressure combustion phase.'
}

export default calcDef
