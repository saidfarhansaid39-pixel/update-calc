export interface ExpertContent {
  slug: string
  formula: string
  variables: { symbol: string; meaning: string; unit?: string }[]
  workedExample: { steps: string[]; result: string }
  commonMistakes: string[]
  relatedFormulas: string[]
}

export const EXPERT_CONTENT: Record<string, ExpertContent> = {
  'bmi-calculator': {
    slug: 'bmi-calculator',
    formula: 'BMI = weight(kg) / height(m)²',
    variables: [
      { symbol: 'weight', meaning: 'Body mass', unit: 'kg' },
      { symbol: 'height', meaning: 'Standing height', unit: 'm' },
    ],
    workedExample: {
      steps: [
        'Weight = 70 kg, Height = 1.75 m',
        'Height² = 1.75 × 1.75 = 3.0625',
        'BMI = 70 / 3.0625 = 22.86',
      ],
      result: 'BMI ≈ 22.9 (Healthy range)',
    },
    commonMistakes: [
      'Using pounds without converting to kg',
      'Measuring height in cm but forgetting to divide by 100',
      'Treating BMI as a diagnostic tool rather than a screening measure',
    ],
    relatedFormulas: ['body-fat-calculator', 'calorie-calculator', 'bmr-calculator', 'ideal-weight-calculator'],
  },
  'calorie-calculator': {
    slug: 'calorie-calculator',
    formula: 'TDEE = BMR × activity_factor',
    variables: [
      { symbol: 'BMR', meaning: 'Basal Metabolic Rate', unit: 'kcal/day' },
      { symbol: 'activity_factor', meaning: 'PAL multiplier (1.2 sedentary – 1.9 very active)', unit: '×' },
    ],
    workedExample: {
      steps: [
        'BMR (Mifflin-St Jeor) for a 35-yo woman, 68 kg, 165 cm: 10×68 + 6.25×165 − 5×35 − 161 = 1,375.25',
        'Activity factor for moderate exercise = 1.55',
        'TDEE = 1,375.25 × 1.55 = 2,131.6',
        'For weight loss subtract ~500: 1,632 kcal/day',
      ],
      result: 'Maintenance ≈ 2,132 kcal/day; deficit target ≈ 1,632 kcal/day',
    },
    commonMistakes: [
      'Overestimating your activity level',
      'Using the result as an exact number rather than a ±15% estimate',
      'Not recalculating after significant weight change',
    ],
    relatedFormulas: ['bmr-calculator', 'tdee-calculator', 'macro-calculator', 'protein-calculator'],
  },
  'body-fat-calculator': {
    slug: 'body-fat-calculator',
    formula: 'Fat% ≈ 495 / body_density − 450 (Siri)',
    variables: [
      { symbol: 'body_density', meaning: 'Estimated body density via circumference method', unit: 'g/cm³' },
      { symbol: '495 / 450', meaning: 'Siri equation constants', unit: '—' },
    ],
    workedExample: {
      steps: [
        'Male, waist 88 cm, neck 40 cm, height 178 cm',
        'US Navy: 86.01×log10(88−40) − 70.04×log10(178) + 36.76',
        'log10(48)=1.681, log10(178)=2.250',
        '86.01×1.681 − 70.04×2.250 + 36.76 = 23.83',
      ],
      result: 'Estimated body fat ≈ 23.8%',
    },
    commonMistakes: [
      'Measuring waist at the navel incorrectly (men) or at widest point (women)',
      'Mixing up the male and female Navy formulas',
      'Expecting scale-like precision from a circumference estimate',
    ],
    relatedFormulas: ['bmi-calculator', 'bmr-calculator', 'calorie-calculator', 'lean-body-mass-calculator'],
  },
  'mortgage-calculator': {
    slug: 'mortgage-calculator',
    formula: 'M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]',
    variables: [
      { symbol: 'P', meaning: 'Principal loan amount', unit: '$' },
      { symbol: 'r', meaning: 'Monthly interest rate', unit: '(annual % / 12 / 100)' },
      { symbol: 'n', meaning: 'Total number of payments', unit: 'months' },
    ],
    workedExample: {
      steps: [
        'P = $300,000, annual rate 6.5%, term 30 years',
        'r = 6.5 / 12 / 100 = 0.0054167',
        'n = 30 × 12 = 360',
        'M = 300000 × [0.0054167×(1.0054167)^360] / [(1.0054167)^360 − 1]',
        '(1.0054167)^360 ≈ 6.991 → M = 300000 × 0.03787 / 5.991 = 1,896.2',
      ],
      result: '$1,896 / month (principal & interest)',
    },
    commonMistakes: [
      'Forgetting taxes, insurance and PMI on top of P&I',
      'Using the annual rate instead of the monthly rate',
      'Ignoring how a 0.25% rate change compounds over 30 years',
    ],
    relatedFormulas: ['loan-calculator', 'refinance-calculator', 'home-affordability-calculator', 'amortization-calculator'],
  },
  'loan-calculator': {
    slug: 'loan-calculator',
    formula: 'M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]',
    variables: [
      { symbol: 'P', meaning: 'Loan principal', unit: '$' },
      { symbol: 'r', meaning: 'Periodic interest rate', unit: 'per period' },
      { symbol: 'n', meaning: 'Number of periods', unit: 'periods' },
    ],
    workedExample: {
      steps: [
        'Auto loan P = $25,000, rate 7%, term 60 months',
        'r = 7 / 12 / 100 = 0.005833',
        'n = 60',
        'M = 25000 × [0.005833×(1.005833)^60] / [(1.005833)^60 − 1] = 495.0',
      ],
      result: '$495.03 / month',
    },
    commonMistakes: [
      'Confusing APR (includes fees) with the nominal rate',
      'Rounding the rate too early and drifting from the true payment',
      'Ignoring the total interest paid over the full term',
    ],
    relatedFormulas: ['mortgage-calculator', 'auto-loan-calculator', 'personal-loan-calculator', 'debt-payoff-calculator'],
  },
  'compound-interest-calculator': {
    slug: 'compound-interest-calculator',
    formula: 'A = P(1 + r/n)^(nt)',
    variables: [
      { symbol: 'P', meaning: 'Principal', unit: '$' },
      { symbol: 'r', meaning: 'Annual nominal rate', unit: '(decimal)' },
      { symbol: 'n', meaning: 'Compounding periods per year', unit: '×/yr' },
      { symbol: 't', meaning: 'Time', unit: 'years' },
    ],
    workedExample: {
      steps: [
        'P = $10,000, r = 7%, n = 12, t = 10',
        'r/n = 0.07/12 = 0.005833',
        'nt = 12 × 10 = 120',
        'A = 10000 × (1.005833)^120 = 10000 × 2.0097',
      ],
      result: 'A ≈ $20,097 (more than double)',
    },
    commonMistakes: [
      'Using simple interest instead of compounding',
      'Forgetting that more frequent compounding increases the result',
      'Mixing up annual and periodic rates',
    ],
    relatedFormulas: ['investment-calculator', 'savings-calculator', 'retirement-calculator', 'cd-calculator'],
  },
  'retirement-calculator': {
    slug: 'retirement-calculator',
    formula: 'FV = PV(1+r)ⁿ + PMT × [((1+r)ⁿ − 1)/r]',
    variables: [
      { symbol: 'PV', meaning: 'Current savings', unit: '$' },
      { symbol: 'PMT', meaning: 'Periodic contribution', unit: '$/period' },
      { symbol: 'r', meaning: 'Periodic return rate', unit: 'per period' },
      { symbol: 'n', meaning: 'Number of periods', unit: 'periods' },
    ],
    workedExample: {
      steps: [
        'Age 30, retire at 65 → 35 years',
        'PV = $50,000 grows to 50000×(1.07)^35 ≈ $533,850',
        'Monthly PMT = $500 at r=0.07/12=0.005833 over 420 months ≈ $748,650',
        'Total nest egg = 533,850 + 748,650',
      ],
      result: '$1,282,500 nest egg (4% rule → ~$51,300/yr)',
    },
    commonMistakes: [
      'Ignoring inflation when setting a target income',
      'Assuming returns are guaranteed rather than average',
      'Forgetting to include employer matching',
    ],
    relatedFormulas: ['401k-calculator', 'ira-calculator', 'compound-interest-calculator', 'investment-calculator'],
  },
  'age-calculator': {
    slug: 'age-calculator',
    formula: 'Age = today − birth_date (years, months, days)',
    variables: [
      { symbol: 'birth_date', meaning: 'Date of birth', unit: 'date' },
      { symbol: 'today', meaning: 'Reference date', unit: 'date' },
    ],
    workedExample: {
      steps: [
        'Born March 15, 1990; as of June 28, 2026',
        'Years: 2026 − 1990 = 36 (birthday already passed)',
        'Months: March → June = 3 months',
        'Days: 15 → 28 = 13 days',
      ],
      result: '36 years, 3 months, 13 days',
    },
    commonMistakes: [
      'Subtracting years without checking if the birthday occurred yet',
      'Counting month boundaries incorrectly',
      'Confusing "age on next birthday" with current age',
    ],
    relatedFormulas: ['date-calculator', 'time-calculator', 'retirement-calculator'],
  },
  'percentage-calculator': {
    slug: 'percentage-calculator',
    formula: 'P% of X = X × P/100',
    variables: [
      { symbol: 'X', meaning: 'Whole / base value', unit: '—' },
      { symbol: 'P', meaning: 'Percentage', unit: '%' },
    ],
    workedExample: {
      steps: [
        'What is 25% of 180?',
        '180 × 25/100 = 180 × 0.25',
        '= 45',
      ],
      result: '25% of 180 = 45',
    },
    commonMistakes: [
      'Using the percentage as a whole number instead of /100',
      'Confusing "percent of" with "percent change"',
      'Dividing instead of multiplying for "of" problems',
    ],
    relatedFormulas: ['percent-increase-calculator', 'percent-off-calculator', 'margin-calculator', 'discount-calculator'],
  },
  'unit-converter': {
    slug: 'unit-converter',
    formula: 'Result = value × conversion_factor',
    variables: [
      { symbol: 'value', meaning: 'Input magnitude', unit: 'from-unit' },
      { symbol: 'conversion_factor', meaning: 'Constant relating from-unit to to-unit', unit: 'to/from' },
    ],
    workedExample: {
      steps: [
        'Convert 10 miles to km',
        'Factor: 1 mi = 1.60934 km',
        '10 × 1.60934 = 16.0934',
      ],
      result: '10 mi = 16.09 km',
    },
    commonMistakes: [
      'Using an approximate factor (e.g., 1.6) when precision matters',
      'Mixing up reciprocal factors for reverse conversions',
      'Forgetting temperature uses an offset, not just a factor',
    ],
    relatedFormulas: ['conversion-calculator', 'length-calculator', 'temperature-calculator', 'weight-calculator'],
  },
  'square-root-calculator': {
    slug: 'square-root-calculator',
    formula: '√x = y where y² = x',
    variables: [
      { symbol: 'x', meaning: 'Radicand (non-negative)', unit: '—' },
      { symbol: 'y', meaning: 'Principal square root', unit: '—' },
    ],
    workedExample: {
      steps: [
        'Find √144',
        'Ask: what number squared equals 144?',
        '12 × 12 = 144',
      ],
      result: '√144 = 12',
    },
    commonMistakes: [
      'Taking the square root of a negative number and expecting a real result',
      'Confusing √(a+b) with √a + √b',
      'Dropping the ± when solving equations like x² = 9',
    ],
    relatedFormulas: ['exponent-calculator', 'scientific-calculator', 'quadratic-formula-calculator'],
  },
  'scientific-calculator': {
    slug: 'scientific-calculator',
    formula: 'f(x) = combination of +, −, ×, ÷, xʸ, log, sin, cos, tan, …',
    variables: [
      { symbol: 'x', meaning: 'Input operand', unit: '—' },
      { symbol: 'y', meaning: 'Exponent / second operand', unit: '—' },
    ],
    workedExample: {
      steps: [
        'Compute 2³ + log₁₀(100)',
        '2³ = 8',
        'log₁₀(100) = 2',
        '8 + 2 = 10',
      ],
      result: '10',
    },
    commonMistakes: [
      'Wrong operator precedence (use parentheses)',
      'Forgetting the calculator angle mode (DEG vs RAD)',
      'Confusing ln (base e) with log (base 10)',
    ],
    relatedFormulas: ['exponent-calculator', 'log-calculator', 'square-root-calculator'],
  },
  'gpa-calculator': {
    slug: 'gpa-calculator',
    formula: 'GPA = Σ(grade_pts × credits) / Σ(credits)',
    variables: [
      { symbol: 'grade_pts', meaning: 'Grade points (A=4.0, B=3.0, …)', unit: 'pts' },
      { symbol: 'credits', meaning: 'Course credit hours', unit: 'cr' },
    ],
    workedExample: {
      steps: [
        'A (4.0) × 3 cr = 12',
        'B (3.0) × 4 cr = 12',
        'A− (3.7) × 3 cr = 11.1',
        'Σ = 35.1, Σcredits = 10 → 35.1/10 = 3.51',
      ],
      result: 'GPA = 3.51',
    },
    commonMistakes: [
      'Adding grades without weighting by credits',
      'Mixing weighted and unweighted scales',
      'Forgetting pass/fail courses usually carry 0 grade points',
    ],
    relatedFormulas: ['grade-calculator', 'cumulative-gpa-calculator'],
  },
  'grade-calculator': {
    slug: 'grade-calculator',
    formula: 'Final = Σ(category_grade × weight)',
    variables: [
      { symbol: 'category_grade', meaning: 'Score in a category', unit: '%' },
      { symbol: 'weight', meaning: 'Category weight', unit: 'decimal' },
    ],
    workedExample: {
      steps: [
        'Assignments 88 × 0.40 = 35.2',
        'Exams 92 × 0.50 = 46.0',
        'Participation 85 × 0.10 = 8.5',
        'Sum = 89.7',
      ],
      result: 'Final grade = 89.7% (B+)',
    },
    commonMistakes: [
      'Using percentages instead of decimals for weights',
      'Weights that do not sum to 1.0 (100%)',
      'Forgetting dropped or extra-credit items',
    ],
    relatedFormulas: ['gpa-calculator', 'final-grade-calculator'],
  },
  'tip-calculator': {
    slug: 'tip-calculator',
    formula: 'Tip = bill × tip%   |   Total = bill + tip',
    variables: [
      { symbol: 'bill', meaning: 'Pre-tip bill amount', unit: '$' },
      { symbol: 'tip%', meaning: 'Tip percentage', unit: '%' },
    ],
    workedExample: {
      steps: [
        'Bill = $85.50, tip = 18%',
        'Tip = 85.50 × 0.18 = 15.39',
        'Total = 85.50 + 15.39 = 100.89',
        'Split 4 ways: 100.89 / 4 = 25.22',
      ],
      result: '$25.22 per person',
    },
    commonMistakes: [
      'Tipping on the post-tax amount inconsistently',
      'Forgetting to split the tip, not just the bill',
      'Mis-keying the percentage as a whole number',
    ],
    relatedFormulas: ['tax-calculator', 'discount-calculator', 'split-bill-calculator'],
  },
  'tax-calculator': {
    slug: 'tax-calculator',
    formula: 'Tax = price × rate%   |   Total = price + tax',
    variables: [
      { symbol: 'price', meaning: 'Taxable price', unit: '$' },
      { symbol: 'rate%', meaning: 'Tax rate', unit: '%' },
    ],
    workedExample: {
      steps: [
        'Item $120, sales tax 8%',
        'Tax = 120 × 0.08 = 9.60',
        'Total = 120 + 9.60 = 129.60',
      ],
      result: 'Total = $129.60',
    },
    commonMistakes: [
      'Applying tax to a discounted price incorrectly',
      'Using the wrong regional rate',
      'Confusing VAT (included in price) with sales tax (added on top)',
    ],
    relatedFormulas: ['vat-calculator', 'sales-tax-calculator', 'income-tax-calculator', 'tip-calculator'],
  },
  'salary-calculator': {
    slug: 'salary-calculator',
    formula: 'Annual = hourly × 2080   |   Monthly = annual / 12',
    variables: [
      { symbol: 'hourly', meaning: 'Hourly wage', unit: '$/hr' },
      { symbol: '2080', meaning: 'Standard hours/year (40 × 52)', unit: 'hr/yr' },
    ],
    workedExample: {
      steps: [
        'Hourly = $25, 40 hrs/week, 52 weeks',
        'Weekly = 25 × 40 = 1,000',
        'Annual = 1,000 × 52 = 52,000',
        'Monthly = 52,000 / 12 = 4,333.33',
      ],
      result: '$52,000/yr ($4,333.33/mo)',
    },
    commonMistakes: [
      'Forgetting unpaid time off reduces effective annual pay',
      'Ignoring overtime (1.5×) when applicable',
      'Using 2,000 instead of 2,080 hours',
    ],
    relatedFormulas: ['hourly-wage-calculator', 'overtime-calculator', 'income-tax-calculator'],
  },
  'rent-calculator': {
    slug: 'rent-calculator',
    formula: 'Affordable Rent ≈ gross_monthly_income × 0.30',
    variables: [
      { symbol: 'gross_monthly_income', meaning: 'Pre-tax monthly income', unit: '$/mo' },
      { symbol: '0.30', meaning: '30% housing rule', unit: '×' },
    ],
    workedExample: {
      steps: [
        'Gross monthly income = $5,000',
        '30% rule: 5000 × 0.30 = 1,500',
        'Add utilities/renters insurance for true cost',
      ],
      result: 'Affordable rent ≈ $1,500/mo',
    },
    commonMistakes: [
      'Budgeting rent only, ignoring utilities and renters insurance',
      'Ignoring the 30% is a ceiling, not a target',
      'Forgetting one-time moving and deposit costs',
    ],
    relatedFormulas: ['mortgage-calculator', 'rent-vs-buy-calculator', 'salary-calculator'],
  },
  'bmr-calculator': {
    slug: 'bmr-calculator',
    formula: 'BMR = 10W + 6.25H − 5A + 5 (M) | 10W + 6.25H − 5A − 161 (F)',
    variables: [
      { symbol: 'W', meaning: 'Weight', unit: 'kg' },
      { symbol: 'H', meaning: 'Height', unit: 'cm' },
      { symbol: 'A', meaning: 'Age', unit: 'years' },
    ],
    workedExample: {
      steps: [
        'Female, 68 kg, 165 cm, 35 yrs',
        'BMR = 10×68 + 6.25×165 − 5×35 − 161',
        '= 680 + 1,031.25 − 175 − 161',
      ],
      result: 'BMR ≈ 1,375 kcal/day (Mifflin-St Jeor)',
    },
    commonMistakes: [
      'Using pounds/feet instead of kg/cm',
      'Confusing BMR with TDEE',
      'Applying the male/female constant to the wrong sex',
    ],
    relatedFormulas: ['tdee-calculator', 'calorie-calculator', 'macro-calculator'],
  },
  'tdee-calculator': {
    slug: 'tdee-calculator',
    formula: 'TDEE = BMR × PAL',
    variables: [
      { symbol: 'BMR', meaning: 'Basal Metabolic Rate', unit: 'kcal/day' },
      { symbol: 'PAL', meaning: 'Physical Activity Level', unit: '×' },
    ],
    workedExample: {
      steps: [
        'BMR = 1,375 (from BMR calc)',
        'Active lifestyle PAL = 1.55',
        'TDEE = 1,375 × 1.55 = 2,131.25',
      ],
      result: 'TDEE ≈ 2,131 kcal/day',
    },
    commonMistakes: [
      'Choosing too high a PAL multiplier',
      'Adding exercise calories on top of an already-active TDEE',
      'Not adjusting after weight changes',
    ],
    relatedFormulas: ['bmr-calculator', 'calorie-calculator', 'macro-calculator'],
  },
  'pregnancy-calculator': {
    slug: 'pregnancy-calculator',
    formula: 'Gestational Age = today − LMP (weeks + days)',
    variables: [
      { symbol: 'LMP', meaning: 'First day of last menstrual period', unit: 'date' },
      { symbol: 'today', meaning: 'Current date', unit: 'date' },
    ],
    workedExample: {
      steps: [
        'LMP = January 15, 2024',
        'Days since LMP counted = ~187 days',
        '187 / 7 ≈ 26.7 weeks',
      ],
      result: '≈ 26 weeks, 5 days pregnant',
    },
    commonMistakes: [
      'Counting from conception instead of LMP (adds ~2 weeks)',
      'Assuming due date is exact (only ~5% deliver on it)',
      'Misremembering the LMP date',
    ],
    relatedFormulas: ['due-date-calculator', 'ovulation-calculator', 'age-calculator'],
  },
  'due-date-calculator': {
    slug: 'due-date-calculator',
    formula: 'EDD = LMP + 280 days (Naegele’s Rule)',
    variables: [
      { symbol: 'LMP', meaning: 'First day of last menstrual period', unit: 'date' },
      { symbol: '280', meaning: 'Average human gestation', unit: 'days' },
    ],
    workedExample: {
      steps: [
        'LMP = January 15, 2024',
        'Add 280 days (40 weeks)',
        'Jan: 16 remaining, then Feb 29 + Mar 31 + Apr 30 + May 31 + Jun 30 + Jul 31 + Aug 31 + Sep 30 = 243',
        '264 − 243 = 21 → October 21',
      ],
      result: 'Estimated due date: October 21, 2024',
    },
    commonMistakes: [
      'Using LMP end date instead of first day',
      'Forgetting leap-year February',
      'Assuming delivery exactly on the EDD',
    ],
    relatedFormulas: ['pregnancy-calculator', 'ovulation-calculator'],
  },
  'gas-calculator': {
    slug: 'gas-calculator',
    formula: 'Gallons used = distance / MPG',
    variables: [
      { symbol: 'distance', meaning: 'Trip distance', unit: 'mi' },
      { symbol: 'MPG', meaning: 'Fuel efficiency', unit: 'mi/gal' },
    ],
    workedExample: {
      steps: [
        'Trip = 300 mi, MPG = 25',
        'Gallons = 300 / 25 = 12',
        'At $3.50/gal → 12 × 3.50 = 42',
      ],
      result: '12 gallons → $42.00',
    },
    commonMistakes: [
      'Mixing MPG (imperial) with L/100km',
      'Using highway MPG for mixed city driving',
      'Forgetting round-trip distance',
    ],
    relatedFormulas: ['fuel-cost-calculator', 'mpg-calculator', 'distance-calculator'],
  },
  'fuel-cost-calculator': {
    slug: 'fuel-cost-calculator',
    formula: 'Cost = (distance / MPG) × price_per_gallon',
    variables: [
      { symbol: 'distance', meaning: 'Trip distance', unit: 'mi' },
      { symbol: 'MPG', meaning: 'Vehicle efficiency', unit: 'mi/gal' },
      { symbol: 'price_per_gallon', meaning: 'Fuel price', unit: '$/gal' },
    ],
    workedExample: {
      steps: [
        'Distance = 500 mi, MPG = 30, price = $3.80',
        'Gallons = 500 / 30 = 16.67',
        'Cost = 16.67 × 3.80 = 63.33',
      ],
      result: 'Fuel cost ≈ $63.33',
    },
    commonMistakes: [
      'Using MPG when the input expects L/100km',
      'Forgetting tolls, parking and wear',
      'Ignoring that real MPG differs from EPA ratings',
    ],
    relatedFormulas: ['gas-calculator', 'mpg-calculator', 'distance-calculator'],
  },
  'distance-calculator': {
    slug: 'distance-calculator',
    formula: 'd = √[(x₂−x₁)² + (y₂−y₁)²]  (or route distance)',
    variables: [
      { symbol: 'x₁, y₁', meaning: 'Start coordinates', unit: '—' },
      { symbol: 'x₂, y₂', meaning: 'End coordinates', unit: '—' },
    ],
    workedExample: {
      steps: [
        'From (0,0) to (3,4)',
        'Δx = 3, Δy = 4',
        'd = √(3² + 4²) = √25 = 5',
      ],
      result: 'Straight-line distance = 5 units',
    },
    commonMistakes: [
      'Using straight-line distance for driving routes',
      'Mixing km and miles',
      'Forgetting Earth curvature for very long hauls',
    ],
    relatedFormulas: ['time-calculator', 'fuel-cost-calculator', 'conversion-calculator'],
  },
  'time-calculator': {
    slug: 'time-calculator',
    formula: 'Duration = end − start',
    variables: [
      { symbol: 'start', meaning: 'Start time', unit: 'hh:mm' },
      { symbol: 'end', meaning: 'End time', unit: 'hh:mm' },
    ],
    workedExample: {
      steps: [
        'Start 9:15 AM, end 4:45 PM',
        'Convert: 9:15 and 16:45',
        'Hours: 16 − 9 = 7, Minutes: 45 − 15 = 30',
      ],
      result: 'Duration = 7 h 30 min',
    },
    commonMistakes: [
      'Forgetting to convert PM to 24-hour time',
      'Borrowing an hour incorrectly when minutes wrap',
      'Ignoring time zones for travel math',
    ],
    relatedFormulas: ['age-calculator', 'date-calculator', 'distance-calculator'],
  },
  'conversion-calculator': {
    slug: 'conversion-calculator',
    formula: 'Result = value × factor(from → to)',
    variables: [
      { symbol: 'value', meaning: 'Input magnitude', unit: 'from' },
      { symbol: 'factor', meaning: 'Conversion constant', unit: 'to/from' },
    ],
    workedExample: {
      steps: [
        'Convert 100 km to miles',
        'Factor: 1 km = 0.621371 mi',
        '100 × 0.621371 = 62.137',
      ],
      result: '100 km = 62.14 mi',
    },
    commonMistakes: [
      'Using the reciprocal factor',
      'Rounding factors too aggressively',
      'Applying linear factors to temperature',
    ],
    relatedFormulas: ['unit-converter', 'length-calculator', 'temperature-calculator'],
  },
  'probability-calculator': {
    slug: 'probability-calculator',
    formula: 'P(E) = favorable / total',
    variables: [
      { symbol: 'favorable', meaning: 'Favorable outcomes', unit: 'count' },
      { symbol: 'total', meaning: 'Total possible outcomes', unit: 'count' },
    ],
    workedExample: {
      steps: [
        'Roll a fair die, P(even)',
        'Favorable = {2,4,6} = 3',
        'Total = 6',
        'P = 3/6 = 0.5',
      ],
      result: 'P(even) = 50%',
    },
    commonMistakes: [
      'Assuming equally likely outcomes when they are not',
      'Adding probabilities above 1',
      'Confusing independent and dependent events',
    ],
    relatedFormulas: ['combination-calculator', 'permutation-calculator', 'odds-calculator'],
  },
  'standard-deviation-calculator': {
    slug: 'standard-deviation-calculator',
    formula: 'σ = √[Σ(xᵢ − μ)² / N]   (population)',
    variables: [
      { symbol: 'xᵢ', meaning: 'Data point i', unit: '—' },
      { symbol: 'μ', meaning: 'Mean', unit: '—' },
      { symbol: 'N', meaning: 'Number of data points', unit: 'count' },
    ],
    workedExample: {
      steps: [
        'Data: 2,4,4,4,5,5,7,9',
        'Mean μ = 40/8 = 5',
        'Σ(x−μ)² = 9+1+1+1+0+0+4+16 = 32',
        'Population: 32/8 = 4 → √4 = 2',
      ],
      result: 'σ = 2.0',
    },
    commonMistakes: [
      'Dividing by N instead of N−1 for a sample',
      'Forgetting to square before summing',
      'Mixing sample and population formulas',
    ],
    relatedFormulas: ['mean-median-mode-calculator', 'variance-calculator', 'z-score-calculator'],
  },
}

export function getExpertContent(slug: string): ExpertContent | null {
  return EXPERT_CONTENT[slug] || null
}
