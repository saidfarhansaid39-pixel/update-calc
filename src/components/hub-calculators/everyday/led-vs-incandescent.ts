import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ bulbCount: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), wattInc: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), wattLed: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), hoursPerDay: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ledCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), incCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  defaults: { bulbCount: '10', wattInc: '60', wattLed: '9', hoursPerDay: '4', rate: '0.12', ledCost: '3', incCost: '1' },
  presets: [
    { label: '10 Bulbs / 4 hrs', values: { bulbCount: '10', wattInc: '60', wattLed: '9', hoursPerDay: '4', rate: '0.12', ledCost: '3', incCost: '1' } },
    { label: '5 Bulbs / 8 hrs', values: { bulbCount: '5', wattInc: '100', wattLed: '14', hoursPerDay: '8', rate: '0.15', ledCost: '4', incCost: '2' } },
    { label: '20 Bulbs Kitchen+', values: { bulbCount: '20', wattInc: '40', wattLed: '6', hoursPerDay: '6', rate: '0.14', ledCost: '3', incCost: '1' } },
  ],
  fields: [
    { name: 'bulbCount', label: 'Number of Bulbs', type: 'number', min: 1, step: '1' },
    { name: 'wattInc', label: 'Incandescent Wattage (W)', type: 'number', min: 1, step: '10' },
    { name: 'wattLed', label: 'LED Wattage (W)', type: 'number', min: 1, step: '1' },
    { name: 'hoursPerDay', label: 'Hours On per Day', type: 'number', min: 0, step: '1' },
    { name: 'rate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0, step: '0.01' },
    { name: 'incCost', label: 'Incandescent Bulb Cost ($)', type: 'number', min: 0, step: '1' },
    { name: 'ledCost', label: 'LED Bulb Cost ($)', type: 'number', min: 0, step: '1' },
  ],
  compute: (v) => { const cnt = parseFloat(v.bulbCount)||0; const iw = parseFloat(v.wattInc)||0; const lw = parseFloat(v.wattLed)||0; const h = parseFloat(v.hoursPerDay)||0; const r = parseFloat(v.rate)||0; const ic = parseFloat(v.incCost)||0; const lc = parseFloat(v.ledCost)||0; const dailyKwhInc = (iw * cnt * h) / 1000; const dailyKwhLed = (lw * cnt * h) / 1000; const annualKwhInc = dailyKwhInc * 365; const annualKwhLed = dailyKwhLed * 365; const annualCostInc = annualKwhInc * r + ic / 2; const annualCostLed = annualKwhLed * r + lc / 8; const savings = annualCostInc - annualCostLed; const savingPct = (savings / annualCostInc) * 100; return { result: savings, label: 'Annual Savings with LED', unit: '$', steps: [
    { label: '1. Incan. Daily kWh', value: `${iw}W × ${cnt} × ${h}h / 1000 = ${dailyKwhInc.toFixed(3)} kWh` },
    { label: '2. LED Daily kWh', value: `${lw}W × ${cnt} × ${h}h / 1000 = ${dailyKwhLed.toFixed(3)} kWh` },
    { label: '3. Incan. Annual Cost', value: `${annualKwhInc.toFixed(0)} kWh × $${r} + $${(ic/2).toFixed(2)} bulb = $${annualCostInc.toFixed(2)}` },
    { label: '4. LED Annual Cost', value: `${annualKwhLed.toFixed(0)} kWh × $${r} + $${(lc/8).toFixed(2)} bulb = $${annualCostLed.toFixed(2)}` },
    { label: '5. Annual Savings', value: `$${annualCostInc.toFixed(2)} - $${annualCostLed.toFixed(2)} = $${savings.toFixed(2)}` },
    { label: '6. Savings %', value: `($${savings.toFixed(2)} ÷ $${annualCostInc.toFixed(2)}) × 100 = ${savingPct.toFixed(1)}%` },
  ] ,
    extras: [
      { label: 'Payback Period', value: `LED premium: $${(lc - ic).toFixed(2)} per bulb. At $${(savings/cnt).toFixed(2)} saved/bulb/yr, payback in ${((lc - ic) / (savings/cnt) * 12).toFixed(0)} months.` },
      { label: 'Bulb Lifespan', value: 'LEDs: ~25,000 hours (17 years at 4 hrs/day). Incandescents: ~1,000 hours (8 months at 4 hrs/day). LEDs last 25× longer.' },
      { label: 'Energy Savings Math', value: 'LEDs convert 90% of energy to light, only 10% to heat. Incandescents: 10% to light, 90% to heat. That\'s why LEDs use 85% less electricity.' },
      { label: 'Dimmable Compatibility', value: 'Check for "dimmable" on LED packages when using with dimmer switches. Standard LEDs on dimmers flicker, hum, and fail prematurely.' },
      { label: 'Warranty Coverage', value: 'Most LED bulbs come with 3-5 year warranties. Philips and GE offer 5-10 years. Keep your receipt — failed bulbs under warranty are replaceable.' },
      { label: 'Enclosed Fixtures', value: 'Some LEDs overheat in enclosed fixtures. Look for "rated for enclosed fixtures" on the package. Using non-rated LEDs in enclosures cuts lifespan by 50-70%.' },
      { label: 'Color Rendering Index', value: 'CRI measures color accuracy (0-100). LEDs typically have CRI 80-90+. For artwork/photography, choose CRI 95+ LEDs. Incandescents are CRI 100.' },
      { label: 'Environmental Impact', value: 'One LED replacing 25 incandescents over its lifetime prevents 1,500 lb of CO2 emissions. 10 LEDs = 15,000 lb CO2 = planting 70 trees per year.' },
    ]} },
  description: 'Compare LED vs incandescent light bulb costs including energy usage, bulb lifespan, and purchase price to show annual savings and payback period.',
  formula: 'Annual Savings = [(IncW × Bulbs × Hrs × 365/1000 × Rate) + IncCost/2yr] − [(LEDW × Bulbs × Hrs × 365/1000 × Rate) + LEDCost/8yr]. Payback = (LEDCost − IncCost) / AnnualSavingsPerBulb.',
  interpretation: 'LEDs use 75-85% less energy and last 15-25× longer than incandescents. A single LED replacing a 60W incandescent (@4hr/day, $0.12/kWh) saves ~$8/year. Payback period: typically under 6 months per bulb. Over its 25,000-hour life, one LED saves $150-200 in electricity.'
}

export default calcDef
