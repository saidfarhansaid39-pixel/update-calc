import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ membershipFee: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), contractMonths: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), initiationFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), cancellationFee: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'membershipFee', label: 'Monthly Fee ($)', type: 'number', min: 1, step: '10' },
    { name: 'contractMonths', label: 'Contract Length (months)', type: 'number', min: 1, step: '1' },
    { name: 'initiationFee', label: 'Initiation Fee ($)', type: 'number', min: 0, step: '50' },
    { name: 'cancellationFee', label: 'Cancellation Fee ($)', type: 'number', min: 0, step: '25' },
  ],
  defaults: { membershipFee: '30', contractMonths: '12', initiationFee: '0', cancellationFee: '50' },
  presets: [
    { label: 'No-Commitment Month-to-Month', values: { membershipFee: '40', contractMonths: '12', initiationFee: '0', cancellationFee: '0' } },
    { label: 'Annual Contract with Initiation', values: { membershipFee: '25', contractMonths: '12', initiationFee: '99', cancellationFee: '75' } },
    { label: 'Premium 2-Year Lock', values: { membershipFee: '30', contractMonths: '24', initiationFee: '199', cancellationFee: '150' } },
    { label: '6-Month Trial', values: { membershipFee: '35', contractMonths: '6', initiationFee: '49', cancellationFee: '25' } },
  ],
  compute: (v) => {
    const totalPayments = v.membershipFee * v.contractMonths
    const totalCost = totalPayments + v.initiationFee
    const effectiveMonthly = totalCost / v.contractMonths
    const costWithCancel = totalCost + v.cancellationFee
    const costPerYearIfRenew = totalCost / v.contractMonths * 12 / 12
    const monthlyDiff = effectiveMonthly - v.membershipFee
    const pctHidden = ((effectiveMonthly - v.membershipFee) / v.membershipFee) * 100
    const costPerVisit4x = effectiveMonthly / 17
    const annualTotal = totalCost / v.contractMonths * 12
    return { result: totalCost, label: 'Total Contract Cost', unit: '$', steps: [{ label: 'Monthly Fee', value: `$${v.membershipFee.toFixed(2)}` }, { label: 'Contract Length', value: `${v.contractMonths} months` }, { label: 'Total Monthly Payments', value: `$${v.membershipFee.toFixed(2)} × ${v.contractMonths} = $${totalPayments.toFixed(2)}` }, { label: 'Initiation Fee', value: `+$${v.initiationFee.toFixed(2)}` }, { label: 'Total Contract Cost', value: `$${totalCost.toFixed(2)}` }, { label: 'Effective Monthly Rate', value: `$${effectiveMonthly.toFixed(2)} (advertised: $${v.membershipFee.toFixed(2)})` }, { label: 'With Cancellation Fee', value: `$${costWithCancel.toFixed(2)}` }, { label: 'Cost/Visit (4×/wk)', value: `$${costPerVisit4x.toFixed(2)}` }] ,
    extras: [
      { label: 'Advertised vs Effective Monthly Rate Gap', value: `Advertised: $${v.membershipFee.toFixed(2)}/mo. Effective (over ${v.contractMonths} mo): $${effectiveMonthly.toFixed(2)}/mo. Difference: $${monthlyDiff.toFixed(2)}/mo = ${pctHidden.toFixed(0)}% above advertised. The initiation fee is the culprit: $${v.initiationFee.toFixed(0)} spread over ${v.contractMonths} months adds $${(v.initiationFee / v.contractMonths).toFixed(2)}/mo. Negotiate the initiation fee — 40-60% of gyms will waive it if you ask.` },
      { label: 'Contract Length Tradeoffs', value: `${v.contractMonths}-month contract: $${effectiveMonthly.toFixed(2)}/mo effective. Compare to month-to-month: typically 1.5-2× the contract rate. If available, month-to-month at $${(v.membershipFee * 1.5).toFixed(0)}/mo would cost $${(v.membershipFee * 1.5 * v.contractMonths).toFixed(0)} over ${v.contractMonths} months vs $${totalCost.toFixed(0)} for contract. ${v.contractMonths >= 18 ? 'Long contract (18-24 mo) locks rate but you\'re committed. Gym closures happen ~3% of the time — ensure your contract has a "no-equity" clause if gym closes.' : v.contractMonths >= 12 ? 'Standard annual contracts are fine for committed gym-goers.' : 'Short contracts give flexibility but usually higher monthly rates.'}` },
      { label: 'Cancellation Fee Risk Assessment', value: `Cancellation fee: $${v.cancellationFee.toFixed(0)}. ${v.cancellationFee > 0 ? 'If you need to cancel, total cost = $' + costWithCancel.toFixed(0) + ' (+$' + v.cancellationFee.toFixed(0) + ' penalty). Average gym-goer cancels within 8 months (40% quit by Jan). Your total with cancel at month 8: $${(v.membershipFee * Math.min(v.contractMonths, 8) + v.initiationFee + v.cancellationFee).toFixed(0)}.' : 'No cancellation fee — low-risk contract. You can walk away at any time without penalty. This is the best contract type for flexibility.'} Check terms: some gyms require 30-day written notice even after the contract ends (auto-renew trap). Read the fine print before signing.` },
      { label: 'Initiation Fee Negotiation', value: `$${v.initiationFee.toFixed(0)} initiation fee. Industry avg: $0-200. Most gyms have discretion to waive 40-60% of the time if you ask. Timing: end of month (salespeople want to hit quotas). Tell them: "I'll sign today if you waive the initiation fee." Success saves $${v.initiationFee.toFixed(0)}. Also ask about: free months (e.g., "sign up in December, get January free"), discounted annual payments (offer to pay $${(totalCost * 0.9 / v.contractMonths * 12).toFixed(0)} upfront vs monthly).` },
      { label: 'Cost Per Visit at Different Frequencies', value: `Cost/visit at 4×/week (17/mo): $${(effectiveMonthly / 17).toFixed(2)}. At 3×/week (13/mo): $${(effectiveMonthly / 13).toFixed(2)}. At 2×/week (9/mo): $${(effectiveMonthly / 9).toFixed(2)}. At 1×/week (4/mo): $${(effectiveMonthly / 4).toFixed(2)}. Break-even vs $15 drop-in rate: need ${Math.ceil(effectiveMonthly / 15)} visits/mo. Your effective $${effectiveMonthly.toFixed(2)}/mo: break-even at ${Math.ceil(effectiveMonthly / 15)} visits. Most people average ${v.contractMonths <= 3 ? '8-10 visits/mo initially, dropping to 4-6 after 3 months' : '8-10 visits/mo first 3 months, then ~6-8 after'}.` },
      { label: 'Right of Rescission & Cooling-Off Period', value: `FTC: you have 3 days to cancel MOST gym contracts (door-to-door sales, certain financing). Not all gyms are covered — check if your state has a specific gym cooling-off law (CA, NY, others: 3-7 days). To cancel: send CERTIFIED mail within 3 days (keep receipt). If denied: file complaint with FTC and state AG. $${v.cancellationFee > 0 ? 'Your $' + v.cancellationFee.toFixed(0) + ' cancellation fee may be illegal during the rescission period.' : 'No cancellation fee within rescission period (standard).'} Always ask for written cancellation terms before signing.` },
      { label: 'Auto-Renewal & Hidden Clause Warning', value: `Many gym contracts auto-renew at a higher month-to-month rate after the initial ${v.contractMonths}-month term. After ${v.contractMonths} months: $${v.membershipFee.toFixed(2)} → potentially $${(v.membershipFee * 1.5).toFixed(2)}/mo month-to-month. $${(v.membershipFee * 0.5).toFixed(2)}/mo increase = $${(v.membershipFee * 0.5 * 6).toFixed(0)} extra over 6 months. Cancel via certified mail 30-60 days before contract end. Some require in-person cancellation (intentionally hard). Check state laws: some require email/online cancellation options.` },
      { label: 'Total Annual Health-Wellness Budget', value: `Your effective $${effectiveMonthly.toFixed(2)}/mo = $${(effectiveMonthly * 12).toFixed(0)}/yr. Compare: personal training: $50-100/session. Class packages: $15-30/class. Health insurance discount: some plans reimburse 50-100% of gym fees (up to $200-500/yr) through fitness reimbursement programs. Check your insurance: you might get $${(200).toFixed(0)}-${(500).toFixed(0)} back annually. Also check: does your employer offer gym discounts? 60% of large companies offer corporate gym rates (saving 20-50%).` },
    ]}
  },
  description: 'Evaluate total gym membership contract cost including monthly fees, initiation/ joining fees, cancellation penalties, and auto-renewal traps. Compare advertised vs effective monthly rates, analyze cost per visit, and learn negotiation strategies for initiation fees and contract terms.',
  formula: 'Total Contract Cost = (Monthly Fee × Contract Months) + Initiation Fee | Effective Monthly = Total ÷ Months | Cost with Cancel = Total + Cancellation Fee | Hidden Cost % = ((Effective − Advertised) ÷ Advertised) × 100 | Cost/Visit = Effective Monthly ÷ Visits per Month',
  interpretation: 'Your effective monthly rate is always higher than advertised due to initiation fees spread over the contract term. Avoid long-term contracts if possible — 40% of members quit within 8 months. The $40-150 cancellation fee often makes quitting expensive. Negotiate the initiation fee (40-60% will waive it). Watch for auto-renewal clauses that bump rates 50%+ after the initial term. Use the 3-day rescission right to cancel without penalty if you change your mind. Month-to-month costs more but offers flexibility worth the premium.'
}

export default calcDef
