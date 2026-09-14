import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ value: z.string().min(1).refine(v => parseFloat(v) != 0, 'nonzero'), fromUnit: z.string().min(1), toUnit: z.string().min(1), category: z.string().min(1) }),
  fields: [
    { name: 'value', label: 'Value to Convert', type: 'number', step: 'any' },
    { name: 'category', label: 'Measurement Category', type: 'select', options: [{ label: 'Length', value: 'length' }, { label: 'Weight', value: 'weight' }, { label: 'Volume', value: 'volume' }, { label: 'Temperature', value: 'temperature' }, { label: 'Speed', value: 'speed' }] },
    { name: 'fromUnit', label: 'From Unit', type: 'select', options: [{ label: 'Meters', value: 'm' }, { label: 'Kilometers', value: 'km' }, { label: 'Miles', value: 'mi' }, { label: 'Feet', value: 'ft' }, { label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }, { label: 'Millimeters', value: 'mm' }, { label: 'Yards', value: 'yd' }] },
    { name: 'toUnit', label: 'To Unit', type: 'select', options: [{ label: 'Meters', value: 'm' }, { label: 'Kilometers', value: 'km' }, { label: 'Miles', value: 'mi' }, { label: 'Feet', value: 'ft' }, { label: 'Inches', value: 'in' }, { label: 'Centimeters', value: 'cm' }, { label: 'Millimeters', value: 'mm' }, { label: 'Yards', value: 'yd' }] },
  ],
  defaults: { value: '100', fromUnit: 'km', toUnit: 'mi', category: 'length' },
  presets: [
    { label: 'Miles to Kilometers', values: { value: '100', fromUnit: 'mi', toUnit: 'km', category: 'length' } },
    { label: 'Pounds to Kilograms', values: { value: '150', fromUnit: 'lb', toUnit: 'kg', category: 'weight' } },
    { label: 'F to C Temperature', values: { value: '98.6', fromUnit: 'f', toUnit: 'c', category: 'temperature' } },
    { label: 'Gallons to Liters', values: { value: '1', fromUnit: 'gal', toUnit: 'l', category: 'volume' } },
  ],
  compute: (v) => {
    const lengthToM: Record<string, number> = { m: 1, km: 1000, mi: 1609.34, ft: 0.3048, in: 0.0254, cm: 0.01, mm: 0.001, yd: 0.9144 }
    const weightToKg: Record<string, number> = { g: 0.001, kg: 1, lb: 0.453592, oz: 0.0283495, mg: 0.000001, ton: 907.185, st: 6.35029 }
    const volumeToL: Record<string, number> = { l: 1, ml: 0.001, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588, floz: 0.0295735, tbsp: 0.0147868, tsp: 0.00492892 }
    const speedToMS: Record<string, number> = { ms: 1, kmh: 0.277778, mph: 0.44704, kn: 0.514444, ftS: 0.3048 }
    const catMap: Record<string, Record<string, number>> = { length: lengthToM, weight: weightToKg, volume: volumeToL, speed: speedToMS }
    const tempConvert = (val: number, from: string, to: string) => {
      const toC = from === 'c' ? val : from === 'f' ? (val - 32) * 5 / 9 : val - 273.15
      return to === 'c' ? toC : to === 'f' ? toC * 9 / 5 + 32 : toC + 273.15
    }
    let result: number, conversionDesc: string
    let unit: string = v.toUnit
    if (v.category === 'temperature') {
      const tempCatMap: Record<string, string> = { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' }
      const fromVal = tempCatMap[v.fromUnit] || 'Celsius'
      const toVal = tempCatMap[v.toUnit] || 'Celsius'
      result = tempConvert(v.value, v.fromUnit, v.toUnit)
      const fromC = v.fromUnit === 'c' ? v.value : v.fromUnit === 'f' ? (v.value - 32) * 5 / 9 : v.value - 273.15
      const toCVal = v.toUnit === 'c' ? result : v.toUnit === 'f' ? (result - 32) * 5 / 9 : result - 273.15
      conversionDesc = `${v.value}°${v.fromUnit.toUpperCase()} = ${result.toFixed(2)}°${v.toUnit.toUpperCase()}`
    } else {
      const factors = catMap[v.category] || lengthToM
      const baseFactor = factors[v.fromUnit]
      const targetFactor = factors[v.toUnit]
      result = v.value * baseFactor / targetFactor
      const baseUnit = v.category === 'length' ? 'meters' : v.category === 'weight' ? 'kg' : v.category === 'volume' ? 'liters' : 'm/s'
      conversionDesc = `${v.value} ${v.fromUnit} = ${result.toFixed(4)} ${v.toUnit}`
    }
    return { result, label: 'Converted Value', unit, steps: [
      { label: 'Category', value: v.category },
      { label: 'From', value: `${v.value} ${v.fromUnit}` },
      { label: 'To', value: `${result.toFixed(4)} ${v.toUnit}` },
      { label: 'Conversion Factor', value: v.category === 'temperature' ? 'Temperature formula applied' : `1 ${v.fromUnit} = ${(1 * (catMap[v.category]?.[v.fromUnit] || 1) / (catMap[v.category]?.[v.toUnit] || 1)).toFixed(6)} ${v.toUnit}` },
      { label: 'Result', value: conversionDesc },
    ] ,
    extras: [
      { label: 'Length Facts', value: '1 inch = 2.54 cm (exact definition). 1 mile = 1.60934 km. 1 foot = 0.3048 m. The meter is defined by the speed of light.' },
      { label: 'Weight Facts', value: '1 lb = 0.45359237 kg (exact). 1 kg = 2.20462 lbs. A US ton = 2,000 lbs, a metric tonne = 1,000 kg, a UK stone = 14 lbs.' },
      { label: 'Volume Facts', value: '1 US gallon = 3.78541 L (different from UK gallon = 4.54609 L). 1 cup = 8 fl oz = ~237 mL. 1 tbsp = 3 tsp = ~15 mL.' },
      { label: 'Temperature Facts', value: '0°C = 32°F = 273.15 K (freezing). 100°C = 212°F = 373.15 K (boiling). -40°C = -40°F (the only point where scales match).' },
      { label: 'Speed Facts', value: '1 mph = 1.609 km/h. 1 knot = 1.151 mph. The speed of sound is ~1,235 km/h at sea level.' },
      { label: 'Cooking Conversions', value: 'Memorize: 1 cup = 237 mL, 1 tbsp = 15 mL, 1 tsp = 5 mL, 1 stick butter = 113 g = 4 oz, 1 oz = 28 g.' },
      { label: 'Precision Note', value: 'Results are rounded to 4 decimal places. For exact conversions (e.g., inches↔cm), use the exact factors: 1 in = 2.54 cm (exact).' },
    ]}
  },
  description: 'Universal unit converter supporting length, weight, volume, temperature, and speed conversions between metric and imperial systems. Uses precise conversion factors for accurate results.',
  formula: 'General: Result = Value × Factor(BasePerFromUnit) / Factor(BasePerToUnit) | Temperature: °C = (°F − 32) × 5/9, °F = °C × 9/5 + 32, K = °C + 273.15 | Speed: mph × 0.44704 = m/s, km/h × 0.277778 = m/s, knots × 0.514444 = m/s',
  interpretation: 'Key equivalents: 1 inch = 2.54 cm (exact), 1 lb = 0.45359237 kg (exact), 1 US gallon = 3.78541 L, 0°C = 32°F = 273.15K. This converter handles everyday measurements for cooking (cups/mL), travel (miles/km), weather (°F/°C), fitness (lbs/kg), and DIY projects (in/cm). For cooking, 1 cup ≈ 237 mL, 1 tbsp ≈ 15 mL, and 1 tsp ≈ 5 mL are practical approximations.'
}

export default calcDef
