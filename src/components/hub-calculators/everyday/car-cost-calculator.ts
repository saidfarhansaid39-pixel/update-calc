import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ purchasePrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsOwned: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), milesYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelMpg: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fuelPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), insuranceYear: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), maintenanceYear: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', min: 1000, step: '1000' },
    { name: 'yearsOwned', label: 'Years Owned', type: 'number', min: 1, max: 20, step: '1' },
    { name: 'milesYear', label: 'Miles Driven per Year', type: 'number', min: 1000, step: '1000' },
    { name: 'fuelMpg', label: 'Average MPG', type: 'number', min: 10, step: '5' },
    { name: 'fuelPrice', label: 'Avg Fuel Price ($/gal)', type: 'number', min: 1, step: '0.5' },
    { name: 'insuranceYear', label: 'Annual Insurance ($)', type: 'number', min: 0, step: '200' },
    { name: 'maintenanceYear', label: 'Annual Maintenance ($)', type: 'number', min: 0, step: '100' },
  ],
  defaults: { purchasePrice: '30000', yearsOwned: '5', milesYear: '12000', fuelMpg: '25', fuelPrice: '3.5', insuranceYear: '1400', maintenanceYear: '800' },
  presets: [
    { label: 'Compact Economy Car', values: { purchasePrice: '22000', yearsOwned: '6', milesYear: '10000', fuelMpg: '35', fuelPrice: '3.5', insuranceYear: '1100', maintenanceYear: '600' } },
    { label: 'Full-Size SUV', values: { purchasePrice: '50000', yearsOwned: '5', milesYear: '15000', fuelMpg: '18', fuelPrice: '3.8', insuranceYear: '1800', maintenanceYear: '1000' } },
    { label: 'Used Sedan (3yr old)', values: { purchasePrice: '18000', yearsOwned: '4', milesYear: '12000', fuelMpg: '30', fuelPrice: '3.5', insuranceYear: '900', maintenanceYear: '500' } },
    { label: 'Electric Vehicle', values: { purchasePrice: '45000', yearsOwned: '5', milesYear: '12000', fuelMpg: '100', fuelPrice: '3', insuranceYear: '1300', maintenanceYear: '400' } },
  ],
  compute: (v) => {
    const fuelCostYear = (v.milesYear / v.fuelMpg) * v.fuelPrice
    const annualCost = fuelCostYear + v.insuranceYear + v.maintenanceYear
    const totalCost = v.purchasePrice + annualCost * v.yearsOwned
    const totalMiles = v.milesYear * v.yearsOwned
    const costPerMile = totalMiles > 0 ? totalCost / totalMiles : 0
    const annualDepreciation = v.purchasePrice * 0.15
    const trueAnnualCost = annualCost + annualDepreciation
    const operatingCostPerMile = totalMiles > 0 ? annualCost * v.yearsOwned / totalMiles : 0
    return {
      result: costPerMile, label: 'Cost per Mile', unit: '$',
      steps: [
        { label: 'Purchase Price', value: `$${v.purchasePrice.toFixed(0)}` },
        { label: 'Annual Fuel Cost', value: `$${fuelCostYear.toFixed(0)} (${v.milesYear}mi ÷ ${v.fuelMpg}mpg × $${v.fuelPrice})` },
        { label: 'Annual Insurance', value: `$${v.insuranceYear.toFixed(0)}` },
        { label: 'Annual Maintenance', value: `$${v.maintenanceYear.toFixed(0)}` },
        { label: 'Total Annual Operating', value: `$${annualCost.toFixed(0)}` },
        { label: 'Total Over ${v.yearsOwned} Years', value: `$${totalCost.toFixed(0)} (purchase + operating)` },
        { label: 'Cost per Mile', value: `$${costPerMile.toFixed(2)}/mi ($${totalCost.toFixed(0)} ÷ ${totalMiles.toLocaleString()} mi)` },
        { label: 'Estimated Depreciation', value: `~$${(annualDepreciation * v.yearsOwned).toFixed(0)} over ${v.yearsOwned} yr (15%/yr avg)` },
      ],
      extras: [
        { label: 'True Cost Breakdown', value: `Purchase: ${((v.purchasePrice / totalCost) * 100).toFixed(0)}% | Operating: ${((annualCost * v.yearsOwned / totalCost) * 100).toFixed(0)}% | Fuel: ${((fuelCostYear * v.yearsOwned / totalCost) * 100).toFixed(0)}% of total cost` },
        { label: 'Depreciation Reality', value: 'New cars lose 20-30% in year 1 and ~15% annually thereafter. A $30K car is worth ~$13K after 5 years. That\'s ~$17K in depreciation — often the single largest cost, more than fuel or maintenance.' },
        { label: 'Fuel Economy Impact', value: 'Improving from 25 MPG to 35 MPG at 12K mi/yr saves $480/yr at $3.50/gal. Over 5 years: $2,400 savings. A hybrid premium of $3K pays for itself in ~6 years.' },
        { label: 'Maintenance by Mileage', value: 'Low mileage: oil changes, tires ($400/yr). 60K mi: timing belt, brake pads (+$1,000). 100K mi: transmission fluid, shocks, major service (+$2,000). Budget more for older/higher-mileage cars.' },
        { label: 'Insurance Cost Factors', value: 'Full coverage for a new car: $1,000-2,000/yr. Factors: vehicle value, your age, driving record, location, credit score, and deductible ($500 vs $1,000). Shop rates annually.' },
        { label: 'EV vs Gas Savings', value: 'Electric vehicles: ~3.5 mi/kWh at $0.14/kWh = 4¢/mi. Gas car at 25 MPG and $3.50/gal = 14¢/mi. Over 60K mi: $6,000 saved in fuel, plus lower maintenance (no oil changes, fewer brake jobs).' },
        { label: 'Optimal Replacement Cycle', value: 'The sweet spot for car ownership is 5-7 years or 80-100K miles. By then, depreciation stabilizes, but major repairs haven\'t started. Selling at year 5-6 maximizes value before major maintenance costs.' },
        { label: 'Cost-per-Mile Benchmarks', value: 'AAA reports average US cost at $0.55-0.65/mile for sedans (all costs including depreciation). SUVs: $0.70-0.85/mile. Small cars: $0.45-0.55/mile. Under $0.50/mile is considered excellent.' },
      ]
    }
  },
  description: 'Calculate the true cost per mile and total cost of owning a car — including purchase price, fuel, insurance, maintenance, and depreciation estimates over your ownership period.',
  formula: 'Cost/Mile = (Purchase + Years × (Fuel + Insurance + Maintenance)) / (Years × Miles/Year) | Fuel = (Miles/Year ÷ MPG) × FuelPrice',
  interpretation: 'Average US cost: $0.55-0.65/mile (all costs including depreciation). Fuel is 25-35% of operating cost. Depreciation adds $0.15-0.25/mile for new cars. Buy used 2-3 years old to avoid the steepest depreciation curve. Choose fuel-efficient vehicles for maximum long-term savings.'
}

export default calcDef
