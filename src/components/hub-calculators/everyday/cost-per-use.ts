import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ itemPrice: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), uses: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), yearsOwned: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), itemCategory: z.string().min(1), maintenanceCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), resaleValue: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'itemPrice', label: 'Item Price ($)', type: 'number', min: 1, step: '5' },
    { name: 'uses', label: 'Uses per Year', type: 'number', min: 1, step: '1' },
    { name: 'yearsOwned', label: 'Years Owned', type: 'number', min: 1, step: '1' },
    { name: 'itemCategory', label: 'Item Category', type: 'select', options: [{ label: 'Clothing/Accessories', value: 'clothing' }, { label: 'Electronics/Appliances', value: 'electronics' }, { label: 'Kitchen/Cookware', value: 'kitchen' }, { label: 'Tools/Equipment', value: 'tools' }, { label: 'Furniture/Home', value: 'furniture' }] },
    { name: 'maintenanceCost', label: 'Annual Maintenance ($)', type: 'number', min: 0, step: '10' },
    { name: 'resaleValue', label: 'Expected Resale Value ($)', type: 'number', min: 0, step: '25' },
  ],
  defaults: { itemPrice: '200', uses: '50', yearsOwned: '5', itemCategory: 'clothing', maintenanceCost: '10', resaleValue: '30' },
  presets: [
    { label: 'Winter Coat', values: { itemPrice: '250', uses: '90', yearsOwned: '5', itemCategory: 'clothing', maintenanceCost: '5', resaleValue: '40' } },
    { label: 'Laptop', values: { itemPrice: '1200', uses: '365', yearsOwned: '4', itemCategory: 'electronics', maintenanceCost: '0', resaleValue: '300' } },
    { label: 'Stainless Cookware Set', values: { itemPrice: '400', uses: '200', yearsOwned: '15', itemCategory: 'kitchen', maintenanceCost: '0', resaleValue: '100' } },
    { label: 'Designer Handbag', values: { itemPrice: '1500', uses: '100', yearsOwned: '10', itemCategory: 'clothing', maintenanceCost: '30', resaleValue: '600' } },
  ],
  compute: (v) => {
    const totalUses = v.uses * v.yearsOwned
    const totalMaintenance = v.maintenanceCost * v.yearsOwned
    const netCost = v.itemPrice + totalMaintenance - v.resaleValue
    const cpu = netCost / totalUses
    const cpuNoResale = (v.itemPrice + totalMaintenance) / totalUses
    const annualCost = netCost / v.yearsOwned
    const dailyEquivalent = cpu / (v.uses / 365)
    const rentEquivalent = annualCost / 12
    const pctOfValuePerUse = (cpu / v.itemPrice) * 100
    const costPerHour = cpu / 1
    const categoryLifecycles: Record<string, number> = { clothing: 4, electronics: 3, kitchen: 10, tools: 8, furniture: 7 }
    const avgLifecycle = categoryLifecycles[v.itemCategory] || 5
    const lifecycleRating = v.yearsOwned >= avgLifecycle ? 'above-average' : v.yearsOwned >= avgLifecycle * 0.7 ? 'average' : 'below-average'
    const fmt = (n: number) => n.toLocaleString()
    const lifecycleGuide = v.itemCategory === 'clothing'
      ? 'Clothing expected life: basics (3-5yr), outerwear (5-10yr), fast fashion (1-2yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. Best CPU buys: wool coats ($0.50-1.00/use), leather boots ($0.75-1.50/use), cashmere ($0.80-1.50/use). Worst: trendy fast-fashion items ($3-5/use). On a per-wear basis, quality costs less.'
      : v.itemCategory === 'electronics'
        ? 'Electronics expected life: laptop (4-6yr), phone (3-4yr), headphones (3-5yr), TV (7-10yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. Best CPU buys: quality headphones ($0.05-0.15/day), productivity laptops ($0.50-1.50/day), monitors ($0.20-0.50/day). Worst: printer (high ink per-use cost).'
        : v.itemCategory === 'kitchen'
          ? 'Kitware expected life: cast iron (lifetime \u2014 20+yr), stainless steel (15-20yr), non-stick (2-3yr), plastic utensils (1-3yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. A $50 cast iron pan used 300\u00d7/yr for 20yr = $0.01/use. A $30 non-stick pan used 200\u00d7/yr for 2yr = $0.08/use. Cast iron is 8\u00d7 cheaper per use.'
          : v.itemCategory === 'tools'
            ? 'Tools expected life: power tools (5-10yr), hand tools (15-20yr), garden tools (10-15yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. For occasional use (1-5\u00d7/yr), renting at $15-50/day is cheaper than buying. For regular use (10+\u00d7/yr), buying gives $0.50-3.00/use vs $15-50/rent \u2014 payback in 2-8 uses.'
            : 'Furniture expected life: sofas (7-15yr, avg 10yr), dining tables (15-25yr), mattresses (7-10yr), area rugs (5-15yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. Quality wood furniture: $0.20-0.50/day. Particleboard: $0.40-0.80/day. The $0.20 savings/day \u00d7 10yr = $730 saved by buying better.'
    return { result: cpu, label: 'Cost per Use', unit: '$', steps: [
      { label: 'Purchase Price', value: `$${v.itemPrice.toFixed(2)}` },
      { label: `Maintenance ($${v.maintenanceCost.toFixed(0)}/yr × ${v.yearsOwned}yr)`, value: `+$${totalMaintenance.toFixed(2)}` },
      { label: 'Minus Resale Value', value: `−$${v.resaleValue.toFixed(2)}` },
      { label: 'Net Lifetime Cost', value: `$${v.itemPrice.toFixed(2)} + $${totalMaintenance.toFixed(2)} − $${v.resaleValue.toFixed(2)} = $${netCost.toFixed(2)}` },
      { label: 'Total Uses', value: `${v.uses}/yr × ${v.yearsOwned}yr = ${totalUses.toLocaleString()} uses` },
      { label: 'Cost per Use (CPU)', value: `$${netCost.toFixed(2)} ÷ ${totalUses} = $${cpu.toFixed(2)}/use` },
      { label: 'Annual Equivalent Cost', value: `$${annualCost.toFixed(2)}/yr ($${rentEquivalent.toFixed(2)}/mo)` },
      { label: 'Daily Cost Equivalent', value: `$${dailyEquivalent.toFixed(2)}/day (at ${(v.uses / 365).toFixed(1)} uses/day)` },
    ] ,
    extras: [
      { label: 'CPU Decision Framework', value: cpu < 1 ? `At $${cpu.toFixed(2)}/use, this is a STAAPLE (buy). Items under $1/use are almost always worth keeping. Examples: $0.05/use for a cast iron pan, $0.15/use for a quality shirt.` : cpu < 5 ? `At $${cpu.toFixed(2)}/use, this is reasonable — similar to a fast-food meal. Worth buying if used regularly.` : cpu < 25 ? `At $${cpu.toFixed(2)}/use, this is an OCCASIONAL item — consider buying used or renting. Examples: $10/use for a power tool, $15/use for an evening dress.` : `At $${cpu.toFixed(2)}/use, this is a luxury/specialty item — only buy if it provides disproportionate value per use. Examples: wedding attire, specialized camera lens. Consider renting instead.` },
      { label: 'Resale Value as Investment', value: `At $${v.resaleValue.toFixed(2)} resale (${(v.resaleValue / v.itemPrice * 100).toFixed(0)}% of purchase), your effective cost drops from $${cpuNoResale.toFixed(2)} to $${cpu.toFixed(2)}/use. Categories with best resale: designer handbags (50-80%), luxury watches (60-90%), premium electronics (20-40%), cast iron cookware (50-70%). Worst resale: fast fashion (5-10%), IKEA furniture (10-20%), non-premium appliances (10-15%).` },
      { label: 'Category-Specific Lifecycle Guidance', value: `${v.itemCategory === 'clothing' ? 'Clothing expected life: basics (3-5yr), outerwear (5-10yr), fast fashion (1-2yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. Best CPU buys: wool coats ($0.50-1.00/use), leather boots ($0.75-1.50/use), cashmere ($0.80-1.50/use). Worst: trendy fast-fashion items ($3-5/use). On a per-wear basis, quality costs less.' : v.itemCategory === 'electronics' ? 'Electronics expected life: laptop (4-6yr), phone (3-4yr), headphones (3-5yr), TV (7-10yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. Best CPU buys: quality headphones ($0.05-0.15/day), productivity laptops ($0.50-1.50/day), monitors ($0.20-0.50/day). Worst: printer (high ink per-use cost).' : v.itemCategory === 'kitchen' ? 'Kitware expected life: cast iron (lifetime — 20+yr), stainless steel (15-20yr), non-stick (2-3yr), plastic utensils (1-3yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. A $50 cast iron pan used 300×/yr for 20yr = $0.01/use. A $30 non-stick pan used 200×/yr for 2yr = $0.08/use. Cast iron is 8× cheaper per use.' : v.itemCategory === 'tools' ? 'Tools expected life: power tools (5-10yr), hand tools (15-20yr), garden tools (10-15yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. For occasional use (1-5×/yr), renting at $15-50/day is cheaper than buying. For regular use (10+×/yr), buying gives $0.50-3.00/use vs $15-50/rent — payback in 2-8 uses.' : 'Furniture expected life: sofas (7-15yr, avg 10yr), dining tables (15-25yr), mattresses (7-10yr), area rugs (5-15yr). At ' + v.yearsOwned + 'yr, yours is ' + lifecycleRating + '. Quality wood furniture: $0.20-0.50/day. Particleboard: $0.40-0.80/day. The $0.20 savings/day × 10yr = $730 saved by buying better.'}` },
      { label: 'The Latte Factor Applied', value: `At $${cpu.toFixed(2)}/use, you consume this item $${(cpu * v.uses).toFixed(2)}/year. If the same money were invested at 8% for ${v.yearsOwned} years: $${(v.itemPrice * Math.pow(1.08, v.yearsOwned)).toFixed(0)} of lost potential growth. A $4 latte/day = $1,460/yr = $10,000 in 10yr at 8%. Apply the cost-per-use lens to recurring small purchases for the biggest financial impact.` },
      { label: 'Rent vs Buy Breakeven', value: `Your item costs $${cpu.toFixed(2)}/use. If you can rent the same item for less than $${cpu.toFixed(2)}/use, rent instead. Breakeven formula: item must be used at least $${v.itemPrice.toFixed(0)} ÷ (rental price/use) times. For a $200 dress worn once: $200/use vs $50/rent. For a $200 coat worn 100 times: $2/use — owning wins. General rule: if you'll use an item less than 5-10 times, rent/borrow.` },
      { label: 'Sunk Cost vs Future Value', value: `${cpu < 1 ? 'Already bought items with CPU < $1 are keepers — using them now costs $0 (sunk cost of purchase is gone). Every additional use is pure marginal value.' : cpu < 10 ? 'If you own this item already, the purchase price is sunk. Future uses cost only maintenance ($' + v.maintenanceCost.toFixed(2) + '/yr). Use it — each marginal use after purchase costs almost nothing.' : 'This is a high-CPU item. If you own it but rarely use it, consider selling while it still has resale value. Further non-use doesn\'t "save" anything. The sunk cost is gone; maximize remaining value by using or selling.'}` },
      { label: 'Alternatives Comparison Framework', value: `When shopping, calculate CPU for each option: Option A: $${v.itemPrice.toFixed(0)} / (${v.uses} uses × ${v.yearsOwned}yr) = $${cpu.toFixed(2)}/use. Compare: cheaper item that lasts half as long: $${(v.itemPrice * 0.5).toFixed(0)} / (${v.uses} uses × ${(v.yearsOwned * 0.5).toFixed(0)}yr) = $${(v.itemPrice * 0.5 / (v.uses * v.yearsOwned * 0.5)).toFixed(2)}/use — ${(v.itemPrice * 0.5 / (v.uses * v.yearsOwned * 0.5)) > cpu ? 'the cheaper option is MORE expensive per use!' : 'the cheaper option may be better value per use.'} Always calculate CPU, not purchase price alone.` },
      { label: 'Cost per Use by Category Benchmarks', value: `Target CPU ranges: Wardrobe staple ($0.10-1.00/use), Outerwear ($0.50-2.00/use), Shoes ($0.50-1.50/use), Electronics ($0.05-0.50/day), Cookware ($0.01-0.10/use), Tools ($0.50-5.00/use for occasional, $0.05-0.50 for frequent), Furniture ($0.10-0.50/day), Books ($0.50-2.00/read). If your CPU is >2× the benchmark, reconsider the purchase or buy higher quality for longer life.` },
    ]}
  },
  description: 'Calculate cost per use (CPU) to evaluate any purchase based on purchase price, years owned, usage frequency, maintenance costs, and resale value. Make smarter buying decisions by comparing true cost-per-use across alternatives in clothing, electronics, kitchenware, tools, and furniture.',
  formula: 'CPU = (Purchase Price + (Annual Maintenance × Years) − Resale Value) ÷ (Uses/Year × Years). Annual Cost = Net Cost ÷ Years. Daily Equivalent = CPU ÷ (Uses ÷ 365). Rent vs Buy Breakeven: purchase if Uses > Price ÷ Rental Price.',
  interpretation: 'The cost-per-use framework reveals that expensive, durable items often cost less per use than cheap disposable alternatives. A $50 cast iron pan (20yr, 300 uses/yr = $0.01/use) beats a $30 non-stick pan (2yr, 200 uses/yr = $0.08/use) by 8×. A $200 coat worn 100 times/yr for 5 years = $0.40/use (before resale). Always calculate CPU when deciding between quality vs budget: the question isn\'t "how much does it cost?" but "how much does each use cost?" Resale value dramatically lowers CPU — designer goods with 50%+ resale effectively cost half. Maintenance costs add 10-30% to CPU for items needing regular upkeep. Target CPU: wardrobes staples < $1/use, daily-use electronics < $0.50/day, cookware < $0.10/use.'
}

export default calcDef
