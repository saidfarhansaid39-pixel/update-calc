import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ salePrice: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), costBasis: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), improvements: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), deprecRecapture: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), newPropertyPrice: z.string().min(1, 'Required').refine(v => parseFloat(v) > 0, '>0'), stateRate: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0 && parseFloat(v) <= 15, '0-15') }),
  fields: [{ name: 'salePrice', label: 'Sale Price of Relinquished Property ($)', type: 'number', min: 0, step: '10000' }, { name: 'costBasis', label: 'Original Cost Basis ($)', type: 'number', min: 0, step: '10000' }, { name: 'improvements', label: 'Capital Improvements ($)', type: 'number', min: 0, step: '1000' }, { name: 'deprecRecapture', label: 'Depreciation Recapture ($)', type: 'number', min: 0, step: '1000' }, { name: 'newPropertyPrice', label: 'Replacement Property Price ($)', type: 'number', min: 0, step: '10000' }, { name: 'stateRate', label: 'State Capital Gains Tax Rate (%)', type: 'number', min: 0, max: 15, step: '0.5' }],
  defaults: { salePrice: '500000', costBasis: '200000', improvements: '50000', deprecRecapture: '30000', newPropertyPrice: '600000', stateRate: '5' },
  presets: [
    { label: 'Standard Rental Swap', values: { salePrice: '500000', costBasis: '200000', improvements: '50000', deprecRecapture: '30000', newPropertyPrice: '600000', stateRate: '5' } },
    { label: 'Vacation Home Sale', values: { salePrice: '750000', costBasis: '350000', improvements: '75000', deprecRecapture: '50000', newPropertyPrice: '800000', stateRate: '0' } },
    { label: 'Multi-Property Investor', values: { salePrice: '2000000', costBasis: '800000', improvements: '200000', deprecRecapture: '150000', newPropertyPrice: '2200000', stateRate: '6' } },
    { label: 'Boot Received Scenario', values: { salePrice: '400000', costBasis: '150000', improvements: '25000', deprecRecapture: '20000', newPropertyPrice: '350000', stateRate: '4' } },
    { label: '1031 into DST', values: { salePrice: '1200000', costBasis: '600000', improvements: '100000', deprecRecapture: '80000', newPropertyPrice: '1250000', stateRate: '8' } },
  ],
  compute: (v) => { const sp = parseFloat(v.salePrice) || 0; const cb = parseFloat(v.costBasis) || 0; const imp = parseFloat(v.improvements) || 0; const dep = parseFloat(v.deprecRecapture) || 0; const npp = parseFloat(v.newPropertyPrice) || 0; const sr = parseFloat(v.stateRate) || 0; const adjustedBasis = cb + imp; const totalGain = sp - adjustedBasis; const fedCapGainsRate = 0.2; const fedDepRecapRate = 0.25; const stateCapGainRate = sr / 100; const boot = Math.max(0, sp - npp); const deferredGain = totalGain - boot; const taxIfSold = (totalGain - dep) * fedCapGainsRate + dep * fedDepRecapRate + totalGain * stateCapGainRate; const taxesWith1031 = boot > 0 ? boot * fedCapGainsRate + dep * fedDepRecapRate : 0; const taxSavings = taxIfSold - taxesWith1031; return { result: taxSavings, label: 'Tax Savings via 1031', unit: '$', steps: [{ label: 'Total capital gain (sale price − adjusted basis)', value: `$${totalGain.toFixed(2)}` }, { label: 'Federal tax if sold (20% cap gains + 25% deprec. recapture)', value: `$${taxIfSold.toFixed(2)}` }, { label: 'State tax at marginal rate', value: `$${(totalGain * stateCapGainRate).toFixed(2)}` }, { label: 'Tax with 1031 exchange (boot only)', value: `$${taxesWith1031.toFixed(2)}` }, { label: 'Total tax savings via 1031 exchange', value: `$${taxSavings.toFixed(2)}` }] ,
    extras: [
      { label: 'Strategy Note', value: 'Timing a 1031 exchange requires strict 45-day identification and 180-day closing windows. Use a qualified intermediary to avoid boot.' },
      { label: 'Tax Consideration', value: 'Depreciation recapture is taxed at 25% vs. capital gains at 20%. State rates vary from 0–13.3%. Boot (cash or debt relief) is immediately taxable.' },
      { label: 'Risk Note', value: 'Like-kind rules are narrow — real estate for real estate only. Personal property no longer qualifies post-TCJA 2017. Missed deadlines trigger full tax.' },
      { label: 'Comparison', value: 'Vs. paying taxes outright: 1031 preserves full investment capital. Vs. DST: 1031 has lower fees but stricter timelines. Vs. Opportunity Zone: different deferral mechanics.' },
      { label: 'Real-World Example', value: 'Sell $500k rental (basis $200k), buy $600k replacement. Tax if sold: ~$78k. Tax with 1031: $0 (no boot). Savings: $78k deferred indefinitely.' },
    ]} },
  description: 'A 1031 exchange allows real estate investors to defer capital gains taxes by reinvesting proceeds from a property sale into a like-kind replacement property.',
  formula: 'Deferred Gain = Total Gain - Boot | Tax Savings = Tax if Sold - Tax with 1031 | Boot = Sale Price - New Property Price',
  interpretation: 'A 1031 exchange defers both federal and state capital gains taxes. To fully defer taxes, the replacement property must be of equal or greater value (no boot received).'
}

export default calcDef
