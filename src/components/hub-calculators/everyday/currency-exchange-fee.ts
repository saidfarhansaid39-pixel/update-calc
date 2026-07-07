import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ amount: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), rate: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), fee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'amount', label: 'Amount to Convert ($)', type: 'number', min: 1, step: '10' },
    { name: 'rate', label: 'Exchange Rate', type: 'number', min: 0.001, step: '0.01' },
    { name: 'fee', label: 'Transaction Fee (%)', type: 'number', min: 0, step: '0.5' },
  ],
  compute: (v) => {
    const grossAmount = v.amount * v.rate
    const feeAmount = grossAmount * (v.fee / 100)
    const netAmount = grossAmount - feeAmount
    const effectiveRate = netAmount / v.amount
    return { result: netAmount, label: 'You Receive', unit: 'foreign currency', steps: [{ label: 'Amount Sent', value: `$${v.amount.toFixed(2)}` }, { label: 'Gross at Rate', value: `${grossAmount.toFixed(4)}` }, { label: 'Fee Deducted', value: `${feeAmount.toFixed(4)} (${v.fee}%)` }, { label: 'Net Received', value: `${netAmount.toFixed(4)}` }, { label: 'Effective Rate', value: `${effectiveRate.toFixed(6)}` }] }
  },
  description: 'Calculate the net foreign currency amount after exchange fees. Enter the amount, rate, and fee percentage to see what you actually receive.',
  formula: 'Net = (Amount × Rate) × (1 - Fee%)',
  interpretation: 'Banks and money transfer services add 3-7% in fees and margin. Online specialists (Wise, Revolut) charge 0.4-1%. Always compare the effective rate, not just the headline rate. ATMs abroad add 1-3% + flat fee.'
}

export default calcDef
