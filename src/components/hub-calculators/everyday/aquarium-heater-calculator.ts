import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ahTankVolume: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ahDesiredTemp: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ahRoomTemp: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ahUnitChoice: z.string().min(1) }),
  fields: [
    { name: 'ahTankVolume', label: 'Tank Volume (gallons)', type: 'number', min: 1, step: '5' },
    { name: 'ahDesiredTemp', label: 'Desired Water Temp (°F)', type: 'number', min: 65, max: 86, step: '1' },
    { name: 'ahRoomTemp', label: 'Room Temperature (°F)', type: 'number', min: 55, max: 95, step: '1' },
    { name: 'ahUnitChoice', label: 'Temperature Unit', type: 'select', options: [{ label: 'Fahrenheit', value: 'f' }, { label: 'Celsius', value: 'c' }] },
  ],
  defaults: { ahTankVolume: '55', ahDesiredTemp: '78', ahRoomTemp: '68', ahUnitChoice: 'f' },
  presets: [
    { label: '55 Gal Tropical (78°F)', values: { ahTankVolume: '55', ahDesiredTemp: '78', ahRoomTemp: '68', ahUnitChoice: 'f' } },
    { label: '20 Gal Nano Reef (78°F)', values: { ahTankVolume: '20', ahDesiredTemp: '78', ahRoomTemp: '72', ahUnitChoice: 'f' } },
    { label: '75 Gal Cold Water (68°F)', values: { ahTankVolume: '75', ahDesiredTemp: '68', ahRoomTemp: '72', ahUnitChoice: 'f' } },
    { label: '10 Gal Betta (80°F)', values: { ahTankVolume: '10', ahDesiredTemp: '80', ahRoomTemp: '70', ahUnitChoice: 'f' } },
  ],
  compute: (v) => {
    const tempDiff = v.ahDesiredTemp - v.ahRoomTemp
    const wpgRatio = 5
    const recommendedWatts = tempDiff > 0 ? Math.ceil(v.ahTankVolume * wpgRatio * (tempDiff / 10)) : 0
    const minWatts = Math.max(25, recommendedWatts)
    const maxSafeWatts = v.ahTankVolume * wpgRatio
    const btuh = recommendedWatts * 3.412
    const dailyKwh = recommendedWatts * 8 / 1000
    const annualKwh = dailyKwh * 365
    const annualCost = annualKwh * 0.14
    return { result: recommendedWatts, label: 'Recommended Heater Wattage', unit: 'W', steps: [
      { label: '1. Temperature differential', value: `${v.ahDesiredTemp}°F - ${v.ahRoomTemp}°F = ${tempDiff.toFixed(1)}°F` },
      { label: '2. Apply rule of thumb', value: `${v.ahTankVolume} gal × ${wpgRatio} W/gal × (${tempDiff.toFixed(1)}°F ÷ 10) = ${recommendedWatts} W` },
      { label: '3. Maximum safe wattage', value: `${v.ahTankVolume} gal × ${wpgRatio} W/gal = ${maxSafeWatts} W` },
      { label: '4. Heat output (BTU/hr)', value: `${recommendedWatts} W × 3.412 = ${btuh.toFixed(0)} BTU/hr` },
      { label: '5. Daily energy use', value: `${recommendedWatts} W × 8 hrs ÷ 1000 = ${dailyKwh.toFixed(2)} kWh` },
      { label: '6. Annual energy use', value: `${dailyKwh.toFixed(2)} kWh × 365 = ${annualKwh.toFixed(0)} kWh` },
      { label: '7. Annual cost at $0.14/kWh', value: `${annualKwh.toFixed(0)} kWh × $0.14 = $${annualCost.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Two Heaters Are Safer", value: "Use two smaller heaters totaling the recommended wattage instead of one large. If one fails, the other maintains partial heat. Critical for tanks over 50 gal." },
      { label: "Heater Controller", value: "For heaters above 200W, use an external controller (inkbird style). Built-in thermostats are less reliable and can fail on, cooking your fish." },
      { label: "Placement Matters", value: "Place heater near filter output or high-flow area for even heat distribution. Horizontal or 45° angle near the bottom. Never fully submerge a heater rated for partial submersion." },
      { label: "Sizing Guidelines", value: "Tropical (78-82°F): 5W/gal. Cold water (65-72°F): 3W/gal. Reef/marine: 5-6W/gal. Basement tanks: add 25% due to colder ambient air." },
      { label: "Temperature Stability", value: "Fish are sensitive to rapid temperature swings. Target ±1°F stability. A tank lid/cover reduces heat loss by 20-30% and prevents evaporation." },
      { label: "Seasonal Adjustment", value: "You may need more heater wattage in winter (colder room temp) and less in summer. Unplug or use a controller that adjusts for ambient changes." },
      { label: "Emergency Backup", value: "Keep a backup heater on hand. If your primary heater fails, even a cheap spare can prevent a tank crash. Battery-powered air pump + heater for power outages." },
      { label: "Annual Operating Cost", value: "Running $${annualCost.toFixed(2)}/yr is typical. LEDs and efficient pumps offset heater costs. Overall aquarium electricity is $10-30/month for most tanks." },
    ]}
  },
  description: 'Determine the correct aquarium heater wattage based on tank volume, desired water temperature, and room temperature. Includes BTU output, energy use, and annual cost estimates.',
  formula: 'Watts = Gal × 5 W/gal × (Desired°F - Room°F) ÷ 10 | BTU/hr = Watts × 3.412 | Annual kWh = Watts × 8 hrs × 365 ÷ 1000',
  interpretation: 'Rule: 5W/gal for tropical, 3W/gal for cold water. Use two smaller heaters for redundancy. Max safe = 5W/gal. Always use a controller above 200W. Place near water flow for even heating.'
}

export default calcDef
