import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyWage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), hoursPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), weeksPerYear: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'hourlyWage', label: 'Hourly Wage ($)', type: 'number', min: 7.25, step: '1' },
    { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', min: 1, step: '5' },
    { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', min: 1, step: '4' },
  ],
  defaults: { hourlyWage: "25", hoursPerWeek: "40", weeksPerYear: "52" },
  presets: [
    { label: "Federal Minimum Wage", values: { hourlyWage: "7.25", hoursPerWeek: "40", weeksPerYear: "52" } },
    { label: "Part-Time Student", values: { hourlyWage: "18", hoursPerWeek: "20", weeksPerYear: "40" } },
    { label: "Salaried Professional (Equivalent)", values: { hourlyWage: "45", hoursPerWeek: "45", weeksPerYear: "50" } },
    { label: "Seasonal/Tourism Worker", values: { hourlyWage: "22", hoursPerWeek: "50", weeksPerYear: "36" } },
  ],
  compute: (v) => { const annual = v.hourlyWage * v.hoursPerWeek * v.weeksPerYear; const monthly = annual / 12; const biweekly = annual / 26; const weekly = annual / 52; const daily = annual / 260; const annualPretaxMonth = monthly; const fedEstimate = annual * 0.12; const ficaEstimate = annual * 0.0765; const afterTaxAnnual = annual - fedEstimate - ficaEstimate; const afterTaxMonthly = afterTaxAnnual / 12; const hourlyBackCalc = v.weeksPerYear > 0 && v.hoursPerWeek > 0 ? annual / (v.weeksPerYear * v.hoursPerWeek) : 0; return { result: annual, label: 'Annual Salary', unit: '$', steps: [{ label: 'Hourly Wage', value: `$${v.hourlyWage.toFixed(2)}/hr` }, { label: 'Schedule', value: `${v.hoursPerWeek} hrs/wk × ${v.weeksPerYear} wks/yr = ${v.hoursPerWeek * v.weeksPerYear} hrs/yr` }, { label: 'Annual (Gross)', value: `$${annual.toFixed(2)}` }, { label: 'Monthly (Gross)', value: `$${monthly.toFixed(2)}` }, { label: 'Biweekly (Gross)', value: `$${biweekly.toFixed(2)}` }, { label: 'Weekly (Gross)', value: `$${weekly.toFixed(2)}` }, { label: 'Daily (Gross)', value: `$${daily.toFixed(2)}` }, { label: 'After-Tax Estimate', value: `$${afterTaxMonthly.toFixed(2)}/mo (est. ${(fedEstimate + ficaEstimate).toFixed(0)}/yr tax)` }] ,
    extras: [
      { label: "US Tax Withholding Estimate", value: "Federal income: ~10-22% for most earners | FICA (Social Security + Medicare): 7.65% | State income: 0-13.3% depending on state | This is a rough estimate — your actual withholing depends on W-4, deductions, and credits." },
      { label: "Full-Time Equivalent", value: "Standard US full-time: 40 hrs × 52 wks = 2,080 hrs/yr. Budgeting for PTO: 50 wks × 40 hrs = 2,000 hrs/yr (2 wks unpaid vacation = 2,080 → 2,000)." },
      { label: "Overtime Premium", value: "FLSA requires 1.5× base rate for hours over 40/week. For a $25/hr worker: 40 hrs at $25 + 5 hrs at $37.50 = $1,187.50/wk vs $1,125 without overtime." },
      { label: "Benefits Value", value: "Employer benefits (health insurance, 401k match, PTO) add 25-40% to total compensation. A $25/hr job with benefits is worth $31-35/hr total." },
      { label: "Contractor vs Employee", value: "Self-employed pay both halves of FICA (15.3% vs 7.65%). Contractors typically need to charge 20-30% more than employees to cover taxes and benefits." },
      { label: "Minimum Wage by State", value: "Federal: $7.25 | CA: $16.00 | NY: $15.00 | WA: $16.28 | FL: $13.00 | TX: $7.25 (federal). Many cities have higher local minimums." },
      { label: "Salary Negotiation Benchmark", value: "Research market rates on Glassdoor, Levels.fyi, or BLS.gov. A 5-10% negotiation above initial offer is standard. Be prepared to justify with skills and experience." },
      { label: "Cost of Living Adjustment", value: "Same job in SF vs rural Alabama may pay 2-3× more. Use cost-of-living calculators to compare real purchasing power across locations." },
    ]} },
  description: 'Convert your hourly wage to annual salary and see pay periods from daily to yearly. Includes rough tax estimates and compares full-time, part-time, and seasonal schedules.',
  formula: 'Annual Gross = Hourly Wage × Hours per Week × Weeks per Year | Monthly = Annual ÷ 12 | Biweekly = Annual ÷ 26 | After-Tax ≈ Gross − (12% Fed + 7.65% FICA)',
  interpretation: 'The standard US full-time annual salary calculation uses 2,080 hours (40 hrs/week × 52 weeks). In practice, most workers take 2-4 weeks of unpaid time off or use paid vacation, so 2,000-2,080 is common. Remember that your W-2 income is just part of total compensation — health insurance (worth $5,000-15,000/yr), 401k match (3-6% of salary), and paid time off (2-4 weeks) typically add 25-40% to your effective hourly rate. When comparing job offers, calculate the total compensation package, not just the hourly wage or salary.'
}

export default calcDef
