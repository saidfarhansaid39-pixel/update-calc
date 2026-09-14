import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ratio: z.string().min(1).refine(v => { const n = parseFloat(v); return n > 0 && n <= 1 }, '0-1') }),
  fields: [{ name: 'ratio', label: 'Remaining C-14 Fraction N/N₀', type: 'number', unit: '', min: 0.001, max: 1, step: '0.01' }],
  defaults: { remaining: '50', initial: '100' },
  presets: [
    { label: 'Ancient artifact (50% remaining)', values: { remaining: '50', initial: '100' } },
    { label: 'Egyptian mummy (68% remaining)', values: { remaining: '68', initial: '100' } },
    { label: 'Ice age sample (25% remaining)', values: { remaining: '25', initial: '100' } },
  ],
  compute: (v) => { const halfLife = 5730 * 365.25 * 24 * 3600; const lambda = Math.LN2 / halfLife; const t = -Math.log(v.ratio) / lambda; const years = t / (365.25 * 24 * 3600); return { result: years, label: 'Age', unit: 'years', steps: [{ label: 'Formula', value: 't = -ln(N/N₀)/λ' }, { label: 'C-14 half-life', value: '5730 years' }, { label: 'Elapsed time', value: `${years.toFixed(0)} years` }] ,
    extras: [
        { label: 'Real-World Application', value: 'Carbon-14 dating determines the age of organic materials up to ~50,000 years. Used for archaeological artifacts, fossils, and climate records.' },
        { label: 'Common Values', value: 'C-14 half-life: 5730 yr. Dead organism: C-14 decays without replenishment. Shroud of Turin (dated to 1260-1390 AD). Dead Sea Scrolls: ~2000 yr.' },
        { label: 'Precision Tip', value: 'Carbon dating assumes constant atmospheric C-14 levels. Calibration curves correct for variations. Limit: ~50,000 yr (beyond, too little C-14).' },
        { label: 'Related Formula', value: 't = -(t_½/ln2) × ln(N/N₀). N/N₀ = 2^(-t/t_½). λ = ln(2)/5730 yr⁻¹. Libby half-life: 5568 yr (original).' },
        { label: 'Unit Conversion Note', value: 'Result in years. Enter remaining as percentage (e.g., 50 for 50%). Half-life: 5730 years (Cambridge convention).' }
      ]} },
  description: 'Radiocarbon dating measures the age of organic materials by comparing the remaining Carbon-14 fraction to the original atmospheric level.',
  formula: 't = -1/λ · ln(N/N₀), λ = ln(2)/5730 yr',
  interpretation: 'C-14 has a half-life of 5730 years. The method is reliable up to ~50,000 years. C-14 is constantly produced in the upper atmosphere by cosmic rays. After death, no new C-14 is absorbed.'
}

export default calcDef
