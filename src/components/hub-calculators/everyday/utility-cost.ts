import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ ucElectricKwh: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucElectricRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucGasTherms: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucGasRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucWaterGal: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ucWaterRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'ucElectricKwh', label: 'Electricity Usage (kWh)', type: 'number', min: 0, step: '50' },
    { name: 'ucElectricRate', label: 'Electric Rate ($/kWh)', type: 'number', min: 0, step: '0.02' },
    { name: 'ucGasTherms', label: 'Gas Usage (therms)', type: 'number', min: 0, step: '10' },
    { name: 'ucGasRate', label: 'Gas Rate ($/therm)', type: 'number', min: 0, step: '0.5' },
    { name: 'ucWaterGal', label: 'Water Usage (gallons)', type: 'number', min: 0, step: '1000' },
    { name: 'ucWaterRate', label: 'Water Rate ($/1000 gal)', type: 'number', min: 0, step: '2' },
  ],
  defaults: { ucElectricKwh: '900', ucElectricRate: '0.14', ucGasTherms: '40', ucGasRate: '1.5', ucWaterGal: '4000', ucWaterRate: '8' },
  presets: [
    { label: 'Small Apt / Low Usage', values: { ucElectricKwh: '400', ucElectricRate: '0.12', ucGasTherms: '10', ucGasRate: '1.2', ucWaterGal: '1500', ucWaterRate: '6' } },
    { label: 'Avg Family Home', values: { ucElectricKwh: '900', ucElectricRate: '0.14', ucGasTherms: '40', ucGasRate: '1.5', ucWaterGal: '4000', ucWaterRate: '8' } },
    { label: 'Large Home / Winter Peak', values: { ucElectricKwh: '1500', ucElectricRate: '0.16', ucGasTherms: '100', ucGasRate: '1.8', ucWaterGal: '8000', ucWaterRate: '10' } },
  ],
  compute: (v) => {
    const electricCost = v.ucElectricKwh * v.ucElectricRate
    const gasCost = v.ucGasTherms * v.ucGasRate
    const waterCost = v.ucWaterGal / 1000 * v.ucWaterRate
    const total = electricCost + gasCost + waterCost
    const pctElectric = total > 0 ? (electricCost / total) * 100 : 0
    const pctGas = total > 0 ? (gasCost / total) * 100 : 0
    const pctWater = total > 0 ? (waterCost / total) * 100 : 0
    return { result: total, label: 'Total Utility Cost', unit: '$', steps: [{ label: 'Electricity', value: `${v.ucElectricKwh} kWh × $${v.ucElectricRate.toFixed(3)}/kWh = $${electricCost.toFixed(2)} (${pctElectric.toFixed(0)}%)` }, { label: 'Natural Gas', value: `${v.ucGasTherms} therms × $${v.ucGasRate.toFixed(2)}/therm = $${gasCost.toFixed(2)} (${pctGas.toFixed(0)}%)` }, { label: 'Water/Sewer', value: `${v.ucWaterGal.toFixed(0)} gal × $${v.ucWaterRate.toFixed(2)}/kgal = $${waterCost.toFixed(2)} (${pctWater.toFixed(0)}%)` }, { label: 'Total Monthly', value: `$${electricCost.toFixed(2)} + $${gasCost.toFixed(2)} + $${waterCost.toFixed(2)} = $${total.toFixed(2)}` }, { label: 'Annual Cost', value: `$${(total * 12).toFixed(2)}/year` }, { label: 'Cost per sq ft equivalent', value: `$${(total / 1500).toFixed(2)}/sq ft (approx)` }] ,
    extras: [
      { label: 'Average US Utility Benchmarks', value: 'National averages: electricity 900 kWh/month at 14-16¢/kWh = $126-144. Gas 40 therms/month at $1.20-1.80/therm = $48-72. Water 4,000 gal/month at $6-12/kgal = $24-48. Total: $198-264/month. This calculator breaks down each utility so you can identify the biggest cost category.' },
      { label: 'Electricity Usage Breakdown', value: 'Typical home electricity: HVAC 46%, water heater 14%, washer/dryer 13%, lighting 9%, refrigerator 7%, electronics 6%, cooking 5%. Focus savings on HVAC (programmable thermostat, clean filters) and replacing old appliances with Energy Star models.' },
      { label: 'Gas Usage by Season', value: 'In winter, gas heating consumes 60-80% of total gas usage. Summer gas: mostly water heating (40-50%) and cooking (10-20%). A typical home uses 20-30 therms/month in summer and 60-120 therms/month in winter. Annual average: 40-50 therms/month.' },
      { label: 'Energy Cost per Square Foot', value: 'US average: $1.50-2.50/sq ft/year for total utilities. A 1,500 sq ft home: $2,250-3,750/year ($188-313/month). Energy-efficient homes: $0.80-1.20/sq ft/year. Poorly insulated homes: $2.50-4.00/sq ft/year. Use this metric to compare your home efficiency.' },
      { label: 'Rate Shopping Tips', value: 'In deregulated energy markets (TX, IL, OH, PA, NY, MA): you can choose your electric/gas supplier. Fixed-rate plans lock in rates for 6-36 months. Variable rates can spike. Compare total supply + delivery charges — some offers have hidden fees. Use state-run comparison sites.' },
      { label: 'Utility Cost Inflation', value: 'US electricity rates have risen 3-5% annually over the past decade. Gas rates: 2-4% annual increase. Water/sewer: fastest rising at 5-8% annually due to aging infrastructure. Budget for 5% annual utility cost increases when planning household expenses.' },
      { label: 'Solar Panel Savings', value: 'Solar panels reduce electric bills by 50-100%. Average 6 kW system: $15,000-20,000 (before 30% federal tax credit). Payback: 7-12 years. With net metering, excess generation credits offset nighttime usage. Solar alone cannot eliminate gas or water utility costs.' },
    ]}
  },
  description: 'Calculate total utility costs from electric, gas, and water usage with per-unit rates. Get percentage breakdowns, annual projections, and usage benchmarks for comprehensive utility expense tracking.',
  formula: 'Total = (kWh × $/kWh) + (Therms × $/therm) + (Gal ÷ 1,000 × $/kgal). Category% = CategoryCost ÷ Total × 100. Annual = Total × 12.',
  interpretation: 'A home using 900 kWh at $0.14/kWh ($126), 40 therms at $1.50/therm ($60), and 4,000 gal at $8/kgal ($32) pays $218/month total. Electricity dominates at 58% of the bill, followed by gas at 28% and water at 15%. Annually: $2,616. Reducing electricity by 20% (to 720 kWh) through LED bulbs, efficient appliances, and mindful HVAC saves $25/month ($302/year). Adding gas savings from a programmable thermostat ($10/month) and water savings from low-flow fixtures ($6/month) brings total potential savings to $41/month ($492/year) — a 19% reduction.'
}

export default calcDef
