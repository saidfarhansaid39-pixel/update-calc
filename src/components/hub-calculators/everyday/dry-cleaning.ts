import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ shirtsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), suitsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dressesPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), pantsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), coatsPerWeek: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), weeksPerYear: z.string().min(1).refine(v => parseFloat(v) > 0, '>0') }),
  fields: [
    { name: 'shirtsPerWeek', label: 'Shirts/Week', type: 'number', min: 0, step: '1' },
    { name: 'suitsPerWeek', label: 'Suits/Week', type: 'number', min: 0, step: '1' },
    { name: 'dressesPerWeek', label: 'Dresses/Week', type: 'number', min: 0, step: '1' },
    { name: 'pantsPerWeek', label: 'Pants/Week', type: 'number', min: 0, step: '1' },
    { name: 'coatsPerWeek', label: 'Coats/Week', type: 'number', min: 0, step: '1' },
    { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', min: 1, max: 52, step: '1' },
  ],
  defaults: { shirtsPerWeek: '3', suitsPerWeek: '1', dressesPerWeek: '0', pantsPerWeek: '1', coatsPerWeek: '0', weeksPerYear: '48' },
  presets: [
    { label: 'Office Professional (Daily Shirts)', values: { shirtsPerWeek: '5', suitsPerWeek: '2', dressesPerWeek: '0', pantsPerWeek: '2', coatsPerWeek: '0', weeksPerYear: '50' } },
    { label: 'Minimalist Wardrobe', values: { shirtsPerWeek: '1', suitsPerWeek: '0', dressesPerWeek: '0', pantsPerWeek: '1', coatsPerWeek: '0', weeksPerYear: '40' } },
    { label: 'Seasonal Heavy User', values: { shirtsPerWeek: '2', suitsPerWeek: '1', dressesPerWeek: '2', pantsPerWeek: '1', coatsPerWeek: '1', weeksPerYear: '26' } },
    { label: 'Formal Event Season', values: { shirtsPerWeek: '2', suitsPerWeek: '3', dressesPerWeek: '2', pantsPerWeek: '1', coatsPerWeek: '1', weeksPerYear: '12' } },
  ],
  compute: (v) => {
    const shirtCost = 2.5; const suitCost = 12; const dressCost = 8; const pantsCost = 6; const coatCost = 15
    const weekly = v.shirtsPerWeek * shirtCost + v.suitsPerWeek * suitCost + v.dressesPerWeek * dressCost + v.pantsPerWeek * pantsCost + v.coatsPerWeek * coatCost
    const monthly = weekly * 4.33
    const annual = weekly * v.weeksPerYear
    const shirtAnnual = v.shirtsPerWeek * shirtCost * v.weeksPerYear
    const itemsPerWeek = v.shirtsPerWeek + v.suitsPerWeek + v.dressesPerWeek + v.pantsPerWeek + v.coatsPerWeek
    const costPerItem = itemsPerWeek > 0 ? weekly / itemsPerWeek : 0
    const tenYearCost = annual * 10
    const dryCleanOnlyPct = weekly > 0 ? (v.shirtsPerWeek * shirtCost + v.suitsPerWeek * suitCost) / weekly * 100 : 0
    return { result: monthly, label: 'Monthly Dry Cleaning Cost', unit: '$', steps: [
      { label: 'Items per Week', value: `${itemsPerWeek} items` },
      { label: 'Shirts', value: `${v.shirtsPerWeek} × $2.50 = $${(v.shirtsPerWeek * shirtCost).toFixed(2)}` },
      { label: 'Suits & Blazers', value: `${v.suitsPerWeek} × $12.00 = $${(v.suitsPerWeek * suitCost).toFixed(2)}` },
      { label: 'Dresses', value: `${v.dressesPerWeek} × $8.00 = $${(v.dressesPerWeek * dressCost).toFixed(2)}` },
      { label: 'Pants & Trousers', value: `${v.pantsPerWeek} × $6.00 = $${(v.pantsPerWeek * pantsCost).toFixed(2)}` },
      { label: 'Coats & Jackets', value: `${v.coatsPerWeek} × $15.00 = $${(v.coatsPerWeek * coatCost).toFixed(2)}` },
      { label: 'Weekly Total', value: `$${weekly.toFixed(2)} ($${costPerItem.toFixed(2)}/item avg)` },
      { label: 'Monthly', value: `$${monthly.toFixed(2)}` },
      { label: 'Annual', value: `$${annual.toFixed(2)}` },
      { label: '10-Year Projection', value: `$${tenYearCost.toFixed(0)}` },
    ] ,
    extras: [
      { label: "Regional Price Variation", value: "NYC: shirts $3-5, suits $15-20. Midwest: shirts $1.50-2.50, suits $8-12. LA: shirts $2-4, suits $12-18. Prices are 40-80% higher in major metros. Small-town cleaners often charge 30-50% less than chains." },
      { label: "Home Dry Cleaning Kits", value: "Dryel and at-home kits cost $10-20 for 10-20 loads ($0.50-1/load) vs $2-15/load at the cleaner. Works well for light soil and odor removal (sweaters, blouses) but not for stains or structured garments (suits, coats)." },
      { label: "Stain Policy Warning", value: "Report all stains when dropping off — many cleaners disclaim responsibility for unmentioned stains. Common stains (wine, oil, ink) require immediate spot treatment. Dry cleaning does NOT remove all stains; set-in stains (especially protein-based like blood or sweat) may be permanent." },
      { label: "Garment Life Extension", value: "Professional cleaning extends garment life 2-3× vs home washing. Suits last 50-100 wears between cleanings. Over-cleaning (after every wear) degrades fabric fibers 30% faster. Clean suits every 6-8 wears, shirts every 1-2 wears." },
      { label: "Eco-Friendly Alternatives", value: "Wet cleaning (professional water-based) and liquid CO2 cleaning are 90%+ less toxic than perc (tetrachloroethylene), used by 80% of US dry cleaners. Only 5-10% of cleaners offer these alternatives. Look for 'Green Earth' or 'eco-friendly' certification." },
      { label: "Subscription & Bulk Discounts", value: "Many chains offer bulk discounts: 5% off for weekly service, 10-20% off for prepaid packages ($100-500). Drop zones (no delivery) save $3-8/order. Corporate accounts save 15-25% with weekly pickup/drop-off." },
      { label: "Wardrobe Rotation Strategy", value: "Seasonal items (coats, formal wear) need cleaning once per season — before storage, NOT before wearing. Storing clean prevents moth damage. Off-season storage: use breathable garment bags (not dry cleaning plastic) and cedar blocks." },
      { label: "Tax Deductibility", value: "Dry cleaning for work uniforms is tax-deductible if the employer requires specific clothing not suitable for everyday wear. Business suits for general office work are NOT deductible (IRS 'ordinary clothing' rule). Stage costumes and medical scrubs ARE deductible." },
    ]}
  },
  description: 'Model your dry cleaning expenses across shirts, suits, dresses, pants, and coats. Break down weekly, monthly, annual, and 10-year costs with per-item averages and category-specific pricing.',
  formula: 'Weekly = (Shirts × $2.50) + (Suits × $12) + (Dresses × $8) + (Pants × $6) + (Coats × $15) | Monthly = Weekly × 4.33 | Annual = Weekly × Weeks/Year',
  interpretation: 'The average professional spends $600-1,500/year on dry cleaning — or 0.5-1.5% of a $100,000 salary. Shirts ($2-3 each) are usually the highest volume item. Suits ($10-15) are the highest per-piece cost. Strategic choices like rotating garments (don\'t clean suits after every wear), using home kits for lighter items, and switching to eco-friendly wet cleaning can cut your annual dry cleaning bill by 40-60% without sacrificing wardrobe quality.'
}

export default calcDef
