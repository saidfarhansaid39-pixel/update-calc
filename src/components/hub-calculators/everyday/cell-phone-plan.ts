import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyPlan: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), lines: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), devicePayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), insurance: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), dataPerLine: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), taxesFeesPct: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyPlan', label: 'Plan Cost per Line ($)', type: 'number', min: 10, step: '10' },
    { name: 'lines', label: 'Number of Lines', type: 'number', min: 1, step: '1' },
    { name: 'devicePayment', label: 'Device Payment per Line ($)', type: 'number', min: 0, step: '10' },
    { name: 'insurance', label: 'Insurance per Line ($)', type: 'number', min: 0, step: '5' },
    { name: 'dataPerLine', label: 'Data per Line (GB)', type: 'number', min: 0, step: '5' },
    { name: 'taxesFeesPct', label: 'Taxes & Fees (%)', type: 'number', min: 0, max: 30, step: '2' },
  ],
  defaults: { monthlyPlan: '50', lines: '2', devicePayment: '25', insurance: '10', dataPerLine: '20', taxesFeesPct: '12' },
  presets: [
    { label: 'Single Unlimited', values: { monthlyPlan: '70', lines: '1', devicePayment: '30', insurance: '12', dataPerLine: '50', taxesFeesPct: '15' } },
    { label: 'Family of 4 Saving', values: { monthlyPlan: '35', lines: '4', devicePayment: '20', insurance: '8', dataPerLine: '15', taxesFeesPct: '10' } },
    { label: 'MVNO Budget Plan', values: { monthlyPlan: '25', lines: '2', devicePayment: '0', insurance: '0', dataPerLine: '10', taxesFeesPct: '5' } },
    { label: 'Premium Business', values: { monthlyPlan: '85', lines: '3', devicePayment: '45', insurance: '15', dataPerLine: '100', taxesFeesPct: '18' } },
  ],
  compute: (v) => {
    const planTotal = v.monthlyPlan * v.lines
    const deviceTotal = v.devicePayment * v.lines
    const insuranceTotal = v.insurance * v.lines
    const subtotal = planTotal + deviceTotal + insuranceTotal
    const taxesFees = subtotal * (v.taxesFeesPct / 100)
    const monthlyTotal = subtotal + taxesFees
    const annualTotal = monthlyTotal * 12
    const costPerLine = monthlyTotal / v.lines
    const totalData = v.dataPerLine * v.lines
    const costPerGB = monthlyTotal / (totalData || 1)
    const planShare = (planTotal / monthlyTotal) * 100
    return { result: monthlyTotal, label: 'Monthly Phone Bill', unit: '$', steps: [
      { label: 'Plan Charges', value: `$${v.monthlyPlan.toFixed(0)}/line × ${v.lines} lines = $${planTotal.toFixed(2)}` },
      { label: 'Device Payments', value: `$${v.devicePayment.toFixed(0)}/line × ${v.lines} = $${deviceTotal.toFixed(2)}` },
      { label: 'Insurance', value: `$${v.insurance.toFixed(0)}/line × ${v.lines} = $${insuranceTotal.toFixed(2)}` },
      { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
      { label: `Taxes & Fees (${v.taxesFeesPct}%)`, value: `+$${taxesFees.toFixed(2)} (${v.taxesFeesPct}% of $${subtotal.toFixed(2)})` },
      { label: 'Monthly Total', value: `$${monthlyTotal.toFixed(2)} ($${costPerLine.toFixed(2)}/line)` },
      { label: 'Annual Total', value: `$${annualTotal.toFixed(2)}` },
      { label: 'Cost per GB', value: `$${costPerGB.toFixed(2)}/GB across ${totalData} GB` },
    ] ,
    extras: [
      { label: 'Per-Line Economics', value: `Each of your ${v.lines} line${v.lines > 1 ? 's' : ''} costs $${costPerLine.toFixed(2)}/mo. Adding a line to a family plan typically costs $15-30/mo extra — far less than a $50-70/mo individual plan. A 4-line plan often costs just $25-35/line.` },
      { label: 'Data Usage Reality Check', value: `You have ${totalData} GB across your lines. Average US smartphone data use is 12-15 GB/month. If you use under ${(totalData * 0.5).toFixed(0)} GB, consider a tiered data plan saving $15-25/mo over unlimited. At ${(totalData / v.lines).toFixed(0)} GB/line, you could likely drop to a 15 GB tier.` },
      { label: 'Insurance: Worth It?', value: `At $${v.insurance.toFixed(0)}/line/mo ($$${((v.insurance * v.lines) * 12).toFixed(0)}/yr for ${v.lines} lines), insurance pays out for 1 in 6 claims/year. A self-insurance strategy: put that $${(v.insurance * v.lines).toFixed(0)}/mo in a savings account. In 12 months you will have $${((v.insurance * v.lines) * 12).toFixed(0)} — enough to cover most phone repairs or a replacement.` },
      { label: 'Taxes & Fees Breakdown', value: `Taxes and fees add ${v.taxesFeesPct}% ($${taxesFees.toFixed(2)}/mo) to your bill. This includes: Federal Universal Service Fund (~10%), state/local 911 fees ($0.50-3.00/line), state telecom taxes (3-8%), and administrative fees. These vary wildly by city — from 5% in Oregon to 25%+ in Chicago.` },
      { label: 'Device Payment Trap', value: `At $${v.devicePayment.toFixed(0)}/line for ${v.lines} lines, you're paying $${deviceTotal.toFixed(0)}/mo for phones. Over 24 months that's $${(deviceTotal * 24).toFixed(0)}. Carriers often hide that this doesn't include interest if you switch — but the 0% APR financing is genuine. However, it locks you in: leaving early means paying off the remaining balance at once.` },
      { label: 'MVNO vs Postpaid Math', value: `Your current bill is $${monthlyTotal.toFixed(2)}/mo. An MVNO like Mint, Visible, or US Mobile offers similar service for $15-30/line. For ${v.lines} lines, that's $${(v.lines * 25).toFixed(0)}/mo vs $${monthlyTotal.toFixed(0)}/mo — saving $${(monthlyTotal - v.lines * 25).toFixed(0)}/mo = $${((monthlyTotal - v.lines * 25) * 12).toFixed(0)}/yr. MVNOs use the same towers; deprioritization is only noticeable in congested areas.` },
      { label: 'Plan Cost Share Analysis', value: `Your plan accounts for ${planShare.toFixed(0)}% of your total bill. Device payments add ${(deviceTotal / monthlyTotal * 100).toFixed(0)}%, and insurance adds ${(insuranceTotal / monthlyTotal * 100).toFixed(0)}%. If you own your phones outright (no device payment), your bill drops by $${deviceTotal.toFixed(2)}/mo (${(deviceTotal / monthlyTotal * 100).toFixed(0)}%).` },
      { label: 'Annual True Cost', value: `Your annual phone bill of $${annualTotal.toFixed(2)} is equivalent to: ${(annualTotal / 2000).toFixed(1)} work days after tax, ${(annualTotal / 150).toFixed(1)} restaurant dinners, or ${(annualTotal / 5).toFixed(0)} cups of coffee. A $50/mo reduction frees up $600/year — enough for a vacation flights or a full year of streaming subscriptions.` },
    ]}
  },
  description: 'Calculate your total monthly and annual cell phone bill including plan costs, device payments, insurance, taxes, and fees for multiple lines. Break down per-line cost, per-GB cost, and compare against budget-friendly MVNO alternatives.',
  formula: 'Monthly Total = [(Plan + Device + Insurance) × Lines] × (1 + Taxes%). Cost per Line = Total ÷ Lines. Cost per GB = Total ÷ (Data × Lines).',
  interpretation: 'Family plans save $15-25/line vs individual plans. Device payments add $20-45/line/month. Insurance costs $7-17/line but self-insuring saves most users money. Taxes add 10-25% depending on location. MVNOs (Mint, Visible, US Mobile) on the same networks cost $15-30/line vs $50-85 for major carriers. A 2-line family switching saves $500-1,200/year with no network difference for most users.'
}

export default calcDef
