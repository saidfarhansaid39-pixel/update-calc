import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

function getMeatTemp(type: string): string {
  const map: Record<string, string> = { 'steak rare': '49°C/120°F', 'steak medium rare': '54°C/130°F', 'steak medium': '60°C/140°F', 'steak medium well': '66°C/150°F', 'steak well done': '71°C/160°F', chicken: '74°C/165°F', pork: '63°C/145°F', sausages: '71°C/160°F', 'fish fillet': '63°C/145°F', lamb: '63°C/145°F' }
  return map[type.toLowerCase()] || 'Use meat thermometer'
}

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Meat Weight', type: 'number', unit: 'g', units: [{ value: 'g', label: 'g' }, { value: 'oz', label: 'oz' }, { value: 'lb', label: 'lb' }], defaultUnit: 'g', min: 100, step: '50' },
      { name: 'meatType', label: 'Meat Type', type: 'select', options: [
        { label: 'Steak (rare) — 8 min total', value: '8_steak' }, { label: 'Steak (medium) — 12 min total', value: '12_steak' },
        { label: 'Steak (well done) — 16 min total', value: '16_steak' }, { label: 'Chicken breast — 10 min/100g', value: '10_chicken' },
        { label: 'Pork chop — 8 min/100g', value: '8_pork' }, { label: 'Sausages — 15 min total', value: 'fixed_15' },
        { label: 'Fish fillet — 8 min total', value: 'fixed_8' }, { label: 'Lamb chop — 6 min/100g', value: '6_lamb' },
      ] },
    ],
    compute: (v) => {
      const parts = v.meatType.split('_'); const factor = parseFloat(parts[0])
      const isFixed = parts[1] === 'fixed'
      const minTotal = isFixed ? factor : (v.weight / 100) * factor
      return { result: minTotal, label: 'Grill Time', unit: 'min', steps: [
        { label: 'Meat weight', value: `${v.weight}g` },
        { label: 'Type/doneness', value: `${parts.slice(1).join(' ')}` },
        { label: 'Total grill time', value: `~${minTotal.toFixed(0)} min (flip halfway)` },
        { label: 'Internal temp target', value: getMeatTemp(parts.slice(1).join(' ')) },
      ]}
    },
    description: 'Calculate perfect BBQ grilling times based on meat type, weight, and desired doneness. Always verify with a meat thermometer for food safety.',
    example: { label: '250g steak, medium', value: '~12 min grill time' }
}

export default calcDef
