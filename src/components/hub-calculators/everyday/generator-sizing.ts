import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ watts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), runtime: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelTank: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'watts', label: 'Total Load (watts)', type: 'number', min: 100, step: '100' },
    { name: 'runtime', label: 'Runtime at 50% Load (hours)', type: 'number', min: 1, step: '1' },
    { name: 'fuelTank', label: 'Fuel Tank Capacity (gallons)', type: 'number', min: 0.5, step: '0.5' },
  ],
  defaults: { watts: '5000', runtime: '10', fuelTank: '5' },
  presets: [
    { label: 'Home Backup (essentials)', values: { watts: '3000', runtime: '8', fuelTank: '4' } },
    { label: 'Whole-House Backup', values: { watts: '20000', runtime: '12', fuelTank: '25' } },
    { label: 'RV/Camping', values: { watts: '2000', runtime: '6', fuelTank: '2' } },
    { label: 'Construction Site', values: { watts: '7500', runtime: '8', fuelTank: '6' } },
  ],
  compute: (v) => {
    const kva = v.watts / 1000
    const fuelPerHour = v.fuelTank / v.runtime
    const fuelPerDay = fuelPerHour * 24
    const fuelPerWeek = fuelPerDay * 7
    const recommendedWatts = v.watts * 1.2
    const recommendedKva = recommendedWatts / 1000
    const runtimeAtFull = v.fuelTank / (fuelPerHour * 1.6)
    const costPerDay = fuelPerDay * 3.50
    const costPerWeek = fuelPerWeek * 3.50
    return { result: kva, label: 'Generator Size (running)', unit: 'kVA', steps: [{ label: 'Running Load', value: `${v.watts} W / ${kva.toFixed(2)} kVA` }, { label: 'Recommended (×1.2 headroom)', value: `${recommendedWatts.toFixed(0)} W / ${recommendedKva.toFixed(2)} kVA` }, { label: 'Fuel Consumption', value: `${fuelPerHour.toFixed(2)} gal/hr` }, { label: 'Runtime per Tank', value: `${v.runtime} hrs at 50% load` }, { label: 'Runtime at Full Load', value: `${runtimeAtFull.toFixed(1)} hrs` }, { label: 'Daily Fuel Use (24h)', value: `${fuelPerDay.toFixed(1)} gal` }, { label: 'Fuel Cost per Day', value: `$${costPerDay.toFixed(2)} at $3.50/gal` }, { label: 'Fuel Cost per Week', value: `$${costPerWeek.toFixed(2)}` }] ,
    extras: [
      { label: 'Motor Startup Surge Headroom', value: `Your load: ${v.watts} W running. Motors (fridge, AC, well pump) draw 3-7× running watts on startup. A 1 HP motor (750W running) needs 3000-5000W to start. Recommended: ${recommendedWatts.toFixed(0)} W (${recommendedKva.toFixed(1)} kVA). For a ${v.watts}W load with fridge + well pump, consider a ${(kva + 2.5).toFixed(1)} kVA generator minimum.` },
      { label: 'Fuel Type Comparison', value: `This generator uses ${fuelPerHour.toFixed(2)} gal/hr of ${fuelPerHour > 1 ? 'gasoline' : fuelPerHour > 0.5 ? 'gasoline or propane' : 'propane or diesel'}. Gasoline: ${(fuelPerHour * 3.50).toFixed(2)}/hr. Propane: ~$${(fuelPerHour * 2.00).toFixed(2)}/hr (1 gal propane ≈ 0.73 gal gas equivalent). Diesel: ~$${(fuelPerHour * 3.20).toFixed(2)}/hr but lasts 2-3× longer between services. Natural gas standby: ~$${(v.watts / 100000 * 1.20).toFixed(2)}/hr.` },
      { label: 'Extended Runtime Planning', value: `For a ${v.runtime}-hr run, you need ${fuelPerHour.toFixed(2)} gal/hr × ${v.runtime} hrs = ${(fuelPerHour * v.runtime).toFixed(1)} gal total. A 24-hr continuous run: ${fuelPerDay.toFixed(1)} gal needed. ${v.fuelTank >= 5 ? 'Your tank size is adequate for moderate runtime.' : 'Consider a larger tank or external fuel source for extended outages.'} Store fuel safely with stabilizer (lasts 6-12 months).` },
      { label: 'Critical Load Priority List', value: `${v.watts}W total. Typical critical load breakdown: fridge (600-800W), lights (300-500W), sump pump (800-1200W), furnace fan (500-1000W), well pump (1000-2000W), medical devices (200-500W), internet/router (50W). Prioritize: sump pump + fridge + lights + furnace = ~2000W. Add well pump + fridge = ~3500W. ${v.watts >= 5000 ? 'You can run all essentials plus some conveniences.' : 'Focus on essentials only.'}` },
      { label: 'Generator Sizing by Home Size', value: `Small home (<1500 sq ft): 3000-5500W (essentials). Medium home (1500-2500 sq ft): 5500-12000W (essentials + some circuits). Large home (>2500 sq ft): 12000-20000W (most of house). Whole-house: 20000-30000W with automatic transfer switch. Your ${kva.toFixed(1)} kVA/${v.watts}W load is suitable for ${v.watts <= 5000 ? 'a small home or apartment backup' : v.watts <= 12000 ? 'a medium home' : v.watts <= 20000 ? 'a large home' : 'whole-house backup'}.` },
      { label: 'Efficiency & Load Management', value: `Running at 50% load: ${fuelPerHour.toFixed(2)} gal/hr. At 25% load: ~$${(fuelPerHour * 0.65).toFixed(2)} gal/hr (less efficient). At 75% load: ~$${(fuelPerHour * 1.35).toFixed(2)} gal/hr (peak efficiency typically at 50-75% load). Running below 25% causes wet stacking (carbon buildup) in diesel generators. Avoid under-sizing: a generator running at >90% load wears out faster.` },
      { label: 'Generator Placement Safety', value: `Never run indoors (CO poisoning kills ~70 people/yr in US). Place 20+ ft from house, exhaust away from windows. Use a carbon monoxide detector. For ${v.watts}W, a ${kva.toFixed(1)} kVA generator needs good ventilation. ${v.watts >= 10000 ? 'Consider a permanently installed standby with transfer switch.' : 'A portable inverter generator is quieter and safer for camping/events.'} Invest in a weatherproof cover for outdoor use.` },
      { label: 'Total Cost of Ownership', value: `Purchase: ~$${(v.watts * 0.50).toFixed(0)}-$${(v.watts * 1.50).toFixed(0)} (portable) or $${(v.watts * 2).toFixed(0)}-$${(v.watts * 4).toFixed(0)} (standby). Fuel/week: $${costPerWeek.toFixed(2)}. Oil changes: every 100 hrs (~$30). Annual maintenance: $100-200. Over 5 years with ${v.runtime * 52 * 5} hrs usage: total cost ~$${(v.watts * 1 + costPerWeek * 260 + 30 * 26 + 150 * 5).toFixed(0)}. Standby generators add value to home (70-80% ROI).` },
    ]}
  },
  description: 'Size the right generator for your needs — home backup, RV, or construction. Input total wattage, expected runtime, and fuel tank capacity to get kVA sizing with 20% startup headroom, fuel consumption rates, runtime estimates, daily/weekly fuel costs, and total cost of ownership analysis.',
  formula: 'kVA = Watts ÷ 1000 | Recommended Size = Watts × 1.2 (20% headroom) | Fuel Rate = Tank ÷ Runtime (gal/hr) | Runtime at Full Load = Tank ÷ (Fuel Rate × 1.6) | Daily Fuel Cost = Fuel Rate × 24 × Fuel Price',
  interpretation: 'Add 20% headroom for motor startup surges (fridge, AC, well pump draw 3-7× running watts on startup). Critical loads (fridge 600W, lights 300W, sump pump 1000W, furnace 700W) typically need 3,000-5,000W. Whole-house: 15,000-30,000W. Running at 50-75% load is most efficient. Under 25% load causes engine problems (wet stacking). Generator costs range $0.50-4.00/watt depending on type (portable vs standby).'
}

export default calcDef
