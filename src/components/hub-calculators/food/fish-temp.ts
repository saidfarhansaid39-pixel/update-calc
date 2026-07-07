import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'type', label: 'Fish Type', type: 'select', options: [{ label: 'White fish (63°C / 145°F)', value: '63_white' }, { label: 'Salmon (52-57°C / 125-135°F)', value: '57_salmon' }, { label: 'Tuna rare (47°C / 115°F)', value: '47_tuna' }, { label: 'Shellfish (63°C / 145°F)', value: '63_shellfish' }] },
      { name: 'thickness', label: 'Thickness', type: 'select', options: [{ label: '1 cm (thin)', value: '1' }, { label: '2.5 cm (med)', value: '2.5' }, { label: '4 cm+ (thick)', value: '4' }] }
    ],
    compute: (v) => {
      const p = v.type.split('_'); const tc = parseFloat(p[0]); const tf = tc * 9/5 + 32; const time = parseFloat(v.thickness) * 6; return { result: tc, label: 'Target Temp', unit: '°C', steps: [{ label: 'Fish', value: p.slice(1).join(' ') }, { label: 'Temp', value: tc + '°C / ' + tf.toFixed(0) + '°F' }, { label: 'Thickness', value: v.thickness + ' cm' }, { label: 'Cook time', value: time.toFixed(0) + ' min' }, { label: 'Test', value: 'Flakes easily with fork' }] }
    },
    description: 'Fish cooking temperatures. Salmon is best at medium (52-57°C); white fish at 63°C.',
    example: { label: '2.5cm salmon fillet', value: '57°C (135°F), ~15 min' }
}

export default calcDef
