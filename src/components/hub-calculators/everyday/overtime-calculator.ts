import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ hourlyRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), regularHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), overtimeHours: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), otMultiplier: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1') }),
  fields: [
    { name: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', min: 0, step: '5' },
    { name: 'regularHours', label: 'Regular Hours', type: 'number', min: 0, step: '8' },
    { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', min: 0, step: '2' },
    { name: 'otMultiplier', label: 'Overtime Multiplier (e.g., 1.5)', type: 'number', min: 1, step: '0.5' },
  ],
  defaults: { hourlyRate: '25', regularHours: '40', overtimeHours: '5', otMultiplier: '1.5' },
  presets: [
    { label: 'Standard 40+5 OT', values: { hourlyRate: '25', regularHours: '40', overtimeHours: '5', otMultiplier: '1.5' } },
    { label: 'Double Time Weekend', values: { hourlyRate: '30', regularHours: '40', overtimeHours: '8', otMultiplier: '2' } },
    { label: 'Part-Time + OT', values: { hourlyRate: '18', regularHours: '30', overtimeHours: '10', otMultiplier: '1.5' } },
    { label: 'California Daily OT', values: { hourlyRate: '22', regularHours: '40', overtimeHours: '8', otMultiplier: '1.5' } },
  ],
  compute: (v) => { const regularPay = v.hourlyRate * v.regularHours; const otRate = v.hourlyRate * v.otMultiplier; const otPay = otRate * v.overtimeHours; const totalPay = regularPay + otPay; const totalHours = v.regularHours + v.overtimeHours; const effectiveRate = totalPay / totalHours; const weeklyGross = totalPay; const annualGross = weeklyGross * 52; const annualRegularOnly = v.hourlyRate * v.regularHours * 52; const otPremium = totalPay - (v.hourlyRate * totalHours); return { result: totalPay, label: 'Weekly Total Pay', unit: '$', steps: [
    { label: 'Regular Pay', value: `${v.regularHours} hrs × $${v.hourlyRate.toFixed(2)} = $${regularPay.toFixed(2)}` },
    { label: 'OT Hourly Rate', value: `$${v.hourlyRate.toFixed(2)} × ${v.otMultiplier.toFixed(1)} = $${otRate.toFixed(2)}/hr` },
    { label: 'Overtime Pay', value: `${v.overtimeHours} hrs × $${otRate.toFixed(2)} = $${otPay.toFixed(2)}` },
    { label: 'Weekly Gross Total', value: `$${regularPay.toFixed(2)} + $${otPay.toFixed(2)} = $${weeklyGross.toFixed(2)}` },
    { label: 'OT Premium Amount', value: `$${otPremium.toFixed(2)} above base rate` },
    { label: 'Effective Hourly Rate', value: `$${weeklyGross.toFixed(2)} / ${totalHours} hrs = $${effectiveRate.toFixed(2)}` },
    { label: 'Annual Gross Income', value: `$${weeklyGross.toFixed(2)} × 52 = $${annualGross.toFixed(2)}` },
    { label: 'Annual Without OT', value: `$${annualRegularOnly.toFixed(2)} (reg hours only)` },
  ] ,
    extras: [
      { label: 'FLSA Overtime Rule', value: 'US federal law requires 1.5× pay for hours over 40/week. Some states (CA, NY) have daily OT after 8 hours.' },
      { label: 'OT Tax Bracket', value: 'Overtime is taxed at your marginal rate — you keep less per hour than regular time due to bracket creep.' },
      { label: 'Exempt vs Non-Exempt', value: 'Salaried employees earning over $35,568/yr (2024 threshold) may be exempt from overtime protection.' },
      { label: 'Double Time Rules', value: 'California requires 2× pay for hours over 12/day or 7th consecutive day over 8 hours.' },
      { label: 'Negotiating OT', value: 'Some employers offer comp time instead of OT pay — ensure it\'s at the same 1.5× accrual rate.' },
      { label: 'Annual OT Estimate', value: `Adding ${v.overtimeHours} hrs OT/week at $${otRate.toFixed(2)}/hr = ${(otPay * 52).toFixed(0)} extra/year` },
    ]} },
  description: 'Calculate overtime pay based on hourly rate, regular hours, overtime hours, and overtime multiplier (standard: 1.5× for US FLSA). See the full breakdown including annual projections and the overtime premium above your base rate.',
  formula: 'Total = (HourlyRate × RegularHrs) + (HourlyRate × OvertimeMultiplier × OvertimeHrs) | EffectiveRate = Total / (RegularHrs + OvertimeHrs)',
  interpretation: 'US FLSA requires 1.5× pay for hours over 40/week. Some states have daily overtime rules (CA: 8 hrs, NY: varies). A $25/hr worker doing 5 hrs OT/week at 1.5× earns $5,850 extra annually. The effective rate helps compare jobs with different OT expectations. Note: overtime is taxed at your highest marginal bracket — factor that into take-home estimates.'
}

export default calcDef
