import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ roomW: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomL: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), roomH: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), doors: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), windows: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), coats: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'roomW', label: 'Room Width (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomL', label: 'Room Length (ft)', type: 'number', min: 1, step: '1' },
    { name: 'roomH', label: 'Room Height (ft)', type: 'number', min: 1, step: '1' },
    { name: 'doors', label: 'Number of Doors', type: 'number', min: 0, step: '1' },
    { name: 'windows', label: 'Number of Windows', type: 'number', min: 0, step: '1' },
    { name: 'coats', label: 'Coats of Paint', type: 'number', min: 1, step: '1' },
  ],
  defaults: { roomW: '12', roomL: '14', roomH: '9', doors: '2', windows: '2', coats: '2' },
  presets: [
    { label: 'Small Bedroom', values: { roomW: '10', roomL: '12', roomH: '8', doors: '1', windows: '1', coats: '2' } },
    { label: 'Living Room', values: { roomW: '16', roomL: '20', roomH: '9', doors: '2', windows: '3', coats: '2' } },
    { label: 'Accent Wall Only', values: { roomW: '12', roomL: '1', roomH: '9', doors: '0', windows: '0', coats: '2' } },
    { label: 'Dark Color Cover-Up', values: { roomW: '12', roomL: '14', roomH: '9', doors: '2', windows: '2', coats: '3' } },
  ],
  compute: (v) => { const wallArea = 2 * (v.roomW + v.roomL) * v.roomH; const doorArea = v.doors * 20; const windowArea = v.windows * 15; const netArea = wallArea - doorArea - windowArea; const ceilingArea = v.roomW * v.roomL; const totalArea = (netArea + ceilingArea) * v.coats; const gallons = totalArea / 400; const totalGallons = Math.ceil(gallons); return { result: totalGallons, label: 'Paint Needed', unit: 'gallons', steps: [
    { label: 'Wall Perimeter', value: `2 × (${v.roomW} + ${v.roomL}) = ${(2 * (v.roomW + v.roomL)).toFixed(0)} ft` },
    { label: 'Gross Wall Area', value: `${(2 * (v.roomW + v.roomL)).toFixed(0)} ft × ${v.roomH} ft = ${wallArea.toFixed(0)} sq ft` },
    { label: 'Minus Doors (20 sq ft each)', value: `${wallArea.toFixed(0)} - ${doorArea.toFixed(0)} = ${(wallArea - doorArea).toFixed(0)} sq ft` },
    { label: 'Minus Windows (15 sq ft each)', value: `${(wallArea - doorArea).toFixed(0)} - ${windowArea.toFixed(0)} = ${netArea.toFixed(0)} sq ft` },
    { label: 'Add Ceiling', value: `${netArea.toFixed(0)} + ${ceilingArea.toFixed(0)} = ${(netArea + ceilingArea).toFixed(0)} sq ft` },
    { label: `Multiply by ${v.coats} Coat(s)`, value: `${(netArea + ceilingArea).toFixed(0)} × ${v.coats} = ${totalArea.toFixed(0)} sq ft` },
    { label: 'Divide by 400 sq ft/gal', value: `${totalArea.toFixed(0)} / 400 = ${gallons.toFixed(2)} gal` },
    { label: 'Round Up', value: `${totalGallons} gallon(s) needed` },
  ] ,
    extras: [
      { label: 'Primer Counts', value: 'Primer is a full coat. Use 1 coat primer + 2 coats paint for best coverage, especially over dark walls.' },
      { label: 'Textured Walls', value: 'Textured surfaces (popcorn, knockdown) need 20% more paint — add 0.8 gal per 400 sq ft.' },
      { label: 'Color Change Factor', value: 'Going from dark to light needs 3-4 coats. Light to dark needs 2-3 coats.' },
      { label: 'Cost Per Gallon', value: 'Paint ranges $20-60/gal (economy), $40-80/gal (mid-grade), $60-120/gal (premium).' },
      { label: 'Batch Matching', value: 'Buy all paint at once — computer color matching varies slightly between batches.' },
      { label: 'Waste Buffer', value: 'Add 10% for roller waste, touch-ups, and future repairs.' },
      { label: 'Coverage Note', value: 'Actual coverage varies by surface porosity. Drywall absorbs more than previously painted surfaces.' },
      { label: 'Tools Cost', value: 'Factor in rollers ($5-15), brushes ($8-20), drop cloths ($10-25), tape ($5-10).' },
    ]} },
  description: 'Calculate exactly how much paint you need for any room based on dimensions, doors, windows, and number of coats. Accounts for walls, ceiling, and subtracts openings for accurate estimates.',
  formula: 'Gallons = Ceil([(2 × (RoomW + RoomL) × RoomH − Doors × 20 − Windows × 15 + RoomW × RoomL) × Coats] / 400)',
  interpretation: 'One gallon covers ~400 sq ft on smooth surfaces. A standard 12x14 ft bedroom with 9 ft ceilings, 2 doors, 2 windows, and 2 coats needs about 3 gallons. Primer counts as a coat. Dark colors and textured walls increase paint needs by 20-50%. Buy premium paint — it covers better and lasts longer, saving money long-term.'
}

export default calcDef
