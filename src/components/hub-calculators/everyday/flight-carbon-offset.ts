import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ flightCo2Kg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), offsetCostPerTon: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'flightCo2Kg', label: 'Flight CO₂ (kg)', type: 'number', min: 10, step: '50' },
    { name: 'offsetCostPerTon', label: 'Offset Cost per Ton ($)', type: 'number', min: 5, step: '5' },
  ],
  defaults: { flightCo2Kg: '800', offsetCostPerTon: '20' },
  presets: [
    { label: 'NYC-London Round Trip Economy', values: { flightCo2Kg: '1600', offsetCostPerTon: '15' } },
    { label: 'LA-Chicago Round Trip', values: { flightCo2Kg: '650', offsetCostPerTon: '25' } },
    { label: 'Short Haul Regional Jet', values: { flightCo2Kg: '200', offsetCostPerTon: '10' } },
    { label: 'Long Haul Business Class (NYC-Tokyo)', values: { flightCo2Kg: '5400', offsetCostPerTon: '30' } },
  ],
  compute: (v) => {
    const tons = parseFloat(v.flightCo2Kg) / 1000
    const offsetCost = tons * parseFloat(v.offsetCostPerTon)
    const treesNeeded = Math.ceil(tons * 45)
    const treesAcres = treesNeeded / 500
    const solarKwh = tons * 1000
    const reforestationAcres = tons * 0.1
    const monthlySub = offsetCost / 12
    const weeklySub = offsetCost / 52
    return { result: offsetCost, label: 'Offset Cost', unit: '$', steps: [{ label: 'CO₂ Emissions', value: `${parseFloat(v.flightCo2Kg).toFixed(0)} kg (${tons.toFixed(3)} tonnes)` }, { label: 'Offset Price per Tonne', value: `$${parseFloat(v.offsetCostPerTon).toFixed(2)}` }, { label: 'Total Offset Cost', value: `$${offsetCost.toFixed(2)}` }, { label: 'Trees to Plant (annual absorption)', value: `${treesNeeded} trees` }, { label: 'Forest Area Needed', value: `${treesAcres.toFixed(2)} acres (${reforestationAcres.toFixed(2)} acres reforestation)` }, { label: 'Solar Energy Equivalent', value: `${solarKwh.toFixed(0)} kWh (avg US home ${(solarKwh / 886).toFixed(1)} months)` }, { label: 'Offset as Monthly Cost', value: `$${monthlySub.toFixed(2)}/month x 12 months` }, { label: 'Offset as Weekly Cost', value: `$${weeklySub.toFixed(2)}/week` }] ,
    extras: [
      { label: 'Offset Project Comparison', value: `At $${parseFloat(v.offsetCostPerTon).toFixed(0)}/tonne ($${offsetCost.toFixed(2)} total): Reforestation — $5-15/tonne, absorbs in 20-40 years. Renewable energy — $10-30/tonne, immediate impact. Direct air capture — $250-600/tonne, permanent but expensive. Methane capture — $5-20/tonne, efficient. Your $${parseFloat(v.offsetCostPerTon).toFixed(0)}/tonne budget enables ${parseFloat(v.offsetCostPerTon) >= 20 ? 'Gold Standard renewable or forestry projects' : 'affordable forestry or cookstove efficiency projects'}. Always verify by certification (Gold Standard, Verra VCS).` },
      { label: 'Flight Equivalent Context', value: `${parseFloat(v.flightCo2Kg).toFixed(0)} kg CO₂ = average ${(parseFloat(v.flightCo2Kg) / 100 / 1.609).toFixed(0)}-mi economy flight per passenger. One transatlantic round trip (NYC-London): 1.6 tonnes = $${(1.6 * parseFloat(v.offsetCostPerTon)).toFixed(2)}. Compare: driving ${(parseFloat(v.flightCo2Kg) / 0.4).toFixed(0)} mi in average car (25 mpg), or ${(parseFloat(v.flightCo2Kg) / 0.15).toFixed(0)} mi in an EV. One year of US household electricity (10,600 kWh): ~4 tonnes CO₂.` },
      { label: 'Scoring Your Offset Impact', value: `Gold Standard/Verra certified offsets cost $15-50/tonne. Your $${parseFloat(v.offsetCostPerTon).toFixed(0)}/tonne: ${parseFloat(v.offsetCostPerTon) < 15 ? 'Below market rate — verify project authenticity' : parseFloat(v.offsetCostPerTon) < 30 ? 'Fair range for quality forestry/renewable projects' : 'Premium range — likely DAC or high-quality nature-based'}. At $${offsetCost.toFixed(2)} total for ${tons.toFixed(3)} tonnes: ${offsetCost >= 50 ? 'meaningful climate action ✓' : offsetCost >= 20 ? 'good start — consider +1 tree/mo subscription' : 'low cost — verify if offset provider is reputable'}. Tree planting ($${(treesNeeded * 0.5).toFixed(0)}) is cheaper than engineering solutions ($${(tons * 300).toFixed(0)}) but takes decades for full absorption.` },
      { label: 'Monthly Carbon Offset Plan', value: `Your flight: ${tons.toFixed(3)} tonnes CO₂. Monthly offset subscription: $${monthlySub.toFixed(2)}/mo for 12 months covers it. For ongoing aviation: if you fly ${(parseFloat(v.flightCo2Kg) / 800).toFixed(1)}× per year, monthly subscription of $${(monthlySub * (parseFloat(v.flightCo2Kg) / 800)).toFixed(2)} would cover all flights. Many airlines offer certified offset programs at booking — typically $1-5 for short haul, $10-30 for long haul. Set up auto-offset with services like Wren, Pachama, or Arbor Environmental.` },
      { label: 'Personal Carbon Budget Context', value: `Global average: 4.8 tonnes CO₂/person/year. US average: 16 tonnes. A single ${parseFloat(v.flightCo2Kg).toFixed(0)} kg flight = ${(tons / 4.8 * 100).toFixed(0)}% of a person's annual global carbon budget, or ${(tons / 16 * 100).toFixed(0)}% of a US resident's. To stay within 1.5°C targets, each person should limit to 2.3 tonnes/year by 2030. Offsetting $${offsetCost.toFixed(2)} for this flight brings your adjusted footprint to na — but reducing is 10-100× more effective per dollar.` },
      { label: 'Reduce Before You Offset', value: `For this ${parseFloat(v.flightCo2Kg).toFixed(0)} kg flight: reduce by choosing economy over business (2-4× less CO₂ per seat), direct flights (takeoff/landing = 25% of emissions), and airlines with newer fleets (20-30% less fuel). Teleconference instead for meetings <${(parseFloat(v.flightCo2Kg) / 200).toFixed(0)} kg of travel. Trains emit 80% less than planes per passenger-mile. The most effective offset is the flight not taken — 0 kg CO₂ and $${offsetCost.toFixed(2)} saved.` },
      { label: 'Offset Verification Checklist', value: `Before purchasing $${offsetCost.toFixed(2)} at $${parseFloat(v.offsetCostPerTon).toFixed(0)}/tonne: 1) Is it Gold Standard (GS), Verra VCS, or ACR? 2) Is it "retired" so it can't be resold? 3) Is it "additional" (wouldn't happen without offset funding)? 4) Is it permanent (no reversal risk)? Avoid: unverified projects, double-counted offsets, very cheap credits (<$5/tonne) that likely don't create real emission reductions. Verified forestry + community projects offer co-benefits (biodiversity, local jobs).` },
      { label: 'Corporate Climate Reporting', value: `For business travel: ${tons.toFixed(3)} tonnes CO₂ at $${parseFloat(v.offsetCostPerTon).toFixed(0)}/tonne = $${offsetCost.toFixed(2)}. Under SBTi: offsetting deforestation is valid, but companies should prioritize in-value-chain reductions over offsets. GHG Protocol Scope 3 (Category 6 — business travel): include this cost in travel budgeting. $${offsetCost.toFixed(2)} is ${offsetCost >= 50 ? 'a material cost → budget separately' : 'minimal → roll into general travel overhead'}. Many companies now require departments to pay offset costs from their own budgets.` },
    ]}
  },
  description: 'Calculate the cost to offset your flight carbon emissions through verified carbon credit programs. Includes reforestation, renewable energy, and DAC project comparisons with monthly subscription options.',
  formula: 'Offset Cost = (CO₂ kg ÷ 1000) × Price per Tonne | Trees Needed = Tonnes × 45 | Forest Area = Trees ÷ 500 acres | Solar Equivalent = Tonnes × 1000 kWh | Monthly = Offset Cost ÷ 12',
  interpretation: 'Verified carbon offsets cost $10-50 per tonne CO₂ through reputable certifiers (Gold Standard, Verra VCS). One tree absorbs ~22 kg CO₂ per year — so 45 trees absorb ~1 tonne annually, but it takes 20-40 years for full sequestration. A round-trip NYC-London economy flight (1.6 tonnes) costs $24-80 to offset at typical rates. Reducing flying (direct routes, economy class, fewer trips) is 10-100× more efficient per dollar than offsetting. For best climate impact: reduce 50% + offset 50%. Never buy unverified or very cheap (<$5/tonne) offsets.'
}

export default calcDef
