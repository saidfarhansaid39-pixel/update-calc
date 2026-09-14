import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ annualMiles: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), evKwhPer100: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), elecRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), gasPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'annualMiles', label: 'Annual Miles Driven', type: 'number', min: 1000, step: '1000' },
    { name: 'evKwhPer100', label: 'EV Efficiency (kWh/100mi)', type: 'number', min: 15, step: '5' },
    { name: 'elecRate', label: 'Electricity Rate ($/kWh)', type: 'number', min: 0.01, step: '0.01' },
    { name: 'gasMpg', label: 'Gas Vehicle MPG', type: 'number', min: 10, step: '5' },
    { name: 'gasPrice', label: 'Gas Price ($/gal)', type: 'number', min: 1, step: '0.5' },
  ],
  defaults: { annualMiles: '12000', evKwhPer100: '34', elecRate: '0.14', gasMpg: '25', gasPrice: '3.50' },
  presets: [
    { label: 'Tesla Model 3 vs Toyota Camry', values: { annualMiles: '12000', evKwhPer100: '26', elecRate: '0.14', gasMpg: '32', gasPrice: '3.50' } },
    { label: 'F-150 Lightning vs Gas F-150', values: { annualMiles: '15000', evKwhPer100: '48', elecRate: '0.12', gasMpg: '20', gasPrice: '3.80' } },
    { label: 'California Commuter (High Rates)', values: { annualMiles: '10000', evKwhPer100: '30', elecRate: '0.30', gasMpg: '30', gasPrice: '5.00' } },
    { label: 'Short Commute Hybrid vs EV', values: { annualMiles: '7000', evKwhPer100: '34', elecRate: '0.14', gasMpg: '50', gasPrice: '3.50' } },
  ],
  compute: (v) => {
    const evAnnualKwh = (v.annualMiles / 100) * v.evKwhPer100
    const evFuelCost = evAnnualKwh * v.elecRate
    const evCostPerMile = evFuelCost / v.annualMiles
    const gasGallons = v.annualMiles / v.gasMpg
    const gasFuelCost = gasGallons * v.gasPrice
    const gasCostPerMile = gasFuelCost / v.annualMiles
    const annualSavings = gasFuelCost - evFuelCost
    const savingsPct = (annualSavings / gasFuelCost) * 100
    const monthlySavings = annualSavings / 12
    const fiveYearSavings = annualSavings * 5
    const evCostPer100Mi = v.evKwhPer100 * v.elecRate
    const gasCostPer100Mi = (100 / v.gasMpg) * v.gasPrice
    const evGalEquivalent = evAnnualKwh * (1 / 33.7)
    return { result: annualSavings, label: 'Annual Fuel Savings', unit: '$', steps: [
      { label: 'Annual Miles', value: `${v.annualMiles.toLocaleString()} mi/yr` },
      { label: 'EV Annual Energy', value: `${v.annualMiles.toLocaleString()} mi / 100 × ${v.evKwhPer100} kWh/100mi = ${evAnnualKwh.toFixed(0)} kWh` },
      { label: 'EV Annual Cost', value: `${evAnnualKwh.toFixed(0)} kWh × $${v.elecRate.toFixed(2)} = $${evFuelCost.toFixed(0)}` },
      { label: 'Gas Annual Fuel', value: `${v.annualMiles.toLocaleString()} mi / ${v.gasMpg} MPG = ${gasGallons.toFixed(0)} gal × $${v.gasPrice.toFixed(2)} = $${gasFuelCost.toFixed(0)}` },
      { label: 'Cost per 100 Miles', value: `EV: $${evCostPer100Mi.toFixed(2)} | Gas: $${gasCostPer100Mi.toFixed(2)}` },
      { label: 'Annual Savings', value: `$${annualSavings.toFixed(0)} (${savingsPct.toFixed(0)}% less)` },
      { label: 'Monthly Savings', value: `$${monthlySavings.toFixed(0)}/mo` },
      { label: '5-Year Fuel Savings', value: `$${fiveYearSavings.toFixed(0)}` },
      { label: 'Gasoline Equivalent', value: `${evGalEquivalent.toFixed(1)} gal/yr (EV uses ${evGalEquivalent.toFixed(1)} 'gas-equivalent' gal)` },
    ] ,
    extras: [
      { label: "Maintenance Cost Difference", value: "EVs have 40-50% lower maintenance costs: no oil changes ($80-120/yr), no timing belts ($500-1,200), no transmission ($3,000-5,000), no exhaust system ($500-2,000). Brake pads last 100,000+ miles (regenerative braking). Estimated 5-year maintenance: EV $1,500-2,500 vs gas $4,000-6,000 = $2,000-4,000 savings." },
      { label: "Fuel Price Volatility Comparison", value: "Electricity prices are 2-3× more stable than gasoline. Gas prices fluctuated $1.50-5.00/gal (2019-2024, 230% swing). Electricity rates fluctuated $0.12-0.18/kWh (50% swing over same period). EV fuel costs are predictable and hedge against oil price spikes. Power from home solar is effectively fixed for 25-30 years." },
      { label: "Carbon Footprint Comparison", value: "EV life-cycle emissions (including manufacturing + electricity generation): ~200 gCO2/mi on average US grid. Gas car (30 MPG): ~400 gCO2/mi (tailpipe + upstream). Saving: 200 gCO2/mi. At 12,000 mi/yr = 2.4 metric tons CO2 saved/yr. With solar charging: ~50 gCO2/mi (panel manufacturing only) = 4.2 tons saved/yr." },
      { label: "Depreciation & TCO", value: "3-year residual value: Tesla 65-70%, other EVs 45-60%, comparable gas cars 55-65%. 5-year total cost of ownership (purchase + fuel + maintenance + insurance - resale): EV is $0.40-0.55/mi vs gas $0.50-0.70/mi. The fuel savings ($0.07-0.10/mi) + maintenance savings ($0.02-0.04/mi) offset higher purchase price within 2-4 years." },
      { label: "Hybrid as Middle Ground", value: "Plug-in hybrids (PHEVs) like Prius Prime (25 mi EV range) or RAV4 Prime (42 mi EV range) cover 60-80% of daily miles on electric. PHEV TCO falls between EV and gas. If you can't charge at home, a hybrid (non-plug-in) like Prius (50+ MPG) is 30-50% cheaper to fuel than a standard gas car." },
      { label: "Insurance Cost Factor", value: "EV insurance is 15-40% higher than gas equivalents due to higher repair costs and longer repair times. Tesla Model Y: $2,000-3,000/yr vs Toyota RAV4: $1,400-1,800/yr ($500-1,200 more). Shop dedicated EV insurance (Tesla Insurance, Root) for 10-30% savings. Some insurers offer usage-based discounts for low-mileage EV drivers." },
      { label: "State & Federal Incentives", value: "Federal: Up to $7,500 tax credit (IRA 2023 rules — income and MSRP caps apply). Many states add: CA $2,000-7,500 (CVRP), CO $2,500-5,000, NY $500-2,000, MA $2,500-3,500, OR $2,500-5,000. Utility rebates: $250-1,500 for Level 2 charger. HOV lane access (CA, NY, VA etc.). Combined incentives: $5,000-15,000 in some regions." },
      { label: "Charging Infrastructure Access", value: "Home charging availability: 65% of US households have dedicated off-street parking suitable for Level 2 installation. Apartment/condo charging: 15-20% have access, growing via federal NEVI funding. Workplace charging: 20% of employers offer some EV charging (up from 5% in 2020). DC fast chargers: ~40,000 ports in US — needs to grow 5× for mass adoption." },
    ]}
  },
  description: 'Compare total annual fuel costs between an EV and a gas vehicle side by side. Includes maintenance savings projection, per-100-mile cost comparison, and 5-year fuel savings outlook.',
  formula: 'Savings = [(Miles/MPG × $/gal)] - [(Miles/100 × kWh/100mi × $/kWh)] | $/100mi = kWh/100mi × $/kWh vs (100/MPG) × $/gal',
  interpretation: 'At the US average rate of $0.14/kWh and $3.50/gal gas, an EV (34 kWh/100mi) saves ~$1,200/yr vs a 25 MPG gas car — but the gap widens dramatically in regions with high gas prices (California: $5/gal saves $2,200/yr) or narrows where gas is cheap and electricity is expensive (Hawaii: $0.44/kWh vs $4.70/gal saves only $500/yr). The true financial case for an EV includes not just fuel savings ($7,000-12,000 over 10 years) but maintenance ($4,000-6,000 savings), incentives ($5,000-15,000), and fuel price stability.'
}

export default calcDef
