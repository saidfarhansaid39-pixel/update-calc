import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ length: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), width: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), depth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), limitLength: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unit: z.enum(['in', 'cm']) }),
  defaults: { length: '22', width: '14', depth: '9', unit: 'in', limitLength: '45' },
  presets: [
    { label: 'US Carry-On (45 in)', values: { length: '22', width: '14', depth: '9', unit: 'in', limitLength: '45' } },
    { label: 'US Checked Bag (62 in)', values: { length: '27', width: '21', depth: '14', unit: 'in', limitLength: '62' } },
    { label: 'Euro Carry-On (55 cm)', values: { length: '55', width: '40', depth: '20', unit: 'cm', limitLength: '115' } },
  ],
  fields: [
    { name: 'length', label: 'Length', type: 'number', min: 1, step: '1' },
    { name: 'width', label: 'Width', type: 'number', min: 1, step: '1' },
    { name: 'depth', label: 'Depth', type: 'number', min: 1, step: '1' },
    { name: 'unit', label: 'Unit', type: 'select', options: [{ label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }] },
    { name: 'limitLength', label: 'Max Linear Dimension (L+W+D)', type: 'number', min: 1, step: '10' },
  ],
  compute: (v) => { const L = parseFloat(v.length)||0; const W = parseFloat(v.width)||0; const D = parseFloat(v.depth)||0; const LL = parseFloat(v.limitLength)||0; const linear = L + W + D; const compliant = linear <= LL; const overBy = compliant ? 0 : linear - LL; return { result: linear, label: 'Total Linear', unit: v.unit, steps: [
    { label: '1. Length', value: `${L} ${v.unit}` },
    { label: '2. Add Width', value: `${L} + ${W} = ${(L+W).toFixed(1)} ${v.unit}` },
    { label: '3. Add Depth', value: `${(L+W).toFixed(1)} + ${D} = ${linear.toFixed(1)} ${v.unit} (L + W + D)` },
    { label: '4. Compare to Limit', value: `${linear.toFixed(1)} vs ${LL} ${v.unit}` },
    { label: '5. Status', value: compliant ? `✓ ${linear.toFixed(1)} ≤ ${LL} — Compliant` : `✗ ${linear.toFixed(1)} > ${LL} — Over by ${overBy.toFixed(1)} ${v.unit}` },
  ] ,
    extras: [
      { label: 'Airline Variations', value: 'Delta, United, American: 22×14×9 in carry-on, 62 linear in checked. Southwest: 24×16×10 in carry-on. Spirit/Frontier: strict 22×14×9 in.' },
      { label: 'Sizers at Gate', value: 'If your bag looks large, gate agents will ask you to fit it in a sizer. Packable duffels can expand beyond limits — be careful with full bags.' },
      { label: 'Personal Item', value: 'Most airlines allow a personal item (18×14×8 in) in addition to carry-on. Backpack, purse, or laptop bag fits this category.' },
      { label: 'Checked Bag Fees', value: 'First checked: $30-40 (US). Second: $40-50. Third: $150+. Oversized (63-115 in): $75-200 each way. Overweight (51-70 lb): $100-200.' },
      { label: 'Soft vs Hard Shell', value: 'Soft-sided bags can compress slightly to fit tight overhead bins. Hard shell offers better protection but no give in sizers.' },
      { label: 'International Flights', value: 'Intra-Europe carry-on: 55×40×20 cm (21.7×15.7×7.9 in). Asian low-cost carriers are often stricter — check each airline.' },
      { label: 'Gate Check', value: "If your bag is borderline, ask the gate agent to gate-check it for free. It'll be waiting at the jet bridge when you arrive." },
      { label: 'Measuring Tips', value: 'Measure your bag including wheels and handles — these count! A 24 in bag with 3 in wheels measures 27 in total.' },
    ]} },
  description: 'Check if your luggage meets airline size restrictions by calculating total linear dimensions (L + W + D). Includes airline-specific limits and fee guidance.',
  formula: 'Linear = L + W + D. Compliant if Linear ≤ Airline Limit. Standard limits: 45 in (carry-on), 62 in (checked), 115 cm (European checked). Wheels and handles count.',
  interpretation: 'Most US airlines: 62 linear inches (158 cm) for checked bags, 45 linear inches (22×14×9 in) for carry-on. Excess size fees: $75-200 per bag. Wheels and handles are included in measurements. Soft-sided bags offer more flexibility for overhead bins.'
}

export default calcDef
