import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'cut', label: 'Chicken Cut', type: 'select', options: [{ label: 'Whole (74°C breast)', value: '45_74_whole' }, { label: 'Breast (74°C)', value: '20_74_breast' }, { label: 'Thigh (82°C)', value: '35_82_thigh' }, { label: 'Ground (74°C)', value: '15_74_ground' }] },
      { name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }
    ],
    compute: (v) => {
      const p = v.cut.split('_'); const mp500 = parseFloat(p[0]); const tc = parseFloat(p[1]); const tf = tc * 9/5 + 32; const time = (v.weight / 500) * mp500; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Cut', value: p.slice(2).join(' ') }, { label: 'Temp', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Cook time', value: time.toFixed(0) + ' min' }, { label: 'Rest', value: 'Rest 5-10 min' }] }
    },
    description: 'Safe internal chicken temperatures. USDA: 74°C (165°F) for all poultry.',
    example: { label: 'Whole 2kg chicken', value: '74°C breast, ~90 min' }
}

export default calcDef
