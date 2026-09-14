import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'amount', label: 'Amount to Convert ($)', type: 'number', min: 1, step: '10' },
    { name: 'rate', label: 'Exchange Rate', type: 'number', min: 0.001, step: '0.01' },
    { name: 'fee', label: 'Transaction Fee (%)', type: 'number', min: 0, step: '0.5' },
  ],
  defaults: { amount: '1000', rate: '0.92', fee: '1' },
  presets: [
    { label: 'USD to EUR (Travel)', values: { amount: '2000', rate: '0.92', fee: '1.5' } },
    { label: 'USD to GBP (Transfer)', values: { amount: '5000', rate: '0.79', fee: '0.5' } },
    { label: 'USD to JPY (Shopping)', values: { amount: '500', rate: '149.50', fee: '2' } },
    { label: 'USD to MXN (Remittance)', values: { amount: '300', rate: '17.25', fee: '3' } },
  ],
  compute: (v) => {
    const grossAmount = v.amount * v.rate
    const feeAmount = grossAmount * (v.fee / 100)
    const netAmount = grossAmount - feeAmount
    const effectiveRate = netAmount / v.amount
    const feePctOfPrincipal = (feeAmount / v.amount) * 100
    return { result: netAmount, label: 'You Receive', unit: 'foreign units', steps: [{ label: 'Amount Sent', value: `$${v.amount.toFixed(2)} USD` }, { label: 'Market Rate', value: `1 USD = ${v.rate.toFixed(6)}` }, { label: 'Gross Proceeds', value: `${grossAmount.toFixed(4)} foreign units` }, { label: 'Fee Deducted', value: `${feeAmount.toFixed(4)} (${v.fee}% of gross)` }, { label: 'Net Received', value: `${netAmount.toFixed(4)} foreign units` }, { label: 'Effective Rate', value: `1 USD = ${effectiveRate.toFixed(6)} (${((v.rate - effectiveRate) / v.rate * 100).toFixed(2)}% markdown)` }, { label: 'Cost to Send', value: `$${feeAmount.toFixed(2)} = ${feePctOfPrincipal.toFixed(2)}% of amount sent` }] ,
    extras: [
      { label: "Mid-Market Rate", value: "Always compare against the mid-market (interbank) rate on XE or Google. Banks typically mark this up 1-4% hidden in the rate." },
      { label: "Fee vs Rate Spread", value: "Some services charge 0% fee but give a rate 2-3% below market. Compare the effective rate, not the advertised fee percentage." },
      { label: "Best Providers", value: "Wise: 0.4-1% all-in. Revolut: 0-1% (free tier limits). OFX/XE: 0.5-1.5% for large transfers. Banks: 3-7% total cost." },
      { label: "Transfer Speed", value: "SWIFT (bank): 1-5 business days. Wise/Revolut: same-day to 2 days. Crypto-pegged: instant but volatile. Speed often correlates with fee." },
      { label: "Amount Thresholds", value: "Transfers under $1,000 incur higher effective fees due to fixed components. >$10,000 often qualifies for wholesale rates (0.2-0.5%)." },
      { label: "Regulation & Limits", value: "US transfers >$3,000 require identity verification. >$10,000 triggers FinCEN reporting. Same institution transfers (bank-to-bank) may have lower limits." },
      { label: "Currency Volatility", value: "Exchange rates fluctuate intraday on news (Fed rate decisions, CPI releases). If sending large amounts, consider a limit order to target a specific rate." },
      { label: "Hedging Options", value: "For large future transfers ($50k+), a forward contract locks today's rate for up to 12 months. Available through OFX, XE Business, and banks." },
    ]}
  },
  description: 'Quick currency conversion with exchange rate and transaction fee. See the true effective rate after fees—not just the advertised rate—so you know exactly how much foreign currency you will receive.',
  formula: 'Net Received = Amount × Rate × (1 − Fee ÷ 100) | Effective Rate = Net ÷ Amount',
  interpretation: 'Banks and transfer services add 1-7% above the mid-market rate, often hidden in a widened spread rather than a line-item fee. For the best deal, compare the effective rate (net received ÷ amount sent) across Wise (0.4-1%), Revolut (0-1%), OFX (0.5-1.5%), and traditional banks (3-7%). A mid-market rate of 0.92 USD/EUR with a 2% fee and 1% spread means you effectively get 0.892 EUR per USD.'
}

export default calcDef
