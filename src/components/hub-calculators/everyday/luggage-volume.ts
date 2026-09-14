import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), height: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.string().min(1) }),
  defaults: { length: '22', width: '14', height: '9', unit: 'in' },
  presets: [
    { label: 'Carry-On Max', values: { length: '22', width: '14', height: '9', unit: 'in' } },
    { label: 'Checked Bag (US)', values: { length: '27', width: '21', height: '14', unit: 'in' } },
    { label: 'Euro Carry-On', values: { length: '21.7', width: '15.7', height: '7.9', unit: 'in' } },
  ],
  fields: [
    { name: 'length', label: 'Length', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width', type: 'number', min: 1, step: '1' },
    { name: 'height', label: 'Height', type: 'number', min: 1, step: '1' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }] },
  ],
  compute: (v) => {
    const L = parseFloat(v.length)||0; const W = parseFloat(v.width)||0; const H = parseFloat(v.height)||0
    let volLiters: number; let ln: number
    if (v.unit === 'in') {
      const cuIn = L * W * H
      volLiters = cuIn * 0.0163871
      ln = L + W + H
    } else {
      const cuCm = L * W * H
      volLiters = cuCm / 1000
      ln = (L + W + H) / 2.54
    }
    const carryOnLimit = 45; const checkedLimit = 158
    return { result: volLiters, label: 'Luggage Volume', unit: 'L', steps: [
      { label: `1. Dimensions (${v.unit})`, value: `${L} × ${W} × ${H} ${v.unit}` },
      { label: '2. Linear Total', value: `${L} + ${W} + ${H} = ${ln.toFixed(1)} ${v.unit === 'cm' ? 'cm / 2.54 = ' + (ln).toFixed(0) + ' in' : 'in'}` },
      { label: '3. Volume Calculation', value: `${v.unit === 'in' ? `${L}×${W}×${H} = ${(L*W*H).toFixed(0)} cu in × 0.016387` : `${L}×${W}×${H} = ${(L*W*H).toFixed(0)} cu cm / 1000`}` },
      { label: '4. Volume in Liters', value: `${volLiters.toFixed(1)} L` },
      { label: '5. Carry-On Check (≤45L)', value: volLiters <= carryOnLimit ? `✓ ${volLiters.toFixed(1)}L ≤ 45L — fits overhead bin` : `✗ ${volLiters.toFixed(1)}L > 45L — too large for carry-on` },
      { label: '6. Checked Check (≤158L)', value: volLiters <= checkedLimit ? `✓ ${volLiters.toFixed(1)}L ≤ 158L — within limits` : `✗ ${volLiters.toFixed(1)}L > 158L — oversized fee applies` },
    ] ,
    extras: [
      { label: 'Weight Limits', value: 'Carry-on weight: typically 15-22 lb (7-10 kg) internationally, no limit domestically. Checked: 50 lb (23 kg) standard, $50-100 for 51-70 lb.' },
      { label: 'Linear Inch Rule', value: 'US airlines use L+W+H: ≤45 in for carry-on, ≤62 in for checked. Even if volume fits, exceeding linear inches incurs fees.' },
      { label: 'International Variations', value: 'European carry-on: 21.7×15.7×7.9 in (55×40×20 cm). Asian airlines often stricter — check exact dimensions before booking.' },
      { label: 'Packing Cubes', value: 'Packing cubes save 15-20% space by compressing clothes and organizing contents. Roll clothes instead of folding for 30% more volume efficiency.' },
      { label: 'Liquids Rule', value: 'TSA allows 3.4 oz (100ml) per container in carry-on, all fitting in one quart-sized bag. Check liquids over 3.4 oz.' },
      { label: 'Compression Sacks', value: 'Vacuum compression bags reduce bulky items (jackets, sweaters) by 50-60% volume. Use for checked luggage only (too bulky for carry-on).' },
      { label: 'Overhead Bin Sizes', value: 'Actual overhead bin dimensions vary by aircraft. Boeing 737 bins fit 22×14×9 in. Airbus A380 bins are larger. Regional jets may be smaller.' },
      { label: 'Baggage Fee Calculator', value: 'Most US airlines charge $35-40 for first checked bag, $45-50 for second. Budget airlines: $50-100 each way. Credit cards often include free bags.' },
    ]}
  },
  description: 'Calculate luggage volume in liters and check if it meets airline carry-on and checked baggage size limits. Includes linear inch rules and airline-specific guidance.',
  formula: 'Volume(L) = (L×W×H in inches) × 0.016387. Or (L×W×H in cm) / 1000. Linear inches = L + W + H. Carry-on: ≤45L or ≤45 linear in. Checked: ≤158L or ≤62 linear in.',
  interpretation: 'Carry-on limit: ~45L (22×14×9 in or 55×40×20 cm). Checked limit: ~158L (62 linear inches = 27×21×14 in). Most airlines enforce linear inches (L+W+H) not just volume. Oversize fees: $75-200 per bag each way.'
}

export default calcDef
