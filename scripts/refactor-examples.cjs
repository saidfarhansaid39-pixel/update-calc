const fs = require('fs');
const path = require('path');
const base = 'C:/Users/store one/Pictures/calculatora/MpB2M28jkJJIYqVynKKb/Fichiers multiples';
const tsPath = path.join(base, 'src/lib/seo/guide-content.ts');
const enPath = path.join(base, 'src/i18n/messages/en.json');

function slugKey(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ---- EXAMPLE DATA (English source of truth) ----
const EXAMPLE_DATA = {
  'financial-mortgage': {
    scenario: 'Calculating a home loan monthly payment',
    inputs: [['Loan Amount', 300000], ['Interest Rate', 6.5], ['Loan Term (years)', 30]],
    steps: [
      'Convert the annual interest rate to a monthly rate: 6.5% / 12 = 0.5417% or 0.005417',
      'Determine the total number of payments: 30 years × 12 months = 360 payments',
      'Apply the formula: M = 300,000 × [0.005417(1.005417)^360] / [(1.005417)^360 - 1]',
      'Calculate the numerator: 300,000 × (0.005417 × 6.991) = 300,000 × 0.03787',
      'Calculate the denominator: 6.991 - 1 = 5.991',
      'Divide to get the monthly payment: $11,361 / 5.991 = $1,896'
    ],
    result: '$1,896 per month (principal and interest only)'
  },
  'financial-compound-interest': {
    scenario: 'Growing an investment with compound interest',
    inputs: [['Principal', 10000], ['Annual Rate', 7], ['Time (years)', 10], ['Compounds per Year', 12]],
    steps: [
      'Identify your values: P = $10,000, r = 0.07, n = 12, t = 10',
      'Plug into the formula: A = 10,000 × (1 + 0.07/12)^(12×10)',
      'Calculate the monthly rate: 0.07/12 = 0.005833',
      'Calculate the exponent: 12 × 10 = 120',
      'Compute: A = 10,000 × (1.005833)^120',
      '(1.005833)^120 = 2.0097, so A = 10,000 × 2.0097 = $20,097'
    ],
    result: '$20,097 (more than double the original investment)'
  },
  'financial-retirement': {
    scenario: 'Planning for retirement savings',
    inputs: [['Current Age', 30], ['Retirement Age', 65], ['Current Savings', 50000], ['Monthly Contribution', 500], ['Annual Return', 7]],
    steps: [
      'Determine your time horizon: 65 - 30 = 35 years until retirement',
      'Calculate future value of current savings: $50,000 × (1.07)^35 = $50,000 × 10.677 = $533,850',
      'Calculate future value of monthly contributions using annuity formula',
      '$500/month × [((1.00583)^420 - 1)/0.00583] = $500 × 1,497.3 = $748,650',
      'Add both components: $533,850 + $748,650 = $1,282,500',
      'Apply the 4% withdrawal rule: $1,282,500 × 0.04 = $51,300 per year'
    ],
    result: '$1,282,500 nest egg providing $51,300/year in retirement'
  },
  'financial-salary': {
    scenario: 'Converting an hourly wage to annual salary',
    inputs: [['Hourly Wage', 25], ['Hours per Week', 40], ['Weeks per Year', 52]],
    steps: [
      'Calculate weekly earnings: $25/hour × 40 hours = $1,000 per week',
      'Multiply by weeks worked per year: $1,000 × 52 = $52,000',
      'For monthly income: $52,000 / 12 = $4,333.33 per month',
      'For biweekly income: $52,000 / 26 = $2,000 per paycheck'
    ],
    result: '$52,000 per year (or $4,333.33 per month)'
  },
  'financial-debt-payoff': {
    scenario: 'Paying off credit card debt faster',
    inputs: [['Balance', 10000], ['Interest Rate', 18], ['Monthly Payment', 350]],
    steps: [
      'Calculate monthly interest rate: 18% / 12 = 1.5%',
      'Month 1: interest = $10,000 × 0.015 = $150, principal = $350 - $150 = $200, new balance = $9,800',
      'Month 2: interest = $9,800 × 0.015 = $147, principal = $350 - $147 = $203, new balance = $9,597',
      'Continue this process: each month less interest is charged as the balance drops',
      'After approximately 35 months, the balance reaches zero'
    ],
    result: 'Debt-free in 35 months with total interest of ~$2,250'
  },
  'financial-budget': {
    scenario: 'Creating a monthly household budget',
    inputs: [['Monthly Income', 5500], ['Housing', 1800], ['Food', 600], ['Transportation', 400], ['Utilities', 250], ['Entertainment', 300]],
    steps: [
      'List all monthly income sources: total = $5,500',
      'List all monthly expenses: Housing $1,800 + Food $600 + Transportation $400 + Utilities $250 + Entertainment $300 = $3,350',
      'Subtract total expenses from income: $5,500 - $3,350 = $2,150',
      'Calculate savings rate: $2,150 / $5,500 × 100 = 39.1%',
      'Consider the 50/30/20 rule: needs ($3,350 = 61%), wants ($300 = 5%), savings ($2,150 = 39%)'
    ],
    result: '$2,150 monthly surplus with a 39.1% savings rate'
  },
  'financial-income-tax': {
    scenario: 'Estimating annual income tax liability',
    inputs: [['Annual Income', 85000], ['Filing Status', 'Single'], ['Standard Deduction', 14600]],
    steps: [
      'Start with gross income: $85,000',
      'Subtract the standard deduction: $85,000 - $14,600 = $70,400 taxable income',
      'Apply the 2024 tax brackets for single filers:',
      '10% on first $11,600 = $1,160',
      '12% on $11,601-$47,150 = $4,266',
      '22% on $47,151-$70,400 = $5,115',
      'Total tax: $1,160 + $4,266 + $5,115 = $10,541'
    ],
    result: '$10,541 total tax, effective rate of 12.4%'
  },
  'financial-roi': {
    scenario: 'Calculating return on an investment',
    inputs: [['Initial Investment', 50000], ['Final Value', 72000], ['Time (years)', 5]],
    steps: [
      'Calculate total gain: $72,000 - $50,000 = $22,000',
      'Apply ROI formula: ($72,000 - $50,000) / $50,000 × 100',
      'ROI = $22,000 / $50,000 × 100 = 44%',
      'For annualized ROI: (1.44)^(1/5) - 1 = 1.0758 - 1 = 0.0758 or 7.58% per year'
    ],
    result: '44% total ROI (7.58% annualized)'
  },
  'financial-net-worth': {
    scenario: 'Calculating personal net worth',
    inputs: [['Cash and Savings', 25000], ['Investments', 120000], ['Home Value', 350000], ['Mortgage', 280000], ['Car Loan', 15000], ['Credit Cards', 5000]],
    steps: [
      'Total assets: $25,000 + $120,000 + $350,000 = $495,000',
      'Total liabilities: $280,000 + $15,000 + $5,000 = $300,000',
      'Net worth: $495,000 - $300,000 = $195,000'
    ],
    result: 'Net worth of $195,000'
  },
  'financial-tip': {
    scenario: 'Splitting a restaurant bill',
    inputs: [['Bill Amount', 85.50], ['Tip Percentage', 18], ['Number of People', 4]],
    steps: [
      'Calculate tip: $85.50 × 0.18 = $15.39',
      'Total bill with tip: $85.50 + $15.39 = $100.89',
      'Split evenly: $100.89 / 4 = $25.22 per person'
    ],
    result: '$25.22 per person (including 18% tip)'
  },
  'financial-discount': {
    scenario: 'Calculating the final price after a discount',
    inputs: [['Original Price', 120], ['Discount Percentage', 25]],
    steps: [
      'Convert discount to decimal: 25% = 0.25',
      'Calculate discount amount: $120 × 0.25 = $30',
      'Subtract from original: $120 - $30 = $90',
      'Or directly: $120 × (1 - 0.25) = $120 × 0.75 = $90'
    ],
    result: '$90 final price (saving $30)'
  },
  'financial-refinance': {
    scenario: 'Evaluating a mortgage refinance opportunity',
    inputs: [['Current Balance', 250000], ['Current Rate', 7], ['New Rate', 5.5], ['New Term (years)', 30], ['Closing Costs', 6000]],
    steps: [
      'Current monthly payment at 7%: $1,663',
      'New monthly payment at 5.5%: $1,419',
      'Monthly savings: $1,663 - $1,419 = $244',
      'Breakeven point: $6,000 / $244 = 24.6 months',
      'After 25 months, you start saving money'
    ],
    result: '$244/month savings, breakeven in ~25 months'
  },
  'financial-rent-vs-buy': {
    scenario: 'Comparing renting vs buying a home',
    inputs: [['Home Price', 350000], ['Monthly Rent', 1800], ['Down Payment', 70000], ['Mortgage Rate', 6.5], ['Time Horizon (years)', 7]],
    steps: [
      'Buy scenario: Monthly mortgage payment = $1,770, plus taxes/insurance $400 = $2,170',
      'Rent scenario: Monthly rent = $1,800, invest down payment difference',
      'Over 7 years: Buying builds ~$85,000 in equity; renting invests $70,000 growing to ~$112,000',
      'Break-even analysis favors buying if staying more than 5 years'
    ],
    result: 'Buying is more favorable over a 7-year horizon'
  },
  'health-bmi': {
    scenario: 'Calculating Body Mass Index',
    inputs: [['Weight', 75], ['Height', 175]],
    steps: [
      'Convert height to meters: 175 cm = 1.75 m',
      'Square the height: 1.75² = 3.0625',
      'Apply the BMI formula: 75 / 3.0625 = 24.49',
      'The result 24.49 falls in the "Normal weight" range (18.5-24.9)'
    ],
    result: 'BMI of 24.49 (Normal weight)'
  },
  'health-bmr': {
    scenario: 'Calculating daily calorie needs for a 35-year-old woman',
    inputs: [['Age', 35], ['Weight (kg)', 68], ['Height (cm)', 165], ['Activity Level', 'Moderate']],
    steps: [
      'Calculate BMR using Mifflin-St Jeor: BMR = 10 × 68 + 6.25 × 165 - 5 × 35 - 161',
      'BMR = 680 + 1,031.25 - 175 - 161 = 1,375.25 calories/day',
      'Apply activity multiplier (moderate = 1.55): TDEE = 1,375.25 × 1.55',
      'Daily maintenance calories: approximately 2,132',
      'For weight loss: subtract 500 calories = target of 1,632 per day'
    ],
    result: '2,132 calories/day to maintain weight; 1,632 for weight loss'
  },
  'health-body-fat': {
    scenario: 'Estimating body fat percentage using circumference method',
    inputs: [['Gender', 'Male'], ['Waist (cm)', 88], ['Neck (cm)', 40], ['Height (cm)', 178]],
    steps: [
      'Use the US Navy circumference formula: 86.01 × log10(waist - neck) - 70.04 × log10(height) + 36.76',
      'Waist minus neck: 88 - 40 = 48 cm',
      'log10(48) = 1.681, log10(178) = 2.250',
      'Body fat % = 86.01 × 1.681 - 70.04 × 2.250 + 36.76',
      '= 144.6 - 157.6 + 36.76 = 23.8%'
    ],
    result: 'Estimated body fat of 23.8%'
  },
  'health-heart-rate': {
    scenario: 'Finding target heart rate zones for a 40-year-old',
    inputs: [['Age', 40], ['Resting Heart Rate', 65]],
    steps: [
      'Calculate maximum heart rate: 208 - 0.7 × 40 = 180 bpm',
      'Calculate heart rate reserve (Karvonen): 180 - 65 = 115 bpm',
      'Zone 2 (moderate, 60-70%): (115 × 0.60) + 65 = 134 bpm to (115 × 0.70) + 65 = 145 bpm',
      'Zone 4 (vigorous, 80-90%): (115 × 0.80) + 65 = 157 bpm to (115 × 0.90) + 65 = 168 bpm'
    ],
    result: 'Zone 2: 134-145 bpm | Zone 4: 157-168 bpm'
  },
  'health-pregnancy': {
    scenario: 'Estimating due date from last menstrual period',
    inputs: [['First Day of LMP', 'January 15, 2024'], ['Cycle Length', 28]],
    steps: [
      'Start with the first day of your last menstrual period: January 15, 2024',
      'Add 280 days (40 weeks): Naegele\'s Rule',
      'January has 31 days, so 31 - 15 = 16 remaining days in January',
      '280 - 16 = 264 days remaining after January',
      'Count forward: February (29) + March (31) + April (30) + May (31) + June (30) + July (31) + August (31) + September (30) = 243',
      '264 - 243 = 21 days into October = October 21, 2024'
    ],
    result: 'Estimated due date: October 21, 2024'
  },
  'health-water-intake': {
    scenario: 'Calculating daily water intake needs',
    inputs: [['Weight (kg)', 75], ['Exercise Minutes', 30]],
    steps: [
      'Base water intake: 75 kg × 0.033 = 2.475 liters per day',
      'Add extra for exercise: 30 minutes of moderate activity adds ~0.3 liters',
      'Total daily recommendation: 2.475 + 0.3 = 2.775 liters'
    ],
    result: 'Approximately 2.8 liters (about 12 cups) of water per day'
  },
  'health-protein': {
    scenario: 'Calculating daily protein needs for muscle building',
    inputs: [['Weight (kg)', 80], ['Goal', 'Muscle Building']],
    steps: [
      'For muscle building, use a factor of 1.6-2.2 g per kg of body weight',
      'Using 1.8 g/kg: 80 × 1.8 = 144 grams of protein per day',
      'In calories: 144 × 4 = 576 calories from protein',
      'Spread across 4 meals: ~36 grams of protein per meal'
    ],
    result: '144 grams of protein per day (~36g per meal)'
  },
  'math-percentage': {
    scenario: 'Finding what percentage one number is of another',
    inputs: [['Part', 45], ['Whole', 180]],
    steps: [
      'Divide the part by the whole: 45 / 180 = 0.25',
      'Multiply by 100 to get the percentage: 0.25 × 100 = 25%',
      'So 45 is 25% of 180'
    ],
    result: '45 is 25% of 180'
  },
  'math-fraction': {
    scenario: 'Adding two fractions together',
    inputs: [['First Fraction', '3/4'], ['Second Fraction', '2/5']],
    steps: [
      'Find a common denominator: 4 × 5 = 20',
      'Convert 3/4: (3 × 5) / (4 × 5) = 15/20',
      'Convert 2/5: (2 × 4) / (5 × 4) = 8/20',
      'Add the numerators: 15 + 8 = 23',
      'Result: 23/20 or 1 3/20 as a mixed number'
    ],
    result: '23/20 (or 1 3/20, approximately 1.15)'
  },
  'math-pythagorean': {
    scenario: 'Finding the hypotenuse of a right triangle',
    inputs: [['Side A', 6], ['Side B', 8]],
    steps: [
      'Apply the Pythagorean theorem: a² + b² = c²',
      'Substitute the values: 6² + 8² = c²',
      'Calculate squares: 36 + 64 = c²',
      'Sum: 100 = c²',
      'Take the square root: c = √100 = 10'
    ],
    result: 'Hypotenuse = 10 units'
  },
  'math-standard-deviation': {
    scenario: 'Finding the standard deviation of a data set',
    inputs: [['Data Set', '2, 4, 4, 4, 5, 5, 7, 9']],
    steps: [
      'Calculate the mean: (2+4+4+4+5+5+7+9)/8 = 40/8 = 5',
      'Find squared differences from mean: (2-5)²=9, (4-5)²=1, (4-5)²=1, (4-5)²=1, (5-5)²=0, (5-5)²=0, (7-5)²=4, (9-5)²=16',
      'Sum of squared differences: 9+1+1+1+0+0+4+16 = 32',
      'For sample SD: divide by n-1: 32/7 = 4.571',
      'Take square root: √4.571 = 2.14'
    ],
    result: 'Standard deviation = 2.14'
  },
  'math-quadratic': {
    scenario: 'Solving a quadratic equation',
    inputs: [['a', 1], ['b', -5], ['c', 6]],
    steps: [
      'The equation is x² - 5x + 6 = 0',
      'Apply the quadratic formula: x = [5 ± √(25 - 24)] / 2',
      'Calculate discriminant: 25 - 24 = 1',
      'x = [5 ± 1] / 2',
      'x₁ = (5 + 1)/2 = 3, x₂ = (5 - 1)/2 = 2'
    ],
    result: 'x = 3 and x = 2'
  },
  'math-gcf': {
    scenario: 'Finding the greatest common factor of two numbers',
    inputs: [['Number A', 48], ['Number B', 18]],
    steps: [
      'List factors of 48: 1, 2, 3, 4, 6, 8, 12, 16, 24, 48',
      'List factors of 18: 1, 2, 3, 6, 9, 18',
      'Find common factors: 1, 2, 3, 6',
      'The largest common factor is 6',
      'Using Euclidean algorithm: 48 mod 18 = 12, 18 mod 12 = 6, 12 mod 6 = 0 → GCF = 6'
    ],
    result: 'GCF(48, 18) = 6'
  },
  'math-area': {
    scenario: 'Finding the area of a circle',
    inputs: [['Radius', 5]],
    steps: [
      'Use the formula: A = πr²',
      'Substitute: A = π × 5²',
      'Calculate: A = π × 25',
      'A = 78.54 square units'
    ],
    result: '78.54 square units'
  },
  'math-volume': {
    scenario: 'Calculating the volume of a cylinder',
    inputs: [['Radius', 3], ['Height', 10]],
    steps: [
      'Use the formula: V = πr²h',
      'Substitute: V = π × 3² × 10',
      'V = π × 9 × 10 = π × 90',
      'V = 282.74 cubic units'
    ],
    result: '282.74 cubic units'
  },
  'conversion-celsius': {
    scenario: 'Converting Celsius to Fahrenheit for a weather forecast',
    inputs: [['Celsius', 25]],
    steps: [
      'Use the formula: °F = (°C × 9/5) + 32',
      'Substitute: °F = (25 × 9/5) + 32',
      '25 × 9/5 = 25 × 1.8 = 45',
      '45 + 32 = 77°F'
    ],
    result: '25°C = 77°F'
  },
  'conversion-fahrenheit': {
    scenario: 'Converting Fahrenheit to Celsius',
    inputs: [['Fahrenheit', 98.6]],
    steps: [
      'Use the formula: °C = (°F - 32) × 5/9',
      'Substitute: °C = (98.6 - 32) × 5/9',
      '98.6 - 32 = 66.6',
      '66.6 × 5/9 = 37°C'
    ],
    result: '98.6°F = 37°C (normal body temperature)'
  },
  'conversion-kg-to-lbs': {
    scenario: 'Converting kilograms to pounds for weight measurement',
    inputs: [['Kilograms', 70]],
    steps: [
      'Use the conversion factor: 1 kg = 2.20462 lbs',
      'Multiply: 70 × 2.20462 = 154.32',
      'So 70 kg is approximately 154.3 pounds'
    ],
    result: '70 kg = 154.32 lbs'
  },
  'conversion-miles-to-km': {
    scenario: 'Converting miles to kilometers for a road trip',
    inputs: [['Miles', 120]],
    steps: [
      'Use the conversion factor: 1 mile = 1.60934 km',
      'Multiply: 120 × 1.60934 = 193.12',
      'So 120 miles is approximately 193 kilometers'
    ],
    result: '120 miles = 193.12 km'
  },
  'date-time-age': {
    scenario: 'Calculating exact age in years, months, and days',
    inputs: [['Birth Date', 'March 15, 1990'], ['As of Date', 'June 28, 2026']],
    steps: [
      'Calculate years: 2026 - 1990 = 36 years',
      'But need to check if birthday has occurred: March 15 is before June 28, so full 36 years',
      'Calculate months: from March 15 to June 28 is 3 months and 13 days',
      'So the exact age is 36 years, 3 months, and 13 days'
    ],
    result: '36 years, 3 months, and 13 days old'
  },
  'date-time-date-duration': {
    scenario: 'Calculating the number of days between two dates',
    inputs: [['Start Date', 'January 1, 2026'], ['End Date', 'June 28, 2026']],
    steps: [
      'Count days in January: 31 days (Jan 1 to Jan 31)',
      'Add February: 28 days (February 2026 is not a leap year)',
      'Add March: 31 days, April: 30 days, May: 31 days',
      'Add June: 28 days (Jun 1 to Jun 28)',
      'Total: 31 + 28 + 31 + 30 + 31 + 28 = 179 days'
    ],
    result: '179 days between the two dates'
  },
  'date-time-time-duration': {
    scenario: 'Finding the duration between two times',
    inputs: [['Start Time', '9:15 AM'], ['End Time', '4:45 PM']],
    steps: [
      'Convert to 24-hour format: 9:15 and 16:45',
      'Hours difference: 16 - 9 = 7 hours',
      'Minutes difference: 45 - 15 = 30 minutes',
      'Total duration: 7 hours and 30 minutes'
    ],
    result: '7 hours and 30 minutes'
  },
  'statistics': {
    scenario: 'Finding the mean, median, and mode of a data set',
    inputs: [['Data Set', '12, 15, 18, 20, 22, 22, 25, 30, 35, 40']],
    steps: [
      'Mean: sum all values = 239, divide by 10 = 23.9',
      'Median: average of 5th and 6th values (22 and 22) = 22',
      'Mode: the most frequent value = 22 (appears twice)',
      'Range: 40 - 12 = 28'
    ],
    result: 'Mean = 23.9, Median = 22, Mode = 22, Range = 28'
  },
  'construction-concrete': {
    scenario: 'Estimating concrete needed for a patio',
    inputs: [['Length (ft)', 20], ['Width (ft)', 12], ['Depth (in)', 4]],
    steps: [
      'Convert depth to feet: 4 inches / 12 = 0.333 feet',
      'Calculate cubic feet: 20 × 12 × 0.333 = 80 cubic feet',
      'Convert to cubic yards: 80 / 27 = 2.96 cubic yards',
      'Add 10% waste factor: 2.96 × 1.10 = 3.26 cubic yards',
      'Order 3.5 cubic yards to be safe'
    ],
    result: 'Approximately 3.3 cubic yards (order 3.5)'
  },
  'everyday-tip': {
    scenario: 'Splitting a restaurant bill',
    inputs: [['Bill Amount', 85.50], ['Tip Percentage', 18], ['Number of People', 4]],
    steps: [
      'Calculate tip: $85.50 × 0.18 = $15.39',
      'Total bill with tip: $85.50 + $15.39 = $100.89',
      'Split evenly: $100.89 / 4 = $25.22 per person'
    ],
    result: '$25.22 per person (including 18% tip)'
  },
  'everyday-gpa': {
    scenario: 'Calculating semester GPA',
    inputs: [['Course 1 Grade', 'A (4.0)'], ['Course 1 Credits', 3], ['Course 2 Grade', 'B (3.0)'], ['Course 2 Credits', 4], ['Course 3 Grade', 'A- (3.7)'], ['Course 3 Credits', 3]],
    steps: [
      'Multiply each grade by credits: 4.0 × 3 = 12, 3.0 × 4 = 12, 3.7 × 3 = 11.1',
      'Sum of grade points: 12 + 12 + 11.1 = 35.1',
      'Total credits: 3 + 4 + 3 = 10',
      'GPA = 35.1 / 10 = 3.51'
    ],
    result: 'Semester GPA = 3.51'
  },
  'everyday-grade': {
    scenario: 'Calculating final grade with weighted categories',
    inputs: [['Assignments (40%)', 88], ['Exams (50%)', 92], ['Participation (10%)', 85]],
    steps: [
      'Multiply each grade by its weight: 88 × 0.40 = 35.2',
      '92 × 0.50 = 46.0',
      '85 × 0.10 = 8.5',
      'Sum: 35.2 + 46.0 + 8.5 = 89.7%'
    ],
    result: 'Final grade of 89.7% (B+)'
  },
  'education-gpa': {
    scenario: 'Calculating cumulative GPA across semesters',
    inputs: [['Previous GPA', 3.2], ['Previous Credits', 45], ['Current Semester GPA', 3.6], ['Current Credits', 15]],
    steps: [
      'Total grade points so far: 3.2 × 45 = 144',
      'New grade points: 3.6 × 15 = 54',
      'Total grade points: 144 + 54 = 198',
      'Total credits: 45 + 15 = 60',
      'Cumulative GPA: 198 / 60 = 3.30'
    ],
    result: 'Cumulative GPA = 3.30'
  },
  'engineering-ohms-law': {
    scenario: 'Finding the current in a simple circuit',
    inputs: [['Voltage', 12], ['Resistance', 24]],
    steps: [
      "Use Ohm's Law: I = V / R",
      'Substitute: I = 12 / 24',
      'Current = 0.5 amperes (500 mA)'
    ],
    result: '0.5 amperes (500 mA)'
  },
  'engineering-voltage-drop': {
    scenario: 'Calculating voltage drop in a copper wire run',
    inputs: [['Current (Amps)', 20], ['Length (ft)', 100], ['Wire Gauge', '10 AWG']],
    steps: [
      'Resistance of 10 AWG copper is approximately 1.24 ohms per 1000 ft',
      'For 100 ft (round trip 200 ft): R = 1.24 × 200/1000 = 0.248 ohms',
      'Voltage drop: V_drop = 2 × 20 × 0.248 = 4.96 volts',
      'Percentage drop: 4.96 / 120 × 100 = 4.13%'
    ],
    result: '4.96V drop (4.13% of 120V) - exceeds recommended 3%'
  },
  'chemistry': {
    scenario: 'Calculating the molar mass of a compound',
    inputs: [['Compound', 'H₂SO₄ (Sulfuric Acid)']],
    steps: [
      'Hydrogen: 2 atoms × 1.008 g/mol = 2.016 g/mol',
      'Sulfur: 1 atom × 32.065 g/mol = 32.065 g/mol',
      'Oxygen: 4 atoms × 15.999 g/mol = 63.996 g/mol',
      'Total molar mass: 2.016 + 32.065 + 63.996 = 98.077 g/mol'
    ],
    result: '98.077 g/mol'
  },
  'physics': {
    scenario: 'Calculating kinetic energy of a moving object',
    inputs: [['Mass (kg)', 10], ['Velocity (m/s)', 5]],
    steps: [
      'Use the formula: KE = ½mv²',
      'Substitute: KE = 0.5 × 10 × 5²',
      'KE = 0.5 × 10 × 25',
      'KE = 125 joules'
    ],
    result: '125 joules of kinetic energy'
  },
  'food': {
    scenario: 'Scaling a recipe for more servings',
    inputs: [['Original Servings', 4], ['Desired Servings', 6], ['Original Flour (cups)', 2]],
    steps: [
      'Calculate the scaling factor: 6 / 4 = 1.5',
      'Multiply each ingredient by 1.5',
      'Flour: 2 × 1.5 = 3 cups',
      'Apply to all ingredients for consistent scaling'
    ],
    result: '3 cups of flour (multiply all ingredients by 1.5)'
  },
  'sports-pace': {
    scenario: 'Calculating running pace for a 10K race',
    inputs: [['Distance (km)', 10], ['Time (min)', 55]],
    steps: [
      'Pace = total minutes / distance in km',
      'Pace = 55 / 10 = 5:30 per kilometer',
      'For miles: 10 km = 6.21 miles, 55 / 6.21 = 8:51 per mile'
    ],
    result: '5:30 min/km (8:51 min/mile)'
  },
  'default': {
    scenario: 'Using this calculator with sample inputs',
    inputs: [['Input Value', 100]],
    steps: [
      'Enter your values into the calculator\'s input fields',
      'The calculator processes the inputs using its built-in formula',
      'Results update automatically showing the computed value',
      'Adjust inputs to explore different scenarios and outcomes'
    ],
    result: 'Result based on your inputs'
  }
};

const EXAMPLE_MATCHERS = [
  { id: 'financial-mortgage', cat: 'financial', test: s => s.includes('mortgage') || s.includes('loan') || s.includes('mortgage-payoff') },
  { id: 'financial-compound-interest', cat: 'financial', test: s => s.includes('compound-interest') },
  { id: 'financial-retirement', cat: 'financial', test: s => s.includes('retirement') },
  { id: 'financial-salary', cat: 'financial', test: s => s.includes('salary') || s.includes('hourly-wage') },
  { id: 'financial-debt-payoff', cat: 'financial', test: s => s.includes('debt-payoff') },
  { id: 'financial-budget', cat: 'financial', test: s => s.includes('budget') },
  { id: 'financial-income-tax', cat: 'financial', test: s => s.includes('income-tax') },
  { id: 'financial-roi', cat: 'financial', test: s => s.includes('roi') || s.includes('return-on-investment') },
  { id: 'financial-net-worth', cat: 'financial', test: s => s.includes('net-worth') },
  { id: 'financial-tip', cat: 'financial', test: s => s.includes('tip') },
  { id: 'financial-discount', cat: 'financial', test: s => s.includes('discount') || s.includes('percent-off') },
  { id: 'financial-refinance', cat: 'financial', test: s => s.includes('refinance') },
  { id: 'financial-rent-vs-buy', cat: 'financial', test: s => s.includes('rent-vs-buy') },
  { id: 'health-bmi', cat: 'health', test: s => s.includes('bmi') },
  { id: 'health-bmr', cat: 'health', test: s => s.includes('bmr') || s.includes('calorie') },
  { id: 'health-body-fat', cat: 'health', test: s => s.includes('body-fat') },
  { id: 'health-heart-rate', cat: 'health', test: s => s.includes('heart-rate') || s.includes('target-heart') },
  { id: 'health-pregnancy', cat: 'health', test: s => s.includes('due-date') || s.includes('pregnancy') },
  { id: 'health-water-intake', cat: 'health', test: s => s.includes('water-intake') },
  { id: 'health-protein', cat: 'health', test: s => s.includes('protein') || s.includes('macro') },
  { id: 'math-percentage', cat: 'math', test: s => s.includes('percentage') },
  { id: 'math-fraction', cat: 'math', test: s => s.includes('fraction') },
  { id: 'math-pythagorean', cat: 'math', test: s => s.includes('pythagorean') },
  { id: 'math-standard-deviation', cat: 'math', test: s => s.includes('standard-deviation') },
  { id: 'math-quadratic', cat: 'math', test: s => s.includes('quadratic') },
  { id: 'math-gcf', cat: 'math', test: s => s.includes('gcf') || s.includes('gcd') },
  { id: 'math-area', cat: 'math', test: s => s.includes('area') || s.includes('circle') },
  { id: 'math-volume', cat: 'math', test: s => s.includes('volume') },
  { id: 'conversion-celsius', cat: 'conversion', test: s => s.includes('celsius') },
  { id: 'conversion-fahrenheit', cat: 'conversion', test: s => s.includes('fahrenheit') },
  { id: 'conversion-kg-to-lbs', cat: 'conversion', test: s => s.includes('kg-to-lbs') || s.includes('kgs-to-lbs') },
  { id: 'conversion-miles-to-km', cat: 'conversion', test: s => s.includes('miles-to-km') },
  { id: 'date-time-age', cat: 'date-time', test: s => s.includes('age') },
  { id: 'date-time-date-duration', cat: 'date-time', test: s => s.includes('date-duration') || s.includes('days-between') || s.includes('date-calculator') },
  { id: 'date-time-time-duration', cat: 'date-time', test: s => s.includes('time-duration') || s.includes('time-calculator') },
  { id: 'statistics', cat: 'statistics', test: () => true },
  { id: 'construction-concrete', cat: 'construction', test: s => s.includes('concrete') },
  { id: 'everyday-tip', cat: 'everyday', test: s => s.includes('tip') },
  { id: 'everyday-gpa', cat: 'everyday', test: s => s.includes('gpa') },
  { id: 'everyday-grade', cat: 'everyday', test: s => s.includes('grade') },
  { id: 'education-gpa', cat: 'education', test: s => s.includes('gpa') },
  { id: 'engineering-ohms-law', cat: 'engineering', test: s => s.includes('ohms-law') || s.includes('ohm') },
  { id: 'engineering-voltage-drop', cat: 'engineering', test: s => s.includes('voltage-drop') },
  { id: 'chemistry', cat: 'chemistry', test: () => true },
  { id: 'physics', cat: 'physics', test: () => true },
  { id: 'food', cat: 'food', test: () => true },
  { id: 'sports-pace', cat: 'sports', test: s => s.includes('pace') },
  { id: 'default', test: () => true }
];

const CATEGORY_FORMULAS = {
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
  sports: 'Sports science formula validated by athletic research'
};

// ---------- Build replacement source ----------
function buildNewFunction() {
  const dataJson = JSON.stringify(EXAMPLE_DATA);
  const catJson = JSON.stringify(CATEGORY_FORMULAS);
  const MATCHERS_SRC = `[
  { id: 'financial-mortgage', cat: 'financial', test: (s: string) => s.includes('mortgage') || s.includes('loan') || s.includes('mortgage-payoff') },
  { id: 'financial-compound-interest', cat: 'financial', test: (s: string) => s.includes('compound-interest') },
  { id: 'financial-retirement', cat: 'financial', test: (s: string) => s.includes('retirement') },
  { id: 'financial-salary', cat: 'financial', test: (s: string) => s.includes('salary') || s.includes('hourly-wage') },
  { id: 'financial-debt-payoff', cat: 'financial', test: (s: string) => s.includes('debt-payoff') },
  { id: 'financial-budget', cat: 'financial', test: (s: string) => s.includes('budget') },
  { id: 'financial-income-tax', cat: 'financial', test: (s: string) => s.includes('income-tax') },
  { id: 'financial-roi', cat: 'financial', test: (s: string) => s.includes('roi') || s.includes('return-on-investment') },
  { id: 'financial-net-worth', cat: 'financial', test: (s: string) => s.includes('net-worth') },
  { id: 'financial-tip', cat: 'financial', test: (s: string) => s.includes('tip') },
  { id: 'financial-discount', cat: 'financial', test: (s: string) => s.includes('discount') || s.includes('percent-off') },
  { id: 'financial-refinance', cat: 'financial', test: (s: string) => s.includes('refinance') },
  { id: 'financial-rent-vs-buy', cat: 'financial', test: (s: string) => s.includes('rent-vs-buy') },
  { id: 'health-bmi', cat: 'health', test: (s: string) => s.includes('bmi') },
  { id: 'health-bmr', cat: 'health', test: (s: string) => s.includes('bmr') || s.includes('calorie') },
  { id: 'health-body-fat', cat: 'health', test: (s: string) => s.includes('body-fat') },
  { id: 'health-heart-rate', cat: 'health', test: (s: string) => s.includes('heart-rate') || s.includes('target-heart') },
  { id: 'health-pregnancy', cat: 'health', test: (s: string) => s.includes('due-date') || s.includes('pregnancy') },
  { id: 'health-water-intake', cat: 'health', test: (s: string) => s.includes('water-intake') },
  { id: 'health-protein', cat: 'health', test: (s: string) => s.includes('protein') || s.includes('macro') },
  { id: 'math-percentage', cat: 'math', test: (s: string) => s.includes('percentage') },
  { id: 'math-fraction', cat: 'math', test: (s: string) => s.includes('fraction') },
  { id: 'math-pythagorean', cat: 'math', test: (s: string) => s.includes('pythagorean') },
  { id: 'math-standard-deviation', cat: 'math', test: (s: string) => s.includes('standard-deviation') },
  { id: 'math-quadratic', cat: 'math', test: (s: string) => s.includes('quadratic') },
  { id: 'math-gcf', cat: 'math', test: (s: string) => s.includes('gcf') || s.includes('gcd') },
  { id: 'math-area', cat: 'math', test: (s: string) => s.includes('area') || s.includes('circle') },
  { id: 'math-volume', cat: 'math', test: (s: string) => s.includes('volume') },
  { id: 'conversion-celsius', cat: 'conversion', test: (s: string) => s.includes('celsius') },
  { id: 'conversion-fahrenheit', cat: 'conversion', test: (s: string) => s.includes('fahrenheit') },
  { id: 'conversion-kg-to-lbs', cat: 'conversion', test: (s: string) => s.includes('kg-to-lbs') || s.includes('kgs-to-lbs') },
  { id: 'conversion-miles-to-km', cat: 'conversion', test: (s: string) => s.includes('miles-to-km') },
  { id: 'date-time-age', cat: 'date-time', test: (s: string) => s.includes('age') },
  { id: 'date-time-date-duration', cat: 'date-time', test: (s: string) => s.includes('date-duration') || s.includes('days-between') || s.includes('date-calculator') },
  { id: 'date-time-time-duration', cat: 'date-time', test: (s: string) => s.includes('time-duration') || s.includes('time-calculator') },
  { id: 'statistics', cat: 'statistics', test: () => true },
  { id: 'construction-concrete', cat: 'construction', test: (s: string) => s.includes('concrete') },
  { id: 'everyday-tip', cat: 'everyday', test: (s: string) => s.includes('tip') },
  { id: 'everyday-gpa', cat: 'everyday', test: (s: string) => s.includes('gpa') },
  { id: 'everyday-grade', cat: 'everyday', test: (s: string) => s.includes('grade') },
  { id: 'education-gpa', cat: 'education', test: (s: string) => s.includes('gpa') },
  { id: 'engineering-ohms-law', cat: 'engineering', test: (s: string) => s.includes('ohms-law') || s.includes('ohm') },
  { id: 'engineering-voltage-drop', cat: 'engineering', test: (s: string) => s.includes('voltage-drop') },
  { id: 'chemistry', cat: 'chemistry', test: () => true },
  { id: 'physics', cat: 'physics', test: () => true },
  { id: 'food', cat: 'food', test: () => true },
  { id: 'sports-pace', cat: 'sports', test: (s: string) => s.includes('pace') },
  { id: 'default', test: () => true }
]`;
  return `function exampleSlugKey(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const EXAMPLE_DATA: Record<string, { scenario: string; inputs: [string, number | string][]; steps: string[]; result: string }> = ${dataJson}

const EXAMPLE_MATCHERS: { id: string; cat?: string; test: (s: string) => boolean }[] = ${MATCHERS_SRC}

const CATEGORY_FORMULAS: Record<string, string> = ${catJson}

function getExampleValue(calc: CalculatorEntry, t?: TranslateFn): { scenario: string; inputs: Record<string, number | string>; steps: string[]; result: string } {
  const id = EXAMPLE_MATCHERS.find(m => (!m.cat || m.cat === calc.category) && m.test(calc.slug))?.id || 'default'
  const data = EXAMPLE_DATA[id] || EXAMPLE_DATA['default']
  const loc = (key: string, fb: string) => (t ? t(key) : fb)
  const base = \`guide.example.\${id}\`
  const inputs: Record<string, number | string> = {}
  for (const [label, value] of data.inputs) {
    const key = \`\${base}.input.\${exampleSlugKey(label)}\`
    inputs[loc(key, label)] = value
  }
  return {
    scenario: loc(\`\${base}.scenario\`, data.scenario),
    inputs,
    steps: data.steps.map((s, i) => loc(\`\${base}.step.\${i}\`, s)),
    result: loc(\`\${base}.result\`, data.result),
  }
}

function getCalcFormula(calc: CalculatorEntry, t?: TranslateFn): string {
  if (calc.formulaSource) return calc.formulaSource
  if (formulaSource[calc.slug]) return formulaSource[calc.slug]

  if (calc.category === 'conversion') {
    if (calc.slug.includes('to-') || calc.slug.includes('-to-')) {
      return t ? t('guide.example.categoryFormula.conversion-to') : 'Result = input_value × conversion_factor'
    }
    return t ? t('guide.example.categoryFormula.conversion') : 'Standard unit conversion using internationally recognized conversion factors'
  }

  const cat = calc.category
  return t ? t(\`guide.example.categoryFormula.\${cat}\`) : (CATEGORY_FORMULAS[cat as keyof typeof CATEGORY_FORMULAS] || 'Standard computational formula')
}
`;
}

// Remove the original getCalcFormula (now redefined in the replacement block)
function removeOriginalGetCalcFormula(src) {
  const start = src.indexOf('function getCalcFormula(calc: CalculatorEntry): string {');
  if (start < 0) return src;
  const endMarker = '\nfunction detailTitle(';
  const end = src.indexOf(endMarker);
  if (end < 0) return src;
  return src.slice(0, start) + src.slice(end);
}

// ---------- Read & transform TS file ----------
let ts = fs.readFileSync(tsPath, 'utf8');

// Replace getExampleValue function (from its declaration up to before generateWhatIs)
const startIdx = ts.indexOf('function exampleSlugKey(');
const endIdx = ts.indexOf('\nfunction generateWhatIs(');
if (startIdx < 0 || endIdx < 0) { console.error('Markers not found'); process.exit(1); }
const before = ts.slice(0, startIdx);
const after = ts.slice(endIdx);
ts = before + buildNewFunction() + after;
ts = removeOriginalGetCalcFormula(ts);

// Update generateExampleSection call: getExampleValue(calc) -> getExampleValue(calc, t)
ts = ts.replace('const { scenario, inputs, steps, result } = getExampleValue(calc)', 'const { scenario, inputs, steps, result } = getExampleValue(calc, t)');

// Update getCalcFormula call at line ~1023: getCalcFormula(calc) -> getCalcFormula(calc, t)
ts = ts.replace('const formula = getCalcFormula(calc)', 'const formula = getCalcFormula(calc, t)');

fs.writeFileSync(tsPath, ts);
console.log('guide-content.ts updated.');

// ---------- Generate en.json guide.example subtree ----------
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const example = {};
for (const [id, data] of Object.entries(EXAMPLE_DATA)) {
  const node = { scenario: data.scenario, result: data.result, step: {}, input: {} };
  data.steps.forEach((s, i) => { node.step[String(i)] = s; });
  for (const [label] of data.inputs) {
    node.input[slugKey(label)] = label;
  }
  example[id] = node;
}
const catForm = {};
for (const [cat, text] of Object.entries(CATEGORY_FORMULAS)) catForm[cat] = text;
catForm['conversion'] = 'Standard unit conversion using internationally recognized conversion factors';
catForm['conversion-to'] = 'Result = input_value × conversion_factor';
example.categoryFormula = catForm;

en.guide = en.guide || {};
en.guide.example = example;
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log('en.json guide.example written with', Object.keys(example).length, 'example ids.');
