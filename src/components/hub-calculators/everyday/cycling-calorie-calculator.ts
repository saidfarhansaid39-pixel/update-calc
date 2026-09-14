import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ weight: z.string().min(1).refine(v => parseFloat(v) > 50, '>50'), speedMph: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), durationMin: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), elevation: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'weight', label: 'Rider Weight (lbs)', type: 'number', min: 50, step: '5' },
    { name: 'speedMph', label: 'Average Speed (mph)', type: 'number', min: 3, step: '1' },
    { name: 'durationMin', label: 'Duration (minutes)', type: 'number', min: 1, step: '5' },
    { name: 'elevation', label: 'Elevation Gain (ft)', type: 'number', min: 0, step: '100' },
  ],
  defaults: { weight: '155', speedMph: '14', durationMin: '60', elevation: '500' },
  presets: [
    { label: 'Leisure Weekend Ride', values: { weight: '160', speedMph: '10', durationMin: '90', elevation: '200' } },
    { label: 'Morning Commute', values: { weight: '175', speedMph: '13', durationMin: '30', elevation: '150' } },
    { label: 'Hill Climb Training', values: { weight: '145', speedMph: '8', durationMin: '120', elevation: '2500' } },
    { label: 'Race Day (Road)', values: { weight: '155', speedMph: '20', durationMin: '180', elevation: '3000' } },
  ],
  compute: (v) => {
    const metBase = v.speedMph < 8 ? 4 : v.speedMph < 13 ? 6 : v.speedMph < 16 ? 8 : v.speedMph < 19 ? 10 : 12
    const kg = v.weight / 2.205
    const hours = v.durationMin / 60
    const elevationCal = v.elevation * 0.003
    const baseCal = metBase * kg * hours
    const totalCal = baseCal + elevationCal
    const calPerHour = hours > 0 ? totalCal / hours : 0
    const distance = v.speedMph * hours
    const calPerMile = distance > 0 ? totalCal / distance : 0
    const intensityLabel = v.speedMph < 8 ? 'Leisure' : v.speedMph < 13 ? 'Moderate' : v.speedMph < 16 ? 'Vigorous' : v.speedMph < 19 ? 'Very Fast' : 'Racing'
    return { result: totalCal, label: 'Calories Burned', unit: 'kcal', steps: [{ label: 'Rider Mass', value: `${v.weight} lbs (${kg.toFixed(1)} kg)` }, { label: 'Intensity Level', value: `${intensityLabel} — MET ${metBase}` }, { label: 'Duration', value: `${v.durationMin} min (${hours.toFixed(2)} hrs)` }, { label: 'Distance', value: `${distance.toFixed(1)} miles` }, { label: 'Base Calories', value: `${baseCal.toFixed(0)} kcal` }, { label: 'Elevation Bonus', value: `${elevationCal.toFixed(0)} kcal (${v.elevation} ft)` }, { label: 'Cal per Hour', value: `${calPerHour.toFixed(0)} kcal/hr` }, { label: 'Cal per Mile', value: `${calPerMile.toFixed(0)} kcal/mi` }] ,
    extras: [
      { label: "MET Reference", value: "MET values by pace: 4 (leisure <8 mph), 6 (moderate 8-12), 8 (vigorous 12-16), 10 (very fast 16-19), 12 (racing >19). Heavier riders burn more at the same speed." },
      { label: "Calorie Per Mile", value: "Cycling burns 25-40 cal/mi depending on weight and speed—about 1/3 of running's 100-130 cal/mi. But you can cycle 2-3x longer." },
      { label: "Elevation Impact", value: "Climbing 1,000 ft adds ~30-40 kcal for a 155-lb rider. On a hilly century (100 mi, 5,000 ft gain), elevation accounts for 150-200 of 2,500+ total kcal." },
      { label: "Afterburn Effect (EPOC)", value: "After a hard ride, your metabolism stays elevated for 2-14 hours, burning 5-15% additional calories during recovery." },
      { label: "Aerodynamics at Speed", value: "Above 16 mph, air resistance dominates energy expenditure. A drop handlebar position can save 10-15% energy vs upright at the same speed." },
      { label: "Fueling for Performance", value: "Sustained rides >90 min need 30-60 g carbs/hr (energy gels, bananas). Without fueling, the body burns muscle glycogen then fat—lowering power output 20-30%." },
      { label: "E-bike Adjustment", value: "E-bike assist reduces calorie burn by 30-60% depending on assist level. At maximum assist, a 14 mph ride burns closer to MET 3-4 rather than MET 8." },
      { label: "Heart Rate Correlation", value: "For steady-state cycling, kcal ≈ (HR × Duration × 0.001) × Weight. An average HR of 145 bpm over 60 min for a 155-lb rider = ~450-550 kcal." },
    ]}
  },
  description: 'Calculate calories burned cycling based on your weight, average speed, ride duration, and elevation gain. Uses ACSM MET values calibrated to cycling intensity and adds an elevation bonus for climbing. Also shows calories per mile and per hour.',
  formula: 'Total kcal = (MET × Weight(kg) × Duration(hrs)) + (Elevation(ft) × 0.003) | MET = 4 (<8 mph), 6 (8-12), 8 (12-16), 10 (16-19), 12 (>19)',
  interpretation: 'Cycling is an efficient full-body cardio workout that burns 300-800 kcal/hr depending on intensity. A 155-lb rider burns ~500 kcal/hr at a 14 mph average on rolling terrain. The MET system from the American College of Sports Medicine assigns 4 for leisure pace, 6 for moderate, 8 for vigorous, 10 for very fast, and 12 for racing. Elevation climbing adds roughly 3 kcal per 100 ft of gain. For sustained efforts over 90 min, real-time fueling with 30-60 g of carbohydrates per hour is essential to maintain power output.'
}

export default calcDef
