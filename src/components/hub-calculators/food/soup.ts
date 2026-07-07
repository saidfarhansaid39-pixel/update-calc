import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'type', label: 'Soup Type', type: 'select', options: [
        { label: 'Broth/clear soup (250mL/serving)', value: '250' }, { label: 'Cream soup (300mL/serving)', value: '300' },
        { label: 'Hearty/chunky soup (350mL/serving)', value: '350' },
      ] },
    ],
    compute: (v) => ({ result: v.servings * v.type, label: 'Total Soup Volume', unit: 'mL', steps: [
      { label: 'Servings', value: `${v.servings}` },
      { label: 'Per serving', value: `${v.type} mL` },
      { label: 'Total soup needed', value: `${v.servings * v.type} mL (${((v.servings * v.type) / 1000).toFixed(2)} L)` },
    ]}),
    description: 'Calculate the right amount of soup for your group. Broth soups are lighter (250mL), creamy soups moderate (300mL), and hearty soups filling (350mL).',
    example: { label: '6 servings cream soup', value: '1,800 mL (1.8 L)' }
}

export default calcDef
