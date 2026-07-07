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
    let result: number
    let unit: string
    if (v.category === 'temperature') {
      const fromVal = v.fromUnit === 'c' ? 'c' : v.fromUnit === 'f' ? 'f' : 'k'
      const toVal = v.toUnit === 'c' ? 'c' : v.toUnit === 'f' ? 'f' : 'k'
      const tempCatMap: Record<string, string> = { c: 'c', f: 'f', k: 'k' }
      result = tempConvert(v.value, tempCatMap[v.fromUnit] || 'c', tempCatMap[v.toUnit] || 'c')
      unit = v.toUnit
    } else {
      const factors = catMap[v.category] || lengthToM
      const baseFactor = factors[v.fromUnit]
      const targetFactor = factors[v.toUnit]
      result = v.value * baseFactor / targetFactor
      unit = v.toUnit
    }
    return { result, label: 'Converted Value', unit, steps: [{ label: 'Input', value: `${v.value} ${v.fromUnit}` }, { label: 'Converted', value: `${result.toFixed(4)} ${v.toUnit}` }] }
  },
  description: 'Universal metric/imperial converter for length, weight, volume, temperature, and speed with precise conversion factors.',
  formula: 'Result = Value × Factor(From) / Factor(To) | Temperature: C = (F-32)×5/9, F = C×9/5+32',
  interpretation: '1 inch = 2.54 cm exactly. 1 lb = 0.45359237 kg. 1 gallon (US) = 3.78541 L. 0°C = 32°F = 273.15K. Use this converter for everyday measurements, cooking, travel, and DIY projects.'
}

export default calcDef
