import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ asc2UnitSize: z.string().min(1), asc2Months: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), asc2Climate: z.string().min(1), asc2Insurance: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), asc2Access: z.string().min(1), asc2Vehicle: z.string().min(1) }),
  fields: [
    { name: 'asc2UnitSize', label: 'Unit Size', type: 'select', options: [{ label: 'Small (5x5)', value: '5x5' }, { label: 'Medium (5x10)', value: '5x10' }, { label: 'Large (10x10)', value: '10x10' }, { label: 'XL (10x15)', value: '10x15' }, { label: 'Jumbo (10x20)', value: '10x20' }, { label: 'Vehicle (10x20)', value: 'vehicle' }] },
    { name: 'asc2Months', label: 'Months of Storage', type: 'number', min: 1, step: '1' },
    { name: 'asc2Climate', label: 'Climate Controlled', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'asc2Insurance', label: 'Monthly Insurance ($)', type: 'number', min: 0, step: '5' },
    { name: 'asc2Access', label: '24/7 Access', type: 'select', options: [{ label: 'Yes (+$15)', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'asc2Vehicle', label: 'Vehicle Storage', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'Car ($75/mo)', value: 'car' }, { label: 'RV/Boat ($150/mo)', value: 'rv' }] },
  ],
  defaults: { asc2UnitSize: '5x10', asc2Months: '6', asc2Climate: 'no', asc2Insurance: '10', asc2Access: 'no', asc2Vehicle: 'none' },
  presets: [
    { label: 'Moving Out (3 months)', values: { asc2UnitSize: '10x10', asc2Months: '3', asc2Climate: 'no', asc2Insurance: '10', asc2Access: 'yes', asc2Vehicle: 'none' } },
    { label: 'Long-Term Storage (12 mo)', values: { asc2UnitSize: '5x10', asc2Months: '12', asc2Climate: 'yes', asc2Insurance: '15', asc2Access: 'no', asc2Vehicle: 'none' } },
    { label: 'RV Winter Storage (6 mo)', values: { asc2UnitSize: 'vehicle', asc2Months: '6', asc2Climate: 'no', asc2Insurance: '10', asc2Access: 'no', asc2Vehicle: 'rv' } },
    { label: 'Car Storage (4 months)', values: { asc2UnitSize: 'vehicle', asc2Months: '4', asc2Climate: 'no', asc2Insurance: '5', asc2Access: 'yes', asc2Vehicle: 'car' } },
  ],
  compute: (v) => {
    const baseRates: Record<string, number> = { '5x5': 45, '5x10': 65, '10x10': 95, '10x15': 130, '10x20': 170, vehicle: 120 }
    const base = baseRates[v.asc2UnitSize] || 95
    const climateFactor = v.asc2Climate === 'yes' ? 1.25 : 1
    const accessFee = v.asc2Access === 'yes' ? 15 : 0
    const vehicleCosts: Record<string, number> = { none: 0, car: 75, rv: 150 }
    const vehicleFee = vehicleCosts[v.asc2Vehicle] || 0
    const monthly = base * climateFactor + v.asc2Insurance + accessFee + vehicleFee
    const adminFee = 30
    const firstMonth = monthly + adminFee
    const total = firstMonth + monthly * (v.asc2Months - 1)
    const avgMonthly = total / v.asc2Months
    return { result: avgMonthly, label: 'Avg Monthly Cost', unit: '$', steps: [
      { label: 'Base Rate', value: `${v.asc2UnitSize} unit: $${base.toFixed(2)}/mo` },
      { label: 'Climate Control', value: `$${base.toFixed(2)} × ${climateFactor}× = $${(base * climateFactor).toFixed(2)}` },
      { label: 'Additional Fees', value: `Insurance $${v.asc2Insurance.toFixed(2)} + Access $${accessFee.toFixed(2)} + Vehicle $${vehicleFee.toFixed(2)} = $${(v.asc2Insurance + accessFee + vehicleFee).toFixed(2)}` },
      { label: 'Monthly Total', value: `$${(base * climateFactor).toFixed(2)} + $${(v.asc2Insurance + accessFee + vehicleFee).toFixed(2)} = $${monthly.toFixed(2)}` },
      { label: 'First Month + Admin', value: `$${monthly.toFixed(2)} + $${adminFee.toFixed(2)} admin = $${firstMonth.toFixed(2)}` },
      { label: 'Remaining Months', value: `${v.asc2Months - 1} mo × $${monthly.toFixed(2)} = $${(monthly * (v.asc2Months - 1)).toFixed(2)}` },
      { label: 'Total for Stay', value: `$${firstMonth.toFixed(2)} + $${(monthly * (v.asc2Months - 1)).toFixed(2)} = $${total.toFixed(2)}` },
      { label: 'Average per Month', value: `$${total.toFixed(2)} ÷ ${v.asc2Months} months = $${avgMonthly.toFixed(2)}` },
    ] ,
    extras: [
      { label: "Unit size guide", value: "5×5 = closet (boxes). 5×10 = small 1BR apt. 10×10 = 2BR apt. 10×15 = 3BR house. 10×20 = full house/vehicle. Pick the smallest size you can pack efficiently — you'll save 20–40%." },
      { label: "Climate control necessity", value: "Required for: electronics, wood furniture, documents, artwork, wine, musical instruments. Not needed for: metal tools, plastic bins, seasonal decor, tires. Climate control adds 20–25% to the base rate." },
      { label: "Vehicle storage prep", value: "Car storage ($75/mo): drain fluids, disconnect battery, inflate tires to max PSI. RV storage ($150/mo): winterize plumbing, cover tires, remove batteries. Enclosed vehicle storage costs more but protects from elements." },
      { label: "Insurance reality", value: "Your renter's/homeowner's insurance may cover stored items (usually 10% of contents value). Facility insurance covers the building, not your items. Buy their policy ($10–15/mo) or add a rider to your existing policy." },
      { label: "24/7 access vs standard hours", value: "Standard hours (6am–9pm) work for most people. 24/7 access ($15/mo extra) is worth it if you work odd hours or need frequent access. For long-term storage, standard hours save $180/year." },
      { label: "Packing efficiency", value: "Disassemble furniture, use uniform box sizes, stack to the ceiling. A well-packed 10×10 holds 2–3 rooms of furniture. Vertical storage (shelving units) can double your effective space." },
      { label: "First-month gotchas", value: "Admin fees ($15–35), lock purchase ($8–15), and deposit ($0–50) are added to the first month. Some facilities prorate if you move in mid-month. Always ask about move-in specials (50% off first month)." },
      { label: "Shopping around", value: "Prices vary 30–50% between facilities in the same area. Use SpareFoot or Storage.com to compare. Negotiate: mention competitor pricing, ask about long-term discounts, and request waived admin fees for 6+ month commitments." },
    ]}
  },
  description: 'Estimate self-storage costs with vehicle storage — compare unit sizes, climate control, 24/7 access, insurance, and car/RV/boat storage. Shows monthly, first-month, total, and average monthly cost.',
  formula: 'AvgMonthly = (Base × Climate + Insurance + Access + Vehicle + (Admin / Months)) | FirstMonth = Monthly + Admin | Total = FirstMonth + Monthly × (Months-1)',
  interpretation: 'A 10×10 unit for 3 months with 24/7 access: ~$135/mo average ($405 total). A 5×10 climate-controlled unit for 12 months: ~$105/mo ($1,262 total). RV storage for 6 months: ~$215/mo ($1,305 total). Always ask about first-month discounts.'
}

export default calcDef
