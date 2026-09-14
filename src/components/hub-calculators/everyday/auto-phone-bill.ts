import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ apbPlanCost: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apbLines: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), apbPhonePayment: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apbDataUsed: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apbInsuranceMonthly: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), apbStreamingAddOns: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'apbPlanCost', label: 'Base Plan Cost per Line ($)', type: 'number', min: 10, step: '10' },
    { name: 'apbLines', label: 'Number of Lines', type: 'number', min: 1, step: '1' },
    { name: 'apbPhonePayment', label: 'Phone Payment per Line ($)', type: 'number', min: 0, step: '10' },
    { name: 'apbDataUsed', label: 'Data Used (GB/mo)', type: 'number', min: 0, step: '5' },
    { name: 'apbInsuranceMonthly', label: 'Insurance per Line ($)', type: 'number', min: 0, step: '5' },
    { name: 'apbStreamingAddOns', label: 'Streaming/Add-Ons Total ($)', type: 'number', min: 0, step: '5' },
  ],
  defaults: { apbPlanCost: '70', apbLines: '2', apbPhonePayment: '0', apbDataUsed: '20', apbInsuranceMonthly: '0', apbStreamingAddOns: '15' },
  presets: [
    { label: 'Family Plan (4 lines)', values: { apbPlanCost: '50', apbLines: '4', apbPhonePayment: '15', apbDataUsed: '60', apbInsuranceMonthly: '8', apbStreamingAddOns: '25' } },
    { label: 'Single Budget Line', values: { apbPlanCost: '25', apbLines: '1', apbPhonePayment: '0', apbDataUsed: '5', apbInsuranceMonthly: '0', apbStreamingAddOns: '0' } },
    { label: 'Premium Single Line', values: { apbPlanCost: '90', apbLines: '1', apbPhonePayment: '25', apbDataUsed: '40', apbInsuranceMonthly: '15', apbStreamingAddOns: '20' } },
    { label: 'Couple — Moderate', values: { apbPlanCost: '60', apbLines: '2', apbPhonePayment: '10', apbDataUsed: '30', apbInsuranceMonthly: '5', apbStreamingAddOns: '10' } },
  ],
  compute: (v) => {
    const lineCharges = v.apbPlanCost * v.apbLines
    const phonePayments = v.apbPhonePayment * v.apbLines
    const insurance = v.apbInsuranceMonthly * v.apbLines
    const dataOverage = Math.max(0, v.apbDataUsed - 50) * 10
    const taxesFees = (lineCharges + phonePayments + insurance) * 0.12
    const subtotal = lineCharges + phonePayments + insurance + dataOverage + v.apbStreamingAddOns
    const total = subtotal + taxesFees
    const perLine = total / v.apbLines
    const annualTotal = total * 12
    return { result: total, label: 'Total Monthly Phone Bill', unit: '$', steps: [
      { label: 'Plan Charges', value: `${v.apbLines} lines × $${v.apbPlanCost}/line = $${lineCharges.toFixed(2)}` },
      { label: 'Device Payments', value: `${v.apbLines} lines × $${v.apbPhonePayment}/line = $${phonePayments.toFixed(2)}` },
      { label: 'Insurance', value: `${v.apbLines} lines × $${v.apbInsuranceMonthly}/line = $${insurance.toFixed(2)}` },
      { label: 'Data Overage', value: `${Math.max(0, v.apbDataUsed - 50)} GB over × $10/GB = $${dataOverage.toFixed(2)}` },
      { label: 'Streaming & Add-Ons', value: `$${v.apbStreamingAddOns.toFixed(2)}` },
      { label: 'Subtotal', value: `$${lineCharges.toFixed(2)} + $${phonePayments.toFixed(2)} + $${insurance.toFixed(2)} + $${dataOverage.toFixed(2)} + $${v.apbStreamingAddOns.toFixed(2)} = $${subtotal.toFixed(2)}` },
      { label: 'Taxes & Fees (12%)', value: `$${subtotal.toFixed(2)} × 0.12 = $${taxesFees.toFixed(2)}` },
      { label: 'Total Monthly Bill', value: `$${subtotal.toFixed(2)} + $${taxesFees.toFixed(2)} = $${total.toFixed(2)}` },
      { label: 'Cost per Line', value: `$${total.toFixed(2)} ÷ ${v.apbLines} = $${perLine.toFixed(2)}` },
      { label: 'Annual Total', value: `$${total.toFixed(2)} × 12 = $${annualTotal.toFixed(2)}` },
    ] ,
    extras: [
      { label: "MVNO savings", value: "Switching to an MVNO (Mint Mobile, Visible, US Mobile) can cut your bill by 50–70%. Same networks (T-Mobile/Verizon/AT&T), prepaid only. Example: $25/line vs $70/line on postpaid." },
      { label: "Device financing vs buying outright", value: "Financing a $1,000 phone over 24 months = $41.67/mo. Buying outright and keeping it 3 years saves $500+ in interest and insurance. Trade-in deals ($800+ off) make upgrading cheaper than financing." },
      { label: "Data cap strategy", value: "Most unlimited plans throttle after 50 GB. If you use <10 GB/mo, a prepaid capped plan ($15–30) is cheaper than unlimited ($60–90). Streaming in 480p uses ~1.5 GB/hr vs 3 GB/hr for 1080p." },
      { label: "Family plan math", value: "Adding lines 2–4 usually costs $20–40 each on postpaid. A 4-line plan at $50/line = $200 total ($50/line). Four single plans at $70 each = $280. Family plans save 20–40%." },
      { label: "Insurance break-even", value: "Phone insurance ($8–17/line) is worth it for $1,000+ phones. Break-even: 1 claim every 2–3 years. For budget phones (<$300), self-insure: put $10/mo in a repair fund instead." },
      { label: "Streaming add-on creep", value: "Carrier add-ons (Netflix, HBO, Apple Music) seem cheap at $5–10 each but add $25–50/mo total. Check if you actually use them — many are available cheaper as standalone subscriptions." },
      { label: "Taxes & regulatory fees", value: "Taxes vary wildly by state: IL adds ~25%, OR/ID ~3%. Regulatory fees ($1–3/line) are carrier-imposed. Always ask for the 'out-the-door' monthly price including all surcharges." },
      { label: "Annual renewal leverage", value: "Call your carrier's retention department every 12 months. Ask for loyalty discounts, waived activation fees, or free perk upgrades. Average saving: $5–15/line/month for 15 minutes on the phone." },
    ]}
  },
  description: 'Break down your monthly phone bill — plan charges, device payments, insurance, data overages, and streaming add-ons — with taxes and fees calculated automatically. Shows per-line and annual totals.',
  formula: 'Total = ((Plan + PhonePayment + Insurance) × Lines + DataOverage + AddOns) × 1.12 | PerLine = Total ÷ Lines | Annual = Total × 12',
  interpretation: 'A 4-line family plan with financed phones runs ~$350–500/month ($87–125/line). Switching to an MVNO and bringing your own phones drops it to ~$100–160/month ($25–40/line). Data overage at $10/GB adds up fast — monitor usage in phone settings.'
}

export default calcDef
