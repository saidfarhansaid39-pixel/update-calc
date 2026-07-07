import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Meat Weight', type: 'number', unit: 'g', units: [{ value: 'g', label: 'g' }, { value: 'oz', label: 'oz' }, { value: 'lb', label: 'lb' }], defaultUnit: 'g', min: 100, step: '50' },
      { name: 'type', label: 'Grill Type', type: 'select', options: [
        { label: 'Gas grill (preheat 15 min)', value: '15' }, { label: 'Charcoal grill (preheat 30 min)', value: '30' },
        { label: 'Electric grill (preheat 10 min)', value: '10' },
      ] },
      { name: 'doneness', label: 'Doneness', type: 'select', options: [
        { label: 'Rare (52°C internal)', value: '8_52' }, { label: 'Medium-rare (57°C)', value: '12_57' },
        { label: 'Medium (63°C)', value: '16_63' }, { label: 'Medium-well (68°C)', value: '20_68' },
        { label: 'Well done (74°C)', value: '24_74' },
      ] },
    ],
    compute: (v) => {
      const parts = v.doneness.split('_'); const baseMin = parseFloat(parts[0]); const temp = parts[1]
      const timePer100g = baseMin / 2.5; const total = (v.weight / 100) * timePer100g
      return { result: total, label: 'Grill Time', unit: 'min', steps: [
        { label: 'Preheat', value: `${v.type} min` },
        { label: 'Weight', value: `${v.weight} g` },
        { label: 'Target internal temp', value: `${temp}°C` },
        { label: 'Total grill time', value: `${total.toFixed(0)} min total` },
        { label: 'Flip', value: 'Flip at halfway point' },
      ]}
    },
    description: 'Calculate total grilling time including preheat for gas, charcoal, or electric grills. Target internal temperatures ensure food safety and desired doneness.',
    example: { label: '300g steak, medium (63°C), gas grill', value: '~14 min + 15 min preheat' }
}

export default calcDef
