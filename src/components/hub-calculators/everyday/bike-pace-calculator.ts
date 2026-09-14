import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ distance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), targetTimeHr: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), targetTimeMin: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'distance', label: 'Ride Distance (miles)', type: 'number', min: 1, step: '5' },
    { name: 'targetTimeHr', label: 'Target Hours', type: 'number', min: 0, step: '1' },
    { name: 'targetTimeMin', label: 'Target Minutes', type: 'number', min: 0, step: '5' },
  ],
  defaults: { distance: '20', targetTimeHr: '1', targetTimeMin: '30' },
  presets: [
    { label: 'Leisure Ride (10 mi)', values: { distance: '10', targetTimeHr: '1', targetTimeMin: '0' } },
    { label: 'Century Ride (100 mi)', values: { distance: '100', targetTimeHr: '5', targetTimeMin: '30' } },
    { label: 'Morning Commute (5 mi)', values: { distance: '5', targetTimeHr: '0', targetTimeMin: '25' } },
    { label: 'Fitness Loop (25 mi)', values: { distance: '25', targetTimeHr: '1', targetTimeMin: '15' } },
  ],
  compute: (v) => {
    const totalMinutes = v.targetTimeHr * 60 + v.targetTimeMin
    const paceMinPerMile = totalMinutes / v.distance
    const paceSec = Math.round((paceMinPerMile - Math.floor(paceMinPerMile)) * 60)
    const paceMin = Math.floor(paceMinPerMile)
    const speedMph = v.distance / (totalMinutes / 60)
    const speedKph = speedMph * 1.609
    return { result: paceMinPerMile, label: 'Average Pace', unit: 'min/mi', steps: [
      { label: 'Total Time in Minutes', value: `${v.targetTimeHr}h ${v.targetTimeMin}m = ${totalMinutes} min` },
      { label: 'Pace Calculation', value: `${totalMinutes} min ÷ ${v.distance} mi = ${paceMin}:${paceSec.toString().padStart(2, '0')} /mi` },
      { label: 'Average Speed (mph)', value: `${v.distance} mi ÷ ${(totalMinutes / 60).toFixed(2)} hr = ${speedMph.toFixed(1)} mph` },
      { label: 'Average Speed (km/h)', value: `${speedMph.toFixed(1)} mph x 1.609 = ${speedKph.toFixed(1)} km/h` },
      { label: 'Time at Different Pace', value: paceMinPerMile > 3 ? 'Leisure/Fitness pace' : paceMinPerMile > 2 ? 'Training/Racing pace' : 'Elite/Pro pace' },
    ] ,
    extras: [
      { label: "Pace benchmarks by fitness level", value: "Leisure (8–12 mph / 5:00–7:30/mi): casual rider, sightseeing. Fitness (12–16 mph / 3:45–5:00/mi): regular exercise, moderate effort. Racing (16–20 mph / 3:00–3:45/mi): club rider, strong fitness. Pro (20–24+ mph / <3:00/mi): elite, draft-assisted." },
      { label: "Terrain adjustment", value: "Flat: multiply pace by 1.0 (baseline). Rolling hills: multiply by 1.2–1.4. Steep climbs (5%+ grade): multiply by 2–4x. Wind: 10 mph headwind adds 20–30% to effort. Rule of thumb: 100 ft of elevation gain per mile = ~1 min/mi slower." },
      { label: "Drafting savings", value: "Riding in a paceline at 18 mph reduces your effort by 30–40% vs solo at the same speed. Behind a truck/bus at 20 mph: 50%+ reduction (but illegal and dangerous). GCN found drafting saves 27% energy at 22 mph." },
      { label: "Bike type impact on speed", value: "Road bike: fastest (aero bars save 5–10% at 20+ mph). Gravel bike: 1–2 mph slower than road on pavement (knobby tires, heavier frame). Mountain bike: 2–5 mph slower (suspension bob, wide tires, upright position). Commuter: 1–3 mph slower." },
      { label: "Group ride time estimation", value: "Group rides average 15–18 mph for a 'no-drop' social pace. Faster groups: 18–22 mph. Expect to ride 1–3 mph faster in a group vs solo at the same perceived effort. A 30-mile group ride at 17 mph takes 1h46m; solo at 14 mph: 2h08m." },
      { label: "Cycling vs running comparison", value: "Cycling 20 miles at 15 mph (1h20m) = running ~6 miles at 8 min/mi (48 min) in calorie burn (~600 kcal). Cycling is 4x more efficient than walking/running per calorie spent. A century ride (100 mi) at 16 mph = ~6h15m total — equivalent to running ~33 miles." },
      { label: "Nutrition and hydration pacing", value: "For rides >2 hours: 250–400 kcal/hr (energy bars, gels). 24–32 oz water/hr (more if hot). Every 30 minutes: 1 bottle + 1 snack. On a 5-hr century at 18 mph, you need ~5–6 bottles and 4–5 snacks totaling ~1,500–2,000 kcal." },
      { label: "Training effect by pace zone", value: "Zone 2 (65–75% FTP, conversational pace): building endurance, 12–15 mph for most. Zone 3 (75–85% FTP, steady effort): 15–17 mph. Zone 4 (85–95% FTP, threshold): 17–20 mph. Zone 5 (95%+ FTP, sprint): 20+ mph. Aim for 80% in Z2, 20% in Z3–4." },
    ]}
  },
  description: 'Calculate your cycling pace (min/mi) and speed (mph/km/h) for any ride distance and target time. Enter distance and target time to get the pace needed to achieve your goal.',
  formula: 'Pace (min/mi) = Total Minutes ÷ Distance | Speed (mph) = Distance ÷ (Hours + Minutes/60) | Speed (km/h) = mph x 1.609',
  interpretation: 'A 20-mile ride in 1.5 hours yields 13.3 mph / 4:30 min/mi fitness pace. A century (100 mi) in 5.5 hours yields 18.2 mph / 3:18 min/mi racing pace. A 5-mile commute in 25 minutes yields 12 mph / 5:00 min/mi — a comfortable fitness pace that avoids sweating too heavily.'
}

export default calcDef
