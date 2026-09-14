import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ monthlyIncome: z.string().min(1).refine(v => parseFloat(v) > 0, '>0'), mortgage: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), carLoan: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), studentLoan: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), creditCard: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), otherDebt: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'monthlyIncome', label: 'Gross Monthly Income ($)', type: 'number', min: 500, step: '500' },
    { name: 'mortgage', label: 'Mortgage/Rent ($/mo)', type: 'number', min: 0, step: '100' },
    { name: 'carLoan', label: 'Car Loan ($/mo)', type: 'number', min: 0, step: '50' },
    { name: 'studentLoan', label: 'Student Loans ($/mo)', type: 'number', min: 0, step: '50' },
    { name: 'creditCard', label: 'Credit Card Payments ($/mo)', type: 'number', min: 0, step: '25' },
    { name: 'otherDebt', label: 'Other Debt ($/mo)', type: 'number', min: 0, step: '25' },
  ],
  defaults: { monthlyIncome: '6000', mortgage: '1500', carLoan: '350', studentLoan: '200', creditCard: '150', otherDebt: '100' },
  presets: [
    { label: 'First-Time Home Buyer', values: { monthlyIncome: '5500', mortgage: '1600', carLoan: '300', studentLoan: '250', creditCard: '100', otherDebt: '50' } },
    { label: 'Renter Building Credit', values: { monthlyIncome: '4200', mortgage: '1200', carLoan: '0', studentLoan: '180', creditCard: '200', otherDebt: '75' } },
    { label: 'Debt Consolidation Need', values: { monthlyIncome: '5000', mortgage: '1400', carLoan: '400', studentLoan: '300', creditCard: '500', otherDebt: '200' } },
    { label: 'Nearly Mortgage Ready', values: { monthlyIncome: '8000', mortgage: '1800', carLoan: '0', studentLoan: '0', creditCard: '100', otherDebt: '0' } },
  ],
  compute: (v) => {
    const totalDebt = v.mortgage + v.carLoan + v.studentLoan + v.creditCard + v.otherDebt
    const dti = (totalDebt / v.monthlyIncome) * 100
    const frontEnd = (v.mortgage / v.monthlyIncome) * 100
    const remainingIncome = v.monthlyIncome - totalDebt
    const dtiRating = dti <= 28 ? 'Excellent' : dti <= 36 ? 'Good' : dti <= 43 ? 'Acceptable' : dti <= 50 ? 'Caution' : 'Over-leveraged'
    const debtBreakdown = { housing: v.mortgage, auto: v.carLoan, education: v.studentLoan, credit: v.creditCard, other: v.otherDebt }
    const debtEntries = Object.entries(debtBreakdown) as [string, number][]
    const largestDebtCat = debtEntries.sort((a, b) => b[1] - a[1])[0][0]
    const largestDebtVal = debtEntries.sort((a, b) => b[1] - a[1])[0][1]
    return { result: dti, label: 'DTI Ratio', unit: '%', steps: [{ label: 'Gross Monthly Income', value: `$${v.monthlyIncome.toFixed(0)}` }, { label: 'Total Monthly Debt', value: `$${totalDebt.toFixed(0)}` }, { label: 'Remaining Income', value: `$${remainingIncome.toFixed(0)}/mo after debt` }, { label: 'Front-End (Housing)', value: `${frontEnd.toFixed(1)}% (target ≤28%)` }, { label: 'Back-End (Total)', value: `${dti.toFixed(1)}% (target ≤43%)` }, { label: 'DTI Rating', value: `${dtiRating}` }, { label: 'Largest Debt Category', value: `${largestDebtCat} at $${largestDebtVal.toFixed(0)}/mo` }] ,
    extras: [
      { label: "Mortgage Thresholds", value: "Conventional: ≤43% DTI. FHA: ≤43-50% with compensating factors. VA: no DTI cap but residual income test. USDA: ≤29/41% front/back." },
      { label: "Front-End Ratio", value: "Housing costs (PITI: principal, interest, taxes, insurance) should not exceed 28% of gross income. This is the first thing lenders check." },
      { label: "Quick DTI Fixes", value: "Pay off credit cards (highest rates, fastest to reduce monthly payment). Refinance auto loans to lower payments. Extend student loan term (but pay more interest)." },
      { label: "What Counts as Debt", value: "Lenders include: mortgage, rent, car loans, student loans, credit card minimums, child support, alimony, personal loans. Not included: utilities, phone, groceries, insurance." },
      { label: "Income for DTI", value: "Lenders use gross (pre-tax) monthly income from: salary, self-employment (2yr avg), bonuses/commission (2yr avg), alimony, rental income, investment income." },
      { label: "DTI vs Credit Score", value: "DTI is not on your credit report. Credit utilization (balances ÷ limits) is. DTI can be high while credit score is good—lenders look at both." },
      { label: "Student Loan Rules", value: "If student loans are in forbearance, lenders may use 0.5-1% of the balance as the imputed payment. On IBR plans, the actual payment is used." },
      { label: "Co-Signer DTI", value: "Co-signing a loan adds the full payment to YOUR DTI, even if the primary borrower makes every payment. This is why co-signing can block your own mortgage." },
    ]}
  },
  description: 'Calculate your debt-to-income ratio with both front-end (housing) and back-end (total debt) ratios. See how lenders evaluate your DTI for mortgage qualification and get a rating from Excellent to Over-leveraged with actionable improvement insights.',
  formula: 'Front-End DTI = Housing ÷ Gross Income × 100 | Back-End DTI = Total Debt ÷ Gross Income × 100',
  interpretation: 'The DTI ratio is the most important number a mortgage lender evaluates. Conventional loans require ≤43% back-end DTI (ideally ≤36%). FHA allows up to 43-50% with compensating factors. The front-end (housing) ratio must be ≤28% for nearly all loan programs. For financial health: DTI ≤28% is excellent, 28-36% is good, 36-43% is acceptable but limits borrowing, 43-50% is caution territory, and >50% signals over-leverage—more than half your income goes to debt before any living expenses.'
}

export default calcDef
