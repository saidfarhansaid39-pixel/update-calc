export interface MortgageInputs {
  homePrice: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
  startDateMonth: number; // 0-11
  startDateYear: number;
  includeTaxesAndCosts: boolean;
  propertyTaxPercent: number;
  homeInsuranceYearly: number;
  pmiPercent: number;
  hoaFeeMonthly: number;
  otherCostsYearly: number;
}

export interface MortgageResults {
  principalAmount: number;
  downPaymentAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  monthlyOtherCosts: number;
  totalMonthlyPayment: number;
  
  totalPrincipalAndInterest: number;
  totalPropertyTax: number;
  totalHomeInsurance: number;
  totalOtherCosts: number;
  totalOutOfPocket: number;
  
  totalInterestPaid: number;
  payoffDate: Date;
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const downPaymentAmount = inputs.homePrice * (inputs.downPaymentPercent / 100);
  const principalAmount = inputs.homePrice - downPaymentAmount;
  
  const monthlyInterestRate = (inputs.interestRate / 100) / 12;
  const numberOfPayments = inputs.loanTermYears * 12;
  
  // P&I
  let monthlyPI = 0;
  if (monthlyInterestRate === 0) {
    monthlyPI = principalAmount / numberOfPayments;
  } else {
    monthlyPI = principalAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  }
  
  // Other costs
  let monthlyPropertyTax = 0;
  let monthlyHomeInsurance = 0;
  let monthlyPMI = 0;
  let monthlyHOA = 0;
  let monthlyOtherCosts = 0;
  
  if (inputs.includeTaxesAndCosts) {
    monthlyPropertyTax = (inputs.homePrice * (inputs.propertyTaxPercent / 100)) / 12;
    monthlyHomeInsurance = inputs.homeInsuranceYearly / 12;
    // PMI usually applies to loan amount, simple approximation here
    monthlyPMI = (principalAmount * (inputs.pmiPercent / 100)) / 12;
    monthlyHOA = inputs.hoaFeeMonthly;
    monthlyOtherCosts = inputs.otherCostsYearly / 12;
  }
  
  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + monthlyHOA + monthlyOtherCosts;
  
  const totalPrincipalAndInterest = monthlyPI * numberOfPayments;
  const totalInterestPaid = totalPrincipalAndInterest - principalAmount;
  
  const totalPropertyTax = monthlyPropertyTax * numberOfPayments;
  const totalHomeInsurance = monthlyHomeInsurance * numberOfPayments;
  const totalOtherCosts = (monthlyHOA + monthlyOtherCosts + monthlyPMI) * numberOfPayments;
  const totalOutOfPocket = totalMonthlyPayment * numberOfPayments;
  
  const payoffDate = new Date(inputs.startDateYear, inputs.startDateMonth + numberOfPayments, 1);

  return {
    principalAmount,
    downPaymentAmount,
    monthlyPrincipalAndInterest: monthlyPI,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    monthlyPMI,
    monthlyHOA,
    monthlyOtherCosts,
    totalMonthlyPayment,
    totalPrincipalAndInterest,
    totalPropertyTax,
    totalHomeInsurance,
    totalOtherCosts,
    totalOutOfPocket,
    totalInterestPaid,
    payoffDate
  };
}
