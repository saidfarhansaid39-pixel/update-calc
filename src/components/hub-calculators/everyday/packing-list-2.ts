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
  defaults: { days: '7', destinations: '2', climate: 'mixed', activities: '1' },
  presets: [
    { label: 'Weekend City Break', values: { days: '3', destinations: '1', climate: 'hot', activities: '0' } },
    { label: '10-Day European Trip', values: { days: '10', destinations: '3', climate: 'mixed', activities: '1' } },
    { label: 'Ski Vacation', values: { days: '7', destinations: '1', climate: 'cold', activities: '2' } },
    { label: 'Tropical Beach Holiday', values: { days: '7', destinations: '1', climate: 'hot', activities: '1' } },
  ],
  compute: (v) => { const tops = Math.ceil(v.days / 2) + 1; const bottoms = Math.min(Math.ceil(v.days / 3) + 1, v.days); const underwear = v.days + 2; const socks = v.days + 1; const shoes = v.climate === 'cold' ? 3 : 2; const outerwear = v.climate === 'cold' ? 2 : v.climate === 'mixed' ? 1 : 0; const activityItems = v.activities * 2; const totalItems = tops + bottoms + underwear + socks + shoes + outerwear + activityItems; const bagSize = totalItems <= 20 ? 'Carry-on (40-45L)' : totalItems <= 35 ? 'Medium Checked (65L)' : 'Large Checked (85L+)'; return { result: totalItems, label: 'Total Packing Items', unit: 'items', steps: [
    { label: 'Tops (every 2 days + 1 spare)', value: `Ceil(${v.days}/2) + 1 = ${tops}` },
    { label: 'Bottoms (every 3 days)', value: `Min(Ceil(${v.days}/3) + 1, ${v.days}) = ${bottoms}` },
    { label: 'Underwear (days + 2 spares)', value: `${v.days} + 2 = ${underwear}` },
    { label: 'Socks (days + 1 spare)', value: `${v.days} + 1 = ${socks}` },
    { label: 'Shoes', value: `${shoes} pair(s)` },
    { label: 'Outerwear', value: `${outerwear} item(s)` },
    { label: 'Activity-Specific Gear', value: `${v.activities} activities × 2 = ${activityItems} items` },
    { label: 'Grand Total', value: `${totalItems} items — ${bagSize}` },
  ] ,
    extras: [
      { label: '3-1-1 Liquids Rule', value: 'TSA: 3.4 oz (100 ml) containers in 1 quart-sized bag, 1 bag per passenger for carry-on.' },
      { label: 'Roll vs Fold', value: 'Rolling saves 20% more space than folding for casual clothes. Fold formal wear to avoid wrinkles.' },
      { label: 'Packing Cubes', value: 'Packing cubes compress items 15-25% and keep your suitcase organized across multiple destinations.' },
      { label: 'Destination Multiplier', value: 'More destinations = more logistics. Use packing cubes per city and leave 20% bag space for souvenirs.' },
      { label: 'Laundry Strategy', value: `For a ${v.days}-day trip, doing laundry once can cut your packing load by ~40%.` },
      { label: 'Shoe Strategy', value: 'Wear bulkiest shoes while traveling. Stuff socks inside shoes to save space.' },
      { label: 'Climate-Specific', value: v.climate === 'cold' ? 'Layers are key: base (merino), mid (fleece), outer (shell).' : 'Light, breathable fabrics (linen, cotton, bamboo). Sun protection included.' },
      { label: 'Recommended Bag', value: `For ${totalItems} items, we recommend a ${bagSize}.` },
    ]} },
  description: 'Generate a complete packing list tailored to your trip duration, destinations, climate, and planned activities. Includes everything from tops and bottoms to activity-specific gear with recommended luggage size.',
  formula: 'Items = Ceil(Days/2)+1 Tops + Ceil(Days/3)+1 Bottoms + Days+2 Underwear + Days+1 Socks + Shoes(2-3) + Outerwear(0-2) + Activities×2',
  interpretation: 'Pack light with mix-and-match neutral colors. Roll clothes to save 20% more space. For a 7-day mixed-climate trip with 2 destinations, expect ~28 items — fits in a medium checked bag. Follow the TSA 3-1-1 liquids rule for carry-on. Leave 20% bag space for souvenirs.'
}

export default calcDef
