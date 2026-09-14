import { z } from 'zod'
import { step } from '../../../lib/hub-helpers'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ Th: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), Tc: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [{ name: 'Th', label: 'Hot Reservoir T_h', type: 'number', unit: 'K', min: 1, step: '1' }, { name: 'Tc', label: 'Cold Reservoir T_c', type: 'number', unit: 'K', min: 1, step: '1' }],
  defaults: { Th: '1', Tc: '1' },
  presets: [
    { label: 'Standard example 1', values: { Th: '1', Tc: '1' } },
    { label: 'Standard example 2', values: { Th: '10', Tc: '10' } },
    { label: 'Standard example 3', values: { Th: '100', Tc: '100' } },
  ],
  compute: (v) => { const eff = 1 - v.Tc / v.Th; const copR = v.Tc / (v.Th - v.Tc); const copHP = v.Th / (v.Th - v.Tc); return { result: eff, label: 'Carnot Efficiency η_carnot', unit: '', steps: [{ label: 'Formula', value: 'η_carnot = 1 - T_c/T_h' }, { label: 'Efficiency', value: `${(eff * 100).toFixed(1)}%` }, { label: 'COP (refrigerator)', value: `${copR.toFixed(2)}` }, { label: 'COP (heat pump)', value: `${copHP.toFixed(2)}` }] ,
    extras: [
        { label: 'Real-World Application', value: 'This physics principle applies to real-world systems and engineering problems. Understanding the relationship between variables enables precise predictions.' },
        { label: 'Precision Tip', value: 'Always verify units are consistent before calculating. Convert all inputs to appropriate SI units first to ensure correct results.' },
        { label: 'Common Values', value: 'Standard reference values are available in physics handbooks. Verify expected order of magnitude matches known physical constants.' },
        { label: 'Related Formula', value: 'This formula relates to other fundamental physics equations. Cross-check results using alternative approaches when possible.' },
        { label: 'Unit Conversion Note', value: 'Ensure SI units throughout. Use scientific notation for very large or small numbers. Check that units cancel correctly.' }
      ]} },
  description: 'The Carnot cycle is the most efficient heat engine cycle possible between two temperatures. No real engine can exceed η_carnot = 1 - T_c/T_h (Carnot\'s theorem).',
  formula: 'η_carnot = 1 - T_c / T_h',
  interpretation: 'For T_h = 500 K, T_c = 300 K, η_max = 40%. To increase efficiency, raise T_h or lower T_c. Real engines achieve ~50-80% of Carnot efficiency due to irreversibilities.'
}

export default calcDef
