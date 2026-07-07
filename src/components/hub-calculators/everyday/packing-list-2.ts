import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ days: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), destinations: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), climate: z.enum(['hot', 'cold', 'mixed']), activities: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'days', label: 'Trip Duration (days)', type: 'number', min: 1, step: '1' },
    { name: 'destinations', label: 'Destinations', type: 'number', min: 1, step: '1' },
    { name: 'climate', label: 'Climate', type: 'select', options: [{ label: 'Hot/Warm', value: 'hot' }, { label: 'Cold/Cool', value: 'cold' }, { label: 'Mixed/Varied', value: 'mixed' }] },
    { name: 'activities', label: 'Special Activities (hiking, formal, etc.)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const tops = Math.ceil(v.days / 2) + 1; const bottoms = Math.min(Math.ceil(v.days / 3) + 1, v.days); const underwear = v.days + 2; const socks = v.days + 1; const shoes = v.climate === 'cold' ? 3 : 2; const outerwear = v.climate === 'cold' ? 2 : v.climate === 'mixed' ? 1 : 0; const activityItems = v.activities * 2; const totalItems = tops + bottoms + underwear + socks + shoes + outerwear + activityItems; return { result: totalItems, label: 'Packing List Items', unit: 'items', steps: [{ label: 'Tops', value: `${tops} (every 2 days + 1 spare)` }, { label: 'Bottoms', value: `${bottoms}` }, { label: 'Underwear + Socks', value: `${underwear + socks}` }, { label: 'Shoes', value: `${shoes} pairs` }, { label: 'Outerwear', value: `${outerwear}` }, { label: 'Activity Gear', value: `${activityItems} items` }, { label: 'Total Items', value: `${totalItems}` }] } },
  description: 'Generate a packing list item count based on trip duration, destinations, climate, and planned activities.',
  formula: 'Items = Ceil(Days/2)+1 tops + Ceil(Days/3)+1 bottoms + Days+2 underwear + Days+1 socks + Shoes + Outerwear + Activities×2',
  interpretation: 'Pack light: mix-and-match neutral colors. Roll clothes to save space. Follow the "3-1-1" liquids rule for carry-on. Leave 20% bag space for souvenirs.'
}

export default calcDef
