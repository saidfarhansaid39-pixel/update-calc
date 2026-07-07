import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
    fields: [
      { name: 'purchased', label: 'Days Since Purchased', type: 'number', min: 0, step: '1' },
      { name: 'foodType', label: 'Food Type', type: 'select', options: [
        { label: 'Fresh meat/poultry (2-4 days)', value: '3' }, { label: 'Fresh fish (1-2 days)', value: '2' },
        { label: 'Dairy milk (5-7 days)', value: '6' }, { label: 'Eggs (21-35 days)', value: '28' },
        { label: 'Fresh vegetables (3-7 days)', value: '5' }, { label: 'Bread (3-7 days)', value: '5' },
        { label: 'Leftovers (3-4 days)', value: '3' }, { label: 'Frozen food (3-12 months)', value: '180' },
      ] },
    ],
    compute: (v) => { const shelfDays = Number(v.foodType); const remaining = Math.max(0, shelfDays - v.purchased); return { result: remaining, label: 'Days Remaining', unit: 'days', steps: [
      { label: 'Days since purchased', value: `${v.purchased}` },
      { label: 'Typical shelf life', value: `${shelfDays} days` },
      { label: 'Days remaining', value: `${remaining} days` },
      v.purchased > Number(v.foodType) ? { label: '⚠️ Warning', value: 'May be expired — check for spoilage before consuming' } : { label: 'Status', value: 'Still within safe consumption period' },
    ]}},
    description: 'Estimate remaining shelf life for common foods based on purchase date and typical storage duration. Always check for signs of spoilage before consuming.',
    example: { label: 'Fresh chicken purchased 3 days ago', value: '0-1 days remaining' }
}

export default calcDef
