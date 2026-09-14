import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'amount', label: 'Amount to Convert ($)', type: 'number', min: 1, step: '10' },
    { name: 'rate', label: 'Exchange Rate', type: 'number', min: 0.001, step: '0.01' },
    { name: 'fee', label: 'Transaction Fee (%)', type: 'number', min: 0, step: '0.5' },
  ],
  defaults: { amount: '800', rate: '1.38', fee: '1' },
  presets: [
    { label: 'Weekend in Paris', values: { amount: '1500', rate: '0.92', fee: '1' } },
    { label: 'Tokyo Shopping Trip', values: { amount: '2000', rate: '149.50', fee: '1.5' } },
    { label: 'London Business Trip', values: { amount: '3000', rate: '0.79', fee: '0.5' } },
    { label: 'Cancun Vacation Cash', values: { amount: '600', rate: '17.25', fee: '4' } },
  ],
  compute: (v) => {
    const grossAmount = v.amount * v.rate
    const feeAmount = grossAmount * (v.fee / 100)
    const netAmount = grossAmount - feeAmount
    const effectiveRate = netAmount / v.amount
    const feeAsUsd = v.amount * v.rate * (v.fee / 100) / v.rate
    return { result: netAmount, label: 'Local Currency Received', unit: 'foreign currency', steps: [{ label: 'Trip Budget (USD)', value: `$${v.amount.toFixed(2)}` }, { label: 'Current Rate', value: `1 USD = ${v.rate.toFixed(6)}` }, { label: 'Gross in Local', value: `${grossAmount.toFixed(2)}` }, { label: 'Fee Deducted', value: `${feeAmount.toFixed(2)} (${v.fee}%)` }, { label: 'Net Spending Money', value: `${netAmount.toFixed(2)}` }, { label: 'Cost in USD', value: `~$${feeAsUsd.toFixed(2)} in fees` }, { label: 'Effective Rate', value: `1 USD = ${effectiveRate.toFixed(6)} (${((v.rate - effectiveRate) / v.rate * 100).toFixed(2)}% loss)` }] ,
    extras: [
      { label: "Avoid Airport Kiosks", value: "Currency exchange at airports gives the worst rates—typically 5-12% below market. Always convert at a local ATM or use a travel card." },
      { label: "Best Travel Card", value: "Use a credit card with $0 foreign transaction fee (Chase Sapphire, Capital One Venture, Apple Card). These use Visa/MC rates (~0% markup)." },
      { label: "ATM Strategy", value: "Withdraw enough for 5-7 days at once to minimize flat fees. Reimburse ATM fees with a Schwab or Fidelity cash management account." },
      { label: "Notify Your Bank", value: "Set travel notifications 48h before departure to avoid fraud blocks. Even with notifications, some banks still flag foreign transactions—carry a backup card." },
      { label: "Cash vs Card", value: "Europe: cards widely accepted but small shops prefer cash (€20-50). Japan: still heavily cash-based. Mexico: cards at chains, cash for markets/taxis." },
      { label: "Dynamic Currency Conversion", value: "When a merchant offers to charge you in USD instead of local currency—refuse! DCC rates are 3-8% worse than the standard card rate." },
      { label: "Travel Money Cards", value: "Prepaid travel cards (Revolut, Wise, Monzo) lock rates on loading and offer 0% FX fees on weekdays. Weekend markups of 1% apply." },
      { label: "Emergency Cash", value: "Carry $100-200 USD as emergency backup. USD is widely exchangeable globally, even in places with strict currency controls." },
    ]}
  },
  description: 'Plan your travel currency conversion by factoring in exchange rates, fees, and payment method. See exactly how much spending money you will have in local currency and which payment method costs you the least.',
  formula: 'Local Currency = (Amount × Rate) − (Amount × Rate × Fee ÷ 100) | Fee Cost in USD = Fee Amount ÷ Rate',
  interpretation: 'For international travel, the hierarchy of savings is: (1) credit cards with $0 foreign transaction fee (best), (2) fee-free ATM withdrawals from Schwab/Fidelity accounts, (3) prepaid travel cards like Wise or Revolut, (4) local bank ATMs with 1-3% fee, and (5) airport currency kiosks (worst—avoid). Always decline Dynamic Currency Conversion (DCC) at merchants and ATMs, which adds 3-8% markup in the exchange rate.'
}

export default calcDef
