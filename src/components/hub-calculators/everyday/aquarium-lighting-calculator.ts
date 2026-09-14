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
  defaults: { alTankGallons: '20', alTankDepth: '16', alPlantType: 'medium', alLightType: 'led' },
  presets: [
    { label: 'Low-Light Planted (val/nana)', values: { alTankGallons: '20', alTankDepth: '12', alPlantType: 'low', alLightType: 'led' } },
    { label: 'Medium-Light Community', values: { alTankGallons: '55', alTankDepth: '20', alPlantType: 'medium', alLightType: 'led' } },
    { label: 'High-Tech Carpeted Tank', values: { alTankGallons: '20', alTankDepth: '16', alPlantType: 'high', alLightType: 'led' } },
    { label: 'Deep Tall Tank (T5)', values: { alTankGallons: '75', alTankDepth: '24', alPlantType: 'medium', alLightType: 't5' } },
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
    const annualKwh = dailyKwh * 365
    const annualCost = annualKwh * 0.14
    return { result: adjustedWatts, label: 'Recommended Light Wattage', unit: 'W', steps: [
      { label: '1. Target lumens needed', value: `${v.alTankGallons} gal × ${lpg} lm/gal = ${neededLumens.toFixed(0)} lm (${v.alPlantType} light)` },
      { label: '2. Base wattage', value: `${neededLumens.toFixed(0)} lm ÷ ${lpw} lm/W (${v.alLightType}) = ${neededWatts} W` },
      { label: '3. Depth factor', value: `Depth ${v.alTankDepth}" → ${depthPenalty.toFixed(1)}× (${v.alTankDepth > 20 ? '>20" = 1.5×' : v.alTankDepth > 14 ? '14-20" = 1.2×' : '<14" = 1×'})` },
      { label: '4. Adjusted wattage', value: `${neededWatts} W × ${depthPenalty.toFixed(1)} = ${adjustedWatts} W` },
      { label: '5. Daily energy use', value: `${adjustedWatts} W × 8 hrs ÷ 1000 = ${dailyKwh.toFixed(2)} kWh` },
      { label: '6. Annual energy use', value: `${dailyKwh.toFixed(2)} kWh × 365 = ${annualKwh.toFixed(0)} kWh` },
      { label: '7. Annual cost at $0.14/kWh', value: `${annualKwh.toFixed(0)} kWh × $0.14 = $${annualCost.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Photoperiod Schedule", value: "Run lights 8-10 hours daily. A 4hr-on/4hr-off/4hr-on siesta schedule reduces algae growth while giving plants the total light they need." },
      { label: "Light Spectrum", value: "Plants need 6500-7000K full-spectrum light for photosynthesis. LEDs with 660nm red and 450nm blue diodes are ideal for plant growth." },
      { label: "PAR vs Lumens", value: `Lumens measure human-visible brightness, but PAR (Photosynthetically Active Radiation) matters for plants. At 20" depth, PAR drops 50% — consider this for high-light plants.` },
      { label: "Algae Prevention", value: "Too much light causes algae. Start at 6 hrs/day, increase gradually. Floating plants (frogbit, salvinia) naturally reduce light and compete with algae for nutrients." },
      { label: "LED Lifespan", value: "LEDs last 30,000-50,000 hours (10-17 years at 8 hrs/day). T5 tubes need replacement every 6-12 months as output degrades 20-30% per year despite still lighting up." },
      { label: "Light Mounting Height", value: `Raise or lower fixtures to adjust intensity. Most LED fixtures should be 6-12" above the water surface. Too low = hotspots, too high = light spill and wasted PAR.` },
      { label: "Dimmable Controllers", value: "Invest in a dimmable LED fixture or controller. You can simulate dawn/dusk and adjust intensity without changing fixture height. Reduces fish stress." },
      { label: "CO₂ Balance", value: "High light requires CO₂ injection. Without CO₂, high light causes algae blooms. Match light level to your CO₂ and fertilization — low tech = low light." },
    ]}
  },
  description: 'Calculate optimal aquarium lighting wattage based on tank size, depth, plant requirements, and light type. Includes PAR depth adjustment and annual energy cost.',
  formula: 'Watts = (Gal × lm/gal for plant type) ÷ (lm/W for light type) × Depth Factor | Depth Factor: <14"=1, 14-20"=1.2, >20"=1.5',
  interpretation: 'Low: 15 lm/gal (Java Fern, Anubias). Medium: 30 lm/gal (Crypts, Swords). High: 50 lm/gal (carpets, stem plants). LEDs are most efficient. Match light to CO₂ level to prevent algae. Siesta photoperiod reduces algae.'
}

export default calcDef
