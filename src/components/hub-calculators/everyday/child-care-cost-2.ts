import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ children: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), costPerChild: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), daysPerWeek: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), registrationFees: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), careType: z.string().min(1), siblingDiscountPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'children', label: 'Number of Children', type: 'number', min: 1, step: '1' },
    { name: 'costPerChild', label: 'Cost per Child per Day ($)', type: 'number', min: 10, step: '10' },
    { name: 'daysPerWeek', label: 'Days per Week', type: 'number', min: 1, max: 5, step: '1' },
    { name: 'registrationFees', label: 'Annual Registration/Fees ($)', type: 'number', min: 0, step: '50' },
    { name: 'careType', label: 'Care Type', type: 'select', options: [{ label: 'Daycare Center', value: 'center' }, { label: 'Home Daycare', value: 'home' }, { label: 'Nanny', value: 'nanny' }, { label: 'Preschool', value: 'preschool' }] },
    { name: 'siblingDiscountPct', label: 'Sibling Discount (%)', type: 'number', min: 0, max: 30, step: '5' },
  ],
  defaults: { children: '2', costPerChild: '60', daysPerWeek: '5', registrationFees: '300', careType: 'center', siblingDiscountPct: '10' },
  presets: [
    { label: 'Infant + Toddler Full-Time', values: { children: '2', costPerChild: '75', daysPerWeek: '5', registrationFees: '500', careType: 'center', siblingDiscountPct: '10' } },
    { label: 'Single Child 3 Days/Week', values: { children: '1', costPerChild: '55', daysPerWeek: '3', registrationFees: '200', careType: 'home', siblingDiscountPct: '0' } },
    { label: 'Nanny Share', values: { children: '2', costPerChild: '90', daysPerWeek: '4', registrationFees: '0', careType: 'nanny', siblingDiscountPct: '0' } },
    { label: 'Preschool Part-Time', values: { children: '1', costPerChild: '45', daysPerWeek: '3', registrationFees: '350', careType: 'preschool', siblingDiscountPct: '0' } },
  ],
  compute: (v) => {
    const firstChildDaily = v.children >= 1 ? v.costPerChild : 0
    const siblingDaily = v.children > 1 ? (v.costPerChild * (1 - v.siblingDiscountPct / 100)) * (v.children - 1) : 0
    const totalDaily = firstChildDaily + siblingDaily
    const weeklyCost = totalDaily * v.daysPerWeek
    const monthlyCost = weeklyCost * 4.33
    const annualCost = monthlyCost * 12 + v.registrationFees
    const pctOfIncome = annualCost / 50000 * 100
    const dailyRateNoDiscount = v.children * v.costPerChild * v.daysPerWeek
    const savingFromDiscount = dailyRateNoDiscount - weeklyCost
    return { result: monthlyCost, label: 'Monthly Childcare Cost', unit: '$', steps: [
      { label: 'Daily Rate per Child', value: `$${v.costPerChild.toFixed(0)}/day/child` },
      { label: 'Sibling Discount Applied', value: v.siblingDiscountPct > 0 && v.children > 1 ? `${v.siblingDiscountPct}% off for child 2+ = $${(v.costPerChild * v.siblingDiscountPct / 100).toFixed(2)}/day savings` : 'None' },
      { label: 'Total Daily Cost', value: `$${totalDaily.toFixed(2)} ($${firstChildDaily.toFixed(2)} + $${siblingDaily.toFixed(2)} for siblings)` },
      { label: 'Weekly Cost', value: `$${totalDaily.toFixed(2)} × ${v.daysPerWeek} days = $${weeklyCost.toFixed(2)}` },
      { label: 'Monthly Cost (avg)', value: `$${weeklyCost.toFixed(2)} × 4.33 = $${monthlyCost.toFixed(2)}` },
      { label: 'Annual Registration/Fees', value: `+$${v.registrationFees.toFixed(0)}/yr` },
      { label: 'Annual Total', value: `$${annualCost.toFixed(2)}` },
      { label: '% of $50k Income', value: `${pctOfIncome.toFixed(1)}% of gross income — typical guideline: 7-20%` },
    ] ,
    extras: [
      { label: 'Sibling Discount Impact', value: v.siblingDiscountPct > 0 && v.children > 1 ? `Your ${v.siblingDiscountPct}% sibling discount saves $${savingFromDiscount.toFixed(2)}/week = $${(savingFromDiscount * 4.33).toFixed(2)}/mo. Without it, you'd pay $${(dailyRateNoDiscount * 4.33 + v.registrationFees / 12).toFixed(2)}/mo.` : 'Many centers offer 10-15% sibling discounts — always ask. Even 5% on a second child saves $600-1,200/year.' },
      { label: `${v.careType === 'center' ? 'Daycare Center' : v.careType === 'home' ? 'Home Daycare' : v.careType === 'nanny' ? 'Nanny' : 'Preschool'} Cost Benchmark`, value: v.careType === 'center' ? `Center-based care averages $200-400/week nationally. Your $${(weeklyCost / v.children / v.daysPerWeek).toFixed(0)}/day/child is ${(weeklyCost / v.children > 300 ? 'above' : 'within')} the typical range.` : v.careType === 'home' ? 'Home daycares are typically 25-35% cheaper than centers but may have fewer structured activities. Your rate is within typical range.' : v.careType === 'nanny' ? 'Nanny share (splitting with another family) cuts cost by 30-40%. A full-time nanny averages $600-900/week; a share splits to $300-500/family.' : 'Preschool is typically 15-25% cheaper than infant daycare. Many states offer free Pre-K for 4-year-olds — check your local school district.' },
      { label: 'Tax Credits & FSAs', value: `The Child and Dependent Care Tax Credit offsets up to $3,000 (1 child) or $6,000 (2+). A Dependent Care FSA lets you set aside $5,000 pre-tax — saving $1,250-1,750/year in taxes depending on bracket. At your $${annualCost.toFixed(0)}/yr cost, an FSA alone saves $${(5000 * 0.25).toFixed(0)}.` },
      { label: 'State Assistance Programs', value: '30+ states offer childcare subsidies for families earning under 200-300% of federal poverty level. Head Start/Early Head Start provides free or sliding-scale care for eligible families. Check childcareaware.org for your state\'s programs.' },
      { label: 'Infant vs Toddler Cost Gap', value: 'Infant care (0-18 months) costs 20-35% more than care for toddlers/preschoolers due to lower staff-to-child ratios (1:3 vs 1:6-8). If you have one child in each age bracket, your blended rate is ~15% above the toddler-only rate.' },
      { label: 'Hidden Costs Beyond Tuition', value: 'Backup care, late pickup fees ($1-5/min), supplies ($50-200/yr), field trips ($100-300/yr), and teacher gifts ($50-200/yr) add 5-15% to your annual childcare bill. Budget an extra $50-100/month beyond tuition above.' },
      { label: 'Breakeven Working Parent Analysis', value: `At $${annualCost.toFixed(0)}/yr in childcare, your breakeven after-tax income is $${(annualCost / 0.78).toFixed(0)}/yr (assuming 22% tax bracket). If one parent earns less than that, a part-time or stay-at-home arrangement may be financially equivalent after accounting for commute, work clothes, and meals.` },
      { label: 'Quality Ratio & Preparation', value: 'The average childcare center spends 60-70% of tuition on staff salaries. Centers paying teachers $15-18/hr have 30-50% lower turnover than those paying minimum wage. Lower turnover means more consistent care and better developmental outcomes for your child.' },
    ]}
  },
  description: 'Calculate full-time and part-time childcare costs including sibling discounts, care type comparisons (daycare center, home daycare, nanny, preschool), registration fees, and tax credit eligibility. Understand the true financial impact of childcare on your household budget.',
  formula: 'Monthly Cost = [(Child 1 daily rate + Sibling daily rate × (Children − 1) × (1 − Discount)) × Days per week × 4.33] + (Annual fees ÷ 12). Annual = Monthly × 12 + Registration fees.',
  interpretation: 'Average US childcare costs $200-400/week per child — often the second-largest household expense after housing. Infant care averages $1,200-1,800/month; preschool $800-1,200/month. The Child and Dependent Care Tax Credit offsets up to $3,000 for one child or $6,000 for two or more. Dependent Care FSAs allow $5,000 pre-tax annually. Many states offer sliding-scale subsidies for families earning under 300% of the federal poverty level.'
}

export default calcDef
