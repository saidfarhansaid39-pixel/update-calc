export interface AmortizationRow {
  year?: number;
  month?: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterest: number;
  balance: number;
}

export function generateAmortizationSchedule(
  principalAmount: number,
  annualInterestRate: number, // e.g. 5 for 5%
  months: number,
  extraMonthlyPayment: number = 0
): AmortizationRow[] {
  const schedule: AmortizationRow[] = [];
  const monthlyRate = (annualInterestRate / 100) / 12;
  
  let pmt = 0;
  if (monthlyRate > 0) {
    pmt = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  } else {
    pmt = principalAmount / months;
  }

  let balance = principalAmount;
  let totalInterest = 0;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    let principal = pmt - interest + extraMonthlyPayment;
    
    if (balance - principal < 0) {
      principal = balance;
    }
    
    balance -= principal;
    totalInterest += interest;

    schedule.push({
      month: i,
      payment: principal + interest,
      principal,
      interest,
      totalInterest,
      balance: Math.max(0, balance)
    });

    if (balance <= 0) break;
  }

  return schedule;
}

export function aggregateAmortizationByYear(schedule: AmortizationRow[]): AmortizationRow[] {
  const yearly: AmortizationRow[] = [];
  let currentYear = 1;
  let yInterest = 0;
  let yPrincipal = 0;
  let yPayment = 0;
  
  for (let i = 0; i < schedule.length; i++) {
    const row = schedule[i];
    yInterest += row.interest;
    yPrincipal += row.principal;
    yPayment += row.payment;
    
    if ((i + 1) % 12 === 0 || i === schedule.length - 1) {
      yearly.push({
        year: currentYear,
        payment: yPayment,
        interest: yInterest,
        principal: yPrincipal,
        totalInterest: row.totalInterest,
        balance: row.balance
      });
      currentYear++;
      yInterest = 0;
      yPrincipal = 0;
      yPayment = 0;
    }
  }
  
  return yearly;
}
