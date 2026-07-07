import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ digit1: z.string().min(1), digit2: z.string().min(1), multiplier: z.string().min(1), tolerance: z.string().min(1) }),
  fields: [
    { name: 'digit1', label: 'First Band', type: 'select', options: [{ label: 'Black (0)', value: '0' }, { label: 'Brown (1)', value: '1' }, { label: 'Red (2)', value: '2' }, { label: 'Orange (3)', value: '3' }, { label: 'Yellow (4)', value: '4' }, { label: 'Green (5)', value: '5' }, { label: 'Blue (6)', value: '6' }, { label: 'Violet (7)', value: '7' }, { label: 'Gray (8)', value: '8' }, { label: 'White (9)', value: '9' }] },
    { name: 'digit2', label: 'Second Band', type: 'select', options: [{ label: 'Black (0)', value: '0' }, { label: 'Brown (1)', value: '1' }, { label: 'Red (2)', value: '2' }, { label: 'Orange (3)', value: '3' }, { label: 'Yellow (4)', value: '4' }, { label: 'Green (5)', value: '5' }, { label: 'Blue (6)', value: '6' }, { label: 'Violet (7)', value: '7' }, { label: 'Gray (8)', value: '8' }, { label: 'White (9)', value: '9' }] },
    { name: 'multiplier', label: 'Multiplier Band', type: 'select', options: [{ label: 'Black (×1)', value: '1' }, { label: 'Brown (×10)', value: '10' }, { label: 'Red (×100)', value: '100' }, { label: 'Orange (×1k)', value: '1000' }, { label: 'Yellow (×10k)', value: '10000' }, { label: 'Green (×100k)', value: '100000' }, { label: 'Blue (×1M)', value: '1000000' }] },
    { name: 'tolerance', label: 'Tolerance Band', type: 'select', options: [{ label: 'Brown (±1%)', value: '1' }, { label: 'Red (±2%)', value: '2' }, { label: 'Gold (±5%)', value: '5' }, { label: 'Silver (±10%)', value: '10' }, { label: 'None (±20%)', value: '20' }] },
  ],
  compute: (v) => { const val = (parseInt(v.digit1) * 10 + parseInt(v.digit2)) * parseInt(v.multiplier); return { result: val, label: 'Resistance', unit: 'ohm', steps: [{ label: 'Digits', value: `${v.digit1}${v.digit2}` }, { label: 'Multiplier', value: `×${parseInt(v.multiplier)}` }, { label: 'Resistance', value: `${val >= 1000000 ? (val / 1000000).toFixed(1) + ' M' : val >= 1000 ? (val / 1000).toFixed(1) + ' k' : val} ohm` }, { label: 'Tolerance', value: `±${v.tolerance}%` }] } },
  description: 'Decode the resistance value of a 4-band resistor using the color code chart.',
  formula: 'R = (D1D2) × M ± T%',
  interpretation: 'First two bands are significant digits, third is multiplier, fourth is tolerance. Gold = ±5%, Silver = ±10%.'
}

export default calcDef
