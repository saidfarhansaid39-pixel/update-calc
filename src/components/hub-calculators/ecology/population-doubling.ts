import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'
import { step } from '../../../lib/hub-helpers'

const calcDef: CalcDef = {
  schema: z.object({ growthRate: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), time: z.string().optional() }),
  fields: [
    { name: 'growthRate', label: 'Growth rate (r, % per year)', type: 'number', step: '0.1' },
    { name: 'time', label: 'Time (years, for projection)', type: 'number', min: 1, step: '1' },
    ],
  presets: [
    { label: 'White-tailed deer (US)', values: { initial: '1000', birthRate: '35', deathRate: '25', years: '10' } },
    { label: 'Endangered wolf', values: { initial: '50', birthRate: '20', deathRate: '15', immig: '5', emig: '2', years: '20' } },
    { label: 'Invasive species', values: { initial: '100', birthRate: '80', deathRate: '30', years: '5' } },
    { label: 'Human population (global)', values: { initial: '8000000000', birthRate: '18', deathRate: '7', years: '50' } },
    { label: 'Sea otter recovery', values: { initial: '200', birthRate: '25', deathRate: '8', years: '15' } }
    ],
  compute: (v) => { const r = parseFloat(v.growthRate)/100; const t = parseInt(v.time)||10; const doublingTime = r>0?Math.LN2/r:Infinity; const factor = Math.exp(r*t); return { result: doublingTime===Infinity?-1:doublingTime, label: 'Population Doubling Time', unit: 'years', steps: [{ label: 'Growth rate r', value: `${v.growthRate}%/yr` }, { label: 't_d = ln(2)/r', value: doublingTime===Infinity?'N/A (declining)':`${doublingTime.toFixed(1)} yr` }, { label: 'After {t} years', value: factor>1?`×${factor.toFixed(2)} growth`:`×${factor.toFixed(2)} decline` }, { label: 'Rule of 70', value: `${(70/parseFloat(v.growthRate)).toFixed(1)} yr (approx)` }] ,
    extras: [
      { label: "Environmental Context", value: "Population growth rates determine species persistence, extinction risk, and the carrying capacity of ecosystems under environmental change." },
      { label: "Measurement Method", value: "Census data, mark-recapture, or remote sensing. Vital rates estimated from longitudinal studies, life tables, or matrix models." },
      { label: "Conservation Note", value: "Declining populations (r < 0) indicate extinction risk. Minimum viable population sizes typically range from 50 (short-term) to 500 (long-term)." },
      { label: "Typical Ranges", value: "Mammal r: 0.01-0.5/yr. Human ~1.1%/yr. Endangered species often have r < 0.02/yr. Doubling time = 70/r (%) in years." },
      { label: "Related Concepts", value: "Carrying capacity (K), logistic growth, Allee effect, source-sink dynamics, density dependence, metapopulation theory." }
    ]} },
  description: 'Doubling time is the period needed for a population to double in size at a constant growth rate. It follows from exponential growth: t_d = ln(2)/r.',
  formula: 't_d = ln(2)/r | Rule of 70: t_d ≈ 70/growth_rate_%',
  interpretation: 'A 1%/yr growth rate doubles population in ~70 years. A 2%/yr rate doubles in ~35 years. Negative rates mean population decline, not doubling.'
}

export default calcDef
