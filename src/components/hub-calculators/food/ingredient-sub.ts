import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'original', label: 'Original Amount', type: 'number', min: 0, step: '0.25' },
      { name: 'ratio', label: 'Substitution Ratio', type: 'number', min: 0, step: '0.01', unit: '×' },
    ],
    compute: (v) => ({ result: v.original * v.ratio, label: 'Substitution Amount', unit: 'units', steps: [
      { label: 'Original amount', value: `${v.original}` },
      { label: 'Substitution ratio', value: `${v.ratio}×` },
      { label: 'Amount needed', value: `${(v.original * v.ratio).toFixed(2)}` },
    ]}),
    description: 'Calculate how much of a substitute ingredient to use based on the original amount and conversion ratio. Common ratios: honey→sugar (0.75×), oil→butter (0.8×).',
    example: { label: '100g sugar → honey (ratio 0.75)', value: '75g honey' }
}

export default calcDef
