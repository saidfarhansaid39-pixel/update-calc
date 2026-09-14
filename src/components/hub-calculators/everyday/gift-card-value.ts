import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ giftCardBalance: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), discountRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cashbackRate: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'giftCardBalance', label: 'Gift Card Balance ($)', type: 'number', min: 1, step: '5' },
    { name: 'discountRate', label: 'Purchase Discount (%)', type: 'number', min: 0, max: 100, step: '1' },
    { name: 'cashbackRate', label: 'Cashback/Rewards (%)', type: 'number', min: 0, max: 100, step: '0.5' },
  ],
  defaults: { giftCardBalance: '100', discountRate: '10', cashbackRate: '2' },
  presets: [
    { label: 'Card Resale Market', values: { giftCardBalance: '100', discountRate: '15', cashbackRate: '0' } },
    { label: 'Credit Card Portal Buy', values: { giftCardBalance: '100', discountRate: '5', cashbackRate: '5' } },
    { label: 'Warehouse Club Deal', values: { giftCardBalance: '100', discountRate: '20', cashbackRate: '0' } },
    { label: 'Rewards + Discount Stack', values: { giftCardBalance: '100', discountRate: '10', cashbackRate: '3' } },
  ],
  compute: (v) => {
    const effectiveValue = v.giftCardBalance / (1 - v.discountRate / 100)
    const cashback = v.giftCardBalance * (v.cashbackRate / 100)
    const totalValue = v.giftCardBalance + cashback
    const costToBuy = v.giftCardBalance * (1 - v.discountRate / 100)
    const effectiveSavingsPct = (v.giftCardBalance / costToBuy - 1) * 100
    const cashbackOnPurchase = costToBuy * (v.cashbackRate / 100)
    const stackedValue = v.giftCardBalance + cashback + cashbackOnPurchase
    const spendMultiplier = stackedValue / costToBuy
    return { result: totalValue, label: 'Total Value', unit: '$', steps: [{ label: 'Gift Card Face Value', value: `$${v.giftCardBalance.toFixed(2)}` }, { label: 'Discount', value: `-${v.discountRate}% = pay $${costToBuy.toFixed(2)}` }, { label: 'Cashback on Purchase', value: `$${cashbackOnPurchase.toFixed(2)} (${v.cashbackRate}% on $${costToBuy.toFixed(2)})` }, { label: 'Cashback on Spend', value: `$${cashback.toFixed(2)} (${v.cashbackRate}% of spend)` }, { label: 'Total Stacked Value', value: `$${stackedValue.toFixed(2)}` }, { label: 'Cost to Acquire', value: `$${costToBuy.toFixed(2)}` }, { label: 'Effective Spend Multiplier', value: `${spendMultiplier.toFixed(2)}×` }, { label: 'Total Savings', value: `$${(stackedValue - costToBuy).toFixed(2)} (${effectiveSavingsPct.toFixed(1)}% return)` }] ,
    extras: [
      { label: 'Discount Stacking Strategy', value: `Stack ${v.discountRate}% discount + ${v.cashbackRate}% cashback: you pay $${costToBuy.toFixed(2)} for $${stackedValue.toFixed(2)} of spending power = ${spendMultiplier.toFixed(2)}× value. Every $100 of gift card face value effectively costs $${costToBuy.toFixed(2)}. For a $500 shopping trip: pay ~$${(costToBuy * 5).toFixed(2)} instead of $500 — save $${(500 - costToBuy * 5).toFixed(2)}.` },
      { label: 'Cashback vs Discount Tradeoff', value: `${v.discountRate}% discount saves $${(v.giftCardBalance * v.discountRate / 100).toFixed(2)} immediately. ${v.cashbackRate}% cashback adds $${(cashback + cashbackOnPurchase).toFixed(2)} but may take 1-2 billing cycles. At these rates: discount is ${v.discountRate >= v.cashbackRate * 2 ? 'much more valuable — always take the discount first' : v.discountRate >= v.cashbackRate ? 'moderately more valuable' : 'close in value — prioritize whichever is guaranteed'}.` },
      { label: 'Best Places to Buy Discounted Cards', value: `CardCash/GiftCardGranny: 5-30% off. Raise: 3-15% off. Sam's Club/Costco: 15-25% off restaurant cards (regularly). Credit card portals (Chase UR, Amex MR): 5-10% off + your card's cashback. Target Circle: 5-10% off gift cards during promos. Hotel chains: often 10-20% off. Never pay more than 90% of face value for any card — wait for deals.` },
      { label: 'Gift Card Risk Factors', value: `${v.discountRate > 0 ? `You saved ${v.discountRate}% but: 1) Card issuer bankruptcy risk (unsecured creditor). 2) Expiration: check terms (some expire after 12-24 months of inactivity). 3) Lost card = lost money (no recourse). 4) Partial spend leaves small balances.` : 'No discount = full risk. Better: buy discounted cards or use regular credit card with purchase protection for the same face value.'} Buy from reputable resellers with buyer protection policies. Register cards immediately with the issuer.` },
      { label: 'Tax Implications of Gift Cards', value: `Gift cards purchased at a discount: no tax due at purchase (you already paid tax on the income used to buy them). Using gift cards for business gifts: deductible up to $25/person/yr regardless of discount. Credit card cashback: generally considered a rebate (not taxable income) by IRS. Bought at 20% off? Your $100 gift card cost $80 — no taxable gain.` },
      { label: 'Optimal Use Strategy', value: `Use discounted gift cards for: everyday spend (groceries, gas, dining), planned large purchases (electronics, vacations, home improvement), recurring bills (where accepted). Avoid: letting cards sit unused >6 months (value erodes with inflation). Best practice: purchase only when you have a specific purchase planned within 30 days — your $${v.giftCardBalance.toFixed(0)} card generates ${spendMultiplier.toFixed(2)}× value only when you actually use it.` },
      { label: 'Comparison to Credit Card Rewards', value: `A ${v.cashbackRate}% cashback card alone: $1,000 spend = $${(1000 * v.cashbackRate / 100).toFixed(0)} back. With ${v.discountRate}% discounted cards + ${v.cashbackRate}% cashback: $1,000 spend = $${(1000 * (1 + v.cashbackRate / 100)).toFixed(2)} on cards bought for $${(1000 * (1 - v.discountRate / 100) * (1 - v.cashbackRate / 100)).toFixed(2)} = total savings of $${(1000 - 1000 * (1 - v.discountRate / 100) * (1 - v.cashbackRate / 100)).toFixed(0)}. Stacking beats any single tactic.` },
      { label: 'Seasonal Gift Card Promotions', value: `Best times to buy: Mother's Day (May), graduation (May-Jun), restaurant weeks (various), Teacher Appreciation (May), Black Friday/Cyber Monday (Nov), Christmas (Dec). Promotions offer 10-25% off + bonus cards ($10 bonus per $50 purchased). During holidays, resale market prices drop due to high supply — buy discounted cards in Jan-Feb for next year.` },
    ]}
  },
  description: 'Maximize gift card value by analyzing purchase discounts, cashback rewards, and stacking strategies. Calculate effective spending power from card resale markets, credit card portals, warehouse club deals, and combined discount+cashback scenarios.',
  formula: 'Total Value = Face Value + Cashback on Spend + Cashback on Purchase | Cost to Buy = Face Value × (1 − Discount%) | Spend Multiplier = Total Value ÷ Cost to Buy | Effective Savings = (Cost to Buy − Total Value) / Cost to Buy × 100',
  interpretation: 'Buying discounted gift cards (e.g., 10% off) effectively gives you 11.1% more spending power. Combine resale discounts (5-30%) + credit card cashback (2-5%) for up to 35% effective savings. Best sources: CardCash, Raise, warehouse clubs, credit card portals. Never pay full face value — even 2-3% off from rewards cards beats 0%. Watch for issuer bankruptcy risk and inactivity fees.'
}

export default calcDef
