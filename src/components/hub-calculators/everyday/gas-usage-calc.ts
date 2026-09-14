import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ gasApplianceWatts: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasUsageHours: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasRatePerTherm: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'gasApplianceWatts', label: 'Appliance Input (BTU/hr)', type: 'number', min: 1000, step: '1000' },
    { name: 'gasUsageHours', label: 'Hours Used per Day', type: 'number', min: 0.5, step: '0.5' },
    { name: 'gasRatePerTherm', label: 'Gas Rate per Therm ($)', type: 'number', min: 0.5, step: '0.25' },
  ],
  defaults: { gasApplianceWatts: '40000', gasUsageHours: '3', gasRatePerTherm: '1.20' },
  presets: [
    { label: 'Water Heater (family)', values: { gasApplianceWatts: '40000', gasUsageHours: '3', gasRatePerTherm: '1.20' } },
    { label: 'Gas Furnace (winter)', values: { gasApplianceWatts: '80000', gasUsageHours: '8', gasRatePerTherm: '1.20' } },
    { label: 'Gas Stove/Oven', values: { gasApplianceWatts: '15000', gasUsageHours: '1.5', gasRatePerTherm: '1.20' } },
    { label: 'Gas Dryer', values: { gasApplianceWatts: '22000', gasUsageHours: '1', gasRatePerTherm: '1.20' } },
  ],
  compute: (v) => {
    const btusPerDay = v.gasApplianceWatts * v.gasUsageHours
    const thermsPerDay = btusPerDay / 100000
    const thermsPerMonth = thermsPerDay * 30
    const monthlyCost = thermsPerMonth * v.gasRatePerTherm
    const annualCost = monthlyCost * 12
    const btusPerMonth = btusPerDay * 30
    const costPerHour = v.gasApplianceWatts / 100000 * v.gasRatePerTherm
    const kWEquivalent = v.gasApplianceWatts * 0.000293
    return { result: monthlyCost, label: 'Monthly Gas Cost', unit: '$', steps: [{ label: 'Daily BTU Usage', value: `${btusPerDay.toFixed(0)} BTU` }, { label: 'Daily Therms', value: `${thermsPerDay.toFixed(3)} therms` }, { label: 'Monthly Usage', value: `${thermsPerMonth.toFixed(1)} therms` }, { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` }, { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` }, { label: 'Cost per Hour', value: `$${costPerHour.toFixed(4)}` }, { label: 'kWh Equivalent', value: `${kWEquivalent.toFixed(2)} kW (${(kWEquivalent * v.gasUsageHours * 30).toFixed(0)} kWh/mo)` }, { label: 'Electric Equivalent Cost', value: `~$${(kWEquivalent * v.gasUsageHours * 30 * 0.14).toFixed(2)} if electric at $0.14/kWh` }] ,
    extras: [
      { label: 'Gas vs Electric Cost Comparison', value: `This gas appliance costs $${monthlyCost.toFixed(2)}/mo. An electric equivalent at $0.14/kWh would cost ~$${(kWEquivalent * v.gasUsageHours * 30 * 0.14).toFixed(2)}/mo — gas saves ~$${((kWEquivalent * v.gasUsageHours * 30 * 0.14) - monthlyCost).toFixed(2)}/mo. In regions with cheap gas ($1.00/therm) vs expensive electric ($0.20/kWh), gas saves even more.` },
      { label: 'Seasonal Usage Pattern', value: `At ${v.gasUsageHours} hrs/day, this is ${v.gasUsageHours >= 6 ? 'heavy' : v.gasUsageHours >= 3 ? 'moderate' : 'light'} usage. Heating appliances run 2-5× more in winter (Nov-Mar). Budget for seasonal swings: winter gas bills can be $${(monthlyCost * 3).toFixed(0)}-$${(monthlyCost * 5).toFixed(0)} vs summer $${(monthlyCost * 0.3).toFixed(0)}-$${(monthlyCost * 0.5).toFixed(0)}.` },
      { label: 'BTU/hr Appliance Context', value: `${v.gasApplianceWatts.toLocaleString()} BTU/hr: ${v.gasApplianceWatts >= 100000 ? 'large furnace/boiler range' : v.gasApplianceWatts >= 50000 ? 'water heater or medium furnace' : v.gasApplianceWatts >= 20000 ? 'gas dryer or small heater' : 'gas stove/oven or grill'}. Tankless water heaters: 150,000-200,000 BTU/hr (on-demand). Whole-house: sum of all gas appliances.` },
      { label: 'Thermostat & Efficiency Savings', value: `Lowering thermostat 3°F saves 5-10% on heating costs (~$${(monthlyCost * 0.075).toFixed(2)}/mo). A smart thermostat saves 10-15% annually: $${(annualCost * 0.125).toFixed(0)}/yr on this appliance. Programmable scheduling prevents heating empty rooms. Annual maintenance (clean burner, replace filter) improves efficiency 5-10%.` },
      { label: 'Gas Rate Shopping', value: `At ${v.gasRatePerTherm.toFixed(2)}/therm, you're paying $${(v.gasRatePerTherm > 1.50 ? 'above' : v.gasRatePerTherm > 1.00 ? 'around' : 'below')} national average (~$1.05/therm in 2024). ${v.gasRatePerTherm > 1.50 ? 'Consider switching suppliers if your state has deregulated gas markets — savings of 10-20%.' : 'Check if your supplier offers budget billing to smooth seasonal spikes.'} Fixed-rate plans protect against winter price spikes.` },
      { label: 'Appliance Efficiency Rating', value: `If this appliance is over 15 years old, replacing it with a 95% AFUE (Annual Fuel Utilization Efficiency) model saves ~$${(monthlyCost * 0.20).toFixed(2)}/mo. New gas furnaces: 80-98.5% AFUE. Water heaters: energy factor (EF) 0.60-0.90. An Energy Star gas furnace saves $$${(annualCost * 0.20).toFixed(0)}/yr vs a 20-year-old model.` },
      { label: 'Carbon Footprint Analysis', value: `This appliance uses ${thermsPerMonth.toFixed(1)} therms/mo = ${(thermsPerMonth * 11.7).toFixed(2)} tons CO₂/yr (1 therm natural gas = 11.7 lbs CO₂). Annual: ${(thermsPerMonth * 12 * 11.7 / 2000).toFixed(2)} tons. Modern gas furnaces reduce emissions but still contribute to household carbon footprint.` },
      { label: 'Insulation & Heat Loss', value: `Poor insulation increases gas usage by 20-40%. At ${v.gasUsageHours} hrs/day, heat loss from drafty windows could add $${(monthlyCost * 0.3).toFixed(2)}/mo. Sealing air leaks and adding attic insulation (R-38 to R-60) typically pays for itself in 1-3 seasons through reduced gas bills.` },
    ]}
  },
  description: 'Calculate natural gas appliance operating cost from BTU/hr input, daily usage hours, and gas rate per therm. Includes gas vs electric comparison, seasonal projections, efficiency upgrade savings, and carbon footprint analysis.',
  formula: 'Monthly Cost = (BTU/hr × Hours/Day × 30 ÷ 100,000) × Rate per Therm | kWh Equivalent = BTU/hr × 0.000293 | Cost per Hour = (BTU/hr ÷ 100,000) × Rate per Therm',
  interpretation: '1 therm = 100,000 BTU. Water heaters: 30,000-50,000 BTU/hr. Furnaces: 60,000-120,000 BTU/hr. Gas is typically 50-70% cheaper than electric for heating. Lowering thermostat 3°F saves 5-10%. Upgrading from 80% to 95% AFUE furnace saves ~15% on gas bills. Poor insulation adds 20-40% to usage. Budget billing smooths seasonal winter peaks.'
}

export default calcDef
