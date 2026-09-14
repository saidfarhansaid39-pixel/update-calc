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
  defaults: { totalItems: '200', keepPct: '30', donatePct: '40', tossPct: '30' },
  presets: [
    { label: 'Clothing Category', values: { totalItems: '150', keepPct: '25', donatePct: '50', tossPct: '25' } },
    { label: 'Book Collection', values: { totalItems: '80', keepPct: '20', donatePct: '60', tossPct: '20' } },
    { label: 'Kitchen Gadgets', values: { totalItems: '100', keepPct: '40', donatePct: '30', tossPct: '30' } },
    { label: 'Sentimental Items', values: { totalItems: '50', keepPct: '60', donatePct: '20', tossPct: '20' } },
  ],
  compute: (v) => {
    const keep = Math.round(v.totalItems * (v.keepPct / 100))
    const donate = Math.round(v.totalItems * (v.donatePct / 100))
    const toss = Math.round(v.totalItems * (v.tossPct / 100))
    const released = donate + toss
    const total = keep + donate + toss
    const donatedValue = donate * 5
    const freedSpacePct = (released / v.totalItems) * 100
    const taxDeduction = donatedValue
    return { result: keep, label: 'Items That Spark Joy', unit: '', steps: [{ label: 'Category Complete', value: `Total items processed: ${v.totalItems}` }, { label: 'Keep (Sparks Joy)', value: `${keep} items (${v.keepPct}%)` }, { label: 'Donate/Sell', value: `${donate} items (${v.donatePct}%) — est. value: $${donatedValue.toFixed(0)}` }, { label: 'Toss/Recycle', value: `${toss} items (${v.tossPct}%)` }, { label: 'Space Freed', value: `${freedSpacePct.toFixed(0)}% of items released` }, { label: 'Tax Deduction Est.', value: `~$${taxDeduction.toFixed(0)} (donated goods at $5/item avg)` }, { label: 'Ratio Check', value: `${keep} joy items vs ${released} released (1:${(released / Math.max(keep, 1)).toFixed(1)} ratio)` }] ,
    extras: [
      { label: "KonMari Order", value: "Clothing → Books → Papers → Komono (miscellaneous) → Sentimental. This order builds your 'spark joy' intuition progressively, starting with the easiest category." },
      { label: "The Joy Check", value: "Hold each item in both hands. Close your eyes. Does your body physically respond with warmth or lightness? If no feeling or a negative feeling, release it." },
      { label: "Thanking Ritual", value: "Verbally thank each item before releasing it: 'Thank you for serving me.' This provides emotional closure and prevents regret-induced repurchasing." },
      { label: "Typical Discard Rate", value: "First-time KonMari: 60-70% discard rate. Clothing: most people discard 70-80%. Books: 80-90%. Papers: 90%+. Sentimental: 40-50% (hardest category)." },
      { label: "Donation Tax Rules", value: "Itemized deductions require a receipt from the charity. Use IRS Form 8283 for items >$500. Goodwill/Salvation Army provide blank forms. Value at thrift store prices, not original retail." },
      { label: "Selling Strategy", value: "Sell high-value items (designer clothes, electronics, collectibles) on Poshmark/eBay/Facebook Marketplace before donating the rest. Expect 20-40% of original retail." },
      { label: "Storage Prevention", value: "Don't buy organizing bins until AFTER decluttering. KonMari emphasizes that storage solutions just hide clutter. The goal is to reduce to what fits comfortably in existing storage." },
      { label: "Visual Progress", value: "Take before/after photos of each category. The visual contrast reinforces the emotional reward and makes it easier to repeat the process for maintenance decluttering." },
    ]}
  },
  description: 'Apply the KonMari Method to any category of belongings with precise counts and percentages. See exactly how many items spark joy, how many you can release, and the estimated tax deduction value of your donations.',
  formula: 'Keep (Sparks Joy) = Total × Keep% | Released = Total × (Donate% + Toss%) | Est. Deduction = Donated Items × $5',
  interpretation: 'The KonMari Method by Marie Kondo prescribes decluttering by category (not location) in a specific order: clothing first to train your "spark joy" intuition, then books, papers, komono, and finally sentimental items. First-timers typically discard 60-70% of their belongings—clothing often sees 70-80% discard rates. The key insight is that organization solutions hide clutter; the goal is to reduce your possessions until every item that remains genuinely sparks joy, and every item has a designated home. This calculator helps you track the data behind the emotional journey.'
}

export default calcDef
