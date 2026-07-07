import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ alTankGallons: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alTankDepth: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), alPlantType: z.string().min(1), alLightType: z.string().min(1) }),
  fields: [
    { name: 'alTankGallons', label: 'Tank Volume (gallons)', type: 'number', min: 1, step: '5' },
    { name: 'alTankDepth', label: 'Tank Depth (inches)', type: 'number', min: 6, step: '2' },
    { name: 'alPlantType', label: 'Plant Type', type: 'select', options: [{ label: 'Low Light (Java Fern, Anubias)', value: 'low' }, { label: 'Medium Light (Crypts, Swords)', value: 'medium' }, { label: 'High Light (Carpets, Stem Plants)', value: 'high' }] },
    { name: 'alLightType', label: 'Light Type', type: 'select', options: [{ label: 'LED', value: 'led' }, { label: 'T5 Fluorescent', value: 't5' }, { label: 'T8 Fluorescent', value: 't8' }, { label: 'CFL', value: 'cfl' }] },
  ],
  compute: (v) => {
    const lumensPerGal: Record<string, number> = { low: 15, medium: 30, high: 50 }
    const lumensPerWatt: Record<string, number> = { led: 80, t5: 60, t8: 50, cfl: 55 }
    const lpg = lumensPerGal[v.alPlantType] || 15
    const lpw = lumensPerWatt[v.alLightType] || 50
    const neededLumens = v.alTankGallons * lpg
    const neededWatts = Math.ceil(neededLumens / lpw)
    const depthPenalty = v.alTankDepth > 20 ? 1.5 : v.alTankDepth > 14 ? 1.2 : 1
    const adjustedWatts = Math.ceil(neededWatts * depthPenalty)
    const dailyKwh = adjustedWatts * 8 / 1000
    return { result: adjustedWatts, label: 'Recommended Light Wattage', unit: 'W', steps: [{ label: 'Target Lumens', value: `${v.alTankGallons} gal × ${lpg} lm/gal = ${neededLumens.toFixed(0)} lm` }, { label: 'Base Wattage', value: `${neededWatts} W` }, { label: 'Depth Factor', value: `${depthPenalty.toFixed(1)}×` }, { label: 'Adjusted Wattage', value: `${adjustedWatts} W` }, { label: 'Daily Energy', value: `${dailyKwh.toFixed(2)} kWh` }] }
  },
  description: 'Calculate the optimal aquarium lighting wattage based on tank size, depth, plant requirements, and light type. Proper lighting is critical for plant health.',
  formula: 'Watts = (Gallons × Lumens/Gal) / Lumens/Watt × Depth Factor | Depth Factor: <14in=1, 14-20in=1.2, >20in=1.5',
  interpretation: 'Low-light plants need 15 lm/gal, medium 30 lm/gal, high 50 lm/gal. LEDs are most energy-efficient (80+ lm/W). Run lights 8-10 hrs/day with a siesta break to prevent algae. Deeper tanks need more intense light to penetrate.'
}

export default calcDef
