import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fromCurrency: z.string().min(1), toCurrency: z.string().min(1), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), spreadPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'amount', label: 'Amount', type: 'number', min: 1, step: '10' },
    { name: 'fromCurrency', label: 'From Currency', type: 'select', options: [{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'GBP', value: 'GBP' }, { label: 'JPY', value: 'JPY' }, { label: 'CAD', value: 'CAD' }, { label: 'AUD', value: 'AUD' }] },
    { name: 'toCurrency', label: 'To Currency', type: 'select', options: [{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'GBP', value: 'GBP' }, { label: 'JPY', value: 'JPY' }, { label: 'CAD', value: 'CAD' }, { label: 'AUD', value: 'AUD' }] },
    { name: 'rate', label: 'Mid-Market Rate', type: 'number', min: 0.0001, step: '0.01' },
    { name: 'spreadPct', label: 'Provider Spread (%)', type: 'number', min: 0, step: '0.5' },
  ],
  defaults: { amount: '1000', fromCurrency: 'USD', toCurrency: 'EUR', rate: '0.92', spreadPct: '1' },
  presets: [
    { label: 'USD to EUR (Travel)', values: { amount: '5000', fromCurrency: 'USD', toCurrency: 'EUR', rate: '0.92', spreadPct: '1' } },
    { label: 'GBP to USD (Property)', values: { amount: '250000', fromCurrency: 'GBP', toCurrency: 'USD', rate: '1.27', spreadPct: '0.5' } },
    { label: 'JPY to AUD (Holiday)', values: { amount: '100000', fromCurrency: 'JPY', toCurrency: 'AUD', rate: '0.010', spreadPct: '2' } },
    { label: 'Bank Wire (Worst Rate)', values: { amount: '10000', fromCurrency: 'USD', toCurrency: 'GBP', rate: '0.79', spreadPct: '4' } },
  ],
  compute: (v) => {
    const appliedRate = v.rate * (1 - v.spreadPct / 100)
    const converted = v.amount * appliedRate
    const bankRate = v.rate * (1 - v.spreadPct / 100 * 2)
    const bankConverted = v.amount * bankRate
    const diff = converted - bankConverted
    const feeCost = v.amount * v.rate - converted
    const feePct = (feeCost / (v.amount * v.rate)) * 100
    const midMarketValue = v.amount * v.rate
    const transferFee = midMarketValue - converted
    return { result: converted, label: `Converted Amount`, unit: v.toCurrency, steps: [
      { label: 'Amount to Convert', value: `${v.amount} ${v.fromCurrency}` },
      { label: 'Mid-Market Rate', value: `1 ${v.fromCurrency} = ${v.rate} ${v.toCurrency}` },
      { label: 'Mid-Market Value', value: `${midMarketValue.toFixed(2)} ${v.toCurrency}` },
      { label: 'Provider Markup (Spread)', value: `${v.spreadPct}% → effective rate: ${appliedRate.toFixed(6)}` },
      { label: 'You Receive', value: `${converted.toFixed(2)} ${v.toCurrency}` },
      { label: 'Cost of Transfer (hidden)', value: `${transferFee.toFixed(2)} ${v.toCurrency} (${feePct.toFixed(2)}%)` },
      { label: 'Typical Bank Rate', value: `${bankRate.toFixed(6)} → ${bankConverted.toFixed(2)} ${v.toCurrency}` },
      { label: 'You Save vs Bank', value: `${diff.toFixed(2)} ${v.toCurrency}` },
    ] ,
    extras: [
      { label: "Provider Cost Comparison", value: "Bank wire transfer: 3-5% spread + $25-50 flat fee. Wise: 0.4-1.0% spread, transparent fee. Revolut: 0.5-1.0% (free within monthly limits, 1% above). PayPal: 3-5% spread + 4-5% fee = 7-10% total. Western Union: 5-8% total. ATM withdrawal: 1-3% spread + $3-8 fee. On $10,000 USD→EUR: Bank costs $350-550, Wise costs $60-120." },
      { label: "Timing the Market", value: "FX rates fluctuate 0.5-2% daily on major pairs (EUR/USD, GBP/USD, USD/JPY). Over a month: 3-7% range. Use limit orders (Wise, OFX, XE) to auto-execute when your target rate hits. Forward contracts (for transfers >$50k) lock today's rate for up to 12 months. Avoid exchanging at airports (5-10% spread) or hotels (8-15% spread)." },
      { label: "Holiday Money Tips", value: "Get a fee-free travel card (Wise card, Revolut, Chase Sapphire, Capital One 360) that uses mid-market rates and charges 0% foreign transaction fees. Withdraw local currency from ATMs (not currency exchange kiosks). Always decline DCC (Dynamic Currency Conversion) — paying in your home currency adds 3-7% hidden fee." },
      { label: "Large Transfer Strategy (>$50k)", value: "For property purchases or business transfers >$50k: negotiate directly with currency brokers (Xe Business, OFX, CurrencyFair). Typical spread: 0.15-0.50% for $50-500k transfers vs 1-3% retail. Use forward contracts to lock rates for closing dates. Save $1,000-5,000 on a $200k transfer vs retail bank." },
      { label: "Cross-Border Business Payments", value: "Business exchange rates are 0.2-1% spread (vs 1-3% personal). Dedicated B2B platforms (Payoneer, Airwallex, Veem): 0.3-1% fee, faster settlement. Freelancers: charge in your home currency to avoid FX uncertainty, or add a 2-3% 'FX buffer' to invoices if paid in foreign currency." },
      { label: "Currency Hedging for Investors", value: "International ETF investors lose 2-8%/yr to currency fluctuations (2022: USD strengthening caused 10-20% losses for non-US investors holding US stocks). Consider currency-hedged ETFs (e.g., IAGG for international bonds). For large portfolios >$500k, use FX forward contracts or currency overlay strategies via your broker." },
      { label: "Spread Impact by Transfer Size", value: "On a $200 transfer: 1% spread = $2, 3% = $6, 5% = $10. Impact small (<$10). On a $10,000 transfer: 1% = $100, 3% = $300, 5% = $500. On a $250,000 property transfer: 1% = $2,500, 2% = $5,000. For large transfers, even a 0.1% difference matters ($250 on $250k). Always negotiate for >$100k transfers." },
      { label: "Forex Scam Warning Signs", value: "Red flags: guaranteed returns of 2-5%+/month (legitimate FX trading averages -0.5 to +1.5%/mo). Binary options (banned in EU/UK/AU/CA, restricted in US). Unregulated brokers (check FCA, ASIC, CFTC, FINMA registration). 'Signal sellers' promising 80%+ win rates. Never send crypto for currency exchange — 90%+ are scams." },
    ]}
  },
  description: 'Convert between major currencies with full transparency on the real cost of exchange. Compares provider markups against mid-market rates and typical bank spreads so you can choose the cheapest transfer method.',
  formula: 'You Receive = Amount × [Rate × (1 - Spread%/100)] | Hidden Fee = (Amount × Rate) - (Amount × Applied Rate)',
  interpretation: 'The mid-market rate (from XE.com or Google) is the true benchmark — any deviation is a hidden fee. Banks typically add 3-5% spread (costing $300-500 per $10,000 transferred), while modern specialists like Wise add 0.4-1%. The spread compounds: a 3% spread means your rate is 97% of fair value, effectively charging you 3.1% in fee. For a $250,000 international property purchase, the difference between a bank (3%) and Wise (0.5%) is $6,250 — enough for a week in your new country.'
}

export default calcDef
