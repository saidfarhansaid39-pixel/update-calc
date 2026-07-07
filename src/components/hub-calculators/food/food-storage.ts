import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'days', label: 'Days Until Use', type: 'number', min: 0, step: '1' },
      { name: 'storage', label: 'Storage Method', type: 'select', options: [
        { label: 'Fridge (2-4°C)', value: '7' }, { label: 'Freezer (-18°C)', value: '90' },
        { label: 'Pantry (cool/dark)', value: '30' }, { label: 'Counter (room temp)', value: '3' },
      ] },
    ],
    compute: (v) => { const maxDays = Number(v.storage); const safe = v.days <= maxDays; return { result: safe ? v.days : maxDays, label: 'Safe Storage', unit: 'days', steps: [
      { label: 'Days until planned use', value: `${v.days} days` },
      { label: 'Max safe storage', value: `${maxDays} days` },
      { label: 'Result', value: safe ? `${v.days} days — within safe limit` : `${maxDays} days — exceeds safe limit!` },
    ]}},
    description: 'Check if your food will stay fresh based on storage method. General guidelines: fridge 7 days, freezer 90 days, pantry 30 days, counter 3 days.',
    example: { label: 'Cooked chicken, fridge, 5 days', value: 'Safe (within 7-day limit)' }
}

export default calcDef
