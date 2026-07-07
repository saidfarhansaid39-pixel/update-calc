import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ value: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unitType: z.string().min(1) }),
  fields: [
    { name: 'value', label: 'Value to Convert', type: 'number', min: 0.01, step: '1' },
    { name: 'unitType', label: 'Conversion Type', type: 'select', options: [{ label: 'Inches → Centimeters', value: 'in-cm' }, { label: 'Feet → Meters', value: 'ft-m' }, { label: 'Miles → Kilometers', value: 'mi-km' }, { label: 'Pounds → Kilograms', value: 'lb-kg' }, { label: 'Gallons → Liters', value: 'gal-l' }, { label: 'Fahrenheit → Celsius', value: 'f-c' }] },
  ],
  compute: (v) => {
    const conversions: Record<string, { factor: (n: number) => number; label: string; unit: string }> = {
      'in-cm': { factor: n => n * 2.54, label: 'Centimeters', unit: 'cm' },
      'ft-m': { factor: n => n * 0.3048, label: 'Meters', unit: 'm' },
      'mi-km': { factor: n => n * 1.60934, label: 'Kilometers', unit: 'km' },
      'lb-kg': { factor: n => n * 0.453592, label: 'Kilograms', unit: 'kg' },
      'gal-l': { factor: n => n * 3.78541, label: 'Liters', unit: 'L' },
      'f-c': { factor: n => (n - 32) * 5 / 9, label: 'Celsius', unit: '°C' }
}
    const conv = conversions[v.unitType] || conversions['in-cm']
    const result = conv.factor(v.value)
    return { result, label: conv.label, unit: conv.unit, steps: [{ label: 'Conversion', value: `${v.value} → ${result.toFixed(4)} ${conv.unit}` }] }
  },
  description: 'Quick unit conversion between common imperial and metric units: length, weight, volume, and temperature.',
  formula: 'Varies by conversion: multiply or divide by the conversion factor. Example: in→cm × 2.54, lb→kg × 0.4536, °F→°C = (F-32)×5/9',
  interpretation: 'The US is one of three countries (with Liberia and Myanmar) that hasn\'t fully adopted the metric system. These conversions help with everyday measurements, recipes, and travel.'
}

export default calcDef
