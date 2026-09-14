import type { LongFormSection } from '../calculator-content-engine'

const articles: Record<string, LongFormSection[]> = {
  'mortgage-calculator': [
    {
      title: 'Understanding Mortgage Types',
      content: 'Mortgages come in several varieties, each with distinct terms that affect your monthly payment and total cost over the life of the loan.',
      subsections: [
        { heading: 'Fixed-Rate Mortgage', text: 'The interest rate stays the same for the entire loan term, typically 15 or 30 years. This provides predictable monthly payments regardless of market conditions.' },
        { heading: 'Adjustable-Rate Mortgage (ARM)', text: 'The rate is fixed for an initial period (commonly 5, 7, or 10 years), then adjusts periodically based on a market index. ARMs often start with lower rates than fixed mortgages.' },
        { heading: 'Interest-Only Mortgage', text: 'You pay only interest for a set period, after which payments increase to cover both principal and interest. This can be useful for buyers who expect higher income in the future.' },
      ],
    },
    {
      title: 'How Down Payments Affect Your Loan',
      content: 'A larger down payment reduces the amount you need to borrow, lowers your monthly payment, and may eliminate the need for private mortgage insurance (PMI).',
      subsections: [
        { heading: 'The 20% Rule', text: 'Putting down 20% of the home price is the traditional benchmark to avoid PMI, which typically adds 0.5% to 1.5% of the loan amount annually to your payment.' },
        { heading: 'Low Down Payment Options', text: 'FHA loans require as little as 3.5% down, conventional loans can go as low as 3%, and VA/USDA loans may require zero down payment for eligible buyers.' },
      ],
    },
    {
      title: 'The Impact of Interest Rates',
      content: 'Even small changes in interest rates can significantly affect your monthly payment and the total amount you pay over the life of the loan.',
      subsections: [
        { heading: 'Rate Shopping', text: 'A 0.5% rate difference on a $300,000 loan over 30 years can save or cost you over $30,000 in total interest. Always compare offers from multiple lenders.' },
        { heading: 'Points and Buydowns', text: 'You can pay upfront "points" (1 point = 1% of the loan) to lower your interest rate. This break-even point typically takes 4-7 years to recoup.' },
      ],
    },
  ],
  'compound-interest-calculator': [
    {
      title: 'The Power of Compound Interest',
      content: 'Compound interest earns interest on both the initial principal and the accumulated interest from previous periods, creating exponential growth over time.',
      subsections: [
        { heading: 'Compounding Frequency', text: 'Interest can compound annually, semi-annually, quarterly, monthly, or daily. More frequent compounding results in slightly higher returns because interest is calculated and added more often.' },
        { heading: 'Rule of 72', text: 'A quick way to estimate doubling time: divide 72 by the annual interest rate. At 6% interest, your money doubles roughly every 12 years (72 ÷ 6 = 12).' },
      ],
    },
    {
      title: 'Starting Early Matters Most',
      content: 'The earlier you begin investing, the more time compound interest has to work. Even small, regular contributions can grow into substantial sums over decades.',
      subsections: [
        { heading: 'Time vs. Amount', text: 'An investor who starts at age 25 and invests $200/month at 7% will have roughly $525,000 by age 65. Someone who starts at 35 with the same amount will have about $244,000 — less than half.' },
      ],
    },
  ],
  'bmi-calculator': [
    {
      title: 'Understanding Body Mass Index',
      content: 'BMI is a simple ratio of weight to height that provides a quick screening tool for weight categories. While useful at the population level, it has important limitations for individuals.',
      subsections: [
        { heading: 'BMI Categories', text: 'Underweight: below 18.5. Normal weight: 18.5 to 24.9. Overweight: 25 to 29.9. Obese: 30 and above. These ranges apply to adults aged 20 and older.' },
        { heading: 'Limitations of BMI', text: 'BMI does not distinguish between muscle and fat. Athletes may register as overweight due to muscle mass. It also does not account for fat distribution, which is an important health risk factor.' },
      ],
    },
    {
      title: 'Beyond BMI: Better Health Metrics',
      content: 'For a more complete picture of health, consider combining BMI with other measurements like waist circumference, body fat percentage, and blood markers.',
      subsections: [
        { heading: 'Waist Circumference', text: 'A waist measurement greater than 40 inches (men) or 35 inches (women) indicates increased health risk, even if BMI is in the normal range.' },
        { heading: 'Waist-to-Hip Ratio', text: 'Dividing waist circumference by hip circumference provides insight into fat distribution. Ratios above 0.90 (men) or 0.85 (women) suggest higher cardiovascular risk.' },
      ],
    },
  ],
  'savings-calculator': [
    {
      title: 'Building Wealth Through Consistent Saving',
      content: 'Regular saving, even in small amounts, builds a financial foundation over time. The key factors are how much you save, how consistently you save, and what return your savings earn.',
      subsections: [
        { heading: 'Emergency Fund First', text: 'Before focusing on growth, build an emergency fund covering 3-6 months of essential expenses. This safety net prevents you from dipping into long-term savings when unexpected costs arise.' },
        { heading: 'Automatic Transfers', text: 'Setting up automatic transfers on payday removes the temptation to spend before saving. Even 10% of income can compound into a significant balance over time.' },
      ],
    },
    {
      title: 'High-Yield Savings vs. Traditional',
      content: 'The interest rate on your savings account directly impacts growth. Online banks typically offer significantly higher rates than traditional brick-and-mortar institutions.',
      subsections: [
        { heading: 'Inflation Considerations', text: 'If your savings rate is lower than inflation, your purchasing power decreases over time. A savings calculator helps you see whether your money is growing in real terms.' },
      ],
    },
  ],
}

export default articles
