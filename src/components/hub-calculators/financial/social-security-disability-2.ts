import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ age: z.string().min(1, 'Required').refine(v => parseInt(v) >= 18 && parseInt(v) <= 67, '18-67'), aime: z.string().min(1, 'Required').refine(v => parseFloat(v) >= 0, '>=0'), workCredits: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 40, '0-40'), dependents: z.string().min(1, 'Required').refine(v => parseInt(v) >= 0 && parseInt(v) <= 10, '0-10') }),
  fields: [{ name: 'age', label: 'Current Age', type: 'number', min: 18, max: 67, step: '1' }, { name: 'aime', label: 'Average Indexed Monthly Earnings ($)', type: 'number', min: 0, step: '100' }, { name: 'workCredits', label: 'Work Credits Earned', type: 'number', min: 0, max: 40, step: '1' }, { name: 'dependents', label: 'Number of Dependents', type: 'number', min: 0, max: 10, step: '1' }],
  defaults: { age: '40', aime: '4500', workCredits: '40', dependents: '1' },
  presets: [
    { label: 'Mid-Career Professional', values: { age: '45', aime: '5500', workCredits: '40', dependents: '2' } },
    { label: 'Young Worker (insufficient credits)', values: { age: '28', aime: '3500', workCredits: '18', dependents: '0' } },
    { label: 'High Earner with Family', values: { age: '50', aime: '8500', workCredits: '40', dependents: '3' } },
    { label: 'Low Earner, Single', values: { age: '55', aime: '2000', workCredits: '40', dependents: '0' } },
    { label: 'Widow with Children', values: { age: '38', aime: '4000', workCredits: '40', dependents: '2' } },
  ],
  compute: (v) => { const aime = parseFloat(v.aime) || 0; const credits = parseInt(v.workCredits) || 0; const deps = parseInt(v.dependents) || 0; const eligible = credits >= 40; let pia = 0; if (aime <= 1174) pia = aime * 0.9; else if (aime <= 7078) pia = 1174 * 0.9 + (aime - 1174) * 0.32; else pia = 1174 * 0.9 + (7078 - 1174) * 0.32 + (aime - 7078) * 0.15; const famBenefit = Math.min(pia * (1 + deps * 0.5), pia * 1.8); return { result: eligible ? famBenefit : 0, label: eligible ? 'Est. Monthly SSDI Benefit' : 'Not Eligible', unit: '$', steps: [{ label: 'Work credits earned (40 needed for eligibility)', value: `${credits}/40` }, { label: 'Primary Insurance Amount (PIA) based on AIME', value: `$${pia.toFixed(2)}` }, { label: 'Monthly family benefit (with dependents)', value: eligible ? `$${famBenefit.toFixed(2)}` : 'Insufficient credits — continue working' }, { label: 'Eligibility status', value: eligible ? 'Eligible for SSDI' : 'Not eligible (need 40 credits)' }] ,
    extras: [
      { label: 'Strategy Note', value: 'SSDI eligibility requires 40 work credits (about 10 years of work). If you\'re close, consider working additional years. Your benefit is based on your highest 35 years of earnings.' },
      { label: 'Tax Consideration', value: 'SSDI benefits may be taxable if combined income exceeds $25k (single) or $32k (married filing jointly). Up to 85% of benefits can be taxable.' },
      { label: 'Risk Note', value: 'There is a 5-month waiting period after disability onset before SSDI payments begin. Approval rates vary: ~35% at initial application, improving to ~60% with appeal.' },
      { label: 'Comparison', value: 'Vs. SSI: SSDI is based on work history; SSI is needs-based. Vs. private disability insurance: SSDI has stricter medical criteria but provides inflation-adjusted lifetime benefits.' },
      { label: 'Real-World Example', value: 'A 45-year-old with AIME of $5,500 and 2 dependents receives ~$2,895/mo family benefit. Over 20 years until Medicare: ~$695k in total benefits.' },
    ]} },
  description: 'Social Security Disability Insurance (SSDI) provides monthly benefits to disabled workers who have earned sufficient work credits. The benefit amount is based on your Average Indexed Monthly Earnings (AIME).',
  formula: 'PIA = 90% of first $1,174 AIME + 32% of AIME $1,174-$7,078 + 15% above $7,078 | Family max = 150-180% of PIA',
  interpretation: 'SSDI eligibility requires 40 work credits (typically 10 years of work). The family maximum limits total benefits to 150-180% of the primary insurance amount.'
}

export default calcDef
