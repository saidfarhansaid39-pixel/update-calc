export interface AIExplanation {
  summary: string
  whatItMeans: string
  whyItMatters: string
  whatAffectsIt: string[]
  howToImprove: string[]
  detailedSections: { title: string; content: string }[]
}

const financialExplanations: Record<string, (val: number, inputs: Record<string, number>) => AIExplanation> = {
  'loan': (val, inputs) => ({
    summary: `Your monthly payment is $${val.toFixed(2)} over ${inputs.term || 0} months`,
    whatItMeans: `At ${(inputs.rate || 0).toFixed(1)}% APR, you'll pay $${val.toFixed(2)} monthly for ${inputs.term || 0} months. Total cost: $${(val * (inputs.term || 1)).toFixed(2)}.`,
    whyItMatters: 'Your monthly payment affects your debt-to-income ratio and determines how much house or car you can afford.',
    whatAffectsIt: ['Interest rate: ±1% changes payment by ~$${(val * 0.01 * (inputs.term || 1) / 12).toFixed(2)}', 'Loan term: longer terms mean lower payments but more interest', 'Down payment: larger down payment reduces principal and payment'],
    howToImprove: ['Improve credit score to get a better rate', 'Consider a shorter term to build equity faster', 'Increase down payment to reduce principal'],
    detailedSections: [
      { title: 'How interest compounds', content: `At ${(inputs.rate || 0).toFixed(1)}% APR, interest accrues monthly on the outstanding balance. Early payments go mostly to interest; later payments go mostly to principal.` },
      { title: 'Total interest analysis', content: `Over ${inputs.term || 0} months, you'll pay $${Math.max(0, (val * (inputs.term || 1) - (inputs.principal || 0))).toFixed(2)} in interest — ${inputs.principal ? ((val * (inputs.term || 1) - inputs.principal) / inputs.principal * 100).toFixed(1) : 0}% of your principal.` },
    ],
  }),
  'investment': (val, inputs) => ({
    summary: `Your investment could grow to $${val.toFixed(2)}`,
    whatItMeans: `Starting with $${(inputs.initial || 0).toFixed(0)}, adding $${(inputs.monthly || 0).toFixed(0)}/month at ${(inputs.rate || 0).toFixed(1)}% return over ${inputs.years || 0} years.`,
    whyItMatters: 'Compound growth turns consistent saving into significant wealth. Time is your biggest advantage in investing.',
    whatAffectsIt: ['Rate of return: the biggest driver of long-term growth', 'Time horizon: more years = more compounding', 'Monthly contribution: consistency matters more than lump sums'],
    howToImprove: ['Increase monthly contributions by even $50/month', 'Consider index funds for reliable long-term returns', 'Reinvest dividends to maximize compound growth'],
    detailedSections: [
      { title: 'The power of compounding', content: `At ${(inputs.rate || 0).toFixed(1)}% annual return, your money doubles approximately every ${(72 / (inputs.rate || 7)).toFixed(0)} years (Rule of 72).` },
      { title: 'Tax considerations', content: 'Consider tax-advantaged accounts (401k, IRA) to maximize net returns. Capital gains taxes can reduce effective returns by 15-20%.' },
    ],
  }),
  'mortgage': (val, inputs) => ({
    summary: `Monthly mortgage payment: $${val.toFixed(2)}`,
    whatItMeans: `On a $${(inputs.homePrice || 0).toFixed(0)} home with ${(inputs.downPayment || 0) > 0 ? ((inputs.downPayment || 0) / (inputs.homePrice || 1) * 100).toFixed(0) : 0}% down at ${(inputs.rate || 0).toFixed(1)}% for ${inputs.term || 30} years.`,
    whyItMatters: 'Your mortgage is likely your largest monthly expense. Getting the right terms saves thousands over the life of the loan.',
    whatAffectsIt: ['Interest rate: even 0.5% can save $10,000s over 30 years', 'Down payment: 20%+ eliminates PMI', 'Credit score: 760+ gets the best rates'],
    howToImprove: ['Shop multiple lenders to compare rates', 'Consider buying points to lower your rate', 'Make bi-weekly payments to reduce interest'],
    detailedSections: [
      { title: 'Amortization schedule', content: `In the first year, approximately ${((inputs.rate || 0.07) * 0.8 * 100).toFixed(0)}% of payments go to interest. By year ${inputs.term || 30}, that drops to under 10%.` },
      { title: 'PMI considerations', content: (inputs.downPayment || 0) < (inputs.homePrice || 0) * 0.2 ? 'With less than 20% down, you\'ll pay PMI (~0.5-1% of loan value annually) until you reach 20% equity.' : 'With 20%+ down, you avoid PMI entirely — saving $100-300/month.' },
    ],
  }),
  'retirement': (val, inputs) => ({
    summary: `Retirement savings: $${val.toFixed(2)}`,
    whatItMeans: `Saving $${(inputs.monthly || 500).toFixed(0)}/month from age ${inputs.age || 30} to ${inputs.retirementAge || 65} at ${(inputs.rate || 0.07) * 100}% return.`,
    whyItMatters: 'A comfortable retirement requires decades of planning. The 4% rule suggests you can withdraw ~$${(val * 0.04).toFixed(0)}/year.',
    whatAffectsIt: ['Savings rate: each 1% more saved = significant increase', 'Investment return: 1% higher return can mean 30% more at retirement', 'Retirement age: working 3 more years can increase savings 25%'],
    howToImprove: ['Max out employer 401k match (free money)', 'Open a Roth IRA for tax-free growth', 'Delay Social Security to 70 for higher benefits'],
    detailedSections: [
      { title: '4% rule analysis', content: `At $${val.toFixed(0)} saved, the 4% rule suggests $${(val * 0.04).toFixed(0)}/year or $${(val * 0.04 / 12).toFixed(0)}/month in retirement. Adjust based on your expected lifestyle.` },
      { title: 'Inflation impact', content: 'At 3% inflation, $1 today is worth ~$0.48 in 25 years. Factor inflation into your retirement target.' },
    ],
  }),
}

const healthExplanations: Record<string, (val: number, inputs: Record<string, number>) => AIExplanation> = {
  'bmi': (val, inputs) => {
    const category = val < 18.5 ? 'Underweight' : val < 25 ? 'Normal weight' : val < 30 ? 'Overweight' : 'Obese'
    return {
      summary: `Your BMI is ${val.toFixed(1)} — ${category}`,
      whatItMeans: `At ${(inputs.weight || 70).toFixed(0)} kg and ${(inputs.height || 1.7).toFixed(2)} m, your BMI falls in the ${category} range. Healthy range is 18.5-24.9.`,
      whyItMatters: 'BMI correlates with health risks. Higher BMI increases risk of heart disease, diabetes, and joint problems. Lower BMI may indicate nutritional concerns.',
      whatAffectsIt: ['Body composition: athletes may have high BMI but low body fat', 'Age: BMI standards are same for all adults', 'Gender: women typically have higher body fat at same BMI'],
      howToImprove: ['Combine cardio and strength training for optimal body composition', 'Focus on whole foods and portion control', 'Aim for 7-9 hours of quality sleep per night'],
      detailedSections: [
        { title: 'BMI limitations', content: 'BMI doesn\'t distinguish muscle from fat. A muscular person may have "overweight" BMI but be perfectly healthy. Use waist circumference and body fat % for a fuller picture.' },
        { title: 'Health risk association', content: `At BMI ${val.toFixed(1)}, your relative risk for cardiovascular disease is ${val < 25 ? 'near baseline' : val < 30 ? '1.5-2x higher' : '3x+ higher'} compared to normal weight.` },
      ],
    }
  },
  'calorie': (val, inputs) => ({
    summary: `Daily calorie needs: ${val.toFixed(0)} kcal`,
    whatItMeans: `Based on your metrics, your body burns approximately ${val.toFixed(0)} calories per day at your current activity level.`,
    whyItMatters: 'Calories in vs calories out determines weight change. A deficit of 3500 kcal ≈ 1 lb of fat loss.',
    whatAffectsIt: ['Activity level: intense exercise can add 300-600 kcal to daily needs', 'Muscle mass: more muscle = higher resting metabolism', 'Age: metabolism slows ~1-2% per decade after 30'],
    howToImprove: ['Strength training builds muscle that burns more calories at rest', 'High-protein diets increase thermic effect of food by 20-30%', 'NEAT (non-exercise activity) can add 200-500 kcal daily burn'],
    detailedSections: [
      { title: 'Weight loss strategy', content: `For 0.5 kg/week loss, aim for ${(val - 500).toFixed(0)} kcal/day. For 1 kg/week, aim for ${(val - 1000).toFixed(0)} kcal/day (minimum ${Math.max(1200, val - 1000).toFixed(0)} for safety).` },
      { title: 'Macronutrient breakdown', content: 'Recommended: 45-65% carbs, 20-35% fat, 10-35% protein. At 2000 kcal: 225-325g carbs, 44-78g fat, 50-175g protein.' },
    ],
  }),
}

const generalExplanations: Record<string, (val: number, inputs: Record<string, number>, category: string) => AIExplanation> = {
  default: (val, inputs, category) => ({
    summary: `Result: ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
    whatItMeans: `Your calculation yielded a value of ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} based on the provided inputs.`,
    whyItMatters: `This ${category} calculation helps you make informed decisions. Understanding your result is the first step to taking action.`,
    whatAffectsIt: ['Input accuracy: small errors can compound significantly', 'Underlying assumptions: different models give different results', 'Context: your specific situation may differ from standard assumptions'],
    howToImprove: ['Double-check all inputs for accuracy', 'Run multiple scenarios to understand the range of outcomes', 'Consult domain-specific resources for deeper understanding'],
    detailedSections: [
      { title: 'How this is calculated', content: 'This result uses standard formulas and methodologies appropriate for this type of calculation. Results are estimates and should be verified for critical decisions.' },
      { title: 'Next steps', content: 'Consider how this result fits into your broader goals. Use the comparison feature to explore different scenarios and find the best option for your situation.' },
    ],
  }),
}

export function generateAIExplanation(
  category: string,
  calcType: string,
  mainValue: number,
  inputs: Record<string, number>,
): AIExplanation {
  if (category === 'financial' && financialExplanations[calcType]) {
    return financialExplanations[calcType](mainValue, inputs)
  }
  if (category === 'health' && healthExplanations[calcType]) {
    return healthExplanations[calcType](mainValue, inputs)
  }
  return generalExplanations.default(mainValue, inputs, category)
}
