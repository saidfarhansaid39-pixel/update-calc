export interface ExpertVariable {
  symbol: string
  meaning: string
  unit?: string
}

export interface ExpertWorkedExample {
  steps: string[]
  result: string
}

export interface ExpertContent {
  formula: string
  variables: ExpertVariable[]
  workedExample: ExpertWorkedExample
}

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string

export const expertData: Record<string, ExpertContent> = {
  'mortgage-calculator': {
    formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1]',
    variables: [
      { symbol: 'P', meaning: 'Principal loan amount', unit: 'currency' },
      { symbol: 'r', meaning: 'Monthly interest rate (annual rate ÷ 12)', unit: 'decimal' },
      { symbol: 'n', meaning: 'Total number of payments (years × 12)', unit: 'months' },
      { symbol: 'M', meaning: 'Monthly payment', unit: 'currency' },
    ],
    workedExample: {
      steps: [
        'Loan amount (P) = $300,000',
        'Annual rate = 6% → monthly rate (r) = 0.06 / 12 = 0.005',
        'Term = 30 years → n = 360 payments',
        '(1 + r)^n = (1.005)^360 ≈ 6.0226',
        'M = 300,000 × [0.005 × 6.0226] / [6.0226 − 1]',
        'M = 300,000 × 0.030113 / 5.0226 ≈ 1,798.65',
      ],
      result: '$1,798.65 per month',
    },
  },
  'loan-calculator': {
    formula: 'M = P × [r(1+r)^n] / [(1+r)^n - 1]',
    variables: [
      { symbol: 'P', meaning: 'Loan principal', unit: 'currency' },
      { symbol: 'r', meaning: 'Periodic interest rate', unit: 'decimal' },
      { symbol: 'n', meaning: 'Number of periods', unit: 'months' },
    ],
    workedExample: {
      steps: [
        'Loan (P) = $20,000, annual rate = 5%, term = 5 years',
        'Monthly rate (r) = 0.05 / 12 ≈ 0.004167',
        'n = 60 payments',
        '(1 + r)^n = (1.004167)^60 ≈ 1.2834',
        'M = 20,000 × [0.004167 × 1.2834] / [1.2834 − 1] ≈ 377.42',
      ],
      result: '$377.42 per month',
    },
  },
  'bmi-calculator': {
    formula: 'BMI = weight (kg) / height (m)²',
    variables: [
      { symbol: 'weight', meaning: 'Body mass in kilograms', unit: 'kg' },
      { symbol: 'height', meaning: 'Stature in meters', unit: 'm' },
    ],
    workedExample: {
      steps: [
        'Weight = 70 kg, Height = 1.75 m',
        'Height² = 1.75 × 1.75 = 3.0625',
        'BMI = 70 / 3.0625 ≈ 22.86',
      ],
      result: 'BMI = 22.9 (Normal weight)',
    },
  },
  'compound-interest-calculator': {
    formula: 'A = P × (1 + r/n)^(nt)',
    variables: [
      { symbol: 'P', meaning: 'Initial principal', unit: 'currency' },
      { symbol: 'r', meaning: 'Annual interest rate (decimal)', unit: 'decimal' },
      { symbol: 'n', meaning: 'Compounds per year', unit: 'times/year' },
      { symbol: 't', meaning: 'Time in years', unit: 'years' },
      { symbol: 'A', meaning: 'Final amount', unit: 'currency' },
    ],
    workedExample: {
      steps: [
        'P = $10,000, r = 7% (0.07), compounded monthly (n = 12), t = 10 years',
        'r/n = 0.07 / 12 ≈ 0.005833',
        'nt = 12 × 10 = 120',
        'A = 10,000 × (1.005833)^120 ≈ 10,000 × 2.0097 ≈ 20,096.61',
      ],
      result: '$20,096.61 (earned $10,096.61 in interest)',
    },
  },
  'standard-deviation-calculator': {
    formula: 'σ = √[Σ(xᵢ − μ)² / N]',
    variables: [
      { symbol: 'xᵢ', meaning: 'Each data point', unit: '—' },
      { symbol: 'μ', meaning: 'Population mean', unit: 'same as data' },
      { symbol: 'N', meaning: 'Number of data points', unit: 'count' },
    ],
    workedExample: {
      steps: [
        'Data: [4, 8, 6, 5, 3]',
        'Mean (μ) = (4+8+6+5+3) / 5 = 5.2',
        'Squared deviations: (4−5.2)²=1.44, (8−5.2)²=7.84, (6−5.2)²=0.64, (5−5.2)²=0.04, (3−5.2)²=4.84',
        'Sum = 14.8, Variance = 14.8 / 5 = 2.96',
        'σ = √2.96 ≈ 1.72',
      ],
      result: 'σ ≈ 1.72',
    },
  },
  'z-test-calculator': {
    formula: 'z = (x̄ − μ₀) / (σ / √n)',
    variables: [
      { symbol: 'x̄', meaning: 'Sample mean', unit: 'same as data' },
      { symbol: 'μ₀', meaning: 'Hypothesized population mean', unit: 'same as data' },
      { symbol: 'σ', meaning: 'Population standard deviation', unit: 'same as data' },
      { symbol: 'n', meaning: 'Sample size', unit: 'count' },
    ],
    workedExample: {
      steps: [
        'Sample mean (x̄) = 105, Population mean (μ₀) = 100, σ = 15, n = 36',
        'Standard error = σ / √n = 15 / 6 = 2.5',
        'z = (105 − 100) / 2.5 = 2.0',
      ],
      result: 'z = 2.0 (p ≈ 0.0456, significant at α = 0.05)',
    },
  },
  't-test-one-sample': {
    formula: 't = (x̄ − μ₀) / (s / √n)',
    variables: [
      { symbol: 'x̄', meaning: 'Sample mean', unit: 'same as data' },
      { symbol: 'μ₀', meaning: 'Hypothesized mean', unit: 'same as data' },
      { symbol: 's', meaning: 'Sample standard deviation', unit: 'same as data' },
      { symbol: 'n', meaning: 'Sample size', unit: 'count' },
    ],
    workedExample: {
      steps: [
        'x̄ = 52, μ₀ = 50, s = 4, n = 25',
        'Standard error = 4 / √25 = 0.8',
        't = (52 − 50) / 0.8 = 2.5',
        'df = 24, two-tailed p ≈ 0.0196',
      ],
      result: 't = 2.5, p ≈ 0.02 (significant at α = 0.05)',
    },
  },
  'simple-linear-regression': {
    formula: 'y = β₀ + β₁x',
    variables: [
      { symbol: 'β₁', meaning: 'Slope (change in y per unit x)', unit: 'y per x' },
      { symbol: 'β₀', meaning: 'Y-intercept', unit: 'y' },
      { symbol: 'x', meaning: 'Independent variable', unit: 'x' },
      { symbol: 'y', meaning: 'Predicted dependent variable', unit: 'y' },
    ],
    workedExample: {
      steps: [
        'Given data points, calculate: Σx, Σy, Σxy, Σx²',
        'β₁ = [nΣxy − ΣxΣy] / [nΣx² − (Σx)²]',
        'β₀ = ȳ − β₁x̄',
        'Example: β₁ = 2.3, β₀ = 4.1 → y = 4.1 + 2.3x',
      ],
      result: 'y = 4.1 + 2.3x',
    },
  },
  'percentage-calculator': {
    formula: 'Result = (P / 100) × X',
    variables: [
      { symbol: 'P', meaning: 'Percentage value', unit: '%' },
      { symbol: 'X', meaning: 'Base number', unit: 'any' },
    ],
    workedExample: {
      steps: [
        'Find 15% of 240',
        'Result = (15 / 100) × 240 = 0.15 × 240 = 36',
      ],
      result: '36',
    },
  },
}

export function getExpertContent(slug: string, t?: TranslateFn): ExpertContent | undefined {
  const base = expertData[slug]
  if (!base) return undefined
  if (!t) return base
  const p = `guide.expert.${slug}`
  return {
    ...base,
    workedExample: {
      steps: base.workedExample.steps.map((_, i) => t(`${p}.step.${i}`)),
      result: t(`${p}.result`),
    },
    variables: base.variables.map((v, i) => ({
      ...v,
      meaning: t(`${p}.variable.${i}`),
    })),
  }
}
