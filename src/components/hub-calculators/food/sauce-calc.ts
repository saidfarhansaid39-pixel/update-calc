import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Servings', type: 'number', min: 1, step: '1' },
      { name: 'type', label: 'Sauce Type', type: 'select', options: [{ label: 'Pan sauce (60 mL/serving)', value: '60' }, { label: 'Pasta sauce (120 mL/serving)', value: '120' }, { label: 'Dipping (30 mL/serving)', value: '30' }, { label: 'Gravy (80 mL/serving)', value: '80' }] }
    ],
    compute: (v) => {
      const t = v.servings * v.type; return { result: t, label: 'Total Sauce', unit: 'mL', steps: [{ label: 'Servings', value: v.servings }, { label: 'Per serving', value: v.type + ' mL' }, { label: 'Total', value: t + ' mL (' + (t / 250).toFixed(2) + ' cups)' }] }
    },
    description: 'Sauce quantities by type. Pasta sauce 120 mL/serving, pan sauce 60 mL, dipping 30 mL.',
    example: { label: '4 servings pasta sauce', value: '480 mL' }
}

export default calcDef
