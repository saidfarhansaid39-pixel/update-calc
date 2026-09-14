import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ cvsCableBill: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cvsStreamCount: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cvsAvgStreamCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cvsInternetCost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'cvsCableBill', label: 'Monthly Cable Bill ($)', type: 'number', min: 0, step: '20' },
    { name: 'cvsStreamCount', label: 'Streaming Services', type: 'number', min: 0, step: '1' },
    { name: 'cvsAvgStreamCost', label: 'Avg Cost per Service ($)', type: 'number', min: 0, step: '5' },
    { name: 'cvsInternetCost', label: 'Internet Cost ($/mo)', type: 'number', min: 0, step: '10' },
  ],
  defaults: { cvsCableBill: '120', cvsStreamCount: '3', cvsAvgStreamCost: '12', cvsInternetCost: '60' },
  presets: [
    { label: 'Heavy Cable User', values: { cvsCableBill: '200', cvsStreamCount: '2', cvsAvgStreamCost: '15', cvsInternetCost: '80' } },
    { label: 'Cord-Cutter Starter', values: { cvsCableBill: '100', cvsStreamCount: '3', cvsAvgStreamCost: '10', cvsInternetCost: '55' } },
    { label: 'Streaming Enthusiast', values: { cvsCableBill: '140', cvsStreamCount: '5', cvsAvgStreamCost: '12', cvsInternetCost: '70' } },
    { label: 'Minimalist Bundle', values: { cvsCableBill: '80', cvsStreamCount: '2', cvsAvgStreamCost: '8', cvsInternetCost: '45' } },
  ],
  compute: (v) => {
    const streamingTotal = v.cvsStreamCount * v.cvsAvgStreamCost + v.cvsInternetCost
    const annualCable = v.cvsCableBill * 12
    const annualStreaming = streamingTotal * 12
    const savings = annualCable - annualStreaming
    const pctSaved = annualCable > 0 ? (savings / annualCable) * 100 : 0
    const monthlySavings = v.cvsCableBill - streamingTotal
    const cablePerYearPerDollar = v.cvsCableBill > 0 ? 12 / v.cvsCableBill : 0
    return {
      result: savings, label: 'Annual Savings with Streaming', unit: '$',
      steps: [
        { label: 'Monthly', value: `Cable: $${v.cvsCableBill.toFixed(2)} | Streaming: $${streamingTotal.toFixed(2)}` },
        { label: 'Cable Annual Cost', value: `$${annualCable.toFixed(2)} ($${v.cvsCableBill.toFixed(2)} × 12)` },
        { label: 'Streaming Services', value: `${v.cvsStreamCount} services × $${v.cvsAvgStreamCost.toFixed(2)} = $${(v.cvsStreamCount * v.cvsAvgStreamCost).toFixed(2)}/mo` },
        { label: 'Internet Cost', value: `$${v.cvsInternetCost.toFixed(2)}/mo` },
        { label: 'Streaming + Internet Monthly', value: `$${streamingTotal.toFixed(2)}` },
        { label: 'Streaming Annual Total', value: `$${annualStreaming.toFixed(2)}` },
        { label: 'Monthly Savings', value: `$${monthlySavings.toFixed(2)}/mo` },
        { label: 'Annual Savings', value: `$${savings.toFixed(2)} (${pctSaved.toFixed(0)}% less than cable)` },
      ],
      extras: [
        { label: 'Cable vs Streaming Landscape 2025', value: 'Average cable bill: $120-180/mo. Average internet: $60-80/mo. Streaming services: $8-20 each. Cutting the cord saves $500-1,200/yr depending on service count.' },
        { label: 'Over-the-Air Alternative', value: 'An HD antenna ($25-50 one-time) provides free access to ABC, CBS, NBC, Fox, and PBS. Combine with a DVR (Tablo, HDHomeRun $100-200) for recording capability.' },
        { label: 'Service Rotation Strategy', value: 'Rotate streaming services monthly instead of subscribing to all simultaneously. Watch Netflix for 2 months, then switch to Hulu/Disney+ for 2 months. Saves $200-400/yr.' },
        { label: 'Hidden Cable Fees', value: 'Cable bills include broadcast TV fees ($10-20), regional sports fees ($5-15), HD technology fee ($5-10), set-top box rental ($5-15), and taxes. These add 30-50% to the base price.' },
        { label: 'Annual Plan Discounts', value: 'Most streaming services offer 15-20% discounts for annual prepayment. Netflix: no annual plan. Hulu: $80/yr ($6.67/mo vs $9.99/mo). Disney+: $140/yr vs $156/yr. Max: $150/yr vs $180/yr.' },
        { label: 'Sports Fan Consideration', value: 'Sports are the #1 reason people keep cable. Alternatives: YouTube TV ($73/mo), Hulu + Live TV ($77/mo), Sling TV ($40/mo), or league-specific passes (NFL Sunday Ticket, NBA League Pass).' },
        { label: 'Family Sharing Plans', value: 'Most streaming services allow multiple profiles and simultaneous streams. Share accounts with family (Netflix: 2-4 screens, Disney+: 4 screens, Max: 2-3 screens). Some services limit password sharing.' },
        { label: 'Internet-Only Negotiation', value: 'When canceling cable, negotiate internet-only pricing. Promotional internet rates: $30-50/mo for 12 months. Be prepared to switch ISPs every 12-24 months to maintain promo rates.' },
      ]
    }
  },
  description: 'Compare cable TV costs versus streaming services including internet. See how much you could save annually by cutting the cord, with detailed breakdowns of each cost component.',
  formula: 'Annual Savings = (Cable × 12) - ((StreamingServices × AvgCost + Internet) × 12) | Savings% = Savings / (Cable × 12) × 100',
  interpretation: 'Average cable bill: $120-180/month. Streaming bundle (3-4 services + internet): $80-110/month. Annual savings: $240-960/year. Add an HD antenna for local channels and sports. Rotate streaming services monthly for maximum variety without maximum cost.'
}

export default calcDef
