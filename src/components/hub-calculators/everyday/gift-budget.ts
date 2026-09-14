import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ recipients: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), perPersonBudget: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), occasions: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'recipients', label: 'Number of Recipients', type: 'number', min: 1, step: '1' },
    { name: 'perPersonBudget', label: 'Budget per Person ($)', type: 'number', min: 1, step: '5' },
    { name: 'occasions', label: 'Occasions per Year', type: 'number', min: 1, step: '1' },
  ],
  defaults: { recipients: '10', perPersonBudget: '25', occasions: '3' },
  presets: [
    { label: 'Immediate Family Christmas', values: { recipients: '6', perPersonBudget: '50', occasions: '1' } },
    { label: 'Coworkers + Friends', values: { recipients: '15', perPersonBudget: '15', occasions: '2' } },
    { label: 'Kids Birthday Party Circuit', values: { recipients: '8', perPersonBudget: '25', occasions: '6' } },
    { label: 'Minimalist Gifting', values: { recipients: '5', perPersonBudget: '20', occasions: '2' } },
  ],
  compute: (v) => {
    const perOccasion = v.recipients * v.perPersonBudget
    const annual = perOccasion * v.occasions
    const monthly = annual / 12
    const perRecipientAnnual = v.perPersonBudget * v.occasions
    const averagePctIncome = annual / 50000 * 100
    return { result: annual, label: 'Annual Gift Budget', unit: '$', steps: [{ label: 'Recipients', value: `${v.recipients} people` }, { label: 'Budget per Person per Occasion', value: `$${v.perPersonBudget.toFixed(2)}` }, { label: 'Occasions per Year', value: `${v.occasions}` }, { label: 'Cost per Occasion', value: `$${perOccasion.toFixed(2)}` }, { label: 'Annual Total', value: `$${annual.toFixed(2)}` }, { label: 'Monthly Savings Target', value: `$${monthly.toFixed(2)}/mo` }, { label: 'Per Recipient per Year', value: `$${perRecipientAnnual.toFixed(2)}` }, { label: '% of $50k Income', value: `${averagePctIncome.toFixed(1)}%` }] ,
    extras: [
      { label: 'Relationship-Based Budgeting Guide', value: `Immediate family: $50-150/occasion. Extended family: $20-50. Close friends: $25-50. Coworkers: $10-25. Kids' friends: $15-25. Your $${v.perPersonBudget.toFixed(0)}/person avg is ${v.perPersonBudget >= 50 ? 'generous (family-level)' : v.perPersonBudget >= 25 ? 'moderate (friend-level)' : 'budget-friendly (coworker/kid level)'}. Adjust categories to keep total comfortable.` },
      { label: 'Savings Strategy by Pay Period', value: `Set aside $${monthly.toFixed(2)}/mo into a "gift fund" account. Biweekly: $${(annual / 26).toFixed(2)}/paycheck. Weekly: $${(annual / 52).toFixed(2)}. Automate this transfer and you'll never feel the pinch. A high-yield savings account at 4.5% APY would earn ~$${(annual * 0.045).toFixed(2)} in interest if you save a year ahead.` },
      { label: 'Occasion Calendar Planning', value: `${v.occasions} occasions/yr. Typical breakdown: Christmas/Hanukkah (Dec), Valentine's (Feb), Mother's Day (May), Father's Day (Jun), birthdays (year-round), anniversaries. Space your $${perOccasion.toFixed(0)}/occasion across the year. Birthdays cost $20-50 avg; holidays $50-150 avg. Use a calendar + set price alerts for planned gifts.` },
      { label: 'Homemade & Experience Gift Savings', value: `Replacing 30% of purchased gifts with homemade/experience gifts saves $${(annual * 0.30).toFixed(0)}/yr. Ideas: baked goods ($5 cost vs $25 purchased), framed photos ($8 vs $30), homemade candles ($6 vs $20), experience gift (concert tickets $50 vs stuff $50 but more memorable). Homemade gifts save 50-80% vs retail.` },
      { label: 'Gift Pooling for Families', value: `Instead of exchanging individual gifts within a family of ${v.recipients}, do a $${v.perPersonBudget.toFixed(0)} Secret Santa or White Elephant: cost = $${v.perPersonBudget.toFixed(0)} × 1 gift vs $${perOccasion.toFixed(0)} × ${v.recipients} gifts (saves $${(perOccasion * v.recipients - v.perPersonBudget).toFixed(0)}/occasion). Family gift pool for parents: $${(v.perPersonBudget * v.recipients).toFixed(0)} combined buys a nicer gift.` },
      { label: 'Tax & Deduction Considerations', value: `Gifts you give are NOT tax deductible (personal gifts are not charitable). However, gifts to employees (up to $25/yr): deductible as business expense. Gifts to clients: limited to $25/yr per person. Charitable gifts in someone's name: deductible as charitable donation if to qualified org.` },
      { label: 'Inflation & Budget Adjustments', value: `Gift prices rose ~5-8% in the last 2 years. At 3% annual inflation, your $${v.perPersonBudget.toFixed(0)} budget today buys $${(v.perPersonBudget / 1.03).toFixed(0)} worth of gift next year. Over 5 years: value erodes to $${(v.perPersonBudget / Math.pow(1.03, 5)).toFixed(0)}. Revisit your per-person budget each December to adjust for inflation.` },
      { label: 'Gift Return & Waste Reduction', value: `~$16 billion in unwanted gifts are returned each year in the US. To avoid waste: give wish-list items (use Amazon Wish List or similar), gift cards to favorite stores, or experiences (concert/event tickets). Cash or gift cards are preferred by 60% of recipients per surveys but perceived as less personal — balance with a handwritten note.` },
    ]}
  },
  description: 'Plan your annual gift budget with relationship-based per-person limits and occasion frequency. Includes savings strategies, monthly targets, homemade gift savings, occasion calendar tips, inflation adjustments, and Secret Santa pooling options to keep gifting joyful and debt-free.',
  formula: 'Annual = Recipients × Budget/Person × Occasions/Year | Monthly = Annual ÷ 12 | Per Person Annual = Budget/Person × Occasions | % of Income = (Annual ÷ Income) × 100',
  interpretation: 'Average US household spends $500-1,200/yr on gifts. Budget $50-150 for family, $20-50 for friends, $10-25 for coworkers. Setting aside $25-100/month into a gift fund eliminates holiday debt. Homemade gifts save 50-80% over retail. Secret Santa cuts group gift costs by 50-90%. Adjust per-person budgets up 3% annually for inflation.'
}

export default calcDef
