export interface FAQ {
  question: string
  answer: string
}

export function getFAQs(slug: string): FAQ[] {
  const faqs: Record<string, FAQ[]> = {
    'mortgage-calculator': [
      { question: 'What is a mortgage calculator?', answer: 'A mortgage calculator estimates your monthly housing payment based on loan amount, interest rate, and term. It helps you understand affordability before applying for a loan.' },
      { question: 'How is the monthly mortgage payment calculated?', answer: 'The standard formula is M = P[r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate, and n is the number of months.' },
      { question: 'How much house can I afford?', answer: 'Most lenders recommend spending no more than 28% of your gross monthly income on housing expenses. Use our affordability calculator with your income, debt, and down payment.' },
      { question: 'What is PMI and when do I need it?', answer: 'Private Mortgage Insurance (PMI) is required when your down payment is less than 20%. It protects the lender and typically costs 0.3% to 1.5% of the loan amount annually.' },
      { question: 'Should I choose a 15-year or 30-year mortgage?', answer: 'A 15-year mortgage has higher monthly payments but lower total interest. A 30-year mortgage has lower monthly payments but you pay more interest over time. Choose based on your cash flow and long-term goals.' },
    ],
    'loan-calculator': [
      { question: 'What does a loan calculator tell you?', answer: 'It calculates your monthly payment, total interest paid, and total cost of a loan based on principal, interest rate, and repayment term.' },
      { question: 'How is the interest on a loan calculated?', answer: 'Most loans use amortizing interest: each payment covers the interest due plus a portion of the principal. Early payments go mostly toward interest; later payments go mostly toward principal.' },
      { question: 'What is the difference between secured and unsecured loans?', answer: 'Secured loans are backed by collateral (like a car or house) and typically have lower rates. Unsecured loans (like credit cards or personal loans) have higher rates because there is no collateral.' },
      { question: 'How does my credit score affect my loan rate?', answer: 'Higher credit scores qualify for lower interest rates. A 760+ score might get rates 2-5% lower than a 620 score, potentially saving thousands over the loan term.' },
    ],
    'bmi-calculator': [
      { question: 'Is BMI an accurate measure of health?', answer: 'BMI is a useful screening tool but does not account for muscle mass, bone density, or fat distribution. Athletes may have a high BMI without excess body fat.' },
      { question: 'What BMI ranges are considered healthy?', answer: 'A BMI between 18.5 and 24.9 is generally considered healthy for most adults. Below 18.5 is underweight, 25-29.9 is overweight, and 30 or above is obese.' },
      { question: 'What is the difference between BMI and body fat percentage?', answer: 'BMI uses only height and weight, while body fat percentage directly measures how much of your weight is fat. Two people with the same BMI can have very different body fat percentages.' },
      { question: 'Can BMI be misleading for certain groups?', answer: 'Yes, BMI can overestimate body fat in athletes and underestimate it in older adults who have lost muscle mass. It may also be less accurate for different ethnicities.' },
      { question: 'How can I lower my BMI?', answer: 'Lowering BMI requires reducing body weight through a combination of balanced nutrition, regular physical activity, adequate sleep, and stress management. Aim for gradual, sustainable changes.' },
    ],
    'calorie-calculator': [
      { question: 'How many calories should I eat per day?', answer: 'This depends on your age, sex, weight, height, and activity level. A calorie calculator uses the Mifflin-St Jeor equation to estimate your Total Daily Energy Expenditure (TDEE).' },
      { question: 'What is the difference between BMR and TDEE?', answer: 'BMR (Basal Metabolic Rate) is the calories your body needs at rest. TDEE (Total Daily Energy Expenditure) includes BMR plus calories burned through activity, exercise, and digestion.' },
      { question: 'How many calories do I need to lose weight?', answer: 'To lose about 1 pound per week, create a deficit of 500 calories per day below your TDEE. For 2 pounds per week, aim for a 1,000-calorie daily deficit, but never go below 1,200 calories for women or 1,500 for men without medical supervision.' },
      { question: 'What is the best macronutrient split for weight loss?', answer: 'A common approach is 40% carbohydrates, 30% protein, and 30% fat. Higher protein (35-40%) can help preserve muscle during weight loss and improve satiety.' },
    ],
    'compound-interest-calculator': [
      { question: 'How does compound interest differ from simple interest?', answer: 'Simple interest is calculated only on the principal, while compound interest is calculated on the principal plus previously earned interest, leading to exponential growth.' },
      { question: 'What is the Rule of 72?', answer: 'The Rule of 72 estimates how long an investment takes to double: divide 72 by the annual interest rate. At 8%, your money doubles in about 9 years (72/8 = 9).' },
      { question: 'How does compounding frequency affect returns?', answer: 'More frequent compounding (daily vs monthly vs annually) leads to slightly higher returns. The difference grows with higher rates and longer time horizons.' },
      { question: 'What is the best way to maximize compound interest?', answer: 'Start early, contribute regularly, reinvest all earnings, and choose investments with the highest sustainable return. Time is the most important factor in compounding.' },
    ],
    'percentage-calculator': [
      { question: 'How do you calculate a percentage of a number?', answer: 'Multiply the number by the percentage and divide by 100. For example, 20% of 150 = (150 × 20) / 100 = 30.' },
      { question: 'How do you calculate percentage change?', answer: 'Percentage change = (new value - old value) / old value × 100. A positive result means an increase; negative means a decrease.' },
      { question: 'How do you convert a fraction to a percentage?', answer: 'Divide the numerator by the denominator and multiply by 100. For example, 3/4 = 0.75 × 100 = 75%.' },
    ],
    'tip-calculator': [
      { question: 'What is a standard tip percentage?', answer: 'In the United States, 15-20% of the pre-tax bill is standard for restaurant service. For counter service, 10-15% is common.' },
      { question: 'Should I tip on the pre-tax or post-tax amount?', answer: 'Tips are traditionally calculated on the pre-tax amount. Tipping on the post-tax amount results in a slightly higher tip that some consider more generous.' },
      { question: 'What is the etiquette for tipping in other countries?', answer: 'Tipping customs vary widely. In Japan and South Korea, tipping can be considered rude. In many European countries, 5-10% is standard. Research local customs before traveling.' },
    ],
    'gpa-calculator': [
      { question: 'How is GPA calculated?', answer: 'GPA = Σ(grade points × credits) / Σ(credits). Each letter grade is converted to grade points (e.g., A = 4.0, B = 3.0), multiplied by the course credits, summed, and divided by total credits.' },
      { question: 'What is a weighted GPA?', answer: 'Weighted GPA gives extra points for advanced courses like AP, IB, or honors classes. An A in an AP course might be worth 5.0 instead of 4.0, reflecting the increased difficulty.' },
      { question: 'What GPA do I need for college admissions?', answer: 'Requirements vary by institution. Competitive colleges often look for 3.5+ unweighted GPA. Ivy League schools typically admit students with 3.8+ GPAs and rigorous course loads.' },
    ],
    'pythagorean-calculator': [
      { question: 'What is the Pythagorean theorem?', answer: 'In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: c² = a² + b².' },
      { question: 'How is the Pythagorean theorem used in real life?', answer: 'It is used in construction (checking square corners), navigation (calculating distances), computer graphics (calculating distances between points), and many engineering applications.' },
      { question: 'Can the Pythagorean theorem be used for non-right triangles?', answer: 'No, the Pythagorean theorem only applies to right triangles. For other triangles, use the Law of Cosines: c² = a² + b² - 2ab·cos(C).' },
    ],
    'savings-calculator': [
      { question: 'How much should I save each month?', answer: 'A common recommendation is to save at least 20% of your income. Use the savings calculator to project how your balance grows over time with regular contributions and interest.' },
      { question: 'What is the 50/30/20 budget rule?', answer: 'The 50/30/20 rule allocates 50% of income to needs, 30% to wants, and 20% to savings and debt repayment. It is a simple framework for managing personal finances.' },
      { question: 'How much emergency fund should I have?', answer: 'Most financial experts recommend 3-6 months of living expenses in an easily accessible savings account. This protects against job loss, medical emergencies, or unexpected repairs.' },
    ],
    'retirement-calculator': [
      { question: 'How much do I need to save for retirement?', answer: 'A common rule of thumb is to save 10-15% of your income annually. By age 67, aim to have 8-10 times your final salary saved. Use our calculator for a personalized estimate.' },
      { question: 'What is the difference between a 401(k) and an IRA?', answer: 'A 401(k) is employer-sponsored with higher contribution limits ($23,000 in 2024) and often includes employer matching. An IRA is individual with lower limits ($7,000 in 2024) but more investment choices.' },
      { question: 'When can I withdraw from retirement accounts without penalty?', answer: 'You can withdraw from 401(k)s and Traditional IRAs penalty-free starting at age 59½. Roth IRA contributions can be withdrawn anytime tax-free; earnings have age restrictions.' },
      { question: 'What is the 4% rule for retirement withdrawals?', answer: 'The 4% rule suggests withdrawing 4% of your retirement savings in your first year of retirement, adjusting for inflation annually. This is designed to make your savings last 30 years.' },
    ],
    'amortization-calculator': [
      { question: 'What is an amortization schedule?', answer: 'An amortization schedule shows each monthly payment broken down into principal and interest portions over the life of a loan. Early payments are mostly interest; later payments are mostly principal.' },
      { question: 'How does making extra payments affect my loan?', answer: 'Extra payments reduce the principal faster, which decreases total interest paid and shortens the loan term. Even one extra payment per year can save thousands in interest.' },
      { question: 'What is the difference between amortizing and interest-only loans?', answer: 'Amortizing loans gradually pay down principal with each payment. Interest-only loans require only interest payments for a set period, after which payments increase significantly.' },
    ],
    'investment-calculator': [
      { question: 'How do I calculate investment returns?', answer: 'Investment returns are calculated using compound growth: Future Value = Present Value × (1 + rate)^time. Our calculator handles regular contributions and variable rates.' },
      { question: 'What is the difference between simple and compound returns?', answer: 'Simple returns only earn interest on the principal. Compound returns earn interest on both the principal and accumulated interest, leading to exponential growth over time.' },
      { question: 'How does inflation affect investment returns?', answer: 'Inflation reduces purchasing power. If your investment earns 7% but inflation is 3%, your real return is only 4%. Always consider inflation-adjusted returns for long-term planning.' },
      { question: 'What is dollar-cost averaging?', answer: 'Dollar-cost averaging means investing a fixed amount at regular intervals regardless of market conditions. This reduces the impact of market volatility and eliminates the risk of poor timing.' },
    ],
    'currency-calculator': [
      { question: 'How are currency exchange rates determined?', answer: 'Exchange rates fluctuate based on supply and demand, interest rates, inflation, political stability, and economic performance. Our calculator uses real-time rates from reliable financial data sources.' },
      { question: 'Why do exchange rates differ between banks and online converters?', answer: 'Banks and currency exchange services add a markup (spread) to the mid-market rate. Our calculator shows the mid-market rate, which is the rate used between banks.' },
      { question: 'When is the best time to exchange currency?', answer: 'Exchange rates fluctuate 24/7. Monitor rates over time and consider exchanging when the rate is favorable for your needs. Avoid exchanging at airports, which typically have the worst rates.' },
    ],
    'salary-calculator': [
      { question: 'What is the difference between gross and net pay?', answer: 'Gross pay is your total earnings before deductions. Net pay (take-home pay) is what you receive after taxes, Social Security, Medicare, and other deductions are subtracted.' },
      { question: 'How are taxes calculated on my salary?', answer: 'Federal income tax uses progressive brackets — higher portions of income are taxed at higher rates. FICA taxes (Social Security + Medicare) are fixed percentages. State and local taxes vary by location.' },
      { question: 'What deductions can reduce my taxable income?', answer: 'Common pre-tax deductions include 401(k) contributions, health insurance premiums, Health Savings Account (HSA) contributions, and Flexible Spending Account (FSA) contributions.' },
    ],
    'income-tax-calculator': [
      { question: 'How do US federal income tax brackets work?', answer: 'The US uses progressive tax brackets. Your income is divided into portions, each taxed at a different rate. Only the income above each threshold is taxed at the higher rate, not your entire income.' },
      { question: 'What is the difference between standard and itemized deductions?', answer: 'The standard deduction is a fixed amount ($14,600 for single filers in 2024) you can deduct from your income. Itemizing allows you to deduct specific expenses if they exceed the standard amount.' },
      { question: 'How do capital gains taxes work?', answer: 'Short-term capital gains (assets held less than 1 year) are taxed at ordinary income rates. Long-term gains (held over 1 year) have lower rates: 0%, 15%, or 20% depending on your income.' },
    ],
    'auto-loan-calculator': [
      { question: 'How is my monthly car payment calculated?', answer: 'Your monthly payment depends on the loan amount, interest rate, and term length. Use our calculator to see how different down payments, trade-in values, and loan terms affect your payment.' },
      { question: 'What credit score do I need for the best auto loan rates?', answer: 'Top auto loan rates typically require a credit score of 720 or higher. Buyers with scores below 660 may face significantly higher rates. Check your credit before applying.' },
      { question: 'Should I finance through a dealership or a bank?', answer: 'Compare offers from both. Dealerships may offer promotional rates on new cars, while credit unions and banks often provide better rates on used cars. Always get pre-approved before visiting a dealer.' },
    ],
  }

  return faqs[slug] ?? []
}
