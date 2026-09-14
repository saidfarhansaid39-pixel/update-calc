import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ueHomeSqft: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), ueOccupants: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), ueClimate: z.string().min(1), ueIncludeInternet: z.string().min(1) }),
  fields: [
    { name: 'ueHomeSqft', label: 'Home Size (sq ft)', type: 'number', min: 300, step: '200' },
    { name: 'ueOccupants', label: 'Number of Occupants', type: 'number', min: 1, step: '1' },
    { name: 'ueClimate', label: 'Climate Region', type: 'select', options: [{ label: 'Cold (Northeast/Midwest)', value: 'cold' }, { label: 'Moderate (Pacific/Mountain)', value: 'moderate' }, { label: 'Hot (South/Southwest)', value: 'hot' }] },
    { name: 'ueIncludeInternet', label: 'Include Internet/Cable', type: 'select', options: [{ label: 'Yes (+$65)', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { ueHomeSqft: '1500', ueOccupants: '2', ueClimate: 'moderate', ueIncludeInternet: 'yes' },
  presets: [
    { label: '1BR Apt (700 sqft), Cold', values: { ueHomeSqft: '700', ueOccupants: '1', ueClimate: 'cold', ueIncludeInternet: 'yes' } },
    { label: 'Family Home (2,000 sqft), Hot', values: { ueHomeSqft: '2000', ueOccupants: '4', ueClimate: 'hot', ueIncludeInternet: 'yes' } },
    { label: 'Starter Home (1,200 sqft), Mod', values: { ueHomeSqft: '1200', ueOccupants: '2', ueClimate: 'moderate', ueIncludeInternet: 'no' } },
  ],
  compute: (v) => {
    const sqftFactor = v.ueHomeSqft / 1000
    const occupantFactor = 1 + (v.ueOccupants - 1) * 0.2
    const climateBase: Record<string, any> = { cold: { electric: 80, gas: 90 }, moderate: { electric: 90, gas: 40 }, hot: { electric: 130, gas: 25 } }
    const base = climateBase[v.ueClimate] || climateBase.moderate
    const electric = base.electric * sqftFactor * occupantFactor
    const gas = base.gas * sqftFactor * occupantFactor
    const water = 30 * occupantFactor
    const trash = 25
    const internet = v.ueIncludeInternet === 'yes' ? 65 : 0
    const total = electric + gas + water + trash + internet
    const pctElectric = total > 0 ? (electric / total) * 100 : 0
    const pctGas = total > 0 ? (gas / total) * 100 : 0
    return { result: total, label: 'Estimated Monthly Utilities', unit: '$', steps: [{ label: 'Size Factor', value: `${v.ueHomeSqft} ÷ 1,000 = ${sqftFactor.toFixed(2)}x` }, { label: 'Occupant Factor', value: `${v.ueOccupants} people = ${occupantFactor.toFixed(2)}x` }, { label: 'Electricity (base $${base.electric})', value: `$${base.electric} × ${sqftFactor.toFixed(2)} × ${occupantFactor.toFixed(2)} = $${electric.toFixed(0)}` }, { label: 'Gas (base $${base.gas})', value: `$${base.gas} × ${sqftFactor.toFixed(2)} × ${occupantFactor.toFixed(2)} = $${gas.toFixed(0)}` }, { label: 'Water/Sewer', value: `$${water.toFixed(0)}` }, { label: 'Trash + Internet', value: `$${trash.toFixed(0)} + $${internet.toFixed(0)}` }, { label: 'Total', value: `$${total.toFixed(0)}/month` }, { label: 'Breakdown', value: `Elec ${pctElectric.toFixed(0)}%, Gas ${pctGas.toFixed(0)}%, Water ${(water / total * 100).toFixed(0)}%, Trash ${(trash / total * 100).toFixed(0)}%, Internet ${internet > 0 ? (internet / total * 100).toFixed(0) : 0}%` }] ,
    extras: [
      { label: 'Climate Cost Comparison', value: 'Cold climates (Northeast/Midwest): high gas costs for heating ($80-150+/mo), moderate electric ($60-100/mo). Hot climates (South/Southwest): high electric for AC ($130-250+/mo), low gas ($15-30/mo). Moderate (Pacific/Mountain): balanced mix, lower totals overall.' },
      { label: 'Internet Cost Trends', value: 'US average internet: $65-80/month for 200-500 Mbps. Fiber (if available): $60-100 for 1 Gbps. Cable bundled with TV: $120-200/month. Many households save by cutting cable TV (streaming only) — saves $50-100/month. Negotiate rates annually.' },
      { label: 'Trash/Recycling Fees', value: 'Trash service: $20-35/month typical. Some utilities include it in water bill. Extra carts/recycling bins: $5-10/month. Bulk pickup: $25-75 per event. Some cities have pay-as-you-throw programs where you pay per bag — incentivizes recycling and reduces waste.' },
      { label: 'Cost Per Square Foot Metric', value: 'This calculator estimates $0.10-0.25/sqft/month for utilities. A 1,500 sqft home: $150-375/month. Energy-efficient homes: $0.08-0.12/sqft. Inefficient homes: $0.20-0.35/sqft. Use this metric to compare homes when apartment/house hunting — a more efficient home justifies higher rent.' },
      { label: 'New Home vs Older Home', value: 'Homes built before 1980 typically cost 20-40% more in utilities due to poor insulation, single-pane windows, and inefficient HVAC. Newer homes (2010+) with energy codes: 30-50% lower utility costs. An older 1,500 sqft home might cost $250-350/month vs $150-220 for new construction.' },
      { label: 'Seasonal Adjustment Strategy', value: 'This calculator gives a blended estimate. For seasonal budgeting: multiply by 0.8 for spring/fall, 1.2-1.4 for summer (AC) or winter (heat), 1.0 for shoulder months. Set up a budget billing/levelized payment plan with your utility to smooth monthly amounts.' },
      { label: 'Renter vs Owner Utility Costs', value: 'Renters typically pay electric + gas + internet + optional water. Homeowners also pay trash ($25-35), water/sewer ($30-80), and higher baseline due to larger spaces. Renters in multi-unit buildings benefit from shared-wall insulation — 10-20% lower heating/cooling costs than single-family homes.' },
    ]}
  },
  description: 'Estimate total monthly utility costs including electricity, gas, water/sewer, trash, and internet based on home size, occupants, and climate region. Get category breakdown and percentage analysis.',
  formula: 'Electric = BaseElectric × (Sqft÷1000) × (1 + (Occupants-1) × 0.2). Gas = BaseGas × (Sqft÷1000) × OccupantFactor. Water = $30 × OccupantFactor. Trash = $25 flat. Internet = $65 (if included). Climate bases: Cold (E:80, G:90), Moderate (E:90, G:40), Hot (E:130, G:25).',
  interpretation: 'A 1,500 sqft home with 2 occupants in a moderate climate, including internet: size factor = 1.50, occupant factor = 1.20 (20% boost for 2nd person). Electric: 90 × 1.50 × 1.20 = $162. Gas: 40 × 1.50 × 1.20 = $72. Water: $30 × 1.20 = $36. Trash: $25. Internet: $65. Total: $360/month. In a cold climate, same home: electric = 80 × 1.50 × 1.20 = $144, gas = 90 × 1.50 × 1.20 = $162, totaling $432 + water + trash + internet = $558. The climate alone causes a $198/month (55%) difference. These estimates align with US Census data showing median monthly utility costs of $150-400 for renters and $200-600 for homeowners, varying significantly by region and home size.'
}

export default calcDef
