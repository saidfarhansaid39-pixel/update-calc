import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'weight', label: 'Food Weight', type: 'number', unit: 'g', min: 100, step: '50' },
      { name: 'foodType', label: 'Food Type', type: 'select', options: [
        { label: 'Whole chicken (45 min/kg + 20 min)', value: 'chicken' },
        { label: 'Beef roast (30 min/kg for rare, +15 for medium)', value: 'beef' },
        { label: 'Pork roast (35 min/kg + 25 min)', value: 'pork' },
        { label: 'Boned turkey (40 min/kg + 30 min)', value: 'turkey' },
        { label: 'Fish fillet (10 min at 200°C, no rest)', value: 'fish' },
        { label: 'Roasted vegetables (25 min at 200°C)', value: 'veggies' },
        { label: 'Potatoes whole (45 min at 200°C)', value: 'potatoes' },
      ] },
    ],
    compute: (v) => {
      const ovenDefs: Record<string, [number, number, number]> = { chicken: [45, 20, 74], beef: [30, 15, 57], pork: [35, 25, 71], turkey: [40, 30, 74], fish: [10, 0, 63], veggies: [25, 0, 0], potatoes: [45, 0, 0] }
      const [minPerKg, extra, rest] = ovenDefs[v.foodType] || [45, 20, 10]
      const mins = (v.weight / 1000) * minPerKg + extra
      return { result: mins, label: 'Oven Time', unit: 'min', steps: [
        { label: 'Weight', value: `${v.weight} g (${(v.weight / 1000).toFixed(2)} kg)` },
        { label: 'Base time', value: `${minPerKg} min/kg` },
        { label: 'Additional', value: `${extra > 0 ? extra + ' min extra' : 'none'}` },
        { label: 'Total oven time', value: `~${mins.toFixed(0)} min` },
        { label: 'Rest time', value: `${rest} min before carving` },
      ]}
    },
    description: 'Calculate oven roasting times based on food weight and type. Always rest meat before carving — this allows juices to redistribute for a more tender result.',
    example: { label: '2kg chicken', value: '~110 min oven + 10 min rest' }
}

export default calcDef
