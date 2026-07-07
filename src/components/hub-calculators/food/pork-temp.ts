import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'doneness', label: 'Doneness', type: 'select', options: [{ label: 'Medium (63°C / 145°F)', value: '63' }, { label: 'Well done (71°C / 160°F)', value: '71' }] },
      { name: 'cut', label: 'Cut', type: 'select', options: [{ label: 'Chops (2.5cm)', value: '8' }, { label: 'Roast', value: '25' }, { label: 'Ground', value: '15' }] },
      { name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }
    ],
    compute: (v) => {
      const tc = parseFloat(v.doneness); const tf = tc * 9/5 + 32; const mp500 = parseFloat(v.cut); const time = (v.weight / 500) * mp500; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Doneness', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Cook time', value: time.toFixed(0) + ' min' }, { label: 'Rest', value: '3 min (chops) or 10 min (roast)' }] }
    },
    description: 'Pork temperatures. USDA: 63°C (145°F) with 3 min rest. Ground pork: 71°C (160°F).',
    example: { label: '200g pork chop, medium', value: '63°C (145°F), ~3 min' }
}

export default calcDef
