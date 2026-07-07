export function calculateSavings(initialDeposit: number, monthlyDeposit: number, annualRate: number, years: number): any {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  const total = initialDeposit + monthlyDeposit * months;
  const interest = total * Math.pow(1 + monthlyRate, months) - total;
  return { initialDeposit, monthlyDeposit, years, annualRate, total, interest, futureValue: total + interest };
}

export function calculateRetirement(currentAge: number, retirementAge: number, lifeExpectancy: number, savings: number, expectedReturn: number, monthlySpending: number): any {
  const yearsRetired = lifeExpectancy - retirementAge;
  const monthlyRate = expectedReturn / 100 / 12;
  const monthsRetired = yearsRetired * 12;
  const futureValue = savings * Math.pow(1 + monthlyRate, monthsRetired);
  const monthlyNeeded = monthlySpending;
  const totalMonthlyContributions = monthlySpending * monthsRetired;
  const finalBalance = futureValue - totalMonthlyContributions;
  return { yearsRetired, finalBalance, monthlyNeeded, totalMonthlyContributions, futureValue };
}

export function calculateInvestment(principal: number, monthlyContribution: number, rate: number, years: number): any {
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const monthlyCompounding = (1 + monthlyRate);
  const totalContributions = principal + (monthlyContribution * months);
  const futureValue = principal * Math.pow(monthlyCompounding, months) + monthlyContribution * ((Math.pow(monthlyCompounding, months) - 1) / monthlyRate);
  const totalInterest = futureValue - totalContributions;
  const yearlyBreakdown = [];
  let balance = principal;
  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + monthlyRate);
      balance = balance + monthlyContribution;
    }
    yearlyBreakdown.push({ year, value: balance, contributions: 0, interest: 0 });
  }
  return { futureValue, totalInterest, totalContributions, yearlyBreakdown };
}

export function calculateCompoundInterest(principal: number, rate: number, years: number): any {
  const final = principal * Math.pow(1 + rate / 100, years);
  const totalInterest = final - principal;
  return { futureValue: final, totalInterest };
}

export function calculateSimpleInterest(principal: number, rate: number, years: number): any {
  const interest = principal * years * (rate / 100);
  const final = principal + interest;
  return { amount: final, totalInterest: interest };
}
