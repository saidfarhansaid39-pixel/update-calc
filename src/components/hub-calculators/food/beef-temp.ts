import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'doneness', label: 'Doneness', type: 'select', options: [{ label: 'Rare (52°C)', value: '52' }, { label: 'Medium-rare (57°C)', value: '57' }, { label: 'Medium (63°C)', value: '63' }, { label: 'Medium-well (68°C)', value: '68' }, { label: 'Well done (74°C)', value: '74' }] },
      { name: 'cut', label: 'Cut', type: 'select', options: [{ label: 'Steak (2.5cm)', value: '6' }, { label: 'Roast', value: '20' }] },
      { name: 'weight', label: 'Weight', type: 'number', unit: 'g', min: 100, step: '50' }
    ],
    compute: (v) => {
      const tc = parseFloat(v.doneness); const tf = tc * 9/5 + 32; const mp500 = parseFloat(v.cut); const time = (v.weight / 500) * mp500; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Doneness', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Weight', value: v.weight + ' g' }, { label: 'Cook time', value: time.toFixed(1) + ' min' }, { label: 'Rest', value: '5-10 min' }] }
    },
    description: 'Beef doneness temperatures. USDA: 63°C (145°F) for whole cuts with rest.',
    example: { label: '300g steak, medium-rare', value: '57°C (135°F), ~4 min' }
}

export default calcDef
