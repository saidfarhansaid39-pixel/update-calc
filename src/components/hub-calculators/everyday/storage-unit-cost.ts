import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ unitSize: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), monthlyRate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), months: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), insurance: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), adminFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), climateControl: z.string().min(1) }),
  fields: [
    { name: 'unitSize', label: 'Unit Size (sq ft)', type: 'number', min: 25, step: '25' },
    { name: 'monthlyRate', label: 'Monthly Rent ($)', type: 'number', min: 20, step: '10' },
    { name: 'months', label: 'Months Rented', type: 'number', min: 1, step: '1' },
    { name: 'insurance', label: 'Monthly Insurance ($)', type: 'number', min: 0, step: '5' },
    { name: 'adminFee', label: 'One-Time Admin Fee ($)', type: 'number', min: 0, step: '10' },
    { name: 'climateControl', label: 'Climate Control?', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { unitSize: '100', monthlyRate: '150', months: '6', insurance: '15', adminFee: '0', climateControl: 'no' },
  presets: [
    { label: 'Short-Term Move', values: { unitSize: '50', monthlyRate: '80', months: '3', insurance: '10', adminFee: '20', climateControl: 'no' } },
    { label: 'Seasonal Storage', values: { unitSize: '100', monthlyRate: '140', months: '6', insurance: '12', adminFee: '0', climateControl: 'yes' } },
    { label: 'Home Renovation', values: { unitSize: '200', monthlyRate: '250', months: '4', insurance: '15', adminFee: '30', climateControl: 'no' } },
    { label: 'Long-Term Household', values: { unitSize: '150', monthlyRate: '200', months: '12', insurance: '15', adminFee: '0', climateControl: 'yes' } },
  ],
  compute: (v) => {
    const climateSurcharge = v.climateControl === 'yes' ? v.monthlyRate * 0.3 : 0
    const totalMonthly = v.monthlyRate + climateSurcharge + v.insurance
    const totalCost = totalMonthly * v.months + v.adminFee
    const perSqFt = totalMonthly / v.unitSize
    return { result: totalCost, label: 'Total Storage Cost', unit: '$', steps: [{ label: 'Base Rent', value: `$${v.monthlyRate.toFixed(2)}/mo` }, { label: 'Climate Control', value: `+$${climateSurcharge.toFixed(2)}/mo` }, { label: 'Insurance', value: `+$${v.insurance.toFixed(2)}/mo` }, { label: 'Total Monthly', value: `$${totalMonthly.toFixed(2)}/mo` }, { label: 'Total for Period', value: `$${totalCost.toFixed(2)}` }, { label: 'Cost per Sq Ft', value: `$${perSqFt.toFixed(2)}/sq ft/mo` }] ,
    extras: [
      { label: 'Average Storage Rates', value: 'National average: $1-2/sq ft/month. 5×5 (25 sq ft): $40-80/mo. 10×10 (100 sq ft): $100-200/mo. 10×20 (200 sq ft): $200-350/mo' },
      { label: 'Climate Control Premium', value: 'Climate-controlled storage adds 20-40% to base rent. Essential for electronics, wood furniture, documents, photos, wine, and musical instruments' },
      { label: 'Insurance Options', value: 'Facility insurance: $10-15/mo. Your renters/homeowners policy often covers storage off-premises for free — check with your agent first' },
      { label: 'Intro Rate Trap', value: 'Many facilities offer $1 for the first month then auto-escalate to full price (often 2-3x the intro rate). Read the fine print on rate increases' },
      { label: 'Unit Size Guide', value: '5×5: dorm/studio. 5×10: 1-bedroom apt. 10×10: 2-bedroom. 10×15: 3-bedroom. 10×20: full house. Leave a 3ft walking path' },
      { label: 'Packing to Save Space', value: 'Use uniform box sizes for stacking. Disassemble furniture. Store mattresses in bags. Utilize vertical space — stack to the ceiling' },
      { label: 'Alternatives to Storage', value: 'Sell items you haven\'t used in 6 months. Cost of storage ($1,200-2,400/yr) often exceeds replacement value of stored items' },
    ]}
  },
  description: 'Calculate total storage unit costs including base rent, climate control surcharge, insurance, and one-time admin fees to find your true monthly and total cost.',
  formula: 'TotalCost = (MonthlyRate + ClimateSurcharge + Insurance) × MonthsRented + AdminFee. ClimateSurcharge = MonthlyRate × 30% if climate-controlled. CostPerSqFt = TotalMonthly ÷ UnitSize.',
  interpretation: 'Storage costs vary significantly by location — urban areas can cost 2-3x suburban rates. Climate control adds 20-40% but is essential for sensitive items (electronics, photos, wine, musical instruments). A 10×10 unit (100 sq ft) at $150/mo over 12 months costs $1,800-2,100 including insurance. Before renting, consider: could you sell/donate items worth less than the storage cost? The average renter stores for 12-18 months — a $150/mo unit costs $1,800-2,700 over that period.'
}

export default calcDef
