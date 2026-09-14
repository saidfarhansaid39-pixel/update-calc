import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ totalItems: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), keepPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), donatePct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), tossPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'totalItems', label: 'Total Items Counted', type: 'number', min: 1, step: '10' },
    { name: 'keepPct', label: 'Keep (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'donatePct', label: 'Donate/Sell (%)', type: 'number', min: 0, max: 100, step: '5' },
    { name: 'tossPct', label: 'Toss/Recycle (%)', type: 'number', min: 0, max: 100, step: '5' },
  ],
  defaults: { totalItems: '300', keepPct: '40', donatePct: '35', tossPct: '25' },
  presets: [
    { label: 'Home Office Cleanout', values: { totalItems: '200', keepPct: '30', donatePct: '30', tossPct: '40' } },
    { label: 'Kids Toy Sort', values: { totalItems: '150', keepPct: '25', donatePct: '50', tossPct: '25' } },
    { label: 'Garage Cleanup', values: { totalItems: '400', keepPct: '35', donatePct: '20', tossPct: '45' } },
    { label: 'Closet Refresh', values: { totalItems: '120', keepPct: '45', donatePct: '40', tossPct: '15' } },
  ],
  compute: (v) => {
    const keep = Math.round(v.totalItems * (v.keepPct / 100))
    const donate = Math.round(v.totalItems * (v.donatePct / 100))
    const toss = Math.round(v.totalItems * (v.tossPct / 100))
    const total = keep + donate + toss
    const removed = v.totalItems - keep
    const freedPct = (removed / v.totalItems) * 100
    const donationValue = donate * 3.5
    const recycleSavedLbs = toss * 0.5
    return { result: removed, label: 'Items to Remove', unit: '', steps: [{ label: 'Total Inventory', value: `${v.totalItems} items` }, { label: 'Keep', value: `${keep} items (${v.keepPct}%)` }, { label: 'Donate/Sell', value: `${donate} items — est. value: $${donationValue.toFixed(0)}` }, { label: 'Toss/Recycle', value: `${toss} items (~${recycleSavedLbs.toFixed(0)} lbs kept out of landfill)` }, { label: 'Items Released', value: `${removed} items (${freedPct.toFixed(0)}% of total)` }, { label: 'Remaining Inventory', value: `${keep} items in your space` }, { label: 'Keep vs Release Ratio', value: `1 : ${(removed / Math.max(keep, 1)).toFixed(1)} (for every 1 kept, ${(removed / Math.max(keep, 1)).toFixed(1)} released)` }] ,
    extras: [
      { label: "The 80/20 Rule", value: "We use 20% of our belongings 80% of the time. The remaining 80% sits idle. If you haven't used something in 12 months, release it—you likely won't miss it." },
      { label: "One-Year Rule", value: "For non-sentimental items: if you have not used/worn it in the past year, you will not use it in the next year. Exceptions: seasonal gear, formal wear, emergency supplies." },
      { label: "Digital Declutter", value: "Digital clutter (emails, files, photos) causes the same cognitive load as physical clutter. Apply the same percentages to cloud storage, subscriptions, and notifications." },
      { label: "Donation Impact", value: "Clothing donated to thrift stores is typically sold at 25-35% of retail. Non-profits like Dress for Success and homeless shelters accept specific categories directly." },
      { label: "Recycling Resources", value: "Electronics: Best Buy/Staples accept for free. Batteries: Home Depot/Lowe's. Textiles: H&M/Levi's take-back programs. Hazardous waste: local municipal collection events." },
      { label: "Selling Thresholds", value: "Only sell items worth >$20 to make listing effort worthwhile. Bundle similar items (lot of baby clothes). Use Facebook Marketplace for bulk furniture sales—no shipping." },
      { label: "Prevention Systems", value: "Adopt a one-in-one-out rule: for every new item purchased, one old item must leave. This maintains the post-declutter equilibrium indefinitely." },
      { label: "Environmental Math", value: "Every item donated rather than landfilled saves ~2 lbs of CO2 equivalent in production and disposal. A 300-item declutter where 50% is donated instead of trashed saves ~300 lbs CO2." },
    ]}
  },
  description: 'Plan any decluttering project with data: categorize items into keep, donate, and toss percentages. See exactly how much space you free up, the environmental impact of diverting items from landfill, and the estimated tax-deductible value of donations.',
  formula: 'Removed = Total − Keep | Space Freed % = Removed ÷ Total × 100 | Est. Donation Value = Donated × $3.50',
  interpretation: 'The 80/20 rule applies to most households: 20% of belongings see 80% of use. A 50-60% keep rate is typical for a first decluttering pass across all categories. For every 100 items evaluated, expect to keep 30-50 and release 50-70. Donated household goods average $3-5 per item in estimated value for tax deductions. The environmental benefit is significant: each item donated rather than landfilled avoids roughly 2 lbs of CO2 equivalent in production and disposal costs.'
}

export default calcDef
