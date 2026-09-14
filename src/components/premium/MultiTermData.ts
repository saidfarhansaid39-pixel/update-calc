interface TermComparison {
  term: number
  label: string
  monthlyPayment: number
  totalInterest: number
  totalCost: number
}

function calcMonthlyPayment(principal: number, annualRate: number, years: number): number {
  const mr = annualRate / 100 / 12
  const np = years * 12
  if (mr > 0 && np > 0 && principal > 0) {
    const f = Math.pow(1 + mr, np)
    return principal * (mr * f) / (f - 1)
  }
  if (np > 0 && principal > 0) return principal / np
  return 0
}

export function getMortgageTerms(principal: number, rate: number): TermComparison[] {
  const terms = [
    { term: 15, label: '15-Year' },
    { term: 20, label: '20-Year' },
    { term: 25, label: '25-Year' },
    { term: 30, label: '30-Year' },
  ]
  return terms.map(({ term, label }) => {
    const monthlyPayment = calcMonthlyPayment(principal, rate, term)
    const totalCost = monthlyPayment * term * 12
    const totalInterest = totalCost - principal
    return { term, label, monthlyPayment, totalInterest, totalCost }
  })
}

export function getLoanTerms(principal: number, rate: number): TermComparison[] {
  const terms = [
    { term: 3, label: '3-Year' },
    { term: 5, label: '5-Year' },
    { term: 7, label: '7-Year' },
    { term: 10, label: '10-Year' },
  ]
  return terms.map(({ term, label }) => {
    const monthlyPayment = calcMonthlyPayment(principal, rate, term)
    const totalCost = monthlyPayment * term * 12
    const totalInterest = totalCost - principal
    return { term, label, monthlyPayment, totalInterest, totalCost }
  })
}

export function getInvestmentTerms(initial: number, monthly: number, rate: number): TermComparison[] {
  const terms = [
    { term: 10, label: '10-Year' },
    { term: 20, label: '20-Year' },
    { term: 30, label: '30-Year' },
  ]
  return terms.map(({ term, label }) => {
    const mr = rate / 100 / 12
    const np = term * 12
    let futureValue = initial
    if (mr > 0) {
      futureValue = initial * Math.pow(1 + mr, np) + monthly * ((Math.pow(1 + mr, np) - 1) / mr)
    } else {
      futureValue = initial + monthly * np
    }
    const totalContributions = initial + monthly * np
    const totalGrowth = futureValue - totalContributions
    return { term, label, monthlyPayment: 0, totalInterest: totalGrowth, totalCost: futureValue }
  })
}
