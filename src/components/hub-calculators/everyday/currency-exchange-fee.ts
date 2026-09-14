import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'amount', label: 'Amount to Convert ($)', type: 'number', min: 1, step: '10' },
    { name: 'rate', label: 'Exchange Rate', type: 'number', min: 0.001, step: '0.01' },
    { name: 'fee', label: 'Transaction Fee (%)', type: 'number', min: 0, step: '0.5' },
  ],
  defaults: { amount: '2500', rate: '1.35', fee: '2.5' },
  presets: [
    { label: 'Bank Wire to Europe', values: { amount: '10000', rate: '0.92', fee: '3' } },
    { label: 'ATM Withdrawal Abroad', values: { amount: '400', rate: '0.85', fee: '4' } },
    { label: 'Online Transfer (Wise)', values: { amount: '3000', rate: '0.79', fee: '0.5' } },
    { label: 'Credit Card Purchase', values: { amount: '150', rate: '145.20', fee: '1.5' } },
  ],
  compute: (v) => {
    const grossAmount = v.amount * v.rate
    const feeAmount = grossAmount * (v.fee / 100)
    const netAmount = grossAmount - feeAmount
    const effectiveRate = netAmount / v.amount
    const totalCostPct = ((v.rate - effectiveRate) / v.rate) * 100
    return { result: netAmount, label: 'You Receive', unit: 'foreign currency', steps: [{ label: 'Amount Sent', value: `$${v.amount.toFixed(2)} USD` }, { label: 'Advertised Rate', value: `1 USD = ${v.rate.toFixed(6)}` }, { label: 'Gross Proceeds', value: `${grossAmount.toFixed(4)}` }, { label: 'Fee (${v.fee}%)', value: `–${feeAmount.toFixed(4)}` }, { label: 'Net Proceeds', value: `${netAmount.toFixed(4)}` }, { label: 'Effective Rate', value: `1 USD = ${effectiveRate.toFixed(6)}` }, { label: 'Total Cost vs Market', value: `${totalCostPct.toFixed(2)}% markup (fee + spread)` }] ,
    extras: [
      { label: "Hidden Spread", value: "Most banks don't charge a line-item fee—they inflate the rate 1-3% below market and call it '0% fee'. This calculator reveals the true cost." },
      { label: "ATM Fees", value: "International ATMs charge 1-3% + $2-5 flat fee. On $400 withdrawal at 3% + $3 fee, you lose $15 (3.75%) before the rate spread." },
      { label: "Credit Card Loading", value: "Visa/Mastercard charge a 1% assessment fee on international transactions. Many issuers add a 2-3% foreign transaction fee on top." },
      { label: "Peer-to-Peer Savings", value: "Wise/Revolut save 60-80% vs banks on medium transfers ($1,000-10,000) by using mid-market rates and charging a transparent fee of 0.4-1%." },
      { label: "Cash vs Digital", value: "Physical currency exchange at airport kiosks has the worst spreads (5-12%). Always convert digitally and withdraw local currency from in-network ATMs." },
      { label: "TransferWise Edge", value: "For amounts >$50k, use a currency broker (OFX, XE Business) rather than a consumer service—they negotiate rates and waive fees on large transfers." },
      { label: "Fee Structure Types", value: "Three models: (a) transparent flat % fee, (b) zero fee + wide spread, (c) tiered (small transfer = high %, large = low %). Model (a) is cheapest." },
      { label: "Regulatory Disclosure", value: "Since 2021, EU laws require FX providers to show total cost including the spread. The US lacks this rule—you must calculate the effective rate yourself." },
    ]}
  },
  description: 'Calculate exactly how much foreign currency you actually receive after exchange fees and hidden rate spreads. Compare the advertised rate against the effective rate to reveal the true cost of any transfer method.',
  formula: 'Net = (Amount × Rate) × (1 − Fee ÷ 100) | Total Markup = (Rate − Effective Rate) ÷ Rate × 100',
  interpretation: 'Banks and money transfer services often advertise "0% fee" while embedding a 2-4% markup in the exchange rate. The total cost is the sum of explicit fees plus the rate spread. Online specialists (Wise, Revolut) charge 0.4-1% all-in on mid-market rates. International ATMs add 1-3% + $2-5 flat fee. Credit cards typically add 1-3% foreign transaction fees on top of Visa/Mastercard\'s 1% assessment fee.'
}

export default calcDef
