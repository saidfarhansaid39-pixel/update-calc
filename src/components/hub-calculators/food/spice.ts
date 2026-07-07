import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'intensity', label: 'Spice Intensity', type: 'select', options: [
        { label: 'Mild (1g spice per serving)', value: '1' }, { label: 'Medium (2g per serving)', value: '2' },
        { label: 'Bold (3g per serving)', value: '3' }, { label: 'Extra bold (4g per serving)', value: '4' },
      ] },
    ],
    compute: (v) => ({ result: v.servings * v.intensity, label: 'Total Spice Blend', unit: 'g', steps: [
      { label: 'Servings', value: `${v.servings}` },
      { label: 'Intensity', value: `${v.intensity}g per serving` },
      { label: 'Total spice needed', value: `${(v.servings * v.intensity).toFixed(0)} g` },
    ]}),
    description: 'Calculate spice blend quantities. Start with 1-2g per serving for most dishes. For blends, divide total evenly among your chosen spices.',
    example: { label: '4 servings, medium intensity', value: '8g total spice blend' }
}

export default calcDef
