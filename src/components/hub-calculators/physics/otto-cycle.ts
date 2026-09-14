import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ r: z.string().min(1).refine(v => parseFloat(v) > 1, '>1'), gamma: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'r', label: 'Compression Ratio r', type: 'number', unit: '', min: 1.1, step: '0.1' }, { name: 'gamma', label: 'Specific Heat Ratio γ', type: 'number', unit: '', min: 1.1, step: '0.01' }],
  defaults: { r: '1', gamma: '1' },
  presets: [
    { label: 'Standard example 1', values: { r: '1', gamma: '1' } },
    { label: 'Standard example 2', values: { r: '10', gamma: '10' } },
    { label: 'Standard example 3', values: { r: '100', gamma: '100' } },
  ],
  compute: (v) => { const eff = 1 - 1 / Math.pow(v.r, v.gamma - 1); return { result: eff, label: 'Otto Cycle Efficiency η_otto', unit: '', steps: [{ label: 'Formula', value: 'η = 1 - 1/r^(γ-1)' }, { label: 'Result', value: `${(eff * 100).toFixed(1)}%` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Otto cycle models the ideal gasoline engine. Efficiency depends on compression ratio r and specific heat ratio γ of the working fluid.',
  formula: 'η = 1 - 1/r^(γ-1)',
  interpretation: 'Typical modern gasoline engines have r ≈ 8-12 with γ ≈ 1.4 for air, giving η ≈ 56-63%. Real efficiency is lower due to friction, heat loss, and incomplete combustion. Higher r causes knocking (pre-ignition).'
}

export default calcDef
