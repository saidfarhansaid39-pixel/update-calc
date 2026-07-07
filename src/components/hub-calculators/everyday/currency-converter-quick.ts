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
    return { result: netAmount, label: 'You Receive', unit: 'foreign units', steps: [{ label: 'Gross Conversion', value: `${grossAmount.toFixed(4)}` }, { label: 'Fee', value: `${feeAmount.toFixed(4)} (${v.fee}%)` }, { label: 'Net Amount', value: `${netAmount.toFixed(4)}` }, { label: 'Effective Rate', value: `${effectiveRate.toFixed(6)}` }] }
  },
  description: 'Quick currency conversion with exchange rate and transaction fee. See the true effective rate after fees for international transfers.',
  formula: 'Net = Amount × Rate × (1 - Fee%)',
  interpretation: 'Banks and transfer services add 1-5% above the mid-market rate. Mid-market rate via XE or Google. For best rates, use Wise, Revolut, or specialist forex brokers.'
}

export default calcDef
