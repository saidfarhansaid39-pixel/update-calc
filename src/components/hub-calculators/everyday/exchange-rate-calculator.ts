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
  compute: (v) => {
    const appliedRate = v.rate * (1 - v.spreadPct / 100)
    const converted = v.amount * appliedRate
    const bankRate = v.rate * (1 - v.spreadPct / 100 * 2)
    const bankConverted = v.amount * bankRate
    const diff = converted - bankConverted
    return { result: converted, label: `Converted Amount`, unit: v.toCurrency, steps: [{ label: 'Mid-Market Rate', value: `1 ${v.fromCurrency} = ${v.rate} ${v.toCurrency}` }, { label: 'Your Rate', value: `1 ${v.fromCurrency} = ${appliedRate.toFixed(6)} ${v.toCurrency}` }, { label: `You Receive`, value: `${converted.toFixed(2)} ${v.toCurrency}` }, { label: 'You Save vs Bank', value: `${diff.toFixed(2)} ${v.toCurrency}` }] }
  },
  description: 'Convert currencies using live exchange rates with spread comparison. See how provider fees impact your transfer and compare against typical bank rates.',
  formula: 'Converted = Amount × Rate × (1 - Spread%)',
  interpretation: 'Banks and airport kiosks add 2-5% spread over mid-market rate. Specialist services (Wise, Revolut) charge 0.4-1%. Always use mid-market rate from XE.com as your benchmark. Large transfers (>$10k) qualify for negotiated rates.'
}

export default calcDef
