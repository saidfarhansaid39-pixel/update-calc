import type { CalculatorEntry } from '@calcuniverse/calculator-registry'
import { getLocalizedCalculator } from '@/lib/localized-registry'

export interface GuideSection {
  id: string
  title: string
  content: string
}

export interface CalculatorGuide {
  sections: GuideSection[]
  readingTimeMinutes: number
  totalWords: number
}

function shortTitle(title: string): string {
  return title.replace(/\s+(Calculator|Converter|Tool|Checker)\s*$/i, '').trim()
}

function slugToTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

async function getRelated(calc: CalculatorEntry, limit: number = 5): Promise<CalculatorEntry[]> {
  const { calculatorRegistry } = await import('@calcuniverse/calculator-registry')
  return calculatorRegistry
    .filter(c => c.category === calc.category && c.slug !== calc.slug)
    .slice(0, limit)
}

const formulaSource: Record<string, string> = {
  'mortgage-calculator': 'M = P[r(1+r)^n] / [(1+r)^n - 1]',
  'loan-calculator': 'M = P × [r(1+r)^n] / [(1+r)^n - 1]',
  'bmi-calculator': 'BMI = weight(kg) / height(m)²',
  'calorie-calculator': 'TDEE = BMR × activity_factor',
  'compound-interest-calculator': 'A = P(1 + r/n)^(nt)',
  'percentage-calculator': 'P% of X = X × P/100',
  'tip-calculator': 'Tip = bill × tip% | Total = bill + tip',
  'gpa-calculator': 'GPA = Σ(grade_pts × credits) / Σ(credits)',
  'fraction-calculator': 'a/b ○ c/d = (ad ○ bc)/bd | Simplify = GCD(a,b)',
  'pythagorean-calculator': 'c² = a² + b²',
  'savings-calculator': 'A = P(1+r)^n',
  'retirement-calculator': 'Nest = PV(1+r)^n + PMT × [(1+r)^n - 1]/r',
  'investment-calculator': 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r',
  'salary-calculator': 'Annual = hourly × 2080 | Monthly = annual / 12',
  'debt-payoff-calculator': 'Months = NPER(rate, -payment, balance)',
  'amortization-calculator': 'Schedule: period, payment, principal, interest, balance',
  'auto-loan-calculator': 'M = (P - T) × [r(1+r)^n] / [(1+r)^n - 1]',
  'refinance-calculator': 'Savings = old_M - new_M | Breakeven = closing_costs / monthly_savings',
  'bmr-calculator': 'BMR = 10W + 6.25H - 5A + 5 (M) | 10W + 6.25H - 5A - 161 (F)',
  'tdee-calculator': 'TDEE = BMR × PAL',
  'body-fat-calculator': 'Fat% = (495 / body_density) - 450',
  'target-heart-rate-calculator': 'HRmax = 208 - 0.7×age | Zone = HRmax × %intensity',
  'due-date-calculator': 'EDD = LMP + 280 days',
  'ovulation-calculator': 'Ovulation = cycle_length - 14 days',
  'pace-calculator': 'Pace = time / distance',
  'standard-deviation-calculator': 'σ = √[Σ(xi - μ)²/N]',
  'ohms-law-calculator': 'V = IR | P = VI | R = V/I',
  'discount-calculator': 'Discount = price × rate% | Final = price - discount',
  'sales-tax-calculator': 'Tax = price × rate% | Total = price + tax',
  'vat-calculator': 'VAT = net × rate% | Gross = net × (1 + rate%)',
  'currency-calculator': 'Converted = amount × exchange_rate',
  'concrete-calculator': 'Volume = length × width × height | Yards = cubic_ft / 27',
  'fuel-cost-calculator': 'Cost = distance / mpg × price_per_gallon',
  'gas-mileage-calculator': 'MPG = miles / gallons',
  'calories-burned-calculator': 'Calories = MET × weight_kg × hours',
  'protein-calculator': 'Protein_g = weight_kg × factor',
  'water-intake-calculator': 'Water_liters = weight_kg × 0.033',
  'sleep-calculator': 'Wake = bed_time + 5 × 90min',
  'net-worth-calculator': 'Net_Worth = total_assets - total_liabilities',
  'budget-calculator': 'Surplus = income - Σ(expenses)',
  'future-value-calculator': 'FV = PV(1+r)^n + PMT × [(1+r)^n - 1]/r',
  'present-value-calculator': 'PV = FV / (1+r)^n',
  'roi-calculator': 'ROI = (gain - cost) / cost × 100',
  'margin-calculator': 'Margin = (revenue - cost) / revenue × 100',
  'markup-calculator': 'Selling_Price = cost × (1 + markup%)',
  'break-even-calculator': 'BEP = fixed_costs / (price - var_cost_per_unit)',
  'probability-calculator': 'P(E) = favorable / total',
  'circle-calculator': 'C = 2πr | A = πr²',
  'triangle-calculator': 'A = ½bh | Law of Cosines: c² = a² + b² - 2ab·cos(C)',
  'volume-calculator': 'Cube: s³ | Sphere: 4/3πr³ | Cylinder: πr²h',
  'area-calculator': 'Square: s² | Rectangle: l×w | Circle: πr² | Triangle: ½bh',
  'quadratic-formula-calculator': 'x = [-b ± √(b² - 4ac)] / 2a',
  'temperature-calculator': '°C = (°F - 32) × 5/9 | °F = °C × 9/5 + 32',
  'length-calculator': '1 in = 2.54 cm | 1 ft = 0.3048 m | 1 mi = 1.609 km',
  'weight-calculator': '1 kg = 2.20462 lbs | 1 oz = 28.3495 g',
  'age-calculator': 'Age = today - birth_date (years, months, days)',
  'date-calculator': 'Difference = date2 - date1 (days)',
  'time-calculator': 'Duration = end - start | Sum = time1 + time2',
  'gcf-calculator': 'GCF(a,b) = largest common factor | Euclidean algorithm',
  'lcm-calculator': 'LCM(a,b) = |a×b| / GCF(a,b)',
  'exponent-calculator': 'aⁿ = a × a × ... × a (n times)',
  'log-calculator': 'log_b(a) = x → bˣ = a | ln(x) = log_e(x)',
  'binary-calculator': 'Decimal → Binary: divide by 2 | Binary → Decimal: Σ(bit × 2ⁿ)',
  'z-score-calculator': 'z = (x - μ) / σ | Percentile = Φ(z) × 100',
  'confidence-interval-calculator': 'CI = x̄ ± z × σ/√n',
  'mean-median-mode-calculator': 'Mean = Σx/n | Median = mid sorted | Mode = most frequent',
  'combination-calculator': 'nCr = n! / (r! × (n-r)!)',
  'permutation-calculator': 'nPr = n! / (n-r)!',
  'factorial-calculator': 'n! = n × (n-1) × (n-2) × ... × 1',
  'modulo-calculator': 'a mod b = remainder of a/b',
  'square-root-calculator': '√x = y where y² = x',
  'random-number-generator': 'rand(min, max) = floor(min + (max-min+1) × U(0,1))',
  'password-generator': 'charset = [a-z, A-Z, 0-9, symbols] | length = N',
  'mortgage-payoff-calculator': 'Payoff = P(1+r)^m - PMT × [(1+r)^m - 1]/r',
  'rent-vs-buy-calculator': 'Buy: M + tax + insurance + maint | Rent: rent × months + invest_diff',
  'income-tax-calculator': 'Tax = bracket_rates × income_segments',
  'student-loan-calculator': 'M = P × [r(1+r)^n] / [(1+r)^n - 1] | IDR = income × rate%',
  'credit-card-payoff-calculator': 'Payoff = Σ(min_payments) + interest | Avalanche = highest_rate first',
  'home-affordability-calculator': 'Afford = income × DTI_limit | Max_PITI = afford × front_end%',
  'personal-loan-calculator': 'M = P × [r(1+r)^n] / [(1+r)^n - 1]',
  'fha-loan-calculator': 'M = (P - D) × [r(1+r)^n] / [(1+r)^n - 1] + MIP',
  'va-loan-calculator': 'M = P × [r(1+r)^n] / [(1+r)^n - 1] | Funding = P × VA_fee%',
  'boat-loan-calculator': 'M = P × [r(1+r)^n] / [(1+r)^n - 1]',
  '401k-calculator': 'FV = (contrib + match)(1+r)^n',
  'ira-calculator': 'FV = contrib(1+r)^n',
  'social-security-calculator': 'PIA = AIME brackets × replacement rates',
  'annuity-calculator': 'PMT = P × r / [1 - (1+r)^(-n)]',
  'cd-calculator': 'A = P(1 + r/n)^(nt) | APY = (1 + r/n)^n - 1',
  'down-payment-calculator': 'Down = price × down% | PMI_needed = down < 20%',
  'debt-to-income-calculator': 'DTI = total_monthly_debt / gross_monthly_income × 100',
  'hourly-wage-calculator': 'Hourly = annual / 2080 | Weekly = hourly × hours',
  'overtime-calculator': 'OT = hourly × 1.5 × OT_hours',
  'commission-calculator': 'Commission = sale × rate%',
  'profit-calculator': 'Profit = revenue - cost | Margin = profit / revenue × 100',
  'revenue-calculator': 'Revenue = price × units_sold',
  'invoice-calculator': 'Total = Σ(line_items) + tax - discount',
  'cost-plus-calculator': 'Selling = cost × (1 + markup%)',
  'percent-off-calculator': 'Final = price × (1 - discount%)',
  'percent-increase-calculator': 'Increase = (new - old) / old × 100',
  'celsius-to-fahrenheit': '°F = °C × 9/5 + 32',
  'fahrenheit-to-celsius': '°C = (°F - 32) × 5/9',
  'kg-to-lbs': 'lbs = kg × 2.20462',
  'lbs-to-kg': 'kg = lbs / 2.20462',
  'mph-to-kmh': 'km/h = mph × 1.60934',
  'kmh-to-mph': 'mph = km/h / 1.60934',
  'gallons-to-liters': 'L = gal × 3.78541',
  'liters-to-gallons': 'gal = L / 3.78541',
  'inches-to-cm': 'cm = in × 2.54',
  'cm-to-inches': 'in = cm / 2.54',
  'feet-to-meters': 'm = ft × 0.3048',
  'meters-to-feet': 'ft = m / 0.3048',
  'miles-to-km': 'km = mi × 1.60934',
  'km-to-miles': 'mi = km / 1.60934',
  'acres-to-hectares': 'ha = acres × 0.404686',
  'hectares-to-acres': 'acres = ha / 0.404686',
  'ounces-to-grams': 'g = oz × 28.3495',
  'grams-to-ounces': 'oz = g / 28.3495',
  'cups-to-ml': 'ml = cups × 236.588',
  'ml-to-cups': 'cups = ml / 236.588',
  'stones-to-kg': 'kg = stones × 6.35029',
  'psi-to-bar': 'bar = psi × 0.0689476',
  'bar-to-psi': 'psi = bar / 0.0689476',
  'pascal-to-psi': 'psi = Pa / 6894.76',
  'kpa-to-psi': 'psi = kPa × 0.145038',
  'mmhg-to-kpa': 'kPa = mmHg × 0.133322',
  'joules-to-calories': 'cal = J × 0.239006',
  'calories-to-joules': 'J = cal × 4.184',
  'kwh-to-btu': 'BTU = kWh × 3412.14',
  'btu-to-kwh': 'kWh = BTU / 3412.14',
  'hp-to-kw': 'kW = hp × 0.7457',
  'kw-to-hp': 'hp = kW / 0.7457',
  'watts-to-hp': 'hp = W / 745.7',
  'btu-per-hour-to-watts': 'W = BTU/hr × 0.293071',
  'sqft-to-sqm': 'm² = ft² × 0.092903',
  'sqm-to-sqft': 'ft² = m² / 0.092903',
}

function getCalcFormula(calc: CalculatorEntry): string {
  if (calc.formulaSource) return calc.formulaSource
  if (formulaSource[calc.slug]) return formulaSource[calc.slug]

  if (calc.category === 'conversion') {
    if (calc.slug.includes('to-') || calc.slug.includes('-to-')) {
      return 'Result = input_value × conversion_factor'
    }
    return 'Standard unit conversion using internationally recognized conversion factors'
  }

  const categoryFormulas: Record<string, string> = {
    financial: 'Standard financial formula based on input parameters',
    health: 'Established medical formula validated by clinical research',
    math: 'Standard mathematical formula appropriate for the operation',
    'date-time': 'Calendar arithmetic accounting for variable month lengths and leap years',
    construction: 'Industry-standard construction estimation formula',
    statistics: 'Standard statistical formula from probability theory',
    education: 'Weighted average formula with customizable grading scale',
    physics: 'Fundamental physics law equation',
    chemistry: 'Standard chemical equation with SI unit constants',
    engineering: 'Professional engineering design formula',
    everyday: 'Practical arithmetic formula for common scenarios',
    food: 'Proportional scaling or nutritional computation formula',
    biology: 'Standard biological formula from peer-reviewed research',
    ecology: 'Ecological model formula from environmental science',
    sports: 'Sports science formula validated by athletic research',
  }

  return categoryFormulas[calc.category] || 'Standard computational formula'
}

function detailTitle(calc: CalculatorEntry): string {
  if (calc.category === 'conversion' && (calc.slug.includes('to-') || calc.slug.includes('-to-'))) {
    const parts = calc.slug.split(/[-]/)
    const toIdx = calc.slug.includes('to-') ? calc.slug.indexOf('to-') : parts.indexOf('to')
    if (toIdx > 0) {
      const from = parts.slice(0, toIdx).join(' ').replace(/-/g, ' ')
      const to = parts.slice(toIdx + (calc.slug.includes('to-') ? 0 : 1)).join(' ').replace(/-/g, ' ')
      const fromTitle = from.charAt(0).toUpperCase() + from.slice(1)
      const toTitle = to.charAt(0).toUpperCase() + to.slice(1)
      return `the conversion from ${fromTitle} to ${toTitle}`
    }
  }
  const st = shortTitle(calc.title)
  return `the ${st}`
}

function getExampleValue(calc: CalculatorEntry): { scenario: string; inputs: Record<string, number | string>; steps: string[]; result: string } {
  const category = calc.category
  const slug = calc.slug

  if (category === 'financial') {
    if (slug.includes('mortgage') || slug.includes('loan') || slug.includes('mortgage-payoff')) {
      return {
        scenario: 'Calculating a home loan monthly payment',
        inputs: { 'Loan Amount': 300000, 'Interest Rate': 6.5, 'Loan Term (years)': 30 },
        steps: [
          `Convert the annual interest rate to a monthly rate: 6.5% / 12 = 0.5417% or 0.005417`,
          `Determine the total number of payments: 30 years × 12 months = 360 payments`,
          `Apply the formula: M = 300,000 × [0.005417(1.005417)^360] / [(1.005417)^360 - 1]`,
          `Calculate the numerator: 300,000 × (0.005417 × 6.991) = 300,000 × 0.03787`,
          `Calculate the denominator: 6.991 - 1 = 5.991`,
          `Divide to get the monthly payment: $11,361 / 5.991 = $1,896`,
        ],
        result: '$1,896 per month (principal and interest only)',
      }
    }
    if (slug.includes('compound-interest')) {
      return {
        scenario: 'Growing an investment with compound interest',
        inputs: { 'Principal': 10000, 'Annual Rate': 7, 'Time (years)': 10, 'Compounds per Year': 12 },
        steps: [
          `Identify your values: P = $10,000, r = 0.07, n = 12, t = 10`,
          `Plug into the formula: A = 10,000 × (1 + 0.07/12)^(12×10)`,
          `Calculate the monthly rate: 0.07/12 = 0.005833`,
          `Calculate the exponent: 12 × 10 = 120`,
          `Compute: A = 10,000 × (1.005833)^120`,
          `(1.005833)^120 = 2.0097, so A = 10,000 × 2.0097 = $20,097`,
        ],
        result: '$20,097 (more than double the original investment)',
      }
    }
    if (slug.includes('retirement')) {
      return {
        scenario: 'Planning for retirement savings',
        inputs: { 'Current Age': 30, 'Retirement Age': 65, 'Current Savings': 50000, 'Monthly Contribution': 500, 'Annual Return': 7 },
        steps: [
          `Determine your time horizon: 65 - 30 = 35 years until retirement`,
          `Calculate future value of current savings: $50,000 × (1.07)^35 = $50,000 × 10.677 = $533,850`,
          `Calculate future value of monthly contributions using annuity formula`,
          `$500/month × [((1.00583)^420 - 1)/0.00583] = $500 × 1,497.3 = $748,650`,
          `Add both components: $533,850 + $748,650 = $1,282,500`,
          `Apply the 4% withdrawal rule: $1,282,500 × 0.04 = $51,300 per year`,
        ],
        result: '$1,282,500 nest egg providing $51,300/year in retirement',
      }
    }
    if (slug.includes('salary') || slug.includes('hourly-wage')) {
      return {
        scenario: 'Converting an hourly wage to annual salary',
        inputs: { 'Hourly Wage': 25, 'Hours per Week': 40, 'Weeks per Year': 52 },
        steps: [
          `Calculate weekly earnings: $25/hour × 40 hours = $1,000 per week`,
          `Multiply by weeks worked per year: $1,000 × 52 = $52,000`,
          `For monthly income: $52,000 / 12 = $4,333.33 per month`,
          `For biweekly income: $52,000 / 26 = $2,000 per paycheck`,
        ],
        result: '$52,000 per year (or $4,333.33 per month)',
      }
    }
    if (slug.includes('debt-payoff')) {
      return {
        scenario: 'Paying off credit card debt faster',
        inputs: { 'Balance': 10000, 'Interest Rate': 18, 'Monthly Payment': 350 },
        steps: [
          `Calculate monthly interest rate: 18% / 12 = 1.5%`,
          `Month 1: interest = $10,000 × 0.015 = $150, principal = $350 - $150 = $200, new balance = $9,800`,
          `Month 2: interest = $9,800 × 0.015 = $147, principal = $350 - $147 = $203, new balance = $9,597`,
          `Continue this process: each month less interest is charged as the balance drops`,
          `After approximately 35 months, the balance reaches zero`,
        ],
        result: 'Debt-free in 35 months with total interest of ~$2,250',
      }
    }
    if (slug.includes('budget')) {
      return {
        scenario: 'Creating a monthly household budget',
        inputs: { 'Monthly Income': 5500, 'Housing': 1800, 'Food': 600, 'Transportation': 400, 'Utilities': 250, 'Entertainment': 300 },
        steps: [
          `List all monthly income sources: total = $5,500`,
          `List all monthly expenses: Housing $1,800 + Food $600 + Transportation $400 + Utilities $250 + Entertainment $300 = $3,350`,
          `Subtract total expenses from income: $5,500 - $3,350 = $2,150`,
          `Calculate savings rate: $2,150 / $5,500 × 100 = 39.1%`,
          `Consider the 50/30/20 rule: needs ($3,350 = 61%), wants ($300 = 5%), savings ($2,150 = 39%)`,
        ],
        result: '$2,150 monthly surplus with a 39.1% savings rate',
      }
    }
    if (slug.includes('income-tax')) {
      return {
        scenario: 'Estimating annual income tax liability',
        inputs: { 'Annual Income': 85000, 'Filing Status': 'Single', 'Standard Deduction': 14600 },
        steps: [
          `Start with gross income: $85,000`,
          `Subtract the standard deduction: $85,000 - $14,600 = $70,400 taxable income`,
          `Apply the 2024 tax brackets for single filers:`,
          `10% on first $11,600 = $1,160`,
          `12% on $11,601-$47,150 = $4,266`,
          `22% on $47,151-$70,400 = $5,115`,
          `Total tax: $1,160 + $4,266 + $5,115 = $10,541`,
        ],
        result: '$10,541 total tax, effective rate of 12.4%',
      }
    }
    if (slug.includes('roi') || slug.includes('return-on-investment')) {
      return {
        scenario: 'Calculating return on an investment',
        inputs: { 'Initial Investment': 50000, 'Final Value': 72000, 'Time (years)': 5 },
        steps: [
          `Calculate total gain: $72,000 - $50,000 = $22,000`,
          `Apply ROI formula: ($72,000 - $50,000) / $50,000 × 100`,
          `ROI = $22,000 / $50,000 × 100 = 44%`,
          `For annualized ROI: (1.44)^(1/5) - 1 = 1.0758 - 1 = 0.0758 or 7.58% per year`,
        ],
        result: '44% total ROI (7.58% annualized)',
      }
    }
    if (slug.includes('net-worth')) {
      return {
        scenario: 'Calculating personal net worth',
        inputs: { 'Cash and Savings': 25000, 'Investments': 120000, 'Home Value': 350000, 'Mortgage': 280000, 'Car Loan': 15000, 'Credit Cards': 5000 },
        steps: [
          `Total assets: $25,000 + $120,000 + $350,000 = $495,000`,
          `Total liabilities: $280,000 + $15,000 + $5,000 = $300,000`,
          `Net worth: $495,000 - $300,000 = $195,000`,
        ],
        result: 'Net worth of $195,000',
      }
    }
    if (slug.includes('tip')) {
      return {
        scenario: 'Splitting a restaurant bill',
        inputs: { 'Bill Amount': 85.50, 'Tip Percentage': 18, 'Number of People': 4 },
        steps: [
          `Calculate tip: $85.50 × 0.18 = $15.39`,
          `Total bill with tip: $85.50 + $15.39 = $100.89`,
          `Split evenly: $100.89 / 4 = $25.22 per person`,
        ],
        result: '$25.22 per person (including 18% tip)',
      }
    }
    if (slug.includes('discount') || slug.includes('percent-off')) {
      return {
        scenario: 'Calculating the final price after a discount',
        inputs: { 'Original Price': 120, 'Discount Percentage': 25 },
        steps: [
          `Convert discount to decimal: 25% = 0.25`,
          `Calculate discount amount: $120 × 0.25 = $30`,
          `Subtract from original: $120 - $30 = $90`,
          `Or directly: $120 × (1 - 0.25) = $120 × 0.75 = $90`,
        ],
        result: '$90 final price (saving $30)',
      }
    }
    if (slug.includes('refinance')) {
      return {
        scenario: 'Evaluating a mortgage refinance opportunity',
        inputs: { 'Current Balance': 250000, 'Current Rate': 7, 'New Rate': 5.5, 'New Term (years)': 30, 'Closing Costs': 6000 },
        steps: [
          `Current monthly payment at 7%: $1,663`,
          `New monthly payment at 5.5%: $1,419`,
          `Monthly savings: $1,663 - $1,419 = $244`,
          `Breakeven point: $6,000 / $244 = 24.6 months`,
          `After 25 months, you start saving money`,
        ],
        result: '$244/month savings, breakeven in ~25 months',
      }
    }
    if (slug.includes('rent-vs-buy')) {
      return {
        scenario: 'Comparing renting vs buying a home',
        inputs: { 'Home Price': 350000, 'Monthly Rent': 1800, 'Down Payment': 70000, 'Mortgage Rate': 6.5, 'Time Horizon (years)': 7 },
        steps: [
          `Buy scenario: Monthly mortgage payment = $1,770, plus taxes/insurance $400 = $2,170`,
          `Rent scenario: Monthly rent = $1,800, invest down payment difference`,
          `Over 7 years: Buying builds ~$85,000 in equity; renting invests $70,000 growing to ~$112,000`,
          `Break-even analysis favors buying if staying more than 5 years`,
        ],
        result: 'Buying is more favorable over a 7-year horizon',
      }
    }
  }

  if (category === 'health') {
    if (slug.includes('bmi')) {
      return {
        scenario: 'Calculating Body Mass Index',
        inputs: { 'Weight': 75, 'Height': 175 },
        steps: [
          `Convert height to meters: 175 cm = 1.75 m`,
          `Square the height: 1.75² = 3.0625`,
          `Apply the BMI formula: 75 / 3.0625 = 24.49`,
          `The result 24.49 falls in the "Normal weight" range (18.5-24.9)`,
        ],
        result: 'BMI of 24.49 (Normal weight)',
      }
    }
    if (slug.includes('bmr') || slug.includes('calorie')) {
      return {
        scenario: 'Calculating daily calorie needs for a 35-year-old woman',
        inputs: { 'Age': 35, 'Weight (kg)': 68, 'Height (cm)': 165, 'Activity Level': 'Moderate' },
        steps: [
          `Calculate BMR using Mifflin-St Jeor: BMR = 10 × 68 + 6.25 × 165 - 5 × 35 - 161`,
          `BMR = 680 + 1,031.25 - 175 - 161 = 1,375.25 calories/day`,
          `Apply activity multiplier (moderate = 1.55): TDEE = 1,375.25 × 1.55`,
          `Daily maintenance calories: approximately 2,132`,
          `For weight loss: subtract 500 calories = target of 1,632 per day`,
        ],
        result: '2,132 calories/day to maintain weight; 1,632 for weight loss',
      }
    }
    if (slug.includes('body-fat')) {
      return {
        scenario: 'Estimating body fat percentage using circumference method',
        inputs: { 'Gender': 'Male', 'Waist (cm)': 88, 'Neck (cm)': 40, 'Height (cm)': 178 },
        steps: [
          `Use the US Navy circumference formula: 86.01 × log10(waist - neck) - 70.04 × log10(height) + 36.76`,
          `Waist minus neck: 88 - 40 = 48 cm`,
          `log10(48) = 1.681, log10(178) = 2.250`,
          `Body fat % = 86.01 × 1.681 - 70.04 × 2.250 + 36.76`,
          `= 144.6 - 157.6 + 36.76 = 23.8%`,
        ],
        result: 'Estimated body fat of 23.8%',
      }
    }
    if (slug.includes('heart-rate') || slug.includes('target-heart')) {
      return {
        scenario: 'Finding target heart rate zones for a 40-year-old',
        inputs: { 'Age': 40, 'Resting Heart Rate': 65 },
        steps: [
          `Calculate maximum heart rate: 208 - 0.7 × 40 = 180 bpm`,
          `Calculate heart rate reserve (Karvonen): 180 - 65 = 115 bpm`,
          `Zone 2 (moderate, 60-70%): (115 × 0.60) + 65 = 134 bpm to (115 × 0.70) + 65 = 145 bpm`,
          `Zone 4 (vigorous, 80-90%): (115 × 0.80) + 65 = 157 bpm to (115 × 0.90) + 65 = 168 bpm`,
        ],
        result: 'Zone 2: 134-145 bpm | Zone 4: 157-168 bpm',
      }
    }
    if (slug.includes('due-date') || slug.includes('pregnancy')) {
      return {
        scenario: 'Estimating due date from last menstrual period',
        inputs: { 'First Day of LMP': 'January 15, 2024', 'Cycle Length': 28 },
        steps: [
          `Start with the first day of your last menstrual period: January 15, 2024`,
          `Add 280 days (40 weeks): Naegele\'s Rule`,
          `January has 31 days, so 31 - 15 = 16 remaining days in January`,
          `280 - 16 = 264 days remaining after January`,
          `Count forward: February (29) + March (31) + April (30) + May (31) + June (30) + July (31) + August (31) + September (30) = 243`,
          `264 - 243 = 21 days into October = October 21, 2024`,
        ],
        result: 'Estimated due date: October 21, 2024',
      }
    }
    if (slug.includes('water-intake')) {
      return {
        scenario: 'Calculating daily water intake needs',
        inputs: { 'Weight (kg)': 75, 'Exercise Minutes': 30 },
        steps: [
          `Base water intake: 75 kg × 0.033 = 2.475 liters per day`,
          `Add extra for exercise: 30 minutes of moderate activity adds ~0.3 liters`,
          `Total daily recommendation: 2.475 + 0.3 = 2.775 liters`,
        ],
        result: 'Approximately 2.8 liters (about 12 cups) of water per day',
      }
    }
    if (slug.includes('protein') || slug.includes('macro')) {
      return {
        scenario: 'Calculating daily protein needs for muscle building',
        inputs: { 'Weight (kg)': 80, 'Goal': 'Muscle Building' },
        steps: [
          `For muscle building, use a factor of 1.6-2.2 g per kg of body weight`,
          `Using 1.8 g/kg: 80 × 1.8 = 144 grams of protein per day`,
          `In calories: 144 × 4 = 576 calories from protein`,
          `Spread across 4 meals: ~36 grams of protein per meal`,
        ],
        result: '144 grams of protein per day (~36g per meal)',
      }
    }
  }

  if (category === 'math') {
    if (slug.includes('percentage')) {
      return {
        scenario: 'Finding what percentage one number is of another',
        inputs: { 'Part': 45, 'Whole': 180 },
        steps: [
          `Divide the part by the whole: 45 / 180 = 0.25`,
          `Multiply by 100 to get the percentage: 0.25 × 100 = 25%`,
          `So 45 is 25% of 180`,
        ],
        result: '45 is 25% of 180',
      }
    }
    if (slug.includes('fraction')) {
      return {
        scenario: 'Adding two fractions together',
        inputs: { 'First Fraction': '3/4', 'Second Fraction': '2/5' },
        steps: [
          `Find a common denominator: 4 × 5 = 20`,
          `Convert 3/4: (3 × 5) / (4 × 5) = 15/20`,
          `Convert 2/5: (2 × 4) / (5 × 4) = 8/20`,
          `Add the numerators: 15 + 8 = 23`,
          `Result: 23/20 or 1 3/20 as a mixed number`,
        ],
        result: '23/20 (or 1 3/20, approximately 1.15)',
      }
    }
    if (slug.includes('pythagorean')) {
      return {
        scenario: 'Finding the hypotenuse of a right triangle',
        inputs: { 'Side A': 6, 'Side B': 8 },
        steps: [
          `Apply the Pythagorean theorem: a² + b² = c²`,
          `Substitute the values: 6² + 8² = c²`,
          `Calculate squares: 36 + 64 = c²`,
          `Sum: 100 = c²`,
          `Take the square root: c = √100 = 10`,
        ],
        result: 'Hypotenuse = 10 units',
      }
    }
    if (slug.includes('standard-deviation')) {
      return {
        scenario: 'Finding the standard deviation of a data set',
        inputs: { 'Data Set': '2, 4, 4, 4, 5, 5, 7, 9' },
        steps: [
          `Calculate the mean: (2+4+4+4+5+5+7+9)/8 = 40/8 = 5`,
          `Find squared differences from mean: (2-5)²=9, (4-5)²=1, (4-5)²=1, (4-5)²=1, (5-5)²=0, (5-5)²=0, (7-5)²=4, (9-5)²=16`,
          `Sum of squared differences: 9+1+1+1+0+0+4+16 = 32`,
          `For sample SD: divide by n-1: 32/7 = 4.571`,
          `Take square root: √4.571 = 2.14`,
        ],
        result: 'Standard deviation = 2.14',
      }
    }
    if (slug.includes('quadratic')) {
      return {
        scenario: 'Solving a quadratic equation',
        inputs: { 'a': 1, 'b': -5, 'c': 6 },
        steps: [
          `The equation is x² - 5x + 6 = 0`,
          `Apply the quadratic formula: x = [5 ± √(25 - 24)] / 2`,
          `Calculate discriminant: 25 - 24 = 1`,
          `x = [5 ± 1] / 2`,
          `x₁ = (5 + 1)/2 = 3, x₂ = (5 - 1)/2 = 2`,
        ],
        result: 'x = 3 and x = 2',
      }
    }
    if (slug.includes('gcf') || slug.includes('gcd')) {
      return {
        scenario: 'Finding the greatest common factor of two numbers',
        inputs: { 'Number A': 48, 'Number B': 18 },
        steps: [
          `List factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48`,
          `List factors of 18: 1, 2, 3, 6, 9, 18`,
          `Find common factors: 1, 2, 3, 6`,
          `The largest common factor is 6`,
          `Using Euclidean algorithm: 48 mod 18 = 12, 18 mod 12 = 6, 12 mod 6 = 0 → GCF = 6`,
        ],
        result: 'GCF(48, 18) = 6',
      }
    }
    if (slug.includes('area') || slug.includes('circle')) {
      return {
        scenario: 'Finding the area of a circle',
        inputs: { 'Radius': 5 },
        steps: [
          `Use the formula: A = πr²`,
          `Substitute: A = π × 5²`,
          `Calculate: A = π × 25`,
          `A = 78.54 square units`,
        ],
        result: '78.54 square units',
      }
    }
    if (slug.includes('volume')) {
      return {
        scenario: 'Calculating the volume of a cylinder',
        inputs: { 'Radius': 3, 'Height': 10 },
        steps: [
          `Use the formula: V = πr²h`,
          `Substitute: V = π × 3² × 10`,
          `V = π × 9 × 10 = π × 90`,
          `V = 282.74 cubic units`,
        ],
        result: '282.74 cubic units',
      }
    }
  }

  if (category === 'conversion') {
    if (slug.includes('celsius')) {
      return {
        scenario: 'Converting Celsius to Fahrenheit for a weather forecast',
        inputs: { 'Celsius': 25 },
        steps: [
          `Use the formula: °F = (°C × 9/5) + 32`,
          `Substitute: °F = (25 × 9/5) + 32`,
          `25 × 9/5 = 25 × 1.8 = 45`,
          `45 + 32 = 77°F`,
        ],
        result: '25°C = 77°F',
      }
    }
    if (slug.includes('fahrenheit')) {
      return {
        scenario: 'Converting Fahrenheit to Celsius',
        inputs: { 'Fahrenheit': 98.6 },
        steps: [
          `Use the formula: °C = (°F - 32) × 5/9`,
          `Substitute: °C = (98.6 - 32) × 5/9`,
          `98.6 - 32 = 66.6`,
          `66.6 × 5/9 = 37°C`,
        ],
        result: '98.6°F = 37°C (normal body temperature)',
      }
    }
    if (slug.includes('kg-to-lbs') || slug.includes('kgs-to-lbs')) {
      return {
        scenario: 'Converting kilograms to pounds for weight measurement',
        inputs: { 'Kilograms': 70 },
        steps: [
          `Use the conversion factor: 1 kg = 2.20462 lbs`,
          `Multiply: 70 × 2.20462 = 154.32`,
          `So 70 kg is approximately 154.3 pounds`,
        ],
        result: '70 kg = 154.32 lbs',
      }
    }
    if (slug.includes('miles-to-km')) {
      return {
        scenario: 'Converting miles to kilometers for a road trip',
        inputs: { 'Miles': 120 },
        steps: [
          `Use the conversion factor: 1 mile = 1.60934 km`,
          `Multiply: 120 × 1.60934 = 193.12`,
          `So 120 miles is approximately 193 kilometers`,
        ],
        result: '120 miles = 193.12 km',
      }
    }
  }

  if (category === 'date-time') {
    if (slug.includes('age')) {
      return {
        scenario: 'Calculating exact age in years, months, and days',
        inputs: { 'Birth Date': 'March 15, 1990', 'As of Date': 'June 28, 2026' },
        steps: [
          `Calculate years: 2026 - 1990 = 36 years`,
          `But need to check if birthday has occurred: March 15 is before June 28, so full 36 years`,
          `Calculate months: from March 15 to June 28 is 3 months and 13 days`,
          `So the exact age is 36 years, 3 months, and 13 days`,
        ],
        result: '36 years, 3 months, and 13 days old',
      }
    }
    if (slug.includes('date-duration') || slug.includes('days-between') || slug.includes('date-calculator')) {
      return {
        scenario: 'Calculating the number of days between two dates',
        inputs: { 'Start Date': 'January 1, 2026', 'End Date': 'June 28, 2026' },
        steps: [
          `Count days in January: 31 days (Jan 1 to Jan 31)`,
          `Add February: 28 days (February 2026 is not a leap year)`,
          `Add March: 31 days, April: 30 days, May: 31 days`,
          `Add June: 28 days (Jun 1 to Jun 28)`,
          `Total: 31 + 28 + 31 + 30 + 31 + 28 = 179 days`,
        ],
        result: '179 days between the two dates',
      }
    }
    if (slug.includes('time-duration') || slug.includes('time-calculator')) {
      return {
        scenario: 'Finding the duration between two times',
        inputs: { 'Start Time': '9:15 AM', 'End Time': '4:45 PM' },
        steps: [
          `Convert to 24-hour format: 9:15 and 16:45`,
          `Hours difference: 16 - 9 = 7 hours`,
          `Minutes difference: 45 - 15 = 30 minutes`,
          `Total duration: 7 hours and 30 minutes`,
        ],
        result: '7 hours and 30 minutes',
      }
    }
  }

  if (category === 'statistics') {
    return {
      scenario: 'Finding the mean, median, and mode of a data set',
      inputs: { 'Data Set': '12, 15, 18, 20, 22, 22, 25, 30, 35, 40' },
      steps: [
        `Mean: sum all values = 239, divide by 10 = 23.9`,
        `Median: average of 5th and 6th values (22 and 22) = 22`,
        `Mode: the most frequent value = 22 (appears twice)`,
        `Range: 40 - 12 = 28`,
      ],
      result: 'Mean = 23.9, Median = 22, Mode = 22, Range = 28',
    }
  }

  if (category === 'construction') {
    if (slug.includes('concrete')) {
      return {
        scenario: 'Estimating concrete needed for a patio',
        inputs: { 'Length (ft)': 20, 'Width (ft)': 12, 'Depth (in)': 4 },
        steps: [
          `Convert depth to feet: 4 inches / 12 = 0.333 feet`,
          `Calculate cubic feet: 20 × 12 × 0.333 = 80 cubic feet`,
          `Convert to cubic yards: 80 / 27 = 2.96 cubic yards`,
          `Add 10% waste factor: 2.96 × 1.10 = 3.26 cubic yards`,
          `Order 3.5 cubic yards to be safe`,
        ],
        result: 'Approximately 3.3 cubic yards (order 3.5)',
      }
    }
  }

  if (category === 'everyday') {
    if (slug.includes('tip')) {
      return {
        scenario: 'Splitting a restaurant bill',
        inputs: { 'Bill Amount': 85.50, 'Tip Percentage': 18, 'Number of People': 4 },
        steps: [
          `Calculate tip: $85.50 × 0.18 = $15.39`,
          `Total bill with tip: $85.50 + $15.39 = $100.89`,
          `Split evenly: $100.89 / 4 = $25.22 per person`,
        ],
        result: '$25.22 per person (including 18% tip)',
      }
    }
    if (slug.includes('gpa')) {
      return {
        scenario: 'Calculating semester GPA',
        inputs: { 'Course 1 Grade': 'A (4.0)', 'Course 1 Credits': 3, 'Course 2 Grade': 'B (3.0)', 'Course 2 Credits': 4, 'Course 3 Grade': 'A- (3.7)', 'Course 3 Credits': 3 },
        steps: [
          `Multiply each grade by credits: 4.0 × 3 = 12, 3.0 × 4 = 12, 3.7 × 3 = 11.1`,
          `Sum of grade points: 12 + 12 + 11.1 = 35.1`,
          `Total credits: 3 + 4 + 3 = 10`,
          `GPA = 35.1 / 10 = 3.51`,
        ],
        result: 'Semester GPA = 3.51',
      }
    }
    if (slug.includes('grade')) {
      return {
        scenario: 'Calculating final grade with weighted categories',
        inputs: { 'Assignments (40%)': 88, 'Exams (50%)': 92, 'Participation (10%)': 85 },
        steps: [
          `Multiply each grade by its weight: 88 × 0.40 = 35.2`,
          `92 × 0.50 = 46.0`,
          `85 × 0.10 = 8.5`,
          `Sum: 35.2 + 46.0 + 8.5 = 89.7%`,
        ],
        result: 'Final grade of 89.7% (B+)',
      }
    }
  }

  if (category === 'education') {
    if (slug.includes('gpa')) {
      return {
        scenario: 'Calculating cumulative GPA across semesters',
        inputs: { 'Previous GPA': 3.2, 'Previous Credits': 45, 'Current Semester GPA': 3.6, 'Current Credits': 15 },
        steps: [
          `Total grade points so far: 3.2 × 45 = 144`,
          `New grade points: 3.6 × 15 = 54`,
          `Total grade points: 144 + 54 = 198`,
          `Total credits: 45 + 15 = 60`,
          `Cumulative GPA: 198 / 60 = 3.30`,
        ],
        result: 'Cumulative GPA = 3.30',
      }
    }
  }

  if (category === 'engineering') {
    if (slug.includes('ohms-law') || slug.includes('ohm')) {
      return {
        scenario: 'Finding the current in a simple circuit',
        inputs: { 'Voltage': 12, 'Resistance': 24 },
        steps: [
          `Use Ohm\'s Law: I = V / R`,
          `Substitute: I = 12 / 24`,
          `Current = 0.5 amperes (500 mA)`,
        ],
        result: '0.5 amperes (500 mA)',
      }
    }
    if (slug.includes('voltage-drop')) {
      return {
        scenario: 'Calculating voltage drop in a copper wire run',
        inputs: { 'Current (Amps)': 20, 'Length (ft)': 100, 'Wire Gauge': '10 AWG' },
        steps: [
          `Resistance of 10 AWG copper is approximately 1.24 ohms per 1000 ft`,
          `For 100 ft (round trip 200 ft): R = 1.24 × 200/1000 = 0.248 ohms`,
          `Voltage drop: V_drop = 2 × 20 × 0.248 = 4.96 volts`,
          `Percentage drop: 4.96 / 120 × 100 = 4.13%`,
        ],
        result: '4.96V drop (4.13% of 120V) - exceeds recommended 3%',
      }
    }
  }

  if (category === 'chemistry') {
    return {
      scenario: 'Calculating the molar mass of a compound',
      inputs: { 'Compound': 'H₂SO₄ (Sulfuric Acid)' },
      steps: [
        `Hydrogen: 2 atoms × 1.008 g/mol = 2.016 g/mol`,
        `Sulfur: 1 atom × 32.065 g/mol = 32.065 g/mol`,
        `Oxygen: 4 atoms × 15.999 g/mol = 63.996 g/mol`,
        `Total molar mass: 2.016 + 32.065 + 63.996 = 98.077 g/mol`,
      ],
      result: '98.077 g/mol',
    }
  }

  if (category === 'physics') {
    return {
      scenario: 'Calculating kinetic energy of a moving object',
      inputs: { 'Mass (kg)': 10, 'Velocity (m/s)': 5 },
      steps: [
        `Use the formula: KE = ½mv²`,
        `Substitute: KE = 0.5 × 10 × 5²`,
        `KE = 0.5 × 10 × 25`,
        `KE = 125 joules`,
      ],
      result: '125 joules of kinetic energy',
    }
  }

  if (category === 'food') {
    return {
      scenario: 'Scaling a recipe for more servings',
      inputs: { 'Original Servings': 4, 'Desired Servings': 6, 'Original Flour (cups)': 2 },
      steps: [
        `Calculate the scaling factor: 6 / 4 = 1.5`,
        `Multiply each ingredient by 1.5`,
        `Flour: 2 × 1.5 = 3 cups`,
        `Apply to all ingredients for consistent scaling`,
      ],
      result: '3 cups of flour (multiply all ingredients by 1.5)',
    }
  }

  if (category === 'sports') {
    if (slug.includes('pace')) {
      return {
        scenario: 'Calculating running pace for a 10K race',
        inputs: { 'Distance (km)': 10, 'Time (min)': 55 },
        steps: [
          `Pace = total minutes / distance in km`,
          `Pace = 55 / 10 = 5:30 per kilometer`,
          `For miles: 10 km = 6.21 miles, 55 / 6.21 = 8:51 per mile`,
        ],
        result: '5:30 min/km (8:51 min/mile)',
      }
    }
  }

  return {
    scenario: `Using the ${shortTitle(calc.title)}`,
    inputs: { 'Input Value': 100 },
    steps: [
      `Enter your values into the calculator's input fields`,
      `The calculator processes the inputs using its built-in formula`,
      `Results update automatically showing the computed value`,
      `Adjust inputs to explore different scenarios and outcomes`,
    ],
    result: `${shortTitle(calc.title)} result based on your inputs`,
  }
}

function generateWhatIs(calc: CalculatorEntry): string {
  const st = shortTitle(calc.title)
  const desc = calc.description.length > 60 ? calc.description.slice(0, 60) + '...' : calc.description
  const keywords = calc.keywords?.slice(0, 4).join(', ') || ''

  if (calc.category === 'conversion') {
    return `The ${calc.title} is a free online tool designed to instantly convert values ${detailTitle(calc)}. Instead of manually applying conversion factors or searching through reference tables, this tool handles the math automatically. Simply enter your starting value, select the units, and get the precise converted result in real time. Whether you are a student learning about measurement systems, a traveler navigating foreign units, a professional engineer, or someone who just needs a quick answer, the ${st} delivers accurate results. It supports decimal precision and handles both small and large values with ease. Bookmark it for fast access whenever you need ${detailTitle(calc)}.`
  }

  if (calc.category === 'financial') {
    return `The ${calc.title} is a powerful free tool that helps you ${desc.toLowerCase().replace(/\.\.\.$/, '')}. Whether you are planning a major purchase, managing debt, investing for retirement, or simply trying to understand your financial situation better, this calculator provides instant accurate results using industry-standard formulas. It handles complex computations that would take minutes or hours by hand, giving you clarity on your financial decisions in seconds. Use it to compare scenarios, understand the impact of different variables, and make data-driven choices about your money. The ${st} is designed for everyone from first-time homebuyers to seasoned investors.`
  }

  if (calc.category === 'health') {
    return `The ${calc.title} is a free health assessment tool ${desc.toLowerCase().replace(/\.\.\.$/, '')}. It uses clinically validated formulas and medical research to provide personalized health metrics based on your inputs. By entering simple measurements like your age, weight, height, and other relevant data, you receive instant insights into various aspects of your health and fitness. This tool is ideal for tracking progress toward wellness goals, understanding important health indicators, and making informed decisions about your lifestyle. Always consult a healthcare professional for medical advice, but use the ${st} as a reliable reference point on your health journey.`
  }

  if (calc.category === 'math') {
    return `The ${calc.title} is a free online tool that performs mathematical computations instantly and accurately. ${st ? st + 's' : 'It'} are encountered in many fields including education, engineering, finance, data analysis, and everyday problem-solving. Instead of working through formulas by hand or using a basic calculator that only handles one operation at a time, this specialized tool applies the correct mathematical method to your specific problem. It supports decimal values, large numbers, and provides step-by-step breakdowns that help you understand how the result is derived. Perfect for students checking homework, professionals double-checking calculations, or anyone who needs quick and reliable math results.`
  }

  if (calc.category === 'statistics') {
    return `The ${calc.title} is a free data analysis tool that computes key statistical measures from your data set. Instead of manually calculating formulas or setting up complex spreadsheet functions, simply enter your data values and the calculator instantly computes the statistics you need. It handles any number of data points and provides accurate results using standard statistical formulas. Whether you are a student analyzing experiment results, a professional evaluating data trends, or a researcher working with data sets, the ${st} saves time and reduces errors. Use it for descriptive statistics, probability calculations, and data distribution analysis.`
  }

  if (calc.category === 'date-time') {
    return `The ${calc.title} is a free time and date computation tool that handles calendar arithmetic automatically. Unlike manual calculations that require accounting for varying month lengths, leap years, and daylight saving time, this calculator does all the heavy lifting for you. Simply enter your dates and times, and the tool instantly computes durations, differences, or future/past dates with precision. It is perfect for project planning, age calculation, event scheduling, and any situation that requires accurate date or time arithmetic. The ${st} eliminates guesswork and ensures you get reliable results every time.`
  }

  if (calc.category === 'construction') {
    return `The ${calc.title} is a free project estimation tool that helps ${desc.toLowerCase().replace(/\.\.\.$/, '')}. Whether you are planning a home renovation, estimating material quantities for a building project, or calculating costs for a construction bid, this calculator provides accurate estimates based on your measurements and specifications. It uses industry-standard formulas to compute material requirements, waste factors, and cost estimates. Save time on calculations, reduce material waste, and plan your projects more effectively. The ${st} is useful for both DIY homeowners and professional contractors.`
  }

  if (calc.category === 'education') {
    return `The ${calc.title} is a free academic tool that helps ${desc.toLowerCase().replace(/\.\.\.$/, '')}. Instead of manually computing weighted averages or wondering how different scores affect your final grade, this calculator handles all the math. Enter your grades, credit hours, or test scores and get instant results using standard educational formulas. It supports multiple grading scales including percentage, letter grade, and 4.0 GPA systems. Perfect for students tracking their academic performance, teachers calculating class grades, or parents monitoring their child's progress.`
  }

  if (calc.category === 'physics') {
    return `The ${calc.title} is a free scientific tool that applies fundamental physics principles ${desc.toLowerCase().replace(/\.\.\.$/, '')}. It uses established physical laws and equations to compute results based on your inputs. The calculator handles unit conversions automatically, supports both SI and imperial units, and provides accurate results using precise physical constants. Whether you are a student studying physics, an engineer solving a problem, or a curious learner exploring how things work, the ${st} makes physics calculations accessible and understandable. Step-by-step solutions help reinforce the underlying concepts.`
  }

  if (calc.category === 'chemistry') {
    return `The ${calc.title} is a free chemistry tool that performs accurate chemical computations using standardized constants and formulas. Instead of manually looking up atomic weights, balancing equations, or converting between units, this calculator automates the process for you. It uses up-to-date IUPAC standard atomic weights and applies correct stoichiometric relationships. Whether you are a student working on homework, a lab technician preparing solutions, or a researcher conducting experiments, the ${st} provides reliable results that save time and reduce calculation errors.`
  }

  if (calc.category === 'engineering') {
    return `The ${calc.title} is a free engineering tool that applies professional design formulas ${desc.toLowerCase().replace(/\.\.\.$/, '')}. It follows industry-standard codes and practices to provide accurate results for engineering calculations. The calculator supports multiple unit systems and uses precise constants appropriate for each discipline. Whether you are an electrical, mechanical, civil, or aerospace engineer, this tool helps you quickly verify designs, size components, and analyze systems. Use it for preliminary design, educational purposes, and quick checks of your engineering calculations.`
  }

  return `The ${calc.title} is a free online tool ${desc.toLowerCase().replace(/\.\.\.$/, '')}. It provides instant accurate results based on your inputs, saving you time and eliminating manual calculation errors. The ${st} is designed to be intuitive and easy to use, making it accessible for beginners while still being powerful enough for professionals. Simply enter your values, adjust any options, and get your results immediately. This tool is ideal for quick calculations, planning, learning, and decision-making across a variety of practical scenarios.`
}

function generateHowToUse(calc: CalculatorEntry): string {
  const st = shortTitle(calc.title)
  const detail = detailTitle(calc)

  if (calc.category === 'conversion') {
    return `Using the ${calc.title} is straightforward. First, locate the input field labeled with the source unit you want to convert from. Enter the numeric value you wish to convert. Next, confirm that the "From" and "To" unit selectors are set correctly — for example, if converting ${detail}, ensure the source and target units match your intent. The result will update automatically as you type, displaying the converted value with the appropriate number of decimal places. You can also switch the conversion direction with a single click to perform the reverse calculation. The tool supports a wide range of values from very small to very large numbers.`
  }

  if (calc.category === 'financial') {
    return `To use the ${calc.title}, start by entering all relevant financial values into the labeled input fields. Common inputs include dollar amounts, interest rates as percentages, time periods in years or months, and any applicable fees or taxes. The calculator processes these inputs using industry-standard financial formulas and displays the result immediately. Many financial calculators also offer advanced features like scenario comparison, amortization schedules, or charts showing how results change over time. You can adjust any input to see how changes affect the outcome, making it easy to explore different financial strategies. Results can typically be printed, saved, or exported for your records.`
  }

  if (calc.category === 'health') {
    return `Using the ${calc.title} requires entering a few personal measurements. Fill in the required fields such as age, weight, height, gender, and any other metrics the tool asks for. Make sure you select the correct units (metric or imperial) for each measurement. The calculator instantly applies validated health formulas to compute your results. Most health calculators also let you adjust activity levels, goals, or other personal factors to get more tailored estimates. The results section displays your key metrics along with any relevant classifications or ranges. For the most accurate results, use up-to-date measurements rather than estimates.`
  }

  if (calc.category === 'math') {
    return `Using the ${calc.title} is simple. Enter your numbers into the provided input fields. Some calculators have a single input, while others require two or more values depending on the operation. Select any additional options like rounding precision or operation type from available dropdowns. The result updates instantly as you adjust the inputs, allowing you to experiment with different values. Many math calculators also show intermediate steps or the formula being applied, which is helpful for learning and verification. You can copy the result to your clipboard with one click.`
  }

  if (calc.category === 'date-time') {
    return `To use the ${calc.title}, begin by selecting or entering the relevant dates and times. Use the date picker or type the date in the specified format. For time inputs, enter hours and minutes in 12-hour or 24-hour format as preferred. The calculator accounts for leap years, varying month lengths, and other calendar complexities automatically. Results may show duration in years, months, weeks, days, hours, minutes, or a combination depending on the calculation type. Some date-time calculators also offer options to exclude weekends or holidays for business day calculations.`
  }

  if (calc.category === 'construction') {
    return `Using the ${calc.title} starts with measuring your project area or space. Enter dimensions like length, width, depth, and height in your preferred units (feet, inches, meters, etc.). The calculator will also ask for project-specific details such as material type, waste factor, and cost per unit. As you fill in each field, the estimate updates in real time. Review the breakdown of materials needed, total cost, and any important notes about minimum order quantities or recommended overages. Adjust your inputs to compare different material options or project sizes.`
  }

  if (calc.category === 'statistics') {
    return `To use the ${calc.title}, enter your data values separated by commas, spaces, or line breaks. The calculator accepts any number of data points. As you enter or modify values, the statistical measures update instantly. Most statistics calculators display the mean, median, mode, range, variance, and standard deviation. Some also show additional measures like quartiles, interquartile range, and data distribution visualizations. You can add or remove data points freely to see how each value affects the overall statistics. For large data sets, paste the values directly from a spreadsheet.`
  }

  if (calc.category === 'education') {
    return `Using the ${calc.title} is easy. Enter your grades, scores, or credit hours into the input fields. For GPA calculations, select the appropriate grading scale (4.0, 5.0, percentage, etc.). For grade calculations, enter the weight or percentage of each assignment category. As you input values, the calculator instantly computes your current average, projected final grade, or GPA. Many education calculators also allow you to calculate what score you need on remaining assignments to reach a target grade. Results update in real time as you adjust any input.`
  }

  if (calc.category === 'physics') {
    return `To use the ${calc.title}, enter the known physical quantities into the labeled fields. The calculator will identify which values are needed based on the physics principle being applied. Select your preferred unit system (SI or imperial) before entering values. The calculator handles unit conversions automatically, so you can mix units if needed. Results are displayed with appropriate significant figures and units. Many physics calculators include a step-by-step breakdown showing how each formula is applied, making them excellent learning tools for students.`
  }

  if (calc.category === 'chemistry') {
    return `Using the ${calc.title} requires entering the chemical values relevant to your calculation. This might include element symbols, quantities in grams or moles, concentration values, or temperature. The calculator uses up-to-date standard atomic weights and chemical constants. Select the appropriate units from the dropdown menus to ensure accuracy. Results are displayed with appropriate significant figures based on the precision of your inputs. The tool handles common chemistry calculations including molar mass, solution concentrations, stoichiometric ratios, and reaction parameters.`
  }

  if (calc.category === 'engineering') {
    return `To use the ${calc.title}, enter your engineering parameters into the input fields. These may include dimensions, material properties, loads, voltages, pressures, or other engineering values. Select the appropriate unit system for your work. The calculator applies professional engineering formulas and standards to compute your results. Review the output carefully and verify that the values make sense for your application. The ${st} is suitable for preliminary design calculations, educational purposes, and quick verification of more detailed analyses.`
  }

  if (calc.category === 'everyday') {
    return `Using the ${calc.title} is quick and intuitive. Enter your values into the labeled input fields — these might be dollar amounts, percentages, quantities, or other everyday numbers. The calculator processes your inputs and displays the result instantly. Adjust any value to see how the result changes, making it easy to explore different scenarios. Results can typically be copied to your clipboard with one click. The ${st} is designed for practical everyday situations and requires no special knowledge to use effectively.`
  }

  if (calc.category === 'food') {
    return `To use the ${calc.title}, enter your ingredients, quantities, or nutritional values. For recipe scaling, enter the original and desired serving sizes. For nutritional calculations, enter the food item and portion size. The calculator uses standardized data such as USDA nutritional databases to provide accurate estimates. Results update in real time as you adjust your inputs. The tool handles various measurement units including volume (cups, tablespoons, milliliters) and weight (grams, ounces). Adjust serving sizes or ingredient amounts freely to explore different combinations.`
  }

  if (calc.category === 'biology') {
    return `Using the ${calc.title} requires entering biological parameters relevant to your calculation. Input values such as population counts, cell numbers, genetic data, or experimental measurements. The calculator applies established biological formulas from peer-reviewed research. Select the appropriate units for each input. Results are displayed with appropriate precision for scientific work. The ${st} is suitable for students learning biology concepts, researchers doing preliminary calculations, and educators demonstrating biological principles.`
  }

  if (calc.category === 'ecology') {
    return `To use the ${calc.title}, enter your ecological or environmental data such as population counts, area measurements, species numbers, or resource usage values. The calculator applies standard ecological models and environmental science formulas. Select the appropriate units and measurement standards for your region. Results update in real time as you adjust inputs, allowing you to explore different scenarios. The ${st} helps you understand environmental impacts, biodiversity measures, and ecological relationships for educational and preliminary assessment purposes.`
  }

  if (calc.category === 'sports') {
    return `Using the ${calc.title} is straightforward. Enter your performance metrics such as distance, time, heart rate, or physical measurements. The calculator applies sports science formulas to give you insights into your performance, training zones, or fitness level. Select the appropriate units and activity type where applicable. Results update instantly as you adjust inputs, helping you understand how different paces, distances, or effort levels affect your performance. Use the ${st} to plan workouts, set goals, and track improvements over time.`
  }

  return `To use the ${calc.title}, enter the required values into the labeled input fields on the calculator form. The calculator processes your inputs and displays the results instantly. Adjust any value to see how the outcome changes. The tool is designed to be intuitive and requires no special training to use. All input fields are clearly labeled, and results are displayed in an easy-to-read format.`
}

function generateFormulaSection(calc: CalculatorEntry): string {
  const formula = getCalcFormula(calc)
  const st = shortTitle(calc.title)

  let formulaDesc = `The ${st} uses a standard calculation method to compute your results. `

  if (calc.formulaSource) {
    formulaDesc += `The formula applied is: ${calc.formulaSource}. This means the result is derived by plugging your input values into this established mathematical relationship. `
  } else if (formulaSource[calc.slug]) {
    formulaDesc += `The core formula is: ${formulaSource[calc.slug]}. Each variable in this equation represents one of the inputs you provide — such as principal amounts, interest rates, time periods, or other numerical values. `
  } else {
    formulaDesc += `The calculator applies the appropriate mathematical relationship based on your inputs and the type of calculation being performed. `
  }

  formulaDesc += `Each variable in the formula corresponds to a labeled input field in the calculator above. By changing any variable, you can see how it affects the final result. This makes it easy to understand the relationship between different factors and to optimize for your desired outcome. Understanding the formula helps you make more informed decisions and gives you confidence in the accuracy of your results.`

  if (calc.category === 'conversion') {
    formulaDesc = `The ${st} relies on internationally recognized conversion factors to produce accurate results. ${calc.formulaSource ? `The conversion applies the formula: ${calc.formulaSource}.` : 'Each unit pair has a specific conversion factor — a constant multiplier that precisely defines the relationship between the two units.'} These factors are derived from international standards maintained by organizations like NIST and BIPM. The calculator multiplies your input value by the appropriate conversion factor to deliver the result. Because conversion factors are exact mathematical constants, the results are highly precise. This is far more reliable than relying on memory or approximate conversions.`
  }

  return formulaDesc
}

function generateExampleSection(calc: CalculatorEntry): string {
  const { scenario, inputs, steps, result } = getExampleValue(calc)
  const st = shortTitle(calc.title)

  let text = `Let us walk through a practical example of ${detailTitle(calc).replace(/^the /, '')} using the ${calc.title}.`

  text += `\n\nScenario: ${scenario}.\n\nInput values:\n`
  for (const [key, val] of Object.entries(inputs)) {
    text += `  - ${key}: ${val}\n`
  }

  text += `\nStep-by-step calculation:\n`
  steps.forEach((step, i) => {
    text += `\n  ${i + 1}. ${step}`
  })

  text += `\n\nFinal result: ${result}`

  return text
}

function generateUseCases(calc: CalculatorEntry): string[] {
  const st = shortTitle(calc.title)

  if (calc.category === 'financial') {
    if (calc.slug.includes('mortgage') || calc.slug.includes('loan') || calc.slug.includes('amortization') || calc.slug.includes('refinance') || calc.slug.includes('home-affordability')) {
      return [
        `Home buyers comparing mortgage options: Use the ${st} to compare different loan amounts, interest rates, and term lengths side by side. See how a 30-year fixed compares to a 15-year term, or how a slightly lower rate affects your monthly payment`,
        `Homeowners considering refinancing: Enter your current loan details alongside potential new rates to calculate monthly savings and determine the break-even point where closing costs are recovered`,
        `Real estate investors analyzing rental properties: Calculate debt service coverage ratios and cash flow projections for investment property purchases. Compare financing options to maximize return on investment`,
        `First-time home buyers setting a budget: Determine how much house you can afford based on your income, existing debts, down payment savings, and current interest rates. Get a realistic price range before house hunting`,
        `Comparing 15-year vs 30-year mortgage terms: Use the ${st} to see how a shorter term increases monthly payments but saves tens of thousands in total interest over the life of the loan`,
        `Adjustable-rate mortgage analysis: Model how rate adjustments over time could affect your payments with an ARM. Compare worst-case scenarios against fixed-rate stability to decide which is right for you`,
        `Single-income home affordability: Calculate exactly how much house you can afford on one salary. Factor in your debt-to-income ratio, down payment, and local property tax rates for a realistic budget`,
        `Second home and investment property financing: Determine the higher down payment and interest rate requirements for a second home or rental property. Compare owner-occupied vs non-owner-occupied loan terms`,
        `FHA, VA, and conventional loan comparison: Evaluate how different loan programs affect your monthly payment, upfront costs, and mortgage insurance requirements. Find the best program for your situation`,
        `Mortgage pre-approval preparation: Before meeting with lenders, use the ${st} to estimate what loan amount you qualify for. Walk into pre-approval appointments with a clear target price range`,
      ]
    }
    if (calc.slug.includes('retirement') || calc.slug.includes('401k') || calc.slug.includes('ira')) {
      return [
        `Young professionals starting retirement planning: Project how your savings will grow over 30-40 years. See the dramatic impact of starting early and the cost of delaying even a few years`,
        `Mid-career workers catching up: Determine if your current savings rate is on track and how much more you need to save each month to reach your retirement goals. Factor in employer matching and catch-up contributions`,
        `Pre-retirees fine-tuning their strategy: In the final years before retirement, calculate whether your nest egg is sufficient. Use the 4% withdrawal rule to estimate sustainable retirement income`,
        `Couples planning together: Compare different savings scenarios, retirement ages, and lifestyle expectations. See how dual incomes and combined savings affect your retirement timeline`,
        `Roth vs traditional retirement account comparison: Use the ${st} to model how tax treatment differences affect your nest egg. See whether paying taxes now or later maximizes your after-tax retirement income`,
        `Social Security optimization: Estimate your retirement income gap by factoring in projected Social Security benefits. Decide whether to claim early at 62, wait until full retirement age, or delay until 70`,
        `Employer 401(k) match maximization: Calculate the exact contribution needed to capture your full employer match. See how leaving free money on the table impacts your long-term retirement savings growth`,
        `Early retirement (FIRE) feasibility: Determine the savings rate and nest egg target needed to retire before age 60. Model aggressive saving scenarios and see how early you could achieve financial independence`,
        `Retirement withdrawal strategy planning: Test different withdrawal rates and portfolio allocations to see how long your savings might last. Plan for sequence-of-return risk in the early years of retirement`,
        `Inflation-adjusted retirement projections: Use the ${st} to model how inflation erodes purchasing power over a 20-30 year retirement. Ensure your savings target accounts for rising costs of living and healthcare`,
      ]
    }
    if (calc.slug.includes('budget') || calc.slug.includes('net-worth')) {
      return [
        `Monthly financial check-ins: Track your income against expenses to identify spending patterns and opportunities to save. Regular budget reviews help you stay on top of your financial goals`,
        `Preparing for a major life change: Before a job change, move, or other transition, use the ${st} to understand how your finances will be affected. Model different scenarios to plan ahead`,
        `Debt reduction planning: See exactly how much of your income goes to debt payments and calculate how accelerating payments could save thousands in interest over time`,
        `Family financial planning: Involve your whole family in budget discussions with clear numbers. Set savings goals for vacations, education, emergencies, and major purchases`,
        `Zero-based budgeting setup: Allocate every dollar of income to specific expense categories, savings, or debt payments using the ${st}. Ensure your budget balances to zero and every dollar has a purpose`,
        `Net worth tracking over time: Use the ${st} to regularly calculate your net worth by totaling assets minus liabilities. Monitor progress quarter over quarter to stay motivated toward wealth-building goals`,
        `Emergency fund adequacy check: Determine how many months of essential expenses your current savings cover. Use the calculator to set a specific savings target for a 3-month, 6-month, or 12-month emergency fund`,
        `Expense categorization audit: Group your spending into fixed costs, variable expenses, and discretionary items. Use the ${st} to identify which categories consume the largest share of your income`,
        `Side-hustle income integration: Model how additional income from freelancing, a part-time job, or a small business affects your overall budget. Plan how to allocate extra earnings between savings and spending`,
        `Retirement budget projection: Estimate your monthly expenses in retirement by adjusting your current budget for changes in housing, healthcare, transportation, and lifestyle. Use the ${st} to see if your expected retirement income covers your needs`,
      ]
    }
    if (calc.slug.includes('investment') || calc.slug.includes('compound-interest') || calc.slug.includes('roi')) {
      return [
        `Long-term wealth building: Project how regular investments in stocks, bonds, or mutual funds can grow over decades. See the power of compound interest and consistent contributions`,
        `Education savings planning: Calculate how much you need to save monthly to reach college funding goals. Compare 529 plans, Coverdell ESAs, and other education savings vehicles`,
        `Retirement account optimization: Compare traditional vs Roth IRA growth projections. See how taxes at withdrawal affect your net retirement income under different account types`,
        `Goal-based investing: Whether saving for a down payment, a dream vacation, or a business startup, use the ${st} to determine the monthly investment needed to reach your target by a specific date`,
        `Dividend reinvestment analysis: Use the ${st} to model how reinvesting dividends accelerates portfolio growth over time. Compare the total return of dividend-paying stocks with and without dividend reinvestment`,
        `Dollar-cost averaging vs lump sum: Simulate investing a lump sum all at once versus spreading contributions over several months. Use the calculator to see how market timing risk affects long-term returns`,
        `Risk-adjusted return comparison: Compare the projected growth of conservative, moderate, and aggressive portfolio allocations. Use the ${st} to see how asset allocation affects both potential returns and volatility`,
        `Inflation-adjusted investment targets: Calculate the real (inflation-adjusted) return on your investments to understand true purchasing power growth. Set nominal savings targets that account for 2-3% annual inflation`,
        `Compound frequency impact: See how daily, monthly, quarterly, and annual compounding affect your investment growth. Use the ${st} to understand why more frequent compounding accelerates wealth accumulation`,
        `Taxable vs tax-advantaged account comparison: Model the after-tax growth of investments in a taxable brokerage account versus a Roth IRA or traditional IRA. See how tax drag reduces compounding in taxable accounts`,
      ]
    }
    if (calc.slug.includes('tax') || calc.slug.includes('income-tax')) {
      return [
        `Annual tax planning: Estimate your tax liability before filing to avoid surprises. Adjust withholding or make estimated payments to stay on track throughout the year`,
        `Comparing filing statuses: See how married filing jointly vs separately affects your tax bill. Plan for life events that change your filing status`,
        `Tax strategy for investors: Calculate how capital gains, dividends, and interest income affect your overall tax burden. Plan tax-loss harvesting or Roth conversions strategically`,
        `Side hustle and freelance tax planning: Estimate self-employment tax and quarterly payment requirements. See how business deductions reduce your taxable income`,
        `Paycheck withholding optimization: Use the ${st} to ensure the right amount is withheld from each paycheck. Avoid large refunds (interest-free loan to the government) or surprise tax bills at filing time`,
        `Tax bracket estimation: Determine which federal and state tax brackets your income falls into. Use the calculator to understand your marginal rate and how additional income would be taxed`,
        `Itemized vs standard deduction comparison: Calculate whether itemizing deductions for mortgage interest, charitable contributions, and medical expenses exceeds the standard deduction for your filing status`,
        `Estimated tax payment planning for freelancers: Use the ${st} to calculate quarterly estimated tax payments based on projected annual income. Avoid underpayment penalties by paying the right amount each quarter`,
        `Tax credit eligibility check: Estimate how tax credits like the Child Tax Credit, Earned Income Tax Credit, or education credits reduce your tax liability. Use the calculator to see how credits phase out at higher income levels`,
        `Roth conversion tax impact: Model the tax cost of converting traditional IRA funds to a Roth IRA. Use the ${st} to see how a conversion in a lower-income year could save taxes over the long term`,
      ]
    }
    if (calc.slug.includes('salary') || calc.slug.includes('hourly')) {
      return [
        `Job offer evaluation: Compare salary offers by converting between hourly, monthly, and annual figures. Factor in benefits, bonuses, and other compensation to see the full picture`,
        `Freelance rate setting: Determine your equivalent hourly rate based on a target annual income, accounting for non-billable time, taxes, and business expenses`,
        `Budget planning: Convert your salary to monthly and biweekly amounts for accurate budget planning. Know exactly how much each paycheck will be after common deductions`,
        `Career change analysis: See how a shift from salaried to hourly work (or vice versa) affects your total compensation. Factor in overtime potential or reduced hours`,
        `Overtime earnings projection: Use the ${st} to calculate how overtime hours at time-and-a-half or double-time boost your annual income. Decide whether the extra pay is worth the additional hours`,
        `Salary negotiation preparation: Calculate the minimum acceptable offer based on your current compensation, cost of living changes, and new role responsibilities. Walk into negotiations with a data-backed target`,
        `Cost of living salary adjustment: Compare how far your salary goes in different cities by factoring in housing costs, taxes, and regional price differences. Use the ${st} to determine a fair relocation salary`,
        `Hourly vs salary break-even analysis: Determine the hourly rate equivalent of a salaried position including benefits value, paid time off, and job security. Compare offers on equal footing`,
        `Part-time and reduced hours planning: Calculate how reducing your hours affects your take-home pay and benefits eligibility. Use the ${st} to find the sweet spot between income and flexibility`,
        `Commission and bonus impact: Add expected commissions, performance bonuses, and profit-sharing to your base salary. Use the calculator to model best-case, expected, and conservative total compensation scenarios`,
      ]
    }
  }

  if (calc.category === 'health') {
    if (calc.slug.includes('bmi')) {
      return [
        `Health screening: Use the ${st} as a preliminary screening tool to understand your weight category and potential health risks associated with being underweight, overweight, or obese`,
        `Fitness progress tracking: Track your BMI over time to see how changes in diet and exercise affect your body composition. Monthly measurements help you stay motivated`,
        `Doctor visit preparation: Have your current BMI ready before appointments to discuss weight-related health concerns with your healthcare provider more effectively`,
        `Weight management goal setting: Determine a healthy target weight range for your height and set realistic weight loss or gain goals based on BMI categories`,
        `Children's BMI percentile monitoring: Use the ${st} to calculate a child's BMI percentile based on age and gender. Pediatricians use percentiles rather than raw BMI to assess growth patterns in children`,
        `Pre-pregnancy weight assessment: Check your BMI before conception to understand how your weight category may affect pregnancy risks and outcomes. Discuss optimal weight range with your healthcare provider`,
        `Senior BMI considerations: Understand how BMI standards shift for older adults, where slightly higher BMIs may be associated with better outcomes. Use the ${st} as a starting point for a broader health discussion`,
        `Athlete BMI interpretation: If you have high muscle mass, learn why BMI may overestimate body fat for athletic individuals. Use the ${st} alongside body fat measurements for a more complete picture`,
        `Waist-to-height ratio comparison: Complement your BMI calculation with a waist-to-height ratio assessment. Use the ${st} along with other metrics to get a fuller understanding of your health status`,
        `Weight loss journey milestone tracking: Set intermediate BMI targets as milestones on your weight loss journey. Celebrate each category improvement — moving from obese to overweight, or overweight to normal range`,
      ]
    }
    if (calc.slug.includes('calorie') || calc.slug.includes('bmr') || calc.slug.includes('tdee')) {
      return [
        `Weight loss planning: Calculate your maintenance calories and create a sustainable deficit of 300-500 calories per day for steady weight loss of 0.5-1 lb per week`,
        `Muscle building: Determine the calorie surplus needed to support muscle growth while minimizing fat gain. Adjust protein and carbohydrate targets for optimal results`,
        `Activity adjustment: See how increasing your exercise frequency or intensity changes your daily calorie needs. Plan refeed days around harder training sessions`,
        `Meal planning: Use your daily calorie target to plan balanced meals throughout the day. Ensure you are meeting your energy needs while staying within your goals`,
        `Macronutrient split optimization: Use the ${st} alongside your calorie target to set protein, carbohydrate, and fat ratios. Adjust macros for keto, paleo, high-protein, or balanced eating approaches`,
        `BMR-based metabolism tracking: Calculate your Basal Metabolic Rate to understand the calories your body burns at rest. Use this as a baseline for setting accurate calorie goals whether cutting, maintaining, or bulking`,
        `TDEE for shift workers: Adjust your Total Daily Energy Expenditure calculation for non-standard sleep schedules and irregular activity patterns. Use the ${st} to find accurate calorie targets despite variable routines`,
        `Post-weight-loss maintenance calories: After reaching your goal weight, recalculate your maintenance calorie level. Use the ${st} to transition smoothly from a cutting phase to a sustainable maintenance plan`,
        `Competition prep calorie cycling: Plan calorie and carbohydrate timing around training sessions for bodybuilding or athletic competition. Use the ${st} to structure refeed days and peak week adjustments`,
        `Intermittent fasting schedule planning: Determine how your eating window affects daily calorie intake and meal sizes. Use the ${st} to ensure you meet nutritional needs within a restricted feeding period`,
      ]
    }
    if (calc.slug.includes('heart-rate')) {
      return [
        `Cardio workout optimization: Train in the right heart rate zone for your goal — Zone 2 for endurance, Zone 4 for speed, Zone 5 for peak performance`,
        `Recovery monitoring: Track your resting heart rate over time. A lower resting heart rate often indicates improved cardiovascular fitness`,
        `Race pace planning: Use heart rate zones to pace yourself during races. Stay in Zone 2-3 for long events to avoid early fatigue`,
        `Fitness level assessment: Compare your heart rate response to exercise against age-matched norms. Improvements in recovery time indicate growing fitness`,
        `Maximum heart rate verification: Use the ${st} to estimate your age-predicted max heart rate. Compare this with field test results to determine your true maximum for accurate zone calculations`,
        `Heart rate variability tracking: Monitor changes in resting heart rate day to day as an indicator of recovery status. Use the ${st} to identify when you are fully recovered versus still fatigued from previous training`,
        `Fat-burning zone targeting: Identify the heart rate range where your body burns the highest percentage of fat for fuel. Use the ${st} to stay in the optimal fat-burning zone during steady-state cardio`,
        `Altitude-adjusted heart rate: Understand how training at higher altitudes affects your heart rate response. Use the ${st} to adjust your target zones when traveling to train or compete at elevation`,
        `Age-graded heart rate comparison: Compare your heart rate performance against age-adjusted norms using the ${st}. See how your cardiovascular fitness stacks up relative to others your age`,
        `Interval training heart rate recovery: Track how quickly your heart rate recovers between high-intensity intervals. Use the ${st} to measure recovery rate improvements over time as a marker of increasing fitness`,
      ]
    }
    if (calc.slug.includes('body-fat')) {
      return [
        `Body composition tracking: Go beyond the scale by measuring body fat percentage. Track changes in composition rather than just weight for a more accurate picture of progress`,
        `Fitness goal setting: Set realistic body fat targets based on your gender and age. Understand what ranges are considered essential, athletic, and average`,
        `Progress photography correlation: Pair body fat measurements with progress photos to visually track how changes in body composition affect your appearance`,
        `Health risk assessment: Monitor body fat as a key health indicator. Higher body fat percentages are associated with increased risk of metabolic conditions`,
        `Lean body mass calculation: Use the ${st} to determine your fat-free mass, which includes muscle, bone, and organs. Track whether weight changes come from fat loss or muscle gain during your fitness journey`,
        `Navy body fat method measurement: Use circumference-based measurements at the neck, waist, and hips to estimate body fat percentage. The ${st} applies the US Navy formula for a quick, accessible assessment`,
        `Body fat percentage for military standards: Check whether your body fat meets branch-specific requirements for the Army, Navy, Air Force, or Marines. Use the ${st} to ensure you are within regulation limits before your assessment`,
        `Cutting phase monitoring: During a calorie deficit for fat loss, use the ${st} to ensure you are losing fat while preserving muscle. Track body fat percentage weekly to adjust calories and training as needed`,
        `Bulk vs cut decision guide: Use body fat percentage to decide whether to start a muscle-building bulk or a fat-loss cut. The ${st} helps you determine the right body fat range for your current phase`,
        `Age-related body fat changes: Understand how body fat naturally increases with age even if weight stays the same. Use the ${st} to set age-appropriate body fat targets and track changes over the years`,
      ]
    }
    if (calc.slug.includes('pregnancy') || calc.slug.includes('due-date') || calc.slug.includes('ovulation')) {
      return [
        `Family planning: Track your menstrual cycle and ovulation window to identify the most fertile days for conception. Plan accordingly with your partner`,
        `Pregnancy milestone tracking: Follow your pregnancy week by week with accurate dating. Know when to expect key milestones and prenatal screenings`,
        `Due date preparation: Use the estimated due date to plan maternity leave, prepare the nursery, and schedule important prenatal appointments`,
        `Conception timing optimization: Combine ovulation prediction with optimal timing for conception. Track basal body temperature and cycle patterns for best results`,
        `Ovulation and fertile window identification: Use the ${st} to pinpoint your most fertile days each cycle. Time intercourse around ovulation to maximize the chances of conception each month`,
        `Pregnancy week-by-week development guide: Track fetal development milestones corresponding to each week of pregnancy. Use the ${st} to understand what is happening at each stage of your pregnancy journey`,
        `Gestational age calculation from LMP: Calculate how far along you are based on your last menstrual period. The ${st} provides accurate dating to help you and your healthcare provider plan prenatal care`,
        `Due date probability distribution: Understand that only about 5% of babies arrive exactly on their due date. Use the ${st} to see the likely delivery window spanning several weeks around the estimated due date`,
        `Ovulation tracking for irregular cycles: If your cycles vary in length, the ${st} helps estimate ovulation timing despite irregularity. Combine with ovulation predictor kits for more accurate results`,
        `Trimester transition planning: Know exactly when you enter each trimester and what prenatal screenings are recommended. Use the ${st} to plan ahead for first-trimester, second-trimester, and third-trimester milestones`,
      ]
    }
  }

  if (calc.category === 'math') {
    if (calc.slug.includes('percentage')) {
      return [
        `Shopping and discounts: Quickly calculate sale prices and savings percentages when shopping. Compare deals to find the best value`,
        `Tip calculation: Compute appropriate gratuity amounts at restaurants based on service quality. Split tips evenly among parties`,
        `Grade computation: Calculate your percentage score on exams and assignments. Determine what percentage of your grade each component represents`,
        `Business analysis: Calculate profit margins, markup percentages, and growth rates. Understand the percentage change in sales, revenue, or costs over time`,
        `Investment return analysis: Use the ${st} to calculate percentage gains or losses on investments. Compare annualized returns across different assets and time periods for apples-to-apples performance evaluation`,
        `Sales tax and VAT calculation: Quickly add or remove sales tax from purchase prices. Use the ${st} to determine the pre-tax amount or the total including tax for accurate budgeting`,
        `Commission and fee calculations: Determine commission amounts based on percentage rates for real estate, sales, or affiliate earnings. Use the ${st} to calculate exactly what you will earn or owe`,
        `Percentage increase and decrease: Calculate year-over-year growth rates, price changes, or population changes using the ${st}. Understand both the raw difference and the percentage change for meaningful comparisons`,
        `Loan APR and interest rate conversion: Convert between annual percentage rates and monthly, quarterly, or daily interest rates. Use the ${st} to compare loan offers with different compounding frequencies`,
        `Survey and poll result analysis: Calculate the percentage of respondents who selected each option in a survey. Use the ${st} to present results as clear percentages for reports and presentations`,
      ]
    }
    if (calc.slug.includes('pythagorean') || calc.slug.includes('triangle') || calc.slug.includes('geometry')) {
      return [
        `Construction and carpentry: Verify right angles, calculate diagonal lengths, and determine material quantities for framing, decking, and other projects`,
        `Navigation and mapping: Calculate straight-line distances between coordinates, determine shortest paths, and plan efficient routes`,
        `Design and graphics: Compute aspect ratios, diagonal screen sizes, and proportional scaling for digital and print design projects`,
        `Physics and engineering: Solve for unknown sides or angles in force diagrams, structural analyses, and kinematic problems`,
        `Ramp and stair stringer layout: Use the ${st} to calculate the hypotenuse of a right triangle formed by rise and run. Determine accurate stringer lengths for stair construction or ramp slope verification`,
        `TV and monitor size comparison: Calculate the diagonal screen size from width and height measurements, or find the width and height from a known diagonal and aspect ratio. Use the ${st} to compare TV sizes before buying`,
        `Land survey and property boundary: Calculate straight-line distances between survey points on a property. Use the ${st} to verify boundary lengths and diagonal measurements for fencing or landscaping plans`,
        `Roof pitch and rafter length: Determine rafter length from the roof rise and run using the Pythagorean theorem. Use the ${st} to order the correct amount of lumber for roofing projects`,
        `3D modeling and game development: Calculate distances between 3D coordinates, vector magnitudes, and collision detection boundaries. Use the ${st} for quick geometry checks during development`,
        `Ladder placement safety: Determine the correct distance a ladder base should be from a wall based on the 4:1 rule and ladder height. Use the ${st} to verify safe ladder angles for working at height`,
      ]
    }
  }

  if (calc.category === 'conversion') {
      return [
        `Travel planning: Quickly convert between local units and the ones you are familiar with when traveling abroad. Understand distances, temperatures, weights, and volumes in your home units`,
        `Cooking and baking: Convert recipe measurements between metric and imperial units. Scale ingredients accurately for different serving sizes`,
        `Academic work: Complete homework and lab assignments that require unit conversions. Verify your manual calculations against the tool for accuracy`,
        `Professional use: Engineers, scientists, and technicians regularly convert between units in their work. Use the ${st} for quick reliable conversions without looking up factors`,
        `Online shopping: When buying products from international sellers, convert dimensions, weights, and other specifications to familiar units`,
        `Fitness and health tracking: Convert between pounds and kilograms for weight tracking, or between miles and kilometers for running and cycling distances. Use the ${st} to keep your fitness data consistent across apps and regions`,
        `DIY and home improvement: Convert between metric and imperial measurements when using tools, plans, or materials from different countries. The ${st} ensures accuracy when mixing measurement systems on a project`,
        `Currency conversion for international transactions: Get quick currency conversions when shopping, traveling, or sending money abroad. Use the ${st} to understand the real cost of purchases in foreign currencies`,
        `Temperature conversion for weather and cooking: Convert between Celsius, Fahrenheit, and Kelvin for weather forecasts, oven temperatures, or scientific experiments. The ${st} handles all three scales accurately`,
        `Fuel economy conversion: Convert between miles per gallon, liters per 100 kilometers, and kilometers per liter. Use the ${st} to compare vehicle efficiency across different measurement systems when car shopping`,
      ]
  }

  if (calc.category === 'date-time') {
      return [
        `Project planning: Calculate the duration between project start and end dates. Determine milestone dates and track progress against the timeline`,
        `Age calculation: Compute exact age in years, months, and days for applications, legal documents, or birthday planning`,
        `Event countdown: Determine exactly how many days, hours, and minutes remain until a special event like a wedding, vacation, or deadline`,
        `Business scheduling: Calculate working days excluding weekends and holidays for delivery timelines, contract periods, and project deadlines`,
        `Historical research: Find the exact time elapsed between historical events or personal milestones spanning months or years`,
        `Tenure and employment duration: Calculate your exact length of employment at a company for your resume or job applications. Use the ${st} to compute years, months, and days of service accurately`,
        `Subscription and warranty tracking: Determine when a subscription, warranty, or contract expires based on the start date and term length. Use the ${st} to avoid late renewal fees or lapsed coverage`,
        `Pregnancy due date and gestational age: Calculate the estimated due date from conception or last menstrual period. Use the ${st} to track gestational age week by week throughout pregnancy`,
        `Business quarter and fiscal year planning: Calculate the number of working days remaining in the current quarter or fiscal year. Use the ${st} to plan sales targets, budget spending, and project deadlines`,
        `Age difference computation: Calculate the exact age difference between two people in years, months, and days. Use the ${st} for legal age requirements, relationship milestones, or generational analysis`,
      ]
  }

  if (calc.category === 'construction') {
      return [
        `Home renovation planning: Estimate material quantities for flooring, tiling, painting, and other home improvement projects. Avoid over-ordering or running short`,
        `Contractor bidding: Prepare accurate material and cost estimates for client bids. Include appropriate waste factors and regional price adjustments`,
        `DIY project budgeting: Before starting a project, get a realistic estimate of material costs. Decide whether to DIY or hire a professional based on the numbers`,
        `Material ordering: Determine the exact quantity of concrete, lumber, drywall, or other materials needed. Minimize waste and avoid costly return trips to the store`,
        `Concrete slab and foundation calculation: Calculate the cubic yards of concrete needed for a slab, footing, or column based on dimensions. Use the ${st} to order the right amount and avoid expensive short loads`,
        `Flooring material estimation: Determine how many boxes of hardwood, laminate, or tile you need based on room dimensions. Use the ${st} to account for room shape, waste factor, and pattern matching requirements`,
        `Paint and drywall coverage: Calculate gallons of paint or sheets of drywall needed for walls and ceilings. Use the ${st} to factor in multiple coats, texture types, and ceiling height adjustments`,
        `Deck and patio material planning: Estimate lumber, decking boards, fasteners, and stain quantities for outdoor projects. Use the ${st} to plan deck joist spacing, railing requirements, and stair materials`,
        `Roofing material takeoff: Calculate squares of shingles, underlayment, and flashing needed for a roof based on square footage and pitch. Use the ${st} to bid roofing jobs accurately with waste factored in`,
        `Fencing and landscaping materials: Determine linear feet of fencing, cubic yards of mulch or soil, and number of posts needed for yard projects. Use the ${st} to budget and order landscape materials precisely`,
      ]
  }

  if (calc.category === 'statistics') {
      return [
        `Academic research: Analyze experimental data sets to find central tendencies and variability. Report descriptive statistics in research papers and theses`,
        `Business analytics: Evaluate sales data, customer metrics, and operational performance. Identify trends, outliers, and patterns in business data`,
        `Quality control: Monitor manufacturing processes by analyzing measurement data. Detect when processes drift outside acceptable parameters`,
        `Sports performance analysis: Track athlete statistics across games or seasons. Identify consistent performers and measure variability in performance`,
        `Survey data analysis: Calculate mean, median, mode, and standard deviation from survey responses. Use the ${st} to summarize large data sets and identify trends in customer feedback or opinion polling`,
        `Financial data analysis: Analyze stock price volatility, portfolio return distributions, and risk metrics using statistical measures. Use the ${st} to calculate standard deviation and variance of investment returns`,
        `Grade distribution analysis: Determine the mean, median, and grade distribution for a class or exam. Use the ${st} to curve grades, identify struggling students, and assess assessment difficulty`,
        `Process capability analysis: Calculate Cp and Cpk indices to determine whether a manufacturing process is capable of meeting specifications. Use the ${st} alongside standard deviation to evaluate process performance`,
        `Market research and A/B testing: Calculate confidence intervals and statistical significance for A/B test results. Use the ${st} to determine whether observed differences in conversion rates are statistically meaningful`,
        `Demographic data summarization: Calculate average age, income, or other demographic measures across population segments. Use the ${st} to summarize census data or market research for reporting and planning`,
      ]
  }

  if (calc.category === 'education') {
      return [
        `Semester planning: Calculate your current GPA and determine what grades you need in remaining courses to reach your target GPA`,
        `Final exam preparation: Use the grade calculator to determine the minimum score needed on final exams to achieve your desired course grade`,
        `Course selection: Compare how different courses with varying credit hours and expected grades would affect your overall GPA`,
        `Graduation requirement tracking: Ensure you are on track to meet minimum GPA requirements for graduation, honors, or program admission`,
        `Weighted vs unweighted GPA calculation: Determine your GPA on both weighted and unweighted scales. Use the ${st} to understand how honors, AP, and IB courses affect your GPA differently on each scale`,
        `Cumulative GPA projection: Project what your cumulative GPA will be after completing current and future semesters. Use the ${st} to plan your academic trajectory and set semester-by-semester grade targets`,
        `Scholarship eligibility check: Calculate whether your GPA meets minimum requirements for merit-based scholarships and grants. Use the ${st} to determine the GPA needed to maintain or regain scholarship eligibility`,
        `Repeated course GPA recalculation: Calculate how retaking a course affects your GPA under your school's grade replacement or averaging policy. Use the ${st} to plan course retakes strategically`,
        `Transfer GPA calculation: Convert your GPA from one grading scale to another when transferring between schools. Use the ${st} to understand how your grades translate under a different institution's grading system`,
        `Midterm grade assessment: Use the ${st} before midterms to determine what grades you need on midterm exams to stay on track. Adjust study priorities based on which courses need the most attention`,
      ]
  }

  if (calc.category === 'physics') {
      return [
        `Homework and exam prep: Verify your physics problem solutions and understand the step-by-step reasoning behind each calculation`,
        `Engineering design: Apply physics principles to real-world design problems. Calculate forces, energies, and motion parameters for mechanical systems`,
        `Science fair projects: Perform accurate calculations for experiments and demonstrations. Validate theoretical predictions against measured results`,
        `Personal curiosity: Explore the physics behind everyday phenomena. Calculate the energy in a moving car, the force required to lift an object, or the acceleration due to gravity`,
        `Projectile motion analysis: Calculate launch angles, initial velocities, maximum height, and range for projectiles. Use the ${st} to solve physics problems involving ballistic trajectories and parabolic motion`,
        `Kinematics problem solving: Compute displacement, velocity, acceleration, and time using the kinematic equations. Use the ${st} to verify solutions for constant acceleration problems in one and two dimensions`,
        `Work, energy, and power calculations: Determine the work done by a force, kinetic and potential energy changes, and power output. Use the ${st} for mechanics problems involving energy conservation and transfer`,
        `Circular motion and centripetal force: Calculate centripetal acceleration, force requirements, and orbital velocities for objects in circular motion. Use the ${st} to analyze roller coasters, satellites, and rotating systems`,
        `Momentum and impulse analysis: Solve collision and explosion problems using conservation of momentum. Use the ${st} to calculate impulse, momentum changes, and final velocities in elastic and inelastic collisions`,
        `Fluid mechanics and buoyancy: Calculate buoyant force, fluid pressure at depth, and flow rates using fluid dynamics principles. Use the ${st} for physics problems involving Archimedes' principle and Bernoulli's equation`,
      ]
  }

  if (calc.category === 'chemistry') {
      return [
        `Lab preparation: Calculate the exact amounts of reagents needed for experiments. Prepare solutions with precise molar concentrations`,
        `Homework verification: Check your chemistry problem solutions and understand the relationship between different chemical quantities`,
        `Research calculations: Perform routine chemical computations for research projects including yields, concentrations, and reaction stoichiometry`,
        `Green chemistry: Calculate reaction efficiencies and atom economy to design more sustainable chemical processes`,
        `Solution dilution and concentration: Use the ${st} to prepare solutions of specific molarity from stock solutions. Calculate the volume of stock solution and solvent needed using the dilution formula M1V1 = M2V2`,
        `Stoichiometry and limiting reagent: Determine the amounts of reactants needed and products formed in a chemical reaction. Use the ${st} to identify the limiting reagent and calculate theoretical yield`,
        `pH and acid-base calculations: Calculate pH, pOH, hydrogen ion concentration, and hydroxide ion concentration for acid-base problems. Use the ${st} for titration calculations and buffer solution preparation`,
        `Percent yield and reaction efficiency: Calculate the percent yield of a reaction by comparing actual yield to theoretical yield. Use the ${st} to evaluate reaction efficiency and identify sources of product loss`,
        `Empirical and molecular formula determination: Calculate empirical formulas from percent composition data and determine molecular formulas from molar mass. Use the ${st} for analytical chemistry problem solving`,
        `Gas law calculations: Solve problems using the ideal gas law PV = nRT, including changes in pressure, volume, temperature, and moles. Use the ${st} for combined gas law and stoichiometry involving gases`,
      ]
  }

  if (calc.category === 'engineering') {
      return [
        `Preliminary design: Perform initial calculations to size components, select materials, and verify that designs meet specifications`,
        `Design verification: Double-check critical calculations from detailed design work. Catch potential errors before they reach the construction or manufacturing phase`,
        `Education and training: Engineering students can verify homework solutions and gain intuition about how different parameters affect system behavior`,
        `Field calculations: Quick on-site calculations for troubleshooting, adjustments, or modifications to existing systems and installations`,
        `Structural load analysis: Calculate beam deflections, column buckling loads, and stress distributions in structural members. Use the ${st} to verify that designs meet safety factors and building code requirements`,
        `Fluid flow and pipe sizing: Determine flow rates, pressure drops, and required pipe diameters for fluid transport systems. Use the ${st} to size pumps, pipes, and valves for hydraulic and pneumatic systems`,
        `Electrical circuit analysis: Calculate voltage, current, resistance, and power in series and parallel circuits using Ohm's law. Use the ${st} for transformer ratios, voltage drops, and power distribution calculations`,
        `Thermodynamics and heat transfer: Compute heat transfer rates, thermal efficiency, and energy balances for HVAC, engines, and industrial processes. Use the ${st} to size heat exchangers and insulation requirements`,
        `Mechanical advantage and gear ratios: Calculate mechanical advantage for lever systems, pulley systems, and gear trains. Use the ${st} to optimize torque and speed ratios in mechanical power transmission designs`,
        `Tolerance stack-up analysis: Determine the cumulative effect of individual component tolerances on an assembly. Use the ${st} to perform worst-case and statistical tolerance analysis for manufacturing quality`,
      ]
  }

  if (calc.category === 'everyday') {
      return [
        `Daily decision making: Use the ${st} for quick answers to practical questions that come up in daily life. Save time and mental energy`,
        `Budget-conscious shopping: Calculate discounts, compare unit prices, and determine the best deals before making purchases`,
        `Financial planning: Manage tips, split bills, and track everyday spending with accurate calculations`,
        `Home and personal management: Handle common household calculations from recipe adjustments to time management and measurement conversions`,
        `Travel budgeting and expense tracking: Plan your travel budget by estimating costs for transportation, accommodation, meals, and activities. Use the ${st} to split group trip expenses and track spending against your travel budget`,
        `Time management and scheduling: Calculate time durations, schedule windows, and deadlines for daily tasks and projects. Use the ${st} to plan your day efficiently and avoid overcommitting your time`,
        `Fitness and health tracking: Log daily steps, calories burned, water intake, and exercise minutes. Use the ${st} to track weekly averages and spot trends in your health and wellness routines`,
        `Event planning and guest management: Calculate quantities for food, drinks, seating, and supplies based on guest count. Use the ${st} to scale party plans from intimate gatherings to large celebrations`,
        `Personal goal tracking and habit building: Measure progress toward daily or weekly goals like reading minutes, savings targets, or study hours. Use the ${st} to stay accountable and visualize incremental progress`,
        `Pet care and household management: Calculate pet food portions based on weight and activity level, track veterinary expenses, or split household bills with roommates. Use the ${st} for everyday household math made simple`,
      ]
  }

  if (calc.category === 'food') {
      return [
        `Recipe scaling: Adjust any recipe to serve your desired number of people. Whether cooking for two or a crowd, get the ingredient quantities right every time`,
        `Nutritional tracking: Calculate the nutritional content of your meals and recipes. Monitor calories, macros, and micronutrients for dietary goals`,
        `Meal prep planning: Scale weekly meal prep recipes accurately. Save time by cooking once and portioning correctly for multiple days`,
        `Baking precision: Get exact measurements for baking ingredients. Baking requires precision, and the ${st} ensures your ratios are correct`,
        `Recipe cost calculation: Determine the cost per serving of your homemade meals by calculating ingredient costs. Use the ${st} to compare the cost of cooking at home versus dining out for your favorite dishes`,
        `Ingredient substitution adjustment: When substituting ingredients, adjust quantities to maintain the right texture and flavor balance. Use the ${st} to recalculate ratios when swapping flours, sweeteners, or fats`,
        `Batch cooking and freezing portions: Scale recipes for bulk cooking and calculate how many individual portions each batch yields. Use the ${st} to plan freezer meals that fit your weekly meal schedule`,
        `Dietary restriction adaptation: Convert a standard recipe to meet gluten-free, dairy-free, low-sodium, or other dietary needs. Use the ${st} to adjust ingredient ratios while maintaining recipe integrity`,
        `Cocktail and beverage scaling: Scale cocktail recipes for parties by calculating ingredient ratios for larger batches. Use the ${st} to maintain the perfect balance when mixing drinks for a crowd`,
        `Macro-balanced meal building: Design meals that hit specific protein, carbohydrate, and fat targets using the ${st}. Build balanced plates by calculating the nutritional contribution of each ingredient`,
      ]
  }

  if (calc.category === 'biology') {
      return [
        `Classroom learning: Biology students can apply theoretical formulas to practical problems in genetics, population biology, and physiology`,
        `Lab data analysis: Process experimental data from biology labs accurately. Calculate growth rates, concentrations, and statistical measures`,
        `Research planning: Estimate sample sizes, growth timelines, and experimental parameters for biological research projects`,
        `Personal health understanding: Apply biological formulas to understand personal health metrics, body composition, and physiological parameters`,
        `Population genetics and Hardy-Weinberg: Calculate allele and genotype frequencies in a population using the Hardy-Weinberg equilibrium equation. Use the ${st} to determine whether a population is evolving at a specific gene locus`,
        `Microbial growth rate analysis: Calculate generation time and growth rates for bacterial or yeast cultures. Use the ${st} to determine how quickly a microbial population will reach a target density under given conditions`,
        `Enzyme kinetics and Michaelis-Menten: Determine Vmax and Km values from enzyme activity data to characterize enzyme efficiency. Use the ${st} to analyze how substrate concentration affects reaction velocity`,
        `Dilution series and cell counting: Calculate the concentration of cells or colonies from serial dilution plating results. Use the ${st} to determine the original sample concentration from colony counts on dilution plates`,
        `Ecological population estimation: Estimate population size using mark-recapture data with the Lincoln-Petersen index. Use the ${st} to calculate population estimates and confidence intervals from field sampling data`,
        `Physiological parameter calculation: Calculate body surface area, cardiac output, glomerular filtration rate, and other clinical physiology metrics. Use the ${st} for health science and medical problem solving`,
      ]
  }

  if (calc.category === 'ecology') {
      return [
        `Environmental education: Learn about ecological concepts through hands-on calculation. Understand biodiversity indices, population dynamics, and carrying capacity`,
        `Conservation planning: Estimate population sizes, habitat requirements, and resource needs for conservation projects`,
        `Impact assessment: Calculate environmental footprints, resource consumption rates, and sustainability metrics for projects or lifestyle changes`,
        `Field research: Process ecological field data to estimate population densities, species diversity, and ecosystem health indicators`,
        `Biodiversity index calculation: Compute Shannon-Wiener, Simpson's, or species richness indices from field survey data. Use the ${st} to quantify ecosystem biodiversity and compare diversity across different habitats`,
        `Carbon footprint estimation: Calculate your personal or household carbon footprint from transportation, energy use, diet, and consumption patterns. Use the ${st} to identify the biggest carbon reduction opportunities`,
        `Population growth and carrying capacity: Model exponential and logistic population growth to predict future population sizes. Use the ${st} to estimate when a population will reach its carrying capacity in an ecosystem`,
        `Species-area relationship analysis: Use the power law relationship to predict how many species a habitat of a given area can support. Use the ${st} for conservation planning and habitat fragmentation studies`,
        `Water and resource footprint tracking: Calculate your water footprint from daily activities including diet, household use, and consumer goods. Use the ${st} to identify where to reduce resource consumption most effectively`,
        `Ecological footprint comparison: Compare the ecological footprint of different lifestyles, diets, or transportation choices. Use the ${st} to quantify how many Earths would be needed if everyone lived a certain way`,
      ]
  }

  if (calc.category === 'sports') {
      return [
        `Race planning: Calculate your target pace for upcoming races of any distance. Plan split times and energy expenditure for optimal performance`,
        `Training zone management: Determine your heart rate zones for different training intensities. Ensure you are training at the right effort level for each workout`,
        `Fitness goal tracking: Measure improvements in speed, endurance, and cardiovascular fitness over time. Set data-driven performance targets`,
        `Workout design: Design interval workouts with precise pace, distance, and rest calculations. Optimize training sessions for specific goals like 5K improvement or marathon preparation`,
        `Pace and finish time prediction: Use the ${st} to predict your race finish time based on a target pace, or determine the pace needed to achieve a specific finish time. Plan pacing strategies for 5K, 10K, half-marathon, or marathon distances`,
        `Calorie burn estimation by activity: Estimate calories burned during different sports and exercise activities based on duration, intensity, and body weight. Use the ${st} to track exercise energy expenditure for weight management goals`,
        `Training volume and periodization: Calculate weekly mileage, training load, and periodization cycles for endurance sports. Use the ${st} to plan progressive overload while avoiding overtraining and injury`,
        `VO2 max and fitness assessment: Estimate your VO2 max from race times or field tests using established formulas. Use the ${st} to track cardiovascular fitness improvements and compare against age- and gender-adjusted norms`,
        `Swim, bike, run triathlon pacing: Calculate target paces across all three triathlon disciplines based on overall finish time goals. Use the ${st} to plan transition times and split strategies for sprint, Olympic, or Ironman distances`,
        `Strength training one-rep max calculation: Estimate your one-rep max from submaximal lifting weights using Epley, Brzycki, or Lombardi formulas. Use the ${st} to set training percentages for periodized strength programs`,
      ]
  }

  return [
    `Quick reference: Use the ${st} whenever you need an accurate calculation related to this topic. Bookmark it for easy access`,
    `Learning and education: Understand how different variables affect outcomes by experimenting with different input values`,
    `Planning and preparation: Use the calculator to plan ahead and make informed decisions based on accurate projections`,
    `Comparison and analysis: Run multiple scenarios with different inputs to compare results and choose the best option`,
    `Verification: Double-check manual calculations or estimates from other sources for accuracy`,
    `What-if scenario testing: Change one variable at a time using the ${st} to see how each input affects the final result. Develop intuition for which factors matter most in your calculations`,
    `Goal setting and tracking: Use the ${st} to determine the inputs required to achieve a specific target result. Work backward from your goal to create an actionable plan`,
    `Teaching and demonstration: Educators can use the ${st} to demonstrate mathematical relationships and real-world applications in the classroom. Show students how changing inputs changes outcomes interactively`,
    `Data-driven decision making: Replace guesswork with accurate calculations when making important decisions. Use the ${st} to base your choices on solid numerical evidence rather than intuition alone`,
    `Time-saving automation: Instead of manual calculations or spreadsheet formulas, use the ${st} for instant, error-free results. Save time on routine calculations and reduce the risk of arithmetic mistakes`,
  ]
}

function generateTips(calc: CalculatorEntry): string[] {
  const st = shortTitle(calc.title)

  if (calc.category === 'financial') {
    if (calc.slug.includes('mortgage') || calc.slug.includes('loan') || calc.slug.includes('amortization')) {
      return [
        `Always consider the total cost of the loan (interest + fees), not just the monthly payment. A lower monthly payment over a longer term often costs significantly more in total interest`,
        `Use the calculator to compare different down payment amounts. Even an extra 5% down can reduce your monthly payment and may eliminate PMI if you reach 20% equity`,
        `Remember that property taxes, insurance, and HOA fees are not included in basic payment calculations. Add these estimates to get your true monthly housing cost`,
        `Check current interest rates from multiple lenders and run the numbers for each. A rate difference of just 0.25% can save thousands over the life of the loan`,
        `Consider making biweekly payments instead of monthly. This results in one extra payment per year, which can shave years off your mortgage and save substantial interest`,
        `Use an amortization schedule to see how much of each payment goes toward principal versus interest — early payments are mostly interest, but that balance shifts over time`,
        `If you are paying PMI, calculate how quickly you can reach 20% equity to eliminate it. PMI typically costs 0.5-1% of the loan amount per year`,
        `Compare a 15-year versus 30-year term carefully: the 15-year saves significant interest but requires much higher monthly payments that may strain your budget`,
        `Check your credit score before applying — improving from fair (680) to good (740) could lower your rate by 0.5-1%, saving thousands over the loan term`,
        `Factor in closing costs (typically 2-5% of the loan) when deciding whether to refinance. Break-even analysis helps determine if the savings justify the upfront fees`,
      ]
    }
    if (calc.slug.includes('retirement') || calc.slug.includes('401k') || calc.slug.includes('ira')) {
      return [
        `Aim to save at least 15% of your pre-tax income for retirement including any employer match. The ${st} helps you see if you are on track`,
        `Take full advantage of employer matching contributions — if your employer matches 50% up to 6%, contribute at least 6% to get the full match`,
        `Use the calculator to compare traditional (pre-tax) versus Roth (post-tax) contributions. Your tax bracket now versus in retirement determines which is better`,
        `Increasing your contribution rate by just 1-2% per year is a painless way to significantly boost your retirement savings over time`,
        `Factor in inflation when projecting retirement needs — the ${st} accounts for this with realistic return assumptions`,
        `The earlier you start, the more powerful compounding works. Starting at 25 versus 35 can mean double the savings at retirement for the same monthly contribution`,
        `Use the 4% rule as a starting benchmark: multiply your desired annual retirement income by 25 to estimate the nest egg you need`,
        `Catch-up contributions (an extra $7,500 per year for those 50+) can significantly boost savings in your final working years`,
        `Consider the impact of Social Security timing — delaying benefits until age 70 can increase your monthly payout by up to 32% versus claiming at full retirement age`,
        `Review your asset allocation as you approach retirement. A common rule: subtract your age from 110 to get the percentage of stocks in your portfolio`,
      ]
    }
    if (calc.slug.includes('budget') || calc.slug.includes('net-worth')) {
      return [
        `Track every expense for at least 30 days to get an accurate spending baseline. Most people underestimate discretionary spending by 20-30%`,
        `Use the 50/30/20 rule as a starting framework: 50% of after-tax income for needs, 30% for wants, and 20% for savings and debt repayment`,
        `Calculate your net worth annually to track long-term financial health. An increasing net worth trend matters more than any single month's balance`,
        `Identify fixed versus variable expenses in your budget. Cutting variable costs like dining out is easier than reducing fixed costs like rent or insurance`,
        `Build an emergency fund of 3-6 months of expenses before focusing on aggressive investing. The ${st} can show how much to set aside each month`,
        `Use zero-based budgeting: assign every dollar a specific job so your income minus expenses equals zero. This prevents mindless overspending`,
        `Review subscriptions and memberships quarterly — the average person spends $200+ per month on unused services that quietly drain the budget`,
        `Include all assets (home equity, investments, vehicles) and all liabilities (mortgage, credit cards, student loans) in your net worth calculation`,
        `Pay yourself first by automating savings and investment transfers on payday before you have a chance to spend the money`,
        `Identify spending leaks by category — small daily expenses like coffee and snacks can add up to $1,000+ per year without careful tracking`,
      ]
    }
    if (calc.slug.includes('investment') || calc.slug.includes('compound-interest') || calc.slug.includes('roi')) {
      return [
        `The key to compound interest is time, not the amount invested. Even small regular contributions grow significantly over decades due to exponential growth`,
        `Use the Rule of 72 to estimate doubling time: divide 72 by your annual return rate. At 8%, your money doubles every 9 years`,
        `Diversify across asset classes (stocks, bonds, real estate) to manage risk. The ${st} can model different allocation scenarios`,
        `Focus on what you can control: investment fees, tax efficiency, and saving rate. These matter more than trying to time the market`,
        `Dollar-cost averaging — investing a fixed amount regularly — reduces the impact of market volatility and removes the stress of timing entries`,
        `Reinvest dividends automatically to maximize compound growth. Reinvested dividends can account for 40%+ of total long-term stock returns`,
        `Account for inflation when calculating real returns. A 7% nominal return with 3% inflation gives only a 4% real return`,
        `The difference between a 1% and 2% annual fee on a $100,000 portfolio over 30 years is over $100,000 in lost returns. Always check expense ratios`,
        `Compare lump-sum investing versus dollar-cost averaging with the ${st}. Historically, lump-sum outperforms DCA about two-thirds of the time`,
        `Use tax-loss harvesting to offset capital gains. Track unrealized losses and consider harvesting them before year-end to reduce your tax bill`,
      ]
    }
    if (calc.slug.includes('tax') || calc.slug.includes('income-tax')) {
      return [
        `Understand your marginal tax bracket versus effective tax rate. Only the income within each bracket is taxed at that rate, not your entire income`,
        `Maximize tax-advantaged accounts like 401(k)s and IRAs before using taxable brokerage accounts. Every dollar deferred grows tax-free until withdrawal`,
        `Itemize deductions if your total itemizable expenses exceed the standard deduction. The ${st} can help you compare both approaches`,
        `Keep records of deductible expenses throughout the year — charitable donations, medical expenses, and business expenses are often overlooked`,
        `Use the ${st} to ensure you are withholding the right amount. Avoid large refunds (an interest-free loan to the government) or large balances due at filing`,
        `For self-employment income, set aside 25-30% for taxes and make quarterly estimated payments to avoid underpayment penalties`,
        `Contribute to an HSA if you have a high-deductible health plan — it is triple tax-advantaged: pre-tax contributions, tax-free growth, and tax-free withdrawals for medical expenses`,
        `Tax credits are more valuable than deductions — a $1,000 credit reduces your tax bill by $1,000, while a deduction only reduces taxable income`,
        `Hold investments for more than one year to qualify for long-term capital gains rates, which are significantly lower than short-term rates`,
        `Factor in state income taxes when comparing job offers or planning retirement relocation — rates vary from 0% to over 13% depending on the state`,
      ]
    }
    if (calc.slug.includes('salary') || calc.slug.includes('hourly')) {
      return [
        `When comparing job offers, calculate total compensation including benefits, bonuses, and retirement contributions — not just the base salary`,
        `Convert hourly wage to annual salary by multiplying by 2,080 (40 hours × 52 weeks). The ${st} handles this automatically`,
        `Factor in commuting costs, parking, and work wardrobe when comparing an on-site position with a remote or hybrid role`,
        `Overtime pay is 1.5 times your regular rate for hours over 40 per week. Use the ${st} to see how overtime affects your effective hourly rate`,
        `Negotiate your starting salary — candidates who negotiate typically increase their offer by 10-20%, and future raises are based on that higher base`,
        `Consider the true hourly rate after accounting for unpaid breaks, commute time, and work-from-home expenses. A $50,000 salary with a 45-minute commute may be worth less than it seems`,
        `Know the difference between exempt and non-exempt status. Non-exempt employees must receive overtime pay, while exempt salaried employees do not`,
        `Track billable hours carefully if you are freelance or contract. Even 15 minutes of unbilled time per day adds up to 60+ hours per year of lost income`,
        `Use the ${st} to compare cost-of-living-adjusted salaries when considering relocation. $100,000 in San Francisco is equivalent to about $65,000 in Austin`,
        `Project your salary growth over time with the ${st}. The average annual raise is 3-5%, and negotiating a higher starting salary compounds over your entire career`,
      ]
    }
    return [
      `Always double-check your input values — a decimal place error can significantly change financial projections and lead to poor decisions`,
      `Use the ${st} to run multiple scenarios by varying key assumptions like interest rates, time periods, and contribution amounts`,
      `Remember that past performance does not guarantee future results, especially for investment-related calculations and projections`,
      `Account for inflation's impact on long-term projections. Purchasing power erodes over time, so include realistic inflation estimates`,
      `Use realistic rather than optimistic estimates for more reliable financial planning. Pessimistic scenarios help prepare for downturns`,
      `Bookmark the ${st} for quick access whenever you need to evaluate financial decisions or update your financial plan`,
      `Share your results with a financial advisor or accountant for professional interpretation tailored to your specific situation`,
      `Keep records of your calculations for future reference and to track how your financial situation changes over time`,
      `Combine multiple financial calculators for a comprehensive picture — for example, pair a budget calculator with a retirement planner`,
      `Review and update your financial projections annually as interest rates, income, expenses, and financial goals evolve`,
    ]
  }

  if (calc.category === 'health') {
    if (calc.slug.includes('bmi')) {
      return [
        `BMI is a screening tool, not a diagnostic measure. Athletes with high muscle mass may have a high BMI despite being very healthy`,
        `Use consistent measurement units — the calculator defaults to metric, but you can switch to imperial if preferred`,
        `Track your BMI over time rather than focusing on a single measurement. Trends are more meaningful than any one data point`,
        `Combine BMI with other measurements like waist circumference and body fat percentage for a more complete health picture`,
        `Consult a healthcare provider to interpret your BMI in the context of your overall health, family history, and lifestyle`,
        `For children and teens, BMI is interpreted using age- and sex-specific percentiles rather than the standard adult categories`,
        `BMI does not distinguish between muscle and fat — two people with the same BMI can have very different body compositions`,
        `Asian populations may have increased health risks at lower BMI thresholds (23 instead of 25 for overweight). Check ethnicity-specific guidelines`,
        `A BMI below 18.5 indicates underweight, which carries health risks including weakened immune function and decreased bone density`,
        `Use the ${st} alongside blood pressure, cholesterol, and blood sugar readings for a comprehensive health assessment`,
      ]
    }
    if (calc.slug.includes('calorie') || calc.slug.includes('bmr') || calc.slug.includes('tdee')) {
      return [
        `Be honest about your activity level when selecting from the options. Overestimating activity leads to inaccurate calorie targets`,
        `These are estimates — your actual metabolism may vary by 10-20%. Use the results as a starting point and adjust based on real-world results`,
        `For weight loss, a deficit of 300-500 calories per day is generally sustainable. Avoid extreme deficits that can lead to muscle loss and metabolic slowdown`,
        `Recalculate your needs after significant weight change (10+ lbs or 5+ kg). Your calorie requirements decrease as you lose weight`,
        `Protein intake should remain consistent regardless of calorie targets. Aim for 1.6-2.2 g per kg of body weight, especially when in a deficit`,
        `Protein is the most satiating macronutrient — aim for 25-30g per meal when in a calorie deficit to help manage hunger and preserve muscle`,
        `Your BMR accounts for 60-75% of total daily energy expenditure. The remaining comes from physical activity and the thermic effect of food`,
        `Sleep deprivation can reduce BMR by 5-10% and increase cravings for high-calorie foods. Prioritize 7-9 hours of quality sleep when managing weight`,
        `For muscle gain, a surplus of 200-400 calories above maintenance is generally sufficient. Larger surpluses lead to more fat gain`,
        `Track your weight and intake consistently for 2-3 weeks, then adjust based on actual results. The ${st} provides a starting point, not a prescription`,
      ]
    }
    if (calc.slug.includes('heart-rate') || calc.slug.includes('resting-heart')) {
      return [
        `Calculate your maximum heart rate using 220 minus your age, but individual variation can be significant. A stress test provides the most accurate measurement`,
        `Measure resting heart rate first thing in the morning before getting out of bed. A consistently elevated resting rate may signal overtraining or illness`,
        `Use heart rate zones to target specific training effects: Zone 2 (60-70% of max) builds aerobic base, while Zone 4-5 (80-100%) improves anaerobic capacity`,
        `A lower resting heart rate generally indicates better cardiovascular fitness. Elite athletes often have resting rates in the 40-50 bpm range`,
        `Track your recovery heart rate — how much it drops one minute after intense exercise. A drop of 20+ beats indicates good cardiovascular fitness`,
        `Stay hydrated when checking heart rate. Dehydration can elevate heart rate by 5-10 bpm, skewing your zone calculations`,
        `Use the ${st} to determine your target heart rate range for different workout intensities. Staying in the right zone maximizes training efficiency`,
        `Certain medications like beta-blockers lower heart rate and affect exercise calculations. Consult your doctor for adjusted targets`,
        `Compare heart rate data across different types of exercise. Running typically produces higher rates than cycling at the same perceived effort`,
        `Use a heart rate monitor for real-time feedback during workouts rather than spot checks. Continuous data provides better insight into training zones`,
      ]
    }
    if (calc.slug.includes('body-fat') || calc.slug.includes('ideal-weight')) {
      return [
        `Body fat percentage is a better health indicator than BMI alone. Healthy ranges are 10-20% for men and 18-28% for women, varying by age and activity`,
        `Different measurement methods (calipers, bioelectrical impedance, DEXA) give different results. Use the same method consistently when tracking changes`,
        `Ideal body weight formulas (Devine, Miller, Hamwi) do not account for muscle mass. Use them as rough guidelines, not strict targets`,
        `Track body fat percentage trends rather than absolute numbers. A consistent downward trend indicates progress even with daily fluctuations`,
        `Visceral fat around organs is more harmful than subcutaneous fat. Waist-to-hip ratio is a useful additional metric alongside the ${st}`,
        `For accurate caliper measurements, measure at the same sites and same time of day. Consistency matters more than absolute precision`,
        `Women naturally have higher essential body fat than men due to hormonal functions. Do not compare body fat percentages across genders`,
        `Use the ${st} alongside progress photos and how your clothes fit for a complete picture of body composition changes`,
        `Ideal weight ranges increase with age — the standard BMI-based ideal weight may be too low for adults over 65`,
        `Rapid weight loss often includes significant muscle loss. Aim to lose no more than 0.5-1% of body weight per week to preserve lean mass`,
      ]
    }
    if (calc.slug.includes('pregnancy') || calc.slug.includes('due-date') || calc.slug.includes('ovulation')) {
      return [
        `A due date is an estimate — only about 4% of babies are born exactly on their due date. Full-term delivery between 37-42 weeks is normal`,
        `Ovulation typically occurs 14 days before your next period. Track your cycle for several months to identify your personal pattern`,
        `Use the ${st} to plan maternity leave, but remain flexible. Prepare for the possibility of delivering 2-3 weeks before or after the estimate`,
        `The first day of your last menstrual period (LMP) is the standard starting point for due date calculations, even though conception occurs about two weeks later`,
        `Ovulation prediction is most accurate when combined with other signs: basal body temperature, cervical mucus, and ovulation predictor kits`,
        `Irregular cycles make due date and ovulation calculations less reliable. If cycle length varies by more than 7 days, consult your healthcare provider`,
        `Use the ${st} to track weekly milestones and fetal development stages. Each week brings specific developmental changes`,
        `Due dates are typically adjusted after the first-trimester ultrasound, which measures crown-rump length for more accurate dating`,
        `The fertile window spans approximately 6 days — the 5 days before ovulation and the day of ovulation itself`,
        `Stress, travel, and illness can delay ovulation even in regular cycles. Do not rely solely on calendar-based calculations for birth control`,
      ]
    }
    if (calc.slug.includes('water') || calc.slug.includes('hydration')) {
      return [
        `The common recommendation of 8 glasses (64 oz) per day is a general guideline. Actual needs vary by body weight, activity, climate, and diet`,
        `A simple starting formula: body weight in pounds divided by 2 equals ounces of water per day. The ${st} provides a more precise estimate`,
        `Increase water intake during hot weather, high-altitude activities, and when flying to compensate for increased fluid loss through sweat and respiration`,
        `Urine color is a practical hydration indicator — pale yellow indicates good hydration, while dark yellow or amber means you need more fluids`,
        `Eating water-rich foods (fruits, vegetables, soups) contributes significantly to daily hydration. About 20% of water intake comes from food`,
        `Thirst is a late indicator of dehydration. By the time you feel thirsty, you may already be 1-2% dehydrated, impairing cognitive and physical performance`,
        `Caffeinated beverages count toward daily fluid intake — the diuretic effect is minimal for moderate regular consumers`,
        `During exercise, drink 5-10 ounces of water every 15-20 minutes. For workouts over 60 minutes, consider electrolyte-replacement beverages`,
        `Older adults have a diminished thirst sensation and are at higher risk of dehydration. Use the ${st} to set daily intake targets`,
        `Alcohol has a strong diuretic effect — for each drink, your body loses about 4 ounces of extra water. Rehydrate accordingly after drinking`,
      ]
    }
    if (calc.slug.includes('protein') || calc.slug.includes('macro')) {
      return [
        `The RDA for protein is 0.8 g per kg of body weight, but active individuals and older adults benefit from 1.2-2.0 g per kg for optimal health`,
        `Distribute protein evenly across meals (20-40g per meal) rather than eating most at dinner for better muscle protein synthesis throughout the day`,
        `Complete proteins (meat, eggs, dairy, soy, quinoa) contain all essential amino acids. Plant-based eaters should combine complementary proteins daily`,
        `Post-workout protein within 2 hours of exercise maximizes muscle repair and growth. Aim for 20-40g of fast-digesting protein like whey or soy`,
        `For weight loss, higher protein intake (1.6-2.2 g per kg) helps preserve muscle and increases satiety, making it easier to stick to a calorie deficit`,
        `Older adults (65+) need more protein (1.0-1.2 g per kg minimum) to counteract age-related muscle loss and maintain strength and mobility`,
        `Track your macro split (protein, carbs, fat) as percentages of total calories rather than absolute grams when adjusting for different goals`,
        `Fat intake should not drop below 20% of total calories for hormonal health, especially for women who need adequate fat for reproductive hormone production`,
        `Carbohydrate needs vary widely — endurance athletes may need 6-10 g per kg, while those on low-carb diets may consume as little as 50g per day`,
        `Use the ${st} to set starting targets, then adjust based on energy levels, performance, and body composition changes over 2-3 weeks`,
      ]
    }
    return [
      `Consult your healthcare provider before making significant changes to your diet, exercise, or health routine based on calculator results`,
      `Track your health metrics over time rather than relying on a single measurement. Trends provide more meaningful insights than individual data points`,
      `Use consistent measurement conditions — same time of day, same equipment, similar circumstances — for the most comparable results`,
      `Health calculators provide estimates based on population averages. Individual results may vary by 10-20% from calculated values`,
      `Combine multiple health metrics for a complete picture. No single number tells the whole story about your health`,
      `Update your measurements regularly as your body and health status change. Recalculate every 4-8 weeks for accurate tracking`,
      `Enter your age, gender, and activity level accurately — these factors significantly influence health calculations and their interpretation`,
      `Use the calculator results as a conversation starter with your doctor rather than as a self-diagnosis or self-treatment tool`,
      `Bookmark the ${st} and track your results in a journal or app to identify patterns and measure progress over time`,
      `Remember that health is multidimensional — the ${st} addresses one aspect, but sleep, stress, mental health, and social connections all matter`,
    ]
  }

  if (calc.category === 'math') {
    return [
      `Double-check your inputs before relying on the result. A misplaced decimal or wrong sign can lead to entirely incorrect answers`,
      `Use the step-by-step breakdown if available to understand how the result was derived. This reinforces learning and helps verify accuracy`,
      `The calculator supports decimal values — do not round intermediate values prematurely for better precision in the final result`,
      `For complex problems, break them down into smaller steps and verify each part independently before combining them`,
      `Bookmark calculators you use frequently for quick access. Many math calculators also work great for checking homework and studying`,
      `Understand what operation the calculator performs and why. Knowing the underlying concept helps you apply the result correctly`,
      `Use the ${st} to check your work after solving problems manually. This builds confidence and catches errors in your reasoning`,
      `Try different input values to explore how the mathematical relationship works. Changing one variable at a time reveals cause and effect`,
      `For geometry and trigonometry problems, draw a diagram alongside the calculator to visualize what you are calculating`,
      `Keep a record of important calculations and their results. Revisiting them later can help reinforce mathematical concepts and track progress`,
    ]
  }

  if (calc.category === 'conversion') {
    return [
      `Always double-check that the "From" and "To" units are set correctly. A common mistake is converting in the wrong direction`,
      `The calculator uses internationally standardized conversion factors for maximum accuracy. Results are precise to multiple decimal places`,
      `For cooking conversions, note that volume measurements vary by ingredient density. Weight-based conversions are more accurate for dry ingredients`,
      `When converting temperatures, remember that celsius-to-fahrenheit and fahrenheit-to-celsius use formulas, not simple multiplication factors`,
      `Bookmark the converters you use most often. Common conversions like kg-to-lbs, miles-to-km, and celsius-to-fahrenheit are popular everyday tools`,
      `Know the difference between US customary and imperial units — a US gallon differs from a UK gallon, and the ${st} accounts for this`,
      `Use the ${st} to convert between derived units like speed (mph to km/h), pressure (psi to kPa), and energy (calories to joules)`,
      `For currency conversions, check that the exchange rate is current. Rates fluctuate daily and the calculator uses the latest available data`,
      `When converting measurements for a recipe, convert all ingredients using the same source to maintain consistent ratios`,
      `Understand the scale of the units you are converting — converting millimeters to kilometers moves the decimal six places, so small input errors multiply quickly`,
    ]
  }

  if (calc.category === 'date-time') {
    return [
      `Double-check the date format when entering dates manually. Use the date picker when available to avoid errors`,
      `Remember that date calculations automatically account for leap years and varying month lengths`,
      `For business day calculations, check if your region's holidays are included in the calculator. You may need to manually adjust for specific holidays`,
      `Time calculations use 24-hour format internally, but most calculators accept both 12-hour and 24-hour input`,
      `When calculating durations crossing midnight or spanning multiple days, the calculator handles the day boundary automatically`,
      `Use the ${st} to plan project timelines by calculating end dates from start dates and durations, accounting for weekends and holidays`,
      `For age calculations, the calculator uses the exact difference between birth date and the current or specified date, including leap day birthdays`,
      `When scheduling across time zones, calculate the time difference separately and add it to the result for accurate cross-timezone planning`,
      `Use the date calculator to determine deadlines, warranty periods, and subscription renewal dates by adding days or months from a starting point`,
      `For recurring events, calculate intervals in days rather than months for more precision — months have varying lengths that can shift dates unexpectedly`,
    ]
  }

  if (calc.category === 'construction') {
    return [
      `Always add a waste factor (typically 5-15%) when ordering materials. This accounts for cutting errors, breakage, and irregular spaces`,
      `Measure twice, enter once. Double-check your measurements before relying on the calculator's estimates`,
      `Material prices vary by region and quality. Use current local prices for the most accurate cost estimates`,
      `Consider ordering slightly more than calculated for materials like tile and flooring. Having extra for repairs is much easier than matching stock later`,
      `For concrete projects, order by the cubic yard and factor in the delivery minimum. Smaller projects may have higher per-yard delivery costs`,
      `Use the ${st} to compare material options. A cheaper material with a shorter lifespan may cost more in the long run when factoring in replacement labor`,
      `Account for the actual dimensions of lumber and sheet goods — a 2x4 is actually 1.5 x 3.5 inches, which affects quantity calculations for framing`,
      `For paint and flooring, calculate the area of each wall or section separately rather than multiplying total length by width. Doors and windows reduce coverage needs`,
      `Factor in local building codes when planning your project. Minimum requirements for things like rebar spacing, footing depth, and railing height may affect quantities`,
      `Use the ${st} during the design phase, not just when ordering. Running calculations early helps you adjust plans before committing to materials`,
    ]
  }

  if (calc.category === 'statistics') {
    return [
      `Check for outliers in your data before interpreting results. A single extreme value can significantly skew the mean and standard deviation`,
      `Use the median instead of the mean when your data has outliers or is not symmetrically distributed`,
      `The standard deviation is most meaningful when your data follows a normal (bell-shaped) distribution`,
      `Larger sample sizes generally provide more reliable estimates of population parameters`,
      `Always consider the context of your data. Statistical measures alone do not tell the full story — understand what your data represents`,
      `Use the ${st} to calculate confidence intervals alongside point estimates. A confidence interval provides a range that likely contains the true population value`,
      `Be careful with correlation — a high correlation between two variables does not prove that one causes the other. Confounding variables may be involved`,
      `When working with percentages and proportions, ensure your sample size is large enough. Proportions based on very small samples have wide confidence intervals`,
      `Use the ${st} to detect trends in time-series data by applying moving averages or regression analysis to smooth out short-term fluctuations`,
      `Document your data source, collection method, and sample size alongside your results. Reproducibility is a cornerstone of sound statistical analysis`,
    ]
  }

  if (calc.category === 'education') {
    return [
      `Keep track of all your grades throughout the semester, not just exams. Small assignments add up and can significantly impact your final grade`,
      `Use the "what if" feature to set target grades and see what scores you need on remaining work to achieve them`,
      `Remember that different courses may use different grading scales. Check your syllabus and select the correct scale in the calculator`,
      `Regular GPA checks help you stay on track. Do not wait until the end of the semester to see where you stand`,
      `Consider the credit weight of each course — a B in a 4-credit course affects your GPA more than an A in a 1-credit course`,
      `Use the ${st} to plan your semester strategically. Knowing the minimum grades needed on remaining assignments helps prioritize study time across courses`,
      `Understand how your school handles pass/fail courses, withdrawals, and repeated courses in GPA calculations. These policies vary by institution`,
      `For cumulative GPA, recalculate after each semester rather than averaging semester GPAs. A 4.0 in a 12-credit semester and a 3.0 in a 6-credit semester do not average to 3.5`,
      `Use the grade calculator to compare different scoring scenarios. Knowing how much a single missed assignment can hurt your grade is powerful motivation`,
      `Check whether your school uses weighted or unweighted GPA. Weighted GPAs give extra points for honors, AP, or IB courses and change the calculation approach`,
    ]
  }

  if (calc.category === 'physics') {
    return [
      `Always include units in your thinking, even if the calculator handles them. Understanding units helps catch errors and verify results`,
      `Check that your values are reasonable before accepting results. Physics calculations should produce results that make intuitive sense`,
      `Use the appropriate number of significant figures based on your input precision. The calculator typically displays results with reasonable precision`,
      `For kinematics problems, pay attention to direction. Velocity and acceleration are vector quantities with both magnitude and direction`,
      `Remember that many physics formulas assume ideal conditions. Real-world results vary due to friction, air resistance, and other factors`,
      `Use the ${st} to check the consistency of your units before calculating — mixing meters and centimeters without converting will produce wrong answers`,
      `For energy and work problems, account for efficiency losses. No real system is 100% efficient, and the calculator can model different efficiency scenarios`,
      `When working with formulas, identify the known and unknown variables first. Physics problems often have multiple pathways to the same answer`,
      `Use the ${st} to explore how changing one variable affects the result. Doubling the mass in a kinetic energy calculation quadruples the energy`,
      `Draw a free-body diagram alongside calculator use for force and motion problems. Visualizing forces helps identify which values to enter and in what direction`,
    ]
  }

  if (calc.category === 'chemistry') {
    return [
      `Always use the correct units for each input. Mixing grams and moles without accounting for molar mass will give incorrect results`,
      `Pay attention to significant figures — your result cannot be more precise than your least precise input`,
      `Standard atomic weights are updated periodically. The calculator uses the latest IUPAC values for accuracy`,
      `For solution chemistry, remember that temperature affects volume and therefore concentration. Most calculations assume standard temperature (25°C)`,
      `Double-check chemical formulas before entering them. A subscript error can significantly change molar mass calculations`,
      `Use the ${st} to verify stoichiometric ratios before running a reaction. Starting with the correct mole ratios prevents wasted reagents`,
      `For gas law calculations, ensure pressure and temperature units are consistent with the gas constant R being used. Common mismatches cause large errors`,
      `When calculating percent yield, use actual experimental mass divided by theoretical mass times 100. Yields above 100% indicate impurities or measurement errors`,
      `Understand the difference between concentrated and dilute solutions when performing dilution calculations. Use C1V1 = C2V2 for accurate dilutions`,
      `Use the ${st} to double-check manual calculations from lab work. Small arithmetic errors in multi-step chemistry problems are common and easily caught`,
    ]
  }

  if (calc.category === 'engineering') {
    return [
      `Always note which standards and codes the calculator is based on. Different regions may use different design standards`,
      `Results from this calculator are suitable for preliminary design and educational purposes. Always verify with detailed analysis for final designs`,
      `Be consistent with units throughout your calculation. The calculator supports SI and imperial, but mixing them without conversion causes errors`,
      `Consider safety factors appropriate for your application. The calculator may include standard safety margins — verify they match your requirements`,
      `Document your input values and results for future reference. Engineering calculations should always be traceable and reproducible`,
      `Use the ${st} to perform parametric studies by varying one design parameter at a time. This reveals which variables most affect the final design`,
      `Always include a factor of safety in your final design. The difference between failure and survival often comes down to adequate safety margins`,
      `Check the calculator assumptions against your specific operating conditions. A model that assumes static loading may not apply to dynamic or cyclic loading scenarios`,
      `Use the ${st} early in the design process to narrow down viable options before committing to detailed analysis on a single approach`,
      `Cross-check results with hand calculations or simplified models when possible. If a simplified model gives a very different answer, investigate before proceeding`,
    ]
  }

  if (calc.category === 'everyday') {
    return [
      `For tip calculations, the standard tipping rate in the US is 15-20%, though you can adjust based on service quality`,
      `When splitting bills, remember to include tax and tip in the total before dividing. The calculator handles this automatically`,
      `For discount calculations, watch for stores that stack discounts. Calculate the final price after applying multiple discounts sequentially`,
      `Round up for simplicity in everyday situations, but use exact values when precision matters for budgeting or planning`,
      `Bookmark calculators you use frequently for quick access from your browser or mobile device`,
      `Use the ${st} to quickly compare per-unit prices between different package sizes. The largest package is not always the best value`,
      `For time management, use the calculator to break large tasks into smaller time blocks. Knowing exactly how long each subtask takes improves scheduling accuracy`,
      `When planning trips, use the ${st} to calculate fuel costs based on distance, fuel efficiency, and current gas prices for accurate travel budgeting`,
      `For home improvement projects, calculate paint or material coverage based on actual wall dimensions minus windows and doors to avoid over-ordering`,
      `Use the ${st} to convert between measurement systems when following international recipes or instructions. Precision matters for baking and DIY projects`,
    ]
  }

  if (calc.category === 'food') {
    return [
      `When scaling recipes, some ingredients like spices and leavening agents do not scale linearly. Use caution with very large or very small scaling factors`,
      `For baking, weigh ingredients by grams rather than using volume measurements for more consistent results`,
      `Nutritional values are estimates based on standard databases. Actual values vary by brand, ripeness, preparation method, and specific ingredients`,
      `When scaling down a recipe, it may be difficult to measure very small quantities accurately. Consider making a larger batch and freezing portions`,
      `Use the ${st} to convert between volume and weight measurements for different ingredients. Flour, sugar, and butter all have different densities`,
      `For meal prep, calculate nutritional content per serving after dividing total recipe yield. The ${st} handles batch cooking portioning automatically`,
      `Adjust cooking times when scaling recipes — doubling the ingredients does not double the cooking time. Use visual doneness cues alongside the calculator`,
      `When substituting ingredients, account for differences in moisture content, sweetness, and fat content. The calculator helps adjust quantities proportionally`,
      `Use the ${st} to calculate nutritional targets per meal when following specific diets like keto, paleo, or Mediterranean. Track macros against daily goals`,
      `For sous vide or precision cooking, use the calculator to determine cooking times based on thickness and desired doneness. Temperature accuracy is critical`,
    ]
  }

  if (calc.category === 'biology') {
    return [
      `Biological systems have natural variability. Results are estimates based on standard models and may not account for all variables`,
      `Use consistent units when entering measurements. The calculator supports both metric and imperial units`,
      `For genetics and population calculations, remember that real populations rarely match ideal model assumptions perfectly`,
      `Results should be interpreted alongside other data and observations for a complete understanding of biological systems`,
      `Use the ${st} to explore how small changes in initial conditions can lead to very different outcomes in biological models and simulations`,
      `When working with growth models, distinguish between exponential and logistic growth. Real populations face resource constraints that limit exponential growth`,
      `Use the ${st} alongside microscopic or observational data to quantify what you see. Converting observations to numbers enables more rigorous analysis`,
      `For enzyme kinetics and biochemical calculations, note that temperature and pH significantly affect reaction rates beyond what standard models capture`,
      `Use the ${st} to calculate dilution series for lab experiments. Serial dilutions are common in microbiology and require precise volume calculations`,
      `When analyzing ecological or biological data, always run the same calculation multiple times with slightly varied inputs to test the robustness of your conclusions`,
    ]
  }

  if (calc.category === 'ecology') {
    return [
      `Ecological models simplify complex natural systems. Results provide estimates, not precise predictions`,
      `Use the most accurate and recent data available for the most reliable estimates. Ecological conditions change over time`,
      `Consider multiple indicators rather than relying on a single ecological metric for decision-making`,
      `For conservation planning, always factor in uncertainty margins. Ecological systems have inherent variability`,
      `Use the ${st} to model population trends under different scenarios. Understanding best-case, worst-case, and most-likely outcomes guides better management decisions`,
      `When calculating biodiversity indices, note that sampling effort greatly affects results. More intensive sampling generally reveals higher diversity`,
      `Use the ${st} to estimate carrying capacity and compare it with current population sizes. This helps identify species at risk of resource depletion`,
      `For habitat fragmentation calculations, consider edge effects — the ratio of edge to interior habitat changes as fragment size decreases, affecting species composition`,
      `Use the ${st} to calculate ecological footprints and compare different lifestyle or policy scenarios. Small per-capita changes multiply across large populations`,
      `When analyzing field data, account for detection probability — not all individuals in a survey area are detected. The ${st} can incorporate correction factors`,
    ]
  }

  if (calc.category === 'sports') {
    return [
      `For heart rate training, use your actual measured maximum heart rate rather than age-based formulas for more accurate zone calculations`,
      `Pace calculations assume consistent effort over the entire distance. In real races, pace varies with terrain, weather, and energy levels`,
      `Track your results over time to see trends. A single data point is less useful than the trajectory of improvement`,
      `Use the calculator to plan negative splits — running the second half of a race slightly faster than the first for optimal performance`,
      `Combine pace, heart rate, and perceived effort data for the most complete picture of your training and racing performance`,
      `Use the ${st} to calculate intensity zones based on heart rate reserve (Karvonen formula) rather than percentage of max alone for more personalized training ranges`,
      `For interval training, use the calculator to precisely set work-to-rest ratios. Common ratios include 1:1 for VO2 max work and 1:3 for anaerobic capacity sessions`,
      `Adjust your pacing strategy for elevation gain — climbing 100 feet per mile adds roughly 10-15 seconds per mile to your pace compared to flat terrain`,
      `Use the ${st} to calculate your fitness age or VO2 max estimate from race times. These metrics provide a benchmark for comparing fitness across different event distances`,
      `For strength training, use one-rep max calculators to set appropriate working set weights. Training at 65-75% of 1RM is ideal for hypertrophy, while 80-90% builds strength`,
    ]
  }

  return [
    `Enter accurate values for the most reliable results. Small input errors can lead to significantly different outcomes`,
    `Use the calculator to explore different scenarios by adjusting inputs. This helps you understand how different factors affect results`,
    `Bookmark this page for quick access whenever you need to perform this type of calculation`,
    `Share the calculator with others who might find it useful. All our calculators are free to use`,
    `Contact us if you have questions or suggestions for improving the calculator`,
    `Use the ${st} alongside other tools in the same category for a more comprehensive analysis. Combining calculators often reveals insights a single tool cannot`,
    `Try the premium features like scenario saving and CSV export if you need to run the same calculation with different inputs or track results over time`,
    `The ${st} is designed for both beginners and experts. Start with the default values to see a sample calculation, then customize inputs for your specific situation`,
    `Check the formula and methodology section below to understand exactly how the result is calculated. Knowing the math behind the tool builds confidence in the output`,
    `Use the ${st} on mobile or desktop — it is fully responsive and works great on any device for calculations on the go`,
  ]
}

function generateFAQ(calc: CalculatorEntry): { question: string; answer: string }[] {
  const generic: { question: string; answer: string }[] = [
    {
      question: `What is the ${calc.title} used for?`,
      answer: `The ${calc.title} helps you perform accurate calculations quickly and easily. It is designed for ${calc.description.split('.')[0].toLowerCase()}. Simply enter your values and get instant results.`,
    },
    {
      question: `Is the ${calc.title} free to use?`,
      answer: `Yes, the ${calc.title} is completely free to use with no limits on the number of calculations. Premium features like scenario saving and CSV export are available for users who create a free account.`,
    },
    {
      question: `How accurate are the results from this calculator?`,
      answer: `Results are calculated with high precision using ${calc.formulaSource ? 'the formula: ' + calc.formulaSource + '. This ensures' : 'validated standard formulas, ensuring'} accurate and reliable results. The calculator provides results with appropriate decimal precision for the type of calculation being performed.`,
    },
    {
      question: `Can I use this calculator on my mobile device?`,
      answer: `Yes, all our calculators are fully responsive and work on smartphones, tablets, and desktop browsers. The interface adapts to your screen size for a smooth experience on any device.`,
    },
    {
      question: `What inputs do I need for the ${calc.title}?`,
      answer: `The ${calc.title} requires the inputs shown in the form above. Each input field is clearly labeled with the information needed. Common inputs include numeric values, unit selections, and option choices. Simply fill in the fields and the result appears automatically.`,
    },
    {
      question: `Can I save or share my calculation results?`,
      answer: `You can copy results to your clipboard, print the page, or share the calculator link with others. Premium users can save calculation scenarios, compare multiple results side by side, and export data as CSV files.`,
    },
    {
      question: `How do I report an issue or suggest an improvement?`,
      answer: `We welcome feedback! Use the contact form on our website to report issues or suggest improvements. Please include the calculator name and a description of the problem or suggestion so we can address it promptly.`,
    },
  ]

  let categorySpecific: { question: string; answer: string }[] = []

  switch (calc.category) {
    case 'financial':
      categorySpecific = [
        {
          question: `What credit score do I need for a ${calc.title}?`,
          answer: `Credit score requirements vary by lender and loan type. Conventional loans typically require a minimum score of 620, while FHA loans may accept scores as low as 580. Use the ${calc.title} to estimate your borrowing power based on your credit profile and financial situation.`,
        },
        {
          question: `How much house can I afford with a $70,000 salary?`,
          answer: `With a $70,000 annual salary, most lenders recommend spending no more than 28% of your gross monthly income on housing, which is about $1,633 per month. Using the ${calc.title}, you can adjust your down payment, interest rate, and loan term to find a comfortable price range for your income.`,
        },
        {
          question: `What is the difference between APR and interest rate on a loan?`,
          answer: `The interest rate is the cost of borrowing the principal amount, while APR (Annual Percentage Rate) includes the interest rate plus lender fees, closing costs, and other charges. APR gives you a more complete picture of the total loan cost. The ${calc.title} helps you compare both side by side.`,
        },
        {
          question: `How does my debt-to-income ratio affect my loan approval?`,
          answer: `Lenders prefer a debt-to-income (DTI) ratio of 43% or lower. A high DTI signals that you may struggle to make monthly payments. You can use the ${calc.title} to calculate your current DTI and see how adding a new loan would affect your ratio before applying.`,
        },
        {
          question: `How much should I have saved for retirement by age 40?`,
          answer: `Financial experts recommend having 2 to 3 times your annual salary saved by age 40. If you earn $80,000 per year, aim for $160,000 to $240,000 in retirement accounts. The ${calc.title} can help you model different savings rates and investment returns to see if you're on track.`,
        },
        {
          question: `What is the average annual return I should expect from my investments?`,
          answer: `The historical average annual return of the S&P 500 is approximately 10% before inflation, or about 7% adjusted for inflation. Your actual returns will vary based on your asset allocation, fees, and market conditions. Use the ${calc.title} to project different return scenarios for your investment goals.`,
        },
        {
          question: `How do I calculate compound interest on my savings?`,
          answer: `Compound interest is calculated using the formula A = P(1 + r/n)^(nt), where P is principal, r is the annual rate, n is compounding frequency, and t is time in years. The ${calc.title} does this math instantly so you can see how your money grows over time.`,
        },
      ]
      break
    case 'health':
      categorySpecific = [
        {
          question: `What is a healthy BMI range for seniors over 65?`,
          answer: `For adults over 65, a BMI between 23 and 27 is often considered healthier than the standard 18.5 to 24.9 range, as a slightly higher BMI may provide protective reserves during illness. The ${calc.title} can help you find your current BMI and compare it to age-adjusted recommendations.`,
        },
        {
          question: `Is BMI accurate for athletes and bodybuilders?`,
          answer: `BMI does not distinguish between muscle and fat mass, so it often classifies athletes and bodybuilders as overweight or obese despite having very low body fat. If you have high muscle mass, consider using body fat percentage measurements or waist-to-height ratio instead of relying solely on your ${calc.title} result.`,
        },
        {
          question: `What is the difference between BMR and TDEE?`,
          answer: `BMR (Basal Metabolic Rate) is the calories your body burns at complete rest to maintain basic functions like breathing and circulation. TDEE (Total Daily Energy Expenditure) adds calories burned through activity, digestion, and exercise. Use the ${calc.title} to find both values and plan your nutrition accordingly.`,
        },
        {
          question: `How many calories should I eat to lose weight safely?`,
          answer: `A safe calorie deficit for weight loss is 300 to 500 calories below your TDEE, which typically results in 0.5 to 1 pound lost per week. Eating fewer than 1,200 calories per day for women or 1,500 for men is not recommended without medical supervision. The ${calc.title} can help you find your personalized target.`,
        },
        {
          question: `What is my ideal body weight for my height and age?`,
          answer: `Ideal body weight estimates vary by method. A common formula for men is 106 pounds for the first 5 feet plus 6 pounds per extra inch, and for women 100 pounds for the first 5 feet plus 5 pounds per extra inch. The ${calc.title} provides a more personalized estimate based on your inputs.`,
        },
        {
          question: `How accurate are fitness trackers for estimating calorie burn?`,
          answer: `Most fitness trackers overestimate calorie burn by 20% to 40% compared to lab measurements. They are useful for tracking trends and relative activity levels, but should not be relied on for precise nutrition planning. The ${calc.title} uses validated formulas to give you a more accurate baseline.`,
        },
        {
          question: `What is a healthy heart rate zone for cardio exercise?`,
          answer: `Your target heart rate zone for moderate-intensity cardio is typically 50% to 70% of your maximum heart rate (220 minus your age). For vigorous exercise, aim for 70% to 85%. The ${calc.title} can calculate your personalized zones based on your age and fitness level.`,
        },
      ]
      break
    case 'math':
      categorySpecific = [
        {
          question: `How do I use the quadratic formula to solve equations?`,
          answer: `The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a for equations in the form ax² + bx + c = 0. The discriminant (b² - 4ac) tells you how many real solutions exist. The ${calc.title} handles this calculation instantly, showing you both the steps and the final answer.`,
        },
        {
          question: `What is the formula to calculate the area of a circle?`,
          answer: `The area of a circle is calculated using the formula A = πr², where r is the radius. Simply square the radius and multiply by π (approximately 3.14159). The ${calc.title} does this computation for you with high precision.`,
        },
        {
          question: `What is the difference between mean, median, and mode?`,
          answer: `The mean is the average of all numbers, the median is the middle value when data is sorted, and the mode is the most frequently occurring value. The mean is sensitive to outliers while the median is not. The ${calc.title} can compute all three measures from your data set.`,
        },
        {
          question: `How do I calculate percentages without a calculator?`,
          answer: `To find a percentage of a number, multiply the number by the decimal form of the percentage. For example, 15% of 200 is 200 × 0.15 = 30. To find what percent one number is of another, divide the part by the whole and multiply by 100. The ${calc.title} makes percentage calculations effortless.`,
        },
        {
          question: `How is the Pythagorean theorem used in real-world applications?`,
          answer: `The Pythagorean theorem (a² + b² = c²) is used in construction to ensure square corners, in navigation to calculate direct distances, and in computer graphics for collision detection. The ${calc.title} computes the missing side length instantly when you provide any two sides of a right triangle.`,
        },
        {
          question: `How do I convert fractions to decimals step by step?`,
          answer: `To convert a fraction to a decimal, divide the numerator by the denominator. For example, 3/4 equals 3 ÷ 4 = 0.75. For repeating decimals like 1/3 = 0.333..., the ${calc.title} shows the repeating pattern and provides the exact fractional equivalent.`,
        },
        {
          question: `What is the slope-intercept form of a linear equation?`,
          answer: `The slope-intercept form is y = mx + b, where m is the slope and b is the y-intercept. This form makes it easy to graph a line by starting at point (0, b) and using the slope to find other points. The ${calc.title} can calculate slope and intercept from your data points.`,
        },
      ]
      break
    case 'conversion':
      categorySpecific = [
        {
          question: `How many ounces are in a cup?`,
          answer: `There are 8 fluid ounces in 1 US cup. For dry ingredients, the weight per cup varies — a cup of flour weighs about 4.5 ounces while a cup of sugar weighs about 7 ounces. The ${calc.title} handles both volume and weight conversions accurately.`,
        },
        {
          question: `What is the formula to convert Celsius to Fahrenheit?`,
          answer: `To convert Celsius to Fahrenheit, multiply by 9/5 and add 32: °F = (°C × 9/5) + 32. For example, 20°C equals (20 × 9/5) + 32 = 68°F. The ${calc.title} instantly converts between temperature scales with precise results.`,
        },
        {
          question: `How many inches are in a foot?`,
          answer: `There are 12 inches in 1 foot. To convert feet to inches, multiply the number of feet by 12. For example, 5 feet equals 5 × 12 = 60 inches. The ${calc.title} also handles fractional feet and mixed measurements for construction and DIY projects.`,
        },
        {
          question: `How do I convert kilometers to miles?`,
          answer: `To convert kilometers to miles, multiply by 0.621371. For a quick mental estimate, divide the number of kilometers by 1.6. For example, 10 km ≈ 6.2 miles. The ${calc.title} provides exact conversions between kilometers and miles for travel, running, and driving distances.`,
        },
        {
          question: `How many grams are in a pound?`,
          answer: `There are approximately 453.592 grams in 1 pound. To convert pounds to grams, multiply the number of pounds by 453.592. The ${calc.title} handles this conversion precisely, which is especially useful for cooking, shipping, and fitness tracking.`,
        },
        {
          question: `How many liters are in a gallon?`,
          answer: `There are 3.785 liters in 1 US gallon and 4.546 liters in 1 imperial gallon. The ${calc.title} supports both US and imperial measurements so you always get the right conversion for fuel economy, cooking, or liquid storage.`,
        },
        {
          question: `What is the difference between MB and GB in data storage?`,
          answer: `One gigabyte (GB) equals 1,024 megabytes (MB). For example, a 32 GB phone can store approximately 32,768 MB of data. The ${calc.title} converts between all digital storage units including KB, MB, GB, and TB.`,
        },
      ]
      break
    case 'date-time':
      categorySpecific = [
        {
          question: `How many weeks pregnant am I based on my due date?`,
          answer: `Pregnancy is calculated from the first day of your last menstrual period (LMP) and typically lasts 40 weeks. Your current week of pregnancy is determined by counting the weeks between LMP and today. The ${calc.title} calculates your exact pregnancy week, trimester, and estimated due date.`,
        },
        {
          question: `How many days are there between two dates?`,
          answer: `To calculate the number of days between two dates, subtract the earlier date from the later date. The result includes all calendar days in between. The ${calc.title} does this instantly, showing the total days, weekdays, weekends, and the exact duration in months and years.`,
        },
        {
          question: `How do I calculate my exact age in years, months, and days?`,
          answer: `Your exact age is calculated by finding the difference between your birth date and the current date, accounting for leap years and varying month lengths. The ${calc.title} computes your precise age down to the day, which is useful for milestone birthdays, retirement planning, and medical screenings.`,
        },
        {
          question: `How many business days are in a typical year?`,
          answer: `A typical year has about 260 business days (261 in leap years), assuming a Monday-to-Friday workweek. This excludes weekends and can be adjusted for public holidays. The ${calc.title} calculates exact business days between any two dates for project planning and deadline tracking.`,
        },
        {
          question: `How do I calculate the number of workdays between two dates?`,
          answer: `Workdays exclude weekends and optionally holidays from the total day count. The ${calc.title} lets you specify your workweek and subtract holidays to get an accurate business day count for project timelines, payroll, or leave planning.`,
        },
        {
          question: `What time zone am I in and how do I convert between time zones?`,
          answer: `Your time zone is determined by your geographic location relative to Coordinated Universal Time (UTC). The ${calc.title} helps you convert times between any two time zones, accounting for daylight saving time changes and regional offsets.`,
        },
        {
          question: `How many days until my next birthday or anniversary?`,
          answer: `You can calculate days until a future event by subtracting today's date from the target date. The ${calc.title} provides the exact countdown in days, weeks, and months, and even tells you what day of the week the event falls on.`,
        },
      ]
      break
    case 'construction':
      categorySpecific = [
        {
          question: `How much paint do I need for a 12x12 room?`,
          answer: `A 12x12 room with 8-foot ceilings has about 384 square feet of wall area. One gallon of paint typically covers 350 square feet, so you will need about 1 to 1.5 gallons for one coat. The ${calc.title} factors in doors, windows, and multiple coats for an accurate estimate.`,
        },
        {
          question: `How many concrete bags do I need for a patio slab?`,
          answer: `A standard 80-pound bag of concrete mix yields about 0.6 cubic feet. For a 10x10 patio that is 4 inches thick, you need approximately 33 cubic feet of concrete, which requires about 56 bags. The ${calc.title} calculates the exact number of bags based on your slab dimensions and thickness.`,
        },
        {
          question: `How do I calculate square footage for flooring installation?`,
          answer: `Multiply the length by the width of each room in feet to get the square footage. Add 10% extra for waste and cutting allowance. For example, a 15x20 foot room is 300 square feet, so you should purchase about 330 square feet of flooring. The ${calc.title} does all of this automatically.`,
        },
        {
          question: `What is the standard roof pitch for residential homes?`,
          answer: `The most common residential roof pitch is 6/12, meaning the roof rises 6 inches for every 12 inches of horizontal run. Pitches typically range from 4/12 to 9/12 depending on climate and architectural style. The ${calc.title} calculates roof area, material needs, and truss lengths from your pitch and dimensions.`,
        },
        {
          question: `How much gravel do I need for a driveway?`,
          answer: `To calculate gravel volume for a driveway, multiply length by width by depth in feet. A standard driveway with 4 inches of gravel needs about 1.5 tons per 100 square feet. The ${calc.title} converts cubic yards to tons based on the specific gravel type you are using.`,
        },
        {
          question: `How do I estimate lumber costs for building a deck?`,
          answer: `Deck lumber costs depend on the deck size, material choice (pressure-treated, cedar, or composite), and local pricing. A basic 12x16 pressure-treated deck requires roughly 320 square feet of decking plus framing lumber. The ${calc.title} provides a detailed material and cost breakdown for your specific deck design.`,
        },
        {
          question: `What size HVAC unit do I need for my home?`,
          answer: `HVAC size is measured in tons, with 1 ton equal to 12,000 BTU per hour. A rough estimate is 1 ton per 600 square feet of living space, but factors like ceiling height, insulation, windows, and climate matter. The ${calc.title} uses Manual J calculation principles to recommend the right system size.`,
        },
      ]
      break
    case 'statistics':
      categorySpecific = [
        {
          question: `How do I calculate standard deviation from a data set?`,
          answer: `Standard deviation measures how spread out numbers are from the mean. Calculate it by finding each number's deviation from the mean, squaring those deviations, averaging them, and taking the square root. The ${calc.title} computes both population and sample standard deviation for any data set you enter.`,
        },
        {
          question: `What is the difference between population and sample standard deviation?`,
          answer: `Population standard deviation uses all members of a group and divides by N. Sample standard deviation uses a subset and divides by N-1 to provide an unbiased estimate. The ${calc.title} calculates both versions so you can use the correct one for your research or analysis.`,
        },
        {
          question: `How do I find the median of a data set with an even number of values?`,
          answer: `When a data set has an even number of values, the median is the average of the two middle numbers after sorting the data. For example, in the set 2, 4, 7, 9, the median is (4 + 7) / 2 = 5.5. The ${calc.title} automatically sorts your data and finds the correct median.`,
        },
        {
          question: `How do I calculate probability from a frequency distribution?`,
          answer: `Probability is calculated by dividing the number of favorable outcomes by the total number of possible outcomes. For a frequency distribution, divide each category's frequency by the total frequency count. The ${calc.title} converts your raw frequencies into probabilities and percentages instantly.`,
        },
        {
          question: `What is the interquartile range and how do I calculate it?`,
          answer: `The interquartile range (IQR) is the difference between the 75th percentile (Q3) and the 25th percentile (Q1), representing the middle 50% of your data. It is more resistant to outliers than standard deviation. The ${calc.title} calculates Q1, Q3, the IQR, and identifies potential outliers for you.`,
        },
        {
          question: `How do I calculate the correlation coefficient between two variables?`,
          answer: `The Pearson correlation coefficient (r) measures the linear relationship between two variables on a scale from -1 to +1. Values near +1 indicate a strong positive correlation, while values near -1 indicate a strong negative correlation. The ${calc.title} computes r from your paired data points.`,
        },
        {
          question: `What is the formula for calculating a z-score?`,
          answer: `A z-score tells you how many standard deviations a data point is from the mean. The formula is z = (x - μ) / σ, where x is the value, μ is the mean, and σ is the standard deviation. The ${calc.title} calculates z-scores for any data point and can show the corresponding percentile rank.`,
        },
      ]
      break
    case 'education':
      categorySpecific = [
        {
          question: `How do I calculate my GPA for college applications?`,
          answer: `To calculate your GPA, multiply each course grade's point value by the course credits, sum the total points, and divide by the total credits attempted. An A is typically 4.0, B is 3.0, C is 2.0, and so on. The ${calc.title} handles weighted and unweighted GPA calculations for any course load.`,
        },
        {
          question: `What is the difference between weighted and unweighted GPA?`,
          answer: `Unweighted GPA uses a 0 to 4.0 scale regardless of course difficulty, while weighted GPA gives extra points for honors, AP, and IB courses (up to 5.0). A weighted GPA better reflects academic rigor. The ${calc.title} calculates both types so you can report the appropriate one for each application.`,
        },
        {
          question: `How do I calculate what I need on my final exam to pass?`,
          answer: `To find the minimum final exam score needed, subtract your current weighted grade from your target grade and divide by the final exam weight. For example, if your final is worth 20% and you have an 82% currently, aiming for 90% requires a final score of (90 - 82 × 0.8) / 0.2 = 122%. The ${calc.title} does this instantly.`,
        },
        {
          question: `How do I convert letter grades to percentage scores?`,
          answer: `Common letter grade to percentage conversions are: A = 90-100%, B = 80-89%, C = 70-79%, D = 60-69%, F = below 60%. Exact ranges vary by institution. The ${calc.title} converts between letter grades, percentages, and GPA points using your school's specific grading scale.`,
        },
        {
          question: `How many total credit hours do I need to graduate?`,
          answer: `Most bachelor's degree programs require 120 to 130 total credit hours, typically distributed among general education (about 42 credits), major requirements (about 30-60 credits), and electives. The ${calc.title} tracks your completed credits and shows how many you still need for graduation.`,
        },
        {
          question: `How do I calculate my class rank based on GPA?`,
          answer: `Class rank is determined by sorting all students in your graduating class by GPA from highest to lowest. Your rank is your position in that sorted list. The ${calc.title} estimates your percentile rank and class standing when you provide your GPA and class size information.`,
        },
      ]
      break
    case 'physics':
      categorySpecific = [
        {
          question: `How do I calculate force using Newton's second law?`,
          answer: `Newton's second law states that force equals mass times acceleration (F = ma). Force is measured in newtons (N) where 1 N = 1 kg·m/s². The ${calc.title} computes force, mass, or acceleration when you provide the other two values, with support for metric and imperial units.`,
        },
        {
          question: `What is the formula for calculating kinetic energy?`,
          answer: `Kinetic energy is calculated using the formula KE = ½mv², where m is mass in kilograms and v is velocity in meters per second. The result is expressed in joules (J). The ${calc.title} computes kinetic energy for any object based on its mass and speed.`,
        },
        {
          question: `How do I calculate velocity from acceleration and time?`,
          answer: `Velocity is calculated as v = v₀ + at, where v₀ is initial velocity, a is acceleration, and t is time. If starting from rest, velocity is simply acceleration multiplied by time. The ${calc.title} handles these kinematics calculations with support for both constant and variable acceleration scenarios.`,
        },
        {
          question: `What is the difference between speed and velocity?`,
          answer: `Speed is a scalar quantity that measures how fast an object is moving without regard to direction. Velocity is a vector that includes both speed and direction. For example, 60 mph is a speed, while 60 mph north is a velocity. The ${calc.title} helps you solve problems involving both concepts.`,
        },
        {
          question: `How do I calculate gravitational potential energy?`,
          answer: `Gravitational potential energy is calculated as GPE = mgh, where m is mass, g is the acceleration due to gravity (9.8 m/s² on Earth), and h is height above the reference point. The result is in joules. The ${calc.title} computes GPE for any object, including scenarios with varying gravity.`,
        },
        {
          question: `What is the formula for calculating work in physics?`,
          answer: `Work is calculated as W = Fd cos(θ), where F is force, d is displacement, and θ is the angle between the force and displacement vectors. Work is measured in joules (J). The ${calc.title} calculates work for any angle and force combination.`,
        },
        {
          question: `How do I calculate momentum and impulse in collisions?`,
          answer: `Momentum (p) equals mass times velocity (p = mv). Impulse equals force times time or the change in momentum. In a closed system, momentum is conserved before and after collisions. The ${calc.title} calculates these values for elastic and inelastic collision scenarios.`,
        },
      ]
      break
    case 'chemistry':
      categorySpecific = [
        {
          question: `How do I calculate molar mass of a chemical compound?`,
          answer: `Molar mass is the sum of the atomic masses of all atoms in a molecule, expressed in grams per mole (g/mol). For water (H₂O), it is 2 × 1.008 + 15.999 = 18.015 g/mol. The ${calc.title} computes molar mass for any compound when you provide its chemical formula.`,
        },
        {
          question: `How do I calculate pH from hydrogen ion concentration?`,
          answer: `pH is calculated as the negative logarithm of the hydrogen ion concentration: pH = -log₁₀[H⁺]. For example, a concentration of 1 × 10⁻⁷ M gives a pH of 7. The ${calc.title} converts between [H⁺] concentration and pH, and also calculates pOH and the degree of acidity or basicity.`,
        },
        {
          question: `How do I calculate dilution ratios for solutions?`,
          answer: `Dilution follows the formula C₁V₁ = C₂V₂, where C₁ and V₁ are the initial concentration and volume, and C₂ and V₂ are the final concentration and volume. The ${calc.title} solves for any unknown variable in the dilution equation for accurate solution preparation.`,
        },
        {
          question: `How do I convert moles to grams in chemistry?`,
          answer: `To convert moles to grams, multiply the number of moles by the substance's molar mass. For example, 2 moles of NaCl (molar mass 58.44 g/mol) equals 2 × 58.44 = 116.88 grams. The ${calc.title} handles both mole-to-gram and gram-to-mole conversions.`,
        },
        {
          question: `How do I calculate the concentration of a solution in molarity?`,
          answer: `Molarity (M) is moles of solute per liter of solution: M = moles of solute / liters of solution. For example, dissolving 0.5 moles in 0.5 L of water gives a 1.0 M solution. The ${calc.title} calculates molarity, moles, or volume from any two known values.`,
        },
        {
          question: `How do I calculate the percent yield of a chemical reaction?`,
          answer: `Percent yield = (actual yield / theoretical yield) × 100%. The theoretical yield is calculated from stoichiometry, while the actual yield is what you measure in the lab. The ${calc.title} computes your percent yield using your experimental and expected values.`,
        },
      ]
      break
    case 'engineering':
      categorySpecific = [
        {
          question: `How do I calculate voltage drop in a circuit?`,
          answer: `Voltage drop is calculated as V = IR using Ohm's law, where I is current and R is resistance. For long wire runs, you also need to account for wire gauge and length. The ${calc.title} calculates voltage drop for copper and aluminum conductors based on wire size, length, and load current.`,
        },
        {
          question: `What is the formula for calculating beam deflection?`,
          answer: `Beam deflection depends on load type, beam support conditions, material properties, and geometry. For a simply supported beam with a point load at center, deflection δ = PL³/(48EI), where P is load, L is length, E is modulus of elasticity, and I is moment of inertia. The ${calc.title} supports multiple beam configurations.`,
        },
        {
          question: `How do I calculate the load-bearing capacity of a steel beam?`,
          answer: `Load-bearing capacity is determined by the beam's section properties (area, moment of inertia), material yield strength, unsupported length, and loading conditions. The ${calc.title} calculates the maximum allowable load based on bending stress, shear stress, and deflection limits per building codes.`,
        },
        {
          question: `What is the difference between stress and strain in engineering?`,
          answer: `Stress is force per unit area (σ = F/A) measured in pascals (Pa), while strain is the ratio of deformation to original length (ε = ΔL/L) and is dimensionless. The relationship between stress and strain is defined by Young's modulus (E = σ/ε). The ${calc.title} converts between stress, strain, and modulus values.`,
        },
        {
          question: `How do I calculate torque from horsepower and RPM?`,
          answer: `Torque (lb-ft) = (Horsepower × 5252) / RPM. This is the standard formula for rotational mechanical power. For example, an engine producing 300 hp at 4,000 RPM generates 394 lb-ft of torque. The ${calc.title} converts between horsepower, torque, and RPM for any mechanical system.`,
        },
        {
          question: `How do I calculate the shear strength of a bolt?`,
          answer: `Bolt shear strength depends on the bolt diameter, material grade, and whether the shear plane passes through the threaded or unthreaded portion. Single shear capacity = (π × d² / 4) × allowable shear stress. The ${calc.title} computes bolt capacity for SAE and metric grades.`,
        },
        {
          question: `How do I calculate the power consumption of an electrical device?`,
          answer: `Power consumption is calculated as P = V × I for DC circuits, or P = V × I × power factor for AC circuits. Energy consumption over time is P × t in kilowatt-hours. The ${calc.title} computes power, current, voltage, and energy costs for your electrical devices.`,
        },
      ]
      break
    case 'everyday':
      categorySpecific = [
        {
          question: `How much should I tip at a restaurant?`,
          answer: `Standard tipping etiquette suggests 15% for good service, 18% for great service, and 20% or more for exceptional service. For large parties, many restaurants automatically add an 18% gratuity. The ${calc.title} calculates the tip amount and total bill for any percentage and party size.`,
        },
        {
          question: `How do I split a bill evenly between friends?`,
          answer: `To split a bill evenly, divide the total bill (including tax and tip) by the number of people. For example, a $120 bill split among 4 people is $30 each. The ${calc.title} handles uneven splits, separate item tracking, and tip adjustments so everyone pays their fair share.`,
        },
        {
          question: `How do I calculate the sale price after a percentage discount?`,
          answer: `To calculate the sale price, multiply the original price by (1 - discount percentage). For a $50 item at 30% off, the sale price is 50 × 0.70 = $35. The ${calc.title} computes final prices after single or multiple discounts, including tax, so you always know exactly what you will pay.`,
        },
        {
          question: `How do I calculate monthly loan payments for a car or personal loan?`,
          answer: `Monthly loan payments are calculated using the formula M = P × [r(1+r)^n] / [(1+r)^n - 1], where P is principal, r is monthly interest rate, and n is number of payments. The ${calc.title} estimates your monthly payment, total interest, and payoff date for any loan amount and term.`,
        },
        {
          question: `How do I calculate miles per gallon for my car?`,
          answer: `MPG is calculated by dividing the miles driven by the gallons of fuel used. Fill your tank, record the mileage, then fill again and divide the miles driven by the gallons added. The ${calc.title} tracks your fuel economy over multiple fill-ups and calculates average MPG, cost per mile, and fuel expenses.`,
        },
        {
          question: `How much should I budget for groceries each month?`,
          answer: `The USDA recommends spending between $300 and $600 per person per month on groceries, depending on age, dietary needs, and meal plan. The ${calc.title} helps you track your grocery spending, plan meal costs, and find areas where you can save money on food.`,
        },
        {
          question: `How do I calculate my monthly utility bill from meter readings?`,
          answer: `To calculate your utility bill, subtract the previous meter reading from the current reading and multiply by your provider's rate per unit. The ${calc.title} estimates your monthly electricity, gas, and water costs based on usage patterns and local utility rates.`,
        },
      ]
      break
    case 'food':
      categorySpecific = [
        {
          question: `How many calories are in a serving of this homemade recipe?`,
          answer: `To calculate calories per serving, add up the calories from each ingredient and divide by the number of servings. The ${calc.title} provides nutritional breakdowns including calories, protein, carbohydrates, fat, and fiber for any recipe or ingredient combination.`,
        },
        {
          question: `How do I scale a recipe from 4 servings to 6 servings?`,
          answer: `To scale a recipe, divide the desired servings by the original servings to get the scaling factor (6/4 = 1.5), then multiply each ingredient amount by that factor. The ${calc.title} handles scaling for any serving size and automatically adjusts measurements for common cooking units.`,
        },
        {
          question: `How do I convert cooking measurements like teaspoons to tablespoons?`,
          answer: `There are 3 teaspoons in 1 tablespoon, 16 tablespoons in 1 cup, 2 cups in 1 pint, and 4 cups in 1 quart. The ${calc.title} converts between all common cooking measurements including volume, weight, and metric equivalents for precise recipe following.`,
        },
        {
          question: `What is the nutritional difference between whole wheat and white flour?`,
          answer: `Whole wheat flour contains all parts of the wheat kernel, providing more fiber (about 12g per cup vs 3g), protein, vitamins, and minerals than white flour which is mostly starch. The ${calc.title} compares nutritional values of ingredient substitutions to help you make healthier choices.`,
        },
        {
          question: `How do I substitute ingredients in a recipe for dietary restrictions?`,
          answer: `Common substitutions include using applesauce instead of oil (1:1 ratio), flax eggs for regular eggs (1 tbsp flax + 3 tbsp water per egg), and plant-based milk for dairy milk. The ${calc.title} provides substitution ratios and adjusts the nutritional profile when you swap ingredients.`,
        },
        {
          question: `How do I calculate the cost per serving of a homemade meal?`,
          answer: `To calculate cost per serving, add the cost of all ingredients used and divide by the number of servings. Include estimated costs for small amounts of pantry staples. The ${calc.title} computes total recipe cost and per-serving cost to help you budget your meal planning.`,
        },
        {
          question: `How do I convert baking recipes for high altitude?`,
          answer: `At altitudes above 3,000 feet, you typically need to increase oven temperature by 15-25°F, decrease baking powder by 1/8 to 1/4 teaspoon per teaspoon, and increase liquid by 1-2 tablespoons per cup. The ${calc.title} adjusts your recipe ingredients for your specific elevation.`,
        },
      ]
      break
    case 'biology':
      categorySpecific = [
        {
          question: `How do I calculate population growth rate in biology?`,
          answer: `Population growth rate is calculated as r = (ln(N₂/N₁)) / t, where N₁ is the initial population, N₂ is the final population, and t is the time interval. The ${calc.title} computes exponential and logistic growth rates for scientific research and ecological studies.`,
        },
        {
          question: `How do I calculate allele frequency using the Hardy-Weinberg equation?`,
          answer: `The Hardy-Weinberg equation is p² + 2pq + q² = 1, where p is the frequency of the dominant allele and q is the frequency of the recessive allele. The ${calc.title} calculates allele and genotype frequencies from population data and checks if a population is in equilibrium.`,
        },
        {
          question: `What is the formula for calculating the rate of photosynthesis?`,
          answer: `The net photosynthetic rate is calculated as the difference between CO₂ uptake and CO₂ release per unit leaf area per unit time, typically expressed in μmol CO₂/m²/s. The ${calc.title} computes photosynthesis rates from experimental data including light intensity and temperature variables.`,
        },
        {
          question: `How do I calculate the mitotic index of a cell population?`,
          answer: `Mitotic index is calculated by dividing the number of cells in mitosis by the total number of cells observed, multiplied by 100%. A higher mitotic index indicates faster cell division. The ${calc.title} computes mitotic index percentages from your cell count data.`,
        },
        {
          question: `How do I calculate the biodiversity index of an ecosystem?`,
          answer: `The Shannon diversity index (H) is calculated as H = -Σ(pi × ln(pi)), where pi is the proportion of each species. Higher values indicate greater biodiversity. The ${calc.title} computes Shannon, Simpson, and species richness indices from your field survey data.`,
        },
        {
          question: `How do I calculate enzyme reaction rates from experimental data?`,
          answer: `Enzyme reaction rate is calculated as the change in product concentration over time (v = Δ[P]/Δt). The ${calc.title} computes initial reaction rates, Michaelis-Menten constants (Km and Vmax), and creates Lineweaver-Burk plot values from your experimental measurements.`,
        },
      ]
      break
    case 'ecology':
      categorySpecific = [
        {
          question: `How do I calculate my personal carbon footprint?`,
          answer: `Your carbon footprint is estimated based on household energy use, transportation habits, diet, and consumption patterns. The average person emits about 4.6 tons of CO₂ per year in the US. The ${calc.title} calculates your estimated carbon footprint and suggests specific reduction strategies.`,
        },
        {
          question: `How much water does my household consume per day?`,
          answer: `The average American household uses about 300 gallons of water per day, with the largest usage from toilets (24%), washing machines (22%), and showers (20%). The ${calc.title} estimates your daily and monthly water consumption based on household size, fixtures, and usage habits.`,
        },
        {
          question: `How do I calculate waste reduction from recycling?`,
          answer: `Calculate waste reduction by weighing or estimating the volume of materials diverted from landfills through recycling and composting. The average person generates about 4.5 pounds of waste per day, with about 35% being recycled. The ${calc.title} tracks your diversion rate and environmental impact.`,
        },
        {
          question: `What is the formula for calculating ecological footprint?`,
          answer: `Ecological footprint is calculated by converting resource consumption into the land area needed to support that consumption, measured in global hectares. The ${calc.title} estimates your ecological footprint based on energy use, food consumption, transportation, and waste generation patterns.`,
        },
        {
          question: `How much energy can solar panels generate for my home?`,
          answer: `A typical residential solar panel system (6 kW) generates about 7,000 to 9,000 kWh per year depending on location, roof orientation, and shading. The ${calc.title} estimates your potential solar energy production based on your address, roof characteristics, and local weather patterns.`,
        },
        {
          question: `How do I calculate the environmental impact of my daily commute?`,
          answer: `Commute emissions depend on distance, vehicle fuel efficiency, fuel type, and mode of transport. A 20-mile round trip by car emitting about 400 g CO₂ per mile generates roughly 8 kg CO₂ daily. The ${calc.title} compares emissions across car, public transit, biking, and walking options.`,
        },
        {
          question: `How much carbon does a tree absorb per year?`,
          answer: `A mature tree absorbs approximately 48 pounds (22 kg) of CO₂ per year. Over its lifetime, a single tree can absorb about 1 ton of CO₂. The ${calc.title} calculates carbon sequestration based on tree species, age, and diameter to help with reforestation planning.`,
        },
      ]
      break
    case 'sports':
      categorySpecific = [
        {
          question: `What is a good 5K race time based on my current pace?`,
          answer: `A competitive 5K time varies by age and gender. For recreational runners, finishing under 25 minutes is good, while under 20 minutes is excellent. Use the ${calc.title} to predict your race time from your current training pace and see what finishing time to aim for.`,
        },
        {
          question: `How many calories do I burn running a mile?`,
          answer: `A person weighing 155 pounds burns approximately 124 calories per mile run. The exact number depends on body weight, running speed, and running efficiency. The ${calc.title} calculates calories burned for running, cycling, swimming, and other sports based on your weight and workout intensity.`,
        },
        {
          question: `What is my target heart rate zone for cardio exercise?`,
          answer: `Your target heart rate for moderate cardio is 50-70% of your maximum heart rate (220 minus your age), and for vigorous exercise 70-85%. For a 30-year-old, that is 95-162 BPM. The ${calc.title} calculates your personalized heart rate zones and suggests optimal training intensities.`,
        },
        {
          question: `How do I calculate my one-rep max for weightlifting?`,
          answer: `Your one-rep max (1RM) can be estimated using the Epley formula: 1RM = weight × (1 + reps/30). For example, lifting 150 pounds for 8 reps gives an estimated 1RM of 150 × (1 + 8/30) = 190 pounds. The ${calc.title} calculates your 1RM for bench press, squat, deadlift, and other lifts.`,
        },
        {
          question: `What is the ideal running cadence for efficiency?`,
          answer: `The optimal running cadence is typically around 170 to 180 steps per minute for most runners. A higher cadence reduces ground reaction forces and injury risk. The ${calc.title} helps you calculate your current cadence and shows how adjusting it affects your pace and efficiency.`,
        },
        {
          question: `How do I calculate my body fat percentage using circumference measurements?`,
          answer: `The US Navy method uses neck, waist, and hip measurements to estimate body fat percentage with reasonable accuracy. For men: 86.010 × log₁₀(abdomen - neck) - 70.041 × log₁₀(height) + 36.76. The ${calc.title} computes your body fat percentage from simple tape measurements.`,
        },
        {
          question: `What pace do I need to run to achieve my marathon goal time?`,
          answer: `To finish a marathon in 4 hours, you need to maintain an average pace of 9:09 per mile. The ${calc.title} calculates the required pace per mile or kilometer for any race distance and target finish time, and shows you split times at each mile marker.`,
        },
      ]
      break
    default:
      categorySpecific = [
        {
          question: `What makes the ${calc.title} different from other calculators?`,
          answer: `The ${calc.title} provides instant, accurate results with a clean interface designed for ease of use. It uses validated formulas and is part of a comprehensive collection of free calculators covering ${calc.category} and other categories.`,
        },
        {
          question: `What are the most common use cases for the ${calc.title}?`,
          answer: `The ${calc.title} is commonly used by students, professionals, and anyone needing quick ${calc.category} calculations. Typical scenarios include ${calc.description.split('.')[0].toLowerCase()}.`,
        },
        {
          question: `How do I get the most accurate results from the ${calc.title}?`,
          answer: `For the most accurate results, enter precise input values and double-check your numbers before calculating. The ${calc.title} uses standard validated formulas and provides outputs with appropriate decimal precision for ${calc.category} calculations.`,
        },
        {
          question: `Can the ${calc.title} help me learn more about ${calc.category} topics?`,
          answer: `Yes, alongside the calculation results you will find educational content, step-by-step explanations, and links to related resources about ${calc.category} topics. The ${calc.title} is designed to both calculate and teach.`,
        },
        {
          question: `What related calculators are available for ${calc.category} topics?`,
          answer: `Our ${calc.category} collection includes many related calculators covering different aspects of the field. Browse the category page or use the related calculators section at the bottom of this page to discover more tools.`,
        },
      ]
  }

  return [...generic, ...categorySpecific]
}

type TranslateFn = (key: string, params?: Record<string, string | number>) => string

export async function generateGuide(calc: CalculatorEntry, t?: TranslateFn, locale?: string): Promise<CalculatorGuide> {
  const localizedCalc = (locale && locale !== 'en') ? (await getLocalizedCalculator(calc.slug, locale) ?? calc) : calc
  const st = shortTitle(localizedCalc.title)
  const useCases = generateUseCases(localizedCalc)
  const tips = generateTips(localizedCalc)
  const faqs = generateFAQ(localizedCalc)
  const related = await getRelated(localizedCalc, 5)

  const name = localizedCalc.title
  const shortName = st

  const sections: GuideSection[] = [
    {
      id: 'what-is',
      title: t ? t('sections.whatIs', { name }) : `What is the ${name}?`,
      content: generateWhatIs(localizedCalc),
    },
    {
      id: 'how-to-use',
      title: t ? t('sections.howToUse', { name: shortName || name }) : `How to Use ${shortName ? 'the ' + shortName : 'This Calculator'}`,
      content: generateHowToUse(localizedCalc),
    },
    {
      id: 'formula',
      title: t ? t('sections.formula') : 'The Formula Behind the Calculation',
      content: generateFormulaSection(localizedCalc),
    },
    {
      id: 'example',
      title: t ? t('sections.example') : 'Example Calculation',
      content: generateExampleSection(localizedCalc),
    },
    {
      id: 'use-cases',
      title: t ? t('sections.useCases') : 'Common Use Cases',
      content: useCases.map((c, i) => `${i + 1}. ${c}`).join('\n\n'),
    },
    {
      id: 'tips',
      title: t ? t('sections.tips') : 'Tips for Best Results',
      content: tips.map(t => `  - ${t}`).join('\n'),
    },
    {
      id: 'related',
      title: t ? t('sections.related') : 'Related Calculators',
      content: related.length > 0
        ? related.map(r => `- [${r.title}](/${r.hubSlug}/${r.slug}) — ${r.description.split('.')[0]}`).join('\n')
        : 'Explore other calculators in the same category for more helpful tools.',
    },
    {
      id: 'faq',
      title: t ? t('sections.faq') : 'Frequently Asked Questions',
      content: faqs.map(faq => `**${faq.question}**\n\n${faq.answer}`).join('\n\n'),
    },
  ]

  const totalWords = sections.reduce((sum, s) => sum + s.content.split(/\s+/).filter(Boolean).length, 0)

  return {
    sections,
    readingTimeMinutes: Math.max(1, Math.round(totalWords / 200)),
    totalWords,
  }
}

export function buildFaqSchema(calc: CalculatorEntry): { question: string; answer: string }[] {
  const faqs = generateFAQ(calc)
  return faqs
}
