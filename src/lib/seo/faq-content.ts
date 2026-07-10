export const FAQ_CONTENT: Record<string, { question: string; answer: string }[]> = {
  'bmi-calculator': [
    { question: 'What is a healthy BMI range?', answer: 'A BMI between 18.5 and 24.9 is considered healthy for most adults. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese.' },
    { question: 'Is BMI accurate for athletes?', answer: 'No. BMI does not distinguish muscle from fat. Athletes with high muscle mass may show a "high" BMI despite low body fat.' },
    { question: 'Does BMI differ by age or sex?', answer: 'The standard BMI formula is the same, but interpretation varies. Older adults may have healthy BMIs slightly higher, and women naturally carry more body fat than men.' },
    { question: 'Should children use the same BMI categories?', answer: 'No. Children and teens use age- and sex-specific BMI percentiles rather than the adult cutoffs, because body fat changes with growth.' },
  ],
  'calorie-calculator': [
    { question: 'How accurate are calorie calculators?', answer: 'They are estimates accurate within roughly 10-20% because metabolism varies by genetics, body composition, and health. Use the result as a starting point and adjust based on real outcomes.' },
    { question: 'What is the difference between BMR and TDEE?', answer: 'BMR is the calories you burn at complete rest; TDEE adds activity, digestion, and exercise. TDEE is what you actually burn in a day and is the number to use for weight goals.' },
    { question: 'How big a deficit should I run to lose weight?', answer: 'A deficit of 300-500 kcal/day is generally sustainable and safe, producing about 0.5-1 lb of loss per week without excessive muscle loss.' },
  ],
  'mortgage-calculator': [
    { question: 'What is included in my monthly mortgage payment?', answer: 'The calculator shows principal and interest (P&I). Your real payment also usually includes property taxes, homeowners insurance, and possibly PMI or HOA dues.' },
    { question: 'Should I choose a 15- or 30-year mortgage?', answer: 'A 15-year term saves large amounts of interest but costs more per month. A 30-year term lowers the payment but costs more overall. Choose based on your budget and goals.' },
    { question: 'How much does a 0.25% rate change matter?', answer: 'On a $300,000 loan it can change the monthly payment by roughly $40-50 and total interest by tens of thousands over the full term.' },
  ],
  'loan-calculator': [
    { question: 'What is the difference between interest rate and APR?', answer: 'The interest rate is the cost of borrowing the principal; APR adds lender fees and closing costs, giving a fuller picture of total loan cost.' },
    { question: 'Can I pay off my loan early to save interest?', answer: 'Usually yes. Extra principal payments reduce the balance and future interest, but check whether your loan has a prepayment penalty first.' },
    { question: 'Why does my first payment include mostly interest?', answer: 'Amortization front-loads interest. Early payments apply little to principal; that ratio shifts toward principal over time.' },
  ],
  'compound-interest-calculator': [
    { question: 'What does "compounded daily" mean?', answer: 'Interest is calculated and added to the balance every day, so the next day’s interest is earned on a slightly larger balance. More frequent compounding yields more over time.' },
    { question: 'What is the Rule of 72?', answer: 'Divide 72 by your annual return rate to estimate how many years it takes your money to double. At 8%, money doubles about every 9 years.' },
    { question: 'Is compound interest guaranteed?', answer: 'No. It depends on the assumed return, which varies with the market. Treat projections as estimates, not promises.' },
  ],
  'retirement-calculator': [
    { question: 'How much should I save for retirement?', answer: 'A common guideline is 15% of pre-tax income including any employer match, aiming for 10-12× your final salary by retirement age.' },
    { question: 'What is the 4% rule?', answer: 'It suggests you can withdraw about 4% of your nest egg in the first year of retirement, adjusting for inflation, with low risk of running out over 30 years.' },
    { question: 'Does delaying Social Security help?', answer: 'Yes. Claiming at 70 instead of 62 can increase monthly benefits by up to about 32%, which helps longevity risk.' },
  ],
  'age-calculator': [
    { question: 'How is age calculated precisely?', answer: 'Age is computed as the difference between today’s date and your birth date, expressed in completed years, months, and days.' },
    { question: 'Why does my age change on my birthday?', answer: 'Your completed years increase only on the anniversary of your birth date; before that you are still in the prior year.' },
  ],
  'percentage-calculator': [
    { question: 'What is the difference between percent of and percent change?', answer: '"Percent of" multiplies a base by a percentage (45 is 25% of 180). "Percent change" compares an old and new value: (new−old)/old×100.' },
    { question: 'How do I add a percentage to a number?', answer: 'Multiply by (1 + percent/100). Adding 8% to 120 gives 120 × 1.08 = 129.60.' },
  ],
  'gpa-calculator': [
    { question: 'How is GPA weighted by credits?', answer: 'Each grade’s points are multiplied by its credit hours, summed, then divided by total credit hours so harder courses count more.' },
    { question: 'Do pass/fail courses affect GPA?', answer: 'Typically they appear on the transcript but carry zero grade points, so they do not change the GPA average.' },
  ],
  'grade-calculator': [
    { question: 'How do weighted categories work?', answer: 'Each category score is multiplied by its weight (as a decimal) and the products are summed. Weights should total 100%.' },
    { question: 'Can I find the score I need on a final?', answer: 'Yes. Set the desired final grade and solve backward for the missing category using its weight.' },
  ],
  'tip-calculator': [
    { question: 'How much should I tip?', answer: 'In the US, 15-20% is standard for sit-down restaurants, with 18% common for good service. Larger groups may have an automatic gratuity.' },
    { question: 'Should I tip on the pre-tax amount?', answer: 'Customs vary; many people tip on the pre-tax subtotal, but some tip on the total. Either is acceptable as long as you are consistent.' },
  ],
  'tax-calculator': [
    { question: 'What is the difference between sales tax and VAT?', answer: 'Sales tax is added on top of the price at checkout; VAT is generally included in the displayed price and collected at each production stage.' },
    { question: 'Why does my effective tax rate differ from my bracket?', answer: 'Only the income within each bracket is taxed at that rate. Your effective rate is total tax divided by total income, which is lower than the top marginal rate.' },
  ],
  'salary-calculator': [
    { question: 'How do I convert hourly to salary?', answer: 'Multiply the hourly rate by 2,080 (40 hours × 52 weeks) for a full-time annual salary before taxes and deductions.' },
    { question: 'Is overtime included automatically?', answer: 'No. Overtime at 1.5× is separate; add it using an overtime calculator if your role qualifies.' },
  ],
  'bmr-calculator': [
    { question: 'Which BMR formula is best?', answer: 'The Mifflin-St Jeor equation is widely used and tends to be more accurate than the older Harris-Benedict formula for most people.' },
    { question: 'Why is my BMR lower than expected?', answer: 'BMR depends on weight, height, age, and sex; it naturally declines with age and very low body weight, and muscle raises it.' },
  ],
  'tdee-calculator': [
    { question: 'What PAL should I pick?', answer: 'Use sedentary (1.2) for little exercise, light (1.375) for 1-3 days/week, moderate (1.55) for 3-5 days, active (1.725) for 6-7 days, and very active (1.9) for physical jobs or twice-daily training.' },
    { question: 'Does TDEE include exercise calories?', answer: 'The PAL multiplier already bakes in typical activity. If you add a separate workout estimate on top, you may double-count and overshoot your needs.' },
  ],
  'pregnancy-calculator': [
    { question: 'How is pregnancy counted from conception?', answer: 'Clinically, pregnancy is counted from the LMP, about two weeks before conception, so "4 weeks pregnant" usually means ~2 weeks since fertilization.' },
    { question: 'How accurate is the due date?', answer: 'Only about 5% of babies arrive exactly on the due date; most are born within two weeks before or after.' },
  ],
  'due-date-calculator': [
    { question: 'What is Naegele’s Rule?', answer: 'It estimates the due date as the first day of the last menstrual period plus 280 days (40 weeks), assuming a 28-day cycle.' },
    { question: 'Do irregular cycles change the due date?', answer: 'Yes. For cycles much longer or shorter than 28 days, an ultrasound or ovulation-based date may be more accurate.' },
  ],
  'body-fat-calculator': [
    { question: 'Is the Navy circumference method accurate?', answer: 'It is a reasonable estimate for most people but less precise than DEXA or hydrostatic weighing; hydration and measurement technique affect results.' },
    { question: 'What is a healthy body fat range?', answer: 'For men, about 10-20% is fit; for women, about 18-28%. Essential fat is lower, and very high values carry health risks.' },
  ],
  'fuel-cost-calculator': [
    { question: 'Why does my real cost differ from the estimate?', answer: 'EPA efficiency ratings are optimistic versus real driving; traffic, weather, and load raise consumption above the estimate.' },
    { question: 'Should I include round trips?', answer: 'Yes, if you are budgeting a return journey, double the one-way distance or enter the full round-trip miles.' },
  ],
  'standard-deviation-calculator': [
    { question: 'When do I use sample vs population standard deviation?', answer: 'Use population (divide by N) when you have every data point; use sample (divide by N−1) when your data is a subset estimating a larger group.' },
    { question: 'What does a high standard deviation mean?', answer: 'It means the data is spread far from the mean and is more variable; a low value means the data clusters tightly around the mean.' },
  ],
}

export function getFAQs(slug: string): { question: string; answer: string }[] {
  return FAQ_CONTENT[slug] || []
}
