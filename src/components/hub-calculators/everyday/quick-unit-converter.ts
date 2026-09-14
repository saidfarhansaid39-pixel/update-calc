import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ value: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), unitType: z.string().min(1) }),
  fields: [
    { name: 'value', label: 'Value to Convert', type: 'number', min: 0.01, step: '1' },
    { name: 'unitType', label: 'Conversion Type', type: 'select', options: [{ label: 'Inches → Centimeters', value: 'in-cm' }, { label: 'Feet → Meters', value: 'ft-m' }, { label: 'Miles → Kilometers', value: 'mi-km' }, { label: 'Pounds → Kilograms', value: 'lb-kg' }, { label: 'Gallons → Liters', value: 'gal-l' }, { label: 'Fahrenheit → Celsius', value: 'f-c' }] },
  ],
  defaults: { value: '10', unitType: 'in-cm' },
  presets: [
    { label: '6-ft Person Height', values: { value: '6', unitType: 'ft-m' } },
    { label: '5-lb Bag of Flour', values: { value: '5', unitType: 'lb-kg' } },
    { label: '100-mi Road Trip', values: { value: '100', unitType: 'mi-km' } },
    { label: 'Body Temp 98.6°F', values: { value: '98.6', unitType: 'f-c' } },
  ],
  compute: (v) => {
    const conversions: Record<string, { factor: (n: number) => number; label: string; unit: string; display: string }> = {
      'in-cm': { factor: n => n * 2.54, label: 'Centimeters', unit: 'cm', display: 'Inches → Centimeters' },
      'ft-m': { factor: n => n * 0.3048, label: 'Meters', unit: 'm', display: 'Feet → Meters' },
      'mi-km': { factor: n => n * 1.60934, label: 'Kilometers', unit: 'km', display: 'Miles → Kilometers' },
      'lb-kg': { factor: n => n * 0.453592, label: 'Kilograms', unit: 'kg', display: 'Pounds → Kilograms' },
      'gal-l': { factor: n => n * 3.78541, label: 'Liters', unit: 'L', display: 'Gallons → Liters' },
      'f-c': { factor: n => (n - 32) * 5 / 9, label: 'Celsius', unit: '°C', display: 'Fahrenheit → Celsius' }
    }
    const conv = conversions[v.unitType] || conversions['in-cm']
    const result = conv.factor(v.value)
    const raw = v.unitType === 'f-c' ? `(${v.value} - 32) × 5/9` : `${v.value} × ${(result / v.value).toFixed(5)}`
    return { result, label: conv.label, unit: conv.unit,
      steps: [
        { label: 'Original Value', value: `${v.value} ${v.unitType.startsWith('f') ? '°F' : v.unitType.startsWith('in') ? 'in' : v.unitType.startsWith('ft') ? 'ft' : v.unitType.startsWith('mi') ? 'mi' : v.unitType.startsWith('lb') ? 'lb' : v.unitType.startsWith('gal') ? 'gal' : ''}` },
        { label: 'Conversion Type', value: conv.display },
        { label: 'Conversion Factor', value: v.unitType === 'f-c' ? 'Subtract 32, ×5/9' : `× ${(result / v.value).toFixed(5)}` },
        { label: 'Formula Applied', value: raw },
        { label: 'Intermediate', value: v.unitType === 'f-c' ? `${v.value} - 32 = ${(v.value - 32).toFixed(1)}` : `${v.value} × ${(result / v.value).toFixed(5)} = ${result.toFixed(4)}` },
        { label: 'Result', value: `${result.toFixed(2)} ${conv.unit}` },
        { label: 'Rounded to Practical', value: result < 1 ? result.toFixed(4) : result < 100 ? result.toFixed(2) : result.toFixed(1) },
        { label: 'Everyday Reference', value: v.unitType === 'in-cm' ? '1 in ≈ 2.54 cm (finger width)' : v.unitType === 'ft-m' ? '1 ft ≈ 0.305 m (ruler length)' : v.unitType === 'mi-km' ? '1 mi ≈ 1.61 km (10-min walk)' : v.unitType === 'lb-kg' ? '1 lb ≈ 0.454 kg (stick of butter)' : v.unitType === 'gal-l' ? '1 gal ≈ 3.79 L (milk jug)' : '0°C freezing, 100°C boiling' },
      ],
      extras: [
        { label: '🌍 Global Usage', value: 'Only 3 countries still use imperial: US, Liberia, Myanmar. Every other nation uses metric.' },
        { label: '📐 Inch Origins', value: 'The inch was originally based on the width of a thumb. Standardized in 1959 as exactly 25.4 mm.' },
        { label: '🌡️ Fahrenheit vs Celsius', value: 'Fahrenheit: 0° = freezing brine, 100° ≈ body temp. Celsius: 0° = water freezes, 100° = water boils at sea level.' },
        { label: '⚖️ Pound vs Kilogram', value: 'The pound was redefined in 1959 as exactly 0.45359237 kg. A kilogram is the SI base unit for mass.' },
        { label: '⛽ Gallon Differences', value: 'US gallon = 3.785 L (used in US). Imperial (UK) gallon = 4.546 L — 20% larger. This calculator uses US gallons.' },
        { label: '🔢 Quick Rule of Thumb', value: 'In→cm: ×2.5 + 10%. Ft→m: ÷3.3. Mi→km: ×1.6. Lb→kg: ÷2.2. °F→°C: subtract 30 then ÷2.' },
        { label: '📱 Travel Essential', value: 'Knowing metric conversions helps abroad. Most countries use °C for weather, km for speed, and kg for weight.' },
        { label: '🧑‍🍳 Cooking Conversions', value: '1 cup = 237 mL, 1 tbsp = 15 mL, 1 tsp = 5 mL. US recipes use volume; European recipes use weight for precision.' },
      ]
    }
  },
  description: 'Quick unit conversion between 6 common imperial-to-metric pairs: length (in→cm, ft→m, mi→km), weight (lb→kg), volume (gal→L), and temperature (°F→°C). Perfect for travel, recipes, DIY, and everyday measurements.',
  formula: 'Multiply by the conversion factor: in→cm × 2.54, ft→m × 0.3048, mi→km × 1.60934, lb→kg × 0.453592, gal→L × 3.78541. For temperature: °F→°C = (°F − 32) × 5/9.',
  interpretation: 'The US is one of only three countries (with Liberia and Myanmar) that hasn\'t fully adopted the metric system. These 6 conversions cover the most common everyday needs: height and distance (length), groceries and luggage (weight), fuel and milk (volume), and weather/cooking (temperature). The conversion factors are exact by international agreement (1959).'
}

export default calcDef
