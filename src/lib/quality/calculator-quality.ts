export interface QualityInfo {
  formulaSource: string
  accuracy: 'high' | 'medium' | 'standard'
  sourceUrl?: string
  referenceLabel?: string
}

export interface InputRange {
  min: number
  max: number
  label: string
  unit?: string
  hint?: string
}

export interface CalculatorQualityInfo {
  quality: QualityInfo
  inputRanges?: Record<string, InputRange>
}

const qualityMap: Record<string, CalculatorQualityInfo> = {
  // Financial
  'mortgage-calculator': {
    quality: { formulaSource: 'Standard amortization formula (APR-based)', accuracy: 'high', sourceUrl: 'https://www.consumerfinance.gov', referenceLabel: 'CFPB' },
    inputRanges: {
      loanAmount: { min: 1000, max: 100_000_000, label: 'Loan Amount', unit: '$', hint: 'Typical mortgage: $100k–$1M' },
      interestRate: { min: 0.1, max: 30, label: 'Interest Rate', unit: '%', hint: 'Typical: 2%–8%' },
      loanTerm: { min: 1, max: 40, label: 'Loan Term', unit: 'years', hint: 'Common: 15 or 30 years' },
    },
  },
  'loan-calculator': {
    quality: { formulaSource: 'Standard amortization formula', accuracy: 'high' },
    inputRanges: {
      loanAmount: { min: 100, max: 10_000_000, label: 'Loan Amount', unit: '$' },
      interestRate: { min: 0.1, max: 36, label: 'Interest Rate', unit: '%', hint: 'Personal loans: 5%–36%' },
      loanTerm: { min: 1, max: 30, label: 'Loan Term', unit: 'years' },
    },
  },
  'compound-interest-calculator': {
    quality: { formulaSource: 'A = P(1 + r/n)^(nt)', accuracy: 'high', sourceUrl: 'https://www.investor.gov', referenceLabel: 'SEC' },
    inputRanges: {
      principal: { min: 1, max: 100_000_000, label: 'Principal', unit: '$' },
      rate: { min: 0.01, max: 100, label: 'Annual Rate', unit: '%', hint: 'Typical: 1%–15%' },
      years: { min: 1, max: 100, label: 'Time', unit: 'years' },
    },
  },
  'investment-calculator': {
    quality: { formulaSource: 'Future value of periodic payments', accuracy: 'standard' },
    inputRanges: {
      monthlyContribution: { min: 0, max: 1_000_000, label: 'Monthly Contribution', unit: '$' },
      annualReturn: { min: 0.1, max: 30, label: 'Annual Return', unit: '%', hint: 'Historical S&P 500: ~10%' },
      years: { min: 1, max: 60, label: 'Investment Period', unit: 'years' },
    },
  },
  'retirement-calculator': {
    quality: { formulaSource: 'Monte Carlo simulation + FV formula', accuracy: 'standard' },
    inputRanges: {
      currentAge: { min: 18, max: 90, label: 'Current Age', unit: 'years' },
      retirementAge: { min: 30, max: 100, label: 'Retirement Age', unit: 'years' },
      monthlySavings: { min: 0, max: 500_000, label: 'Monthly Savings', unit: '$' },
    },
  },

  // Health
  'bmi-calculator': {
    quality: { formulaSource: 'BMI = weight(kg) / height(m)² (WHO standard)', accuracy: 'high', sourceUrl: 'https://www.who.int', referenceLabel: 'WHO' },
    inputRanges: {
      weight: { min: 10, max: 500, label: 'Weight', unit: 'kg', hint: 'Typical adult: 45–150 kg' },
      height: { min: 50, max: 280, label: 'Height', unit: 'cm', hint: 'Typical adult: 140–220 cm' },
    },
  },
  'calorie-calculator': {
    quality: { formulaSource: 'Mifflin-St Jeor equation (1990)', accuracy: 'medium', sourceUrl: 'https://medlineplus.gov', referenceLabel: 'NIH' },
    inputRanges: {
      age: { min: 2, max: 120, label: 'Age', unit: 'years' },
      weight: { min: 10, max: 500, label: 'Weight', unit: 'kg' },
      height: { min: 50, max: 280, label: 'Height', unit: 'cm' },
    },
  },
  'bmr-calculator': {
    quality: { formulaSource: 'Mifflin-St Jeor equation', accuracy: 'medium', referenceLabel: 'NIH' },
    inputRanges: {
      age: { min: 2, max: 120, label: 'Age', unit: 'years' },
      weight: { min: 10, max: 500, label: 'Weight', unit: 'kg' },
      height: { min: 50, max: 280, label: 'Height', unit: 'cm' },
    },
  },
  'body-fat-calculator': {
    quality: { formulaSource: 'US Navy circumference method', accuracy: 'medium', sourceUrl: 'https://www.defense.gov', referenceLabel: 'DoD' },
  },
  'target-heart-rate-calculator': {
    quality: { formulaSource: 'Karvonen formula (HRR method)', accuracy: 'medium' },
    inputRanges: {
      age: { min: 10, max: 120, label: 'Age', unit: 'years' },
      restingHR: { min: 30, max: 120, label: 'Resting HR', unit: 'bpm', hint: 'Typical: 60–100 bpm' },
    },
  },

  // Math
  'pythagorean-calculator': {
    quality: { formulaSource: 'a² + b² = c² (Euclidean geometry)', accuracy: 'high' },
  },

  // Construction
  'concrete-calculator': {
    quality: { formulaSource: 'Volume = L × W × D', accuracy: 'high' },
  },

  // Engineering
  'voltage-drop-calculator': {
    quality: { formulaSource: 'Vd = 2 × L × I × R / 1000 (NEC standards)', accuracy: 'high', sourceUrl: 'https://www.nfpa.org', referenceLabel: 'NEC' },
    inputRanges: {
      voltage: { min: 1, max: 600_000, label: 'Voltage', unit: 'V' },
      current: { min: 0.1, max: 10_000, label: 'Current', unit: 'A' },
      length: { min: 1, max: 100_000, label: 'Length', unit: 'ft' },
    },
  },

  // Default ranges per category
}

export function getQualityInfo(slug: string, category?: string): QualityInfo {
  const entry = qualityMap[slug]
  if (entry) return entry.quality
  return {
    formulaSource: category === 'financial' ? 'Standard financial formula' :
      category === 'health' ? 'Medical reference formula' :
      category === 'math' ? 'Mathematical formula' :
      category === 'conversion' ? 'Unit conversion ratio' :
      category === 'construction' ? 'Construction standard formula' :
      category === 'engineering' ? 'Engineering standard formula' :
      category === 'physics' ? 'Physics formula' :
      category === 'chemistry' ? 'Chemistry formula' :
      category === 'statistics' ? 'Statistical formula' :
      category === 'education' ? 'Education standard formula' :
      'Industry-standard formula',
    accuracy: 'standard',
  }
}

export function getInputRanges(slug: string): Record<string, InputRange> | undefined {
  return qualityMap[slug]?.inputRanges
}
