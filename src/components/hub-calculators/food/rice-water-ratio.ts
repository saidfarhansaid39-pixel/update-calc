import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'rice', label: 'Rice Amount', type: 'number', unit: 'g', min: 50, step: '10' },
      { name: 'type', label: 'Rice Variety', type: 'select', options: [{ label: 'White (1:1.5)', value: '1.5' }, { label: 'Brown (1:2)', value: '2' }, { label: 'Jasmine (1:1.25)', value: '1.25' }, { label: 'Basmati (1:1.5)', value: '1.5' }, { label: 'Sushi (1:1.1)', value: '1.1' }, { label: 'Wild (1:3)', value: '3' }] }
    ],
    compute: (v) => {
      const r = parseFloat(v.type); const water = v.rice * r; return { result: water, label: 'Water Needed', unit: 'mL', steps: [{ label: 'Rice', value: v.rice + ' g' }, { label: 'Ratio', value: '1:' + r }, { label: 'Water', value: water.toFixed(0) + ' mL' }, { label: 'Cook', value: r > 2 ? '40-50 min' : r > 1.5 ? '18-20 min' : '12-15 min' }] }
    },
    description: 'Perfect rice-to-water ratios. White 1:1.5, brown 1:2, sushi 1:1.1.',
    example: { label: '200g jasmine rice', value: '250mL water' }
}

export default calcDef
