import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const materials: { label: string; c: string }[] = [
  { label: 'Water', c: '4186' },
  { label: 'Ice (0°C)', c: '2090' },
  { label: 'Steam (100°C)', c: '2090' },
  { label: 'Aluminum', c: '900' },
  { label: 'Copper', c: '385' },
  { label: 'Iron/Steel', c: '450' },
  { label: 'Silver', c: '235' },
  { label: 'Gold', c: '129' },
  { label: 'Lead', c: '129' },
  { label: 'Glass', c: '840' },
  { label: 'Wood', c: '1700' },
  { label: 'Air (room temp)', c: '1005' },
  { label: 'Ethanol', c: '2440' },
  { label: 'Olive oil', c: '1970' },
  { label: 'Granite', c: '790' },
  { label: 'Concrete', c: '880' },
]

const calcDef: CalcDef = {
  schema: z.object({ mass: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), tempChange: z.string().min(1).refine(v => parseFloat(v) !== 0, 'Non-zero'), specificHeat: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'mass', label: 'Mass', type: 'number', unit: 'kg', min: 0.001, step: '0.001' },
    { name: 'tempChange', label: 'Temperature Change', type: 'number', unit: '°C', step: '1' },
    { name: 'specificHeat', label: 'Specific Heat', type: 'number', unit: 'J/(kg·°C)', min: 1, step: '1' },
  ],
  defaults: { mass: '1', tempChange: '10', specificHeat: '4186' },
  presets: materials.slice(0, 5).map(m => ({ label: m.label, values: { mass: '1', tempChange: '10', specificHeat: m.c } })),
  compute: (v) => {
    const q = v.mass * v.specificHeat * v.tempChange
    const waterRatio = v.specificHeat / 4186 * 100
    const heatCap = v.mass * v.specificHeat
    const waterHeat = 4186 * v.mass * v.tempChange
    const found = materials.find(m => Math.abs(Number(m.c) - v.specificHeat) < 1)
    return {
      result: q, label: 'Heat Energy', unit: 'J',
      steps: [
        { label: 'Formula', value: 'Q = mcΔT' },
        { label: 'Mass', value: `${v.mass} kg` },
        { label: 'Specific heat (c)', value: `${v.specificHeat} J/(kg·°C)` },
        { label: 'Temperature change', value: `${v.tempChange} °C` },
        { label: 'Heat capacity (C = mc)', value: `${heatCap.toFixed(2)} J/°C` },
        { label: 'Heat energy', value: `${q.toFixed(2)} J` },
      ],
      extras: [
        { label: 'Heat energy (J)', value: q.toFixed(2) },
        { label: 'Heat capacity', value: heatCap.toFixed(2) + ' J/°C' },
        { label: 'Compared to water', value: waterRatio.toFixed(1) + '% of water\'s specific heat' },
        { label: 'Same energy in water', value: `Would heat ${v.mass} kg water by ${(q / (4186 * v.mass)).toFixed(2)} °C` },
        { label: 'Material match', value: found ? found.label : 'Custom material' },
        { label: 'Water specific heat', value: '4186 J/(kg·°C) — highest of common substances' },
        { label: 'Aluminum specific heat', value: '900 J/(kg·°C) — heats 4.6× faster than water' },
        { label: 'Copper specific heat', value: '385 J/(kg·°C) — heats 10.9× faster than water' },
        { label: 'Reference: 1L water +1°C', value: 'Requires 4186 J (1 kcal ≈ 1 food Calorie)' },
      ],
    }
  },
  description: 'Specific heat capacity determines how much heat energy is required to change a substance\'s temperature. Includes material reference table.',
  formula: 'Q = mcΔT | C = mc (heat capacity)',
  interpretation: 'Water\'s specific heat (4186 J/(kg·°C)) is the highest of common substances, making it excellent for thermal regulation. Metals have low specific heat, heating and cooling quickly.'
}

export default calcDef
