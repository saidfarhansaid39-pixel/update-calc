import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'servings', label: 'Caffeinated Drinks', type: 'number', min: 0, step: '1' },
      { name: 'type', label: 'Drink Type', type: 'select', options: [
        { label: 'Drip coffee (95mg/cup)', value: '95' }, { label: 'Espresso (63mg/shot)', value: '63' },
        { label: 'Black tea (47mg/cup)', value: '47' }, { label: 'Green tea (28mg/cup)', value: '28' },
        { label: 'Energy drink (80mg/can)', value: '80' }, { label: 'Cola (34mg/can)', value: '34' },
      ] },
      { name: 'weight', label: 'Body Weight', type: 'number', unit: 'kg', units: [{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }], defaultUnit: 'kg', min: 20, step: '0.1' },
    ],
    compute: (v) => {
      const total = v.servings * v.type; const safe = v.weight * 6; const ratio = Math.min(total / safe, 2)
      return { result: total, label: 'Total Caffeine', unit: 'mg', steps: [
        { label: 'Drinks consumed', value: `${v.servings} × ${v.type} mg each` },
        { label: 'Total caffeine', value: `${total} mg` },
        { label: 'Safe limit', value: `~${safe.toFixed(0)} mg (${v.weight} kg × 6 mg/kg)` },
        { label: total > safe ? '⚠️ Exceeds limit' : 'Within safe range', value: total > safe ? `Reduce by ${(total - safe).toFixed(0)} mg` : `${(safe - total).toFixed(0)} mg below limit` },
      ]}
    },
    description: 'Track caffeine consumption against recommended limits. Health authorities suggest up to 400 mg/day for most adults (about 4 cups of coffee), and no more than 6 mg/kg body weight.',
    example: { label: '3 cups drip coffee, 70kg', value: '285 mg — within safe limit' }
}

export default calcDef
